import { PortalPreset } from '../types';

export const PORTAL_PRESETS: PortalPreset[] = [
  {
    id: 'ssc-photo',
    name: 'SSC CGL / CHSL Photo',
    category: 'GOVERNMENT',
    badge: 'SSC.GOV.IN',
    description: 'Photo: JPG, 20KB to 50KB, dimensions 200x230 pixels, light/white background',
    instructionSample: 'Upload photo in JPG format, size should be between 20KB to 50KB, dimensions 200x230 pixels, resolution 200 DPI, white background',
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
    id: 'ssc-sign',
    name: 'SSC Signature',
    category: 'GOVERNMENT',
    badge: 'SSC SIGN',
    description: 'Signature: JPG, 10KB to 20KB, dimensions 140x60 pixels, black ink on white paper',
    instructionSample: 'Signature in JPG format, size between 10KB to 20KB, dimensions 140x60 pixels, 200 DPI, black and white / grayscale',
    requirements: {
      format: 'jpg',
      width: 140,
      height: 60,
      minSize: 10,
      maxSize: 20,
      targetSize: 17,
      dpi: 200,
      colorMode: 'grayscale',
      background: '#FFFFFF'
    }
  },
  {
    id: 'upsc-photo',
    name: 'UPSC Civil Services Photo',
    category: 'GOVERNMENT',
    badge: 'UPSC ORA',
    description: 'Photo: JPG, 20KB to 300KB, square aspect ratio 350x350 pixels (300 DPI)',
    instructionSample: 'Upload scanned photograph in JPG/JPEG format, file size between 20KB to 300KB, dimensions 350x350 pixels minimum, 300 DPI, plain background',
    requirements: {
      format: 'jpg',
      width: 350,
      height: 350,
      minSize: 20,
      maxSize: 300,
      targetSize: 250,
      dpi: 300,
      colorMode: 'rgb',
      background: '#FFFFFF'
    }
  },
  {
    id: 'ibps-photo',
    name: 'IBPS / SBI Bank PO Photo',
    category: 'EXAM',
    badge: 'IBPS / SBI',
    description: 'Photo: JPG, 20KB to 50KB, 200x230 pixels, clear face on light background',
    instructionSample: 'Photograph must be a recent passport style color picture. Dimensions 200 x 230 pixels, file size 20KB - 50KB, JPG format, 200 DPI',
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
    id: 'neet-photo',
    name: 'NTA NEET / JEE Passport Photo',
    category: 'EXAM',
    badge: 'NTA EXAM',
    description: 'Photo: JPG, 10KB to 200KB, 3.5x4.5 cm (413x531 px @ 300 DPI), 80% face coverage',
    instructionSample: 'Passport size photograph in JPG format, size 10KB to 200KB, dimensions 3.5cm x 4.5cm, 300 DPI, white background with 80% face coverage without mask',
    requirements: {
      format: 'jpg',
      width: 413,
      height: 531,
      minSize: 10,
      maxSize: 200,
      targetSize: 150,
      dpi: 300,
      colorMode: 'rgb',
      background: '#FFFFFF'
    }
  },
  {
    id: 'passport-seva',
    name: 'Passport Seva Kendra Photo',
    category: 'PASSPORT',
    badge: 'PASSPORT SEVA',
    description: 'Official Indian Passport: 35x45 mm (413x531 px), 20KB to 50KB, plain white background',
    instructionSample: 'Applicant photograph in JPEG format. Dimensions: 35mm x 45mm, file size: 20KB to 50KB, white background, resolution 300 DPI, front facing',
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
    id: 'tcs-photo',
    name: 'TCS iON / MNC Job Photo',
    category: 'MNC',
    badge: 'TCS / INFOSYS',
    description: 'Corporate Application: JPG/PNG, max 200KB, formal headshot 400x500 px',
    instructionSample: 'Upload formal passport size photo in JPG or PNG format, maximum size 200KB, dimensions 400x500 pixels, plain background',
    requirements: {
      format: 'jpg',
      width: 400,
      height: 500,
      minSize: 10,
      maxSize: 200,
      targetSize: 160,
      dpi: 200,
      colorMode: 'rgb',
      background: '#FFFFFF'
    }
  }
];
