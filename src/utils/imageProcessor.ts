import { PDFDocument } from 'pdf-lib';
import { ImageProcessingConfig, ProcessingMetadata } from '../types';

export function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function getImageDimensions(file: File | Blob): Promise<{ width: number; height: number; colorMode: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      
      // Determine approximate color mode via canvas
      let colorMode = 'RGB';
      try {
        const sampleCanvas = document.createElement('canvas');
        sampleCanvas.width = Math.min(img.naturalWidth, 100);
        sampleCanvas.height = Math.min(img.naturalHeight, 100);
        const sCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });
        if (sCtx) {
          sCtx.drawImage(img, 0, 0, sampleCanvas.width, sampleCanvas.height);
          const imgData = sCtx.getImageData(0, 0, sampleCanvas.width, sampleCanvas.height).data;
          let isGray = true;
          for (let i = 0; i < imgData.length; i += 16) {
            const r = imgData[i];
            const g = imgData[i + 1];
            const b = imgData[i + 2];
            if (Math.abs(r - g) > 8 || Math.abs(r - b) > 8) {
              isGray = false;
              break;
            }
          }
          if (isGray) colorMode = 'Grayscale';
        }
      } catch {
        colorMode = 'RGB';
      }

      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        colorMode
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for measurement'));
    };
    img.src = url;
  });
}

export function calculateOutputDimensions(
  origW: number,
  origH: number,
  config: ImageProcessingConfig
): { targetW: number; targetH: number } {
  let targetW = origW;
  let targetH = origH;

  switch (config.resizeMode) {
    case 'pixels':
      targetW = (config.exactWidth && config.exactWidth > 0) ? config.exactWidth : origW;
      targetH = (config.exactHeight && config.exactHeight > 0) ? config.exactHeight : origH;
      break;

    case 'percent':
      const p = Math.max(1, config.scalePercent || 100) / 100;
      targetW = Math.round(origW * p);
      targetH = Math.round(origH * p);
      break;

    case 'longest':
      const longest = config.longestSide || origW;
      if (origW >= origH) {
        targetW = longest;
        targetH = Math.round((longest / origW) * origH);
      } else {
        targetH = longest;
        targetW = Math.round((longest / origH) * origW);
      }
      break;

    case 'shortest':
      const shortest = config.shortestSide || origH;
      if (origW <= origH) {
        targetW = shortest;
        targetH = Math.round((shortest / origW) * origH);
      } else {
        targetH = shortest;
        targetW = Math.round((shortest / origH) * origW);
      }
      break;

    case 'ratio':
      if (config.aspectRatioPreset && config.aspectRatioPreset !== 'free') {
        const [rW, rH] = config.aspectRatioPreset.split(':').map(Number);
        if (rW && rH) {
          const ratio = rW / rH;
          targetW = config.exactWidth || origW;
          targetH = Math.round(targetW / ratio);
        }
      }
      break;
  }

  return {
    targetW: Math.max(1, targetW),
    targetH: Math.max(1, targetH)
  };
}

export async function processImage(
  file: File,
  config: ImageProcessingConfig
): Promise<ProcessingMetadata> {
  const startTime = performance.now();
  const originalMeta = await getImageDimensions(file);

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = async () => {
      URL.revokeObjectURL(url);

      try {
        const { targetW, targetH } = calculateOutputDimensions(img.naturalWidth, img.naturalHeight, config);

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (!ctx) {
          throw new Error('Canvas 2D context unavailable');
        }

        // Background filling for transparent / PNG -> JPG or custom fill
        const isJpg = config.targetFormat === 'jpg';
        if (isJpg || config.backgroundFill) {
          ctx.fillStyle = config.backgroundFill || '#FFFFFF';
          ctx.fillRect(0, 0, targetW, targetH);
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, targetW, targetH);

        // Color Mode processing
        if (config.colorMode === 'grayscale' || config.colorMode === 'bw') {
          const imgData = ctx.getImageData(0, 0, targetW, targetH);
          const data = imgData.data;

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            // Standard perceptual luminance
            const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);

            if (config.colorMode === 'bw') {
              const val = gray >= 128 ? 255 : 0;
              data[i] = val;
              data[i + 1] = val;
              data[i + 2] = val;
            } else {
              data[i] = gray;
              data[i + 1] = gray;
              data[i + 2] = gray;
            }
          }
          ctx.putImageData(imgData, 0, 0);
        }

        let finalBlob: Blob;
        let finalFormat = config.targetFormat;

        // Image to PDF Conversion
        if (config.targetFormat === 'pdf') {
          finalBlob = await convertCanvasToPDF(canvas, config.dpi || 200);
        } else {
          // Image formats: JPG, PNG, WEBP
          const mimeType = getMimeType(config.targetFormat);

          if (config.targetSizeKB && config.targetSizeKB > 0 && config.targetFormat !== 'png') {
            // Target size compression loop
            finalBlob = await targetSizeCompress(canvas, mimeType, config.targetSizeKB);
          } else {
            const qualityRatio = Math.max(0.05, Math.min(1.0, config.quality / 100));
            finalBlob = await canvasToBlob(canvas, mimeType, qualityRatio);
          }
        }

        const endTime = performance.now();
        const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        const ext = config.targetFormat === 'jpg' ? 'jpg' : config.targetFormat;
        const sizeKB = Math.round(finalBlob.size / 1024);
        const downloadFilename = `${baseName}_${targetW}x${targetH}_${sizeKB}KB.${ext}`;

        resolve({
          originalName: file.name,
          originalSize: file.size,
          originalDimensions: { width: originalMeta.width, height: originalMeta.height },
          originalFormat: file.type || 'image',
          originalDpi: config.dpi || 72,
          originalColorMode: originalMeta.colorMode,
          processedBlob: finalBlob,
          processedSize: finalBlob.size,
          processedDimensions: { width: targetW, height: targetH },
          processedFormat: finalFormat,
          processedUrl: URL.createObjectURL(finalBlob),
          compressionRatio: Math.round(((file.size - finalBlob.size) / file.size) * 100),
          processingTimeMs: Math.round(endTime - startTime),
          downloadFilename
        });
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for processing'));
    };

    img.src = url;
  });
}

