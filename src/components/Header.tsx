import React, { useState } from 'react';
import { Sun, Moon, Zap, RotateCcw, Menu, X, BookOpen, User, Mail, Shield } from 'lucide-react';

interface HeaderProps {
  currentTheme: 'light' | 'dark';
  onToggleTheme: () => void;
  hasFile?: boolean;
  onTryAnother?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTheme,
  onToggleTheme,
  hasFile = false,
  onTryAnother
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const triggerModal = (type: string) => {
    setMobileMenuOpen(false);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open_footer_modal', { detail: type }));
    }
  };

  return (
    <header className="w-full bg-[var(--bg-card)]/95 backdrop-blur-md border-b border-[var(--border-subtle)] px-4 sm:px-8 py-3 transition-colors duration-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={onTryAnother}>
          <div className="w-9 h-9 rounded-xl bg-[var(--accent)] flex items-center justify-center text-white shadow-md shadow-[var(--accent)]/30">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <span className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
            Fileficx
          </span>
        </div>

        {/* Center Desktop Navigation Menu */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[var(--text-muted)]">
          <button
            onClick={() => triggerModal('guide')}
            className="hover:text-[var(--text-primary)] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Portal Guides</span>
          </button>
          <button
            onClick={() => triggerModal('about')}
            className="hover:text-[var(--text-primary)] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <User className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>About Us</span>
          </button>
          <button
            onClick={() => triggerModal('contact')}
            className="hover:text-[var(--text-primary)] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Contact Us</span>
          </button>
          <button
            onClick={() => triggerModal('privacy')}
            className="hover:text-[var(--text-primary)] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Privacy Policy</span>
          </button>
        </nav>

        {/* Center / Right Controls */}
        <div className="flex items-center gap-3">
          {/* Try Another File button - shown when a file is loaded */}
          {hasFile && onTryAnother && (
            <button
              onClick={onTryAnother}
              className="btn btn-primary text-xs sm:text-sm py-2 px-3.5 sm:px-4 rounded-full flex items-center gap-2 cursor-pointer shadow-md hover:scale-[1.02] active:scale-95 transition-all"
              title="Return to upload view to select another file"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="font-bold">Try Another File</span>
            </button>
          )}

          {/* Single-click Theme Toggle — moon in light mode, sun in dark mode */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            title={currentTheme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            aria-label="Toggle Theme"
          >
            {currentTheme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--border-subtle)] mt-3 pt-3 pb-2 space-y-2 text-xs font-semibold text-[var(--text-muted)] animate-slide-up">
          <button
            onClick={() => triggerModal('guide')}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-[var(--bg-card-hover)] flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-[var(--accent)]" />
            <span>Portal Guides & Requirements</span>
          </button>
          <button
            onClick={() => triggerModal('about')}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-[var(--bg-card-hover)] flex items-center gap-2"
          >
            <User className="w-4 h-4 text-[var(--accent)]" />
            <span>About Us & Creator</span>
          </button>
          <button
            onClick={() => triggerModal('contact')}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-[var(--bg-card-hover)] flex items-center gap-2"
          >
            <Mail className="w-4 h-4 text-[var(--accent)]" />
            <span>Contact Us</span>
          </button>
          <button
            onClick={() => triggerModal('privacy')}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-[var(--bg-card-hover)] flex items-center gap-2"
          >
            <Shield className="w-4 h-4 text-[var(--accent)]" />
            <span>Privacy Policy & Terms</span>
          </button>
        </div>
      )}
    </header>
  );
};
