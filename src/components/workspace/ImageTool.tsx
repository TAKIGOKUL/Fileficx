import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Download,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowLeftRight,
  Crop,
  Maximize,
  MoveHorizontal,
  Gauge,
  Timer,
} from 'lucide-react';
import { ImageProcessingConfig, ParsedRequirement, ProcessingMetadata, SupportedFormat } from '../../types';
import { processImage } from '../../utils/imageProcessor';
import { formatFileSize, downloadBlob } from '../../utils/format';
import { Section, Segmented, NumInput, Chip, Toggle, Spinner } from './ui';

interface ImageToolProps {
  file: File;
  originalUrl: string | null;
  parsedReq: ParsedRequirement | null;
}

const SIZE_PRESETS: [number, number, string][] = [
  [200, 230, 'SSC / IBPS photo'],
  [140, 60, 'Signature'],
  [350, 350, 'UPSC photo'],
  [413, 531, '35×45 mm @300 DPI'],
  [600, 600, 'US visa'],
];

const KB_PRESETS = [20, 50, 100, 200, 240, 500];

const BACKGROUNDS = [
  { value: '#FFFFFF', label: 'White' },
  { value: '#F1F1F1', label: 'Light grey' },
  { value: '#DCEBFF', label: 'Light blue' },
  { value: '', label: 'Transparent' },
];

const initialSettings = (req: ParsedRequirement | null): ImageProcessingConfig => ({
  targetFormat: (req?.format as SupportedFormat) || 'jpg',
  resizeMode: req?.width && req?.height ? 'pixels' : 'percent',
  exactWidth: req?.width || 0,
  exactHeight: req?.height || 0,
  aspectLocked: false,
  scalePercent: 100,
  longestSide: 1200,
  shortestSide: 600,
  aspectRatioPreset: 'free',
  targetSizeKB: req?.maxSize || req?.targetSize,
  minSizeKB: req?.minSize,
  fit: 'cover',
  quality: 88,
  dpi: req?.dpi || 0,
  colorMode: req?.colorMode || 'rgb',
  backgroundFill: req?.background || '#FFFFFF',
});

type Check = { label: string; expected: string; actual: string; status: 'ok' | 'warn' | 'fail' };

