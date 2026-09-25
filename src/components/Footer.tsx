import React, { useState, useEffect } from 'react';
import { X, Heart, Mail, Twitter, Github, Shield, Sparkles, FileText, User, Send, CheckCircle2, BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  const [modalType, setModalType] = useState<'about' | 'privacy' | 'terms' | 'guide' | 'contact' | null>(null);
  
  // Contact Form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('General Query / Feedback');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  useEffect(() => {
    const handleOpenModal = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
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
    <footer className="w-full border-t border-[var(--border-subtle)] pt-8 pb-10 text-xs text-[var(--text-muted)] mt-12 transition-colors bg-[var(--bg-card)]/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-6 border-b border-[var(--border-subtle)] text-left">
          
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-[var(--text-primary)]">Fileficx</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)]">
                Zero-Server Privacy
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-md">
              Empowering applicants, job seekers, and creators worldwide with instant in-browser document & photo preparation. Where imagination meets utility.
            </p>
            <div className="flex items-center gap-3 pt-1 text-[11px] text-[var(--text-primary)]">
              <button
                onClick={() => setModalType('contact')}
                className="flex items-center gap-1 hover:text-[var(--accent)] transition-colors font-medium cursor-pointer"
                title="Send Email or Message"
              >
                <Mail className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>Contact Us</span>
              </button>
              <span className="opacity-40">•</span>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-[var(--accent)] transition-colors font-medium"
                title="Twitter / X"
              >
                <Twitter className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>Twitter</span>
              </a>
              <span className="opacity-40">•</span>
              <a
                href="https://github.com/TAKIGOKUL/Fileficx.git"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-[var(--accent)] transition-colors font-medium"
                title="GitHub Repository"
              >
                <Github className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>GitHub</span>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-[10px] text-[var(--text-primary)]">
              Trust & Legal Pages
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => setModalType('about')}
                  className="hover:text-[var(--accent)] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <User className="w-3 h-3 text-[var(--accent)]" />
                  <span>About Us & Story</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setModalType('contact')}
                  className="hover:text-[var(--accent)] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Mail className="w-3 h-3 text-[var(--accent)]" />
                  <span>Contact Us & Support</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setModalType('privacy')}
                  className="hover:text-[var(--accent)] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Shield className="w-3 h-3 text-[var(--accent)]" />
                  <span>Privacy Policy & GDPR</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setModalType('terms')}
                  className="hover:text-[var(--accent)] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <FileText className="w-3 h-3 text-[var(--accent)]" />
                  <span>Terms & Conditions</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Knowledge Base & Preferences */}
          <div className="space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-[10px] text-[var(--text-primary)]">
              Guides & Preferences
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => setModalType('guide')}
                  className="hover:text-[var(--accent)] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <BookOpen className="w-3 h-3 text-[var(--accent)]" />
                  <span>Portal Guides & Knowledge Base</span>
                </button>
              </li>
              <li>
                <button
                  onClick={openConsentPreferences}
                  className="hover:text-[var(--accent)] transition-colors cursor-pointer flex items-center gap-1.5 font-semibold text-[var(--accent)]"
                >
                  <Sparkles className="w-3 h-3 text-[var(--accent)]" />
                  <span>Cookie Preferences (CMP)</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Disclaimer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left text-[11px]">
          <div>
            © {new Date().getFullYear()} Fileficx — Built securely with WebAssembly. No files are uploaded to any server.
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-current inline" />
            <span>for applicants & creators worldwide</span>
          </div>
        </div>

      </div>

      {/* Compliance / About / Policy / Contact Modals */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 relative shadow-2xl text-left">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-[var(--text-primary)] p-1.5 rounded-lg cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal 1: About Us & Creator Story */}
            {modalType === 'about' && (
              <div className="space-y-4 text-xs text-[var(--text-primary)]">
                <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] pb-3">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--accent)] text-white flex items-center justify-center text-xl font-black shadow-lg">
                    FF
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[var(--text-primary)]">About Us — Fileficx</h3>
                    <p className="text-xs text-[var(--accent)] font-semibold">
                      Empowering applicants and creators worldwide with instant, zero-server visual & document optimization.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-3">
                  <h4 className="font-bold text-sm text-[var(--text-primary)]">Our Mission & Story</h4>
                  <p className="leading-relaxed">
                    Hi! I'm an AI enthusiast and creative technologist passionate about making digital tools, document optimization, and creative utilities accessible to everyone. Fileficx was born from the idea that frustrating rejection errors (such as <i>"File size exceeded"</i>, <i>"Invalid W×H pixel dimensions"</i>, or <i>"DPI resolution mismatch"</i>) on government and corporate recruitment portals shouldn't gatekeep applicants.
                  </p>
                  <p className="leading-relaxed">
                    Unlike traditional file conversion sites that upload your sensitive biometrics, passport photos, and certificates to remote servers, Fileficx runs 100% locally inside your browser's RAM using WebAssembly and HTML5 Canvas. Your documents never touch any server.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <button
                    onClick={() => setModalType('contact')}
                    className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center gap-2 hover:border-[var(--accent)] transition-colors text-left cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-[var(--accent)]" />
                    <div>
                      <div className="font-bold text-[11px]">Contact Us</div>
                      <div className="text-[9px] text-[var(--text-muted)]">Direct Feedback</div>
                    </div>
                  </button>

                  <a
                    href="https://github.com/TAKIGOKUL/Fileficx.git"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center gap-2 hover:border-[var(--accent)] transition-colors"
                  >
                    <Github className="w-4 h-4 text-[var(--accent)]" />
                    <div>
                      <div className="font-bold text-[11px]">GitHub</div>
                      <div className="text-[9px] text-[var(--text-muted)]">Source Code</div>
                    </div>
                  </a>

                  <a
                    href="https://x.com"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center gap-2 hover:border-[var(--accent)] transition-colors"
                  >
                    <Twitter className="w-4 h-4 text-[var(--accent)]" />
                    <div>
                      <div className="font-bold text-[11px]">Twitter / X</div>
                      <div className="text-[9px] text-[var(--text-muted)]">Community</div>
                    </div>
                  </a>
                </div>
              </div>
            )}

            {/* Modal 2: Contact Us Form & Information */}
            {modalType === 'contact' && (
              <div className="space-y-4 text-xs text-[var(--text-primary)]">
                <div className="border-b border-[var(--border-subtle)] pb-2">
                  <h3 className="text-lg font-black text-[var(--accent)]">Contact Us</h3>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Have questions, suggestions, or technical support queries? Reach out directly.
                  </p>
                </div>

                {contactSubmitted ? (
                  <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2 animate-slide-up">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                    <h4 className="font-bold text-sm text-[var(--text-primary)]">Message Sent Successfully!</h4>
                    <p className="text-xs text-[var(--text-muted)]">
                      Thank you for contacting Fileficx. We will review your query and respond shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[var(--text-muted)] mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="e.g. Alex Sharma"
                          className="w-full bg-[var(--input-inner-bg)] border border-[var(--border-subtle)] rounded-xl p-2.5 text-xs text-[var(--text-primary)] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[var(--text-muted)] mb-1">Your Email</label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full bg-[var(--input-inner-bg)] border border-[var(--border-subtle)] rounded-xl p-2.5 text-xs text-[var(--text-primary)] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[var(--text-muted)] mb-1">Subject</label>
                      <select
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        className="w-full bg-[var(--input-inner-bg)] border border-[var(--border-subtle)] rounded-xl p-2.5 text-xs text-[var(--text-primary)] focus:outline-none"
                      >
                        <option>General Query / Feedback</option>
                        <option>Portal Requirements Support</option>
                        <option>Privacy & Security Inquiry</option>
                        <option>Advertising / Business Partnership</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[var(--text-muted)] mb-1">Message</label>
                      <textarea
                        rows={4}
                        required
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="How can we help you?"
                        className="w-full bg-[var(--input-inner-bg)] border border-[var(--border-subtle)] rounded-xl p-2.5 text-xs text-[var(--text-primary)] focus:outline-none resize-none"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="text-[10px] text-[var(--text-muted)]">
                        Direct Email: <strong>gokulgkblueheart@gmail.com</strong>
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary text-xs py-2 px-5 rounded-xl font-bold flex items-center gap-1.5"
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
                <div className="border-b border-[var(--border-subtle)] pb-2">
                  <h3 className="text-lg font-black text-[var(--accent)]">Privacy Policy</h3>
                  <div className="text-[10px] text-[var(--text-muted)]">Last updated: 25/09/2026</div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-sm">Information We Collect</h4>
                  <p>
                    We collect information you provide directly to us, such as when you set preferences or interact with our services. This may include your email address, preferences, and any content you choose to share. <strong>Note: Your uploaded documents, photos, and signatures are processed exclusively in your browser's local RAM and are NEVER uploaded to any server.</strong>
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-sm">How We Use Your Information</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>To provide, maintain, and improve our client-side processing services</li>
                    <li>To personalize your experience on our platform</li>
                    <li>To communicate with you about our services</li>
                    <li>To ensure the security and integrity of our platform</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-sm">Google AdSense and Third-Party Advertising</h4>
                  <p>
                    We use Google AdSense (Publisher ID: <code>ca-pub-2244853446692512</code>) to display advertisements on our website. Google AdSense and other third-party advertising partners may place cookies on your browser, use web beacons, or collect your IP address to serve personalized advertisements based on your interests and browsing behavior.
                  </p>
                  <p>
                    These third parties may be placing and reading cookies on your users' browsers, or using web beacons or IP addresses to collect information in the process of ad serving on our website. For more information, please visit <a href="https://www.google.com/policies/privacy/partners/" target="_blank" rel="noreferrer" className="text-[var(--accent)] underline">How Google uses data when you use our partners' sites or apps</a>. You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer" className="text-[var(--accent)] underline">Google Ads Settings</a>.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-sm">Cookies and Tracking</h4>
                  <p>
                    We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-sm">EU User Consent and GDPR (EEA, UK & Swiss TCF v2.2)</h4>
                  <p>
                    For users in the European Union, European Economic Area (EEA), UK, and Switzerland, we comply with the General Data Protection Regulation (GDPR) and obtain appropriate consent for data processing and personalized advertising using a Google Certified Consent Management Platform (CMP). You have the right to access, update, or delete your personal information, and to withdraw consent for data processing at any time.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-sm">Children's Privacy (COPPA)</h4>
                  <p>
                    Our service is not directed to children under 13 years of age. We do not knowingly collect personally identifiable information from children under 13. If we become aware that we have collected personal data from a child under 13 without parental consent, we will take steps to remove that information.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={openConsentPreferences}
                    className="btn btn-secondary text-xs py-1.5 px-3 rounded-xl font-bold"
                  >
                    Open Cookie Consent Management (CMP)
                  </button>
                </div>
              </div>
            )}

            {/* Modal 4: Terms & Conditions / Disclaimer */}
            {modalType === 'terms' && (
              <div className="space-y-4 text-xs text-[var(--text-primary)] leading-relaxed">
                <div className="border-b border-[var(--border-subtle)] pb-2">
                  <h3 className="text-lg font-black text-[var(--accent)]">Terms and Conditions & Disclaimer</h3>
                  <div className="text-[10px] text-[var(--text-muted)]">Last updated: 25/09/2026</div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-sm">Acceptance of Terms</h4>
                  <p>
                    By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-sm">Use License</h4>
                  <p>
                    Permission is granted to temporarily use the materials on Fileficx's website for personal, non-commercial transitory viewing and processing only. Under this license you may not:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Modify or copy core engine codebase materials for commercial resale</li>
                    <li>Attempt to reverse engineer any WebAssembly binary contained on the website</li>
                    <li>Remove any copyright or proprietary notations</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-sm">Advertising and Google AdSense Compliance</h4>
                  <p>
                    Our service displays advertisements through Google AdSense (Publisher ID: <code>ca-pub-2244853446692512</code>) and other advertising partners. By using our service, you acknowledge and agree that:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Third parties may place cookies and collect information for advertising purposes</li>
                    <li>Advertisements are provided by third parties and do not reflect our endorsement</li>
                    <li>We comply with Google Publisher Policies and industry advertising standards</li>
                    <li>Users must not engage in click fraud, artificial traffic generation, or any attempts to manipulate advertising systems</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-sm">User Responsibilities and Disclaimer</h4>
                  <p>
                    The materials on Fileficx's website are provided on an 'as is' basis. Fileficx makes no warranties, expressed or implied, and hereby disclaims all other warranties. Users remain responsible for reviewing official notifications (e.g. SSC, UPSC, IBPS, NTA) to verify latest requirement rules before submitting files.
                  </p>
                </div>
              </div>
            )}

            {/* Modal 5: Portal Guides & Original Content Articles */}
            {modalType === 'guide' && (
              <div className="space-y-4 text-xs text-[var(--text-primary)] leading-relaxed">
                <div className="border-b border-[var(--border-subtle)] pb-2">
                  <h3 className="text-lg font-black text-[var(--accent)]">Portal Guides & Knowledge Base</h3>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    In-depth technical guides for Indian examination portals, visa specifications, and document optimization.
                  </p>
                </div>

                <div className="space-y-4">
                  <article className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-2">
                    <h4 className="font-bold text-sm text-[var(--accent)]">
                      1. Understanding Pixel Dimensions & Aspect Ratios for SSC, UPSC & IBPS
                    </h4>
                    <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                      Most recruitment portals enforce rigid pixel limits (such as 200×230px for passport photographs and 140×60px for signatures). Uploading an image with non-standard aspect ratios leads to stretched or rejected applications. Fileficx automatically locks aspect ratios and resizes with high-quality bicubic interpolation.
                    </p>
                  </article>

                  <article className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-2">
                    <h4 className="font-bold text-sm text-[var(--accent)]">
                      2. Why File Size (KB) Limits Exist & How WebAssembly Compression Works
                    </h4>
                    <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                      Government portals set strict upper limits (e.g. strictly under 50KB or 20KB) due to legacy database storage constraints. Fileficx uses iterative client-side WebAssembly compression algorithms to guarantee file size lands strictly below portal maximums without face blur degradation.
                    </p>
                  </article>

                  <article className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-2">
                    <h4 className="font-bold text-sm text-[var(--accent)]">
                      3. DPI Resolution (200 vs 300 DPI) Explained for Signature Scans
                    </h4>
                    <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                      DPI (Dots Per Inch) determines print density when hall tickets or identity cards are generated. SSC and IBPS portals require 200 DPI or 300 DPI headers in the JPEG EXIF metadata. Fileficx embeds accurate DPI headers locally in RAM.
                    </p>
                  </article>

                  <article className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-2">
                    <h4 className="font-bold text-sm text-[var(--accent)]">
                      4. Zero-Server Privacy Vault: Why Client-Side Processing Matters
                    </h4>
                    <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                      Personal documents like passport photos, caste certificates, and biometric signatures contain sensitive identity data. Fileficx processes everything locally via HTML5 Canvas and PDF-Lib, ensuring 100% privacy with zero server uploads.
                    </p>
                  </article>
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] text-right">
              <button
                onClick={() => setModalType(null)}
                className="btn btn-primary text-xs py-2 px-4 rounded-xl"
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
