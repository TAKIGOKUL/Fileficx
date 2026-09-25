import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud } from 'lucide-react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FileDropzone } from './components/FileDropzone';
import { Workspace } from './components/Workspace';
import { AdBanner } from './components/AdBanner';
import { Footer } from './components/Footer';
import { ParsedRequirement } from './types';
import { parseInstructions } from './utils/instructionParser';

export const App: React.FC = () => {
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
        />

        {/* Outer Layout Container with Side Ads & Main Content */}
        <div className="w-full flex items-start justify-center gap-4 px-2 sm:px-4 py-2">
          
          {/* Left Vertical Skyscraper Ad in Peach */}
          <AdBanner variant="side-left" className="hidden 2xl:flex sticky top-20 self-start" />

          {/* Center Main Stage */}
          <main className="w-full max-w-6xl px-2 sm:px-4 py-2 flex-1">
            
            {/* View 1: When workspace is not active, stay on homepage with typing animation, dropzone, and pulsing parse button */}
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
                /* View 2: When user clicks Parse/Process, transition to the 2-Pane Workspace */
                <div id="workspace-section" className="my-6 animate-slide-up">
                  <Workspace
                    file={uploadedFile}
                    parsedReq={parsedReq}
                    onReplaceFile={handleReset}
                  />
                </div>
              )
            )}

            {/* Below workspace / dropzone peach leaderboard */}
            <AdBanner variant="bottom" />
          </main>

          {/* Right Vertical Skyscraper Ad (either side) */}
          <AdBanner variant="side-right" className="hidden 2xl:flex sticky top-20 self-start" />

        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
