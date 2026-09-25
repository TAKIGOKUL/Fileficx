import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Zap, Asterisk } from 'lucide-react';
import { ParsedRequirement } from '../types';
import { parseInstructions } from '../utils/instructionParser';

interface HeroSectionProps {
  onParsed: (req: ParsedRequirement) => void;
  hasFile?: boolean;
  onProceedToWorkspace?: () => void;
}

const TYPING_PHRASES = [
  'Photo: JPG, max 50KB, 200x230px, 200 DPI, white background',
  'Signature: JPG, 10KB - 20KB, 140x60px, black ink on white paper',
  'Degree Certificate: PDF format, under 300KB, clean scan',
  'Passport Photo: 3.5 x 4.5 cm, white background, < 50KB'
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onParsed,
  hasFile = false,
  onProceedToWorkspace
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [isUserEditing, setIsUserEditing] = useState<boolean>(false);
  const [typedText, setTypedText] = useState<string>('');
  const [phraseIndex, setPhraseIndex] = useState<number>(0);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [lastParsed, setLastParsed] = useState<ParsedRequirement | null>(null);
  const [hasJustParsed, setHasJustParsed] = useState<boolean>(false);

  // Typewriter animation loop when user is not actively editing
  useEffect(() => {
    if (isUserEditing && inputText.length > 0) return;

    const currentPhrase = TYPING_PHRASES[phraseIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      if (typedText.length < currentPhrase.length) {
        timeout = setTimeout(() => {
          setTypedText(currentPhrase.slice(0, typedText.length + 1));
        }, 38);
      } else {
        // Finished typing phrase, wait before deleting
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    } else {
      if (typedText.length > 0) {
        timeout = setTimeout(() => {
          setTypedText(currentPhrase.slice(0, typedText.length - 1));
        }, 18);
      } else {
        // Finished deleting, move to next phrase
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % TYPING_PHRASES.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, phraseIndex, isUserEditing, inputText]);

  const handleParse = (textToParse?: string) => {
    const text = textToParse || inputText || typedText || TYPING_PHRASES[0];
    if (!text.trim()) return;

    const parsed = parseInstructions(text);
    setLastParsed(parsed);
    setHasJustParsed(true);
    onParsed(parsed);

    // If file is attached, proceed directly to workspace!
    if (hasFile && onProceedToWorkspace) {
      onProceedToWorkspace();
    } else {
      setTimeout(() => {
        setHasJustParsed(false);
      }, 1500);
    }
  };

  const displayedText = isUserEditing ? inputText : (inputText || typedText);

  return (
    <section className="w-full pt-8 pb-4 text-center">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Headlines */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[var(--text-primary)] mb-2 leading-tight">
          Make every file<br />
          <span className="text-[var(--accent)]">portal-ready.</span>
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-muted)] font-medium mb-6">
          Paste the requirement. Drop the file. Done.
        </p>

        {/* Instruction Card */}
        <div className="rounded-2xl border-2 border-[var(--accent)] bg-[var(--bg-card)] p-3.5 shadow-xl max-w-2xl mx-auto flex items-stretch gap-3 text-left">
          
          {/* Inner Pistachio-tinted textarea with interactive typing animation */}
          <div
            onClick={() => {
              if (!isUserEditing) {
                setIsUserEditing(true);
              }
            }}
            className="flex-1 rounded-xl bg-[var(--input-inner-bg)] border border-[var(--border-subtle)] p-2.5 relative cursor-text min-h-[64px]"
          >
            <textarea
              rows={2}
              value={displayedText}
              onChange={(e) => {
                setIsUserEditing(true);
                setInputText(e.target.value);
              }}
              onFocus={() => {
                setIsUserEditing(true);
              }}
              placeholder='e.g. "Photo: JPG, max 50KB, 200x230px"'
              className="w-full h-full bg-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)]/60 text-xs sm:text-sm font-semibold focus:outline-none resize-none font-sans leading-relaxed"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleParse();
                }
              }}
            />
            {!isUserEditing && (
              <span className="inline-block w-1.5 h-3.5 bg-[var(--accent)] ml-0.5 animate-pulse align-middle" />
            )}
          </div>

          {/* Parse Button — Idle: shimmer button; With File: rotating button with fixed text & icon and rotating side icons */}
          {hasFile ? (
            <div className="relative shrink-0 flex items-center justify-center">
              <div className="rotating-btn-wrapper animate-parse-ready shadow-xl">
                {/* Continuous rotating conic gradient border */}
                <div className="rotating-btn-border" />
                
                <button
                  type="button"
                  onClick={() => handleParse()}
                  className="rotating-btn-inner px-3 sm:px-4 py-2 text-white flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 hover:brightness-110"
                  title="Click to parse requirements & start processing your file"
                >
                  {/* Left rotating icon */}
                  <span className="flex items-center justify-center text-amber-300 animate-spin-conic shrink-0">
                    <Sparkles className="w-4 h-4 fill-current" />
                  </span>

                  {/* Fixed text and center icon */}
                  <div className="flex flex-col items-center justify-center leading-tight">
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <Zap className="w-4 h-4 fill-amber-300 text-amber-300 animate-pulse" />
                      <span className="text-xs sm:text-sm font-black tracking-wide">Process Now →</span>
                    </div>
                    <span className="text-[9px] font-bold text-white/90 uppercase tracking-widest">Click to start</span>
                  </div>

                  {/* Right rotating icon */}
                  <span className="flex items-center justify-center text-emerald-300 animate-spin-reverse shrink-0">
                    <Asterisk className="w-4 h-4" />
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => handleParse()}
              className={`rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white flex flex-col items-center justify-center gap-1 text-xs font-black shadow-md cursor-pointer transition-all active:scale-95 shrink-0 w-20 sm:w-24 shimmer-btn py-2 px-3 ${
                hasJustParsed ? 'bg-emerald-600 hover:bg-emerald-700' : ''
              }`}
              title="Parse instructions"
            >
              {hasJustParsed ? (
                <>
                  <CheckCircle2 className="w-5 h-5 animate-bounce" />
                  <span>Done</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 fill-current" />
                  <span>Parse</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Parsed Rules Chip List */}
        {lastParsed && lastParsed.detectedRules.length > 0 && (
          <div className="mt-3 max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-1.5 animate-fadeIn">
            {lastParsed.detectedRules.map((rule, idx) => (
              <span
                key={idx}
                className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[var(--bg-card)] text-[var(--accent)] border border-[var(--accent)]/30 shadow-xs"
              >
                ✓ {rule}
              </span>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
