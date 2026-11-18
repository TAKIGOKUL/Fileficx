import React, { useEffect, useRef, useState } from 'react';
import { Download, FileText, CheckCircle2, XCircle, ArrowRight, Info } from 'lucide-react';
import { canvasesToPdf } from '../../utils/pdfProcessor';
import { formatFileSize, downloadBlob } from '../../utils/format';
import { Section, Segmented, NumInput, Chip, Toggle, Spinner } from './ui';

interface DocxToolProps {
  file: File;
  /** Hand the converted PDF to the PDF tools */
  onOpenFile?: (file: File) => void;
  onPageCount?: (n: number) => void;
}

const RENDER_OPTIONS = {
  inWrapper: true,
  breakPages: true,
  ignoreLastRenderedPageBreak: false,
  renderHeaders: true,
  renderFooters: true,
  renderFootnotes: true,
  ignoreWidth: false,
  ignoreHeight: false,
  experimental: true,
  className: 'docx',
};

const KB_TARGETS = [100, 200, 300, 500, 1024];

async function renderDocx(file: File, body: HTMLElement, styles: HTMLElement) {
  const { renderAsync } = await import('docx-preview');
  await renderAsync(file, body, styles, RENDER_OPTIONS);
  return Array.from(body.querySelectorAll<HTMLElement>('section.docx'));
}