function getMimeType(fmt: string): string {
  if (fmt.includes('png')) return 'image/png';
  if (fmt.includes('webp')) return 'image/webp';
  if (fmt.includes('pdf')) return 'application/pdf';
  return 'image/jpeg';
}

export function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas export to blob failed'));
      },
      mimeType,
      quality
    );
  });
}

/**
 * Target size compression loop based on user spec:
 * 1. Start at quality = 92
 * 2. Compress -> check output size
 * 3. If over target -> quality -= 5, repeat
 * 4. If under target by > 20% -> quality += 2, repeat
 * 5. Stop when within +-10% of target or quality < 10
 */
async function targetSizeCompress(
  canvas: HTMLCanvasElement,
  mimeType: string,
  targetKB: number
): Promise<Blob> {
  const targetBytes = targetKB * 1024;
  let quality = 92;
  let bestBlob: Blob | null = null;
  let iterations = 0;
  const maxIterations = 16;

  while (iterations < maxIterations && quality >= 10 && quality <= 98) {
    iterations++;
    const qRatio = quality / 100;
    const blob = await canvasToBlob(canvas, mimeType, qRatio);
    bestBlob = blob;

    const size = blob.size;
    const diffPercent = (size - targetBytes) / targetBytes;

    // Within +-10% of target?
    if (Math.abs(diffPercent) <= 0.10 && size <= targetBytes) {
      return blob;
    }

    if (size > targetBytes) {
      quality -= 5;
    } else if (diffPercent < -0.20 && quality <= 94) {
      quality += 2;
    } else {
      // Under target within 0% to 20%
      return blob;
    }
  }

  // If still over target with quality=10, scale canvas down slightly to respect strict portal max size
  if (bestBlob && bestBlob.size > targetBytes) {
    let scale = 0.9;
    const tempCanvas = document.createElement('canvas');

    while (scale >= 0.4) {
      const scaledW = Math.max(20, Math.round(canvas.width * scale));
      const scaledH = Math.max(20, Math.round(canvas.height * scale));
      tempCanvas.width = scaledW;
      tempCanvas.height = scaledH;

      const tCtx = tempCanvas.getContext('2d');
      if (tCtx) {
        tCtx.fillStyle = '#FFFFFF';
        tCtx.fillRect(0, 0, scaledW, scaledH);
        tCtx.drawImage(canvas, 0, 0, scaledW, scaledH);
        const testBlob = await canvasToBlob(tempCanvas, mimeType, 0.7);
        if (testBlob.size <= targetBytes) {
          return testBlob;
        }
      }
      scale -= 0.1;
    }
  }

  return bestBlob || await canvasToBlob(canvas, mimeType, 0.5);
}

/**
 * Image to PDF with print-accurate DPI calculation:
 * pageWidth = imageWidthPx / targetDPI * 72 (PDF points)
 * pageHeight = imageHeightPx / targetDPI * 72
 */
async function convertCanvasToPDF(canvas: HTMLCanvasElement, dpi: number = 200): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  
  // Calculate page points based on target DPI (72 points = 1 inch)
  const pageWidthPt = (canvas.width / dpi) * 72;
  const pageHeightPt = (canvas.height / dpi) * 72;

  const page = pdfDoc.addPage([pageWidthPt, pageHeightPt]);
  
  // Export canvas as JPEG
  const jpgBlob = await canvasToBlob(canvas, 'image/jpeg', 0.92);
  const jpgBytes = await jpgBlob.arrayBuffer();
  const embeddedImage = await pdfDoc.embedJpg(jpgBytes);

  page.drawImage(embeddedImage, {
    x: 0,
    y: 0,
    width: pageWidthPt,
    height: pageHeightPt
  });

  const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}
