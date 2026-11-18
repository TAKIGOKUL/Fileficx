import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowDown,
  CheckCircle2,
  ShieldCheck,
  UploadCloud,
  FileImage,
  FileText,
  RefreshCw,
  Sparkles,
  BadgeCheck,
  Lock,
  Zap,
} from 'lucide-react';
import { ParsedRequirement } from '../types';
import { parseInstructions } from '../utils/instructionParser';
import { formatFileSize } from '../utils/format';

interface HeroSectionProps {
  onParsed: (req: ParsedRequirement) => void;
  hasFile?: boolean;
  currentFile: File | null;
  onFileSelect: (file: File) => void;
  onProceedToWorkspace?: () => void;
  /** Lets other sections (e.g. the preset table) load a requirement into the parser. */
  presetRequest?: { text: string; nonce: number } | null;
}

export const TYPING_PHRASES = [
  'Photo: JPG, max 50KB, 200x230px, 200 DPI, white background',
  'Signature: JPG, 10KB - 20KB, 140x60px, black ink on white paper',
  'Degree Certificate: PDF format, under 300KB, clean scan',
  'Passport Photo: 3.5 x 4.5 cm, white background, < 50KB',
  'US Visa DS-160: 600x600px, 300 DPI, max 240KB, 2x2 inch',
];

const DEMOS = [
  { from: ['IMG_2041.jpg', '4.2 MB', '4032 × 3024'], to: ['photo_200x230.jpg', '46 KB', '200 × 230 · 200 DPI'], tag: 'Exam photo' },
  { from: ['signature_scan.png', '1.8 MB', '2480 × 1100'], to: ['sign_140x60.jpg', '17 KB', '140 × 60 · grayscale'], tag: 'Signature' },
  { from: ['marksheet.pdf', '6.4 MB', '4 pages'], to: ['marksheet_compressed.pdf', '288 KB', '4 pages · readable'], tag: 'Certificate' },
];

export const ACCEPT = [
  'image/*',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.jpg,.jpeg,.png,.webp,.heic,.heif,.gif,.bmp,.avif,.tif,.tiff,.ico,.svg,.pdf,.docx',
].join(',');

