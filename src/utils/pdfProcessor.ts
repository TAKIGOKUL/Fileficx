import { PDFDocument, PageSizes } from 'pdf-lib';
import { PDFProcessingConfig, ProcessingMetadata } from '../types';

export async function processPDF(
  file: File,
  config: PDFProcessingConfig
): Promise<ProcessingMetadata> {
  const startTime = performance.now();
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const pageCount = pdfDoc.getPageCount();

  if (config.mode === 'split' && config.splitRange) {
    const newPdf = await PDFDocument.create();
    const pageIndices = parsePageRange(config.splitRange, pageCount);
    const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
    copiedPages.forEach((page) => newPdf.addPage(page));

    const pdfBytes = await newPdf.save();
    const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
    const endTime = performance.now();

    return {
      originalName: file.name,
      originalSize: file.size,
      originalFormat: 'application/pdf',
      processedBlob: blob,
      processedSize: blob.size,
      processedFormat: 'application/pdf',
      compressionRatio: Math.round(((file.size - blob.size) / file.size) * 100),
      processingTimeMs: Math.round(endTime - startTime)
    };
  }

  if (config.mode === 'resize') {
    const pages = pdfDoc.getPages();
    let targetSize = PageSizes.A4;

    if (config.pageFormat === 'Letter') {
      targetSize = PageSizes.Letter;
    } else if (config.pageFormat === 'Legal') {
      targetSize = [612, 1008];
    } else if (config.pageFormat === 'Custom' && config.customWidthPt && config.customHeightPt) {
      targetSize = [config.customWidthPt, config.customHeightPt];
    }

    pages.forEach((page) => {
      page.setSize(targetSize[0], targetSize[1]);
    });
  }

  const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  const endTime = performance.now();

  return {
    originalName: file.name,
    originalSize: file.size,
    originalFormat: 'application/pdf',
    processedBlob: blob,
    processedSize: blob.size,
    processedFormat: 'application/pdf',
    compressionRatio: Math.round(((file.size - blob.size) / file.size) * 100),
    processingTimeMs: Math.round(endTime - startTime)
  };
}

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

  return {
    originalName: `merged_${files.length}_documents.pdf`,
    originalSize: totalOriginalSize,
    originalFormat: 'application/pdf',
    processedBlob: blob,
    processedSize: blob.size,
    processedFormat: 'application/pdf',
    compressionRatio: Math.round(((totalOriginalSize - blob.size) / totalOriginalSize) * 100),
    processingTimeMs: Math.round(endTime - startTime)
  };
}

function parsePageRange(rangeStr: string, maxPages: number): number[] {
  const pages = new Set<number>();
  const parts = rangeStr.split(',');

  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.includes('-')) {
      const [startStr, endStr] = trimmed.split('-');
      const start = Math.max(1, parseInt(startStr.trim(), 10));
      const end = Math.min(maxPages, parseInt(endStr.trim(), 10));
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= end; i++) {
          pages.add(i - 1);
        }
      }
    } else {
      const pageNum = parseInt(trimmed, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= maxPages) {
        pages.add(pageNum - 1);
      }
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}
