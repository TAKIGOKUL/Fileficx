import React, { useState } from 'react';
import {
  FileText,
  Minimize2,
  Scissors,
  Files,
  Image as ImageIcon,
  RotateCw,
  Trash2,
  Download,
  Loader2,
  Archive
} from 'lucide-react';
import { PDFProcessingConfig, ProcessingMetadata } from '../types';
import {
  processPDF,
  mergePDFs,
  renderPDFPagesToImages,
  createZipFromBlobs
} from '../utils/pdfProcessor';
import { FileSizeIntelligence } from './FileSizeIntelligence';
import { formatFileSize } from '../utils/imageProcessor';
import { AdBanner } from './AdBanner';

interface PDFStudioProps {
  file: File;
  pageCount?: number;
  onProcessed?: (data: ProcessingMetadata) => void;
}

export const PDFStudio: React.FC<PDFStudioProps> = ({
  file,
  pageCount = 1,
  onProcessed
}) => {
  const [activeTab, setActiveTab] = useState<
    'compress' | 'split' | 'merge' | 'pdf-to-images' | 'rotate' | 'remove'
  >('compress');

  const [targetSizeKB, setTargetSizeKB] = useState<number>(300);
  const [splitRange, setSplitRange] = useState<string>('1');
  const [removePages, setRemovePages] = useState<string>('');
  const [rotateAngle, setRotateAngle] = useState<90 | 180 | 270>(90);

  // Merge files state
  const [mergeFiles, setMergeFiles] = useState<File[]>([file]);

  // Image extraction state
  const [extractedImages, setExtractedImages] = useState<
    { pageIndex: number; blob: Blob; dataUrl: string }[]
  >([]);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [resultMetadata, setResultMetadata] = useState<ProcessingMetadata | null>(null);

  // Execute PDF operation
  const handleExecute = async () => {
    setIsProcessing(true);
    try {
      if (activeTab === 'merge') {
        const result = await mergePDFs(mergeFiles);
        setResultMetadata(result);
        if (onProcessed) onProcessed(result);
      } else if (activeTab === 'pdf-to-images') {
        const images = await renderPDFPagesToImages(file, 'jpg', 0.9);
        setExtractedImages(images);
      } else {
        const config: PDFProcessingConfig = {
          mode: activeTab,
          targetSizeKB: activeTab === 'compress' ? targetSizeKB : undefined,
          splitRange: activeTab === 'split' ? splitRange : undefined,
          removePages: activeTab === 'remove' ? removePages : undefined,
          rotateAngle: activeTab === 'rotate' ? rotateAngle : undefined
        };
        const result = await processPDF(file, config);
        setResultMetadata(result);
        if (onProcessed) onProcessed(result);
      }
    } catch (err) {
      console.error('PDF Studio error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Download ZIP of all pages
  const handleDownloadAllImagesZip = async () => {
    if (extractedImages.length === 0) return;
    const items = extractedImages.map((img) => ({
      filename: `page_${img.pageIndex}.jpg`,
      blob: img.blob
    }));
    const zipBlob = await createZipFromBlobs(items);
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `extracted_pages_${file.name.replace(/\.pdf$/i, '')}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadResult = () => {
    if (!resultMetadata?.processedBlob) return;
    const url = URL.createObjectURL(resultMetadata.processedBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = resultMetadata.downloadFilename || 'processed.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="hero-card p-5 space-y-5">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-[var(--accent)]" />
          <h3 className="font-bold text-base text-[var(--text-primary)]">
            PDF Processing Suite (pdf-lib & pdfjs-dist)
          </h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30">
          {pageCount} Page{pageCount > 1 ? 's' : ''} Loaded
        </span>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 text-xs">
        <button
          onClick={() => setActiveTab('compress')}
          className={`btn ${activeTab === 'compress' ? 'btn-primary' : 'btn-outline'} py-2 px-3 text-xs`}
        >
          <Minimize2 className="w-3.5 h-3.5" />
          <span>Compress PDF</span>
        </button>

        <button
          onClick={() => setActiveTab('split')}
          className={`btn ${activeTab === 'split' ? 'btn-primary' : 'btn-outline'} py-2 px-3 text-xs`}
        >
          <Scissors className="w-3.5 h-3.5" />
          <span>Split Pages</span>
        </button>

        <button
          onClick={() => setActiveTab('merge')}
          className={`btn ${activeTab === 'merge' ? 'btn-primary' : 'btn-outline'} py-2 px-3 text-xs`}
        >
          <Files className="w-3.5 h-3.5" />
          <span>Merge PDFs</span>
        </button>

        <button
          onClick={() => setActiveTab('pdf-to-images')}
          className={`btn ${activeTab === 'pdf-to-images' ? 'btn-primary' : 'btn-outline'} py-2 px-3 text-xs`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>PDF to Images</span>
        </button>

        <button
          onClick={() => setActiveTab('rotate')}
          className={`btn ${activeTab === 'rotate' ? 'btn-primary' : 'btn-outline'} py-2 px-3 text-xs`}
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Rotate</span>
        </button>

        <button
          onClick={() => setActiveTab('remove')}
          className={`btn ${activeTab === 'remove' ? 'btn-primary' : 'btn-outline'} py-2 px-3 text-xs`}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Remove Pages</span>
        </button>
      </div>

      {/* Tab Controls Content */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-primary)]/40 p-4">
        {activeTab === 'compress' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              PDF Compression Engine
            </h4>
            <p className="text-xs text-[var(--text-muted)]">
              Optimizes internal streams and fonts. If target size is strict, rasterizes to compressed high-fidelity JPEG sheets.
            </p>
            <div className="max-w-xs">
              <label className="text-[11px] font-semibold text-[var(--text-muted)] block mb-1">
                Target Max File Size (KB)
              </label>
              <input
                type="number"
                value={targetSizeKB}
                onChange={(e) => setTargetSizeKB(parseInt(e.target.value, 10) || 50)}
                placeholder="e.g. 300"
                className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-2 font-mono font-semibold text-xs text-[var(--text-primary)]"
              />
            </div>
          </div>
        )}

        {activeTab === 'split' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Extract Specific Page Range
            </h4>
            <p className="text-xs text-[var(--text-muted)]">
              Enter page numbers or ranges (e.g. "1-2, 4"). Total pages in document: {pageCount}.
            </p>
            <div className="max-w-xs">
              <input
                type="text"
                value={splitRange}
                onChange={(e) => setSplitRange(e.target.value)}
                placeholder="e.g. 1-3, 5"
                className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-2 font-mono font-semibold text-xs text-[var(--text-primary)]"
              />
            </div>
          </div>
        )}

        {activeTab === 'merge' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Merge Multiple PDF Documents
            </h4>
            <div className="space-y-2">
              {mergeFiles.map((mFile, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)]"
                >
                  <span className="truncate max-w-sm font-medium">{i + 1}. {mFile.name} ({formatFileSize(mFile.size)})</span>
                  {mergeFiles.length > 1 && (
                    <button
                      onClick={() => setMergeFiles(mergeFiles.filter((_, idx) => idx !== i))}
                      className="text-[var(--danger)] hover:underline text-[11px]"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            <label className="btn btn-outline text-xs py-1.5 px-3 cursor-pointer inline-flex">
              <span>+ Add More PDF Files</span>
              <input
                type="file"
                accept="application/pdf"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) {
                    setMergeFiles([...mergeFiles, ...Array.from(e.target.files)]);
                  }
                }}
              />
            </label>
          </div>
        )}

        {activeTab === 'pdf-to-images' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Render PDF Pages to JPG Images
            </h4>
            <p className="text-xs text-[var(--text-muted)]">
              Extract high-resolution JPG images of each page directly in your browser.
            </p>
          </div>
        )}

        {activeTab === 'rotate' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Rotate All Pages
            </h4>
            <div className="flex gap-2">
              {[90, 180, 270].map((deg) => (
                <button
                  key={deg}
                  onClick={() => setRotateAngle(deg as any)}
                  className={`btn ${rotateAngle === deg ? 'btn-primary' : 'btn-outline'} text-xs py-1.5 px-3`}
                >
                  Rotate {deg}°
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'remove' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Remove Specific Pages
            </h4>
            <p className="text-xs text-[var(--text-muted)]">
              Enter page numbers to remove (e.g. "2, 4").
            </p>
            <div className="max-w-xs">
              <input
                type="text"
                value={removePages}
                onChange={(e) => setRemovePages(e.target.value)}
                placeholder="e.g. 2, 4"
                className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-2 font-mono font-semibold text-xs text-[var(--text-primary)]"
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-4 pt-3 border-t border-[var(--border)]">
          <button
            onClick={handleExecute}
            disabled={isProcessing}
            className="btn btn-primary text-xs py-2 px-4 flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Processing PDF...</span>
              </>
            ) : (
              <>
                <FileText className="w-3.5 h-3.5" />
                <span>Execute {activeTab.toUpperCase()}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Extracted Images Preview (for pdf-to-images) */}
      {extractedImages.length > 0 && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-[var(--text-primary)]">
              Extracted Pages ({extractedImages.length})
            </span>
            <button
              onClick={handleDownloadAllImagesZip}
              className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Download All as ZIP</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-60 overflow-y-auto p-1">
            {extractedImages.map((img) => (
              <div key={img.pageIndex} className="border border-[var(--border)] rounded-lg p-2 bg-[var(--bg-primary)] text-center">
                <img src={img.dataUrl} alt={`Page ${img.pageIndex}`} className="h-28 w-full object-contain mx-auto mb-1 rounded" />
                <span className="text-[10px] text-[var(--text-muted)] block mb-1">Page {img.pageIndex}</span>
                <a
                  href={img.dataUrl}
                  download={`page_${img.pageIndex}.jpg`}
                  className="text-[10px] font-bold text-[var(--accent)] hover:underline inline-flex items-center gap-0.5"
                >
                  <Download className="w-2.5 h-2.5" /> Save JPG
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PDF Output & File Size Intelligence Result */}
      {resultMetadata && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 space-y-3">
          <FileSizeIntelligence
            originalSizeBytes={file.size}
            processedSizeBytes={resultMetadata.processedSize}
            limitKB={activeTab === 'compress' ? targetSizeKB : undefined}
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-mono text-[var(--text-muted)] truncate max-w-sm">
              {resultMetadata.downloadFilename}
            </span>
            <button
              onClick={handleDownloadResult}
              className="btn btn-primary text-xs py-2 px-4 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>↓ Download Result</span>
            </button>
          </div>
        </div>
      )}

      {/* Right pane sidebar (300x250 medium rectangle) */}
      <AdBanner variant="sidebar" />

    </div>
  );
};
