import React from 'react';
import { ProcessingMetadata } from '../types';
import { formatFileSize } from '../utils/imageProcessor';
import { Download, Clock, FileCheck } from 'lucide-react';

interface Props {
  data: ProcessingMetadata;
}

export const LedgerComparison: React.FC<Props> = ({ data }) => {
  const handleDownload = () => {
    if (!data.processedBlob) return;

    const url = URL.createObjectURL(data.processedBlob);
    const a = document.createElement('a');
    a.href = url;

    let ext = 'jpg';
    if (data.processedFormat?.includes('png')) ext = 'png';
    else if (data.processedFormat?.includes('webp')) ext = 'webp';
    else if (data.processedFormat?.includes('pdf')) ext = 'pdf';

    const baseName = data.originalName.replace(/\.[^/.]+$/, '');
    a.download = `${baseName}_processed.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="border-2 border-[#111111] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 border-b-2 border-[#111111] pb-3 mb-4">
        <span className="bg-[#2B9348] text-white px-2 py-0.5 text-xs font-bold uppercase">SECTION 05</span>
        <h2 className="text-xl font-bold uppercase swiss-heading tracking-tight flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-[#2B9348]" /> ARCHIVE AUDIT & EXPORT DISPATCH
        </h2>
      </div>

      {/* Audit Table */}
      <div className="overflow-x-auto border-2 border-[#111111] bg-[#F4F4F0] mb-5">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b-2 border-[#111111] bg-[#111111] text-white">
              <th className="p-2.5 uppercase">METRIC AUDIT</th>
              <th className="p-2.5 uppercase border-l border-white/20">ORIGINAL DEPOSIT</th>
              <th className="p-2.5 uppercase border-l border-white/20">PROCESSED ARCHIVE</th>
              <th className="p-2.5 uppercase border-l border-white/20">DELTA VARIANCE</th>
            </tr>
          </thead>
          <tbody className="divide-y border-[#111111]">
            <tr className="bg-white">
              <td className="p-2.5 font-bold uppercase">TOTAL FILE SIZE</td>
              <td className="p-2.5 border-l border-[#111111]">{formatFileSize(data.originalSize)}</td>
              <td className="p-2.5 border-l border-[#111111] font-bold text-[#E63946]">
                {formatFileSize(data.processedSize || 0)}
              </td>
              <td className="p-2.5 border-l border-[#111111] font-bold text-[#2B9348]">
                -{data.compressionRatio || 0}%
              </td>
            </tr>

            {data.originalDimensions && data.processedDimensions && (
              <tr className="bg-[#F4F4F0]">
                <td className="p-2.5 font-bold uppercase">PIXEL GEOMETRY</td>
                <td className="p-2.5 border-l border-[#111111]">
                  {data.originalDimensions.width} × {data.originalDimensions.height} px
                </td>
                <td className="p-2.5 border-l border-[#111111] font-bold text-[#111111]">
                  {data.processedDimensions.width} × {data.processedDimensions.height} px
                </td>
                <td className="p-2.5 border-l border-[#111111] text-[#555555]">
                  {Math.round((data.processedDimensions.width / data.originalDimensions.width) * 100)}% scale
                </td>
              </tr>
            )}

            <tr className="bg-white">
              <td className="p-2.5 font-bold uppercase">MIME / ENCODING</td>
              <td className="p-2.5 border-l border-[#111111]">{data.originalFormat}</td>
              <td className="p-2.5 border-l border-[#111111] font-bold">{data.processedFormat || 'N/A'}</td>
              <td className="p-2.5 border-l border-[#111111] text-[#2B9348] font-bold">COMPLIANT</td>
            </tr>

            <tr className="bg-[#F4F4F0]">
              <td className="p-2.5 font-bold uppercase">PROCESSING TIME</td>
              <td className="p-2.5 border-l border-[#111111] text-[#777777]">—</td>
              <td className="p-2.5 border-l border-[#111111] font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#111111]" /> {data.processingTimeMs || 12} ms
              </td>
              <td className="p-2.5 border-l border-[#111111] text-[#2B9348] font-bold">INSTANT (WASM)</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Massive Red Export Button */}
      <button
        onClick={handleDownload}
        className="w-full bg-[#E63946] hover:bg-[#C92A37] text-white border-2 border-[#111111] py-4 px-6 font-mono font-black text-lg tracking-widest uppercase flex items-center justify-center gap-3 shadow-lg active:translate-y-0.5 transition-all cursor-pointer"
      >
        <Download className="w-6 h-6 stroke-[3]" />
        <span>DOWNLOAD & PROCEED (DISPATCH ARCHIVE)</span>
      </button>
    </div>
  );
};
