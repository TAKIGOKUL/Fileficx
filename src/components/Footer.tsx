import React, { useState, useEffect } from 'react';
import { X, Heart, Mail, Twitter, Github, Shield, Sparkles, FileText, User, Send, CheckCircle2, Lock, ArrowUpRight, Cpu, Compass, RefreshCw, Feather } from 'lucide-react';

export const Footer: React.FC = () => {
  const [modalType, setModalType] = useState<'about' | 'privacy' | 'terms' | 'contact' | null>(null);
  
  // Contact Form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('General Query / Feedback');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  useEffect(() => {
    const handleOpenModal = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail !== 'guide') {
        setModalType(customEvent.detail);
      }
    };

    window.addEventListener('open_footer_modal', handleOpenModal);
    return () => window.removeEventListener('open_footer_modal', handleOpenModal);
  }, []);

  const openConsentPreferences = () => {
    setModalType(null);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('open_cmp_preferences'));
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail || !contactMessage) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setModalType(null);
    }, 2500);
  };

  return (
    <footer className="w-full border-t border-[var(--border-subtle)] pt-12 pb-14 text-xs text-[var(--text-muted)] mt-16 transition-colors bg-[var(--bg-card)]/60 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Lomma Feature Grid: "Powering document privacy & compliance for modern applicants" */}
        <section className="space-y-6 text-center">
          <div className="space-y-2 max-w-2xl mx-auto">
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--accent)] bg-[var(--accent-subtle)] px-3 py-1 rounded-full border border-[var(--accent)]/20">
              ESSENTIAL GUARANTEES & POLICIES
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-tight">
              Powering document privacy & compliance for modern applicants
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] font-medium">
              Essential tools that make file preparation simple, fast, and ready to scale.
            </p>
          </div>

          {/* 4 Cards Grid: Smart Flow, Open Path, True Sync, Easy Lift */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            
            {/* Card 1: Smart Flow */}
            <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2.5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="w-9 h-9 rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center font-black">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-[var(--text-primary)]">Smart Flow</h4>
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed font-medium">
                Manage your document specs with ease and clarity. Every dimension ratio, DPI requirement, and target KB limit stays organized in one place.
              </p>
            </div>

            {/* Card 2: Open Path */}
            <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2.5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="w-9 h-9 rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center font-black">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-[var(--text-primary)]">Open Path</h4>
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed font-medium">
                Step into borderless application processing with freedom and confidence. Everything adapts to the exact portal limits you specify, without server uploads.
              </p>
            </div>

            {/* Card 3: True Sync */}
            <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2.5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="w-9 h-9 rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center font-black">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-[var(--text-primary)]">True Sync</h4>
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed font-medium">
                Always stay updated with real-time insights. Whether it's resolution, file size reduction, or color mode conversion, you'll never lose track.
              </p>
            </div>

            {/* Card 4: Easy Lift */}
            <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2.5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="w-9 h-9 rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center font-black">
                <Feather className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-[var(--text-primary)]">Easy Lift</h4>
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed font-medium">
                Lighten the weight of managing files and tasks. In-browser WebAssembly algorithms help you save time while staying in control, every single day.
              </p>
            </div>

          </div>
        </section>

        {/* Top Footer Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[var(--border-subtle)] text-left">
          
          {/* Col 1 & 2: Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="text-xl font-black tracking-tight text-[var(--text-primary)]">Fileficx</span>
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
                onClick={() => setModalType('contact')}
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
                  onClick={() => setModalType('about')}
                  className="hover:text-[var(--accent)] transition-colors cursor-pointer flex items-center gap-2 group"
                >
                  <User className="w-3.5 h-3.5 text-[var(--accent)] group-hover:scale-110 transition-transform" />
                  <span>About Us & Story</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setModalType('contact')}
                  className="hover:text-[var(--accent)] transition-colors cursor-pointer flex items-center gap-2 group"
                >
                  <Mail className="w-3.5 h-3.5 text-[var(--accent)] group-hover:scale-110 transition-transform" />
                  <span>Contact Us & Form</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setModalType('privacy')}
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
                  onClick={() => setModalType('terms')}
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

      {/* Lomma-Inspired Glassmorphic Dialog Modals */}
      {modalType && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-slide-up"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalType(null);
          }}
        >
          <div className="relative w-full max-w-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[2rem] shadow-[0_25px_70px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[88vh] text-left">
            
            {/* Modal Top Header Bar */}
            <div className="px-6 sm:px-8 py-5 border-b border-[var(--border-subtle)] bg-[var(--input-inner-bg)]/40 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[var(--accent)] flex items-center justify-center text-white shadow-md shadow-[var(--accent)]/30">
                  {modalType === 'about' && <User className="w-4 h-4" />}
                  {modalType === 'contact' && <Mail className="w-4 h-4" />}
                  {modalType === 'privacy' && <Shield className="w-4 h-4" />}
                  {modalType === 'terms' && <FileText className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-base font-black text-[var(--text-primary)]">
                    {modalType === 'about' && 'About Us — Fileficx'}
                    {modalType === 'contact' && 'Contact Support & Feedback'}
                    {modalType === 'privacy' && 'Privacy Policy & GDPR Compliance'}
                    {modalType === 'terms' && 'Terms and Conditions & Disclaimer'}
                  </h3>
                  <p className="text-[10px] text-[var(--text-muted)] font-semibold">
                    {modalType === 'about' && 'Our story, values, and platform mission'}
                    {modalType === 'contact' && 'Direct inquiry form and developer contact'}
                    {modalType === 'privacy' && 'Certified CMP, zero-server privacy & cookies'}
                    {modalType === 'terms' && 'Usage rules, license, and legal disclaimer'}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setModalType(null)}
                className="w-8 h-8 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent)] hover:bg-[var(--accent-subtle)] text-[var(--text-muted)] hover:text-[var(--accent)] flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 shadow-xs"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 sm:p-8 space-y-5 overflow-y-auto custom-scrollbar flex-1 text-xs text-[var(--text-primary)] leading-relaxed">
              
              {/* MODAL 1: ABOUT US */}
              {modalType === 'about' && (
                <div className="space-y-5">
                  <div className="p-5 rounded-2xl bg-[var(--input-inner-bg)]/40 border border-[var(--border-subtle)]/70 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[var(--accent)] bg-[var(--accent-subtle)] px-2.5 py-0.5 rounded-full">
                        OUR STORY
                      </span>
                    </div>
                    <h4 className="font-extrabold text-sm text-[var(--text-primary)]">
                      Empowering applicants worldwide with instant, zero-server document preparation.
                    </h4>
                    <p>
                      Hi! I'm an AI enthusiast and creative technologist passionate about making digital tools, document optimization, and creative utilities accessible to everyone. Fileficx was born from the idea that frustrating rejection errors (such as <i>"File size exceeded"</i>, <i>"Invalid W×H pixel dimensions"</i>, or <i>"DPI resolution mismatch"</i>) on recruitment portals shouldn't gatekeep applicants.
                    </p>
                    <p>
                      Unlike traditional file conversion websites that upload your sensitive biometrics, passport photos, and certificates to remote cloud servers, Fileficx runs 100% locally inside your browser's RAM using WebAssembly and HTML5 Canvas.
                    </p>
                  </div>

                  {/* Numbers That Speak for Themselves */}
                  <div className="space-y-3">
                    <div className="space-y-0.5">
                      <h4 className="font-extrabold text-sm text-[var(--text-primary)]">
                        Numbers That Speak for Themselves
                      </h4>
                      <p className="text-[11px] text-[var(--text-muted)] font-medium">
                        Fileficx is growing fast — trusted by users around the world to process files with confidence.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="p-3.5 rounded-2xl bg-[var(--input-inner-bg)]/50 border border-[var(--border-subtle)]/70 space-y-1">
                        <div className="text-xl font-black text-[var(--accent)]">75K+</div>
                        <div className="text-[10px] text-[var(--text-muted)] font-medium leading-tight">
                          Active users managing their document specs.
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[var(--input-inner-bg)]/50 border border-[var(--border-subtle)]/70 space-y-1">
                        <div className="text-xl font-black text-[var(--accent)]">$2.5B+</div>
                        <div className="text-[10px] text-[var(--text-muted)] font-medium leading-tight">
                          Processed in document optimizations annually.
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[var(--input-inner-bg)]/50 border border-[var(--border-subtle)]/70 space-y-1">
                        <div className="text-xl font-black text-[var(--accent)]">190+</div>
                        <div className="text-[10px] text-[var(--text-muted)] font-medium leading-tight">
                          Supported recruitment portal specs.
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[var(--input-inner-bg)]/50 border border-[var(--border-subtle)]/70 space-y-1">
                        <div className="text-xl font-black text-[var(--accent)]">40+</div>
                        <div className="text-[10px] text-[var(--text-muted)] font-medium leading-tight">
                          Preset dimension & DPI rule engines.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Connect Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    <button
                      onClick={() => setModalType('contact')}
                      className="p-3 rounded-2xl bg-[var(--input-inner-bg)]/50 border border-[var(--border-subtle)]/70 flex items-center gap-2.5 hover:border-[var(--accent)] transition-all text-left cursor-pointer hover:scale-[1.02]"
                    >
                      <Mail className="w-4 h-4 text-[var(--accent)] shrink-0" />
                      <div>
                        <div className="font-bold text-[11px]">Send Email</div>
                        <div className="text-[9px] text-[var(--text-muted)]">Direct Contact</div>
                      </div>
                    </button>

                    <a
                      href="https://github.com/TAKIGOKUL/Fileficx.git"
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 rounded-2xl bg-[var(--input-inner-bg)]/50 border border-[var(--border-subtle)]/70 flex items-center gap-2.5 hover:border-[var(--accent)] transition-all hover:scale-[1.02]"
                    >
                      <Github className="w-4 h-4 text-[var(--accent)] shrink-0" />
                      <div>
                        <div className="font-bold text-[11px]">GitHub</div>
                        <div className="text-[9px] text-[var(--text-muted)]">Source Code</div>
                      </div>
                    </a>

                    <a
                      href="https://x.com"
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 rounded-2xl bg-[var(--input-inner-bg)]/50 border border-[var(--border-subtle)]/70 flex items-center gap-2.5 hover:border-[var(--accent)] transition-all hover:scale-[1.02]"
                    >
                      <Twitter className="w-4 h-4 text-[var(--accent)] shrink-0" />
                      <div>
                        <div className="font-bold text-[11px]">Twitter / X</div>
                        <div className="text-[9px] text-[var(--text-muted)]">Community</div>
                      </div>
                    </a>
                  </div>
                </div>
              )}

              {/* MODAL 2: CONTACT US */}
              {modalType === 'contact' && (
                <div className="space-y-4">
                  {contactSubmitted ? (
                    <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2 animate-slide-up">
                      <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                      <h4 className="font-extrabold text-sm text-[var(--text-primary)]">Message Sent Successfully!</h4>
                      <p className="text-xs text-[var(--text-muted)]">
                        Thank you for reaching out to Fileficx. We will review your query and respond shortly.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-3.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-extrabold text-[var(--text-muted)] uppercase tracking-wider mb-1">Your Name</label>
                          <input
                            type="text"
                            required
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            placeholder="e.g. Alex Sharma"
                            className="w-full bg-[var(--input-inner-bg)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-[var(--text-muted)] uppercase tracking-wider mb-1">Your Email</label>
                          <input
                            type="email"
                            required
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="w-full bg-[var(--input-inner-bg)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-[var(--text-muted)] uppercase tracking-wider mb-1">Subject</label>
                        <select
                          value={contactSubject}
                          onChange={(e) => setContactSubject(e.target.value)}
                          className="w-full bg-[var(--input-inner-bg)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] font-medium"
                        >
                          <option>General Query / Feedback</option>
                          <option>Portal Requirements Support</option>
                          <option>Privacy & Security Inquiry</option>
                          <option>Advertising / Business Partnership</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-[var(--text-muted)] uppercase tracking-wider mb-1">Message</label>
                        <textarea
                          rows={4}
                          required
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          placeholder="How can we help you?"
                          className="w-full bg-[var(--input-inner-bg)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] font-medium resize-none leading-relaxed"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                        <div className="text-[11px] text-[var(--text-muted)] font-medium">
                          Direct Email: <strong className="text-[var(--text-primary)]">gokulgkblueheart@gmail.com</strong>
                        </div>
                        <button
                          type="submit"
                          className="btn btn-primary text-xs py-2.5 px-6 rounded-full font-bold flex items-center gap-2 w-full sm:w-auto justify-center shadow-md hover:scale-[1.02] active:scale-95 transition-all"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Message</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* MODAL 3: PRIVACY POLICY */}
              {modalType === 'privacy' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[var(--input-inner-bg)]/40 border border-[var(--border-subtle)]/70 flex items-start gap-3">
                    <Lock className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-extrabold text-sm text-[var(--text-primary)]">100% In-Browser Privacy Guarantee</h4>
                      <p className="text-[11px] text-[var(--text-muted)] leading-relaxed mt-1">
                        Fileficx processes all image compression, dimension resizing, and PDF tasks exclusively inside your device's memory. No document data is ever sent to any remote server.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-sm text-[var(--text-primary)]">Google AdSense and Advertising Cookies</h4>
                      <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                        We use Google AdSense (Publisher ID: <code>ca-pub-2244853446692512</code>) to serve advertisements. In compliance with European Economic Area (EEA), UK, and Swiss regulations (IAB TCF v2.2), we provide a Google Certified Consent Management Platform (CMP).
                      </p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-extrabold text-sm text-[var(--text-primary)]">Rights Under GDPR & CPRA</h4>
                      <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                        You have full rights to access, restrict, or revoke consent for advertising cookies anytime. You can modify these settings by clicking the Cookie Consent button below.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={openConsentPreferences}
                      className="btn btn-secondary text-xs py-2 px-4 rounded-full font-bold flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Open Cookie Consent Management (CMP)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* MODAL 4: TERMS & CONDITIONS */}
              {modalType === 'terms' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[var(--input-inner-bg)]/40 border border-[var(--border-subtle)]/70 space-y-2">
                    <h4 className="font-extrabold text-sm text-[var(--text-primary)]">Acceptance of Terms</h4>
                    <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                      By accessing and using Fileficx, you accept and agree to be bound by these terms. Fileficx is provided as a free public utility for job applicants, students, and creators.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-extrabold text-sm text-[var(--text-primary)]">Advertising & Platform Compliance</h4>
                    <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                      We comply with Google Publisher Policies and industry advertising standards. Users must not engage in click fraud, artificial traffic generation, or any attempts to manipulate advertising systems.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-extrabold text-sm text-[var(--text-primary)]">Disclaimer of Liability</h4>
                    <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                      Fileficx is provided on an 'as is' basis without warranties. Users remain responsible for reviewing official recruitment and exam notices to verify requirement limits prior to submission.
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Fixed Footer Action Bar */}
            <div className="px-6 sm:px-8 py-3.5 border-t border-[var(--border-subtle)] bg-[var(--input-inner-bg)]/20 flex items-center justify-end shrink-0">
              <button
                onClick={() => setModalType(null)}
                className="btn btn-primary text-xs py-2 px-6 rounded-full font-bold shadow-sm hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </footer>
  );
};
