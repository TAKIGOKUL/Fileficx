import { ParsedRequirement, PortalPreset } from '../types';

export const PORTAL_PRESETS: PortalPreset[] = [
  {
    id: 'upsc-photo',
    name: 'UPSC Civil Services Photo',
    category: 'GOVERNMENT',
    badge: 'UPSC',
    description: '350x350px min (up to 1000x1000), 20KB to 300KB JPG',
    instructionSample: 'Photograph in JPG format, pixel dimensions between 350x350 to 1000x1000 pixels. File size must be between 20 KB and 300 KB, clear white background.',
    requirements: {
      format: 'jpg',
      width: 350,
      height: 350,
      minSize: 20,
      maxSize: 300,
      targetSize: 270,
      dpi: 300,
      colorMode: 'rgb',
      background: '#FFFFFF'
    }
  },
  {
    id: 'ssc-cgl-photo',
    name: 'SSC CGL / CHSL Photo',
    category: 'GOVERNMENT',
    badge: 'SSC',
    description: '3.5cm x 4.5cm, 20KB - 50KB JPG',
    instructionSample: 'Upload scanned color photograph in JPEG format (20 KB to 50 KB). Image dimension of the photograph should be about 3.5 cm (width) x 4.5 cm (height).',
    requirements: {
      format: 'jpg',
      width: 413,
      height: 531,
      minSize: 20,
      maxSize: 50,
      targetSize: 45,
      dpi: 300,
      colorMode: 'rgb',
      background: '#FFFFFF'
    }
  },
  {
    id: 'ssc-signature',
    name: 'SSC Official Signature',
    category: 'GOVERNMENT',
    badge: 'SSC',
    description: '4.0cm x 2.0cm, 10KB - 20KB JPG',
    instructionSample: 'Scanned signature in JPEG format (10 KB to 20 KB). Image dimension should be about 4.0 cm (width) x 2.0 cm (height).',
    requirements: {
      format: 'jpg',
      width: 472,
      height: 236,
      minSize: 10,
      maxSize: 20,
      targetSize: 18,
      dpi: 300,
      colorMode: 'bw'
    }
  },
  {
    id: 'ibps-sbi-photo',
    name: 'IBPS / SBI Bank Photo',
    category: 'GOVERNMENT',
    badge: 'IBPS',
    description: '200x230px, 20KB to 50KB JPG',
    instructionSample: 'Photograph must be a recent passport style color picture. Dimensions 200 x 230 pixels (preferred). Size of file should be between 20kb–50kb.',
    requirements: {
      format: 'jpg',
      width: 200,
      height: 230,
      minSize: 20,
      maxSize: 50,
      targetSize: 45,
      dpi: 200,
      colorMode: 'rgb',
      background: '#FFFFFF'
    }
  },
  {
    id: 'ibps-thumb-sign',
    name: 'IBPS Thumb / Sign',
    category: 'GOVERNMENT',
    badge: 'IBPS',
    description: '140x60px signature, 10KB to 20KB JPG',
    instructionSample: 'Applicant Signature in JPEG format. Dimensions: 140 pixels width by 60 pixels height. File size between 10KB and 20KB.',
    requirements: {
      format: 'jpg',
      width: 140,
      height: 60,
      minSize: 10,
      maxSize: 20,
      targetSize: 18,
      dpi: 200,
      colorMode: 'bw'
    }
  },
  {
    id: 'nta-neet-jee',
    name: 'NTA NEET / JEE Photo',
    category: 'EXAM',
    badge: 'NTA',
    description: '10KB - 200KB passport photo, white background',
    instructionSample: 'Scanned passport photograph (size 10 kb to 200 kb) in JPG/JPEG format, clearly showing 80% face coverage with white background.',
    requirements: {
      format: 'jpg',
      width: 413,
      height: 531,
      minSize: 10,
      maxSize: 200,
      targetSize: 180,
      dpi: 300,
      colorMode: 'rgb',
      background: '#FFFFFF'
    }
  },
  {
    id: 'us-visa-ds160',
    name: 'US Visa (2x2 inch / DS-160)',
    category: 'PASSPORT',
    badge: 'US VISA',
    description: '2x2 inch (600x600px), max 240KB JPG',
    instructionSample: 'Upload a 2 x 2 inches (51 x 51 mm) photograph in JPEG format. Minimum dimension 600x600 pixels. Maximum file size 240 KB. White background required.',
    requirements: {
      format: 'jpg',
      width: 600,
      height: 600,
      minSize: 20,
      maxSize: 240,
      targetSize: 216,
      dpi: 300,
      colorMode: 'rgb',
      background: '#FFFFFF'
    }
  },
  {
    id: 'schengen-visa',
    name: 'Schengen Visa (3.5x4.5 cm)',
    category: 'PASSPORT',
    badge: 'EU VISA',
    description: '35x45mm, under 300KB JPG',
    instructionSample: 'Photograph size must be 35mm x 45mm (3.5cm x 4.5cm). JPG format only, file size must not exceed 300KB, plain background.',
    requirements: {
      format: 'jpg',
      width: 413,
      height: 531,
      minSize: 30,
      maxSize: 300,
      targetSize: 270,
      dpi: 300,
      colorMode: 'rgb',
      background: '#FFFFFF'
    }
  }
];