export const DocxTool: React.FC<DocxToolProps> = ({ file, onOpenFile, onPageCount }) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const styleRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [dpi, setDpi] = useState(150);
  const [limitOn, setLimitOn] = useState(false);
  const [targetKB, setTargetKB] = useState(300);
  const [grayscale, setGrayscale] = useState(false);

  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; name: string; ms: number } | null>(null);

  // Render the visible preview
  useEffect(() => {
    let cancelled = false;
    const body = previewRef.current;
    const styles = styleRef.current;
    if (!body || !styles) return;
    setLoading(true);
    setLoadError(null);
    renderDocx(file, body, styles)
      .then((sections) => {
        if (cancelled) return;
        setPages(sections.length);
        onPageCount?.(sections.length);
        const w = sections[0]?.offsetWidth || 816;
        const avail = (frameRef.current?.clientWidth || w) - 32;
        setZoom(Math.min(1, avail / w));
      })
      .catch(() => !cancelled && setLoadError('This Word file could not be opened. It may be damaged, password-protected, or an old .doc file.'))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
      body.innerHTML = '';
      styles.innerHTML = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const convert = async () => {
    setBusy(true);
    setError(null);
    setResult(null);
    const t0 = performance.now();
    // Off-screen, unscaled copy so captures are pixel-accurate
    const host = document.createElement('div');
    host.style.cssText = 'position:fixed;left:-100000px;top:0;width:auto;pointer-events:none;';
    const styles = document.createElement('div');
    const body = document.createElement('div');
    host.append(styles, body);
    document.body.appendChild(host);
    try {
      setProgress('Laying out pages…');
      const sections = await renderDocx(file, body, styles);
      if (!sections.length) throw new Error('No pages found in this document.');
      await document.fonts?.ready;
      const { default: html2canvas } = await import('html2canvas-pro');
      const scale = (sections.length > 20 ? Math.min(dpi, 150) : dpi) / 96;
      const rendered = [];
      for (const [i, sec] of sections.entries()) {
        setProgress(`Rendering page ${i + 1} of ${sections.length}…`);
        const canvas = await html2canvas(sec, { scale, backgroundColor: '#ffffff', logging: false, useCORS: true });
        rendered.push({ canvas, widthPt: sec.offsetWidth * 0.75, heightPt: sec.offsetHeight * 0.75 });
      }
      const blob = await canvasesToPdf(rendered, { targetKB: limitOn ? targetKB : undefined, grayscale, onProgress: setProgress });
      const base = file.name.replace(/\.docx$/i, '');
      setResult({ blob, name: `${base}_${Math.round(blob.size / 1024)}KB.pdf`, ms: Math.round(performance.now() - t0) });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed.');
    } finally {
      host.remove();
      setBusy(false);
      setProgress('');
    }
  };

  const fits = result && (!limitOn || result.blob.size <= targetKB * 1024);

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_380px] gap-5 items-start">
      <div className="hero-card overflow-hidden min-w-0">
        <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-[var(--border-subtle)]">
          <h3 className="text-[13px] font-bold text-[var(--text-primary)] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[var(--accent)]" /> Document preview
          </h3>
          <span className="text-[11.5px] font-mono text-[var(--text-muted)]">
            {loading ? 'Loading…' : `${pages} page${pages === 1 ? '' : 's'}`}
          </span>
        </div>
        <div ref={frameRef} className="relative h-[520px] sm:h-[640px] overflow-auto bg-[var(--input-inner-bg)]">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-[var(--text-muted)] gap-2">
              <Spinner /> Opening document…
            </div>
          )}
          {loadError && (
            <div role="alert" className="absolute inset-0 flex items-center justify-center p-8 text-center text-sm text-[var(--text-secondary)]">
              {loadError}
            </div>
          )}
          <div ref={styleRef} />
          <div ref={previewRef} className="docx-preview-host" style={{ zoom }} />
        </div>
      </div>

      <aside className="lg:sticky lg:top-24 space-y-4">
        <div className="hero-card p-5">
          <Section title="Convert to PDF" hint="Pages are converted exactly as shown in the preview. Complex Word layouts may differ slightly.">
            <span className="block text-[11px] font-medium text-[var(--text-muted)] mb-1">Quality</span>
            <Segmented
              ariaLabel="Output resolution"
              size="sm"
              value={dpi}
              onChange={setDpi}
              options={[
                { value: 120, label: 'Small' },
                { value: 150, label: 'Standard' },
                { value: 220, label: 'High' },
              ]}
            />
          </Section>
          <Section title="File size limit" action={<Toggle label="Limit file size" checked={limitOn} onChange={setLimitOn} />}>
            {limitOn ? (
              <>
                <NumInput label="Maximum" suffix="KB" min={20} value={targetKB} onChange={(v) => v && setTargetKB(v)} />
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {KB_TARGETS.map((kb) => (
                    <Chip key={kb} active={targetKB === kb} onClick={() => setTargetKB(kb)}>
                      {kb >= 1024 ? `${kb / 1024} MB` : `${kb} KB`}
                    </Chip>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-[11.5px] text-[var(--text-muted)] -mt-1">Turn on to fit portal limits like “PDF under 300 KB”.</p>
            )}
          </Section>
          <Section title="Grayscale" action={<Toggle label="Grayscale" checked={grayscale} onChange={setGrayscale} />}>
            <p className="text-[11.5px] text-[var(--text-muted)] -mt-1">Smaller files for black-and-white documents.</p>
          </Section>

          <button onClick={convert} disabled={busy || loading || !!loadError} className="btn btn-primary w-full mt-4 !py-3">
            {busy ? (
              <>
                <Spinner /> {progress || 'Converting…'}
              </>
            ) : (
              <>Convert to PDF{limitOn ? ` ≤ ${targetKB} KB` : ''}</>
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
              {fits ? <CheckCircle2 className="w-5 h-5 text-[var(--success)]" /> : <XCircle className="w-5 h-5 text-[var(--danger)]" />}
              <h3 className="text-sm font-bold text-[var(--text-primary)]">{fits ? 'PDF ready' : 'Over the limit'}</h3>
              <span className="ml-auto text-[11px] font-mono text-[var(--text-muted)]">{result.ms} ms</span>
            </div>
            <div className="flex items-baseline gap-2 font-mono">
              <span className="text-sm text-[var(--text-muted)]">{formatFileSize(file.size)} DOCX →</span>
              <span className="text-xl font-bold text-[var(--text-primary)]">{formatFileSize(result.blob.size)}</span>
            </div>
            <button onClick={() => downloadBlob(result.blob, result.name)} className="btn btn-primary w-full mt-4">
              <Download className="w-4 h-4" /> Download PDF
            </button>
            {onOpenFile && (
              <button
                onClick={() => onOpenFile(new File([result.blob], result.name, { type: 'application/pdf' }))}
                className="btn btn-outline w-full mt-2"
              >
                Edit pages in PDF tools <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        <p className="flex gap-2 text-[11.5px] text-[var(--text-muted)] px-1">
          <Info className="w-4 h-4 shrink-0" /> Your document is opened and converted in this browser tab. It is never uploaded.
        </p>
      </aside>
    </div>
  );
};
