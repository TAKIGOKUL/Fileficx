import { ParsedRequirement, PresetRequirement } from '../types';

export const OFFICIAL_PRESETS: PresetRequirement[] = [
  {
    id: 'us-visa',
    title: 'US VISA (2x2 INCH / DS-160)',
    category: 'VISA',
    description: 'US Visa 2x2 inch square format (600x600px - 1200x1200px, max 240KB)',
    sampleInstruction: 'Upload a 2 x 2 inches (51 x 51 mm) photograph in JPEG format. Minimum dimension 600x600 pixels. Maximum file size 240 KB. White background required.',
    targetFormat: 'JPG',
    maxSizeKB: 240,
    minSizeKB: 20,
    width: 600,
    height: 600,
    unit: 'px',
    dpi: 300,
    aspectRatio: '1:1'
  },
  {
    id: 'schengen-visa',
    title: 'SCHENGEN VISA (3.5x4.5 CM)',
    category: 'VISA',
    description: 'Standard 3.5cm x 4.5cm European visa photograph (under 300KB)',
    sampleInstruction: 'Photograph size must be 35mm x 45mm (3.5cm x 4.5cm). JPG format only, file size must not exceed 300KB.',
    targetFormat: 'JPG',
    maxSizeKB: 300,
    minSizeKB: 30,
    width: 413,
    height: 531,
    unit: 'px',
    dpi: 300,
    aspectRatio: '3.5:4.5'
  },
  {
    id: 'passport-standard',
    title: 'PASSPORT PHOTO (20KB - 50KB)',
    category: 'PASSPORT',
    description: 'Universal standard 35x45mm passport photograph (20KB - 50KB)',
    sampleInstruction: 'Recent color passport photo 3.5cm x 4.5cm. Format: JPG/JPEG. File size between 20 KB and 50 KB.',
    targetFormat: 'JPG',
    maxSizeKB: 50,
    minSizeKB: 20,
    width: 413,
    height: 531,
    unit: 'px',
    dpi: 300,
    aspectRatio: '3.5:4.5'
  },
  {
    id: 'official-signature',
    title: 'OFFICIAL APPLICANT SIGNATURE',
    category: 'GOVERNMENT',
    description: 'Black ink signature on white paper (10KB - 20KB, 140x60px)',
    sampleInstruction: 'Applicant Signature in JPEG format. Dimensions: 140 pixels width by 60 pixels height. File size between 10KB and 20KB.',
    targetFormat: 'JPG',
    maxSizeKB: 20,
    minSizeKB: 10,
    width: 140,
    height: 60,
    unit: 'px',
    dpi: 200,
    aspectRatio: '140:60'
  },
  {
    id: 'govt-document-pdf',
    title: 'GOVERNMENT CERTIFICATE PDF',
    category: 'GOVERNMENT',
    description: 'A4 single or multi-page certificate (under 500KB PDF)',
    sampleInstruction: 'Upload scanned copy of ID proof/Degree certificate in PDF format only. File size must be under 500 KB, clear and readable.',
    targetFormat: 'PDF',
    maxSizeKB: 500,
    minSizeKB: 50,
    unit: 'px',
    dpi: 150
  }
];

export function convertUnitsToPixels(val: number, unit: 'px' | 'cm' | 'mm' | 'in', dpi: number = 300): number {
  if (unit === 'px') return Math.round(val);
  if (unit === 'in') return Math.round(val * dpi);
  if (unit === 'cm') return Math.round((val / 2.54) * dpi);
  if (unit === 'mm') return Math.round((val / 25.4) * dpi);
  return Math.round(val);
}

