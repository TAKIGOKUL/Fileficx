import React from 'react';
import {
  ClipboardPaste,
  UploadCloud,
  Download,
  Ruler,
  Gauge,
  Printer,
  PaintBucket,
  FileStack,
  ShieldCheck,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  BookOpen,
  Clock,
} from 'lucide-react';
import { PORTAL_PRESETS } from '../utils/presets';
import { GUIDES } from '../data/guides';

interface HomeContentProps {
  onUsePreset: (instruction: string) => void;
  onNavigate: (page: string) => void;
}

const STEPS = [
  {
    icon: ClipboardPaste,
    title: 'Paste the requirement',
    body: 'Copy the photo or document rule from the official notification, or pick a preset. Fileficx reads the size, KB range, format and DPI.',
  },
  {
    icon: UploadCloud,
    title: 'Drop your file',
    body: 'Add a photo, signature, scan or PDF. It opens straight in your browser tab and is never sent to a server.',
  },
  {
    icon: Download,
    title: 'Download & upload',
    body: 'Compare before and after, fine-tune if you need to, then download a file that matches the rules you pasted.',
  },
];

const FEATURES = [
  { icon: Ruler, title: 'Exact pixel dimensions', body: 'Crop to the right aspect ratio and resize to sizes like 200 × 230 or 600 × 600 without stretching faces.' },
  { icon: Gauge, title: 'Hit any KB range', body: 'Automatically steps JPEG quality down until the file fits limits like 20–50 KB or "under 240 KB", keeping as much detail as the budget allows.' },
  { icon: Printer, title: 'Real DPI metadata', body: 'Writes 200 or 300 DPI directly into the JPEG header, so strict validators read the value they expect.' },
  { icon: PaintBucket, title: 'Clean backgrounds', body: 'Fill transparent backgrounds with white or any colour you choose, and convert signatures to grayscale.' },
  { icon: FileStack, title: 'PDF & Word studio', body: 'Turn Word (DOCX) files into PDFs, then rotate, split, extract, merge and shrink them to fit upload limits.' },
  { icon: ShieldCheck, title: 'Private by design', body: 'All processing uses your device\'s memory. Close the tab and every trace of the file is gone.' },
];

const FAQS = [
  {
    q: 'Is Fileficx really free?',
    a: 'Yes. Every feature is free with no sign-up, watermark or file limit. The site is supported by unobtrusive advertising, which never has access to your files.',
  },
  {
    q: 'Are my photos or documents uploaded anywhere?',
    a: 'No. Files are opened and processed by your browser on your own device. You can confirm this in your browser\'s Network tab: no request ever contains your file. Closing or refreshing the tab clears it from memory.',
  },
  {
    q: 'Why was my photo rejected even though the dimensions were correct?',
    a: 'Portals usually check file size in KB and the file format as well, and sometimes the DPI value stored in the file. A photo can have the right pixel size but still be too large, saved as PNG, or tagged at 72 DPI. Fileficx checks all of these together.',
  },
  {
    q: 'Which exams and portals does it work with?',
    a: 'Any portal that publishes its requirements. There are presets for common SSC, UPSC, IBPS, NTA, passport and visa formats, and you can paste any custom rule, such as "JPG, 100 × 120 px, 10–30 KB".',
  },
  {
    q: 'Which file types can I upload?',
    a: 'Photos and scans in JPG, PNG, WEBP, GIF, BMP, AVIF, TIFF, ICO and SVG, plus PDF documents and Word files (DOCX). HEIC photos from iPhones open in Safari; in other browsers, set your iPhone camera to "Most Compatible". Images can be saved as JPG, PNG, WEBP or PDF, and Word files convert to PDF.',
  },
  {
    q: 'Will compression make my photo blurry?',
    a: 'Fileficx starts at high quality and only lowers it as far as needed to fit your limit, so you keep as much sharpness as the KB budget allows. Starting from a clear, well-lit original makes the biggest difference.',
  },
  {
    q: 'Does it work on mobile phones?',
    a: 'Yes. It runs in any modern mobile browser. You can take a photo with your camera, format it, and download it ready for the application form.',
  },
];

const SectionHeader: React.FC<{ eyebrow: string; title: string; sub?: string; id: string }> = ({ eyebrow, title, sub, id }) => (
  <div className="max-w-2xl mx-auto text-center mb-10">
    <p className="eyebrow mb-3">{eyebrow}</p>
    <h2 id={id} className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] leading-tight">
      {title}
    </h2>
    {sub && <p className="mt-3 text-[15px] text-[var(--text-secondary)] leading-relaxed">{sub}</p>}
  </div>
);

