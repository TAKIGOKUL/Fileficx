import { useState } from 'react';
import { 
  ArrowLeft, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  Clock, 
  Github, 
  Linkedin, 
  Instagram, 
  HelpCircle
} from 'lucide-react';

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Suggest a New Portal Preset');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setMessage('');
    }, 4000);
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
        <span className="text-xs text-[var(--accent)] font-semibold">Contact &amp; Support</span>
      </div>

      {/* Hero Header Section */}
      <div className="space-y-4 max-w-3xl">
        <div className="badge-mooni shadow-lg shadow-[var(--accent)]/15">
          <MessageSquare className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>Communications &amp; Developer Support</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-[var(--text-primary)] tracking-tight leading-[1.15]">
          Direct Communication with the <br />
          <span className="text-color-gradient-brand">Engineering Team</span>
        </h1>

        <p className="text-sm sm:text-base text-[var(--text-secondary)] font-normal leading-relaxed">
          Need a specific state examination or consulate visa preset added to our engine? Found an updated portal constraint? Send us a direct dispatch below.
        </p>
      </div>

      {/* Main 2-Column Grid: Form + Support Information */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 7 Cols: Interactive Contact Form */}
        <div className="lg:col-span-7 mooni-card p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              Send an Engineering Dispatch
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              All inquiries are reviewed directly by the maintainer.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-center space-y-3 animate-slide-up">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[var(--text-primary)]">
                Dispatch Transmitted Successfully
              </h3>
              <p className="text-xs text-[var(--text-secondary)] font-normal max-w-sm mx-auto leading-relaxed">
                Thank you for your feedback. We review preset suggestions and compatibility reports rapidly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Chen"
                    className="w-full bg-[var(--input-inner-bg)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] font-medium transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@domain.com"
                    className="w-full bg-[var(--input-inner-bg)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] font-medium transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                  Subject Category
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-[var(--input-inner-bg)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] font-medium transition-colors"
                >
                  <option value="Suggest a New Portal Preset">💡 Suggest a New Portal Preset (e.g. State Exam, Visa)</option>
                  <option value="Report Changed Specification">⚠️ Report an Updated / Changed Portal Rule</option>
                  <option value="Bug Report">🐛 Bug Report / Browser Compatibility Issue</option>
                  <option value="Privacy / Compliance">🔒 Privacy &amp; Security Architecture Inquiry</option>
                  <option value="General Feedback">💬 General Feedback &amp; Collaboration</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                  Message Details
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide portal name, required pixel dimensions, file size in KB, DPI, or your feedback..."
                  className="w-full bg-[var(--input-inner-bg)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] font-medium resize-none transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full btn btn-primary py-3 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[var(--accent)]/30 hover:scale-[1.01] active:scale-98 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Transmit Dispatch</span>
              </button>

            </form>
          )}
        </div>

        {/* Right 5 Cols: Direct Contact Channels & Quick FAQ */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* SLA Card */}
          <div className="mooni-card p-6 border-[var(--accent-border)] bg-gradient-to-br from-[var(--accent-subtle)]/25 to-transparent space-y-2">
            <div className="flex items-center gap-2 text-[var(--accent)] font-mono text-xs font-bold uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Response Turnaround</span>
            </div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Typical SLA: Under 24 Hours
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed font-normal">
              For urgent portal submission deadlines or broken preset issues, messaging our Telegram channel yields the fastest resolution.
            </p>
          </div>

          {/* Direct Social Channels */}
          <div className="mooni-card p-6 space-y-4">
            <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">
              Direct Engineering Handles
            </h3>

            <div className="space-y-2.5">
              
              <a
                href="https://t.me/alchemist_taki"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-[var(--input-inner-bg)] hover:bg-[var(--accent-subtle)] border border-[var(--border-subtle)] hover:border-[var(--accent-border)] transition-all flex items-center gap-3 group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                    Telegram Direct
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] font-mono">
                    @alchemist_taki (Fastest)
                  </div>
                </div>
              </a>

              <a
                href="https://github.com/TAKIGOKUL"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-[var(--input-inner-bg)] hover:bg-[var(--accent-subtle)] border border-[var(--border-subtle)] hover:border-[var(--accent-border)] transition-all flex items-center gap-3 group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Github className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                    GitHub Codebase
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] font-mono">
                    github.com/TAKIGOKUL
                  </div>
                </div>
              </a>

              <a
                href="https://www.linkedin.com/in/gokul-gk-b0b718261/"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-[var(--input-inner-bg)] hover:bg-[var(--accent-subtle)] border border-[var(--border-subtle)] hover:border-[var(--accent-border)] transition-all flex items-center gap-3 group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Linkedin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                    LinkedIn Network
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] font-mono">
                    Gokul GK
                  </div>
                </div>
              </a>

              <a
                href="https://www.instagram.com/ad.astra.___/"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-[var(--input-inner-bg)] hover:bg-[var(--accent-subtle)] border border-[var(--border-subtle)] hover:border-[var(--accent-border)] transition-all flex items-center gap-3 group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Instagram className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                    Instagram Updates
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] font-mono">
                    @ad.astra.___
                  </div>
                </div>
              </a>

            </div>
          </div>

          {/* Quick FAQ snippet */}
          <div className="mooni-card p-6 space-y-3">
            <div className="flex items-center gap-2 text-[var(--text-primary)] font-bold text-xs">
              <HelpCircle className="w-4 h-4 text-[var(--accent)]" />
              <span>Common Support Questions</span>
            </div>
            <div className="space-y-2 text-[11px] text-[var(--text-muted)] leading-relaxed">
              <p>
                <strong className="text-[var(--text-primary)]">Q: Why did my upload fail?</strong><br />
                Ensure your file is a valid image (JPG, PNG, WEBP, HEIC) or standard PDF document under 50MB.
              </p>
              <p>
                <strong className="text-[var(--text-primary)]">Q: How do I request a state portal preset?</strong><br />
                Select "Suggest a New Portal Preset" above and paste the official dimension, KB, and DPI requirements.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ContactPage;
