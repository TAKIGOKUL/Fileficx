import React, { useEffect, useState } from 'react';
import { FileImage, FileText, RefreshCw, ShieldCheck } from 'lucide-react';
import { ParsedRequirement } from '../types';
import { getImageDimensions } from '../utils/imageProcessor';
import { getPDFInfoAndThumbnail } from '../utils/pdfProcessor';
import { formatFileSize } from '../utils/format';
import { ImageTool } from './workspace/ImageTool';
import { PdfTool } from './workspace/PdfTool';
import { DocxTool } from './workspace/DocxTool';

interface WorkspaceProps {
  file: File;
  parsedReq: ParsedRequirement | null;
  onReplaceFile: () => void;
  /** Open a different file directly in the workspace (e.g. a converted PDF) */
  onOpenFile?: (file: File) => void;
}

interface Info {
  width?: number;
  height?: number;
  colorMode?: string;
  dpi?: number;
  pageCount?: number;
  error?: string;
}

export const Workspace: React.FC<WorkspaceProps> = ({ file, parsedReq, onReplaceFile, onOpenFile }) => {
  const isPDF = file.type.includes('pdf') || /\.pdf$/i.test(file.name);
  const isDocx = /\.docx$/i.test(file.name) || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  const isLegacyDoc = !isDocx && (/\.doc$/i.test(file.name) || file.type === 'application/msword');
  const [info, setInfo] = useState<Info>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let url: string | null = null;
    setInfo({});

    if (isLegacyDoc) {
      setInfo({ error: 'Old Word files (.doc) aren’t supported. In Word, choose File → Save As → Word Document (.docx) or PDF, then try again.' });
    } else if (isDocx) {
      setPreviewUrl(null);
    } else if (isPDF) {
      getPDFInfoAndThumbnail(file)
        .then((r) => {
          url = r.thumbnailUrl;
          if (!active) return URL.revokeObjectURL(url);
          setPreviewUrl(url);
          setInfo({ width: r.width, height: r.height, pageCount: r.pageCount });
        })
        .catch(() => active && setInfo({ error: 'This PDF could not be opened. It may be damaged or password-protected.' }));
    } else {
      url = URL.createObjectURL(file);
      setPreviewUrl(url);
      getImageDimensions(file)
        .then((d) => active && setInfo(d))
        .catch((e) => active && setInfo({ error: e instanceof Error ? e.message : 'Could not read this image.' }));
    }

    return () => {
      active = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [file, isPDF, isDocx, isLegacyDoc]);

  const ext = file.name.split('.').pop()?.toUpperCase() || (isPDF ? 'PDF' : 'IMG');
  const meta = [
    formatFileSize(file.size),
    info.width && info.height ? (isPDF ? `${Math.round((info.width / 72) * 25.4)}×${Math.round((info.height / 72) * 25.4)} mm` : `${info.width}×${info.height} px`) : null,
    info.pageCount ? `${info.pageCount} page${info.pageCount === 1 ? '' : 's'}` : null,
    info.colorMode,
    info.dpi ? `${info.dpi} DPI` : null,
  ].filter(Boolean);

  return (
    <section className="w-full max-w-7xl mx-auto mb-12 animate-slide-up" aria-label="Workspace">
      {/* File bar */}
      <div className="hero-card !rounded-2xl px-4 py-3 mb-5 flex flex-wrap items-center gap-3">
        <span className="icon-tile !w-10 !h-10 overflow-hidden shrink-0">
          {previewUrl && !isPDF ? <img src={previewUrl} alt="" className="w-full h-full object-cover" /> : isPDF || isDocx ? <FileText className="w-5 h-5" /> : <FileImage className="w-5 h-5" />}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-[var(--text-primary)] truncate" title={file.name}>
              {file.name}
            </h2>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[var(--accent-subtle)] text-[var(--accent-text)]">{ext}</span>
          </div>
          <p className="text-[11.5px] font-mono text-[var(--text-muted)] truncate">{meta.join(' · ')}</p>
        </div>
        <span className="hidden md:inline-flex items-center gap-1.5 text-[11.5px] font-medium text-[var(--text-muted)]">
          <ShieldCheck className="w-4 h-4 text-[var(--success)]" /> Processed on this device
        </span>
        <button onClick={onReplaceFile} className="btn btn-outline text-xs !py-1.5 !px-3.5">
          <RefreshCw className="w-3.5 h-3.5" /> Replace file
        </button>
      </div>

      {info.error ? (
        <div role="alert" className="hero-card p-8 text-center">
          <p className="text-base font-bold text-[var(--text-primary)] mb-2">We couldn’t open this file</p>
          <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto mb-5">{info.error}</p>
          <button onClick={onReplaceFile} className="btn btn-primary">
            Choose another file
          </button>
        </div>
      ) : isDocx ? (
        <DocxTool file={file} onOpenFile={onOpenFile} onPageCount={(n) => setInfo({ pageCount: n })} />
      ) : isPDF ? (
        <PdfTool file={file} pageCount={info.pageCount} />
      ) : (
        <ImageTool file={file} originalUrl={previewUrl} parsedReq={parsedReq} />
      )}
    </section>
  );
};

export default Workspace;