export const HomeContent: React.FC<HomeContentProps> = ({ onUsePreset, onNavigate }) => {
  const featuredGuides = GUIDES.slice(0, 3);

  return (
    <div className="space-y-24 sm:space-y-32 mt-16 sm:mt-24">
      {/* Trust strip */}
      <section aria-label="Highlights" className="max-w-5xl mx-auto">
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-3xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--border-subtle)]">
          {[
            ['0 bytes', 'uploaded to servers'],
            [`${PORTAL_PRESETS.length + 2}+`, 'ready-made presets'],
            ['12 formats', 'images, PDF & Word'],
            ['₹0 / $0', 'free, no sign-up'],
          ].map(([value, label]) => (
            <div key={label} className="bg-[var(--bg-elevated)] px-5 py-6 text-center">
              <dt className="sr-only">{label}</dt>
              <dd className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">{value}</dd>
              <dd className="mt-1 text-xs text-[var(--text-muted)] font-medium">{label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* How it works */}
      <section aria-labelledby="how-title">
        <SectionHeader
          id="how-title"
          eyebrow="How it works"
          title="From rejected upload to accepted, in three steps"
          sub="No editing skills or software to install. If you can copy and paste, you can format any application file."
        />
        <ol className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <li key={title} className="mooni-card p-7 relative">
              <span className="absolute top-6 right-7 font-mono text-xs font-semibold text-[var(--text-muted)]">0{i + 1}</span>
              <span className="icon-tile mb-5">
                <Icon className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Features */}
      <section aria-labelledby="features-title">
        <SectionHeader
          id="features-title"
          eyebrow="What it does"
          title="Everything application portals check, handled for you"
          sub="Portals don't just check how a photo looks. They check its numbers. Fileficx gets every one of them right."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 card-lift">
              <span className="icon-tile mb-4">
                <Icon className="w-5 h-5" />
              </span>
              <h3 className="text-base font-bold text-[var(--text-primary)] mb-1.5">{title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Presets / spec reference */}
      <section aria-labelledby="presets-title">
        <SectionHeader
          id="presets-title"
          eyebrow="Popular presets"
          title="Common requirements, one click away"
          sub="Typical specifications for frequently used portals. Requirements can change between cycles, so always compare with your official notification."
        />
        <div className="max-w-6xl mx-auto mooni-card !rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="spec-table w-full text-left text-sm min-w-[640px]">
              <thead className="bg-[var(--input-inner-bg)]">
                <tr>
                  <th className="px-5 py-3.5">Portal</th>
                  <th className="px-5 py-3.5">Dimensions</th>
                  <th className="px-5 py-3.5">File size</th>
                  <th className="px-5 py-3.5">DPI</th>
                  <th className="px-5 py-3.5 text-right">
                    <span className="sr-only">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {PORTAL_PRESETS.map((p) => (
                  <tr key={p.id} className="transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-[var(--text-primary)]">{p.name}</div>
                      <div className="text-[11px] font-mono text-[var(--text-muted)] mt-0.5">{p.badge}</div>
                    </td>
                    <td className="px-5 py-4 font-mono text-[13px] text-[var(--text-secondary)]">
                      {p.requirements.width} × {p.requirements.height} px
                    </td>
                    <td className="px-5 py-4 font-mono text-[13px] text-[var(--text-secondary)]">
                      {p.requirements.minSize ? `${p.requirements.minSize}–` : '≤ '}
                      {p.requirements.maxSize} KB
                    </td>
                    <td className="px-5 py-4 font-mono text-[13px] text-[var(--text-secondary)]">{p.requirements.dpi}</td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => onUsePreset(p.instructionSample)}
                        className="btn btn-outline text-xs !py-1.5 !px-3.5"
                      >
                        Use preset <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Guides teaser */}
      <section aria-labelledby="guides-title">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="eyebrow mb-3">Learn</p>
            <h2 id="guides-title" className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] leading-tight">
              Guides for stress-free applications
            </h2>
          </div>
          <button onClick={() => onNavigate('guides')} className="btn btn-outline self-start sm:self-auto">
            <BookOpen className="w-4 h-4" /> All guides
          </button>
        </div>
        <div className="grid md:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {featuredGuides.map((g) => (
            <a
              key={g.slug}
              href={`/guides/${g.slug}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(`guides/${g.slug}`);
              }}
              className="group rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 flex flex-col card-lift"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[var(--accent-subtle)] text-[var(--accent-text)]">
                  {g.category}
                </span>
                <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] leading-snug mb-2">{g.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3 flex-1">{g.summary}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-medium">
                <Clock className="w-3.5 h-3.5" /> {g.readMinutes} min read
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Privacy explainer */}
      <section aria-labelledby="privacy-title" className="max-w-6xl mx-auto">
        <div className="rounded-[2rem] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] overflow-hidden grid md:grid-cols-2">
          <div className="p-8 sm:p-12">
            <p className="eyebrow mb-3">Privacy</p>
            <h2 id="privacy-title" className="text-3xl font-extrabold text-[var(--text-primary)] leading-tight mb-4">
              Your ID documents should never leave your device
            </h2>
            <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed mb-4">
              Most online converters upload your passport photo, signature and certificates to a remote server. Fileficx does the opposite: it
              uses your browser's own image and PDF engines, so files are processed locally in memory and discarded when you close the tab.
            </p>
            <button onClick={() => onNavigate('guides/are-online-image-converters-safe')} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent-text)] hover:underline cursor-pointer">
              Why it matters <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="p-8 sm:p-12 bg-[var(--input-inner-bg)] border-t md:border-t-0 md:border-l border-[var(--border-subtle)] flex flex-col justify-center gap-3">
            {[
              ['Typical online converter', 'Your file → their server → stored for unknown time', false],
              ['Fileficx', 'Your file → your browser → your downloads folder', true],
            ].map(([title, flow, good]) => (
              <div
                key={title as string}
                className={`rounded-2xl p-5 border ${
                  good ? 'border-[var(--success)]/35 bg-[var(--success-subtle)]' : 'border-[var(--border-subtle)] bg-[var(--bg-elevated)]'
                }`}
              >
                <div className={`text-xs font-bold mb-1 ${good ? 'text-[var(--success)]' : 'text-[var(--text-muted)]'}`}>{title}</div>
                <div className="text-sm font-mono text-[var(--text-primary)]">{flow}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-title" className="max-w-3xl mx-auto">
        <SectionHeader id="faq-title" eyebrow="FAQ" title="Frequently asked questions" />
        <div className="space-y-3">
          {FAQS.map(({ q, a }) => (
            <details key={q} className="faq-item group rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] transition-colors">
              <summary className="flex items-center justify-between gap-4 px-6 py-5 text-[15px] font-semibold text-[var(--text-primary)]">
                {q}
                <ChevronDown className="faq-chevron w-5 h-5 shrink-0 text-[var(--text-muted)] transition-transform duration-200" />
              </summary>
              <p className="px-6 pb-6 -mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-[2rem] px-8 py-14 sm:py-16 text-center bg-[var(--accent)] text-white">
          <div className="absolute inset-0 opacity-25 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 0%, #fff 0, transparent 40%), radial-gradient(circle at 90% 100%, #ffb38f 0, transparent 45%)' }} aria-hidden="true" />
          <h2 className="relative text-3xl sm:text-4xl font-extrabold leading-tight mb-3">Your application deadline won't wait.</h2>
          <p className="relative text-white/85 max-w-xl mx-auto mb-7">Format your photo, signature or certificate in under a minute, for free.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="relative btn bg-white text-[#1a0f0a] hover:bg-white/90 !px-7 !py-3 shadow-xl"
          >
            Start formatting <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};

/** Compact guide links shown under the workspace so the tool screen also carries helpful content. */
export const WorkspaceGuides: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => (
  <section aria-labelledby="ws-guides" className="max-w-7xl mx-auto mt-16">
    <div className="flex items-end justify-between gap-4 mb-5">
      <div>
        <p className="eyebrow mb-2">Before you upload</p>
        <h2 id="ws-guides" className="text-2xl font-extrabold text-[var(--text-primary)]">
          Avoid the most common rejections
        </h2>
      </div>
      <button onClick={() => onNavigate('guides')} className="btn btn-outline text-xs !py-1.5 !px-3.5">
        <BookOpen className="w-3.5 h-3.5" /> All guides
      </button>
    </div>
    <div className="grid md:grid-cols-3 gap-4">
      {GUIDES.filter((g) => ['why-portals-reject-photos', 'compress-photo-to-exact-kb', 'reduce-pdf-size-for-uploads'].includes(g.slug)).map((g) => (
        <a
          key={g.slug}
          href={`/guides/${g.slug}`}
          onClick={(e) => {
            e.preventDefault();
            onNavigate(`guides/${g.slug}`);
          }}
          className="group rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 card-lift"
        >
          <span className="text-[11px] font-semibold text-[var(--accent-text)]">{g.category}</span>
          <h3 className="mt-1.5 text-[15px] font-bold text-[var(--text-primary)] leading-snug">{g.title}</h3>
          <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2">{g.summary}</p>
        </a>
      ))}
    </div>
  </section>
);
