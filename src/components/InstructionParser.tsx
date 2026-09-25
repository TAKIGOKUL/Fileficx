import React, { useState } from 'react';
import { ParsedRequirement, PresetRequirement } from '../types';
import { parseInstructions, OFFICIAL_PRESETS } from '../utils/instructionParser';
import { Sparkles, CheckSquare, Bookmark } from 'lucide-react';

interface Props {
  onApplyRequirements: (req: ParsedRequirement) => void;
}

export const InstructionParser: React.FC<Props> = ({ onApplyRequirements }) => {
  const [inputText, setInputText] = useState<string>('');
  const [parsed, setParsed] = useState<ParsedRequirement | null>(null);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  const handleParse = (textToParse: string) => {
    const result = parseInstructions(textToParse);
    setParsed(result);
    onApplyRequirements(result);
  };

  const handlePresetSelect = (preset: PresetRequirement) => {
    setActivePresetId(preset.id);
    setInputText(preset.sampleInstruction);
    handleParse(preset.sampleInstruction);
  };

  const handleManualInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputText(val);
    setActivePresetId(null);
    if (val.trim()) {
      const result = parseInstructions(val);
      setParsed(result);
      onApplyRequirements(result);
    } else {
      setParsed(null);
    }
  };

  return (
    <div className="border-2 border-[#111111] bg-white p-5 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b-2 border-[#111111] pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#E63946] text-white px-2 py-0.5 text-xs font-bold uppercase">SECTION 01</span>
            <h2 className="text-xl font-bold uppercase swiss-heading tracking-tight">
              THE "DROP & PARSE" INSTRUCTION ENGINE
            </h2>
          </div>
          <p className="text-xs text-[#666666] font-mono mt-1">
            Paste any application rules text below (e.g. US Visa, Passport, University Portal photo & PDF specs).
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-[#111111]" />
          <span className="text-xs font-bold uppercase font-mono">QUICK PRESETS:</span>
        </div>
      </div>

      {/* Quick Preset Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-4">
        {OFFICIAL_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => handlePresetSelect(preset)}
            className={`border-2 border-[#111111] p-2 text-left text-xs font-mono transition-colors ${
              activePresetId === preset.id
                ? 'bg-[#111111] text-white'
                : 'bg-[#F4F4F0] hover:bg-[#E8E8E2] text-[#111111]'
            }`}
          >
            <div className="font-bold truncate">{preset.title}</div>
            <div className="text-[10px] opacity-75 mt-0.5">
              {preset.targetFormat} • {preset.maxSizeKB ? `≤${preset.maxSizeKB}KB` : ''}
            </div>
          </button>
        ))}
      </div>

      {/* Text Area */}
      <div className="relative">
        <textarea
          rows={4}
          value={inputText}
          onChange={handleManualInput}
          placeholder="Paste official instructions here... (e.g., 'Upload a JPG photograph exactly 3.5cm x 4.5cm, file size between 20KB and 50KB. White background required.')"
          className="w-full border-2 border-[#111111] bg-[#F4F4F0] p-3 text-sm font-mono text-[#111111] placeholder:text-[#888888] focus:outline-none focus:border-[#E63946] focus:bg-white resize-none"
        />

        {inputText && (
          <button
            onClick={() => {
              setInputText('');
              setParsed(null);
              setActivePresetId(null);
            }}
            className="absolute top-3 right-3 text-xs bg-[#111111] text-white px-2 py-1 font-mono uppercase hover:bg-[#E63946]"
          >
            CLEAR
          </button>
        )}
      </div>

      {/* Extracted Specifications Card */}
      {parsed && parsed.detectedRules.length > 0 && (
        <div className="mt-4 border-2 border-[#111111] bg-[#F4F4F0] p-4">
          <div className="flex items-center justify-between border-b border-[#111111] pb-2 mb-3">
            <span className="text-xs font-bold font-mono uppercase flex items-center gap-1.5 text-[#111111]">
              <Sparkles className="w-3.5 h-3.5 text-[#E63946]" /> EXTRACTED OFFICIAL SPECIFICATIONS:
            </span>
            <span className="bg-[#2B9348] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
              PARSER ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="border-2 border-[#111111] bg-white p-2.5">
              <span className="text-[10px] font-mono text-[#777777] uppercase block">TARGET FORMAT</span>
              <span className="text-base font-bold font-mono text-[#111111]">
                {parsed.targetFormat || 'AUTO-DETECT'}
              </span>
            </div>

            <div className="border-2 border-[#111111] bg-white p-2.5">
              <span className="text-[10px] font-mono text-[#777777] uppercase block">MAX FILE SIZE</span>
              <span className="text-base font-bold font-mono text-[#E63946]">
                {parsed.maxSizeKB ? `≤ ${parsed.maxSizeKB} KB` : 'NO LIMIT'}
              </span>
            </div>

            <div className="border-2 border-[#111111] bg-white p-2.5">
              <span className="text-[10px] font-mono text-[#777777] uppercase block">TARGET DIMENSIONS</span>
              <span className="text-base font-bold font-mono text-[#111111]">
                {parsed.width && parsed.height ? `${parsed.width}x${parsed.height} ${parsed.unit || 'px'}` : 'ORIGINAL'}
              </span>
            </div>

            <div className="border-2 border-[#111111] bg-white p-2.5">
              <span className="text-[10px] font-mono text-[#777777] uppercase block">ASPECT RATIO</span>
              <span className="text-base font-bold font-mono text-[#111111]">
                {parsed.aspectRatio || 'FREE'}
              </span>
            </div>
          </div>

          {/* List of rules */}
          <div className="mt-3 flex flex-wrap gap-2">
            {parsed.detectedRules.map((rule, idx) => (
              <span
                key={idx}
                className="border border-[#111111] bg-white px-2 py-1 text-xs font-mono text-[#111111] flex items-center gap-1"
              >
                <CheckSquare className="w-3 h-3 text-[#E63946]" /> {rule}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
