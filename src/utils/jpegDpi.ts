/**
 * Writes the pixel density (DPI) into a JPEG's JFIF APP0 segment without re-encoding.
 * Patches the existing segment in place, or inserts an 18-byte one after SOI if missing.
 */
export async function setJpegDpi(blob: Blob, dpi: number): Promise<Blob> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return blob;

  const density = Math.max(1, Math.min(65535, Math.round(dpi)));
  const hi = density >> 8;
  const lo = density & 0xff;

  const hasJfif =
    bytes[2] === 0xff && bytes[3] === 0xe0 &&
    bytes[6] === 0x4a && bytes[7] === 0x46 && bytes[8] === 0x49 && bytes[9] === 0x46 && bytes[10] === 0x00;

  if (hasJfif) {
    bytes[13] = 1; // units: dots per inch
    bytes[14] = hi; bytes[15] = lo; // X density
    bytes[16] = hi; bytes[17] = lo; // Y density
    return new Blob([bytes], { type: 'image/jpeg' });
  }

  const app0 = new Uint8Array([
    0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01,
    0x01, hi, lo, hi, lo, 0x00, 0x00,
  ]);
  const out = new Uint8Array(bytes.length + app0.length);
  out.set(bytes.subarray(0, 2), 0);
  out.set(app0, 2);
  out.set(bytes.subarray(2), 2 + app0.length);
  return new Blob([out], { type: 'image/jpeg' });
}

/** Reads the DPI stored in a JPEG's JFIF header, if any. */
export async function readJpegDpi(blob: Blob): Promise<number | undefined> {
  const b = new Uint8Array(await blob.slice(0, 20).arrayBuffer());
  if (b[0] !== 0xff || b[1] !== 0xd8 || b[2] !== 0xff || b[3] !== 0xe0) return undefined;
  if (b[6] !== 0x4a || b[7] !== 0x46 || b[8] !== 0x49 || b[9] !== 0x46) return undefined;
  const x = (b[14] << 8) | b[15];
  if (b[13] === 1) return x;
  if (b[13] === 2) return Math.round(x * 2.54);
  return undefined;
}
