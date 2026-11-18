/**
 * Environment-agnostic image pipeline. Runs inside a Web Worker (OffscreenCanvas)
 * or on the main thread (HTMLCanvasElement) with identical output.
 */
import { ImageProcessingConfig } from '../types';
import { setJpegDpi } from './jpegDpi';

type AnyCanvas = OffscreenCanvas | HTMLCanvasElement;
type Ctx2D = OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D;

export interface PipelineEnv {
  createCanvas(w: number, h: number): AnyCanvas;
  encode(canvas: AnyCanvas, mime: string, quality?: number): Promise<Blob>;
}

export interface PipelineResult {
  blob: Blob;
  width: number;
  height: number;
  /** JPEG/WebP quality actually used (0–1), if applicable */
  quality?: number;
  /** True when the KB window could not be met even at the extremes */
  sizeUnmet?: 'over' | 'under';
}

export function mimeFor(fmt: string): string {
  if (fmt === 'png') return 'image/png';
  if (fmt === 'webp') return 'image/webp';
  return 'image/jpeg'; // jpg, and the JPEG embedded in a PDF
}

export function calculateOutputDimensions(
  origW: number,
  origH: number,
  config: Pick<ImageProcessingConfig, 'resizeMode' | 'exactWidth' | 'exactHeight' | 'scalePercent' | 'longestSide' | 'shortestSide' | 'aspectRatioPreset'>
): { targetW: number; targetH: number } {
  let targetW = origW;
  let targetH = origH;

  switch (config.resizeMode) {
    case 'pixels':
      targetW = config.exactWidth > 0 ? config.exactWidth : origW;
      targetH = config.exactHeight > 0 ? config.exactHeight : origH;
      break;
    case 'percent': {
      const p = Math.max(1, config.scalePercent || 100) / 100;
      targetW = origW * p;
      targetH = origH * p;
      break;
    }
    case 'longest': {
      const s = (config.longestSide || Math.max(origW, origH)) / Math.max(origW, origH);
      targetW = origW * s;
      targetH = origH * s;
      break;
    }
    case 'shortest': {
      const s = (config.shortestSide || Math.min(origW, origH)) / Math.min(origW, origH);
      targetW = origW * s;
      targetH = origH * s;
      break;
    }
    case 'ratio':
      if (config.aspectRatioPreset && config.aspectRatioPreset !== 'free') {
        const [rW, rH] = config.aspectRatioPreset.split(':').map(Number);
        if (rW && rH) {
          targetW = config.exactWidth || origW;
          targetH = targetW / (rW / rH);
        }
      }
      break;
  }

  return {
    targetW: Math.max(1, Math.min(12000, Math.round(targetW))),
    targetH: Math.max(1, Math.min(12000, Math.round(targetH))),
  };
}

/** Source rectangle for cover-cropping: centred horizontally, biased slightly upward (keeps heads in frame). */
function coverRect(sw: number, sh: number, tw: number, th: number) {
  const srcRatio = sw / sh;
  const dstRatio = tw / th;
  if (Math.abs(srcRatio - dstRatio) < 0.001) return { sx: 0, sy: 0, sw, sh };
  if (srcRatio > dstRatio) {
    const cw = sh * dstRatio;
    return { sx: (sw - cw) / 2, sy: 0, sw: cw, sh };
  }
  const ch = sw / dstRatio;
  return { sx: 0, sy: (sh - ch) * 0.4, sw, sh: ch };
}

function ctxOf(c: AnyCanvas): Ctx2D {
  const ctx = c.getContext('2d') as Ctx2D | null;
  if (!ctx) throw new Error('Canvas 2D context unavailable');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  return ctx;
}

/**
 * Draw `src` (rect sx,sy,sw,sh) into a w×h region, halving in steps when shrinking by more than 2×.
 * Stepwise downscaling avoids the aliasing/moiré of a single large reduction.
 */
function drawResampled(
  env: PipelineEnv,
  src: CanvasImageSource,
  rect: { sx: number; sy: number; sw: number; sh: number },
  w: number,
  h: number
): AnyCanvas {
  let cur: CanvasImageSource = src;
  let { sx, sy, sw, sh } = rect;

  while (sw >= 2 * w && sh >= 2 * h) {
    const nw = Math.max(w, Math.round(sw / 2));
    const nh = Math.max(h, Math.round(sh / 2));
    const step = env.createCanvas(nw, nh);
    ctxOf(step).drawImage(cur, sx, sy, sw, sh, 0, 0, nw, nh);
    cur = step as CanvasImageSource;
    sx = 0;
    sy = 0;
    sw = nw;
    sh = nh;
  }

  const out = env.createCanvas(w, h);
  ctxOf(out).drawImage(cur, sx, sy, sw, sh, 0, 0, w, h);
  return out;
}

