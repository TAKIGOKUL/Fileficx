import { 
  ArrowLeft, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Lock, 
  Sparkles, 
  ServerOff, 
  Binary, 
  Github, 
  Linkedin, 
  Instagram, 
  Send 
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-16 animate-slide-up text-left">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--input-inner-bg)] hover:bg-[var(--accent-subtle)] px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer border border-[var(--border-subtle)] hover:border-[var(--accent-border)]"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>Back to Workspace</span>
        </button>
        <span className="text-xs text-[var(--text-muted)]">/</span>
        <span className="text-xs text-[var(--accent)] font-semibold">About Fileficx</span>
      </div>

      {/* Hero Header Section */}
      <div className="space-y-4 max-w-3xl">
        <div className="badge-mooni shadow-lg shadow-[var(--accent)]/15">
          <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>Origin &amp; Architecture</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-black text-[var(--text-primary)] tracking-tight leading-[1.15]">
          Engineering Digital Sovereignty for <br />
          <span className="text-color-gradient-brand">High-Stakes Applications</span>
        </h1>
        
        <p className="text-sm sm:text-base text-[var(--text-secondary)] font-normal leading-relaxed pt-1">
          Every year, millions of students, job applicants, and international travelers are forced to hand over their most sensitive biometric photos, national identification records, and physical signatures to obscure web converters just to satisfy hyper-strict portal formatting rules.
        </p>
      </div>

      {/* The Problem & The Solution: Two-column Narrative Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        
        {/* Card 1: The Fragility of Cloud Converters */}
        <div className="mooni-card p-6 sm:p-8 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
              <ServerOff className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              The Cloud Conversion Dilemma
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-normal">
              Traditional conversion websites operate on remote backend servers. When you upload a passport photo or signature, it traverses third-party CDNs, sits in temporary staging buckets, and exposes your biometric data to server logging, scrapers, and potential data leaks. All to change an image by a few millimeters or shave off 15 kilobytes.
            </p>
          </div>
          <div className="pt-4 border-t border-[var(--border-subtle)] text-[11px] font-mono text-red-400/90 flex items-center gap-2">
            <span>✗ Remote Upload Risk</span>
            <span>•</span>
            <span>✗ Persistent Server Caching</span>
          </div>
        </div>

        {/* Card 2: The Zero-Server Guarantee */}
        <div className="mooni-card p-6 sm:p-8 space-y-4 flex flex-col justify-between border-[var(--accent-border)] bg-gradient-to-b from-[var(--accent-subtle)]/30 to-transparent">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--accent-subtle)] border border-[var(--accent-border)] text-[var(--accent)] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              The Fileficx Zero-Server Paradigm
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-normal">
              Fileficx was architected with a strict client-side guarantee: our servers never ingest your files. By leveraging modern WebAssembly and native HTML5 Canvas rasterization, every single operation—pixel resampling, binary JFIF DPI injection, and PDF compression—is computed entirely inside your browser's private sandbox.
            </p>
          </div>
          <div className="pt-4 border-t border-[var(--border-subtle)] text-[11px] font-mono text-[var(--accent)] flex items-center gap-2">
            <span>✓ 100% In-Browser Memory</span>
            <span>•</span>
            <span>✓ Complete Biometric Privacy</span>
          </div>
        </div>

      </div>

      {/* Bento Grid: 4 Core Pillars of the Engine */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] tracking-tight">
            How Fileficx Delivers Exact Portal Compliance
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)]">
            Designed to defeat automated portal rejection algorithms across UPSC, SSC, IBPS, US Visa, and Schengen requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Pillar 1 */}
          <div className="mooni-card p-6 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent-subtle)] border border-[var(--accent-border)] text-[var(--accent)] flex items-center justify-center">
              <Cpu className="w-4.5 h-4.5" />
            </div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Sub-50ms Local Execution
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              No network roundtrips. Resizing and recompression run directly on your device's GPU and CPU at native hardware velocity.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="mooni-card p-6 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent-subtle)] border border-[var(--accent-border)] text-[var(--accent)] flex items-center justify-center">
              <Binary className="w-4.5 h-4.5" />
            </div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Binary DPI Synthesis
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Government portals reject photos missing resolution tags. We rewrite raw JFIF APP0 markers to guarantee 200 or 300 DPI verification.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="mooni-card p-6 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent-subtle)] border border-[var(--accent-border)] text-[var(--accent)] flex items-center justify-center">
              <Zap className="w-4.5 h-4.5" />
            </div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Adaptive KB Targeting
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Our intelligent binary search algorithm iteratively modulates JPEG quantization tables to hit strict kilobyte ceilings without blurriness.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="mooni-card p-6 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent-subtle)] border border-[var(--accent-border)] text-[var(--accent)] flex items-center justify-center">
              <Lock className="w-4.5 h-4.5" />
            </div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Zero Storage Footprint
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              No databases, no file logs, and zero tracking cookies. The moment you close the browser tab, all file memory is permanently wiped.
            </p>
          </div>

        </div>
      </div>

      {/* Metrics Section: Mooni Solar Amber Glow Numbers */}
      <div className="mooni-card p-8 sm:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--accent)]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-8 relative z-10">
          <div className="max-w-xl space-y-2">
            <span className="text-[11px] font-bold text-[var(--accent)] uppercase tracking-wider font-mono">
              Engine Benchmarks
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-tight">
              Performance by the Numbers
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Rigorous precision engineering designed for absolute reliability when submitting critical career and travel applications.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
            
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-color-gradient-brand">
                0 Bytes
              </div>
              <div className="text-xs font-bold text-[var(--text-primary)]">
                Server Ingestion
              </div>
              <div className="text-[11px] text-[var(--text-muted)] font-normal">
                Files stay entirely on your device
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-color-gradient-brand">
                &lt; 40ms
              </div>
              <div className="text-xs font-bold text-[var(--text-primary)]">
                Average Latency
              </div>
              <div className="text-[11px] text-[var(--text-muted)] font-normal">
                Instant real-time rendering
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-color-gradient-brand">
                100%
              </div>
              <div className="text-xs font-bold text-[var(--text-primary)]">
                Client-Side Sandbox
              </div>
              <div className="text-[11px] text-[var(--text-muted)] font-normal">
                WebAssembly &amp; HTML5 Canvas
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-color-gradient-brand">
                40+
              </div>
              <div className="text-xs font-bold text-[var(--text-primary)]">
                Calibrated Presets
              </div>
              <div className="text-[11px] text-[var(--text-muted)] font-normal">
                UPSC, SSC, US Visa, Schengen, IBPS
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Creator & Open Engineering Section */}
      <div className="space-y-6 pt-4 border-t border-[var(--border-subtle)]">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            Created with Care by Independent Engineering
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            Fileficx is maintained by Taki (TAKIGOKUL) with a dedication to open web standards, user privacy, and software craftsmanship.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          
          <a
            href="https://t.me/alchemist_taki"
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent)] hover:shadow-lg transition-all flex items-center gap-3.5 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">Telegram</div>
              <div className="text-[11px] text-[var(--text-muted)] font-mono">@alchemist_taki</div>
            </div>
          </a>

          <a
            href="https://github.com/TAKIGOKUL"
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent)] hover:shadow-lg transition-all flex items-center gap-3.5 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Github className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">GitHub</div>
              <div className="text-[11px] text-[var(--text-muted)] font-mono">TAKIGOKUL</div>
            </div>
          </a>

          <a
            href="https://www.linkedin.com/in/gokul-gk-b0b718261/"
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent)] hover:shadow-lg transition-all flex items-center gap-3.5 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Linkedin className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">LinkedIn</div>
              <div className="text-[11px] text-[var(--text-muted)] font-mono">Gokul GK</div>
            </div>
          </a>

          <a
            href="https://www.instagram.com/ad.astra.___/"
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent)] hover:shadow-lg transition-all flex items-center gap-3.5 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Instagram className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">Instagram</div>
              <div className="text-[11px] text-[var(--text-muted)] font-mono">@ad.astra.___</div>
            </div>
          </a>

        </div>
      </div>

    </div>
  );
};

export default AboutPage;
