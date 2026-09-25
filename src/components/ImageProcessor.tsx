import React, { useState, useEffect } from 'react';
import { ImageProcessingConfig, ParsedRequirement, ProcessingMetadata } from '../types';
import { processImage, getImageDimensions } from '../utils/imageProcessor';
import { convertUnitsToPixels } from '../utils/instructionParser';
import { Sliders, Crop, RefreshCw, Zap } from 'lucide-react';

interface Props {
  file: File;
  requirements: ParsedRequirement | null;
  onProcessed: (metadata: ProcessingMetadata) => void;
}

export const ImageProcessor: React.FC<Props> = ({ file, requirements, onProcessed }) => {
  const [config, setConfig] = useState<ImageProcessingConfig>({
    targetFormat: 'image/jpeg',
    targetMaxKB: undefined,
    exactWidth: undefined,
    exactHeight: undefined,
    scalePercent: 100,
    maintainAspectRatio: true,
    aspectRatioPreset: 'free',
    quality: 0.9,
    dpi: 300,
    rotation: 0,
    flipH: false,
    flipV: false,
    grayscale: false,
    contrast: 0,
    brightness: 0
  });

  const [naturalDims, setNaturalDims] = useState<{ width: number; height: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Load natural dimensions
  useEffect(() => {
    getImageDimensions(file).then((dims) => {
      setNaturalDims(dims);
    });
  }, [file]);

  // Apply parsed requirements automatically
  useEffect(() => {
    if (requirements) {
      setConfig((prev) => {
        const next = { ...prev };

        if (requirements.targetFormat === 'PNG') next.targetFormat = 'image/png';
        else if (requirements.targetFormat === 'WEBP') next.targetFormat = 'image/webp';
        else next.targetFormat = 'image/jpeg';

        if (requirements.maxSizeKB) {
          next.targetMaxKB = requirements.maxSizeKB;
        }

        if (requirements.width && requirements.height) {
          const unit = requirements.unit || 'px';
          const dpi = requirements.dpi || 300;
          next.exactWidth = convertUnitsToPixels(requirements.width, unit, dpi);
          next.exactHeight = convertUnitsToPixels(requirements.height, unit, dpi);
          next.maintainAspectRatio = false;
        }

        return next;
      });
    }
  }, [requirements]);

  const handleProcess = async () => {
    setIsProcessing(true);
    try {
      const result = await processImage(file, config);
      onProcessed(result);
    } catch (err) {
      alert(`Error processing image: ${err}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="border-2 border-[#111111] bg-white p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#111111] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="bg-[#111111] text-white px-2 py-0.5 text-xs font-bold uppercase">SECTION 03</span>
          <h2 className="text-xl font-bold uppercase swiss-heading tracking-tight">
            IMAGE SPECIFICATION STUDIO
          </h2>
        </div>

        {naturalDims && (
          <div className="text-xs font-mono bg-[#F4F4F0] border-2 border-[#111111] px-2.5 py-1">
            SOURCE: <span className="font-bold">{naturalDims.width} × {naturalDims.height} px</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Column 1: Target Compression */}
        <div className="border-2 border-[#111111] bg-[#F4F4F0] p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-[#111111] pb-2 mb-3">
              <Zap className="w-4 h-4 text-[#E63946]" />
              <h3 className="text-xs font-bold uppercase font-mono">01 // TARGET FILE SIZE LIMIT</h3>
            </div>

            <label className="text-xs font-mono text-[#555555] block mb-1 uppercase">
              MAX TARGET SIZE (KB):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="5"
                max="50000"
                value={config.targetMaxKB || ''}
                onChange={(e) =>
                  setConfig({ ...config, targetMaxKB: e.target.value ? parseInt(e.target.value, 10) : undefined })
                }
                placeholder="e.g. 50 (for Max 50KB)"
                className="w-full border-2 border-[#111111] bg-white p-2 text-sm font-mono font-bold text-[#111111] focus:outline-none focus:border-[#E63946]"
              />
              <span className="text-xs font-bold font-mono">KB</span>
            </div>

            <p className="text-[11px] text-[#666666] font-mono mt-2 leading-relaxed">
              Iterative binary-search compression algorithm adjusts quality automatically to fit right under your limit without losing clarity.
            </p>

            {/* Quick buttons */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {[20, 50, 100, 200, 300, 500].map((kb) => (
                <button
                  key={kb}
                  type="button"
                  onClick={() => setConfig({ ...config, targetMaxKB: kb })}
                  className={`text-[10px] font-mono px-2 py-1 border border-[#111111] ${
                    config.targetMaxKB === kb ? 'bg-[#E63946] text-white font-bold' : 'bg-white hover:bg-[#EAEAE4]'
                  }`}
                >
                  ≤{kb}KB
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#111111]">
            <label className="text-xs font-mono text-[#555555] block mb-1 uppercase">EXPORT FORMAT:</label>
            <div className="grid grid-cols-3 gap-1">
              {(['image/jpeg', 'image/png', 'image/webp'] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setConfig({ ...config, targetFormat: fmt })}
                  className={`text-xs font-mono py-1.5 border border-[#111111] uppercase font-bold ${
                    config.targetFormat === fmt ? 'bg-[#111111] text-white' : 'bg-white hover:bg-[#EAEAE4]'
                  }`}
                >
                  {fmt.split('/')[1]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: Dimensions & Crop */}
        <div className="border-2 border-[#111111] bg-[#F4F4F0] p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-[#111111] pb-2 mb-3">
              <Crop className="w-4 h-4 text-[#111111]" />
              <h3 className="text-xs font-bold uppercase font-mono">02 // DIMENSIONS & RATIOS</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs font-mono text-[#555555] block mb-1 uppercase">WIDTH (PX):</label>
                <input
                  type="number"
                  value={config.exactWidth || ''}
                  onChange={(e) =>
                    setConfig({ ...config, exactWidth: e.target.value ? parseInt(e.target.value, 10) : undefined })
                  }
                  placeholder={naturalDims ? `${naturalDims.width}` : 'px'}
                  className="w-full border-2 border-[#111111] bg-white p-2 text-sm font-mono font-bold focus:outline-none focus:border-[#E63946]"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#555555] block mb-1 uppercase">HEIGHT (PX):</label>
                <input
                  type="number"
                  value={config.exactHeight || ''}
                  onChange={(e) =>
                    setConfig({ ...config, exactHeight: e.target.value ? parseInt(e.target.value, 10) : undefined })
                  }
                  placeholder={naturalDims ? `${naturalDims.height}` : 'px'}
                  className="w-full border-2 border-[#111111] bg-white p-2 text-sm font-mono font-bold focus:outline-none focus:border-[#E63946]"
                />
              </div>
            </div>

            {/* Quick Passport/Visa Presets */}
            <label className="text-[11px] font-mono text-[#555555] block mb-1 uppercase">ASPECT RATIO PRESETS:</label>
            <div className="grid grid-cols-3 gap-1.5 mb-3">
              {[
                { label: 'Free', w: undefined, h: undefined },
                { label: '1:1 Square', w: 600, h: 600 },
                { label: '3.5x4.5cm', w: 413, h: 531 },
                { label: '4:3', w: 800, h: 600 },
                { label: '16:9', w: 1280, h: 720 },
                { label: 'Signature', w: 140, h: 60 }
              ].map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setConfig({
                      ...config,
                      exactWidth: p.w,
                      exactHeight: p.h,
                      maintainAspectRatio: !p.w
                    });
                  }}
                  className={`text-[10px] font-mono py-1 px-1.5 border border-[#111111] uppercase font-bold truncate ${
                    config.exactWidth === p.w && config.exactHeight === p.h
                      ? 'bg-[#111111] text-white'
                      : 'bg-white hover:bg-[#EAEAE4]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="aspect"
                checked={config.maintainAspectRatio}
                onChange={(e) => setConfig({ ...config, maintainAspectRatio: e.target.checked })}
                className="w-4 h-4 border-2 border-[#111111] accent-[#E63946]"
              />
              <label htmlFor="aspect" className="text-xs font-mono text-[#111111] cursor-pointer">
                Lock Aspect Ratio
              </label>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-[#111111]">
            <div className="flex justify-between text-xs font-mono text-[#555555] mb-1">
              <span>SCALE:</span>
              <span className="font-bold text-[#111111]">{config.scalePercent}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              value={config.scalePercent}
              onChange={(e) => setConfig({ ...config, scalePercent: parseInt(e.target.value, 10) })}
              className="w-full accent-[#111111] cursor-pointer"
            />
          </div>
        </div>

        {/* Column 3: Corrections & Transforms */}
        <div className="border-2 border-[#111111] bg-[#F4F4F0] p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-[#111111] pb-2 mb-3">
              <Sliders className="w-4 h-4 text-[#111111]" />
              <h3 className="text-xs font-bold uppercase font-mono">03 // ROTATION & FILTERS</h3>
            </div>

            {/* Rotation Controls */}
            <div className="grid grid-cols-4 gap-1 mb-4">
              {([0, 90, 180, 270] as const).map((deg) => (
                <button
                  key={deg}
                  type="button"
                  onClick={() => setConfig({ ...config, rotation: deg })}
                  className={`text-xs font-mono py-1.5 border border-[#111111] font-bold ${
                    config.rotation === deg ? 'bg-[#111111] text-white' : 'bg-white hover:bg-[#EAEAE4]'
                  }`}
                >
                  {deg}°
                </button>
              ))}
            </div>

            {/* Grayscale Checkbox */}
            <div className="border border-[#111111] bg-white p-3 mb-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold font-mono uppercase">BLACK & WHITE (GRAYSCALE)</div>
                  <div className="text-[10px] text-[#666666] font-mono">Ideal for signatures & IDs</div>
                </div>
                <input
                  type="checkbox"
                  checked={config.grayscale}
                  onChange={(e) => setConfig({ ...config, grayscale: e.target.checked })}
                  className="w-5 h-5 border-2 border-[#111111] accent-[#E63946]"
                />
              </div>
            </div>

            {/* Contrast Slider */}
            <div className="mb-2">
              <div className="flex justify-between text-xs font-mono text-[#555555] mb-1">
                <span>CONTRAST:</span>
                <span className="font-bold text-[#111111]">{config.contrast > 0 ? `+${config.contrast}` : config.contrast}</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={config.contrast}
                onChange={(e) => setConfig({ ...config, contrast: parseInt(e.target.value, 10) })}
                className="w-full accent-[#111111] cursor-pointer"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleProcess}
            disabled={isProcessing}
            className="w-full mt-4 bg-[#E63946] hover:bg-[#C92A37] text-white border-2 border-[#111111] py-3 px-4 font-mono font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> EXECUTING SPECIFICATIONS...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" /> APPLY & EXECUTE IMAGE RULES
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
