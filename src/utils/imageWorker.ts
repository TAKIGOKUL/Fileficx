/// <reference lib="webworker" />
import { runPipeline, PipelineEnv } from './imagePipeline';
import type { ImageProcessingConfig } from '../types';

interface Req {
  id: number;
  file: File;
  config: ImageProcessingConfig;
}

const env: PipelineEnv = {
  createCanvas: (w, h) => new OffscreenCanvas(w, h),
  encode: (c, type, quality) => (c as OffscreenCanvas).convertToBlob({ type, quality }),
};

// Decoded bitmap is cached per File so tweaking settings never re-decodes the original
// (postMessage clones the File, so identity can't be used as the key)
let cachedKey = '';
let cachedBitmap: ImageBitmap | null = null;

async function bitmapFor(file: File): Promise<ImageBitmap> {
  const key = `${file.name}|${file.size}|${file.lastModified}|${file.type}`;
  if (cachedKey === key && cachedBitmap) return cachedBitmap;
  cachedBitmap?.close();
  cachedBitmap = await createImageBitmap(file);
  cachedKey = key;
  return cachedBitmap;
}

self.onmessage = async (e: MessageEvent<Req>) => {
  const { id, file, config } = e.data;
  const t0 = performance.now();
  try {
    const bmp = await bitmapFor(file);
    const r = await runPipeline(env, bmp, bmp.width, bmp.height, config);
    (self as unknown as Worker).postMessage({
      id,
      ok: true,
      blob: r.blob,
      width: r.width,
      height: r.height,
      quality: r.quality,
      sizeUnmet: r.sizeUnmet,
      srcW: bmp.width,
      srcH: bmp.height,
      ms: performance.now() - t0,
    });
  } catch (err) {
    (self as unknown as Worker).postMessage({ id, ok: false, error: err instanceof Error ? err.message : String(err) });
  }
};
