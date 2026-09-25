import React from 'react';
import { ArrowLeft, Lock, Shield, Sparkles, Cookie, EyeOff, FileCheck } from 'lucide-react';

interface PrivacyPageProps {
  onNavigate: (page: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  const openConsentPreferences = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('open_cmp_preferences'));
    }
  };

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
        <span className="text-xs text-[var(--text-muted)] font-medium">/ Privacy Policy</span>
      </div>

      {/* Header Section */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[var(--accent)] bg-[var(--accent-subtle)] px-3.5 py-1 rounded-full border border-[var(--accent)]/20">
          <Shield className="w-3.5 h-3.5" />
          <span>GDPR & TCF V2.2 COMPLIANCE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[var(--text-primary)] tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] font-medium">
          Last updated: 25/09/2026 • Effective immediately
        </p>
      </div>

      {/* 100% In-Browser Privacy Guarantee Vault Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-card)] border-2 border-emerald-500/30 shadow-xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-[var(--text-primary)]">100% Zero-Server Privacy Guarantee</h2>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">Your files never leave your device.</p>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed font-medium">
          Fileficx executes all document scaling, image compression, PDF splitting/merging, and DPI normalization locally inside your web browser's RAM via WebAssembly and HTML5 Canvas. We do not store, view, or transmit your uploaded photos, signatures, resumes, or certificates to any remote server.
        </p>
      </div>

      {/* Detailed Legal Sections */}
      <div className="space-y-8 text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed">
        
        <section className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-3">
          <h2 className="text-base font-extrabold flex items-center gap-2 text-[var(--text-primary)]">
            <FileCheck className="w-4 h-4 text-[var(--accent)]" />
            <span>1. Information We Collect</span>
          </h2>
          <p className="text-[var(--text-muted)]">
            We collect information you provide directly to us, such as when you contact us via email, submit a support form, or save theme preferences in your local browser storage. <strong>Uploaded document files are processed strictly in RAM and are never collected or stored.</strong>
          </p>
        </section>

        <section className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-3">
          <h2 className="text-base font-extrabold flex items-center gap-2 text-[var(--text-primary)]">
            <Cookie className="w-4 h-4 text-[var(--accent)]" />
            <span>2. Google AdSense and Third-Party Advertising</span>
          </h2>
          <p className="text-[var(--text-muted)]">
            We use Google AdSense (Publisher ID: <code>ca-pub-2244853446692512</code>) to serve advertisements on our website. Google AdSense and third-party advertising partners may place cookies on your browser, use web beacons, or collect IP addresses to serve personalized advertisements based on browsing behavior.
          </p>
          <p className="text-[var(--text-muted)]">
            For more information about how Google uses data, visit <a href="https://www.google.com/policies/privacy/partners/" target="_blank" rel="noreferrer" className="text-[var(--accent)] underline font-bold">Google Partner Privacy</a>. You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer" className="text-[var(--accent)] underline font-bold">Google Ads Settings</a>.
          </p>
        </section>

        <section className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-3">
          <h2 className="text-base font-extrabold flex items-center gap-2 text-[var(--text-primary)]">
            <Shield className="w-4 h-4 text-[var(--accent)]" />
            <span>3. EU/EEA, UK & Swiss GDPR Compliance (TCF v2.2)</span>
          </h2>
          <p className="text-[var(--text-muted)]">
            For users in the European Union, European Economic Area (EEA), United Kingdom, and Switzerland, we obtain transparent consent for data processing and personalized advertising through our Google Certified Consent Management Platform (CMP).
          </p>
          <div className="pt-2">
            <button
              onClick={openConsentPreferences}
              className="btn btn-secondary text-xs py-2.5 px-5 rounded-full font-bold inline-flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-[var(--accent)]" />
              <span>Modify Cookie Consent Preferences</span>
            </button>
          </div>
        </section>

        <section className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-3">
          <h2 className="text-base font-extrabold flex items-center gap-2 text-[var(--text-primary)]">
            <EyeOff className="w-4 h-4 text-[var(--accent)]" />
            <span>4. Children's Privacy (COPPA)</span>
          </h2>
          <p className="text-[var(--text-muted)]">
            Our service is not directed to children under 13 years of age. We do not knowingly collect personally identifiable information from children under 13.
          </p>
        </section>

      </div>

    </div>
  );
};
