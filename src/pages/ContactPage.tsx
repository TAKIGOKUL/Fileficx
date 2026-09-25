import React, { useState } from 'react';
import { ArrowLeft, Mail, Send, CheckCircle2, Github, Twitter, MessageSquare } from 'lucide-react';

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Query / Feedback');
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
          className="inline-flex items-center gap-2 text-xs font-bold text-[var(--accent)] bg-[var(--accent-subtle)] hover:bg-[var(--accent)] hover:text-white px-4 py-2 rounded-full transition-all duration-200 cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
        <span className="text-xs text-[var(--text-muted)] font-medium">/ Contact Us</span>
      </div>

      {/* Header Section */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[var(--accent)] bg-[var(--accent-subtle)] px-3.5 py-1 rounded-full border border-[var(--accent)]/20">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>WE'D LOVE TO HEAR FROM YOU</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[var(--text-primary)] tracking-tight">
          Contact Us & Support
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-muted)] font-medium max-w-xl">
          Have a question about portal specs, feature suggestions, or business inquiries? Send us a direct message below.
        </p>
      </div>

      {/* Contact Grid: Form + Info Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* Left 2 Cols: Form */}
        <div className="md:col-span-2 p-6 sm:p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xl">
          {submitted ? (
            <div className="p-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 animate-slide-up">
              <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
              <h3 className="font-black text-lg text-[var(--text-primary)]">Message Sent Successfully!</h3>
              <p className="text-xs text-[var(--text-muted)] font-medium max-w-sm mx-auto">
                Thank you for contacting Fileficx. We will review your inquiry and respond to your email as soon as possible.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Sharma"
                    className="w-full bg-[var(--input-inner-bg)] border border-[var(--border-subtle)] rounded-2xl p-3 text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[var(--input-inner-bg)] border border-[var(--border-subtle)] rounded-2xl p-3 text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                  Subject
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[var(--input-inner-bg)] border border-[var(--border-subtle)] rounded-2xl p-3 text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] font-medium"
                >
                  <option>General Query / Feedback</option>
                  <option>Portal Requirements Support</option>
                  <option>Privacy & Security Inquiry</option>
                  <option>Advertising / Business Partnership</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                  Your Message
                </label>
                <textarea
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you today?"
                  className="w-full bg-[var(--input-inner-bg)] border border-[var(--border-subtle)] rounded-2xl p-3 text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] font-medium resize-none leading-relaxed"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="btn btn-primary text-xs sm:text-sm py-3 px-8 rounded-full font-bold flex items-center gap-2 shadow-lg hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right 1 Col: Direct Contact Cards */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center font-bold">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-[var(--text-primary)]">Direct Email</h3>
            <p className="text-xs text-[var(--text-muted)] font-medium break-all">
              gokulgkblueheart@gmail.com
            </p>
          </div>

          <a
            href="https://github.com/TAKIGOKUL/Fileficx.git"
            target="_blank"
            rel="noreferrer"
            className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent)] shadow-sm space-y-2 block transition-all hover:scale-[1.02]"
          >
            <div className="w-9 h-9 rounded-2xl bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center font-bold">
              <Github className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-[var(--text-primary)]">GitHub Repository</h3>
            <p className="text-xs text-[var(--text-muted)] font-medium">
              TAKIGOKUL / Fileficx
            </p>
          </a>

          <a
            href="https://x.com"
            target="_blank"
            rel="noreferrer"
            className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent)] shadow-sm space-y-2 block transition-all hover:scale-[1.02]"
          >
            <div className="w-9 h-9 rounded-2xl bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center font-bold">
              <Twitter className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-[var(--text-primary)]">Twitter / X</h3>
            <p className="text-xs text-[var(--text-muted)] font-medium">
              Community & Updates
            </p>
          </a>
        </div>

      </div>

    </div>
  );
};
