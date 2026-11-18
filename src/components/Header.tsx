import React, { useEffect, useState } from 'react';
import { Sun, Moon, RotateCcw, Menu, X, ArrowRight } from 'lucide-react';

interface HeaderProps {
  currentTheme: 'light' | 'dark';
  onToggleTheme: () => void;
  hasFile?: boolean;
  onTryAnother?: () => void;
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

const PRIMARY_NAV = [
  { id: 'home', label: 'Tool' },
  { id: 'guides', label: 'Guides' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

const MOBILE_EXTRA = [
  { id: 'privacy', label: 'Privacy Policy' },
  { id: 'terms', label: 'Terms & Conditions' },
];

export const Header: React.FC<HeaderProps> = ({
  currentTheme,
  onToggleTheme,
  hasFile = false,
  onTryAnother,
  currentPage = 'home',
  onNavigate = () => {},
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (page: string) => {
    setMobileMenuOpen(false);
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isActive = (id: string) => currentPage === id || (id === 'guides' && currentPage.startsWith('guides'));

  return (
    <header className="sticky top-0 z-50 w-full px-3 sm:px-6 pt-3 transition-all duration-300">
      <div
        className={`max-w-6xl mx-auto rounded-full bg-[var(--header-bg)] backdrop-blur-xl border px-3 sm:px-5 py-2 flex items-center justify-between gap-3 transition-all duration-300 ${
          scrolled ? 'border-[var(--border)] shadow-[var(--shadow-soft)]' : 'border-[var(--border-subtle)]'
        }`}
      >
        {/* Brand */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            if (currentPage !== 'home') handleNav('home');
            else if (onTryAnother) onTryAnother();
          }}
          className="flex items-center gap-2.5 group shrink-0"
          aria-label="Fileficx home"
        >
          <span className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-[var(--border)] bg-[var(--logo-bg)] flex items-center justify-center p-0.5 group-hover:scale-105 transition-transform duration-300 shadow-md shadow-[var(--accent-glow)]">
            <img src="/logo.png" alt="" className="w-full h-full object-cover rounded-full" />
          </span>
          <span className="flex flex-col text-left leading-none">
            <span className="font-display text-[17px] font-extrabold tracking-tight text-[var(--text-primary)]">
              Fileficx
            </span>
            <span className="hidden sm:block text-[9.5px] font-semibold text-[var(--text-muted)] tracking-wide mt-1">
              Photo &amp; document resizer
            </span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-0.5 bg-[var(--input-inner-bg)] border border-[var(--border-subtle)] p-1 rounded-full text-[13px] font-semibold"
        >
          {PRIMARY_NAV.map((item) => (
            <a
              key={item.id}
              href={item.id === 'home' ? '/' : `/${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleNav(item.id);
              }}
              aria-current={isActive(item.id) ? 'page' : undefined}
              className="nav-pill"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          {hasFile && onTryAnother && currentPage === 'home' && (
            <button
              onClick={onTryAnother}
              className="btn btn-outline text-xs !py-1.5 !px-3.5"
              title="Return to upload view to select another file"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Try Another File</span>
            </button>
          )}

          {currentPage !== 'home' && (
            <button onClick={() => handleNav('home')} className="hidden sm:inline-flex btn btn-primary text-xs !py-1.5 !px-4">
              <span>Open the tool</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={onToggleTheme}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-surface)] border border-transparent hover:border-[var(--border-subtle)] transition-all duration-200 cursor-pointer"
            title={currentTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            aria-label="Toggle Theme"
          >
            {currentTheme === 'light' ? <Moon className="w-[18px] h-[18px]" /> : <Sun className="w-[18px] h-[18px] text-amber-300" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--hover-surface)] cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[var(--accent)]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile"
          className="md:hidden max-w-6xl mx-auto mt-2 p-2 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-[var(--shadow-lift)] text-sm font-semibold animate-slide-up"
        >
          {[...PRIMARY_NAV, ...MOBILE_EXTRA].map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-colors cursor-pointer ${
                isActive(item.id)
                  ? 'bg-[var(--accent-subtle)] text-[var(--accent-text)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--hover-surface)] hover:text-[var(--text-primary)]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
};
