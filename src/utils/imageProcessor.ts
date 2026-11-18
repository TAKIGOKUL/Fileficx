import { ImageProcessingConfig, ProcessingMetadata } from '../types';
import { runPipeline, PipelineEnv, PipelineResult } from './imagePipeline';
import { readJpegDpi } from './jpegDpi';

export { formatFileSize } from './format';
export { calculateOutputDimensions } from './imagePipeline';
export { setJpegDpi } from './jpegDpi';

export interface ImageAnalysis {
  width: number;
  height: number;
  colorMode: string;
  dpi?: number;
}

const isTiff = (f: File) => /\.tiff?$/i.test(f.name) || /tiff/i.test(f.type);
const isSvg = (f: File) => /\.svg$/i.test(f.name) || /svg/i.test(f.type);
/** Formats the worker can't decode (no createImageBitmap support) are handled on the main thread. */
const needsMainThread = (f: File) => isTiff(f) || isSvg(f);

const isHeic = (f: File) => /\.(heic|heif)$/i.test(f.name) || /hei[cf]/i.test(f.type);

const friendlyError = (file: File, err: unknown): Error => {
  if (isHeic(file)) {
    return new Error('This browser cannot open HEIC photos. On iPhone, set Camera → Formats → "Most Compatible", or open the file in Safari.');
  }
  return err instanceof Error ? err : new Error('Could not read this image.');
};

async function decodeTiff(file: File) {
  const mod = await import('utif2');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const UTIF: typeof import('utif2') = (mod as any).default ?? mod;
  const buf = await file.arrayBuffer();
  const ifds = UTIF.decode(buf);
  if (!ifds.length) throw new Error('This TIFF file has no images.');
  UTIF.decodeImage(buf, ifds[0]); // first page
  const { width: w, height: h } = ifds[0];
  const rgba = UTIF.toRGBA8(ifds[0]);
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  c.getContext('2d')!.putImageData(new ImageData(Uint8ClampedArray.from(rgba), w, h), 0, 0);
  return { src: c as CanvasImageSource, w, h, close: () => {} };
}

