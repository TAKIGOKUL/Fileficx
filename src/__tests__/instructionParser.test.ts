import { describe, it, expect } from 'vitest';
import { parseInstructions, convertUnitsToPixels } from '../utils/instructionParser';
import { PORTAL_PRESETS } from '../utils/presets';

describe('Smart Instruction Parser', () => {
  it('parses US Visa DS-160 instructions correctly', () => {
    const text = 'Upload a 2 x 2 inches (51 x 51 mm) photograph in JPEG format. Minimum dimension 600x600 pixels. Maximum file size 240 KB.';
    const parsed = parseInstructions(text);

    expect(parsed.format).toBe('jpg');
    expect(parsed.maxSize).toBe(240);
    expect(parsed.width).toBe(600);
    expect(parsed.height).toBe(600);
  });

  it('parses SSC CGL Photo instructions correctly', () => {
    const text = 'Upload scanned color photograph in JPEG format (20 KB to 50 KB). Image dimension 3.5 cm x 4.5 cm.';
    const parsed = parseInstructions(text);

    expect(parsed.format).toBe('jpg');
    expect(parsed.minSize).toBe(20);
    expect(parsed.maxSize).toBe(50);
    expect(parsed.targetSize).toBe(45);
    expect(parsed.width).toBe(413);
    expect(parsed.height).toBe(531);
  });

  it('converts units to pixels accurately', () => {
    expect(convertUnitsToPixels(2, 'in', 300)).toBe(600);
    expect(convertUnitsToPixels(3.5, 'cm', 300)).toBe(413);
  });

  it('contains valid official government & exam presets', () => {
    expect(PORTAL_PRESETS.length).toBeGreaterThan(5);
    const upsc = PORTAL_PRESETS.find(p => p.id === 'upsc-photo');
    expect(upsc).toBeDefined();
    expect(upsc?.requirements.maxSize).toBe(300);
  });
});