export const OFFICIAL_PRESETS = PORTAL_PRESETS;

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

  const raw = text.trim();
  const lower = raw.toLowerCase();

  // 1. Format detection
  const formatMatch = lower.match(/\b(jpg|jpeg|png|pdf|webp|bmp)\b/i);
  if (formatMatch) {
    const rawFmt = formatMatch[1].toLowerCase();
    if (rawFmt === 'jpeg' || rawFmt === 'jpg') {
      result.format = 'jpg';
      result.detectedRules.push('Format: JPG / JPEG');
    } else if (rawFmt === 'png') {
      result.format = 'png';
      result.detectedRules.push('Format: PNG');
    } else if (rawFmt === 'pdf') {
      result.format = 'pdf';
      result.detectedRules.push('Format: PDF Document');
    } else if (rawFmt === 'webp' || rawFmt === 'bmp') {
      result.format = 'webp';
      result.detectedRules.push(`Format: ${rawFmt.toUpperCase()}`);
    }
  }

  // 2. DPI / Resolution
  const dpiMatch = lower.match(/(\d+)\s*dpi/i) || 
                   lower.match(/(\d+)\s*ppi/i) || 
                   lower.match(/resolution[:\s]+(\d+)/i);
  if (dpiMatch) {
    result.dpi = parseInt(dpiMatch[1], 10);
    result.detectedRules.push(`Resolution: ${result.dpi} DPI`);
  } else {
    result.dpi = 300;
  }

  // 3. Dimensions - Priority: Explicit Pixels > Inches > Metric (cm/mm)
  const explicitPxMatch = lower.match(/(\d{2,5})\s*[x×*]\s*(\d{2,5})\s*(?:px|pixel|pixels)\b/i);
  const inchMatch = lower.match(/([0-9.]+)\s*(?:inch|inches|in|")\s*(?:x|×|\*|by)\s*([0-9.]+)\s*(?:inch|inches|in|")?/i) ||
                    lower.match(/([0-9.]+)\s*(?:x|×|\*|by)\s*([0-9.]+)\s*(?:inch|inches|in|")/i);
  const metricMatch = lower.match(/([0-9.]+)\s*(?:cm|mm)?\s*(?:x|×|\*|by)\s*([0-9.]+)\s*(cm|mm)\b/i);
  const fallbackPxMatch = lower.match(/(\d{2,5})\s*[x×*]\s*(\d{2,5})/i);

  if (explicitPxMatch) {
    result.width = parseInt(explicitPxMatch[1], 10);
    result.height = parseInt(explicitPxMatch[2], 10);
    result.detectedRules.push(`Dimensions: ${result.width}x${result.height} px`);
  } else if (inchMatch) {
    const w = parseFloat(inchMatch[1]);
    const h = parseFloat(inchMatch[2]);
    const activeDpi = result.dpi || 300;
    result.width = convertUnitsToPixels(w, 'in', activeDpi);
    result.height = convertUnitsToPixels(h, 'in', activeDpi);
    result.detectedRules.push(`Dimensions: ${w}x${h} inch (${result.width}x${result.height}px @ ${activeDpi} DPI)`);
  } else if (metricMatch) {
    const w = parseFloat(metricMatch[1]);
    const h = parseFloat(metricMatch[2]);
    const unit = metricMatch[3].toLowerCase() as 'cm' | 'mm';
    const activeDpi = result.dpi || 300;
    result.width = convertUnitsToPixels(w, unit, activeDpi);
    result.height = convertUnitsToPixels(h, unit, activeDpi);
    result.detectedRules.push(`Dimensions: ${w}x${h} ${unit} (${result.width}x${result.height}px @ ${activeDpi} DPI)`);
  } else if (fallbackPxMatch) {
    result.width = parseInt(fallbackPxMatch[1], 10);
    result.height = parseInt(fallbackPxMatch[2], 10);
    result.detectedRules.push(`Dimensions: ${result.width}x${result.height} px`);
  }

  // 4. File Size Range and Maximums
  const rangeMatch = lower.match(/(\d+)\s*(kb|mb)\s*(?:to|-|and)\s*(\d+)\s*(kb|mb)/i) ||
                     lower.match(/between\s+(\d+)\s*(kb|mb)?\s*(?:to|-|and)\s*(\d+)\s*(kb|mb)/i);

  if (rangeMatch) {
    const minVal = parseInt(rangeMatch[1], 10);
    const maxVal = parseInt(rangeMatch[3] || rangeMatch[4], 10);
    const unit1 = (rangeMatch[2] || rangeMatch[4] || 'kb').toLowerCase();
    const unit2 = (rangeMatch[4] || 'kb').toLowerCase();

    const minMultiplier = unit1.includes('mb') ? 1024 : 1;
    const maxMultiplier = unit2.includes('mb') ? 1024 : 1;

    result.minSize = minVal * minMultiplier;
    result.maxSize = maxVal * maxMultiplier;
    result.targetSize = Math.min(
      result.maxSize - 2,
      Math.max(result.minSize, Math.round(result.maxSize * 0.9))
    );
    result.detectedRules.push(`File Size: ${result.minSize} KB to ${result.maxSize} KB (Target: ${result.targetSize} KB)`);
  } else {
    const maxMatch = lower.match(/(?:max|maximum|under|less than|not exceeding|up to|below|within|size(?: of)?).{0,20}?(\d+)\s*(kb|mb)\b/i) ||
                     lower.match(/(\d+)\s*(kb|mb)\s*(?:limit|max|maximum)\b/i);

    if (maxMatch) {
      const val = parseInt(maxMatch[1], 10);
      const unit = maxMatch[2].toLowerCase();
      const multiplier = unit.includes('mb') ? 1024 : 1;
      result.maxSize = val * multiplier;
      result.targetSize = Math.max(10, Math.round(result.maxSize * 0.9));
      result.detectedRules.push(`Max Size: ≤ ${result.maxSize} KB (Target: ${result.targetSize} KB)`);
    }

    const minMatch = lower.match(/(?:min|minimum|at least|above|greater than).{0,20}?(\d+)\s*(kb|mb)\b/i);
    if (minMatch) {
      const val = parseInt(minMatch[1], 10);
      const unit = minMatch[2].toLowerCase();
      result.minSize = val * (unit.includes('mb') ? 1024 : 1);
      result.detectedRules.push(`Min Size: ≥ ${result.minSize} KB`);
    }
  }

  // 5. Background
  if (/white\s*background/i.test(lower) || /plain\s*background/i.test(lower) || /light\s*background/i.test(lower)) {
    result.background = '#FFFFFF';
    result.detectedRules.push('Background: White (#FFFFFF)');
  }

  // 6. Color Mode
  if (/\bgrayscale\b/i.test(lower) || /\bgrey\s*scale\b/i.test(lower)) {
    result.colorMode = 'grayscale';
    result.detectedRules.push('Color Mode: Grayscale');
  } else if (/\bblack\s*and\s*white\b/i.test(lower) || /\bb&w\b/i.test(lower)) {
    result.colorMode = 'bw';
    result.detectedRules.push('Color Mode: Black & White');
  } else {
    result.colorMode = 'rgb';
  }

  return result;
}
