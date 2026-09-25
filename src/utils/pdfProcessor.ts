import { PDFDocument, degrees } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import { PDFProcessingConfig, ProcessingMetadata } from '../types';

// Set up pdf.js worker using public worker file
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

/**
 * Get PDF page count and first page thumbnail as an image data URL
 */
export async function getPDFInfoAndThumbnail(file: File): Promise<{
  pageCount: number;
  thumbnailUrl: string;
  width: number;
  height: number;
}> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const pageCount = pdf.numPages;

  const firstPage = await pdf.getPage(1);
  const viewport = firstPage.getViewport({ scale: 1.0 });

  // Render thumbnail at reasonable scale
  const scale = Math.min(2.0, 400 / viewport.width);
  const scaledViewport = firstPage.getViewport({ scale });

  const canvas = document.createElement('canvas');
  canvas.width = scaledViewport.width;
  canvas.height = scaledViewport.height;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const renderContext = {
      canvasContext: ctx,
      viewport: scaledViewport,
      canvas: canvas
    };
    await (firstPage.render(renderContext as any)).promise;
  }

  const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.85);

  return {
    pageCount,
    thumbnailUrl,
    width: Math.round(viewport.width),
    height: Math.round(viewport.height)
  };
}

/**
 * Render all or specific pages of PDF as images
 */
export async function renderPDFPagesToImages(
  file: File,
  format: 'jpg' | 'png' = 'jpg',
  quality: number = 0.9
): Promise<{ pageIndex: number; blob: Blob; dataUrl: string }[]> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const results: { pageIndex: number; blob: Blob; dataUrl: string }[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2.0 }); // High-res 2x scale
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      if (format === 'jpg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      await (page.render({ canvasContext: ctx, viewport, canvas } as any)).promise;

      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const dataUrl = canvas.toDataURL(mimeType, quality);
      const blob = await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), mimeType, quality));

      results.push({
        pageIndex: i,
        blob,
        dataUrl
      });
    }
  }

  return results;
}

/**
 * Package multiple page blobs into a single JSZip download
 */
export async function createZipFromBlobs(
  blobs: { filename: string; blob: Blob }[]
): Promise<Blob> {
  const zip = new JSZip();
  blobs.forEach(({ filename, blob }) => {
    zip.file(filename, blob);
  });
  return await zip.generateAsync({ type: 'blob' });
}

/**
 * Main PDF Processing pipeline:
 * compress, split, merge, rotate, remove, convert to images
 */
