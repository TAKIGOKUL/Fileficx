import type { PDFProcessingConfig, ProcessingMetadata } from '../types';

/* Heavy libraries are loaded on demand so they never weigh down the first page load. */
type PdfJs = typeof import('pdfjs-dist');
let pdfjsPromise: Promise<PdfJs> | null = null;
function pdfjs(): Promise<PdfJs> {
  if (!pdfjsPromise) {
    pdfjsPromise = import('pdfjs-dist').then((m) => {
      m.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      return m;
    });
  }
  return pdfjsPromise;
}
const pdfLib = () => import('pdf-lib');

/** Bytes are cached per File so repeated operations don't re-read large PDFs. */
const bytesCache = new WeakMap<File, Promise<ArrayBuffer>>();
function bytesOf(file: File): Promise<ArrayBuffer> {
  let p = bytesCache.get(file);
  if (!p) {
    p = file.arrayBuffer();
    bytesCache.set(file, p);
  }
  return p;
}

async function openPdfJs(file: File) {
  const lib = await pdfjs();
  // pdf.js transfers the buffer to its worker, so hand it a copy
  const data = new Uint8Array((await bytesOf(file)).slice(0));
  return lib.getDocument({ data }).promise;
}

type PdfJsDoc = Awaited<ReturnType<typeof openPdfJs>>;

const toBlob = (c: HTMLCanvasElement, type: string, q?: number) =>
  new Promise<Blob>((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('Encoding failed'))), type, q));

async function renderPage(doc: PdfJsDoc, pageNo: number, scale: number, grayscale = false) {
  const page = await doc.getPage(pageNo);
  const base = page.getViewport({ scale: 1 });
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.floor(viewport.width));
  canvas.height = Math.max(1, Math.floor(viewport.height));
  const ctx = canvas.getContext('2d', { willReadFrequently: grayscale })!;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;
  if (grayscale) {
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const g = (d[i] * 299 + d[i + 1] * 587 + d[i + 2] * 114) / 1000;
      d[i] = d[i + 1] = d[i + 2] = g;
    }
    ctx.putImageData(img, 0, 0);
  }
  page.cleanup();
  return { canvas, widthPt: base.width, heightPt: base.height };
}

/** Page count, first-page preview (object URL) and page size in points. */
export async function getPDFInfoAndThumbnail(file: File) {
  const doc = await openPdfJs(file);
  try {
    const first = await doc.getPage(1);
    const vp = first.getViewport({ scale: 1 });
    const { canvas } = await renderPage(doc, 1, Math.min(2, 520 / vp.width));
    const blob = await toBlob(canvas, 'image/jpeg', 0.85);
    return { pageCount: doc.numPages, thumbnailUrl: URL.createObjectURL(blob), width: Math.round(vp.width), height: Math.round(vp.height) };
  } finally {
    void doc.loadingTask.destroy();
  }
}

/** Renders small page thumbnails one at a time, reporting each as it's ready. */
export async function renderThumbnails(
  file: File,
  onThumb: (index: number, url: string) => void,
  isCancelled: () => boolean,
  width = 160
) {
  const doc = await openPdfJs(file);
  try {
    for (let i = 1; i <= doc.numPages && !isCancelled(); i++) {
      const page = await doc.getPage(i);
      const vp = page.getViewport({ scale: 1 });
      const { canvas } = await renderPage(doc, i, (width * (window.devicePixelRatio > 1 ? 2 : 1)) / vp.width);
      if (isCancelled()) break;
      onThumb(i - 1, URL.createObjectURL(await toBlob(canvas, 'image/jpeg', 0.7)));
    }
  } finally {
    void doc.loadingTask.destroy();
  }
}

/** Export pages as images (single encode per page). */
export async function renderPDFPagesToImages(
  file: File,
  format: 'jpg' | 'png' = 'jpg',
  quality = 0.9,
  dpi = 150,
  pages?: number[],
  onProgress?: (done: number, total: number) => void
): Promise<{ pageIndex: number; blob: Blob; url: string }[]> {
  const doc = await openPdfJs(file);
  const list = pages && pages.length ? pages.map((p) => p + 1) : Array.from({ length: doc.numPages }, (_, i) => i + 1);
  const out: { pageIndex: number; blob: Blob; url: string }[] = [];
  try {
    for (const [n, pageNo] of list.entries()) {
      const { canvas } = await renderPage(doc, pageNo, dpi / 72);
      const blob = await toBlob(canvas, format === 'png' ? 'image/png' : 'image/jpeg', format === 'png' ? undefined : quality);
      out.push({ pageIndex: pageNo, blob, url: URL.createObjectURL(blob) });
      canvas.width = canvas.height = 0; // release memory early
      onProgress?.(n + 1, list.length);
    }
  } finally {
    void doc.loadingTask.destroy();
  }
  return out;
}