export function parseInstructions(text: string): ParsedRequirement {
  const result: ParsedRequirement = {
    rawText: text,
    detectedRules: []
  };

  if (!text || !text.trim()) {
    return result;
  }

  const lower = text.toLowerCase();

  // 1. Detect Target Format
  if (lower.includes('pdf') || lower.includes('.pdf') || lower.includes('pdf format')) {
    result.targetFormat = 'PDF';
    result.detectedRules.push('Format: PDF Document');
  } else if (lower.includes('png') || lower.includes('.png')) {
    result.targetFormat = 'PNG';
    result.detectedRules.push('Format: PNG Image');
  } else if (lower.includes('webp')) {
    result.targetFormat = 'WEBP';
    result.detectedRules.push('Format: WEBP Image');
  } else if (lower.includes('jpg') || lower.includes('jpeg') || lower.includes('.jpg') || lower.includes('.jpeg')) {
    result.targetFormat = 'JPG';
    result.detectedRules.push('Format: JPEG/JPG Image');
  }

  // 2. Detect File Size Range / Limits
  const rangeMatch = lower.match(/between\s+([0-9.]+)\s*(kb|mb|k|m)?\s*(?:and|to|-)\s*([0-9.]+)\s*(kb|mb|k|m)/i) ||
                     lower.match(/([0-9.]+)\s*(kb|mb|k|m)?\s*(?:to|-)\s*([0-9.]+)\s*(kb|mb|k|m)/i);

  if (rangeMatch) {
    const minVal = parseFloat(rangeMatch[1]);
    const maxVal = parseFloat(rangeMatch[3]);
    const unit1 = (rangeMatch[2] || rangeMatch[4] || 'kb').toLowerCase();
    const unit2 = (rangeMatch[4] || 'kb').toLowerCase();

    const minMultiplier = unit1.includes('m') ? 1024 : 1;
    const maxMultiplier = unit2.includes('m') ? 1024 : 1;

    result.minSizeKB = Math.round(minVal * minMultiplier);
    result.maxSizeKB = Math.round(maxVal * maxMultiplier);
    result.targetSizeKB = Math.max(result.minSizeKB, result.maxSizeKB - 2);
    result.detectedRules.push(`Size: ${result.minSizeKB} KB – ${result.maxSizeKB} KB`);
  } else {
    const maxMatch = lower.match(/(?:max|maximum|under|less than|not exceeding|up to|below|within)\s*:?\s*([0-9.]+)\s*(kb|mb|k|m|bytes)?/i) ||
                     lower.match(/([0-9.]+)\s*(kb|mb|k|m)\s*(?:max|maximum|limit)?/i);

    if (maxMatch) {
      const val = parseFloat(maxMatch[1]);
      const unit = (maxMatch[2] || 'kb').toLowerCase();
      const multiplier = unit.includes('m') ? 1024 : 1;
      result.maxSizeKB = Math.round(val * multiplier);
      result.targetSizeKB = Math.max(10, result.maxSizeKB - Math.min(5, Math.round(result.maxSizeKB * 0.05)));
      result.detectedRules.push(`Max Size: ≤ ${result.maxSizeKB} KB`);
    }

    const minMatch = lower.match(/(?:min|minimum|at least|above|greater than)\s*:?\s*([0-9.]+)\s*(kb|mb|k|m)?/i);
    if (minMatch) {
      const val = parseFloat(minMatch[1]);
      const unit = (minMatch[2] || 'kb').toLowerCase();
      const multiplier = unit.includes('m') ? 1024 : 1;
      result.minSizeKB = Math.round(val * multiplier);
      result.detectedRules.push(`Min Size: ≥ ${result.minSizeKB} KB`);
    }
  }

  // 3. Detect Dimensions & Units
  const cmMatch = lower.match(/([0-9.]+)\s*(?:cm|cms)?\s*(?:x|\*|by|×)\s*([0-9.]+)\s*(cm|cms|mm)/i);
  if (cmMatch) {
    const w = parseFloat(cmMatch[1]);
    const h = parseFloat(cmMatch[2]);
    const unit = cmMatch[3].startsWith('mm') ? 'mm' : 'cm';
    result.width = w;
    result.height = h;
    result.unit = unit;
    result.dpi = 300;
    result.aspectRatio = `${w}:${h}`;
    const pxW = convertUnitsToPixels(w, unit, 300);
    const pxH = convertUnitsToPixels(h, unit, 300);
    result.detectedRules.push(`Dimensions: ${w}x${h}${unit} (${pxW}x${pxH}px @ 300 DPI)`);
  }

  const inchMatch = lower.match(/([0-9.]+)\s*(?:inch|inches|in|")?\s*(?:x|\*|by|×)\s*([0-9.]+)\s*(inch|inches|in|")/i);
  if (inchMatch && !cmMatch) {
    const w = parseFloat(inchMatch[1]);
    const h = parseFloat(inchMatch[2]);
    result.width = w;
    result.height = h;
    result.unit = 'in';
    result.dpi = 300;
    result.aspectRatio = `${w}:${h}`;
    const pxW = convertUnitsToPixels(w, 'in', 300);
    const pxH = convertUnitsToPixels(h, 'in', 300);
    result.detectedRules.push(`Dimensions: ${w}x${h} inch (${pxW}x${pxH}px @ 300 DPI)`);
  }

  const pxMatch = lower.match(/([0-9]{2,5})\s*(?:px|pixels)?\s*(?:x|\*|by|×)\s*([0-9]{2,5})\s*(px|pixels|dpi)?/i);
  if (pxMatch && !cmMatch && !inchMatch) {
    const w = parseInt(pxMatch[1], 10);
    const h = parseInt(pxMatch[2], 10);
    result.width = w;
    result.height = h;
    result.unit = 'px';
    result.dpi = 96;
    result.aspectRatio = `${w}:${h}`;
    result.detectedRules.push(`Dimensions: ${w}x${h} px`);
  }

  if (lower.includes('passport') || lower.includes('visa photo') || lower.includes('photograph')) {
    result.isPassportPhoto = true;
    result.detectedRules.push('Type: Official Photograph');
  }

  if (lower.includes('signature') || lower.includes('sign')) {
    result.isSignature = true;
    result.detectedRules.push('Type: Signature');
  }

  return result;
}
