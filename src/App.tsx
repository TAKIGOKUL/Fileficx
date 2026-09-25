import React, { useState } from 'react';
import { Header } from './components/Header';
import { InstructionParser } from './components/InstructionParser';
import { FileDropzone } from './components/FileDropzone';
import { ImageProcessor } from './components/ImageProcessor';
import { PDFProcessor } from './components/PDFProcessor';
import { LivePreview } from './components/LivePreview';
import { LedgerComparison } from './components/LedgerComparison';
import { ParsedRequirement, ProcessingMetadata } from './types';
import { Shield, Lock } from 'lucide-react';

export const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [requirements, setRequirements] = useState<ParsedRequirement | null>(null);
  const [processedData, setProcessedData] = useState<ProcessingMetadata | null>(null);

  const handleFileChange = (newFile: File | null) => {
    setFile(newFile);
    setProcessedData(null);
  };

  const isPDF = file && file.type.includes('pdf');

  return (
    <div className="min-h-screen bg-[#F4F4F0] text-[#111111] ledger-paper-grid flex flex-col justify-between">
      <div>
        <Header />

        <main className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
          {/* Section 1: The Instruction Parser */}
          <InstructionParser onApplyRequirements={(req) => setRequirements(req)} />

          {/* Section 2: Deposit Box */}
          <FileDropzone file={file} onFileSelect={handleFileChange} />

          {/* Section 3: Processing Studios */}
          {file && (
            <>
              {isPDF ? (
                <PDFProcessor file={file} onProcessed={(data) => setProcessedData(data)} />
              ) : (
                <ImageProcessor
                  file={file}
                  requirements={requirements}
                  onProcessed={(data) => setProcessedData(data)}
                />
              )}

              {/* Section 4: Live Ledger Preview */}
              <LivePreview originalFile={file} processedData={processedData} />

              {/* Section 5: Audit & Export Dispatch */}
              {processedData && <LedgerComparison data={processedData} />}
            </>
          )}
        </main>
      </div>

      {/* Brutalist Footer */}
      <footer className="border-t-2 border-[#111111] bg-white p-4 mt-12 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase tracking-wider">FILEFICX // ARCHIVE DIVISION</span>
            <span className="text-[#888888]">|</span>
            <span className="text-[#555555]">SWISS COMMON PAPER SPECIFICATION</span>
          </div>

          <div className="flex items-center gap-4 text-[#555555]">
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-[#2B9348]" /> NO SERVER UPLOADS
            </span>
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-[#111111]" /> ZERO LATENCY (WASM)
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
