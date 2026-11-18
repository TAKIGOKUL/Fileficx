import React from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Clock, Lightbulb, BookOpen, CalendarDays } from 'lucide-react';
import { GUIDES, Guide, GuideBlock, getGuide } from '../data/guides';

interface GuidesPageProps {
  slug?: string;
  onNavigate: (page: string) => void;
}

const formatDate = (iso: string) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

const anchorId = (heading: string) => heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const Block: React.FC<{ block: GuideBlock }> = ({ block }) => {
  if (typeof block === 'string') return <p>{block}</p>;
  if ('tip' in block) {
    return (
      <aside className="not-prose my-6 flex gap-3 rounded-2xl border border-[var(--accent-border)] bg-[var(--accent-subtle)] p-5 text-[15px] leading-relaxed text-[var(--text-primary)]">
        <Lightbulb className="w-5 h-5 shrink-0 mt-0.5 text-[var(--accent)]" />
        <p className="m-0">{block.tip}</p>
      </aside>
    );
  }
  const Tag = block.ordered ? 'ol' : 'ul';
  return (
    <Tag>
      {block.list.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </Tag>
  );
};

const GuideCard: React.FC<{ guide: Guide; onNavigate: (p: string) => void; large?: boolean }> = ({ guide, onNavigate, large }) => (
  <a
    href={`/guides/${guide.slug}`}
    onClick={(e) => {
      e.preventDefault();
      onNavigate(`guides/${guide.slug}`);
    }}
    className={`group rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-card)] flex flex-col card-lift ${large ? 'p-8 sm:p-10' : 'p-6'}`}
  >
    <div className="flex items-center justify-between mb-4">
      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[var(--accent-subtle)] text-[var(--accent-text)]">{guide.category}</span>
      <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" />
    </div>
    <h2 className={`font-bold text-[var(--text-primary)] leading-snug mb-2 ${large ? 'text-2xl sm:text-3xl' : 'text-lg'}`}>{guide.title}</h2>
    <p className={`text-[var(--text-secondary)] leading-relaxed flex-1 ${large ? 'text-base max-w-2xl' : 'text-sm'}`}>{guide.summary}</p>
    <span className="mt-5 inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-medium">
      <Clock className="w-3.5 h-3.5" /> {guide.readMinutes} min read
    </span>
  </a>
);

const GuidesIndex: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => {
  const [first, ...rest] = GUIDES;
  return (
    <div className="max-w-6xl mx-auto py-10 sm:py-16 animate-slide-up">
      <header className="max-w-2xl mb-12">
        <span className="badge-mooni mb-5">
          <BookOpen className="w-3.5 h-3.5" /> Guides
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--text-primary)] leading-[1.1] mb-4">
          Get your application files right the first time
        </h1>
        <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
          Plain-language guides on photo sizes, signatures, DPI, PDF compression and keeping your documents private, written for students, job seekers and
          travellers.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-2 lg:col-span-3">
          <GuideCard guide={first} onNavigate={onNavigate} large />
        </div>
        {rest.map((g) => (
          <GuideCard key={g.slug} guide={g} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
};

const GuideArticle: React.FC<{ guide: Guide; onNavigate: (p: string) => void }> = ({ guide, onNavigate }) => {
  const idx = GUIDES.findIndex((g) => g.slug === guide.slug);
  const related = GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 3);
  const next = GUIDES[(idx + 1) % GUIDES.length];

  return (
    <article className="max-w-6xl mx-auto py-10 sm:py-14 animate-slide-up">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-[var(--text-muted)] mb-8">
        <button onClick={() => onNavigate('guides')} className="inline-flex items-center gap-1.5 hover:text-[var(--accent-text)] cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" /> Guides
        </button>
        <span>/</span>
        <span className="text-[var(--text-secondary)]">{guide.category}</span>
      </nav>

      <header className="max-w-3xl mb-10">
        <h1 className="text-3xl sm:text-[2.75rem] font-extrabold text-[var(--text-primary)] leading-[1.15] mb-5">{guide.title}</h1>
        <p className="text-lg text-[var(--text-secondary)] leading-relaxed mb-6">{guide.summary}</p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[var(--text-muted)] font-medium">
          <span className="inline-flex items-center gap-1.5">
            <img src="/logo.png" alt="" className="w-5 h-5 rounded-full bg-[var(--logo-bg)]" /> Fileficx Team
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5" /> Updated {formatDate(guide.updated)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> {guide.readMinutes} min read
          </span>
        </div>
      </header>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_260px] gap-12">
        <div className="prose-ffx max-w-3xl">
          {guide.sections.map((section) => (
            <section key={section.heading}>
              <h2 id={anchorId(section.heading)}>{section.heading}</h2>
              {section.blocks.map((block, i) => (
                <Block key={i} block={block} />
              ))}
            </section>
          ))}

          <div className="mt-12 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-7 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <p className="!m-0 text-lg font-bold text-[var(--text-primary)] font-display">Ready to format your file?</p>
              <p className="!m-0 text-sm">Free, private, and done in your browser.</p>
            </div>
            <button onClick={() => onNavigate('home')} className="btn btn-primary shrink-0">
              Open the tool <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-6">
            <div>
              <p className="eyebrow mb-3">On this page</p>
              <ul className="space-y-2 text-sm border-l border-[var(--border-subtle)]">
                {guide.sections.map((s) => (
                  <li key={s.heading}>
                    <a href={`#${anchorId(s.heading)}`} className="block pl-4 -ml-px border-l border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] transition-colors">
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => onNavigate(`guides/${next.slug}`)}
              className="w-full text-left rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 card-lift cursor-pointer"
            >
              <span className="eyebrow">Next guide</span>
              <span className="block mt-1.5 text-sm font-semibold text-[var(--text-primary)] leading-snug">{next.title}</span>
            </button>
          </div>
        </aside>
      </div>

      <section className="mt-20" aria-labelledby="related-title">
        <h2 id="related-title" className="text-2xl font-extrabold text-[var(--text-primary)] mb-6">
          Keep reading
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {related.map((g) => (
            <GuideCard key={g.slug} guide={g} onNavigate={onNavigate} />
          ))}
        </div>
      </section>
    </article>
  );
};

export const GuidesPage: React.FC<GuidesPageProps> = ({ slug, onNavigate }) => {
  const guide = slug ? getGuide(slug) : undefined;


  if (slug && !guide) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center animate-slide-up">
        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] mb-3">Guide not found</h1>
        <p className="text-[var(--text-secondary)] mb-6">That guide may have moved. Browse all guides instead.</p>
        <button onClick={() => onNavigate('guides')} className="btn btn-primary">
          All guides
        </button>
      </div>
    );
  }

  return guide ? <GuideArticle guide={guide} onNavigate={onNavigate} /> : <GuidesIndex onNavigate={onNavigate} />;
};
