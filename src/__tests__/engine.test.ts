import { describe, it, expect } from 'vitest';
import { setJpegDpi, readJpegDpi } from '../utils/jpegDpi';
import { calculateOutputDimensions } from '../utils/imagePipeline';
import { parsePageRange } from '../utils/pdfProcessor';
import type { ImageProcessingConfig } from '../types';

const jfifJpeg = () =>
  new Blob(
    [new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0xff, 0xd9])],
    { type: 'image/jpeg' }
  );

const base: ImageProcessingConfig = {
  targetFormat: 'jpg',
  resizeMode: 'pixels',
  exactWidth: 200,
  exactHeight: 230,
  aspectLocked: false,
  scalePercent: 100,
  longestSide: 1000,
  shortestSide: 500,
  aspectRatioPreset: 'free',
  quality: 85,
  dpi: 200,
  colorMode: 'rgb',
  backgroundFill: '#FFFFFF',
};

describe('JPEG DPI header', () => {
  it('patches an existing JFIF segment in place', async () => {
    const out = await setJpegDpi(jfifJpeg(), 200);
    expect(out.size).toBe(jfifJpeg().size);
    expect(await readJpegDpi(out)).toBe(200);
  });

  it('inserts a JFIF segment when missing', async () => {
    const bare = new Blob([new Uint8Array([0xff, 0xd8, 0xff, 0xdb, 0x00, 0x02, 0xff, 0xd9])], { type: 'image/jpeg' });
    const out = await setJpegDpi(bare, 300);
    expect(out.size).toBe(bare.size + 18);
    expect(await readJpegDpi(out)).toBe(300);
  });

  it('leaves non-JPEG data untouched', async () => {
    const png = new Blob([new Uint8Array([0x89, 0x50, 0x4e, 0x47])]);
    expect(await setJpegDpi(png, 300)).toBe(png);
  });
});

describe('calculateOutputDimensions', () => {
  it('uses exact pixels', () => {
    expect(calculateOutputDimensions(4000, 3000, base)).toEqual({ targetW: 200, targetH: 230 });
  });
  it('scales by longest side keeping aspect', () => {
    expect(calculateOutputDimensions(4000, 3000, { ...base, resizeMode: 'longest', longestSide: 1000 })).toEqual({ targetW: 1000, targetH: 750 });
  });
  it('scales by percent', () => {
    expect(calculateOutputDimensions(1000, 500, { ...base, resizeMode: 'percent', scalePercent: 50 })).toEqual({ targetW: 500, targetH: 250 });
  });
});

describe('parsePageRange', () => {
  it('parses ranges and singles, clamps, dedupes, sorts', () => {
    expect(parsePageRange('5, 1-3, 2, 9-12', 10)).toEqual([0, 1, 2, 4, 8, 9]);
  });
  it('ignores garbage', () => {
    expect(parsePageRange('a, 0, -', 5)).toEqual([]);
  });
});