export const ImageTool: React.FC<ImageToolProps> = ({ file, originalUrl, parsedReq }) => {
  const [s, setS] = useState<ImageProcessingConfig>(() => initialSettings(parsedReq));
  const [result, setResult] = useState<ProcessingMetadata | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'result' | 'original' | 'compare'>('result');
  const [copied, setCopied] = useState(false);
  const reqId = useRef(0);

  const patch = (p: Partial<ImageProcessingConfig>) => setS((prev) => ({ ...prev, ...p }));

  useEffect(() => setS(initialSettings(parsedReq)), [parsedReq]);

  // Live processing: debounce edits, ignore stale results
  useEffect(() => {
    const id = ++reqId.current;
    setBusy(true);
    const t = setTimeout(async () => {
      try {
        const r = await processImage(file, s);
        if (id !== reqId.current) {
          if (r.processedUrl) URL.revokeObjectURL(r.processedUrl);
          return;
        }
        setResult((prev) => {
          if (prev?.processedUrl) URL.revokeObjectURL(prev.processedUrl);
          return r;
        });
        setError(null);
      } catch (err) {
        if (id === reqId.current) setError(err instanceof Error ? err.message : 'Processing failed.');
      } finally {
        if (id === reqId.current) setBusy(false);
      }
    }, 220);
    return () => clearTimeout(t);
  }, [file, s]);

  const latest = useRef<ProcessingMetadata | null>(null);
  latest.current = result;
  useEffect(
    () => () => {
      reqId.current++;
      if (latest.current?.processedUrl) URL.revokeObjectURL(latest.current.processedUrl);
    },
    []
  );

  const limitOn = s.targetSizeKB !== undefined;
  const supportsTransparency = s.targetFormat === 'png' || s.targetFormat === 'webp';

  const checks = useMemo<Check[]>(() => {
    if (!result) return [];
    const out: Check[] = [];
    const rw = result.processedDimensions?.width ?? 0;
    const rh = result.processedDimensions?.height ?? 0;
    const wantW = parsedReq?.width ?? (s.resizeMode === 'pixels' ? s.exactWidth : 0);
    const wantH = parsedReq?.height ?? (s.resizeMode === 'pixels' ? s.exactHeight : 0);
    if (wantW && wantH) {
      out.push({ label: 'Dimensions', expected: `${wantW} × ${wantH} px`, actual: `${rw} × ${rh} px`, status: rw === wantW && rh === wantH ? 'ok' : 'fail' });
    } else {
      out.push({ label: 'Dimensions', expected: 'Any', actual: `${rw} × ${rh} px`, status: 'ok' });
    }

    const kb = (result.processedSize ?? 0) / 1024;
    const max = parsedReq?.maxSize ?? s.targetSizeKB;
    const min = parsedReq?.minSize ?? s.minSizeKB;
    if (max) {
      const ok = kb <= max && (!min || kb >= min);
      out.push({
        label: 'File size',
        expected: min ? `${min}–${max} KB` : `≤ ${max} KB`,
        actual: `${kb.toFixed(1)} KB`,
        status: ok ? 'ok' : 'fail',
      });
    } else {
      out.push({ label: 'File size', expected: 'No limit', actual: `${kb.toFixed(1)} KB`, status: 'ok' });
    }

    const wantFmt = (parsedReq?.format ?? s.targetFormat).toUpperCase();
    const gotFmt = s.targetFormat.toUpperCase();
    out.push({ label: 'Format', expected: wantFmt, actual: gotFmt, status: wantFmt === gotFmt ? 'ok' : 'fail' });

    const wantDpi = parsedReq?.dpi;
    if (wantDpi || s.dpi) {
      const written = s.targetFormat === 'jpg' || s.targetFormat === 'pdf' ? s.dpi : 0;
      out.push({
        label: 'DPI',
        expected: wantDpi ? `${wantDpi}` : `${s.dpi}`,
        actual: written ? `${written}` : 'Not stored',
        status: written && (!wantDpi || written === wantDpi) ? 'ok' : 'warn',
      });
    }
    return out;
  }, [result, s, parsedReq]);

  const allOk = checks.length > 0 && checks.every((c) => c.status === 'ok');

  const copyImage = async () => {
    if (!result?.processedBlob) return;
    try {
      let png = result.processedBlob;
      if (png.type !== 'image/png') {
        const bmp = await createImageBitmap(png);
        const c = document.createElement('canvas');
        c.width = bmp.width;
        c.height = bmp.height;
        c.getContext('2d')!.drawImage(bmp, 0, 0);
        png = await new Promise<Blob>((res, rej) => c.toBlob((b) => (b ? res(b) : rej()), 'image/png'));
      }
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': png })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError('Copying images isn’t supported in this browser. Use Download instead.');
    }
  };

  const savedPct = result?.compressionRatio ?? 0;

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_380px] gap-5 items-start">
      {/* ─── Preview column ─── */}
      <div className="space-y-5 min-w-0">
        <div className="hero-card overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-[var(--border-subtle)]">
            <div className="w-full max-w-[300px]">
              <Segmented
                ariaLabel="Preview mode"
                size="sm"
                value={view}
                onChange={setView}
                options={[
                  { value: 'result', label: 'Result' },
                  { value: 'original', label: 'Original' },
                  { value: 'compare', label: <><ArrowLeftRight className="w-3.5 h-3.5" /> Compare</> },
                ]}
              />
            </div>
            <span className={`inline-flex items-center gap-1.5 text-[11.5px] font-semibold ${busy ? 'text-[var(--text-muted)]' : 'text-[var(--success)]'}`} aria-live="polite">
              {busy ? <><Spinner className="w-3.5 h-3.5" /> Updating…</> : result ? <><CheckCircle2 className="w-3.5 h-3.5" /> Up to date</> : null}
            </span>
          </div>

          <div className={`grid ${view === 'compare' ? 'grid-cols-2 divide-x divide-[var(--border-subtle)]' : 'grid-cols-1'} bg-checker`}>
            {(view === 'original' || view === 'compare') && (
              <PreviewFrame label={view === 'compare' ? 'Original' : undefined} url={originalUrl} meta={formatFileSize(file.size)} />
            )}
            {(view === 'result' || view === 'compare') && (
              <PreviewFrame
                label={view === 'compare' ? 'Result' : undefined}
                url={result?.processedFormat === 'pdf' ? null : result?.processedUrl ?? null}
                meta={result ? formatFileSize(result.processedSize ?? 0) : undefined}
                placeholder={result?.processedFormat === 'pdf' ? 'PDF ready. Download to view it.' : 'Preparing preview…'}
                static_={result?.processedFormat === 'pdf'}
                dimmed={busy}
              />
            )}
          </div>
        </div>

        {error && (
          <div role="alert" className="flex gap-3 rounded-2xl border border-[var(--danger)]/35 bg-[var(--danger)]/10 p-4 text-sm text-[var(--text-primary)]">
            <XCircle className="w-5 h-5 shrink-0 text-[var(--danger)]" />
            <p>{error}</p>
          </div>
        )}

        {/* Checks + stats */}
        <div className="grid md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-5">
          <div className="hero-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[13px] font-bold text-[var(--text-primary)]">Portal checks</h3>
              {result && (
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                    allOk ? 'bg-[var(--success-subtle)] text-[var(--success)]' : 'bg-[var(--danger)]/10 text-[var(--danger)]'
                  }`}
                >
                  {allOk ? 'Ready to upload' : 'Needs attention'}
                </span>
              )}
            </div>
            <ul className="space-y-2.5">
              {checks.map((c) => (
                <li key={c.label} className="flex items-center gap-3 text-sm">
                  {c.status === 'ok' ? (
                    <CheckCircle2 className="w-[18px] h-[18px] shrink-0 text-[var(--success)]" />
                  ) : c.status === 'warn' ? (
                    <AlertTriangle className="w-[18px] h-[18px] shrink-0 text-[var(--warning)]" />
                  ) : (
                    <XCircle className="w-[18px] h-[18px] shrink-0 text-[var(--danger)]" />
                  )}
                  <span className="font-medium text-[var(--text-secondary)] w-24 shrink-0">{c.label}</span>
                  <span className="font-mono text-[13px] font-semibold text-[var(--text-primary)] truncate">{c.actual}</span>
                  <span className="ml-auto font-mono text-[11.5px] text-[var(--text-muted)] whitespace-nowrap">need {c.expected}</span>
                </li>
              ))}
              {!result && <li className="text-sm text-[var(--text-muted)]">Checking your file…</li>}
            </ul>
            {result?.sizeUnmet === 'under' && (
              <p className="mt-3 text-xs text-[var(--warning)]">
                The image is too simple to reach the minimum KB at this size. Try a larger pixel size or the original photo.
              </p>
            )}
            {result?.sizeUnmet === 'over' && (
              <p className="mt-3 text-xs text-[var(--danger)]">This file can’t fit the KB limit at these dimensions. Try smaller dimensions.</p>
            )}
          </div>

          <div className="hero-card p-5 grid grid-cols-2 gap-4 content-start">
            <Stat label="Original" value={formatFileSize(file.size)} />
            <Stat label="Result" value={result ? formatFileSize(result.processedSize ?? 0) : '…'} accent />
            <Stat icon={<Gauge className="w-3.5 h-3.5" />} label="Saved" value={result ? `${Math.max(0, savedPct)}%` : '…'} />
            <Stat icon={<Timer className="w-3.5 h-3.5" />} label="Time" value={result ? `${result.processingTimeMs} ms` : '…'} />
          </div>
        </div>
      </div>

      {/* ─── Controls column ─── */}
      <aside className="lg:sticky lg:top-24 space-y-4">
        <div className="hero-card p-5 lg:max-h-[calc(100vh-15rem)] lg:overflow-y-auto">
          <Section title="Dimensions">
            <Segmented
              ariaLabel="Resize mode"
              value={s.resizeMode === 'pixels' ? 'pixels' : s.resizeMode === 'longest' ? 'longest' : 'percent'}
              onChange={(v) => patch({ resizeMode: v })}
              options={[
                { value: 'pixels', label: 'Exact size' },
                { value: 'percent', label: 'Scale' },
                { value: 'longest', label: 'Max side' },
              ]}
            />
            <div className="mt-3">
              {s.resizeMode === 'pixels' && (
                <>
                  <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
                    <NumInput label="Width" suffix="px" min={1} max={12000} value={s.exactWidth || undefined} placeholder="Auto" onChange={(v) => patch({ exactWidth: v ?? 0 })} />
                    <button
                      type="button"
                      onClick={() => patch({ exactWidth: s.exactHeight, exactHeight: s.exactWidth })}
                      className="mb-1 p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--accent-text)] hover:bg-[var(--hover-surface)] cursor-pointer"
                      title="Swap width and height"
                      aria-label="Swap width and height"
                    >
                      <ArrowLeftRight className="w-4 h-4" />
                    </button>
                    <NumInput label="Height" suffix="px" min={1} max={12000} value={s.exactHeight || undefined} placeholder="Auto" onChange={(v) => patch({ exactHeight: v ?? 0 })} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {SIZE_PRESETS.map(([w, h, t]) => (
                      <Chip key={t} title={t} active={s.exactWidth === w && s.exactHeight === h} onClick={() => patch({ exactWidth: w, exactHeight: h })}>
                        {w}×{h}
                      </Chip>
                    ))}
                  </div>
                  <div className="mt-4">
                    <span className="block text-[11px] font-medium text-[var(--text-muted)] mb-1">If the shape differs</span>
                    <Segmented
                      ariaLabel="Fit mode"
                      size="sm"
                      value={s.fit ?? 'cover'}
                      onChange={(v) => patch({ fit: v })}
                      options={[
                        { value: 'cover', label: <><Crop className="w-3.5 h-3.5" /> Crop</>, title: 'Fill the frame, trimming edges' },
                        { value: 'contain', label: <><Maximize className="w-3.5 h-3.5" /> Fit</>, title: 'Show everything, pad with background' },
                        { value: 'stretch', label: <><MoveHorizontal className="w-3.5 h-3.5" /> Stretch</>, title: 'Distort to fit exactly' },
                      ]}
                    />
                  </div>
                </>
              )}
              {s.resizeMode === 'percent' && (
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-[var(--text-muted)]">Scale</span>
                    <span className="font-mono font-bold text-[var(--text-primary)]">{s.scalePercent}%</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={100}
                    value={s.scalePercent}
                    onChange={(e) => patch({ scalePercent: Number(e.target.value) })}
                    className="w-full accent-[var(--accent)] cursor-pointer"
                    aria-label="Scale percent"
                  />
                </div>
              )}
              {s.resizeMode === 'longest' && (
                <NumInput label="Longest side" suffix="px" min={16} max={12000} value={s.longestSide} onChange={(v) => v && patch({ longestSide: v })} />
              )}
            </div>
          </Section>

          <Section
            title="File size"
            action={<Toggle label="Limit file size" checked={limitOn} onChange={(on) => patch(on ? { targetSizeKB: 50 } : { targetSizeKB: undefined, minSizeKB: undefined })} />}
            hint={limitOn ? 'We pick the sharpest quality that lands inside this range.' : undefined}
          >
            {limitOn ? (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <NumInput label="Minimum" suffix="KB" allowEmpty placeholder="None" min={1} value={s.minSizeKB} onChange={(v) => patch({ minSizeKB: v })} />
                  <NumInput label="Maximum" suffix="KB" min={2} value={s.targetSizeKB} onChange={(v) => v && patch({ targetSizeKB: v })} />
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {KB_PRESETS.map((kb) => (
                    <Chip key={kb} active={s.targetSizeKB === kb} onClick={() => patch({ targetSizeKB: kb })}>
                      ≤{kb}KB
                    </Chip>
                  ))}
                </div>
              </>
            ) : (
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-[var(--text-muted)]">Quality</span>
                  <span className="font-mono font-bold text-[var(--text-primary)]">{s.targetFormat === 'png' ? 'Lossless' : `${s.quality}%`}</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  disabled={s.targetFormat === 'png'}
                  value={s.quality}
                  onChange={(e) => patch({ quality: Number(e.target.value) })}
                  className="w-full accent-[var(--accent)] cursor-pointer disabled:opacity-40"
                  aria-label="Quality"
                />
              </div>
            )}
          </Section>

          <Section title="Format" hint={s.targetFormat === 'png' && limitOn ? 'PNG is lossless, so KB limits are ignored. Use JPG to hit a size.' : undefined}>
            <Segmented
              ariaLabel="Output format"
              value={s.targetFormat}
              onChange={(v) => patch({ targetFormat: v, backgroundFill: v === 'jpg' || v === 'pdf' ? s.backgroundFill || '#FFFFFF' : s.backgroundFill })}
              options={[
                { value: 'jpg', label: 'JPG' },
                { value: 'png', label: 'PNG' },
                { value: 'webp', label: 'WEBP' },
                { value: 'pdf', label: 'PDF' },
              ]}
            />
          </Section>

          <Section title="Appearance">
            <Segmented
              ariaLabel="Colour mode"
              size="sm"
              value={s.colorMode}
              onChange={(v) => patch({ colorMode: v })}
              options={[
                { value: 'rgb', label: 'Colour' },
                { value: 'grayscale', label: 'Grayscale' },
                { value: 'bw', label: 'Black & white' },
              ]}
            />
            <span className="block text-[11px] font-medium text-[var(--text-muted)] mt-4 mb-2">Background</span>
            <div className="flex flex-wrap items-center gap-2">
              {BACKGROUNDS.filter((b) => b.value || supportsTransparency).map((b) => (
                <button
                  key={b.label}
                  type="button"
                  onClick={() => patch({ backgroundFill: b.value })}
                  title={b.label}
                  aria-label={`${b.label} background`}
                  aria-pressed={s.backgroundFill === b.value}
                  className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer ${
                    s.backgroundFill === b.value ? 'border-[var(--accent)] scale-110' : 'border-[var(--border)] hover:scale-105'
                  } ${b.value ? '' : 'bg-checker'}`}
                  style={b.value ? { background: b.value } : undefined}
                />
              ))}
              <label className="relative w-8 h-8 rounded-full border-2 border-dashed border-[var(--border)] cursor-pointer overflow-hidden" title="Custom colour">
                <input
                  type="color"
                  value={s.backgroundFill || '#ffffff'}
                  onChange={(e) => patch({ backgroundFill: e.target.value })}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  aria-label="Custom background colour"
                />
                <span className="absolute inset-1 rounded-full" style={{ background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }} />
              </label>
            </div>
            <p className="mt-2 text-[11.5px] text-[var(--text-muted)]">Fills transparent areas and any padding from “Fit”.</p>
          </Section>

          <Section title="Print resolution (DPI)" hint={s.targetFormat === 'jpg' || s.targetFormat === 'pdf' ? 'Written into the file header. Pixels are unchanged.' : 'DPI is stored for JPG and PDF only.'}>
            <Segmented
              ariaLabel="DPI"
              size="sm"
              value={[0, 72, 150, 200, 300].includes(s.dpi) ? s.dpi : -1}
              onChange={(v) => v >= 0 && patch({ dpi: v })}
              options={[
                { value: 0, label: 'Keep' },
                { value: 72, label: '72' },
                { value: 150, label: '150' },
                { value: 200, label: '200' },
                { value: 300, label: '300' },
              ]}
            />
          </Section>
        </div>

        {/* Download bar */}
        <div className="sticky bottom-3 lg:static z-20 hero-card !rounded-2xl p-3 flex items-center gap-2 shadow-[var(--shadow-lift)]">
          <div className="min-w-0 flex-1 px-1">
            <p className="text-[11px] text-[var(--text-muted)] truncate" title={result?.downloadFilename}>
              {result?.downloadFilename ?? 'Preparing…'}
            </p>
            <p className="font-mono text-sm font-bold text-[var(--text-primary)]">{result ? formatFileSize(result.processedSize ?? 0) : '…'}</p>
          </div>
          <button
            type="button"
            onClick={copyImage}
            disabled={!result || busy || s.targetFormat === 'pdf'}
            className="btn btn-outline !px-3"
            title="Copy image"
            aria-label="Copy image"
          >
            {copied ? <Check className="w-4 h-4 text-[var(--success)]" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => result?.processedBlob && downloadBlob(result.processedBlob, result.downloadFilename || 'fileficx-output')}
            disabled={!result || busy}
            className="btn btn-primary"
          >
            <Download className="w-4 h-4" /> Download
          </button>
        </div>
      </aside>
    </div>
  );
};

