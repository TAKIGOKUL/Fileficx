import React, { useState, useEffect } from 'react';
import { LeftPane } from './LeftPane';
import { RightPane } from './RightPane';
import { PDFStudio } from './PDFStudio';
import {
  ParsedRequirement,
  ProcessingMetadata,
  ImageProcessingConfig
} from '../types';
import { getImageDimensions, processImage } from '../utils/imageProcessor';
import { getPDFInfoAndThumbnail } from '../utils/pdfProcessor';

interface WorkspaceProps {
  file: File;
  parsedReq: ParsedRequirement | null;
  onReplaceFile: () => void;
}

export const Workspace: React.FC<WorkspaceProps> = ({
  file,
  parsedReq,
  onReplaceFile
}) => {
  const isPDF = file.type.includes('pdf');

  // Preview & analysis state
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | undefined>(undefined);
  const [dpi, setDpi] = useState<number>(parsedReq?.dpi || 72);
  const [colorMode, setColorMode] = useState<string>('RGB');
  const [pageCount, setPageCount] = useState<number | undefined>(undefined);

  // Processing state
  const [processingMetadata, setProcessingMetadata] = useState<ProcessingMetadata | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Analyze file whenever file changes
  useEffect(() => {
    let active = true;

    async function analyze() {
      setProcessingMetadata(null);
      if (isPDF) {
        try {
          const info = await getPDFInfoAndThumbnail(file);
          if (active) {
            setPreviewUrl(info.thumbnailUrl);
            setDimensions({ width: info.width, height: info.height });
            setPageCount(info.pageCount);
            setColorMode('RGB Document');
            setDpi(150);
          }
        } catch (err) {
          console.error('Error analyzing PDF:', err);
        }
      } else {
        // Image file
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        try {
          const dims = await getImageDimensions(file);
          if (active) {
            setDimensions({ width: dims.width, height: dims.height });
            setColorMode(dims.colorMode);
            setDpi(parsedReq?.dpi || 72);
          }
        } catch (err) {
          console.error('Error analyzing image:', err);
        }
      }
    }

    analyze();

    return () => {
      active = false;
    };
  }, [file, isPDF, parsedReq?.dpi]);

  // Handle image processing execution
  const handleProcessImage = async (config: ImageProcessingConfig) => {
    setIsProcessing(true);
    try {
      const result = await processImage(file, config);
      setProcessingMetadata(result);
    } catch (err) {
      console.error('Image processing failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 mb-12 animate-slide-up">
      
      {/* Two-Pane Workspace Grid: Mobile single-col, Tablet 40/60, Desktop 50/50 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* LEFT PANE — Original File Preview & Ledger (Tablet: 40% ~ 5/12, Desktop: 50% ~ 6/12) */}
        <div className="w-full md:col-span-5 lg:col-span-6 h-full">
          <LeftPane
            file={file}
            previewUrl={previewUrl}
            dimensions={dimensions}
            dpi={dpi}
            colorMode={colorMode}
            pageCount={pageCount}
            onReplaceFile={onReplaceFile}
          />
        </div>

        {/* RIGHT PANE — Controls + Output / PDF Studio (Tablet: 60% ~ 7/12, Desktop: 50% ~ 6/12) */}
        <div className="w-full md:col-span-7 lg:col-span-6 space-y-6">
          {isPDF ? (
            <PDFStudio
              file={file}
              pageCount={pageCount}
              onProcessed={(meta) => setProcessingMetadata(meta)}
            />
          ) : (
            <RightPane
              originalFile={file}
              originalDimensions={dimensions}
              parsedReq={parsedReq}
              processingMetadata={processingMetadata}
              isProcessing={isProcessing}
              onProcess={handleProcessImage}
            />
          )}
        </div>

      </div>
    </section>
  );
};
