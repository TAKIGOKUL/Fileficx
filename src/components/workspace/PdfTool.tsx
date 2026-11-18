import React, { useEffect, useRef, useState } from 'react';
import {
  Minimize2,
  Scissors,
  Trash2,
  RotateCw,
  Files,
  Images,
  Download,
  Archive,
  ArrowUp,
  ArrowDown,
  X,
  Plus,
  CheckCircle2,
  XCircle,
  FileText,
} from 'lucide-react';
import { ProcessingMetadata } from '../../types';
import { processPDF, mergePDFs, renderPDFPagesToImages, createZipFromBlobs, renderThumbnails, parsePageRange } from '../../utils/pdfProcessor';
import { formatFileSize, downloadBlob } from '../../utils/format';
import { Section, Segmented, NumInput, Chip, Toggle, Spinner } from './ui';

type Tool = 'compress' | 'split' | 'remove' | 'rotate' | 'merge' | 'images';

const TOOLS: { id: Tool; label: string; desc: string; Icon: React.ElementType }[] = [
  { id: 'compress', label: 'Compress', desc: 'Fit under a KB limit', Icon: Minimize2 },
  { id: 'split', label: 'Extract pages', desc: 'Keep only selected pages', Icon: Scissors },
  { id: 'remove', label: 'Delete pages', desc: 'Drop selected pages', Icon: Trash2 },
  { id: 'rotate', label: 'Rotate', desc: 'Fix sideways scans', Icon: RotateCw },
  { id: 'merge', label: 'Merge', desc: 'Combine PDFs & images', Icon: Files },
  { id: 'images', label: 'To images', desc: 'Export pages as JPG/PNG', Icon: Images },
];

const KB_TARGETS = [100, 200, 300, 500, 1024, 2048];

interface PdfToolProps {
  file: File;
  pageCount?: number;
}

