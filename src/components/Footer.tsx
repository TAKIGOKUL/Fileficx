import React from 'react';
import { Heart, Mail, Twitter, Github, Shield, Sparkles, FileText, User, Lock, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate = () => {} }) => {
  const openConsentPreferences = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('open_cmp_preferences'));
    }
  };

  const handleNav = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full border-t border-[var(--border-subtle)] pt-12 pb-14 text-xs text-[var(--text-muted)] mt-16 transition-colors bg-[var(--bg-card)]/60 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Top Footer Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[var(--border-subtle)] text-left">
          
          {/* Col 1 & 2: Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => handleNav('home')}
                className="text-xl font-black tracking-tight text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors cursor-pointer"
              >
                Fileficx
              </button>
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent)]/20">
                <Lock className="w-3 h-3 text-emerald-500" />
                Zero-Server Privacy Vault
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-md font-medium">
              Empowering job applicants, students, and creators worldwide with instant, in-browser document & photo optimization. No files leave your device.
            </p>
            
            {/* Social Links */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
              <button
                onClick={() => handleNav('contact')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] hover:border-[var(--accent)] text-[var(--text-primary)] font-semibold transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
              >
                <Mail className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>Contact Support</span>
              </button>

              <a
                href="https://github.com/TAKIGOKUL/Fileficx.git"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] hover:border-[var(--accent)] text-[var(--text-primary)] font-semibold transition-all hover:scale-[1.02] active:scale-95"
              >
                <Github className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>GitHub</span>
                <ArrowUpRight className="w-3 h-3 opacity-50" />
              </a>

              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] hover:border-[var(--accent)] text-[var(--text-primary)] font-semibold transition-all hover:scale-[1.02] active:scale-95"
              >
                <Twitter className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>Twitter / X</span>
                <ArrowUpRight className="w-3 h-3 opacity-50" />
              </a>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div className="space-y-3">
            <h4 className="font-extrabold uppercase tracking-wider text-[10px] text-[var(--text-primary)]">
              Trust & Governance
            </h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-[var(--accent)] transition-colors cursor-pointer flex items-center gap-2 group"
                >
                  <User className="w-3.5 h-3.5 text-[var(--accent)] group-hover:scale-110 transition-transform" />
                  <span>About Us & Story</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-[var(--accent)] transition-colors cursor-pointer flex items-center gap-2 group"
                >
                  <Mail className="w-3.5 h-3.5 text-[var(--accent)] group-hover:scale-110 transition-transform" />
                  <span>Contact Us & Support</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('privacy')}
                  className="hover:text-[var(--accent)] transition-colors cursor-pointer flex items-center gap-2 group"
                >
                  <Shield className="w-3.5 h-3.5 text-[var(--accent)] group-hover:scale-110 transition-transform" />
                  <span>Privacy Policy & GDPR</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Preferences & Legal */}
          <div className="space-y-3">
            <h4 className="font-extrabold uppercase tracking-wider text-[10px] text-[var(--text-primary)]">
              Legal & Privacy Settings
            </h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <button
                  onClick={() => handleNav('terms')}
                  className="hover:text-[var(--accent)] transition-colors cursor-pointer flex items-center gap-2 group"
                >
                  <FileText className="w-3.5 h-3.5 text-[var(--accent)] group-hover:scale-110 transition-transform" />
                  <span>Terms & Conditions</span>
                </button>
              </li>
              <li>
                <button
                  onClick={openConsentPreferences}
                  className="hover:text-[var(--accent)] transition-colors cursor-pointer flex items-center gap-2 group text-[var(--accent)] font-bold"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[var(--accent)] group-hover:rotate-12 transition-transform" />
                  <span>Cookie Preferences (CMP)</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar Disclaimer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] font-medium">
          <div>
            © {new Date().getFullYear()} Fileficx — Built securely with WebAssembly. No files are uploaded to any server.
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] font-semibold">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline" />
            <span>for job seekers & creators worldwide</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
