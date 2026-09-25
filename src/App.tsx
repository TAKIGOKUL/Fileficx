import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud } from 'lucide-react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FileDropzone } from './components/FileDropzone';
import { Workspace } from './components/Workspace';
import { AdBanner } from './components/AdBanner';
import { Footer } from './components/Footer';
import { ConsentBanner } from './components/ConsentBanner';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { ContactPage } from './pages/ContactPage';
import { SocialsVertical } from './components/SocialsVertical';
import { ParsedRequirement } from './types';
import { parseInstructions } from './utils/instructionParser';

type PageRoute = 'home' | 'about' | 'privacy' | 'terms' | 'contact';

export const App: React.FC = () => {
  // Navigation State with URL Path Sync
  const getInitialPage = (): PageRoute => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase().replace(/^\/+/, '');
      if (path === 'about') return 'about';
      if (path === 'privacy') return 'privacy';
      if (path === 'terms') return 'terms';
      if (path === 'contact') return 'contact';
    }
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState<PageRoute>(getInitialPage);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getInitialPage());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Dynamic SEO Page Title Management
  useEffect(() => {
    if (typeof document === 'undefined') return;
    switch (currentPage) {
      case 'about':
        document.title = 'About Us — Precision Document Optimization | Fileficx';
        break;
      case 'privacy':
        document.title = 'Privacy Policy & GDPR Compliance | Fileficx';
        break;
      case 'terms':
        document.title = 'Terms and Conditions | Fileficx';
        break;
      case 'contact':
        document.title = 'Contact Us & Support | Fileficx';
        break;
      default:
        document.title = 'Fileficx — Free In-Browser Photo & Document Resizer for Exam & Visa Applications';
    }
  }, [currentPage]);

  const handleNavigate = (page: string) => {
    const validPages: PageRoute[] = ['home', 'about', 'privacy', 'terms', 'contact'];
    const targetPage = validPages.includes(page as PageRoute) ? (page as PageRoute) : 'home';
    setCurrentPage(targetPage);
    if (typeof window !== 'undefined') {
      const newUrl = targetPage === 'home' ? '/' : `/${targetPage}`;
      if (window.location.pathname !== newUrl) {
        window.history.pushState(null, '', newUrl);
      }
    }
  };
  // Theme Management (Defaults to warm cream theme)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fileficx_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('fileficx_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Application State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isWorkspaceActive, setIsWorkspaceActive] = useState<boolean>(false);
  const [parsedReq, setParsedReq] = useState<ParsedRequirement | null>(() => {
    return parseInstructions(
      'Photo: JPG, max 50KB, 200x230px, 200 DPI, white background'
    );
  });
  const [isGlobalDragging, setIsGlobalDragging] = useState<boolean>(false);
  const dragCounter = useRef<number>(0);

  // File selection attaches the file without auto-navigating to workspace
  const handleFileSelect = (selectedFile: File) => {
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
              Images (JPG, PNG, WEBP, HEIC) or Documents (PDF)
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
          currentPage={currentPage}
          onNavigate={handleNavigate}
        />

        {/* Outer Layout Container with Side Ads & Main Content */}
        <div className="w-full flex items-start justify-center gap-4 px-2 sm:px-4 py-2">
          
          {/* Left Vertical Skyscraper Ad */}
          <AdBanner variant="side-left" className="hidden 2xl:flex sticky top-20 self-start" />

          {/* Center Main Stage */}
          <main className="w-full max-w-6xl px-2 sm:px-4 py-2 flex-1">
            
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
                      onProceedToWorkspace={handleProceedToWorkspace}
                    />

                    <FileDropzone
                      currentFile={uploadedFile}
                      onFileSelect={handleFileSelect}
                    />
                  </div>
                ) : (
                  uploadedFile && (
                    <div id="workspace-section" className="my-6 animate-slide-up">
                      <Workspace
                        file={uploadedFile}
                        parsedReq={parsedReq}
                        onReplaceFile={handleReset}
                      />
                    </div>
                  )
                )}
              </>
            )}

            {/* Below content ad banner */}
            <AdBanner variant="bottom" />
          </main>

          {/* Right Vertical Skyscraper Ad */}
          <AdBanner variant="side-right" className="hidden 2xl:flex sticky top-20 self-start" />

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
