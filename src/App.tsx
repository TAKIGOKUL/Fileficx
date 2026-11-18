import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { UploadCloud } from 'lucide-react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { AdBanner } from './components/AdBanner';
import { Footer } from './components/Footer';
import { ConsentBanner } from './components/ConsentBanner';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { ContactPage } from './pages/ContactPage';
import { SocialsVertical } from './components/SocialsVertical';
import { HomeContent, WorkspaceGuides } from './components/HomeContent';
import { GuidesPage } from './pages/GuidesPage';
import { seoFor, SITE_URL } from './seo';
import { setAdsAllowed } from './ads';
import { ParsedRequirement } from './types';
import { parseInstructions } from './utils/instructionParser';

// PDF/image engines are heavy; load them only when a file is opened
const Workspace = lazy(() => import('./components/Workspace'));

type PageRoute = 'home' | 'about' | 'privacy' | 'terms' | 'contact' | 'guides';

const VALID_PAGES: PageRoute[] = ['home', 'about', 'privacy', 'terms', 'contact', 'guides'];

const parsePath = (raw: string): { page: PageRoute; slug?: string } => {
  const [first, second] = raw.toLowerCase().replace(/^\/+|\/+$/g, '').split('/');
  const page = VALID_PAGES.includes(first as PageRoute) ? (first as PageRoute) : 'home';
  return { page, slug: page === 'guides' && second ? second : undefined };
};

interface AppProps {
  /** Path to render when there is no window (build-time pre-rendering) */
  initialPath?: string;
}

const setMeta = (selector: string, attr: string, value: string) => document.querySelector(selector)?.setAttribute(attr, value);