const PreviewFrame: React.FC<{ url: string | null | undefined; label?: string; meta?: string; placeholder?: string; dimmed?: boolean; static_?: boolean }> = ({
  url,
  label,
  meta,
  placeholder = 'Loading…',
  dimmed,
  static_,
}) => (
  <div className="relative h-[300px] sm:h-[420px] flex items-center justify-center p-4 sm:p-8">
    {label && (
      <span className="absolute top-3 left-3 text-[10.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[var(--bg-elevated)]/90 text-[var(--text-secondary)] border border-[var(--border-subtle)]">
        {label}
      </span>
    )}
    {url ? (
      <img src={url} alt={label ?? 'Preview'} className={`max-w-full max-h-full object-contain shadow-[var(--shadow-lift)] transition-opacity ${dimmed ? 'opacity-60' : ''}`} />
    ) : (
      <span className="text-sm text-[var(--text-muted)] flex items-center gap-2">
        {!static_ && <Spinner />} {placeholder}
      </span>
    )}
    {meta && (
      <span className="absolute bottom-3 right-3 text-[10.5px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[var(--bg-elevated)]/90 text-[var(--text-secondary)] border border-[var(--border-subtle)]">
        {meta}
      </span>
    )}
  </div>
);

const Stat: React.FC<{ label: string; value: string; icon?: React.ReactNode; accent?: boolean }> = ({ label, value, icon, accent }) => (
  <div>
    <p className="text-[11px] text-[var(--text-muted)] font-medium flex items-center gap-1">
      {icon}
      {label}
    </p>
    <p className={`font-mono text-[15px] font-bold mt-0.5 ${accent ? 'text-[var(--accent-text)]' : 'text-[var(--text-primary)]'}`}>{value}</p>
  </div>
);