/** Build the final pixel canvas (resize, crop/fit, background, colour). */
export function renderCanvas(
  env: PipelineEnv,
  src: CanvasImageSource,
  srcW: number,
  srcH: number,
  config: ImageProcessingConfig
): AnyCanvas {
  const { targetW, targetH } = calculateOutputDimensions(srcW, srcH, config);
  const fit = config.resizeMode === 'pixels' || config.resizeMode === 'ratio' ? config.fit ?? 'cover' : 'stretch';
  const needsBg = config.targetFormat !== 'png' && config.targetFormat !== 'webp' ? true : !!config.backgroundFill;
  const bg = config.backgroundFill || '#FFFFFF';

  let canvas: AnyCanvas;

  if (fit === 'contain') {
    const s = Math.min(targetW / srcW, targetH / srcH);
    const dw = Math.max(1, Math.round(srcW * s));
    const dh = Math.max(1, Math.round(srcH * s));
    const inner = drawResampled(env, src, { sx: 0, sy: 0, sw: srcW, sh: srcH }, dw, dh);
    canvas = env.createCanvas(targetW, targetH);
    const ctx = ctxOf(canvas);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, targetW, targetH);
    ctx.drawImage(inner as CanvasImageSource, Math.round((targetW - dw) / 2), Math.round((targetH - dh) / 2));
  } else {
    const rect = fit === 'cover' ? coverRect(srcW, srcH, targetW, targetH) : { sx: 0, sy: 0, sw: srcW, sh: srcH };
    const drawn = drawResampled(env, src, rect, targetW, targetH);
    if (needsBg) {
      canvas = env.createCanvas(targetW, targetH);
      const ctx = ctxOf(canvas);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, targetW, targetH);
      ctx.drawImage(drawn as CanvasImageSource, 0, 0);
    } else {
      canvas = drawn;
    }
  }

  if (config.colorMode === 'grayscale' || config.colorMode === 'bw') {
    const ctx = ctxOf(canvas);
    const img = ctx.getImageData(0, 0, targetW, targetH);
    const d = img.data;
    const bw = config.colorMode === 'bw';
    for (let i = 0; i < d.length; i += 4) {
      let g = (d[i] * 299 + d[i + 1] * 587 + d[i + 2] * 114) / 1000;
      if (bw) g = g >= 140 ? 255 : 0;
      d[i] = d[i + 1] = d[i + 2] = g;
    }
    ctx.putImageData(img, 0, 0);
  }

  return canvas;
}

/**
 * Encode with the highest quality whose size fits the [minKB, maxKB] window.
 * Binary search on quality: ~7 encodes instead of a linear sweep.
 * Falls back to shrinking pixels only if even minimum quality is too large.
 */
async function encodeToWindow(
  env: PipelineEnv,
  canvas: AnyCanvas,
  mime: string,
  maxKB: number,
  minKB: number | undefined,
  render: (scale: number) => AnyCanvas
): Promise<PipelineResult> {
  const maxBytes = maxKB * 1024 - 24; // headroom for the DPI header
  const minBytes = minKB ? minKB * 1024 : 0;

  const search = async (c: AnyCanvas) => {
    let lo = 0.05;
    let hi = 0.95;
    let best: { blob: Blob; q: number } | null = null;

    const top = await env.encode(c, mime, hi);
    if (top.size <= maxBytes) return { best: { blob: top, q: hi }, lowest: null as Blob | null };

    let lowest: Blob | null = null;
    for (let i = 0; i < 7; i++) {
      const q = (lo + hi) / 2;
      const blob = await env.encode(c, mime, q);
      if (blob.size <= maxBytes) {
        best = { blob, q };
        lo = q;
      } else {
        lowest = blob;
        hi = q;
      }
      if (hi - lo < 0.02) break;
    }
    if (!best) {
      const floor = await env.encode(c, mime, 0.05);
      if (floor.size <= maxBytes) best = { blob: floor, q: 0.05 };
      else lowest = floor;
    }
    return { best, lowest };
  };

  let { best, lowest } = await search(canvas);

  // Still too large at minimum quality: reduce pixel count proportionally and retry
  let scale = 1;
  for (let attempt = 0; !best && attempt < 4; attempt++) {
    const ratio = lowest ? maxBytes / lowest.size : 0.7;
    scale *= Math.max(0.35, Math.min(0.92, Math.sqrt(ratio) * 0.95));
    canvas = render(scale);
    ({ best, lowest } = await search(canvas));
  }

  if (!best) {
    const blob = await env.encode(canvas, mime, 0.05);
    return { blob, width: canvas.width, height: canvas.height, quality: 0.05, sizeUnmet: 'over' };
  }

  // Under the minimum even at top quality: try maximum quality
  if (minBytes && best.blob.size < minBytes) {
    const max = await env.encode(canvas, mime, 1);
    if (max.size <= maxBytes) best = { blob: max, q: 1 };
    return {
      blob: best.blob,
      width: canvas.width,
      height: canvas.height,
      quality: best.q,
      sizeUnmet: best.blob.size < minBytes ? 'under' : undefined,
    };
  }

  return { blob: best.blob, width: canvas.width, height: canvas.height, quality: best.q };
}

export async function runPipeline(
  env: PipelineEnv,
  src: CanvasImageSource,
  srcW: number,
  srcH: number,
  config: ImageProcessingConfig
): Promise<PipelineResult> {
  const canvas = renderCanvas(env, src, srcW, srcH, config);
  const fmt = config.targetFormat;
  const mime = mimeFor(fmt);

  let result: PipelineResult;

  if (fmt === 'pdf') {
    // PDF wrapping happens on the main thread; deliver a high-quality JPEG here
    result = { blob: await env.encode(canvas, 'image/jpeg', 0.92), width: canvas.width, height: canvas.height, quality: 0.92 };
  } else if (config.targetSizeKB && config.targetSizeKB > 0 && fmt !== 'png') {
    const reRender = (scale: number) =>
      renderCanvas(env, src, srcW, srcH, {
        ...config,
        resizeMode: 'pixels',
        exactWidth: Math.max(16, Math.round(canvas.width * scale)),
        exactHeight: Math.max(16, Math.round(canvas.height * scale)),
      });
    result = await encodeToWindow(env, canvas, mime, config.targetSizeKB, config.minSizeKB, reRender);
  } else {
    const q = fmt === 'png' ? undefined : Math.max(0.05, Math.min(1, config.quality / 100));
    result = { blob: await env.encode(canvas, mime, q), width: canvas.width, height: canvas.height, quality: q };
  }

  if (mime === 'image/jpeg' && fmt !== 'pdf' && config.dpi > 0) {
    result.blob = await setJpegDpi(result.blob, config.dpi);
  }
  return result;
}
