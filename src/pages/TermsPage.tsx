import React from 'react';
import { ArrowLeft, FileText, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

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
          className="inline-flex items-center gap-2 text-xs font-bold text-[var(--accent)] bg-[var(--accent-subtle)] hover:bg-[var(--accent)] hover:text-white px-4 py-2 rounded-full transition-all duration-200 cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
        <span className="text-xs text-[var(--text-muted)] font-medium">/ Terms and Conditions</span>
      </div>

      {/* Header Section */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[var(--accent)] bg-[var(--accent-subtle)] px-3.5 py-1 rounded-full border border-[var(--accent)]/20">
          <FileText className="w-3.5 h-3.5" />
          <span>USER AGREEMENT & DISCLAIMER</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[var(--text-primary)] tracking-tight">
          Terms and Conditions
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] font-medium">
          Last updated: 25/09/2026 • Please read carefully before using Fileficx
        </p>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-6 text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed font-medium">
        
        <section className="p-6 sm:p-7 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-3">
          <h2 className="text-base font-extrabold text-[var(--text-primary)] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" />
            <span>1. Acceptance of Terms</span>
          </h2>
          <p className="text-[var(--text-muted)]">
            By accessing or using Fileficx, you agree to be bound by these Terms and Conditions. Fileficx is provided as a free public utility for students, job applicants, and citizens preparing files for government portals, visa applications, and corporate uploads.
          </p>
        </section>

        <section className="p-6 sm:p-7 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-3">
          <h2 className="text-base font-extrabold text-[var(--text-primary)] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[var(--accent)]" />
            <span>2. Intellectual Property & Use License</span>
          </h2>
          <p className="text-[var(--text-muted)]">
            Permission is granted to use Fileficx for personal and commercial file preparation. You may not reverse-engineer the core WebAssembly processing binaries or copy the engine codebase for resale without explicit permission.
          </p>
        </section>

        <section className="p-6 sm:p-7 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-3">
          <h2 className="text-base font-extrabold text-[var(--text-primary)] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>3. Disclaimer & Limitation of Liability</span>
          </h2>
          <p className="text-[var(--text-muted)]">
            Fileficx is provided on an "as-is" basis. While our algorithms are calibrated against official guidelines (SSC, UPSC, IBPS, NTA, Passport Seva), users remain responsible for checking official application notifications to verify requirements before submitting their final application.
          </p>
        </section>

        <section className="p-6 sm:p-7 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-3">
          <h2 className="text-base font-extrabold text-[var(--text-primary)] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[var(--accent)]" />
            <span>4. Google AdSense Advertising Compliance</span>
          </h2>
          <p className="text-[var(--text-muted)]">
            Our platform displays advertisements through Google AdSense. Users must not engage in artificial click generation, automated traffic bots, or attempts to manipulate advertising metrics.
          </p>
        </section>

      </div>

    </div>
  );
};
