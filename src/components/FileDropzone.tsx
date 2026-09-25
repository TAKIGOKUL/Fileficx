import React, { useRef, useState } from 'react';
import { UploadCloud, CheckCircle2 } from 'lucide-react';
import { formatFileSize } from '../utils/imageProcessor';

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  currentFile: File | null;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFileSelect,
  currentFile
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      onFileSelect(droppedFile);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 my-6">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed border-[var(--dropzone-border)] bg-[var(--dropzone-bg)] py-10 px-8 text-center transition-all duration-200 shadow-sm ${
          isDragOver
            ? 'scale-[1.01] shadow-lg border-[var(--accent)] bg-[var(--accent-subtle)]/40'
            : 'hover:border-[var(--accent)] hover:shadow-md'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf,image/heic,.jpg,.jpeg,.png,.webp,.pdf,.heic"
          onChange={handleChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center">
          {/* Circular icon */}
          <div className="w-11 h-11 rounded-full bg-[var(--accent-subtle)] flex items-center justify-center text-[var(--accent)] mb-3 transition-transform duration-200">
            {currentFile ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            ) : (
              <UploadCloud className="w-5 h-5" />
            )}
          </div>

          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              {currentFile ? (
                <span className="flex flex-col items-center justify-center gap-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--input-inner-bg)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>File Attached:</span>
                    <span className="truncate max-w-[180px] sm:max-w-[260px] text-[var(--accent)]">{currentFile.name}</span>
                    <span className="text-[10px] text-[var(--text-muted)] font-normal">({formatFileSize(currentFile.size)})</span>
                  </span>
                  <span className="text-xs text-[var(--text-muted)] font-normal mt-0.5">
                    Click process above to start
                  </span>
                </span>
              ) : (
                'Drop files here or click to upload'
              )}
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-1 font-normal">
              Supported formats: JPG, PNG, WEBP, HEIC, PDF
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
