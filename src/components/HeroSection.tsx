import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
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
          <span className="text-[var(--accent)]">application ready.</span>
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-muted)] font-medium mb-6">
          Paste the requirement. Drop the file. Done.
        </p>

        {/* Instruction Card */}
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3 shadow-lg max-w-2xl mx-auto flex items-stretch gap-3 text-left transition-all">
          
          {/* Inner textarea */}
          <div
            onClick={() => {
              setIsUserEditing(true);
            }}
            className="flex-1 rounded-xl bg-[var(--input-inner-bg)] border border-[var(--border-subtle)] p-2.5 relative cursor-text min-h-[68px] focus-within:border-[var(--accent)] transition-colors"
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
                if (!inputText && typedText) {
                  setInputText(typedText);
                }
              }}
              placeholder='Paste requirements (e.g. "Photo: JPG, max 50KB, 200x230px, 200 DPI")'
              className="w-full h-full bg-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)]/60 text-xs sm:text-sm font-semibold focus:outline-none resize-none font-sans leading-relaxed block"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleParse();
                }
              }}
            />
            {!isUserEditing && !inputText && (
              <span className="inline-block w-1.5 h-3.5 bg-[var(--accent)] ml-0.5 animate-pulse align-middle" />
            )}
          </div>

          {/* Action Button: Professional & Clean */}
          {hasFile ? (
            <button
              type="button"
              onClick={() => handleParse()}
              className="px-5 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200 shrink-0"
              title="Click to parse requirements & start processing your file"
            >
              <span>Process Now →</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleParse()}
              className={`rounded-xl px-4 py-2.5 bg-[var(--input-inner-bg)] hover:bg-[var(--accent-subtle)] text-[var(--text-primary)] hover:text-[var(--accent)] border border-[var(--border-subtle)] hover:border-[var(--accent)]/40 flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer transition-all duration-200 active:scale-95 shrink-0 ${
                hasJustParsed ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' : ''
              }`}
              title="Parse instructions"
            >
              {hasJustParsed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Parsed</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                  <span>Parse</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Quick Example Chips */}
        <div className="mt-2.5 max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-1.5 text-[11px]">
          <span className="text-[var(--text-muted)] text-[10px] font-semibold uppercase tracking-wider mr-1">Presets:</span>
          {TYPING_PHRASES.map((phrase, idx) => {
            const label = phrase.split(':')[0];
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setIsUserEditing(true);
                  setInputText(phrase);
                  handleParse(phrase);
                }}
                className="px-2.5 py-1 rounded-lg bg-[var(--input-inner-bg)]/80 hover:bg-[var(--accent-subtle)] text-[var(--text-muted)] hover:text-[var(--accent)] border border-[var(--border-subtle)] hover:border-[var(--accent)]/30 font-medium text-[11px] transition-colors cursor-pointer"
              >
                {label}
              </button>
            );
          })}
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
