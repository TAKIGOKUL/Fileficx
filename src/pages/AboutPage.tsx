import React from 'react';
import { ArrowLeft, Mail, Github, Twitter, Users, TrendingUp, Globe, Coins, ShieldCheck } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12 animate-slide-up text-left">
      
      {/* Back Button & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-xs font-bold text-[var(--accent)] bg-[var(--accent-subtle)] hover:bg-[var(--accent)] hover:text-white px-4 py-2 rounded-full transition-all duration-200 cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
        <span className="text-xs text-[var(--text-muted)] font-medium">/ About Us</span>
      </div>

      {/* Header Section */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[var(--accent)] bg-[var(--accent-subtle)] px-3.5 py-1 rounded-full border border-[var(--accent)]/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>OUR MISSION & VALUES</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[var(--text-primary)] tracking-tight">
          About Fileficx
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-muted)] font-medium max-w-2xl leading-relaxed">
          Empowering applicants, job seekers, and creators worldwide with instant, zero-server document preparation. Where imagination meets utility.
        </p>
      </div>

      {/* Story & Creator Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xl space-y-4">
        <div className="flex items-center gap-3.5 border-b border-[var(--border-subtle)] pb-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--accent)] text-white flex items-center justify-center text-xl font-black shadow-lg shadow-[var(--accent)]/30">
            FF
          </div>
          <div>
            <h2 className="text-lg font-black text-[var(--text-primary)]">About the Creator & Vision</h2>
            <p className="text-xs text-[var(--accent)] font-bold">
              Building privacy-first utilities that eliminate portal rejection errors.
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed font-medium">
          <p>
            Hi! I'm an AI enthusiast and creative technologist passionate about making digital tools, document optimization, and creative utilities accessible to everyone. Fileficx was born from the idea that frustrating rejection errors (such as <i>"File size exceeded"</i>, <i>"Invalid W×H pixel dimensions"</i>, or <i>"DPI resolution mismatch"</i>) on government and corporate recruitment portals shouldn't gatekeep applicants.
          </p>
          <p>
            Unlike traditional file conversion sites that upload your sensitive biometrics, passport photos, and certificates to remote servers, Fileficx runs 100% locally inside your browser's RAM using WebAssembly and HTML5 Canvas. Your documents never touch any server.
          </p>
        </div>
      </div>

      {/* Numbers That Speak for Themselves Bento Grid */}
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[var(--accent)] bg-[var(--accent-subtle)] px-3 py-1 rounded-full border border-[var(--accent)]/20">
            <TrendingUp className="w-3 h-3" />
            <span>GROWTH & METRICS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-tight">
            Numbers That Speak for Themselves
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] font-medium">
            Looma is growing fast — trusted by users around the world to move and manage their money with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Stat 1 */}
          <div className="group relative p-6 sm:p-7 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent)] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="space-y-3 relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                75K+
              </div>
            </div>
            <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed pt-3 relative z-10">
              Active users managing their finances through Looma.
            </p>
          </div>

          {/* Stat 2 */}
          <div className="group relative p-6 sm:p-7 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent)] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="space-y-3 relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                $2.5B+
              </div>
            </div>
            <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed pt-3 relative z-10">
              Processed in global transactions every year.
            </p>
          </div>

          {/* Stat 3 */}
          <div className="group relative p-6 sm:p-7 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent)] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="space-y-3 relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <Globe className="w-5 h-5" />
              </div>
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                190+
              </div>
            </div>
            <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed pt-3 relative z-10">
              Supported countries for sending and receiving payments.
            </p>
          </div>

          {/* Stat 4 */}
          <div className="group relative p-6 sm:p-7 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent)] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="space-y-3 relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <Coins className="w-5 h-5" />
              </div>
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                40+
              </div>
            </div>
            <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed pt-3 relative z-10">
              Currencies available for multi-wallet accounts.
            </p>
          </div>
        </div>
      </div>

      {/* Connect Cards */}
      <div className="space-y-4 pt-4 border-t border-[var(--border-subtle)]">
        <h3 className="text-lg font-black text-[var(--text-primary)]">Connect with the Creator</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate('contact')}
            className="p-5 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent)] shadow-sm flex items-center gap-3.5 transition-all cursor-pointer hover:scale-[1.02] text-left"
          >
            <div className="w-10 h-10 rounded-2xl bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-[var(--text-primary)]">Contact Us</div>
              <div className="text-xs text-[var(--text-muted)]">gokulgkblueheart@gmail.com</div>
            </div>
          </button>

          <a
            href="https://github.com/TAKIGOKUL/Fileficx.git"
            target="_blank"
            rel="noreferrer"
            className="p-5 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent)] shadow-sm flex items-center gap-3.5 transition-all hover:scale-[1.02]"
          >
            <div className="w-10 h-10 rounded-2xl bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center shrink-0">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-[var(--text-primary)]">GitHub</div>
              <div className="text-xs text-[var(--text-muted)]">TAKIGOKUL / Fileficx</div>
            </div>
          </a>

          <a
            href="https://x.com"
            target="_blank"
            rel="noreferrer"
            className="p-5 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent)] shadow-sm flex items-center gap-3.5 transition-all hover:scale-[1.02]"
          >
            <div className="w-10 h-10 rounded-2xl bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center shrink-0">
              <Twitter className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-[var(--text-primary)]">Twitter / X</div>
              <div className="text-xs text-[var(--text-muted)]">Community Updates</div>
            </div>
          </a>
        </div>
      </div>

    </div>
  );
};
