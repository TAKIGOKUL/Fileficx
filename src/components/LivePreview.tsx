import React from 'react';
import { ProcessingMetadata } from '../types';
import { formatFileSize } from '../utils/imageProcessor';
import { Eye, FileText, CheckCircle2 } from 'lucide-react';

interface Props {
  originalFile: File;
  processedData: ProcessingMetadata | null;
}

export const LivePreview: React.FC<Props> = ({ originalFile, processedData }) => {
  const isPDF = originalFile.type.includes('pdf');
  const originalUrl = React.useMemo(() => URL.createObjectURL(originalFile), [originalFile]);
  const processedUrl = React.useMemo(() => {
    if (processedData?.processedBlob) {
      return URL.createObjectURL(processedData.processedBlob);
    }
    return null;
  }, [processedData]);

  return (
    <div className="border-2 border-[#111111] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 border-b-2 border-[#111111] pb-3 mb-4">
        <span className="bg-[#111111] text-white px-2 py-0.5 text-xs font-bold uppercase">SECTION 04</span>
        <h2 className="text-xl font-bold uppercase swiss-heading tracking-tight flex items-center gap-2">
          <Eye className="w-5 h-5 text-[#E63946]" /> SIDE-BY-SIDE LEDGER COMPARISON
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Original Deposit */}
        <div className="border-2 border-[#111111] bg-[#F4F4F0] p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#111111] pb-2 mb-3">
              <span className="text-xs font-mono font-bold uppercase text-[#555555]">ORIGINAL DEPOSIT</span>
              <span className="text-xs font-mono font-bold">{formatFileSize(originalFile.size)}</span>
            </div>

            <div className="w-full h-64 bg-white border-2 border-[#111111] flex items-center justify-center overflow-hidden p-2">
              {isPDF ? (
                <div className="text-center">
                  <FileText className="w-16 h-16 text-[#111111] mx-auto mb-2 opacity-75" />
                  <span className="text-xs font-mono font-bold">{originalFile.name}</span>
                </div>
              ) : (
                <img
                  src={originalUrl}
                  alt="Original"
                  className="max-h-full max-w-full object-contain"
                />
              )}
            </div>
          </div>

          <div className="mt-3 text-xs font-mono text-[#555555] bg-white border border-[#111111] p-2">
            <div>FILE: <span className="font-bold text-[#111111]">{originalFile.name}</span></div>
            {processedData?.originalDimensions && (
              <div>DIMENSIONS: <span className="font-bold text-[#111111]">{processedData.originalDimensions.width} × {processedData.originalDimensions.height} px</span></div>
            )}
          </div>
        </div>

        {/* Right: Processed Output */}
        <div className="border-2 border-[#111111] bg-[#F4F4F0] p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#111111] pb-2 mb-3">
              <span className="text-xs font-mono font-bold uppercase text-[#E63946] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> PROCESSED ARCHIVE
              </span>
              {processedData && (
                <span className="text-xs font-mono font-bold text-[#2B9348]">
                  {formatFileSize(processedData.processedSize || 0)}
                </span>
              )}
            </div>

            <div className="w-full h-64 bg-white border-2 border-[#111111] flex items-center justify-center overflow-hidden p-2">
              {processedData && processedUrl ? (
                isPDF ? (
                  <div className="text-center">
                    <FileText className="w-16 h-16 text-[#E63946] mx-auto mb-2" />
                    <span className="text-xs font-mono font-bold">PDF READY FOR EXPORT</span>
                  </div>
                ) : (
                  <img
                    src={processedUrl}
                    alt="Processed"
                    className="max-h-full max-w-full object-contain"
                  />
                )
              ) : (
                <div className="text-center text-xs font-mono text-[#888888] p-4">
                  [AWAITING EXECUTION FROM STUDIO ABOVE]
                </div>
              )}
            </div>
          </div>

          {processedData && (
            <div className="mt-3 text-xs font-mono text-[#111111] bg-white border border-[#111111] p-2">
              {processedData.processedDimensions && (
                <div>NEW DIMENSIONS: <span className="font-bold text-[#E63946]">{processedData.processedDimensions.width} × {processedData.processedDimensions.height} px</span></div>
              )}
              {processedData.compressionRatio !== undefined && (
                <div>SIZE DELTA: <span className="font-bold text-[#2B9348]">REDUCED BY {processedData.compressionRatio}%</span></div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