export async function createZipFromBlobs(blobs: { filename: string; blob: Blob }[]): Promise<Blob> {
  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();
  blobs.forEach(({ filename, blob }) => zip.file(filename, blob));
  return zip.generateAsync({ type: 'blob' });
}

/**
 * Rasterise pages and pick the highest JPEG quality whose total fits the target.
 * Pages are rendered once per resolution; only re-encoding happens during the search.
 */
async function compressToTarget(
  file: File,
  targetKB: number,
  grayscale: boolean,
  onProgress?: (msg: string) => void
): Promise<Blob> {
  const { PDFDocument } = await pdfLib();
  const doc = await openPdfJs(file);
  const n = doc.numPages;
  const budget = targetKB * 1024 - (1200 + n * 600); // PDF structure overhead

  try {
    // Start around 150 DPI (scale ≈ 2.08), lower for long documents to bound memory
    let scale = n > 30 ? 1.2 : n > 10 ? 1.6 : 2.08;
    let best: Blob[] | null = null;
    let sizes: { w: number; h: number }[] = [];

    for (let attempt = 0; attempt < 4 && !best; attempt++) {
      onProgress?.(`Rendering pages at ${Math.round(scale * 72)} DPI…`);
      const pages: Awaited<ReturnType<typeof renderPage>>[] = [];
      for (let i = 1; i <= n; i++) pages.push(await renderPage(doc, i, scale, grayscale));
      sizes = pages.map((p) => ({ w: p.widthPt, h: p.heightPt }));

      const encodeAll = (q: number) => Promise.all(pages.map((p) => toBlob(p.canvas, 'image/jpeg', q)));
      const total = (bs: Blob[]) => bs.reduce((s, b) => s + b.size, 0);

      let lo = 0.15;
      let hi = 0.92;
      let smallest = Infinity;
      const top = await encodeAll(hi);
      if (total(top) <= budget) {
        best = top;
      } else {
        for (let i = 0; i < 6 && hi - lo > 0.03; i++) {
          const q = (lo + hi) / 2;
          onProgress?.(`Optimising quality (pass ${i + 1})…`);
          const bs = await encodeAll(q);
          const t = total(bs);
          if (t <= budget) {
            best = bs;
            lo = q;
          } else {
            smallest = Math.min(smallest, t);
            hi = q;
          }
        }
        if (!best) {
          const floor = await encodeAll(0.15);
          if (total(floor) <= budget) best = floor;
          else smallest = total(floor);
        }
      }
      pages.forEach((p) => (p.canvas.width = p.canvas.height = 0));
      if (!best) scale *= Math.max(0.4, Math.min(0.85, Math.sqrt(budget / smallest) * 0.95));
    }

    if (!best) throw new Error(`Couldn't get this PDF under ${targetKB} KB while keeping it readable. Try removing pages or raising the limit.`);

    onProgress?.('Assembling PDF…');
    const out = await PDFDocument.create();
    for (let i = 0; i < best.length; i++) {
      const img = await out.embedJpg(await best[i].arrayBuffer());
      const page = out.addPage([sizes[i].w, sizes[i].h]);
      page.drawImage(img, { x: 0, y: 0, width: sizes[i].w, height: sizes[i].h });
    }
    const bytes = await out.save({ useObjectStreams: true });
    return new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  } finally {
    void doc.loadingTask.destroy();
  }
}

const pdfBlob = (bytes: Uint8Array) => new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });

