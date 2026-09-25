import React, { useState, useEffect } from 'react';
import {
  Zap,
  Download,
  Copy,
  Check,
  Lock,
  Unlock,
  FileCheck2,
  Sliders,
  Sparkles
} from 'lucide-react';
import {
  SupportedFormat,
  ResizeMode,
  ImageProcessingConfig,
  ProcessingMetadata,
  ParsedRequirement
} from '../types';
import { FileSizeIntelligence } from './FileSizeIntelligence';
import { AdBanner } from './AdBanner';

interface RightPaneProps {
  originalFile: File;
  originalDimensions?: { width: number; height: number };
  parsedReq: ParsedRequirement | null;
  processingMetadata: ProcessingMetadata | null;
  isProcessing: boolean;
  onProcess: (config: ImageProcessingConfig) => Promise<void>;
}

export const RightPane: React.FC<RightPaneProps> = ({
  originalFile,
  originalDimensions,
  parsedReq,
  processingMetadata,
  isProcessing,
  onProcess
}) => {
  // Form State
  const [targetFormat, setTargetFormat] = useState<SupportedFormat>('jpg');
  const [resizeMode, setResizeMode] = useState<ResizeMode>('pixels');
  const [exactWidth, setExactWidth] = useState<number>(200);
  const [exactHeight, setExactHeight] = useState<number>(230);
  const [aspectLocked, setAspectLocked] = useState<boolean>(true);
  const [scalePercent, setScalePercent] = useState<number>(100);
  const [longestSide, setLongestSide] = useState<number>(800);
  const [shortestSide, setShortestSide] = useState<number>(600);
  const [aspectRatioPreset, setAspectRatioPreset] = useState<'free' | '1:1' | '3.5:4.5' | '2:2' | '4:3' | '16:9' | '3:4' | '2:3'>('free');
  const [targetSizeKB, setTargetSizeKB] = useState<number | undefined>(50);
  const [quality, setQuality] = useState<number>(85);
  const [dpi, setDpi] = useState<number>(200);
  const [colorMode, setColorMode] = useState<'rgb' | 'grayscale' | 'bw'>('rgb');
  const [backgroundFill, setBackgroundFill] = useState<string>('#FFFFFF');

  const [hasCopied, setHasCopied] = useState<boolean>(false);
  const [highlightKey, setHighlightKey] = useState<number>(0);

  // Sync with original dimensions when loaded
  useEffect(() => {
    if (originalDimensions && !parsedReq?.width) {
      setExactWidth(originalDimensions.width);
      setExactHeight(originalDimensions.height);
      setLongestSide(Math.max(originalDimensions.width, originalDimensions.height));
      setShortestSide(Math.min(originalDimensions.width, originalDimensions.height));
    }
  }, [originalDimensions]);

  // Auto-fill from parsed requirements with animation flash
  useEffect(() => {
    if (parsedReq) {
      if (parsedReq.format) {
        setTargetFormat(parsedReq.format as SupportedFormat);
      }
      if (parsedReq.width && parsedReq.height) {
        setExactWidth(parsedReq.width);
        setExactHeight(parsedReq.height);
        setResizeMode('pixels');
      }
      if (parsedReq.maxSize) {
        setTargetSizeKB(parsedReq.maxSize);
      } else if (parsedReq.targetSize) {
        setTargetSizeKB(parsedReq.targetSize);
      }
      if (parsedReq.dpi) setDpi(parsedReq.dpi);
      if (parsedReq.colorMode) setColorMode(parsedReq.colorMode);
      if (parsedReq.background) setBackgroundFill(parsedReq.background);

      // Trigger stagger animation
      setHighlightKey((k) => k + 1);
    }
  }, [parsedReq]);

  // Dimension aspect lock handling
  const handleWidthChange = (val: number) => {
    setExactWidth(val);
    if (aspectLocked && originalDimensions && originalDimensions.width > 0) {
      const ratio = originalDimensions.height / originalDimensions.width;
      setExactHeight(Math.round(val * ratio));
    }
  };

  const handleHeightChange = (val: number) => {
    setExactHeight(val);
    if (aspectLocked && originalDimensions && originalDimensions.height > 0) {
      const ratio = originalDimensions.width / originalDimensions.height;
      setExactWidth(Math.round(val * ratio));
    }
  };

  const handleTriggerProcess = () => {
    const config: ImageProcessingConfig = {
      targetFormat,
      resizeMode,
      exactWidth,
      exactHeight,
      aspectLocked,
      scalePercent,
      longestSide,
      shortestSide,
      aspectRatioPreset,
      targetSizeKB,
      quality,
      dpi,
      colorMode,
      backgroundFill
    };
    onProcess(config);
  };

  // Direct download
  const handleDownload = () => {
    if (!processingMetadata?.processedBlob) return;
    const url = URL.createObjectURL(processingMetadata.processedBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = processingMetadata.downloadFilename || 'processed_file';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copy to clipboard for images
  const handleCopyToClipboard = async () => {
    if (!processingMetadata?.processedBlob) return;
    try {
      const pngBlob = processingMetadata.processedBlob.type === 'image/png'
        ? processingMetadata.processedBlob
        : await convertBlobToPng(processingMetadata.processedBlob);

      const item = new ClipboardItem({ 'image/png': pngBlob });
      await navigator.clipboard.write([item]);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  };

  const convertBlobToPng = (blob: Blob): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(blob);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Canvas blob failed'))), 'image/png');
        } else {
          reject(new Error('Canvas context failed'));
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Image load failed'));
      };
      img.src = url;
    });
  };

  const showBgFill = targetFormat === 'jpg' || originalFile.type.includes('png');

  return (
    <div className="hero-card p-5 space-y-6">
      
      {/* Top Banner: Auto-filled notice */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent)] block mb-0.5">
            PANE 2 · MODIFIED FILE & LIVE OUTPUT PREVIEW
          </span>
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="font-bold text-sm text-[var(--text-primary)]">
              Controls & Live Target Configuration
            </h3>
          </div>
        </div>
        {parsedReq && (
          <span className="text-[11px] font-semibold text-[var(--accent)] flex items-center gap-1 bg-[var(--accent)]/10 px-2 py-0.5 rounded-full border border-[var(--accent)]/20 animate-pulse">
            <Sparkles className="w-3 h-3" /> Auto-filled from Instruction
          </span>
        )}
      </div>

      {/* Grid of Controls with stagger animations */}
      <div key={highlightKey} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        
        {/* Output Format */}
        <div className="stagger-1 animate-slide-up rounded-xl border border-[var(--border)] bg-[var(--bg-primary)]/40 p-3">
          <label className="text-[11px] font-semibold text-[var(--text-muted)] block mb-1.5 uppercase tracking-wide">
            Output Format
          </label>
          <select
            value={targetFormat}
            onChange={(e) => setTargetFormat(e.target.value as SupportedFormat)}
            className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-2 font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
          >
            <option value="jpg">JPG (JPEG standard for government portals)</option>
            <option value="png">PNG (Lossless / Transparent)</option>
            <option value="webp">WEBP (Modern Compressed Web)</option>
            <option value="pdf">PDF Document (Print & Document format)</option>
          </select>
        </div>

        {/* Resize Mode */}
        <div className="stagger-2 animate-slide-up rounded-xl border border-[var(--border)] bg-[var(--bg-primary)]/40 p-3">
          <label className="text-[11px] font-semibold text-[var(--text-muted)] block mb-1.5 uppercase tracking-wide">
            Resize Mode
          </label>
          <select
            value={resizeMode}
            onChange={(e) => setResizeMode(e.target.value as ResizeMode)}
            className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-2 font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
          >
            <option value="pixels">Exact Pixels (Width × Height)</option>
            <option value="percent">Percentage Scale (%)</option>
            <option value="longest">Fit Longest Side (px)</option>
            <option value="shortest">Fit Shortest Side (px)</option>
            <option value="ratio">Aspect Ratio Preset</option>
          </select>
        </div>

        {/* Dimensions or Mode Specific Inputs */}
        {resizeMode === 'pixels' && (
          <div className="stagger-3 animate-slide-up sm:col-span-2 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)]/40 p-3">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                Target Dimensions
              </label>
              <button
                type="button"
                onClick={() => setAspectLocked(!aspectLocked)}
                className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded border transition-colors ${
                  aspectLocked
                    ? 'bg-[var(--accent)]/15 text-[var(--accent)] border-[var(--accent)]/30'
                    : 'bg-transparent text-[var(--text-muted)] border-[var(--border)]'
                }`}
              >
                {aspectLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                <span>{aspectLocked ? 'Aspect Locked' : 'Aspect Free'}</span>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block mb-1">Width (px)</span>
                <input
                  type="number"
                  value={exactWidth}
                  onChange={(e) => handleWidthChange(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-2 font-mono font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block mb-1">Height (px)</span>
                <input
                  type="number"
                  value={exactHeight}
                  onChange={(e) => handleHeightChange(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-2 font-mono font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
            </div>
          </div>
        )}

        {resizeMode === 'percent' && (
          <div className="sm:col-span-2 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)]/40 p-3">
            <div className="flex justify-between mb-1">
              <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase">Scale Percentage</span>
              <span className="font-mono font-bold text-[var(--accent)]">{scalePercent}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              value={scalePercent}
              onChange={(e) => setScalePercent(parseInt(e.target.value, 10))}
              className="w-full accent-[var(--accent)] cursor-pointer"
            />
          </div>
        )}

        {resizeMode === 'longest' && (
          <div className="sm:col-span-2 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)]/40 p-3">
            <span className="text-[11px] font-semibold text-[var(--text-muted)] block mb-1.5 uppercase">Max Longest Side (px)</span>
            <input
              type="number"
              value={longestSide}
              onChange={(e) => setLongestSide(parseInt(e.target.value, 10) || 100)}
              className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-2 font-mono font-semibold text-[var(--text-primary)]"
            />
          </div>
        )}

        {resizeMode === 'ratio' && (
          <div className="sm:col-span-2 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)]/40 p-3">
            <span className="text-[11px] font-semibold text-[var(--text-muted)] block mb-1.5 uppercase">Aspect Ratio Preset</span>
            <select
              value={aspectRatioPreset}
              onChange={(e) => setAspectRatioPreset(e.target.value as any)}
              className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-2 font-semibold text-[var(--text-primary)]"
            >
              <option value="1:1">1:1 Square (UPSC / US Visa)</option>
              <option value="3.5:4.5">3.5:4.5 Standard Passport (Schengen / NEET)</option>
              <option value="3:4">3:4 Portrait</option>
              <option value="4:3">4:3 Landscape</option>
              <option value="16:9">16:9 Widescreen</option>
            </select>
          </div>
        )}

        {/* Target Size (KB) & Quality Slider */}
        <div className="stagger-4 animate-slide-up rounded-xl border border-[var(--border)] bg-[var(--bg-primary)]/40 p-3">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wide">
              Target Size (KB)
            </label>
            <span className="text-[10px] text-[var(--text-muted)] font-mono">Portal Limit</span>
          </div>
          <input
            type="number"
            value={targetSizeKB || ''}
            onChange={(e) => setTargetSizeKB(parseInt(e.target.value, 10) || undefined)}
            placeholder="e.g. 50"
            className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-2 font-mono font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>

        {/* DPI Input */}
        <div className="stagger-4 animate-slide-up rounded-xl border border-[var(--border)] bg-[var(--bg-primary)]/40 p-3">
          <label className="text-[11px] font-semibold text-[var(--text-muted)] block mb-1.5 uppercase tracking-wide">
            Resolution (DPI)
          </label>
          <input
            type="number"
            value={dpi}
            onChange={(e) => setDpi(parseInt(e.target.value, 10) || 200)}
            className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-2 font-mono font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>

        {/* Quality Slider */}
        <div className="sm:col-span-2 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)]/40 p-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase">
              Compression Quality
            </span>
            <span className="font-mono font-bold text-[var(--accent)]">{quality}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={quality}
            onChange={(e) => setQuality(parseInt(e.target.value, 10))}
            className="w-full accent-[var(--accent)] cursor-pointer"
          />
          <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">
            Auto-tuned if Target KB is specified
          </span>
        </div>

        {/* Color Mode */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-primary)]/40 p-3">
          <label className="text-[11px] font-semibold text-[var(--text-muted)] block mb-1.5 uppercase tracking-wide">
            Color Mode
          </label>
          <select
            value={colorMode}
            onChange={(e) => setColorMode(e.target.value as 'rgb' | 'grayscale' | 'bw')}
            className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-2 font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
          >
            <option value="rgb">RGB (Standard Full Color)</option>
            <option value="grayscale">Grayscale (Official Photo / Document)</option>
            <option value="bw">Black & White (Signature / Biometric)</option>
          </select>
        </div>

        {/* BG Fill (shown only for PNG->JPG or transparent) */}
        {showBgFill && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-primary)]/40 p-3">
            <label className="text-[11px] font-semibold text-[var(--text-muted)] block mb-1.5 uppercase tracking-wide">
              Background Fill (PNG→JPG)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={backgroundFill}
                onChange={(e) => setBackgroundFill(e.target.value)}
                className="w-8 h-8 rounded border border-[var(--border)] cursor-pointer p-0"
              />
              <span className="text-xs font-mono font-semibold text-[var(--text-primary)]">
                {backgroundFill.toUpperCase() === '#FFFFFF' ? '⬜ Pure White (#FFF)' : backgroundFill}
              </span>
            </div>
          </div>
        )}

      </div>

      {/* Output Preview Section */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
            <FileCheck2 className="w-4 h-4 text-[var(--success)]" />
            Output Preview & Size Intelligence
          </span>
          {processingMetadata?.downloadFilename && (
            <span className="text-[11px] font-mono text-[var(--text-muted)] truncate max-w-xs" title={processingMetadata.downloadFilename}>
              {processingMetadata.downloadFilename}
            </span>
          )}
        </div>

        {/* Processed Thumbnail / Preview / Loading State */}
        {isProcessing ? (
          <div className="w-full h-48 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)]/70 flex flex-col items-center justify-center gap-3 overflow-hidden relative animate-fadeIn">
            <div className="w-14 h-14 rounded-full overflow-hidden shadow-2xl border-2 border-[var(--accent)] bg-black flex items-center justify-center p-1 animate-logo-spin">
              <img
                src="/logo.png"
                alt="Processing File..."
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center space-y-0.5">
              <p className="text-xs font-bold text-[var(--text-primary)] animate-pulse">
                Optimizing & Resampling Document...
              </p>
              <p className="text-[11px] text-[var(--text-muted)] font-mono">
                Applying target constraints in browser RAM
              </p>
            </div>
          </div>
        ) : processingMetadata?.processedUrl ? (
          <div className="w-full h-48 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)]/40 flex items-center justify-center overflow-hidden relative">
            <img
              src={processingMetadata.processedUrl}
              alt="Processed Result"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ) : null}

        {/* File Size Intelligence Progress & Limits */}
        <FileSizeIntelligence
          originalSizeBytes={originalFile.size}
          processedSizeBytes={processingMetadata?.processedSize}
          limitKB={targetSizeKB}
        />

        {/* Actions Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
          
          {/* Process Button */}
          <button
            onClick={handleTriggerProcess}
            disabled={isProcessing}
            className={`btn btn-primary sm:col-span-1 w-full flex items-center justify-center gap-2 cursor-pointer ${
              isProcessing ? 'opacity-90 cursor-not-allowed' : ''
            }`}
          >
            {isProcessing ? (
              <>
                <img 
                  src="/logo.png" 
                  alt="Processing" 
                  className="w-4 h-4 rounded-sm animate-logo-spin inline-block" 
                />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>⚡ Process File</span>
              </>
            )}
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={!processingMetadata?.processedBlob || isProcessing}
            className="btn btn-secondary sm:col-span-1 w-full flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>↓ Download</span>
          </button>

          {/* Copy to Clipboard (for images) */}
          <button
            onClick={handleCopyToClipboard}
            disabled={!processingMetadata?.processedBlob || targetFormat === 'pdf' || isProcessing}
            className="btn btn-outline sm:col-span-1 w-full flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer"
            title="Copy processed image to clipboard"
          >
            {hasCopied ? (
              <>
                <Check className="w-4 h-4 text-[var(--success)]" />
                <span className="text-[var(--success)]">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Image</span>
              </>
            )}
          </button>

        </div>

      </div>

      {/* Right pane sidebar (300x250 medium rectangle) */}
      <AdBanner variant="sidebar" />

    </div>
  );
};
