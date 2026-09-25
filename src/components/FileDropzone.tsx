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
        className={`relative cursor-pointer rounded-2xl sm:rounded-3xl border-2 border-dashed border-[var(--dropzone-border)] bg-[var(--dropzone-bg)] py-10 px-8 text-center transition-all duration-300 shadow-md ${
          isDragOver
            ? 'scale-[1.02] shadow-xl shadow-[var(--accent)]/30 bg-[var(--accent-subtle)]/40 border-[var(--accent)]'
            : 'animate-breathe hover:scale-[1.01]'
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
          {/* Lavender circular icon */}
          <div className="w-12 h-12 rounded-full bg-[var(--accent-subtle)] dark:bg-[var(--accent)]/25 flex items-center justify-center text-[var(--accent)] mb-3 transition-transform duration-300">
            {currentFile ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>

          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              {currentFile ? (
                <span className="flex flex-col items-center justify-center gap-1">
                  <span className="flex items-center gap-1.5 flex-wrap justify-center text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>File Attached:</span>
                    <span className="text-[var(--accent)] underline">{currentFile.name}</span>
                    <span className="text-xs font-normal text-[var(--text-muted)]">({formatFileSize(currentFile.size)})</span>
                  </span>
                  <span className="text-xs font-bold text-[var(--accent)] mt-1 animate-pulse">
                    ⚡ Ready! Click Process Now above to continue →
                  </span>
                </span>
              ) : (
                'Drop files here or click to upload'
              )}
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">
              Supported formats: JPG · PNG · WEBP · HEIC · PDF
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