export const HeroSection: React.FC<HeroSectionProps> = ({
  onParsed,
  hasFile = false,
  currentFile,
  onFileSelect,
  onProceedToWorkspace,
  presetRequest,
}) => {
  const [inputText, setInputText] = useState('');
  const [isUserEditing, setIsUserEditing] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [rules, setRules] = useState<string[]>([]);
  const [demo, setDemo] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Typewriter placeholder while the user hasn't typed
  useEffect(() => {
    if (isUserEditing) return;
    const phrase = TYPING_PHRASES[phraseIndex];
    let t: ReturnType<typeof setTimeout>;
    if (!isDeleting) {
      t = typedText.length < phrase.length
        ? setTimeout(() => setTypedText(phrase.slice(0, typedText.length + 1)), 34)
        : setTimeout(() => setIsDeleting(true), 2200);
    } else if (typedText.length > 0) {
      t = setTimeout(() => setTypedText(phrase.slice(0, typedText.length - 1)), 14);
    } else {
      setIsDeleting(false);
      setPhraseIndex((p) => (p + 1) % TYPING_PHRASES.length);
    }
    return () => clearTimeout(t);
  }, [typedText, isDeleting, phraseIndex, isUserEditing]);

  // Rotating before/after demo
  useEffect(() => {
    const t = setInterval(() => setDemo((d) => (d + 1) % DEMOS.length), 3800);
    return () => clearInterval(t);
  }, []);

  const parse = (text: string) => {
    if (!text.trim()) {
      setRules([]);
      return;
    }
    const parsed = parseInstructions(text);
    setRules(parsed.detectedRules);
    onParsed(parsed);
  };

  // Live parsing as the user types (debounced)
  useEffect(() => {
    if (!isUserEditing) return;
    const t = setTimeout(() => parse(inputText), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputText, isUserEditing]);

  // Preset pushed from elsewhere on the page
  useEffect(() => {
    if (!presetRequest) return;
    setIsUserEditing(true);
    setInputText(presetRequest.text);
    parse(presetRequest.text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presetRequest?.nonce]);

  const usePhrase = (p: string) => {
    setIsUserEditing(true);
    setInputText(p);
    parse(p);
  };

  const process = () => {
    if (!isUserEditing || !inputText.trim()) parse(inputText || TYPING_PHRASES[phraseIndex]);
    else parse(inputText);
    if (hasFile && onProceedToWorkspace) onProceedToWorkspace();
    else fileRef.current?.click();
  };

  const pick = (files: FileList | null) => {
    if (files && files.length) onFileSelect(files[0]);
  };

  const isPdf = currentFile && (/pdf|word/.test(currentFile.type) || /\.(pdf|docx?)$/i.test(currentFile.name));
  const d = DEMOS[demo];

  return (
    <section className="relative w-full pt-10 sm:pt-14 lg:pt-20 pb-6" aria-labelledby="hero-title">
      <div className="absolute inset-x-0 -top-28 h-[640px] bg-grid pointer-events-none" aria-hidden="true" />
      <div
        className="absolute -top-24 right-[-10%] w-[620px] h-[620px] rounded-full pointer-events-none blur-3xl opacity-60"
        style={{ background: 'radial-gradient(circle, var(--accent-glow), transparent 65%)' }}
        aria-hidden="true"
      />

      <div className="relative grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] gap-10 lg:gap-12 items-center">
        {/* ─── Copy column ─── */}
        <div className="min-w-0 text-center lg:text-left">
          <span className="badge-mooni mb-6">
            <ShieldCheck className="w-3.5 h-3.5" /> Free · Private · No sign-up
          </span>

          <h1 id="hero-title" className="text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-[3.6rem] xl:text-[4.4rem] font-extrabold tracking-[-0.035em] text-[var(--text-primary)]">
            Make every file
            <br />
            <span className="text-color-gradient-brand">application ready.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl font-semibold text-[var(--text-primary)]">Paste the requirement. Drop the file. Done.</p>
          <p className="mt-3 text-[15px] sm:text-base text-[var(--text-secondary)] max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Resize photos, signatures and PDFs to the exact pixels, KB and DPI that exam, job and visa portals check. Everything runs in your browser.
            No files are uploaded to any server.
          </p>

          {/* Before → after demo */}
          <div className="hidden sm:block mt-9 max-w-xl mx-auto lg:mx-0" aria-hidden="true">
            <div key={demo} className="animate-fadeIn grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <DemoCard lines={d.from} muted />
              <span className="w-9 h-9 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-lg shadow-[var(--accent-glow)]">
                <ArrowRight className="w-4 h-4" />
              </span>
              <DemoCard lines={d.to} tag={d.tag} />
            </div>
          </div>

          <ul className="mt-8 flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 text-[13px] font-medium text-[var(--text-secondary)]">
            <li className="inline-flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[var(--success)]" /> Files stay on your device
            </li>
            <li className="inline-flex items-center gap-1.5">
              <BadgeCheck className="w-4 h-4 text-[var(--success)]" /> No watermark
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[var(--success)]" /> Results in seconds
            </li>
          </ul>
        </div>

        {/* ─── Tool card ─── */}
        <div className="relative min-w-0">
          <div className="absolute -inset-px rounded-[2rem] bg-gradient-to-b from-[var(--accent-border)] to-transparent pointer-events-none" aria-hidden="true" />
          <div className="relative rounded-[2rem] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-[var(--shadow-lift)] p-4 sm:p-6">
            {/* Step 1 */}
            <StepLabel n={1} htmlFor="req-input">
              Paste your form's requirement
            </StepLabel>
            <div className="rounded-2xl bg-[var(--input-inner-bg)] border border-[var(--border-subtle)] px-4 py-3 focus-within:border-[var(--accent)] focus-within:ring-4 focus-within:ring-[var(--accent-subtle)] transition-all">
              <textarea
                id="req-input"
                rows={2}
                value={isUserEditing ? inputText : typedText}
                onFocus={() => {
                  if (!isUserEditing) {
                    setIsUserEditing(true);
                    setInputText('');
                  }
                }}
                onChange={(e) => {
                  setIsUserEditing(true);
                  setInputText(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) process();
                }}
                placeholder='e.g. "Photo: JPG, 20–50 KB, 200×230 px, 200 DPI"'
                className={`w-full bg-transparent resize-none text-[15px] font-medium leading-relaxed focus:outline-none caret-[var(--accent)] placeholder:text-[var(--text-muted)] ${
                  isUserEditing ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'
                }`}
              />
              <div className="min-h-[24px] flex flex-wrap gap-1.5" aria-live="polite">
                {rules.length > 0 ? (
                  rules.map((r) => (
                    <span key={r} className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[var(--success-subtle)] text-[var(--success)]">
                      <CheckCircle2 className="w-3 h-3" /> {r}
                    </span>
                  ))
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
                    <Sparkles className="w-3 h-3" /> Size, KB, format and DPI are detected as you type
                  </span>
                )}
              </div>
            </div>
            <div className="mt-2.5 -mx-1 px-1 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
              {TYPING_PHRASES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => usePhrase(p)}
                  className="shrink-0 px-3 py-1 rounded-full text-xs font-medium border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:border-[var(--accent-border)] hover:text-[var(--accent-text)] hover:bg-[var(--accent-subtle)] transition-colors cursor-pointer"
                >
                  {p.split(':')[0]}
                </button>
              ))}
            </div>

            <div className="flex justify-center my-3 text-[var(--text-muted)]" aria-hidden="true">
              <ArrowDown className="w-4 h-4" />
            </div>

            {/* Step 2 */}
            <StepLabel n={2}>Add your file</StepLabel>
            <div
              role="button"
              tabIndex={0}
              aria-label="Upload a file"
              onClick={() => fileRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  fileRef.current?.click();
                }
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragOver(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragOver(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragOver(false);
                pick(e.dataTransfer.files);
              }}
              className={`group rounded-2xl border-2 border-dashed px-4 py-6 text-center cursor-pointer transition-all ${
                dragOver
                  ? 'border-[var(--accent)] bg-[var(--accent-subtle)] scale-[1.01]'
                  : currentFile
                    ? 'border-[var(--success)]/50 bg-[var(--success-subtle)]'
                    : 'border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--accent-subtle)]'
              }`}
            >
              <input ref={fileRef} type="file" accept={ACCEPT} className="hidden" onChange={(e) => pick(e.target.files)} />
              {currentFile ? (
                <div className="flex items-center gap-3 text-left animate-fadeIn">
                  <span className="w-11 h-11 rounded-xl bg-[var(--bg-elevated)] border border-[var(--success)]/30 text-[var(--success)] flex items-center justify-center shrink-0">
                    {isPdf ? <FileText className="w-5 h-5" /> : <FileImage className="w-5 h-5" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold text-[var(--success)]">File Attached:</p>
                    <p className="text-sm font-bold text-[var(--text-primary)] truncate">{currentFile.name}</p>
                    <p className="text-[11px] font-mono text-[var(--text-muted)]">{formatFileSize(currentFile.size)}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--text-muted)] group-hover:text-[var(--accent-text)]">
                    <RefreshCw className="w-3.5 h-3.5" /> Change
                  </span>
                </div>
              ) : (
                <>
                  <span className="icon-tile !w-12 !h-12 !rounded-2xl mb-3 group-hover:scale-110 group-hover:-translate-y-0.5 transition-transform">
                    <UploadCloud className="w-6 h-6" />
                  </span>
                  <p className="text-[15px] font-bold text-[var(--text-primary)]">Drop files here or click to upload</p>
                  <p className="mt-1 text-xs text-[var(--text-muted)] font-mono">JPG · PNG · WEBP · HEIC · GIF · TIFF · PDF · DOCX</p>
                </>
              )}
            </div>

            {/* CTA */}
            <button
              type="button"
              onClick={process}
              className={`mt-4 w-full btn !rounded-2xl !py-4 text-[15px] ${hasFile ? 'btn-primary' : 'btn-secondary'}`}
            >
              {hasFile ? 'Process Now →' : <>Choose a file to start <ArrowRight className="w-4 h-4" /></>}
            </button>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-[11.5px] text-[var(--text-muted)]">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--success)]" /> No files are uploaded to any server.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const StepLabel: React.FC<{ n: number; htmlFor?: string; children: React.ReactNode }> = ({ n, htmlFor, children }) => (
  <label htmlFor={htmlFor} className="flex items-center gap-2.5 mb-2.5">
    <span className="w-6 h-6 rounded-full bg-[var(--accent)] text-white text-xs font-bold flex items-center justify-center">{n}</span>
    <span className="text-sm font-bold text-[var(--text-primary)]">{children}</span>
  </label>
);

const DemoCard: React.FC<{ lines: string[]; muted?: boolean; tag?: string }> = ({ lines, muted, tag }) => (
  <div
    className={`relative rounded-2xl border p-3.5 text-left ${
      muted ? 'border-[var(--border-subtle)] bg-[var(--bg-card)]' : 'border-[var(--success)]/35 bg-[var(--bg-elevated)] shadow-[var(--shadow-soft)]'
    }`}
  >
    {tag && (
      <span className="absolute -top-2.5 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--success)] text-white">
        ✓ {tag}
      </span>
    )}
    <p className={`text-[12px] font-semibold truncate ${muted ? 'text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'}`}>{lines[0]}</p>
    <p className={`font-mono text-lg font-bold mt-0.5 ${muted ? 'text-[var(--text-muted)] line-through decoration-1' : 'text-[var(--success)]'}`}>{lines[1]}</p>
    <p className="font-mono text-[10.5px] text-[var(--text-muted)] truncate">{lines[2]}</p>
  </div>
);
