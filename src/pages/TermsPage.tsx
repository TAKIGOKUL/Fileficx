import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface TermsPageProps {
  onNavigate: (page: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 animate-slide-up text-left">
      
      {/* Back Button & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--input-inner-bg)] hover:bg-[var(--bg-card)] px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer border border-[var(--border-subtle)]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
        <span className="text-xs text-[var(--text-muted)]">/</span>
        <span className="text-xs text-[var(--text-muted)] font-medium">Terms and Conditions</span>
      </div>

      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Terms and Conditions
        </h1>
        <p className="text-xs text-[var(--text-muted)] font-medium">
          Effective date: September 25, 2026
        </p>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-6 text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed font-normal">
        
        <section className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2.5">
          <h2 className="text-sm font-bold text-[var(--text-primary)]">
            1. Acceptance of Terms
          </h2>
          <p className="text-[var(--text-muted)]">
            By accessing or using Fileficx, you agree to comply with and be bound by these Terms and Conditions. Fileficx is provided as a client-side document processing utility for job applicants, students, and citizens preparing files for government, visa, and institutional portals.
          </p>
        </section>

        <section className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2.5">
          <h2 className="text-sm font-bold text-[var(--text-primary)]">
            2. Intellectual Property & License
          </h2>
          <p className="text-[var(--text-muted)]">
            You are granted a personal, non-exclusive license to use Fileficx for document preparation. Reverse-engineering of proprietary optimization routines or redistributing the compiled WebAssembly binaries for unauthorized resale is prohibited.
          </p>
        </section>

        <section className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2.5">
          <h2 className="text-sm font-bold text-[var(--text-primary)]">
            3. Disclaimer of Warranty & Portal Compliance
          </h2>
          <p className="text-[var(--text-muted)]">
            Fileficx is provided on an "as-is" basis. While our presets are continuously verified against published standards (SSC, UPSC, IBPS, NTA, Passport Seva), users remain solely responsible for reviewing and verifying final document specifications before submitting applications to official authorities.
          </p>
        </section>

        <section className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2.5">
          <h2 className="text-sm font-bold text-[var(--text-primary)]">
            4. Advertising & Monetization
          </h2>
          <p className="text-[var(--text-muted)]">
            Our service displays ads via Google AdSense. Users must not deploy automated traffic bots, scrapers, or click farms intended to manipulate advertising metrics.
          </p>
        </section>

      </div>

    </div>
  );
};
