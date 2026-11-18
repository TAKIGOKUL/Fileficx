import { ArrowLeft, Lock, ShieldCheck, Sliders, EyeOff, Database, Sparkles, CheckCircle2 } from 'lucide-react';

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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-14 animate-slide-up text-left">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--input-inner-bg)] hover:bg-[var(--accent-subtle)] px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer border border-[var(--border-subtle)] hover:border-[var(--accent-border)]"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>Back to Workspace</span>
        </button>
        <span className="text-xs text-[var(--text-muted)]">/</span>
        <span className="text-xs text-[var(--accent)] font-semibold">Privacy Policy</span>
      </div>

      {/* Header Section */}
      <div className="space-y-4 max-w-3xl">
        <div className="badge-mooni shadow-lg shadow-[var(--accent)]/15">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>Privacy by Architecture</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-[var(--text-primary)] tracking-tight leading-[1.15]">
          Privacy Enforced by Code, <br />
          <span className="text-color-gradient-brand">Not Just Legal Promises</span>
        </h1>

        <p className="text-sm sm:text-base text-[var(--text-secondary)] font-normal leading-relaxed">
          Most online services ask you to trust their corporate policies. At Fileficx, we eliminate the need for trust altogether: our infrastructure is engineered without backend file upload endpoints. Your personal identification files never leave your computer.
        </p>
        
        <div className="text-xs text-[var(--text-muted)] font-mono pt-1">
          Last Updated &amp; Verified: October 2026 • Valid Globally
        </div>
      </div>

      {/* Primary Architectural Guarantee Card */}
      <div className="mooni-card p-6 sm:p-8 border-[var(--accent-border)] bg-gradient-to-r from-[var(--accent-subtle)]/25 via-[var(--bg-card)] to-transparent space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent-border)] flex items-center justify-center font-bold shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
              The Absolute Zero-Ingestion Covenant
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Client-Side WebAssembly Sandbox Isolation
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
          When you attach an identity photo, handwritten signature, passport scan, or academic marksheet to Fileficx, the data is loaded strictly into your local browser's volatile memory (RAM). Image compression, canvas bicubic resampling, and JPEG binary JFIF header injections are executed locally by client-side WebAssembly routines. No file bytes or visual previews are ever transmitted across the network.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-[var(--input-inner-bg)] border border-[var(--border-subtle)] flex items-center gap-2 text-xs font-semibold text-[var(--text-primary)]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>0 Bytes Server Storage</span>
          </div>
          <div className="p-3 rounded-xl bg-[var(--input-inner-bg)] border border-[var(--border-subtle)] flex items-center gap-2 text-xs font-semibold text-[var(--text-primary)]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Instant RAM Purge on Tab Close</span>
          </div>
          <div className="p-3 rounded-xl bg-[var(--input-inner-bg)] border border-[var(--border-subtle)] flex items-center gap-2 text-xs font-semibold text-[var(--text-primary)]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Zero Document Profiling</span>
          </div>
        </div>
      </div>

      {/* Detailed Policy Sections */}
      <div className="space-y-6">
        
        {/* Section 1 */}
        <section className="mooni-card p-6 sm:p-7 space-y-3">
          <div className="flex items-center gap-2 text-[var(--accent)] font-mono text-xs font-bold uppercase tracking-wider">
            <Database className="w-4 h-4" />
            <span>1. Information Processing &amp; Data Collection</span>
          </div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            What We Do and Do Not Collect
          </h3>
          <div className="space-y-2.5 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
            <p>
              <strong className="text-[var(--text-primary)]">Files &amp; Biometric Media:</strong> We collect zero files. All photos, signatures, PDFs, and certificates are isolated inside your client session.
            </p>
            <p>
              <strong className="text-[var(--text-primary)]">Device &amp; Interface Preferences:</strong> We use your browser's local storage (`localStorage`) solely to remember your preferred visual theme (`light` or `dark`). This data is never sent to us.
            </p>
            <p>
              <strong className="text-[var(--text-primary)]">Support Inquiries:</strong> If you voluntarily contact us via our contact form or direct communication channels, we receive only the message content, name, and contact details you explicitly provide in order to reply to your inquiry.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section className="mooni-card p-6 sm:p-7 space-y-3">
          <div className="flex items-center gap-2 text-[var(--accent)] font-mono text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>2. Google AdSense &amp; Third-Party Advertising</span>
          </div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            Advertising Standards &amp; Publisher Transparency
          </h3>
          <div className="space-y-3 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
            <p>
              To maintain Fileficx as a 100% free public service for students and applicants worldwide, we partner with Google AdSense (Publisher ID: <code className="text-xs bg-[var(--input-inner-bg)] px-2 py-0.5 rounded-md border border-[var(--border-subtle)] font-mono text-[var(--accent)]">ca-pub-2244853446692512</code>) to serve contextual and non-intrusive advertisements.
            </p>
            <p>
              Google and certified advertising network partners may use cookies and web beacons to serve ads based on prior visits to this or other websites. These cookies do not have access to your uploaded files, local memory, or biometric data.
            </p>
            <p>
              You can review how Google handles data in advertising by reading the <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noreferrer" className="text-[var(--accent)] hover:underline font-semibold">Google Advertising Privacy &amp; Terms</a>. You may personalize or opt out of personalized advertising at any time through <a href="https://myadcenter.google.com/" target="_blank" rel="noreferrer" className="text-[var(--accent)] hover:underline font-semibold">Google My Ad Center</a>.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section className="mooni-card p-6 sm:p-7 space-y-4">
          <div className="flex items-center gap-2 text-[var(--accent)] font-mono text-xs font-bold uppercase tracking-wider">
            <Sliders className="w-4 h-4" />
            <span>3. GDPR, UK DPA &amp; International Consent Management (TCF v2.2)</span>
          </div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            Your Rights in the European Union, United Kingdom, and Switzerland
          </h3>
          <div className="space-y-3 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
            <p>
              In accordance with the General Data Protection Regulation (GDPR) and the IAB Europe Transparency and Consent Framework (TCF v2.2), users residing in the European Economic Area, UK, and Switzerland are presented with a Google-Certified Consent Management Platform (CMP).
            </p>
            <p>
              You maintain full legal authority to grant, customize, or revoke consent for ad personalization, audience measurements, and essential cookies at any moment.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={openConsentPreferences}
              className="btn btn-secondary text-xs py-2 px-5 rounded-full font-bold inline-flex items-center gap-2 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Configure Cookie &amp; Consent Preferences</span>
            </button>
          </div>
        </section>

        {/* Section 4 */}
        <section className="mooni-card p-6 sm:p-7 space-y-3">
          <div className="flex items-center gap-2 text-[var(--accent)] font-mono text-xs font-bold uppercase tracking-wider">
            <EyeOff className="w-4 h-4" />
            <span>4. Protection of Minors (COPPA &amp; Global Standards)</span>
          </div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            Student &amp; Minor Privacy Protection
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
            Fileficx is commonly used by students under the age of 18 formatting school certificates and entrance examination photos (e.g. NEET, JEE, Olympiads). Because Fileficx does not collect, log, or transmit personal identity records, we do not build profiles or retain personal data from children or young adults.
          </p>
        </section>

        {/* Section 5 */}
        <section className="mooni-card p-6 sm:p-7 space-y-3">
          <div className="flex items-center gap-2 text-[var(--accent)] font-mono text-xs font-bold uppercase tracking-wider">
            <Lock className="w-4 h-4" />
            <span>5. Direct Privacy Officer Contact</span>
          </div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            Questions Regarding Our Privacy Architecture
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
            If you have technical inquiries, compliance questions, or wish to audit our client-side processing architecture, you can reach out directly via our <button onClick={() => onNavigate('contact')} className="text-[var(--accent)] font-bold hover:underline cursor-pointer">Contact Page</button> or message the creator on Telegram at <a href="https://t.me/alchemist_taki" target="_blank" rel="noreferrer" className="text-[var(--accent)] font-bold hover:underline">@alchemist_taki</a>.
          </p>
        </section>

      </div>

    </div>
  );
};

export default PrivacyPage;
