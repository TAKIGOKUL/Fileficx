export type SupportedFormat = 'jpg' | 'png' | 'webp' | 'pdf';

export interface ParsedRequirement {
  format?: SupportedFormat;
  width?: number;
  height?: number;
  minSize?: number; // KB
  maxSize?: number; // KB
  targetSize?: number; // KB (auto: 90% of max or midpoint)
  dpi?: number;
  background?: string;
  colorMode?: 'rgb' | 'grayscale' | 'bw';
  rawText: string;
  detectedRules: string[];
}

export interface ProcessingMetadata {
  originalName: string;
  originalSize: number;
  originalDimensions?: { width: number; height: number };
  originalFormat: string;
  originalDpi?: number;
  originalColorMode?: string;
  pageCount?: number;
  processedBlob?: Blob;
  processedSize?: number;
  processedDimensions?: { width: number; height: number };
  processedFormat?: string;
  processedUrl?: string;
  compressionRatio?: number;
  processingTimeMs?: number;
  downloadFilename?: string;
}

export type ResizeMode = 'pixels' | 'percent' | 'longest' | 'shortest' | 'ratio';

export interface ImageProcessingConfig {
  targetFormat: SupportedFormat;
  resizeMode: ResizeMode;
  exactWidth: number;
  exactHeight: number;
  aspectLocked: boolean;
  scalePercent: number;
  longestSide: number;
  shortestSide: number;
  aspectRatioPreset: 'free' | '1:1' | '3.5:4.5' | '2:2' | '4:3' | '16:9' | '3:4' | '2:3';
  targetSizeKB?: number;
  quality: number; // 1 - 100
  dpi: number;
  colorMode: 'rgb' | 'grayscale' | 'bw';
  backgroundFill: string;
}

export interface PDFProcessingConfig {
  mode: 'compress' | 'resize' | 'split' | 'merge' | 'pdf-to-images' | 'image-to-pdf' | 'rotate' | 'remove';
  targetMaxKB?: number;
  targetSizeKB?: number;
  splitRange?: string; // e.g. "1-3, 5, 7-9"
  rotateAngle?: 90 | 180 | 270;
  removePages?: string; // e.g. "2, 4"
  quality?: number;
  imageFormat?: 'jpg' | 'png';
  pageFormat?: 'A4' | 'Letter' | 'Legal' | 'Custom';
  pageSize?: 'A4' | 'Original' | 'Letter';
}

export interface PortalPreset {
  id: string;
  name: string;
  category: 'GOVERNMENT' | 'EXAM' | 'PASSPORT' | 'MNC';
  badge: string;
  description: string;
  instructionSample: string;
  requirements: {
    format: SupportedFormat;
    width: number;
    height: number;
    minSize?: number;
    maxSize: number;
    targetSize: number;
    dpi: number;
    colorMode: 'rgb' | 'grayscale' | 'bw';
    background?: string;
  };
}
