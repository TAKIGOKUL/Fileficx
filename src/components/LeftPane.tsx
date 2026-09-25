import React from 'react';
import { RefreshCw } from 'lucide-react';
import { formatFileSize } from '../utils/imageProcessor';

interface LeftPaneProps {
  file: File;
  previewUrl: string | null;
  dimensions?: { width: number; height: number };
  dpi?: number;
  colorMode?: string;
  pageCount?: number;
  onReplaceFile: () => void;
}

export const LeftPane: React.FC<LeftPaneProps> = ({
  file,
  previewUrl,
  dimensions,
  dpi = 72,
  colorMode = 'RGB',
  pageCount,
  onReplaceFile
}) => {
  const isPDF = file.type.includes('pdf');
  const extension = file.name.split('.').pop()?.toUpperCase() || (isPDF ? 'PDF' : 'IMG');

  return (
    <div className="hero-card p-5 flex flex-col justify-between h-full">
      <div>
        {/* Header: File Name & Type Badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="overflow-hidden">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent)] block mb-1">
              PANE 1 · ORIGINAL FILE PREVIEW
            </span>
            <h3 className="font-bold text-base text-[var(--text-primary)] truncate" title={file.name}>
              {file.name}
            </h3>
          </div>
          <span className="px-2.5 py-1 rounded-md text-xs font-bold tracking-wider uppercase bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30 shrink-0">
            {extension}
          </span>
        </div>

        {/* Thumbnail Preview */}
        <div className="w-full h-56 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)]/60 flex items-center justify-center overflow-hidden mb-5 relative group">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Original File Preview"
              className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center gap-2.5 text-[var(--text-muted)] py-6">
              <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] flex items-center justify-center p-1 animate-logo-pulse">
                <img 
                  src="/logo.png" 
                  alt="Loading Fileficx" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <span className="text-xs font-semibold text-[var(--text-primary)]">Reading & analyzing file...</span>
            </div>
          )}

          {isPDF && pageCount && (
            <span className="absolute bottom-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/75 text-white backdrop-blur-sm">
              Page 1 of {pageCount}
            </span>
          )}
        </div>

        {/* Technical Ledger Specification Details */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-primary)]/50 divide-y divide-[var(--border)] text-xs mb-5 font-sans">
          <div className="flex items-center justify-between py-2 px-3">
            <span className="text-[var(--text-muted)]">Dimensions</span>
            <span className="font-semibold text-[var(--text-primary)] font-mono">
              {dimensions ? `${dimensions.width} × ${dimensions.height} px` : 'Analyzing...'}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 px-3">
            <span className="text-[var(--text-muted)]">File Size</span>
            <span className="font-semibold text-[var(--text-primary)] font-mono">
              {formatFileSize(file.size)}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 px-3">
            <span className="text-[var(--text-muted)]">DPI / Resolution</span>
            <span className="font-semibold text-[var(--text-primary)] font-mono">
              {dpi} DPI
            </span>
          </div>

          <div className="flex items-center justify-between py-2 px-3">
            <span className="text-[var(--text-muted)]">Color Mode</span>
            <span className="font-semibold text-[var(--text-primary)] font-mono">
              {colorMode}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 px-3">
            <span className="text-[var(--text-muted)]">Pages</span>
            <span className="font-semibold text-[var(--text-primary)] font-mono">
              {isPDF && pageCount ? `${pageCount} Pages` : '— (Images only)'}
            </span>
          </div>
        </div>
      </div>

      {/* Replace File Button */}
      <button
        onClick={onReplaceFile}
        className="btn btn-outline w-full py-2.5 text-xs flex items-center justify-center gap-2 border-[var(--border-subtle)] hover:border-[var(--accent)] hover:bg-[var(--accent-subtle)] cursor-pointer transition-all"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span className="font-semibold">Replace File</span>
      </button>
    </div>
  );
};
