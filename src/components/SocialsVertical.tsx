import React from 'react';
import { Instagram, Github, Linkedin, Send } from 'lucide-react';

export const SocialsVertical: React.FC = () => {
  return (
    <aside className="hero-socials-vertical hidden 2xl:flex fixed left-5 bottom-0 z-40 flex-col items-center gap-3 select-none">
      <a
        href="https://t.me/alchemist_taki"
        target="_blank"
        rel="noreferrer"
        className="social-link-v p-2.5 rounded-full text-[var(--text-muted)] hover:text-white hover:bg-[var(--accent)] hover:shadow-lg hover:shadow-[var(--accent)]/30 hover:scale-110 transition-all duration-200 border border-[var(--border-subtle)] hover:border-[var(--accent)] bg-[var(--bg-card)]/80 backdrop-blur-md"
        aria-label="Telegram"
        title="Telegram"
      >
        <Send className="w-3.5 h-3.5" />
      </a>

      <a
        href="https://github.com/TAKIGOKUL"
        target="_blank"
        rel="noreferrer"
        className="social-link-v p-2.5 rounded-full text-[var(--text-muted)] hover:text-white hover:bg-[var(--accent)] hover:shadow-lg hover:shadow-[var(--accent)]/30 hover:scale-110 transition-all duration-200 border border-[var(--border-subtle)] hover:border-[var(--accent)] bg-[var(--bg-card)]/80 backdrop-blur-md"
        aria-label="GitHub"
        title="GitHub"
      >
        <Github className="w-3.5 h-3.5" />
      </a>

      <a
        href="https://www.linkedin.com/in/gokul-gk-b0b718261/"
        target="_blank"
        rel="noreferrer"
        className="social-link-v p-2.5 rounded-full text-[var(--text-muted)] hover:text-white hover:bg-[var(--accent)] hover:shadow-lg hover:shadow-[var(--accent)]/30 hover:scale-110 transition-all duration-200 border border-[var(--border-subtle)] hover:border-[var(--accent)] bg-[var(--bg-card)]/80 backdrop-blur-md"
        aria-label="LinkedIn"
        title="LinkedIn"
      >
        <Linkedin className="w-3.5 h-3.5" />
      </a>

      <a
        href="https://www.instagram.com/ad.astra.___/"
        target="_blank"
        rel="noreferrer"
        className="social-link-v p-2.5 rounded-full text-[var(--text-muted)] hover:text-white hover:bg-[var(--accent)] hover:shadow-lg hover:shadow-[var(--accent)]/30 hover:scale-110 transition-all duration-200 border border-[var(--border-subtle)] hover:border-[var(--accent)] bg-[var(--bg-card)]/80 backdrop-blur-md"
        aria-label="Instagram"
        title="Instagram"
      >
        <Instagram className="w-3.5 h-3.5" />
      </a>

      {/* Decorative vertical gradient line */}
      <div className="social-line w-[1.5px] h-14 bg-gradient-to-b from-[var(--accent)]/50 via-[var(--border-subtle)] to-transparent mt-1" />
    </aside>
  );
};
