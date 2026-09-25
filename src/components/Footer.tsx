import React, { useState } from 'react';
import { X } from 'lucide-react';

export const Footer: React.FC = () => {
  const [modalType, setModalType] = useState<'privacy' | 'terms' | 'guide' | null>(null);

  return (
    <footer className="w-full border-t border-[var(--border-subtle)] pt-6 pb-8 text-xs text-[var(--text-muted)] mt-12 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        
        {/* Left disclaimer */}
        <div>
          © {new Date().getFullYear()} Fileficx — Built securely with WebAssembly. No files are uploaded to any server.
        </div>

        {/* Right navigation links */}
        <div className="flex items-center gap-6 text-xs">
          <button
            onClick={() => setModalType('guide')}
            className="hover:text-[var(--accent)] transition-colors underline cursor-pointer"
          >
            How to resize for Govt. Portals
          </button>
          <button
            onClick={() => setModalType('privacy')}
            className="hover:text-[var(--accent)] transition-colors underline cursor-pointer"
          >
            Privacy Sandbox
          </button>
          <button
            onClick={() => setModalType('terms')}
            className="hover:text-[var(--accent)] transition-colors underline cursor-pointer"
          >
            Terms
          </button>
        </div>

      </div>

      {/* Compliance / Guide Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 relative shadow-2xl">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-[var(--text-primary)] p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {modalType === 'guide' && (
              <div className="space-y-4 text-xs text-[var(--text-primary)]">
                <h3 className="text-lg font-bold text-[var(--accent)]">How to resize for Indian Govt. Portals</h3>
                <p>
                  Most Indian government examination portals (SSC, UPSC, IBPS, NTA NEET/JEE, State PSCs) enforce strict dimensional and file size limits:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong>Photograph</strong>: Usually 20KB to 50KB, 200×230 pixels, JPG format on a white background.</li>
                  <li><strong>Signature</strong>: Usually 10KB to 20KB, 140×60 pixels, in black ink on white paper (grayscale or B&W).</li>
                  <li><strong>Certificates / ID Proofs</strong>: Standard PDF format under 300KB or 500KB.</li>
                </ul>
                <p>
                  Fileficx automatically scales, compresses, and normalizes DPI in your browser's RAM, ensuring your files pass portal verification checks without blurry artifacts.
                </p>
              </div>
            )}

            {modalType === 'privacy' && (
              <div className="space-y-4 text-xs text-[var(--text-primary)]">
                <h3 className="text-lg font-bold text-[var(--accent)]">Privacy Sandbox & Data Security</h3>
                <p>
                  Fileficx uses the modern W3C Privacy Sandbox philosophy: <strong>Zero Server Transmission</strong>.
                </p>
                <p>
                  Your passport photographs, personal signatures, certificates, and resumes never leave your computer or phone. Processing is accomplished locally via WebAssembly, HTML5 Canvas 2D, and PDF-Lib.
                </p>
                <p>
                  We do not retain cookies tracking personal documents or biometrics. Google AdSense ads are sandboxed per standard Google publisher policies.
                </p>
              </div>
            )}

            {modalType === 'terms' && (
              <div className="space-y-4 text-xs text-[var(--text-primary)]">
                <h3 className="text-lg font-bold text-[var(--accent)]">Terms of Service</h3>
                <p>
                  Fileficx is provided as a free public utility for students, job applicants, and citizens preparing application documents.
                </p>
                <p>
                  Users remain responsible for reviewing the official notification of their specific exam or visa authority to verify latest requirements before submission.
                </p>
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
