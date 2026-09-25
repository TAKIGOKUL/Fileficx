import React, { useState } from 'react';
import { ArrowLeft, Send, CheckCircle2, Github, Linkedin, Instagram } from 'lucide-react';

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry / Feedback');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setMessage('');
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 animate-slide-up text-left">
      
      {/* Back Button & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--input-inner-bg)] hover:bg-[var(--bg-card)] px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer border border-[var(--border-subtle)]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
        <span className="text-xs text-[var(--text-muted)]">/</span>
        <span className="text-xs text-[var(--text-muted)] font-medium">Contact</span>
      </div>

      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Contact Us
        </h1>
        <p className="text-sm text-[var(--text-muted)] font-normal max-w-xl">
          Have a question regarding portal specifications, partnership requests, or feedback? Send us a message below.
        </p>
      </div>

      {/* Contact Grid: Form + Info Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Left 2 Cols: Form */}
        <div className="md:col-span-2 p-6 sm:p-7 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
          {submitted ? (
            <div className="p-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2 animate-slide-up">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="font-bold text-base text-[var(--text-primary)]">Message Received</h3>
              <p className="text-xs text-[var(--text-muted)] font-normal max-w-sm mx-auto">
                Thank you for reaching out. We will review your inquiry and get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Sharma"
                    className="w-full bg-[var(--input-inner-bg)] border border-[var(--border-subtle)] rounded-xl p-2.5 text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[var(--input-inner-bg)] border border-[var(--border-subtle)] rounded-xl p-2.5 text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                  Topic
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[var(--input-inner-bg)] border border-[var(--border-subtle)] rounded-xl p-2.5 text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] font-medium"
                >
                  <option>General Inquiry / Feedback</option>
                  <option>Portal Specification Request</option>
                  <option>Privacy & Security Question</option>
                  <option>Advertising / Business Partnership</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we assist you?"
                  className="w-full bg-[var(--input-inner-bg)] border border-[var(--border-subtle)] rounded-xl p-2.5 text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] font-medium resize-none leading-relaxed"
                />
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  className="btn btn-primary text-xs sm:text-sm py-2.5 px-6 rounded-xl font-semibold flex items-center gap-2 cursor-pointer shadow-sm hover:scale-[1.01] active:scale-98 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right 1 Col: Direct Social Channels */}
        <div className="space-y-3">
          <a
            href="https://t.me/alchemist_taki"
            target="_blank"
            rel="noreferrer"
            className="p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent)] space-y-1 block transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center font-bold mb-1.5">
              <Send className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-xs text-[var(--text-primary)]">Telegram</h3>
            <p className="text-[11px] text-[var(--text-muted)] font-normal">
              @alchemist_taki
            </p>
          </a>

          <a
            href="https://github.com/TAKIGOKUL"
            target="_blank"
            rel="noreferrer"
            className="p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent)] space-y-1 block transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center font-bold mb-1.5">
              <Github className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-xs text-[var(--text-primary)]">GitHub</h3>
            <p className="text-[11px] text-[var(--text-muted)] font-normal">
              TAKIGOKUL
            </p>
          </a>

          <a
            href="https://www.linkedin.com/in/gokul-gk-b0b718261/"
            target="_blank"
            rel="noreferrer"
            className="p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent)] space-y-1 block transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center font-bold mb-1.5">
              <Linkedin className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-xs text-[var(--text-primary)]">LinkedIn</h3>
            <p className="text-[11px] text-[var(--text-muted)] font-normal">
              Gokul GK
            </p>
          </a>

          <a
            href="https://www.instagram.com/ad.astra.___/"
            target="_blank"
            rel="noreferrer"
            className="p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent)] space-y-1 block transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center font-bold mb-1.5">
              <Instagram className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-xs text-[var(--text-primary)]">Instagram</h3>
            <p className="text-[11px] text-[var(--text-muted)] font-normal">
              @ad.astra.___
            </p>
          </a>
        </div>

      </div>

    </div>
  );
};
