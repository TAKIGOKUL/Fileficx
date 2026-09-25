import React, { useState } from 'react';
import { PDFProcessingConfig, ProcessingMetadata } from '../types';
import { processPDF, mergePDFs } from '../utils/pdfProcessor';
import { FileText, Layers, Scissors, Minimize2, RefreshCw, Upload } from 'lucide-react';

interface Props {
  file: File;
  onProcessed: (metadata: ProcessingMetadata) => void;
}

export const PDFProcessor: React.FC<Props> = ({ file, onProcessed }) => {
  const [config, setConfig] = useState<PDFProcessingConfig>({
    mode: 'compress',
    targetMaxKB: undefined,
    pageFormat: 'A4',
    splitRange: '1'
  });

  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleProcess = async () => {
    setIsProcessing(true);
    try {
      if (config.mode === 'merge') {
        const allFiles = [file, ...additionalFiles];
        const result = await mergePDFs(allFiles);
        onProcessed(result);
      } else {
        const result = await processPDF(file, config);
        onProcessed(result);
      }
    } catch (err) {
      alert(`Error processing PDF: ${err}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddMergeFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setAdditionalFiles([...additionalFiles, ...filesArray]);
    }
  };

  return (
    <div className="border-2 border-[#111111] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 border-b-2 border-[#111111] pb-3 mb-4">
        <span className="bg-[#111111] text-white px-2 py-0.5 text-xs font-bold uppercase">SECTION 03</span>
        <h2 className="text-xl font-bold uppercase swiss-heading tracking-tight">
          PDF MANIPULATION & COMPRESSION SUITE
        </h2>
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {[
          { id: 'compress', label: 'COMPRESS PDF', icon: Minimize2 },
          { id: 'resize', label: 'RESIZE PAGES', icon: FileText },
          { id: 'merge', label: 'MERGE MULTIPLE', icon: Layers },
          { id: 'split', label: 'SPLIT / EXTRACT', icon: Scissors }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = config.mode === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setConfig({ ...config, mode: tab.id as any })}
              className={`border-2 border-[#111111] p-3 text-left font-mono text-xs flex items-center gap-2 transition-colors ${
                isActive ? 'bg-[#111111] text-white font-bold' : 'bg-[#F4F4F0] hover:bg-[#EAEAE4] text-[#111111]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Specific Content */}
      <div className="border-2 border-[#111111] bg-[#F4F4F0] p-4">
        {config.mode === 'compress' && (
          <div>
            <h3 className="text-xs font-bold uppercase font-mono mb-2">PDF STREAM COMPRESSION</h3>
            <p className="text-xs text-[#666666] font-mono mb-3">
              Optimizes internal cross-reference streams and object dictionaries using WebAssembly.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold font-mono">TARGET LIMIT:</span>
              <div className="flex gap-2">
                {[300, 500, 1024, 2048].map((kb) => (
                  <button
                    key={kb}
                    type="button"
                    onClick={() => setConfig({ ...config, targetMaxKB: kb })}
                    className={`text-xs font-mono px-3 py-1 border border-[#111111] ${
                      config.targetMaxKB === kb ? 'bg-[#E63946] text-white font-bold' : 'bg-white'
                    }`}
                  >
                    ≤ {kb >= 1024 ? `${kb / 1024} MB` : `${kb} KB`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {config.mode === 'resize' && (
          <div>
            <h3 className="text-xs font-bold uppercase font-mono mb-2">RESIZE PDF PAGE DIMENSIONS</h3>
            <div className="grid grid-cols-3 gap-3">
              {(['A4', 'Letter', 'Legal'] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setConfig({ ...config, pageFormat: fmt })}
                  className={`border-2 border-[#111111] p-2.5 text-center font-mono text-xs font-bold ${
                    config.pageFormat === fmt ? 'bg-[#111111] text-white' : 'bg-white hover:bg-[#EAEAE4]'
                  }`}
                >
                  {fmt} {fmt === 'A4' ? '(210 × 297 mm)' : fmt === 'Letter' ? '(8.5 × 11 in)' : ''}
                </button>
              ))}
            </div>
          </div>
        )}

        {config.mode === 'merge' && (
          <div>
            <h3 className="text-xs font-bold uppercase font-mono mb-2">MERGE MULTIPLE PDF DOCUMENTS</h3>
            <p className="text-xs text-[#666666] font-mono mb-3">
              Add additional PDF files to append to <span className="font-bold text-[#111111]">{file.name}</span>.
            </p>

            <label className="border-2 border-dashed border-[#111111] bg-white p-3 text-center cursor-pointer block font-mono text-xs font-bold">
              <Upload className="w-4 h-4 inline mr-2 text-[#E63946]" /> CLICK TO ATTACH MORE PDFS
              <input type="file" accept="application/pdf" multiple onChange={handleAddMergeFiles} className="hidden" />
            </label>

            {additionalFiles.length > 0 && (
              <div className="mt-3 space-y-1">
                {additionalFiles.map((f, i) => (
                  <div key={i} className="text-xs font-mono bg-white border border-[#111111] px-2 py-1 flex justify-between">
                    <span>+ {f.name}</span>
                    <button
                      onClick={() => setAdditionalFiles(additionalFiles.filter((_, idx) => idx !== i))}
                      className="text-[#E63946] font-bold uppercase hover:underline"
                    >
                      [REMOVE]
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {config.mode === 'split' && (
          <div>
            <h3 className="text-xs font-bold uppercase font-mono mb-2">SPLIT / EXTRACT PAGE RANGE</h3>
            <label className="text-xs font-mono text-[#555555] block mb-1">PAGE NUMBERS (e.g. "1-2, 4"):</label>
            <input
              type="text"
              value={config.splitRange || ''}
              onChange={(e) => setConfig({ ...config, splitRange: e.target.value })}
              placeholder="e.g. 1-2, 4"
              className="w-full border-2 border-[#111111] bg-white p-2 font-mono text-sm font-bold focus:outline-none focus:border-[#E63946]"
            />
          </div>
        )}

        <button
          type="button"
          onClick={handleProcess}
          disabled={isProcessing}
          className="w-full mt-4 bg-[#E63946] hover:bg-[#C92A37] text-white border-2 border-[#111111] py-3 px-4 font-mono font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> EXECUTING PDF PROCESSING...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" /> PROCESS PDF DOCUMENT
            </>
          )}
        </button>
      </div>
    </div>
  );
};