export const App: React.FC<AppProps> = ({ initialPath = '/' }) => {
  // Navigation State with URL Path Sync
  const getInitialRoute = () => parsePath(typeof window !== 'undefined' ? window.location.pathname : initialPath);

  const [route, setRoute] = useState<{ page: PageRoute; slug?: string }>(getInitialRoute);
  const currentPage = route.page;
  const [presetRequest, setPresetRequest] = useState<{ text: string; nonce: number } | null>(null);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(getInitialRoute());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const seo = seoFor(currentPage, route.slug);

  // Per-route head tags (pre-rendered HTML ships the same values for crawlers)
  useEffect(() => {
    document.title = seo.title;
    const url = SITE_URL + seo.path;
    setMeta('meta[name="description"]', 'content', seo.description);
    setMeta('link[rel="canonical"]', 'href', url);
    setMeta('meta[property="og:url"]', 'content', url);
    setMeta('meta[property="og:title"]', 'content', seo.title);
    setMeta('meta[property="og:description"]', 'content', seo.description);
    setMeta('meta[name="twitter:title"]', 'content', seo.title);
    setMeta('meta[name="twitter:description"]', 'content', seo.description);
  }, [seo.title, seo.description, seo.path]);

  const handleNavigate = (page: string) => {
    const next = parsePath(page === 'home' ? '' : page);
    setRoute(next);
    if (typeof window !== 'undefined') {
      const newUrl = next.page === 'home' ? '/' : `/${next.page}${next.slug ? `/${next.slug}` : ''}`;
      if (window.location.pathname !== newUrl) {
        window.history.pushState(null, '', newUrl);
      }
      window.scrollTo({ top: 0 });
    }
  };

  const handleUsePreset = (text: string) => {
    setPresetRequest({ text, nonce: Date.now() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Theme: saved choice, else the OS preference
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('fileficx_theme');
        if (saved === 'dark' || saved === 'light') return saved;
      } catch {
        /* storage unavailable */
      }
      if (window.matchMedia?.('(prefers-color-scheme: light)').matches) return 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0a0605' : '#fbf8f4');
    try {
      localStorage.setItem('fileficx_theme', theme);
    } catch {
      /* storage unavailable */
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Application State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isWorkspaceActive, setIsWorkspaceActive] = useState<boolean>(false);

  // Only request ads on screens with real publisher content, never on the bare tool screen
  useEffect(() => {
    setAdsAllowed(seo.ads && !(currentPage === 'home' && isWorkspaceActive));
  }, [seo.ads, currentPage, isWorkspaceActive]);
  const [parsedReq, setParsedReq] = useState<ParsedRequirement | null>(() => {
    return parseInstructions(
      'Photo: JPG, max 50KB, 200x230px, 200 DPI, white background'
    );
  });
  const [isGlobalDragging, setIsGlobalDragging] = useState<boolean>(false);
  const dragCounter = useRef<number>(0);

  // File selection attaches the file without auto-navigating to workspace
  const handleFileSelect = (selectedFile: File) => {
    void import('./components/Workspace'); // warm the chunk while the user reviews settings
    setUploadedFile(selectedFile);
    setIsWorkspaceActive(false); // Strictly keep workspace closed until Parse/Process is clicked
  };

  // Global Drag & Drop Listener: Entire website is draggable
  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current += 1;
      if (e.dataTransfer && Array.from(e.dataTransfer.types).includes('Files')) {
        setIsGlobalDragging(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current -= 1;
      if (dragCounter.current <= 0) {
        dragCounter.current = 0;
        setIsGlobalDragging(false);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'copy';
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current = 0;
      setIsGlobalDragging(false);

      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileSelect(e.dataTransfer.files[0]);
      }
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    };
  }, []);

  const handleParsed = (req: ParsedRequirement) => {
    setParsedReq(req);
  };

  const handleProceedToWorkspace = () => {
    if (uploadedFile) {
      setIsWorkspaceActive(true);
      setTimeout(() => {
        const workspaceEl = document.getElementById('workspace-section');
        if (workspaceEl) {
          workspaceEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }
  };

  const handleReset = () => {
    setIsWorkspaceActive(false);
    setUploadedFile(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between transition-colors duration-200 living-gradient-bg relative overflow-x-hidden">
      
      {/* Global Full-Window Drag Drop Overlay */}
      {isGlobalDragging && (
        <div className="fixed inset-0 z-50 bg-[var(--accent)]/15 backdrop-blur-md flex flex-col items-center justify-center pointer-events-none transition-all duration-200">
          <div className="p-8 rounded-3xl bg-[var(--bg-card)] border-4 border-dashed border-[var(--accent)] shadow-2xl flex flex-col items-center gap-4 animate-breathe max-w-md text-center mx-4">
            <div className="w-16 h-16 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center">
              <UploadCloud className="w-8 h-8 animate-bounce" />
            </div>
            <h2 className="text-xl font-black text-[var(--text-primary)]">
              Drop your file anywhere to upload!
            </h2>
            <p className="text-xs text-[var(--text-muted)] font-medium">
              Images (JPG, PNG, WEBP, HEIC, GIF, TIFF…), PDF or Word (DOCX)
            </p>
          </div>
        </div>
      )}

      <div>
        {/* Navigation & Header with Theme Toggle & Try Another File button */}
        <Header
          currentTheme={theme}
          onToggleTheme={toggleTheme}
          hasFile={isWorkspaceActive && uploadedFile !== null}
          onTryAnother={handleReset}
          currentPage={route.slug ? `guides/${route.slug}` : currentPage}
          onNavigate={handleNavigate}
        />

        {/* Outer Layout Container with Main Content */}
        <div className="w-full flex items-start justify-center px-4 sm:px-6">

          {/* Center Main Stage */}
          <main className="w-full max-w-7xl py-2 flex-1">
            
            {/* View A: About Page */}
            {currentPage === 'about' && (
              <AboutPage onNavigate={handleNavigate} />
            )}

            {/* View B: Privacy Policy Page */}
            {currentPage === 'privacy' && (
              <PrivacyPage onNavigate={handleNavigate} />
            )}

            {/* View C: Terms and Conditions Page */}
            {currentPage === 'terms' && (
              <TermsPage onNavigate={handleNavigate} />
            )}

            {currentPage === 'guides' && (
              <GuidesPage slug={route.slug} onNavigate={handleNavigate} />
            )}

            {/* View D: Contact Us Page */}
            {currentPage === 'contact' && (
              <ContactPage onNavigate={handleNavigate} />
            )}

            {/* View E: Homepage Hero / Dropzone / Workspace */}
            {currentPage === 'home' && (
              <>
                {!isWorkspaceActive ? (
                  <div className="animate-fadeIn">
                    <HeroSection
                      onParsed={handleParsed}
                      hasFile={uploadedFile !== null}
                      currentFile={uploadedFile}
                      onFileSelect={handleFileSelect}
                      onProceedToWorkspace={handleProceedToWorkspace}
                      presetRequest={presetRequest}
                    />

                    <HomeContent onUsePreset={handleUsePreset} onNavigate={handleNavigate} />
                  </div>
                ) : (
                  uploadedFile && (
                    <div id="workspace-section" className="pt-6 sm:pt-8 animate-slide-up">
                      <Suspense
                        fallback={
                          <div className="hero-card p-10 text-center text-sm text-[var(--text-muted)]">Loading workspace…</div>
                        }
                      >
                        <Workspace
                          file={uploadedFile}
                          parsedReq={parsedReq}
                          onReplaceFile={handleReset}
                          onOpenFile={(f) => {
                            setUploadedFile(f);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        />
                      </Suspense>
                      <WorkspaceGuides onNavigate={handleNavigate} />
                    </div>
                  )
                )}
              </>
            )}

            {/* Below content ad banner */}
            <AdBanner variant="bottom" />
          </main>

        </div>
      </div>

      {/* Floating Vertical Social Sidebar */}
      <SocialsVertical />

      {/* Footer & Privacy Consent Banner */}
      <Footer onNavigate={handleNavigate} />
      <ConsentBanner />
    </div>
  );
};

export default App;