export const PdfTool: React.FC<PdfToolProps> = ({ file, pageCount = 0 }) => {
  const [tool, setTool] = useState<Tool>('compress');
  const [thumbs, setThumbs] = useState<(string | undefined)[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [rangeText, setRangeText] = useState('');

  const [targetKB, setTargetKB] = useState(300);
  const [grayscale, setGrayscale] = useState(false);
  const [angle, setAngle] = useState<90 | 180 | 270>(90);
  const [imgFormat, setImgFormat] = useState<'jpg' | 'png'>('jpg');
  const [imgDpi, setImgDpi] = useState(150);
  const [mergeFiles, setMergeFiles] = useState<File[]>([file]);

  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProcessingMetadata | null>(null);
  const [images, setImages] = useState<{ pageIndex: number; blob: Blob; url: string }[]>([]);
  const addRef = useRef<HTMLInputElement>(null);

  // Progressive thumbnails
  useEffect(() => {
    let cancelled = false;
    const urls: string[] = [];
    setThumbs(Array(pageCount).fill(undefined));
    if (pageCount > 0) {
      renderThumbnails(
        file,
        (i, url) => {
          urls.push(url);
          setThumbs((t) => {
            const n = [...t];
            n[i] = url;
            return n;
          });
        },
        () => cancelled
      ).catch(() => undefined);
    }
    return () => {
      cancelled = true;
      urls.forEach(URL.revokeObjectURL);
    };
  }, [file, pageCount]);

  useEffect(() => {
    setResult(null);
    setImages([]);
    setError(null);
  }, [tool]);

  const usesSelection = tool === 'split' || tool === 'remove' || tool === 'rotate' || tool === 'images';

  const toggle = (i: number) =>
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      setRangeText(toRange([...n]));
      return n;
    });

  const run = async () => {
    setBusy(true);
    setError(null);
    setResult(null);
    setImages([]);
    try {
      const pages = [...selected].sort((a, b) => a - b);
      if (tool === 'merge') {
        if (mergeFiles.length < 2) throw new Error('Add at least one more file to merge.');
        setResult(await mergePDFs(mergeFiles));
      } else if (tool === 'images') {
        const imgs = await renderPDFPagesToImages(file, imgFormat, 0.9, imgDpi, pages, (d, t) => setProgress(`Rendering page ${d} of ${t}…`));
        setImages(imgs);
      } else {
        if ((tool === 'split' || tool === 'remove') && pages.length === 0) throw new Error('Select pages first: tap the thumbnails or type a range.');
        const mode = tool === 'split' ? 'split' : tool;
        setResult(
          await processPDF(file, { mode, pages, targetSizeKB: tool === 'compress' ? targetKB : undefined, grayscale, rotateAngle: angle }, setProgress)
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setBusy(false);
      setProgress('');
    }
  };

  const zipAll = async () => {
    const zip = await createZipFromBlobs(images.map((im) => ({ filename: `page_${im.pageIndex}.${imgFormat}`, blob: im.blob })));
    downloadBlob(zip, `${file.name.replace(/\.pdf$/i, '')}_pages.zip`);
  };

  const runLabel: Record<Tool, string> = {
    compress: `Compress to ≤ ${targetKB} KB`,
    split: `Extract ${selected.size || ''} page${selected.size === 1 ? '' : 's'}`,
    remove: `Delete ${selected.size || ''} page${selected.size === 1 ? '' : 's'}`,
    rotate: `Rotate ${selected.size ? `${selected.size} page${selected.size === 1 ? '' : 's'}` : 'all pages'}`,
    merge: `Merge ${mergeFiles.length} files`,
    images: `Export ${selected.size || 'all'} page${selected.size === 1 ? '' : 's'}`,
  };

  const resultOk = result && (tool !== 'compress' || (result.processedSize ?? 0) <= targetKB * 1024);

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_380px] gap-5 items-start">
      {/* ─── Pages / merge list ─── */}
      <div className="space-y-5 min-w-0">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {TOOLS.map(({ id, label, desc, Icon }) => (
            <button
              key={id}
              onClick={() => setTool(id)}
              aria-pressed={tool === id}
              title={desc}
              className={`rounded-2xl border p-3 text-left transition-all cursor-pointer ${
                tool === id
                  ? 'border-[var(--accent)] bg-[var(--accent-subtle)] shadow-[var(--shadow-glow)]'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[var(--accent-border)]'
              }`}
            >
              <Icon className={`w-5 h-5 mb-2 ${tool === id ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`} />
              <span className="block text-[12.5px] font-bold text-[var(--text-primary)] leading-tight">{label}</span>
              <span className="hidden sm:block text-[10.5px] text-[var(--text-muted)] mt-0.5 leading-snug">{desc}</span>
            </button>
          ))}
        </div>

        {tool === 'merge' ? (
          <div className="hero-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[13px] font-bold text-[var(--text-primary)]">Files to merge, in order</h3>
              <button onClick={() => addRef.current?.click()} className="btn btn-outline text-xs !py-1.5 !px-3">
                <Plus className="w-3.5 h-3.5" /> Add files
              </button>
              <input
                ref={addRef}
                type="file"
                multiple
                accept="application/pdf,image/jpeg,image/png,.pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) setMergeFiles((m) => [...m, ...Array.from(e.target.files!)]);
                  e.target.value = '';
                }}
              />
            </div>
            <ol className="space-y-2">
              {mergeFiles.map((f, i) => (
                <li key={`${f.name}-${i}`} className="flex items-center gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2.5">
                  <span className="w-6 text-center font-mono text-xs text-[var(--text-muted)]">{i + 1}</span>
                  <FileText className="w-4 h-4 text-[var(--accent)] shrink-0" />
                  <span className="text-sm font-medium text-[var(--text-primary)] truncate flex-1">{f.name}</span>
                  <span className="text-[11px] font-mono text-[var(--text-muted)]">{formatFileSize(f.size)}</span>
                  <div className="flex items-center">
                    <IconBtn label="Move up" disabled={i === 0} onClick={() => setMergeFiles((m) => swap(m, i, i - 1))}>
                      <ArrowUp className="w-3.5 h-3.5" />
                    </IconBtn>
                    <IconBtn label="Move down" disabled={i === mergeFiles.length - 1} onClick={() => setMergeFiles((m) => swap(m, i, i + 1))}>
                      <ArrowDown className="w-3.5 h-3.5" />
                    </IconBtn>
                    <IconBtn label="Remove" onClick={() => setMergeFiles((m) => m.filter((_, j) => j !== i))}>
                      <X className="w-3.5 h-3.5" />
                    </IconBtn>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-[11.5px] text-[var(--text-muted)]">Images are added as full pages. Merged files never leave your device.</p>
          </div>
        ) : (
          <div className="hero-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h3 className="text-[13px] font-bold text-[var(--text-primary)]">
                {pageCount} page{pageCount === 1 ? '' : 's'}
                {usesSelection && <span className="ml-2 font-medium text-[var(--text-muted)]">· {selected.size} selected</span>}
              </h3>
              {usesSelection && (
                <div className="flex gap-1.5">
                  <Chip
                    onClick={() => {
                      const all = new Set(Array.from({ length: pageCount }, (_, i) => i));
                      setSelected(all);
                      setRangeText(toRange([...all]));
                    }}
                  >
                    Select all
                  </Chip>
                  <Chip
                    onClick={() => {
                      setSelected(new Set());
                      setRangeText('');
                    }}
                  >
                    Clear
                  </Chip>
                </div>
              )}
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 xl:grid-cols-5 gap-3 max-h-[560px] overflow-y-auto pr-1">
              {Array.from({ length: pageCount }, (_, i) => {
                const on = selected.has(i);
                const rotation = tool === 'rotate' && (on || selected.size === 0) ? angle : 0;
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={!usesSelection}
                    onClick={() => toggle(i)}
                    aria-pressed={on}
                    aria-label={`Page ${i + 1}`}
                    className={`group relative rounded-xl border-2 p-1.5 bg-[var(--bg-elevated)] transition-all ${
                      usesSelection ? 'cursor-pointer' : 'cursor-default'
                    } ${
                      on
                        ? tool === 'remove'
                          ? 'border-[var(--danger)]'
                          : 'border-[var(--accent)]'
                        : 'border-[var(--border-subtle)] hover:border-[var(--border)]'
                    }`}
                  >
                    <div className="aspect-[3/4] flex items-center justify-center overflow-hidden rounded-md bg-white">
                      {thumbs[i] ? (
                        <img
                          src={thumbs[i]}
                          alt=""
                          className={`max-w-full max-h-full object-contain transition-transform duration-300 ${tool === 'remove' && on ? 'opacity-30' : ''}`}
                          style={{ transform: `rotate(${rotation}deg)` }}
                        />
                      ) : (
                        <Spinner className="w-4 h-4 text-[#bbb]" />
                      )}
                    </div>
                    <span className="block mt-1 text-[10.5px] font-mono font-semibold text-[var(--text-muted)]">{i + 1}</span>
                    {on && (
                      <span
                        className={`absolute top-2.5 right-2.5 w-5 h-5 rounded-full text-white flex items-center justify-center ${
                          tool === 'remove' ? 'bg-[var(--danger)]' : 'bg-[var(--accent)]'
                        }`}
                      >
                        {tool === 'remove' ? <X className="w-3 h-3" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ─── Options + run ─── */}
      <aside className="lg:sticky lg:top-24 space-y-4">
        <div className="hero-card p-5">
          {tool === 'compress' && (
            <>
              <Section title="Target size" hint="We try lossless optimisation first, and rasterise pages only if that isn't enough.">
                <NumInput label="Maximum" suffix="KB" min={20} value={targetKB} onChange={(v) => v && setTargetKB(v)} />
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {KB_TARGETS.map((kb) => (
                    <Chip key={kb} active={targetKB === kb} onClick={() => setTargetKB(kb)}>
                      {kb >= 1024 ? `${kb / 1024} MB` : `${kb} KB`}
                    </Chip>
                  ))}
                </div>
              </Section>
              <Section title="Grayscale" action={<Toggle label="Grayscale" checked={grayscale} onChange={setGrayscale} />}>
                <p className="text-[11.5px] text-[var(--text-muted)] -mt-1">Great for black-and-white certificates. Saves a lot of space.</p>
              </Section>
            </>
          )}

          {usesSelection && (
            <Section title="Pages" hint={tool === 'rotate' ? 'Leave empty to rotate every page.' : tool === 'images' ? 'Leave empty to export every page.' : 'Tap thumbnails or type a range like 1-3, 5.'}>
              <label className="block">
                <span className="sr-only">Page range</span>
                <input
                  value={rangeText}
                  onChange={(e) => {
                    setRangeText(e.target.value);
                    setSelected(new Set(parsePageRange(e.target.value, pageCount)));
                  }}
                  placeholder="e.g. 1-3, 5"
                  className="w-full rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] px-3 py-2 font-mono text-sm font-semibold text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:ring-4 focus:ring-[var(--accent-subtle)]"
                />
              </label>
            </Section>
          )}

          {tool === 'rotate' && (
            <Section title="Angle">
              <Segmented ariaLabel="Rotation angle" value={angle} onChange={setAngle} options={[{ value: 90, label: '90° ↻' }, { value: 180, label: '180°' }, { value: 270, label: '90° ↺' }]} />
            </Section>
          )}

          {tool === 'images' && (
            <>
              <Section title="Image format">
                <Segmented ariaLabel="Image format" value={imgFormat} onChange={setImgFormat} options={[{ value: 'jpg', label: 'JPG' }, { value: 'png', label: 'PNG' }]} />
              </Section>
              <Section title="Resolution">
                <Segmented ariaLabel="Image DPI" size="sm" value={imgDpi} onChange={setImgDpi} options={[{ value: 96, label: '96' }, { value: 150, label: '150' }, { value: 200, label: '200' }, { value: 300, label: '300' }]} />
              </Section>
            </>
          )}

          {tool === 'merge' && <p className="text-sm text-[var(--text-secondary)]">Reorder files on the left, then merge them into one PDF.</p>}

          <button onClick={run} disabled={busy} className="btn btn-primary w-full mt-4 !py-3">
            {busy ? (
              <>
                <Spinner /> {progress || 'Working…'}
              </>
            ) : (
              runLabel[tool]
            )}
          </button>
        </div>

        {error && (
          <div role="alert" className="flex gap-3 rounded-2xl border border-[var(--danger)]/35 bg-[var(--danger)]/10 p-4 text-sm text-[var(--text-primary)]">
            <XCircle className="w-5 h-5 shrink-0 text-[var(--danger)]" />
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="hero-card p-5 animate-slide-up">
            <div className="flex items-center gap-2 mb-3">
              {resultOk ? <CheckCircle2 className="w-5 h-5 text-[var(--success)]" /> : <XCircle className="w-5 h-5 text-[var(--danger)]" />}
              <h3 className="text-sm font-bold text-[var(--text-primary)]">{resultOk ? 'Done' : 'Still over the limit'}</h3>
              <span className="ml-auto text-[11px] font-mono text-[var(--text-muted)]">{result.processingTimeMs} ms</span>
            </div>
            <div className="flex items-baseline gap-2 font-mono">
              <span className="text-sm text-[var(--text-muted)] line-through">{formatFileSize(result.originalSize)}</span>
              <span className="text-xl font-bold text-[var(--text-primary)]">{formatFileSize(result.processedSize ?? 0)}</span>
              {(result.compressionRatio ?? 0) > 0 && <span className="text-xs font-semibold text-[var(--success)]">−{result.compressionRatio}%</span>}
            </div>
            <button onClick={() => result.processedBlob && downloadBlob(result.processedBlob, result.downloadFilename || 'output.pdf')} className="btn btn-primary w-full mt-4">
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>
        )}

        {images.length > 0 && (
          <div className="hero-card p-5 animate-slide-up">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[var(--text-primary)]">{images.length} image{images.length === 1 ? '' : 's'}</h3>
              <button onClick={zipAll} className="btn btn-primary text-xs !py-1.5 !px-3">
                <Archive className="w-3.5 h-3.5" /> Download ZIP
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 max-h-72 overflow-y-auto">
              {images.map((im) => (
                <button
                  key={im.pageIndex}
                  onClick={() => downloadBlob(im.blob, `page_${im.pageIndex}.${imgFormat}`)}
                  className="rounded-lg border border-[var(--border-subtle)] bg-white p-1 hover:border-[var(--accent)] cursor-pointer"
                  title={`Download page ${im.pageIndex}`}
                >
                  <img src={im.url} alt={`Page ${im.pageIndex}`} className="w-full aspect-[3/4] object-contain" />
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};

const IconBtn: React.FC<{ label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }> = ({ label, onClick, disabled, children }) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    disabled={disabled}
    onClick={onClick}
    className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-surface)] disabled:opacity-30 cursor-pointer disabled:cursor-default"
  >
    {children}
  </button>
);

function swap<T>(arr: T[], a: number, b: number): T[] {
  const n = [...arr];
  [n[a], n[b]] = [n[b], n[a]];
  return n;
}

/** [0,1,2,4] → "1-3, 5" */
function toRange(indices: number[]): string {
  const s = [...indices].sort((a, b) => a - b).map((i) => i + 1);
  const parts: string[] = [];
  for (let i = 0; i < s.length; i++) {
    let j = i;
    while (j + 1 < s.length && s[j + 1] === s[j] + 1) j++;
    parts.push(j > i ? `${s[i]}-${s[j]}` : `${s[i]}`);
    i = j;
  }
  return parts.join(', ');
}