async function decode(file: File): Promise<{ src: CanvasImageSource; w: number; h: number; close: () => void }> {
  if (isTiff(file)) return decodeTiff(file);
  if (typeof createImageBitmap === 'function' && !isSvg(file)) {
    const bmp = await createImageBitmap(file);
    return { src: bmp, w: bmp.width, h: bmp.height, close: () => bmp.close() };
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
    await img.decode();
    // SVGs without explicit size report 0×0; give them a sensible raster size
    const w = img.naturalWidth || 1024;
    const h = img.naturalHeight || Math.round(w * 0.75);
    if (!img.naturalWidth) {
      img.width = w;
      img.height = h;
    }
    return { src: img, w, h, close: () => {} };
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Single decode: dimensions, rough colour mode (from a 64px sample) and stored JPEG DPI. */
export async function getImageDimensions(file: File): Promise<ImageAnalysis> {
  let d;
  try {
    d = await decode(file);
  } catch (err) {
    throw friendlyError(file, err);
  }
  let colorMode = 'RGB';
  try {
    const s = 64;
    const c = document.createElement('canvas');
    c.width = c.height = s;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    if (ctx) {
      ctx.drawImage(d.src, 0, 0, s, s);
      const px = ctx.getImageData(0, 0, s, s).data;
      let gray = true;
      for (let i = 0; i < px.length; i += 16) {
        if (Math.abs(px[i] - px[i + 1]) > 8 || Math.abs(px[i] - px[i + 2]) > 8) {
          gray = false;
          break;
        }
      }
      if (gray) colorMode = 'Grayscale';
    }
  } catch {
    /* colour sniffing is best-effort */
  }
  const result = { width: d.w, height: d.h, colorMode, dpi: await readJpegDpi(file).catch(() => undefined) };
  d.close();
  return result;
}

/* ───────── Worker management ───────── */

type WorkerReply =
  | { id: number; ok: true; blob: Blob; width: number; height: number; quality?: number; sizeUnmet?: 'over' | 'under'; srcW: number; srcH: number; ms: number }
  | { id: number; ok: false; error: string };

let worker: Worker | null = null;
let workerBroken = false;
let seq = 0;
const pending = new Map<number, (r: WorkerReply) => void>();

const workerSupported = () =>
  !workerBroken && typeof Worker !== 'undefined' && typeof OffscreenCanvas !== 'undefined' && typeof createImageBitmap === 'function';

function getWorker(): Worker | null {
  if (!workerSupported()) return null;
  if (!worker) {
    try {
      worker = new Worker(new URL('./imageWorker.ts', import.meta.url), { type: 'module' });
      worker.onmessage = (e: MessageEvent<WorkerReply>) => {
        pending.get(e.data.id)?.(e.data);
        pending.delete(e.data.id);
      };
      worker.onerror = () => {
        workerBroken = true;
        pending.forEach((cb, id) => cb({ id, ok: false, error: 'worker crashed' }));
        pending.clear();
        worker?.terminate();
        worker = null;
      };
    } catch {
      workerBroken = true;
      return null;
    }
  }
  return worker;
}

const mainEnv: PipelineEnv = {
  createCanvas: (w, h) => {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return c;
  },
  encode: (c, type, quality) =>
    new Promise((res, rej) => (c as HTMLCanvasElement).toBlob((b) => (b ? res(b) : rej(new Error('Encoding failed'))), type, quality)),
};

async function runOnMainThread(file: File, config: ImageProcessingConfig) {
  const d = await decode(file);
  try {
    const r = await runPipeline(mainEnv, d.src, d.w, d.h, config);
    return { ...r, srcW: d.w, srcH: d.h };
  } finally {
    d.close();
  }
}

async function run(file: File, config: ImageProcessingConfig): Promise<PipelineResult & { srcW: number; srcH: number }> {
  const w = needsMainThread(file) ? null : getWorker();
  if (w) {
    const id = ++seq;
    const reply = await new Promise<WorkerReply>((resolve) => {
      pending.set(id, resolve);
      w.postMessage({ id, file, config });
    });
    if (reply.ok) return reply;
    // Fall through to the main thread (e.g. a codec OffscreenCanvas lacks in this browser)
  }
  return runOnMainThread(file, config);
}

async function wrapJpegInPdf(jpeg: Blob, w: number, h: number, dpi: number): Promise<Blob> {
  const { PDFDocument } = await import('pdf-lib');
  const doc = await PDFDocument.create();
  const pw = (w / dpi) * 72;
  const ph = (h / dpi) * 72;
  const page = doc.addPage([pw, ph]);
  const img = await doc.embedJpg(await jpeg.arrayBuffer());
  page.drawImage(img, { x: 0, y: 0, width: pw, height: ph });
  const bytes = await doc.save({ useObjectStreams: true });
  return new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

export async function processImage(file: File, config: ImageProcessingConfig): Promise<ProcessingMetadata> {
  const t0 = performance.now();
  let r;
  try {
    r = await run(file, config);
  } catch (err) {
    throw friendlyError(file, err);
  }

  let blob = r.blob;
  if (config.targetFormat === 'pdf') blob = await wrapJpegInPdf(blob, r.width, r.height, config.dpi || 200);

  const ext = config.targetFormat === 'jpg' ? 'jpg' : config.targetFormat;
  const base = file.name.replace(/\.[^.]+$/, '') || 'file';
  const kb = Math.round(blob.size / 1024);

  return {
    originalName: file.name,
    originalSize: file.size,
    originalDimensions: { width: r.srcW, height: r.srcH },
    originalFormat: file.type || 'image',
    processedBlob: blob,
    processedSize: blob.size,
    processedDimensions: { width: r.width, height: r.height },
    processedFormat: config.targetFormat,
    processedUrl: URL.createObjectURL(blob),
    compressionRatio: Math.round(((file.size - blob.size) / file.size) * 100),
    processingTimeMs: Math.round(performance.now() - t0),
    downloadFilename: `${base}_${r.width}x${r.height}_${kb}KB.${ext}`,
    quality: r.quality,
    sizeUnmet: r.sizeUnmet,
    dpi: config.dpi,
  };
}
