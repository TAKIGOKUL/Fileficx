import { ImageProcessingConfig, ProcessingMetadata } from '../types';

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getImageDimensions(file: File | Blob): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for dimension measurement'));
    };
    img.src = url;
  });
}

export async function processImage(
  file: File,
  config: ImageProcessingConfig
): Promise<ProcessingMetadata> {
  const startTime = performance.now();
  const originalDims = await getImageDimensions(file);

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = async () => {
      URL.revokeObjectURL(url);

      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (!ctx) {
          throw new Error('Canvas 2D context unavailable');
        }

        let sx = 0;
        let sy = 0;
        let sWidth = img.naturalWidth;
        let sHeight = img.naturalHeight;

        if (config.crop) {
          sx = config.crop.x;
          sy = config.crop.y;
          sWidth = config.crop.width;
          sHeight = config.crop.height;
        }

        let destWidth = config.exactWidth || Math.round(sWidth * (config.scalePercent / 100));
        let destHeight = config.exactHeight || Math.round(sHeight * (config.scalePercent / 100));

        if (config.maintainAspectRatio && !config.exactHeight && config.exactWidth) {
          destHeight = Math.round((destWidth / sWidth) * sHeight);
        } else if (config.maintainAspectRatio && config.exactHeight && !config.exactWidth) {
          destWidth = Math.round((destHeight / sHeight) * sWidth);
        }

        const isRotated90or270 = config.rotation === 90 || config.rotation === 270;
        canvas.width = isRotated90or270 ? destHeight : destWidth;
        canvas.height = isRotated90or270 ? destWidth : destHeight;

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);

        if (config.rotation !== 0) {
          ctx.rotate((config.rotation * Math.PI) / 180);
        }
        if (config.flipH) {
          ctx.scale(-1, 1);
        }
        if (config.flipV) {
          ctx.scale(1, -1);
        }

        if (config.targetFormat === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(-destWidth / 2, -destHeight / 2, destWidth, destHeight);
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, sx, sy, sWidth, sHeight, -destWidth / 2, -destHeight / 2, destWidth, destHeight);
        ctx.restore();

        if (config.grayscale || config.contrast !== 0 || config.brightness !== 0) {
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;
          const contrastFactor = (259 * (config.contrast + 255)) / (255 * (259 - config.contrast));

          for (let i = 0; i < data.length; i += 4) {
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];

            if (config.grayscale) {
              const avg = 0.299 * r + 0.587 * g + 0.114 * b;
              r = avg;
              g = avg;
              b = avg;
            }

            if (config.brightness !== 0) {
              r += config.brightness;
              g += config.brightness;
              b += config.brightness;
            }

            if (config.contrast !== 0) {
              r = contrastFactor * (r - 128) + 128;
              g = contrastFactor * (g - 128) + 128;
              b = contrastFactor * (b - 128) + 128;
            }

            data[i] = Math.min(255, Math.max(0, r));
            data[i + 1] = Math.min(255, Math.max(0, g));
            data[i + 2] = Math.min(255, Math.max(0, b));
          }

          ctx.putImageData(imgData, 0, 0);
        }

        let finalBlob: Blob;
        if (config.targetMaxKB && config.targetMaxKB > 0 && config.targetFormat !== 'image/png') {
          finalBlob = await smartCompressToTargetKB(canvas, config.targetFormat, config.targetMaxKB);
        } else {
          finalBlob = await canvasToBlob(canvas, config.targetFormat, config.quality);
        }

        const endTime = performance.now();
        const finalDims = { width: canvas.width, height: canvas.height };

        resolve({
          originalName: file.name,
          originalSize: file.size,
          originalDimensions: originalDims,
          originalFormat: file.type,
          processedBlob: finalBlob,
          processedSize: finalBlob.size,
          processedDimensions: finalDims,
          processedFormat: config.targetFormat,
          compressionRatio: Math.round(((file.size - finalBlob.size) / file.size) * 100),
          processingTimeMs: Math.round(endTime - startTime)
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

function canvasToBlob(canvas: HTMLCanvasElement, format: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas export to blob returned null'));
      },
      format,
      quality
    );
  });
}

async function smartCompressToTargetKB(
  canvas: HTMLCanvasElement,
  format: string,
  targetKB: number
): Promise<Blob> {
  const targetBytes = targetKB * 1024;
  let minQuality = 0.05;
  let maxQuality = 0.98;
  let bestBlob: Blob | null = null;
  let iterations = 0;
  const maxIterations = 8;

  const initialBlob = await canvasToBlob(canvas, format, 0.95);
  if (initialBlob.size <= targetBytes) {
    return initialBlob;
  }

  while (iterations < maxIterations && minQuality <= maxQuality) {
    iterations++;
    const midQuality = (minQuality + maxQuality) / 2;
    const blob = await canvasToBlob(canvas, format, midQuality);

    if (blob.size <= targetBytes) {
      bestBlob = blob;
      minQuality = midQuality + 0.05;
    } else {
      maxQuality = midQuality - 0.05;
    }
  }

  if (bestBlob) {
    return bestBlob;
  }

  let scale = 0.9;
  const tempCanvas = document.createElement('canvas');

  while (scale >= 0.3) {
    const currentWidth = Math.round(canvas.width * scale);
    const currentHeight = Math.round(canvas.height * scale);
    tempCanvas.width = currentWidth;
    tempCanvas.height = currentHeight;

    const tCtx = tempCanvas.getContext('2d');
    if (tCtx) {
      tCtx.fillStyle = '#FFFFFF';
      tCtx.fillRect(0, 0, currentWidth, currentHeight);
      tCtx.drawImage(canvas, 0, 0, currentWidth, currentHeight);
      const blob = await canvasToBlob(tempCanvas, format, 0.7);
      if (blob.size <= targetBytes) {
        return blob;
      }
    }
    scale -= 0.15;
  }

  return await canvasToBlob(canvas, format, 0.2);
}
