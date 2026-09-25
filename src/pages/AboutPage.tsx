import React from 'react';
import { ArrowLeft, Mail, Github, Twitter, ShieldCheck, Zap, Layers, HardDrive } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12 animate-slide-up text-left">
      
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
        <span className="text-xs text-[var(--text-muted)] font-medium">About</span>
      </div>

      {/* Header Section */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Precision Document Optimization, Built for Complete Privacy.
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-muted)] font-normal max-w-2xl leading-relaxed">
          Fileficx is a high-performance, client-side utility designed to format, resize, resample, and optimize documents for strict application portals without sending your data to external servers.
        </p>
      </div>

      {/* Engineering & Core Architecture Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-4">
        <h2 className="text-base font-bold text-[var(--text-primary)]">
          The Problem with Traditional Converters
        </h2>
        <div className="space-y-3 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-normal">
          <p>
            Government job portals, visa applications, and university admissions often demand hyper-specific document constraints: exact pixel dimensions, strict kilobyte ceilings, and precise DPI resolutions. Failing these specifications results in instant portal rejection.
          </p>
          <p>
            Conventional file conversion services require uploading sensitive personal documents—biometric passport photos, government IDs, signatures, and degree certificates—to remote servers where they may be logged or exposed.
          </p>
          <p>
            Fileficx is built with a zero-server architecture. All image compression, pixel resampling, DPI injection, and PDF manipulation are computed strictly inside your browser's local RAM using WebAssembly and HTML5 Canvas. Your files never leave your device.
          </p>
        </div>
      </div>

      {/* Performance & Architecture Metrics Bento Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">
          Engineered for Performance
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stat 1 */}
          <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
              100%
            </div>
            <div className="text-xs font-semibold text-[var(--text-primary)]">
              Client-Side Privacy
            </div>
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              Zero bytes transmitted to external backend servers.
            </p>
          </div>

          {/* Stat 2 */}
          <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
              &lt; 50ms
            </div>
            <div className="text-xs font-semibold text-[var(--text-primary)]">
              Real-Time Latency
            </div>
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              Near-instant in-memory canvas and WebAssembly processing.
            </p>
          </div>

          {/* Stat 3 */}
          <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
              50+
            </div>
            <div className="text-xs font-semibold text-[var(--text-primary)]">
              Portal Standards
            </div>
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              Calibrated for SSC, UPSC, IBPS, Passport, Schengen & state portals.
            </p>
          </div>

          {/* Stat 4 */}
          <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center">
              <HardDrive className="w-4 h-4" />
            </div>
            <div className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
              0 KB
            </div>
            <div className="text-xs font-semibold text-[var(--text-primary)]">
              Server Storage
            </div>
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              No databases, session storage, or persistent logging of your files.
            </p>
          </div>
        </div>
      </div>

      {/* Connect / Open Source */}
      <div className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
        <h3 className="text-sm font-bold text-[var(--text-primary)]">Connect & Support</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => onNavigate('contact')}
            className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent)] text-left transition-colors cursor-pointer flex items-center gap-3"
          >
            <Mail className="w-4 h-4 text-[var(--accent)] shrink-0" />
            <div>
              <div className="font-semibold text-xs text-[var(--text-primary)]">Contact Support</div>
              <div className="text-[11px] text-[var(--text-muted)]">Direct inquiries</div>
            </div>
          </button>

          <a
            href="https://github.com/TAKIGOKUL/Fileficx.git"
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent)] transition-colors flex items-center gap-3"
          >
            <Github className="w-4 h-4 text-[var(--accent)] shrink-0" />
            <div>
              <div className="font-semibold text-xs text-[var(--text-primary)]">GitHub Repository</div>
              <div className="text-[11px] text-[var(--text-muted)]">TAKIGOKUL / Fileficx</div>
            </div>
          </a>

          <a
            href="https://x.com"
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent)] transition-colors flex items-center gap-3"
          >
            <Twitter className="w-4 h-4 text-[var(--accent)] shrink-0" />
            <div>
              <div className="font-semibold text-xs text-[var(--text-primary)]">Twitter / X</div>
              <div className="text-[11px] text-[var(--text-muted)]">Product updates</div>
            </div>
          </a>
        </div>
      </div>

    </div>
  );
};
