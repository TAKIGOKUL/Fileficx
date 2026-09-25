import React, { useState } from 'react';
import { Sun, Moon, Zap, RotateCcw, Menu, X, User, Mail, Shield } from 'lucide-react';

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
    <header className="sticky top-3 z-50 w-full px-4 sm:px-6 transition-all duration-300">
      <div className="max-w-5xl mx-auto rounded-full bg-[var(--bg-card)]/85 backdrop-blur-xl border border-[var(--border-subtle)] shadow-xl px-5 sm:px-7 py-2.5 flex items-center justify-between gap-4 transition-all duration-300">
        
        {/* Brand Logo */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer group" 
          onClick={onTryAnother}
        >
          <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white shadow-md shadow-[var(--accent)]/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <span className="text-xl font-black tracking-tight text-[var(--text-primary)]">
            Fileficx
          </span>
        </div>

        {/* Center Lomma-Style Capsule Navigation Pill Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-[var(--input-inner-bg)]/50 border border-[var(--border-subtle)] p-1 rounded-full text-xs font-bold text-[var(--text-muted)]">
          <button
            onClick={() => triggerModal('about')}
            className="px-4 py-1.5 rounded-full hover:bg-[var(--bg-card)] hover:text-[var(--accent)] hover:shadow-xs transition-all duration-200 cursor-pointer flex items-center gap-1.5"
          >
            <User className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>About Us</span>
          </button>
          <button
            onClick={() => triggerModal('privacy')}
            className="px-4 py-1.5 rounded-full hover:bg-[var(--bg-card)] hover:text-[var(--accent)] hover:shadow-xs transition-all duration-200 cursor-pointer flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Privacy & Terms</span>
          </button>
          <button
            onClick={() => triggerModal('contact')}
            className="px-4 py-1.5 rounded-full hover:bg-[var(--bg-card)] hover:text-[var(--accent)] hover:shadow-xs transition-all duration-200 cursor-pointer flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Contact Us</span>
          </button>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5">
          {/* Try Another File button - shown when a file is loaded */}
          {hasFile && onTryAnother && (
            <button
              onClick={onTryAnother}
              className="btn btn-primary text-xs py-1.5 px-4 rounded-full flex items-center gap-2 cursor-pointer shadow-md hover:scale-[1.03] active:scale-95 transition-all duration-200 font-bold"
              title="Return to upload view to select another file"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Try Another File</span>
            </button>
          )}

          {/* Single-click Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--input-inner-bg)] transition-all duration-200 cursor-pointer"
            title={currentTheme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            aria-label="Toggle Theme"
          >
            {currentTheme === 'light' ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden max-w-5xl mx-auto mt-2 p-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xl space-y-1 text-xs font-bold text-[var(--text-muted)] animate-slide-up">
          <button
            onClick={() => triggerModal('about')}
            className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-[var(--input-inner-bg)] flex items-center gap-2.5 transition-colors"
          >
            <User className="w-4 h-4 text-[var(--accent)]" />
            <span>About Us & Story</span>
          </button>
          <button
            onClick={() => triggerModal('privacy')}
            className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-[var(--input-inner-bg)] flex items-center gap-2.5 transition-colors"
          >
            <Shield className="w-4 h-4 text-[var(--accent)]" />
            <span>Privacy Policy & Terms</span>
          </button>
          <button
            onClick={() => triggerModal('contact')}
            className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-[var(--input-inner-bg)] flex items-center gap-2.5 transition-colors"
          >
            <Mail className="w-4 h-4 text-[var(--accent)]" />
            <span>Contact Us</span>
          </button>
        </div>
      )}
    </header>
  );
};
