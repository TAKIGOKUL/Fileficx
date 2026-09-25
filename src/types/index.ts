export type FileType = 'image/jpeg' | 'image/png' | 'image/webp' | 'application/pdf' | 'unknown';

export interface ParsedRequirement {
  rawText: string;
  targetFormat?: 'JPG' | 'PNG' | 'PDF' | 'WEBP';
  minSizeKB?: number;
  maxSizeKB?: number;
  targetSizeKB?: number;
  width?: number;
  height?: number;
  unit?: 'px' | 'cm' | 'mm' | 'in';
  dpi?: number;
  aspectRatio?: string;
  isPassportPhoto?: boolean;
  isSignature?: boolean;
  backgroundRequirement?: string;
  detectedRules: string[];
}

export interface ProcessingMetadata {
  originalName: string;
  originalSize: number;
  originalDimensions?: { width: number; height: number };
  originalFormat: string;
  processedBlob?: Blob;
  processedSize?: number;
  processedDimensions?: { width: number; height: number };
  processedFormat?: string;
  compressionRatio?: number;
  processingTimeMs?: number;
}

export interface ImageProcessingConfig {
  targetFormat: 'image/jpeg' | 'image/png' | 'image/webp';
  targetMaxKB?: number;
  exactWidth?: number;
  exactHeight?: number;
  scalePercent: number;
  maintainAspectRatio: boolean;
  aspectRatioPreset?: 'free' | '1:1' | '3.5:4.5' | '2:2' | '4:3' | '16:9' | 'custom';
  quality: number;
  dpi: number;
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  rotation: 0 | 90 | 180 | 270;
  flipH: boolean;
  flipV: boolean;
  grayscale: boolean;
  contrast: number;
  brightness: number;
}

export interface PDFProcessingConfig {
  mode: 'compress' | 'resize' | 'merge' | 'split';
  targetMaxKB?: number;
  pageFormat?: 'A4' | 'Letter' | 'Legal' | 'Custom';
  customWidthPt?: number;
  customHeightPt?: number;
  marginPt?: number;
  splitRange?: string;
}

export interface PresetRequirement {
  id: string;
  title: string;
  category: 'VISA' | 'GOVERNMENT' | 'PASSPORT' | 'EXAM' | 'CUSTOM';
  description: string;
  sampleInstruction: string;
  targetFormat: 'JPG' | 'PNG' | 'PDF';
  maxSizeKB?: number;
  minSizeKB?: number;
  width?: number;
  height?: number;
  unit: 'px' | 'cm' | 'mm' | 'in';
  dpi: number;
  aspectRatio?: string;
}
