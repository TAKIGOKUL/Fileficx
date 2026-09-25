import React from 'react';
import { Code2, Github, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';

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
    <footer className="w-full border-t border-[var(--border-subtle)] pt-14 pb-8 text-xs text-[var(--text-muted)] mt-20 transition-colors bg-[var(--bg-card)]/70 backdrop-blur-md overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Top Footer Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-left">
          
          {/* Brand & Description (Col 1-6) */}
          <div className="md:col-span-6 space-y-3.5">
            <div 
              onClick={() => handleNav('home')}
              className="inline-flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-lg bg-[var(--accent)] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <Code2 className="w-4 h-4" />
              </div>
              <span className="text-lg font-black tracking-tight text-[var(--text-primary)]">
                Fileficx
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-sm font-normal">
              Instant, in-browser document & photo optimization engineered for strict portal requirements. All processing occurs locally inside WebAssembly RAM with complete privacy.
            </p>
          </div>

          {/* Company Column (Col 7-9) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-bold text-xs text-[var(--text-primary)] tracking-wide">
              Company
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-[var(--accent)] transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-[var(--accent)] transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('privacy')}
                  className="hover:text-[var(--accent)] transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('terms')}
                  className="hover:text-[var(--accent)] transition-colors cursor-pointer"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-[var(--accent)] transition-colors cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Tools & Settings Column (Col 10-12) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-bold text-xs text-[var(--text-primary)] tracking-wide">
              Tools & Settings
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-[var(--accent)] transition-colors cursor-pointer"
                >
                  Passport & Photo Specs
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-[var(--accent)] transition-colors cursor-pointer"
                >
                  SSC & UPSC Presets
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-[var(--accent)] transition-colors cursor-pointer"
                >
                  PDF Compress & Merge
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-[var(--accent)] transition-colors cursor-pointer"
                >
                  DPI & Resolution Resizer
                </button>
              </li>
              <li>
                <button
                  onClick={openConsentPreferences}
                  className="hover:text-[var(--accent)] transition-colors cursor-pointer text-[var(--accent)] font-semibold"
                >
                  Cookie Preferences (CMP)
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Massive Brand Watermark Typography */}
        <div className="w-full overflow-hidden select-none py-2 text-center pointer-events-none">
          <span className="block text-5xl sm:text-7xl md:text-8xl lg:text-[10.5rem] font-black tracking-tighter uppercase leading-none text-[var(--text-primary)] opacity-[0.07] dark:opacity-[0.12] transition-opacity">
            FILEFICX
          </span>
        </div>

        {/* Bottom Divider & Social Bar */}
        <div className="border-t border-[var(--border-subtle)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="text-[11px] text-[var(--text-muted)] font-normal flex flex-wrap items-center gap-1.5">
            <span>Built by <strong className="text-[var(--text-primary)] font-semibold">TAKIGOKUL</strong>. Powered securely by WebAssembly. No files are uploaded to any server.</span>
            <span>•</span>
            <button
              onClick={() => handleNav('privacy')}
              className="text-[var(--text-muted)] hover:text-[var(--accent)] underline transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3 text-[var(--text-muted)]">
            <a
              href="https://github.com/TAKIGOKUL/Fileficx.git"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-full hover:text-[var(--text-primary)] hover:bg-[var(--input-inner-bg)] transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-full hover:text-[var(--text-primary)] hover:bg-[var(--input-inner-bg)] transition-colors"
              aria-label="Twitter / X"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-full hover:text-[var(--text-primary)] hover:bg-[var(--input-inner-bg)] transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-full hover:text-[var(--text-primary)] hover:bg-[var(--input-inner-bg)] transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-full hover:text-[var(--text-primary)] hover:bg-[var(--input-inner-bg)] transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