export async function processPDF(
  file: File,
  config: PDFProcessingConfig,
  onProgress?: (msg: string) => void
): Promise<ProcessingMetadata> {
  const t0 = performance.now();
  const { PDFDocument, degrees } = await pdfLib();
  const src = await PDFDocument.load(await bytesOf(file), { ignoreEncryption: true });
  const total = src.getPageCount();
  const base = file.name.replace(/\.pdf$/i, '');

  const selected =
    config.pages && config.pages.length
      ? config.pages.filter((p) => p >= 0 && p < total)
      : config.splitRange
        ? parsePageRange(config.splitRange, total)
        : config.removePages
          ? parsePageRange(config.removePages, total)
          : [];

  let blob: Blob;
  let name = base;

  const copy = async (indices: number[]) => {
    const out = await PDFDocument.create();
    (await out.copyPages(src, indices)).forEach((p) => out.addPage(p));
    return pdfBlob(await out.save({ useObjectStreams: true }));
  };

  switch (config.mode) {
    case 'split':
      if (!selected.length) throw new Error('Select at least one page to extract.');
      blob = await copy(selected);
      name = `${base}_pages`;
      break;
    case 'remove': {
      const drop = new Set(selected);
      const keep = src.getPageIndices().filter((i) => !drop.has(i));
      if (!keep.length) throw new Error('You can’t remove every page.');
      blob = await copy(keep);
      name = `${base}_edited`;
      break;
    }
    case 'rotate': {
      const angle = config.rotateAngle || 90;
      const targets = selected.length ? new Set(selected) : null;
      src.getPages().forEach((p, i) => {
        if (!targets || targets.has(i)) p.setRotation(degrees((p.getRotation().angle + angle) % 360));
      });
      blob = pdfBlob(await src.save({ useObjectStreams: true }));
      name = `${base}_rotated`;
      break;
    }
    case 'compress': {
      onProgress?.('Optimising structure…');
      const lossless = pdfBlob(await src.save({ useObjectStreams: true }));
      const target = config.targetSizeKB || 0;
      blob =
        target > 0 && (lossless.size > target * 1024 || config.grayscale)
          ? await compressToTarget(file, target, !!config.grayscale, onProgress)
          : lossless.size < file.size
            ? lossless
            : file;
      name = `${base}_compressed`;
      break;
    }
    default:
      blob = pdfBlob(await src.save({ useObjectStreams: true }));
  }

  const kb = Math.round(blob.size / 1024);
  return {
    originalName: file.name,
    originalSize: file.size,
    originalFormat: 'application/pdf',
    pageCount: total,
    processedBlob: blob,
    processedSize: blob.size,
    processedFormat: 'application/pdf',
    processedUrl: URL.createObjectURL(blob),
    compressionRatio: Math.round(((file.size - blob.size) / file.size) * 100),
    processingTimeMs: Math.round(performance.now() - t0),
    downloadFilename: `${name}_${kb}KB.pdf`,
  };
}

/** Merge PDFs (and images, as full pages) in the given order. */
export async function mergePDFs(files: File[]): Promise<ProcessingMetadata> {
  const t0 = performance.now();
  const { PDFDocument } = await pdfLib();
  const merged = await PDFDocument.create();
  let original = 0;

  for (const f of files) {
    original += f.size;
    const buf = await bytesOf(f);
    if (/pdf/i.test(f.type) || /\.pdf$/i.test(f.name)) {
      const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
      (await merged.copyPages(doc, doc.getPageIndices())).forEach((p) => merged.addPage(p));
    } else if (/png/i.test(f.type)) {
      const img = await merged.embedPng(buf);
      merged.addPage([img.width, img.height]).drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
    } else {
      const img = await merged.embedJpg(buf);
      merged.addPage([img.width, img.height]).drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
    }
  }

  const blob = pdfBlob(await merged.save({ useObjectStreams: true }));
  const kb = Math.round(blob.size / 1024);
  return {
    originalName: `merged_${files.length}_documents.pdf`,
    originalSize: original,
    originalFormat: 'application/pdf',
    pageCount: merged.getPageCount(),
    processedBlob: blob,
    processedSize: blob.size,
    processedFormat: 'application/pdf',
    processedUrl: URL.createObjectURL(blob),
    compressionRatio: Math.round(((original - blob.size) / original) * 100),
    processingTimeMs: Math.round(performance.now() - t0),
    downloadFilename: `merged_${files.length}_docs_${kb}KB.pdf`,
  };
}

export function parsePageRange(rangeStr: string, maxPages: number): number[] {
  const pages = new Set<number>();
  for (const part of rangeStr.split(',')) {
    const t = part.trim();
    if (!t) continue;
    if (t.includes('-')) {
      const [a, b] = t.split('-').map((x) => parseInt(x, 10));
      if (!isNaN(a) && !isNaN(b)) {
        for (let i = Math.max(1, Math.min(a, b)); i <= Math.min(maxPages, Math.max(a, b)); i++) pages.add(i - 1);
      }
    } else {
      const n = parseInt(t, 10);
      if (n >= 1 && n <= maxPages) pages.add(n - 1);
    }
  }
  return [...pages].sort((a, b) => a - b);
}
