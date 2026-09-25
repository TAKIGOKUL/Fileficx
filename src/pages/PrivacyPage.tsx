import React from 'react';
import { ArrowLeft, Lock, Sliders } from 'lucide-react';

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
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--input-inner-bg)] hover:bg-[var(--bg-card)] px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer border border-[var(--border-subtle)]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
        <span className="text-xs text-[var(--text-muted)]">/</span>
        <span className="text-xs text-[var(--text-muted)] font-medium">Privacy Policy</span>
      </div>

      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-[var(--text-muted)] font-medium">
          Effective date: September 25, 2026
        </p>
      </div>

      {/* 100% In-Browser Privacy Guarantee Card */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[var(--bg-card)] border border-emerald-500/30 space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Lock className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-[var(--text-primary)]">Zero-Server Architecture Guarantee</h2>
        </div>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-normal">
          Fileficx executes all document scaling, image compression, format conversion, and DPI normalization locally inside your web browser's RAM via WebAssembly and HTML5 Canvas. Your sensitive documents, signatures, biometric photos, and certificates are never uploaded, stored, or transmitted to any external server.
        </p>
      </div>

      {/* Detailed Legal Sections */}
      <div className="space-y-6 text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed">
        
        <section className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2.5">
          <h2 className="text-sm font-bold text-[var(--text-primary)]">
            1. Information We Collect
          </h2>
          <p className="text-[var(--text-muted)] font-normal">
            We only collect information you provide directly, such as when you contact support via email or configure local theme preferences in your browser. <strong>Uploaded files are processed purely in client-side memory and are never collected, logged, or retained.</strong>
          </p>
        </section>

        <section className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2.5">
          <h2 className="text-sm font-bold text-[var(--text-primary)]">
            2. Google AdSense & Advertising
          </h2>
          <p className="text-[var(--text-muted)] font-normal">
            We utilize Google AdSense (Publisher ID: <code className="text-xs bg-[var(--input-inner-bg)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)]">ca-pub-2244853446692512</code>) to support platform operations. Google and certified third-party ad networks may place cookies on your browser to deliver contextual advertisements.
          </p>
          <p className="text-[var(--text-muted)] font-normal">
            To learn how Google manages advertising data, visit the <a href="https://www.google.com/policies/privacy/partners/" target="_blank" rel="noreferrer" className="text-[var(--accent)] underline font-medium">Google Partner Policy</a>. You can manage or disable ad personalization through <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer" className="text-[var(--accent)] underline font-medium">Google Ads Settings</a>.
          </p>
        </section>

        <section className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2.5">
          <h2 className="text-sm font-bold text-[var(--text-primary)]">
            3. GDPR, UK & Swiss Compliance (TCF v2.2)
          </h2>
          <p className="text-[var(--text-muted)] font-normal">
            For users in the European Economic Area (EEA), UK, and Switzerland, data consent preferences are managed via our Google Certified Consent Management Platform (CMP).
          </p>
          <div className="pt-1">
            <button
              onClick={openConsentPreferences}
              className="btn btn-secondary text-xs py-2 px-4 rounded-xl font-semibold inline-flex items-center gap-2 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Manage Cookie Preferences</span>
            </button>
          </div>
        </section>

        <section className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2.5">
          <h2 className="text-sm font-bold text-[var(--text-primary)]">
            4. Children's Privacy (COPPA)
          </h2>
          <p className="text-[var(--text-muted)] font-normal">
            Fileficx is not directed at children under the age of 13, and we do not knowingly collect personal information from minors.
          </p>
        </section>

      </div>

    </div>
  );
};
