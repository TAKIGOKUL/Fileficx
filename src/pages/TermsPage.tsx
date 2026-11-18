import { ArrowLeft, Scale, FileText } from 'lucide-react';

interface TermsPageProps {
  onNavigate: (page: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
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
        <span className="text-xs text-[var(--accent)] font-semibold">Terms &amp; Conditions</span>
      </div>

      {/* Hero Header Section */}
      <div className="space-y-4 max-w-3xl">
        <div className="badge-mooni shadow-lg shadow-[var(--accent)]/15">
          <Scale className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>Governance &amp; Operational Protocols</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-[var(--text-primary)] tracking-tight leading-[1.15]">
          Clear, Transparent Terms for <br />
          <span className="text-color-gradient-brand">Every Applicant Worldwide</span>
        </h1>

        <p className="text-sm sm:text-base text-[var(--text-secondary)] font-normal leading-relaxed">
          Fileficx is provided as a free public utility dedicated to streamlining document preparation for government examinations, employment portals, and consular visa processing.
        </p>

        <div className="text-xs text-[var(--text-muted)] font-mono pt-1">
          Effective Date: October 2026 • Version 2.4
        </div>
      </div>

      {/* Quick Summary Pill Card */}
      <div className="mooni-card p-6 sm:p-7 border-[var(--accent-border)] bg-gradient-to-r from-[var(--accent-subtle)]/20 via-[var(--bg-card)] to-transparent space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center font-bold shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <h2 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
            Summary of Key Terms
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
          You are free to use Fileficx for personal, academic, and professional document preparation. You retain 100% ownership of your documents at all times. Because Fileficx runs locally on your device without server inspection, you remain responsible for final visual verification before portal submission.
        </p>
      </div>

      {/* Main Legal Sections */}
      <div className="space-y-6">
        
        {/* Section 1 */}
        <section className="mooni-card p-6 sm:p-7 space-y-3">
          <div className="flex items-center gap-2 text-[var(--accent)] font-mono text-xs font-bold uppercase tracking-wider">
            <span>01</span>
            <span>•</span>
            <span>Acceptance &amp; Eligibility</span>
          </div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            Scope of Service &amp; Agreement
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-normal">
            By accessing or using Fileficx, you agree to be bound by these Terms of Service. Fileficx is accessible globally without mandatory user registration. If you are using this platform on behalf of another individual or candidate, you represent that you have appropriate authorization to prepare their application documents.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mooni-card p-6 sm:p-7 space-y-3">
          <div className="flex items-center gap-2 text-[var(--accent)] font-mono text-xs font-bold uppercase tracking-wider">
            <span>02</span>
            <span>•</span>
            <span>User Responsibilities &amp; Verification Protocol</span>
          </div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            Final Verification Protocol
          </h3>
          <div className="space-y-2.5 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-normal">
            <p>
              While Fileficx presets (including SSC, UPSC, IBPS, US Visa DS-160, Schengen Visa, and NTA portals) are calibrated rigorously against published government notifications, official authorities periodically update technical specifications without prior notice.
            </p>
            <p>
              <strong className="text-[var(--text-primary)]">Your Duty:</strong> You acknowledge that you must always review your final downloaded file (pixel dimensions, file size in kilobytes, and visual clarity) against your official portal notification before final payment and submission.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section className="mooni-card p-6 sm:p-7 space-y-3">
          <div className="flex items-center gap-2 text-[var(--accent)] font-mono text-xs font-bold uppercase tracking-wider">
            <span>03</span>
            <span>•</span>
            <span>Client-Side Runtime &amp; Hardware Requirements</span>
          </div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            Hardware Execution &amp; Browser Compatibility
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-normal">
            Fileficx is powered by client-side WebAssembly, HTML5 Canvas, and modern JavaScript Web Workers. To use the platform effectively, you must utilize an updated browser (Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge, or Brave) with JavaScript enabled. Processing speed depends entirely upon your local device hardware.
          </p>
        </section>

        {/* Section 4 */}
        <section className="mooni-card p-6 sm:p-7 space-y-3">
          <div className="flex items-center gap-2 text-[var(--accent)] font-mono text-xs font-bold uppercase tracking-wider">
            <span>04</span>
            <span>•</span>
            <span>Acceptable Use &amp; Prohibited Conduct</span>
          </div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            Platform Security &amp; Fair Use
          </h3>
          <div className="space-y-2.5 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-normal">
            <p>
              When utilizing Fileficx, you agree not to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[var(--text-muted)]">
              <li>Deploy automated headless crawlers, scrapers, or click bots designed to generate fraudulent ad impressions or degrade infrastructure.</li>
              <li>Attempt to reverse-engineer or rebrand Fileficx source code for paid distribution without attribution.</li>
              <li>Use the software to forge, falsify, or tamper with official government seals or unauthorized third-party credentials.</li>
            </ul>
          </div>
        </section>

        {/* Section 5 */}
        <section className="mooni-card p-6 sm:p-7 space-y-3">
          <div className="flex items-center gap-2 text-[var(--accent)] font-mono text-xs font-bold uppercase tracking-wider">
            <span>05</span>
            <span>•</span>
            <span>Warranty Disclaimer &amp; Limitation of Liability</span>
          </div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            Disclaimer of Warranty
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-normal">
            Fileficx is provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied. To the maximum extent permitted by applicable law, Fileficx and its developers shall not be liable for any direct, indirect, incidental, or consequential damages resulting from portal application rejections, deadline omissions, or hardware limitations.
          </p>
        </section>

        {/* Section 6 */}
        <section className="mooni-card p-6 sm:p-7 space-y-3">
          <div className="flex items-center gap-2 text-[var(--accent)] font-mono text-xs font-bold uppercase tracking-wider">
            <span>06</span>
            <span>•</span>
            <span>Contact &amp; Amendments</span>
          </div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            Policy Updates &amp; Feedback
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-normal">
            We reserve the right to amend these terms to reflect ongoing portal requirements and technological advancements. For inquiries regarding licensing or terms of use, contact our engineering team via our <button onClick={() => onNavigate('contact')} className="text-[var(--accent)] font-bold hover:underline cursor-pointer">Contact Page</button>.
          </p>
        </section>

      </div>

    </div>
  );
};

export default TermsPage;