export async function processPDF(
  file: File,
  config: PDFProcessingConfig
): Promise<ProcessingMetadata> {
  const startTime = performance.now();
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const totalPages = pdfDoc.getPageCount();

  let finalBlob: Blob;
  let finalName = file.name;

  if (config.mode === 'split' && config.splitRange) {
    const newPdf = await PDFDocument.create();
    const pageIndices = parsePageRange(config.splitRange, totalPages);
    const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
    copiedPages.forEach((page) => newPdf.addPage(page));

    const pdfBytes = await newPdf.save({ useObjectStreams: true });
    finalBlob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
    finalName = `split_${config.splitRange.replace(/\s+/g, '')}_${file.name}`;
  } else if (config.mode === 'rotate') {
    const angle = config.rotateAngle || 90;
    const pages = pdfDoc.getPages();
    pages.forEach((page) => {
      const currentRot = page.getRotation().angle;
      page.setRotation(degrees((currentRot + angle) % 360));
    });

    const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
    finalBlob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
    finalName = `rotated_${angle}deg_${file.name}`;
  } else if (config.mode === 'remove' && config.removePages) {
    const removeSet = new Set(
      config.removePages
        .split(',')
        .map((p) => parseInt(p.trim(), 10) - 1)
        .filter((n) => !isNaN(n) && n >= 0 && n < totalPages)
    );

    const newPdf = await PDFDocument.create();
    const keepIndices = pdfDoc
      .getPageIndices()
      .filter((idx) => !removeSet.has(idx));

    const copiedPages = await newPdf.copyPages(pdfDoc, keepIndices);
    copiedPages.forEach((page) => newPdf.addPage(page));

    const pdfBytes = await newPdf.save({ useObjectStreams: true });
    finalBlob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
    finalName = `pages_removed_${file.name}`;
  } else if (config.mode === 'compress') {
    // If target size is specified and file is over target, test heavy rasterized compression
    const targetBytes = (config.targetSizeKB || 0) * 1024;
    const standardBytes = await pdfDoc.save({ useObjectStreams: true });

    if (targetBytes > 0 && standardBytes.length > targetBytes) {
      // Heavy compression: render pages to images, compress, and re-embed
      finalBlob = await heavyCompressPDF(file, config.targetSizeKB!);
    } else {
      finalBlob = new Blob([standardBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
    }
    finalName = `compressed_${file.name}`;
  } else {
    // Default standard save with metadata optimization
    const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
    finalBlob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  }

  const endTime = performance.now();
  const sizeKB = Math.round(finalBlob.size / 1024);
  const downloadFilename = `${finalName.replace(/\.pdf$/i, '')}_${sizeKB}KB.pdf`;

  return {
    originalName: file.name,
    originalSize: file.size,
    originalFormat: 'application/pdf',
    pageCount: totalPages,
    processedBlob: finalBlob,
    processedSize: finalBlob.size,
    processedFormat: 'application/pdf',
    processedUrl: URL.createObjectURL(finalBlob),
    compressionRatio: Math.round(((file.size - finalBlob.size) / file.size) * 100),
    processingTimeMs: Math.round(endTime - startTime),
    downloadFilename
  };
}

/**
 * Re-embed pages as compressed JPGs into a new PDF to meet strict portal limits (e.g. <100KB, <200KB)
 */
async function heavyCompressPDF(file: File, _targetKB?: number): Promise<Blob> {
  const images = await renderPDFPagesToImages(file, 'jpg', 0.65);
  const newPdf = await PDFDocument.create();

  for (const item of images) {
    const jpgBytes = await item.blob.arrayBuffer();
    const embeddedImg = await newPdf.embedJpg(jpgBytes);
    const { width, height } = embeddedImg.scale(0.5); // Scaled to standard document pt
    const page = newPdf.addPage([width, height]);
    page.drawImage(embeddedImg, { x: 0, y: 0, width, height });
  }

  const finalBytes = await newPdf.save({ useObjectStreams: true });
  return new Blob([finalBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

/**
 * Merge multiple PDF files into one
 */
export async function mergePDFs(files: File[]): Promise<ProcessingMetadata> {
  const startTime = performance.now();
  const mergedPdf = await PDFDocument.create();
  let totalOriginalSize = 0;

  for (const file of files) {
    totalOriginalSize += file.size;
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const pdfBytes = await mergedPdf.save({ useObjectStreams: true });
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  const endTime = performance.now();
  const sizeKB = Math.round(blob.size / 1024);

  return {
    originalName: `merged_${files.length}_documents.pdf`,
    originalSize: totalOriginalSize,
    originalFormat: 'application/pdf',
    pageCount: mergedPdf.getPageCount(),
    processedBlob: blob,
    processedSize: blob.size,
    processedFormat: 'application/pdf',
    processedUrl: URL.createObjectURL(blob),
    compressionRatio: Math.round(((totalOriginalSize - blob.size) / totalOriginalSize) * 100),
    processingTimeMs: Math.round(endTime - startTime),
    downloadFilename: `merged_${files.length}_docs_${sizeKB}KB.pdf`
  };
}

export function parsePageRange(rangeStr: string, maxPages: number): number[] {
  const pages = new Set<number>();
  const parts = rangeStr.split(',');

  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.includes('-')) {
      const [startStr, endStr] = trimmed.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end)) {
        const lower = Math.max(1, Math.min(start, end));
        const upper = Math.min(maxPages, Math.max(start, end));
        for (let i = lower; i <= upper; i++) {
          pages.add(i - 1); // 0-indexed
        }
      }
    } else {
      const pageNum = parseInt(trimmed, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= maxPages) {
        pages.add(pageNum - 1); // 0-indexed
      }
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}
