import React, { useEffect, useState } from 'react';

export const Section: React.FC<{ title: string; hint?: React.ReactNode; children: React.ReactNode; action?: React.ReactNode }> = ({
  title,
  hint,
  children,
  action,
}) => (
  <section className="py-5 first:pt-0 border-b border-[var(--border-subtle)] last:border-0">
    <div className="flex items-center justify-between gap-3 mb-3">
      <h3 className="text-[13px] font-bold text-[var(--text-primary)]">{title}</h3>
      {action}
    </div>
    {children}
    {hint && <p className="mt-2 text-[11.5px] text-[var(--text-muted)] leading-relaxed">{hint}</p>}
  </section>
);

interface SegmentedProps<T extends string | number> {
  value: T;
  options: { value: T; label: React.ReactNode; title?: string; disabled?: boolean }[];
  onChange: (v: T) => void;
  size?: 'sm' | 'md';
  ariaLabel: string;
}

export function Segmented<T extends string | number>({ value, options, onChange, size = 'md', ariaLabel }: SegmentedProps<T>) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="flex w-full p-1 gap-1 rounded-xl bg-[var(--input-inner-bg)] border border-[var(--border-subtle)]">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={active}
            title={o.title}
            disabled={o.disabled}
            onClick={() => onChange(o.value)}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              size === 'sm' ? 'px-2 py-1.5 text-[11.5px]' : 'px-2.5 py-2 text-xs'
            } ${
              active
                ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-sm ring-1 ring-[var(--border)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

interface NumInputProps {
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  label: string;
  suffix?: string;
  min?: number;
  max?: number;
  placeholder?: string;
  allowEmpty?: boolean;
}

/** Numeric input that lets users clear and retype without the value snapping back mid-edit. */
export const NumInput: React.FC<NumInputProps> = ({ value, onChange, label, suffix, min = 0, max = 100000, placeholder, allowEmpty }) => {
  const [text, setText] = useState(value === undefined ? '' : String(value));

  useEffect(() => {
    // Keep what the user is typing unless the value was changed from outside
    setText((t) => (t === '' || Number(t) === value ? t : value === undefined ? '' : String(value)));
  }, [value]);

  const commit = (raw: string) => {
    if (raw.trim() === '') {
      if (allowEmpty) onChange(undefined);
      return;
    }
    const n = Number(raw);
    if (Number.isFinite(n) && n >= min && n <= max) onChange(Math.round(n));
  };

  return (
    <label className="block">
      <span className="block text-[11px] font-medium text-[var(--text-muted)] mb-1">{label}</span>
      <span className="flex items-center rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] focus-within:border-[var(--accent)] focus-within:ring-4 focus-within:ring-[var(--accent-subtle)] transition-all">
        <input
          inputMode="numeric"
          value={text}
          placeholder={placeholder}
          onChange={(e) => {
            const v = e.target.value.replace(/[^\d.]/g, '');
            setText(v);
            commit(v);
          }}
          onBlur={() => setText(value === undefined ? '' : String(value))}
          className="w-full min-w-0 bg-transparent px-3 py-2 font-mono text-sm font-semibold text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none !border-0"
          aria-label={label}
        />
        {suffix && <span className="pr-3 text-[11px] font-mono text-[var(--text-muted)]">{suffix}</span>}
      </span>
    </label>
  );
};

export const Chip: React.FC<{ active?: boolean; onClick: () => void; children: React.ReactNode; title?: string }> = ({ active, onClick, children, title }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={`px-2.5 py-1 rounded-lg text-[11.5px] font-mono font-semibold border transition-colors cursor-pointer ${
      active
        ? 'bg-[var(--accent-subtle)] border-[var(--accent-border)] text-[var(--accent-text)]'
        : 'bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-border)] hover:text-[var(--accent-text)]'
    }`}
  >
    {children}
  </button>
);

export const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void; label: string }> = ({ checked, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
      checked ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'
    }`}
  >
    <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
  </button>
);

export const Spinner: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
    <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);
