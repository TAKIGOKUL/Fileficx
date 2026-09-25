import React from 'react';
import { MessageCircle, Instagram, Github, Linkedin, Send, Mail, Phone } from 'lucide-react';

export const SocialsVertical: React.FC = () => {
  return (
    <aside className="hero-socials-vertical hidden 2xl:flex fixed left-5 bottom-0 z-40 flex-col items-center gap-2.5 select-none">
      <a
        href="https://api.whatsapp.com/send?phone=918129725007&text="
        target="_blank"
        rel="noreferrer"
        className="social-link-v p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--bg-card)] hover:scale-115 transition-all duration-200 shadow-xs border border-transparent hover:border-[var(--border-subtle)]"
        aria-label="WhatsApp"
        title="WhatsApp"
      >
        <MessageCircle className="w-4 h-4" />
      </a>

      <a
        href="https://www.instagram.com/ad.astra.___/"
        target="_blank"
        rel="noreferrer"
        className="social-link-v p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--bg-card)] hover:scale-115 transition-all duration-200 shadow-xs border border-transparent hover:border-[var(--border-subtle)]"
        aria-label="Instagram"
        title="Instagram"
      >
        <Instagram className="w-4 h-4" />
      </a>

      <a
        href="https://github.com/TAKIGOKUL"
        target="_blank"
        rel="noreferrer"
        className="social-link-v p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--bg-card)] hover:scale-115 transition-all duration-200 shadow-xs border border-transparent hover:border-[var(--border-subtle)]"
        aria-label="GitHub"
        title="GitHub"
      >
        <Github className="w-4 h-4" />
      </a>

      <a
        href="https://www.linkedin.com/in/gokul-gk-b0b718261/"
        target="_blank"
        rel="noreferrer"
        className="social-link-v p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--bg-card)] hover:scale-115 transition-all duration-200 shadow-xs border border-transparent hover:border-[var(--border-subtle)]"
        aria-label="LinkedIn"
        title="LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
      </a>

      <a
        href="https://t.me/alchemist_taki"
        target="_blank"
        rel="noreferrer"
        className="social-link-v p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--bg-card)] hover:scale-115 transition-all duration-200 shadow-xs border border-transparent hover:border-[var(--border-subtle)]"
        aria-label="Telegram"
        title="Telegram"
      >
        <Send className="w-4 h-4" />
      </a>

      <a
        href="mailto:gokul23gopakumar@gmail.com"
        target="_blank"
        rel="noreferrer"
        className="social-link-v p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--bg-card)] hover:scale-115 transition-all duration-200 shadow-xs border border-transparent hover:border-[var(--border-subtle)]"
        aria-label="Email"
        title="Email"
      >
        <Mail className="w-4 h-4" />
      </a>

      <a
        href="tel:8129725007"
        target="_blank"
        rel="noreferrer"
        className="social-link-v p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--bg-card)] hover:scale-115 transition-all duration-200 shadow-xs border border-transparent hover:border-[var(--border-subtle)]"
        aria-label="Phone"
        title="Phone"
      >
        <Phone className="w-4 h-4" />
      </a>

      {/* Decorative vertical line */}
      <div className="social-line w-[1.5px] h-12 bg-[var(--border-subtle)] mt-1" />
    </aside>
  );
};
