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
                Manage your money and document specs with ease and clarity. Every transaction, balance, pixel ratio, and target KB limit stays organized in one place—so you can focus on what matters most.
              </p>
            </div>

            {/* Card 2: Open Path */}
            <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2.5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="w-9 h-9 rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center font-black">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-[var(--text-primary)]">Open Path</h4>
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed font-medium">
                Step into borderless application processing with freedom and confidence. From payments to reports, everything adapts to the way you work, without limitations or server uploads.
              </p>
            </div>

            {/* Card 3: True Sync */}
            <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2.5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="w-9 h-9 rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center font-black">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-[var(--text-primary)]">True Sync</h4>
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed font-medium">
                Always stay updated with real-time insights. Whether it's dimensions, file size reduction, or upcoming payouts, you'll never lose track of your financial and document picture.
              </p>
            </div>

            {/* Card 4: Easy Lift */}
            <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2.5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="w-9 h-9 rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center font-black">
                <Feather className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-[var(--text-primary)]">Easy Lift</h4>
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed font-medium">
                Lighten the weight of managing files and tasks. Automations, smart tracking, and simple WebAssembly tools help you save time while staying in control, every single day.
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
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] hover:border-[var(--accent)] text-[var(--text-primary)] font-semibold transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
              >
                <Mail className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>Contact Support</span>
              </button>

              <a
                href="https://github.com/TAKIGOKUL/Fileficx.git"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] hover:border-[var(--accent)] text-[var(--text-primary)] font-semibold transition-all hover:scale-[1.02] active:scale-95"
              >
                <Github className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>GitHub</span>
                <ArrowUpRight className="w-3 h-3 opacity-50" />
              </a>

              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] hover:border-[var(--accent)] text-[var(--text-primary)] font-semibold transition-all hover:scale-[1.02] active:scale-95"
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

      {/* Modern High-Trust Modals */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-4 animate-slide-up">
          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl text-left">
            
            {/* Close Button */}
            <button
              onClick={() => setModalType(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-[var(--text-primary)] p-2 rounded-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal 1: About Us & Creator Story */}
            {modalType === 'about' && (
              <div className="space-y-5 text-xs text-[var(--text-primary)]">
                <div className="flex items-center gap-3.5 border-b border-[var(--border-subtle)] pb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--accent)] text-white flex items-center justify-center text-xl font-black shadow-lg shadow-[var(--accent)]/30">
                    FF
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[var(--text-primary)]">About Us — Fileficx</h3>
                    <p className="text-xs text-[var(--accent)] font-bold">
                      Empowering applicants and creators worldwide with instant, zero-server visual & document optimization.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-3 leading-relaxed">
                  <h4 className="font-extrabold text-sm text-[var(--text-primary)]">Our Mission & Creator Story</h4>
                  <p>
                    Hi! I'm an AI enthusiast and creative technologist passionate about making digital tools, document optimization, and creative utilities accessible to everyone. Fileficx was born from the idea that frustrating rejection errors (such as <i>"File size exceeded"</i>, <i>"Invalid W×H pixel dimensions"</i>, or <i>"DPI resolution mismatch"</i>) on government and corporate recruitment portals shouldn't gatekeep applicants.
                  </p>
                  <p>
                    Unlike traditional file conversion sites that upload your sensitive biometrics, passport photos, and certificates to remote servers, Fileficx runs 100% locally inside your browser's RAM using WebAssembly and HTML5 Canvas. Your documents never touch any server.
                  </p>
                </div>

                {/* Lomma Stats Section: Numbers That Speak for Themselves */}
                <div className="space-y-3 pt-1">
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-sm text-[var(--text-primary)]">
                      Numbers That Speak for Themselves
                    </h4>
                    <p className="text-xs text-[var(--text-muted)] font-medium">
                      Fileficx is growing fast — trusted by users around the world to move and manage their files with confidence.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-left">
                    <div className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
                      <div className="text-xl font-black text-[var(--accent)]">75K+</div>
                      <div className="text-[10px] text-[var(--text-muted)] font-medium leading-snug">
                        Active users managing their document specs through Fileficx.
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
                      <div className="text-xl font-black text-[var(--accent)]">$2.5B+</div>
                      <div className="text-[10px] text-[var(--text-muted)] font-medium leading-snug">
                        Processed in global document optimizations every year.
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
                      <div className="text-xl font-black text-[var(--accent)]">190+</div>
                      <div className="text-[10px] text-[var(--text-muted)] font-medium leading-snug">
                        Supported portal specs for uploading and formatting files.
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
                      <div className="text-xl font-black text-[var(--accent)]">40+</div>
                      <div className="text-[10px] text-[var(--text-muted)] font-medium leading-snug">
                        Preset dimension & DPI rules for multi-portal engines.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <button
                    onClick={() => setModalType('contact')}
                    className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center gap-3 hover:border-[var(--accent)] transition-all text-left cursor-pointer hover:scale-[1.02]"
                  >
                    <Mail className="w-4 h-4 text-[var(--accent)] shrink-0" />
                    <div>
                      <div className="font-bold text-[11px]">Contact Support</div>
                      <div className="text-[9px] text-[var(--text-muted)] font-medium">Direct Feedback</div>
                    </div>
                  </button>

                  <a
                    href="https://github.com/TAKIGOKUL/Fileficx.git"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center gap-3 hover:border-[var(--accent)] transition-all hover:scale-[1.02]"
                  >
                    <Github className="w-4 h-4 text-[var(--accent)] shrink-0" />
                    <div>
                      <div className="font-bold text-[11px]">GitHub</div>
                      <div className="text-[9px] text-[var(--text-muted)] font-medium">Source Code</div>
                    </div>
                  </a>

                  <a
                    href="https://x.com"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center gap-3 hover:border-[var(--accent)] transition-all hover:scale-[1.02]"
                  >
                    <Twitter className="w-4 h-4 text-[var(--accent)] shrink-0" />
                    <div>
                      <div className="font-bold text-[11px]">Twitter / X</div>
                      <div className="text-[9px] text-[var(--text-muted)] font-medium">Community</div>
                    </div>
                  </a>
                </div>
              </div>
            )}

            {/* Modal 2: Interactive Contact Us Form */}
            {modalType === 'contact' && (
              <div className="space-y-5 text-xs text-[var(--text-primary)]">
                <div className="border-b border-[var(--border-subtle)] pb-3">
                  <h3 className="text-lg font-black text-[var(--accent)]">Contact Us & Support</h3>
                  <p className="text-[11px] text-[var(--text-muted)] font-medium">
                    Have questions, portal feedback, or inquiries? Send a direct message below.
                  </p>
                </div>

                {contactSubmitted ? (
                  <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2 animate-slide-up">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                    <h4 className="font-extrabold text-sm text-[var(--text-primary)]">Message Sent Successfully!</h4>
                    <p className="text-xs text-[var(--text-muted)]">
                      Thank you for contacting Fileficx. We will review your query and respond shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                        className="btn btn-primary text-xs py-2.5 px-6 rounded-xl font-bold flex items-center gap-2 w-full sm:w-auto justify-center"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Message</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Modal 3: Full Privacy Policy */}
            {modalType === 'privacy' && (
              <div className="space-y-4 text-xs text-[var(--text-primary)] leading-relaxed">
                <div className="border-b border-[var(--border-subtle)] pb-3">
                  <h3 className="text-lg font-black text-[var(--accent)]">Privacy Policy</h3>
                  <div className="text-[10px] text-[var(--text-muted)] font-medium">Last updated: 25/09/2026</div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-extrabold text-sm">Information We Collect</h4>
                  <p>
                    We collect information you provide directly to us, such as when you set preferences or interact with our services. This may include your email address, preferences, and any content you choose to share. <strong>Note: Your uploaded documents, photos, and signatures are processed exclusively in your browser's local RAM and are NEVER uploaded to any server.</strong>
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-extrabold text-sm">How We Use Your Information</h4>
                  <ul className="list-disc pl-5 space-y-1 font-medium">
                    <li>To provide, maintain, and improve our client-side processing services</li>
                    <li>To personalize your experience on our platform</li>
                    <li>To communicate with you about our services</li>
                    <li>To ensure the security and integrity of our platform</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-extrabold text-sm">Google AdSense and Third-Party Advertising</h4>
                  <p>
                    We use Google AdSense (Publisher ID: <code>ca-pub-2244853446692512</code>) to display advertisements on our website. Google AdSense and other third-party advertising partners may place cookies on your browser, use web beacons, or collect your IP address to serve personalized advertisements based on your interests and browsing behavior.
                  </p>
                  <p>
                    These third parties may be placing and reading cookies on your users' browsers, or using web beacons or IP addresses to collect information in the process of ad serving on our website. For more information, please visit <a href="https://www.google.com/policies/privacy/partners/" target="_blank" rel="noreferrer" className="text-[var(--accent)] underline font-bold">How Google uses data when you use our partners' sites or apps</a>. You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer" className="text-[var(--accent)] underline font-bold">Google Ads Settings</a>.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-extrabold text-sm">Cookies and Tracking</h4>
                  <p>
                    We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-extrabold text-sm">EU User Consent and GDPR (EEA, UK & Swiss TCF v2.2)</h4>
                  <p>
                    For users in the European Union, European Economic Area (EEA), UK, and Switzerland, we comply with the General Data Protection Regulation (GDPR) and obtain appropriate consent for data processing and personalized advertising using a Google Certified Consent Management Platform (CMP). You have the right to access, update, or delete your personal information, and to withdraw consent for data processing at any time.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={openConsentPreferences}
                    className="btn btn-secondary text-xs py-2 px-4 rounded-xl font-bold"
                  >
                    Open Cookie Consent Management (CMP)
                  </button>
                </div>
              </div>
            )}

            {/* Modal 4: Full Terms & Conditions */}
            {modalType === 'terms' && (
              <div className="space-y-4 text-xs text-[var(--text-primary)] leading-relaxed">
                <div className="border-b border-[var(--border-subtle)] pb-3">
                  <h3 className="text-lg font-black text-[var(--accent)]">Terms and Conditions & Disclaimer</h3>
                  <div className="text-[10px] text-[var(--text-muted)] font-medium">Last updated: 25/09/2026</div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-extrabold text-sm">Acceptance of Terms</h4>
                  <p>
                    By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-extrabold text-sm">Use License</h4>
                  <p>
                    Permission is granted to temporarily use the materials on Fileficx's website for personal, non-commercial transitory viewing and processing only. Under this license you may not:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 font-medium">
                    <li>Modify or copy core engine codebase materials for commercial resale</li>
                    <li>Attempt to reverse engineer any WebAssembly binary contained on the website</li>
                    <li>Remove any copyright or proprietary notations</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-extrabold text-sm">Advertising and Google AdSense Compliance</h4>
                  <p>
                    Our service displays advertisements through Google AdSense (Publisher ID: <code>ca-pub-2244853446692512</code>) and other advertising partners. By using our service, you acknowledge and agree that:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 font-medium">
                    <li>Third parties may place cookies and collect information for advertising purposes</li>
                    <li>Advertisements are provided by third parties and do not reflect our endorsement</li>
                    <li>We comply with Google Publisher Policies and industry advertising standards</li>
                    <li>Users must not engage in click fraud, artificial traffic generation, or any attempts to manipulate advertising systems</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-extrabold text-sm">User Responsibilities and Disclaimer</h4>
                  <p>
                    The materials on Fileficx's website are provided on an 'as is' basis. Fileficx makes no warranties, expressed or implied, and hereby disclaims all other warranties. Users remain responsible for reviewing official notifications (e.g. SSC, UPSC, IBPS, NTA) to verify latest requirement rules before submitting files.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] text-right">
              <button
                onClick={() => setModalType(null)}
                className="btn btn-primary text-xs py-2 px-5 rounded-xl font-bold"
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
