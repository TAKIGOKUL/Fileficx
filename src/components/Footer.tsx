import React from 'react';
import { Github, Linkedin, Instagram, Send, ShieldCheck } from 'lucide-react';
import { GUIDES } from '../data/guides';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

const SOCIALS = [
  { href: 'https://t.me/alchemist_taki', label: 'Telegram', Icon: Send },
  { href: 'https://github.com/TAKIGOKUL', label: 'GitHub', Icon: Github },
  { href: 'https://www.linkedin.com/in/gokul-gk-b0b718261/', label: 'LinkedIn', Icon: Linkedin },
  { href: 'https://www.instagram.com/ad.astra.___/', label: 'Instagram', Icon: Instagram },
];

export const Footer: React.FC<FooterProps> = ({ onNavigate = () => {} }) => {
  const openConsentPreferences = () => window.dispatchEvent(new Event('open_cmp_preferences'));

  const handleNav = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
    <li>
      <a
        href={to === 'home' ? '/' : `/${to}`}
        onClick={(e) => {
          e.preventDefault();
          handleNav(to);
        }}
        className="text-[var(--text-secondary)] hover:text-[var(--accent-text)] transition-colors"
      >
        {children}
      </a>
    </li>
  );

  return (
    <footer className="relative w-full mt-28 border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 text-sm">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 space-y-4">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                handleNav('home');
              }}
              className="inline-flex items-center gap-2.5"
            >
              <span className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-[var(--border)] bg-[var(--logo-bg)] p-0.5">
                <img src="/logo.png" alt="" className="w-full h-full object-cover rounded-full" />
              </span>
              <span className="font-display text-xl font-extrabold tracking-tight text-[var(--text-primary)]">Fileficx</span>
            </a>
            <p className="text-[var(--text-secondary)] leading-relaxed max-w-xs">
              Free tools and guides to format photos, signatures and documents for exam, job and visa applications, privately in your browser.
            </p>
            <p className="inline-flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <ShieldCheck className="w-4 h-4 text-[var(--success)]" /> Files never leave your device
            </p>
          </div>

          {/* Product */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">Product</h3>
            <ul className="space-y-2.5">
              <NavLink to="home">Photo resizer</NavLink>
              <NavLink to="home">Signature resizer</NavLink>
              <NavLink to="home">PDF compressor</NavLink>
              <NavLink to="guides">All guides</NavLink>
            </ul>
          </div>

          {/* Guides */}
          <div className="col-span-2 md:col-span-3 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">Popular guides</h3>
            <ul className="space-y-2.5">
              {GUIDES.slice(0, 4).map((g) => (
                <NavLink key={g.slug} to={`guides/${g.slug}`}>
                  {g.title.split(':')[0].replace(/\s*\(.*\)$/, '')}
                </NavLink>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">Company</h3>
            <ul className="space-y-2.5">
              <NavLink to="about">About us</NavLink>
              <NavLink to="contact">Contact &amp; support</NavLink>
              <NavLink to="privacy">Privacy policy</NavLink>
              <NavLink to="terms">Terms &amp; conditions</NavLink>
              <li>
                <button onClick={openConsentPreferences} className="text-[var(--text-secondary)] hover:text-[var(--accent-text)] transition-colors cursor-pointer">
                  Cookie preferences
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Watermark */}
        <div aria-hidden="true" className="select-none pointer-events-none text-center mt-14 -mb-6">
          <span className="font-display block text-6xl sm:text-8xl lg:text-[11rem] font-extrabold tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-[var(--border)] to-transparent">
            FILEFICX
          </span>
        </div>

        <div className="relative border-t border-[var(--border-subtle)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <p>
            © {new Date().getFullYear()} Fileficx. Built by TAKIGOKUL. Specifications are for guidance; always confirm with the official notification.
          </p>
          <div className="flex items-center gap-1">
            {SOCIALS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                title={label}
                className="p-2 rounded-full hover:text-[var(--accent-text)] hover:bg-[var(--accent-subtle)] transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
