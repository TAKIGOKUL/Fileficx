import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, Trash2 } from 'lucide-react';
import { formatFileSize } from '../utils/imageProcessor';

interface Props {
  file: File | null;
  onFileSelect: (file: File | null) => void;
}

export const FileDropzone: React.FC<Props> = ({ file, onFileSelect }) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="border-2 border-[#111111] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 border-b-2 border-[#111111] pb-3 mb-4">
        <span className="bg-[#111111] text-white px-2 py-0.5 text-xs font-bold uppercase">SECTION 02</span>
        <h2 className="text-xl font-bold uppercase swiss-heading tracking-tight">
          DOCUMENT & IMAGE DEPOSIT BOX
        </h2>
      </div>

      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-[#E63946] bg-[#FFF0F1]'
              : 'border-[#111111] bg-[#F4F4F0] hover:bg-[#EAEAE4]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileInput}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center gap-2">
            <UploadCloud className="w-10 h-10 text-[#111111]" />
            <div className="text-sm font-bold uppercase font-mono tracking-wide mt-1">
              CLICK OR DRAG & DROP FILE HERE
            </div>
            <p className="text-xs text-[#666666] font-mono max-w-sm">
              Supports JPG, PNG, WEBP & PDF documents. All processing is 100% browser-side (offline capable).
            </p>
          </div>
        </div>
      ) : (
        <div className="border-2 border-[#111111] bg-[#F4F4F0] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 border-2 border-[#111111] bg-white flex items-center justify-center shrink-0">
              {file.type.includes('pdf') ? (
                <FileText className="w-6 h-6 text-[#E63946]" />
              ) : (
                <ImageIcon className="w-6 h-6 text-[#111111]" />
              )}
            </div>

            <div>
              <div className="text-sm font-bold font-mono text-[#111111] truncate max-w-md">
                {file.name}
              </div>
              <div className="text-xs text-[#666666] font-mono mt-0.5">
                Format: <span className="font-bold text-[#111111]">{file.type || 'DOCUMENT'}</span> • Original Size:{' '}
                <span className="font-bold text-[#111111]">{formatFileSize(file.size)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-[#111111] bg-white hover:bg-[#EAEAE4] text-xs font-mono font-bold px-3 py-2 uppercase"
            >
              Change File
            </button>
            <button
              onClick={() => onFileSelect(null)}
              className="border-2 border-[#111111] bg-[#E63946] hover:bg-[#C92A37] text-white text-xs font-mono font-bold px-3 py-2 uppercase flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remove
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        </div>
      )}
    </div>
  );
};
