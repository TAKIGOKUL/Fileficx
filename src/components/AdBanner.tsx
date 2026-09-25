import React, { useEffect, useRef } from 'react';
import { Info } from 'lucide-react';

interface AdBannerProps {
  variant?: 'top' | 'sidebar' | 'bottom' | 'side-left' | 'side-right';
  className?: string;
  client?: string;
  slot?: string;
}

const DEFAULT_CLIENT = 'ca-pub-2244853446692512';

const SLOT_MAP = {
  'side-left': '1234567890',
  'side-right': '0987654321',
  'sidebar': '1122334455',
  'bottom': '5544332211',
  'top': '6677889900'
};

export const AdBanner: React.FC<AdBannerProps> = ({
  variant = 'bottom',
  className = '',
  client = DEFAULT_CLIENT,
  slot
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const adSlotId = slot || SLOT_MAP[variant];

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (err) {
      // Gracefully handle adblock or uninitialized adsbygoogle
    }
  }, [variant, slot]);

  if (variant === 'side-left' || variant === 'side-right') {
    const isLeft = variant === 'side-left';
    return (
      <aside
        ref={adRef}
        className={`ad-slot ${isLeft ? 'ad-side-left' : 'ad-side-right'} w-[160px] min-h-[600px] rounded-2xl bg-[var(--ad-peach-bg)] border border-[var(--ad-peach-border)] p-4 text-center my-6 shadow-sm flex flex-col items-center justify-center gap-3 shrink-0 relative overflow-hidden ${className}`}
        data-ad-slot={isLeft ? 'side-left' : 'side-right'}
        aria-label={`${isLeft ? 'Left' : 'Right'} Vertical Skyscraper Advertisement (160x600)`}
      >
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '160px', height: '600px' }}
          data-ad-client={client}
          data-ad-slot={adSlotId}
          data-ad-format="vertical"
          data-full-width-responsive="false"
        />
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-4 gap-3 bg-[var(--ad-peach-bg)] text-center border border-[var(--ad-peach-border)] rounded-2xl opacity-100 peer-data-[ad-status=filled]:opacity-0 transition-opacity">
          <div className="w-10 h-10 rounded-full bg-[var(--ad-peach-border)]/50 flex items-center justify-center text-[var(--ad-peach-text)]">
            <Info className="w-4 h-4" />
          </div>
          <div className="text-[10px] font-black text-[var(--ad-peach-text)] tracking-wider uppercase">
            SPONSORED
          </div>
          <div className="text-[10px] text-[var(--ad-peach-muted)] font-mono font-medium">
            160×600
          </div>
        </div>
      </aside>
    );
  }

  if (variant === 'top') {
    return (
      <div
        ref={adRef}
        className={`ad-slot ad-top w-full max-w-[728px] min-h-[90px] mx-auto rounded-2xl bg-[var(--ad-peach-bg)] border border-[var(--ad-peach-border)] p-3 text-center my-4 shadow-sm flex items-center justify-center relative overflow-hidden ${className}`}
        data-ad-slot="top-banner"
        aria-label="Top Leaderboard Advertisement (728x90)"
      >
        <ins
          className="adsbygoogle"
          style={{ display: 'inline-block', width: '728px', height: '90px' }}
          data-ad-client={client}
          data-ad-slot={adSlotId}
          data-ad-format="horizontal"
          data-full-width-responsive="true"
        />
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center gap-1.5 text-[11px] font-bold text-[var(--ad-peach-text)] tracking-wider uppercase bg-[var(--ad-peach-bg)] border border-[var(--ad-peach-border)] rounded-2xl">
          <Info className="w-3.5 h-3.5 text-[var(--ad-peach-text)]/80" />
          <span>SPONSORED ADVERTISEMENT</span>
          <span className="text-[10px] text-[var(--ad-peach-muted)] font-mono font-medium hidden sm:inline">(728×90 Leaderboard)</span>
        </div>
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div
        ref={adRef}
        className={`ad-slot ad-sidebar w-full max-w-[300px] min-h-[250px] mx-auto rounded-2xl bg-[var(--ad-peach-bg)] border border-[var(--ad-peach-border)] p-4 text-center my-4 shadow-sm flex flex-col items-center justify-center gap-2 relative overflow-hidden ${className}`}
        data-ad-slot="sidebar"
        aria-label="Sidebar Medium Rectangle Advertisement (300x250)"
      >
        <ins
          className="adsbygoogle"
          style={{ display: 'inline-block', width: '300px', height: '250px' }}
          data-ad-client={client}
          data-ad-slot={adSlotId}
          data-ad-format="rectangle"
          data-full-width-responsive="false"
        />
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center gap-2 p-4 bg-[var(--ad-peach-bg)] border border-[var(--ad-peach-border)] rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-[var(--ad-peach-border)]/50 flex items-center justify-center text-[var(--ad-peach-text)] mb-1">
            <Info className="w-5 h-5" />
          </div>
          <div className="text-[11px] font-black text-[var(--ad-peach-text)] tracking-wider uppercase">
            SPONSORED ADVERTISEMENT
          </div>
          <span className="text-[10px] text-[var(--ad-peach-muted)] font-mono font-medium">(300×250 Medium Rectangle)</span>
        </div>
      </div>
    );
  }

  // Default: Bottom Banner (728x90)
  return (
    <div
      ref={adRef}
      className={`ad-slot ad-bottom w-full max-w-[728px] min-h-[90px] mx-auto rounded-2xl bg-[var(--ad-peach-bg)] border border-[var(--ad-peach-border)] p-3 text-center my-6 shadow-sm flex items-center justify-center relative overflow-hidden ${className}`}
      data-ad-slot="bottom-banner"
      aria-label="Bottom Leaderboard Advertisement (728x90)"
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'inline-block', width: '728px', height: '90px' }}
        data-ad-client={client}
        data-ad-slot={adSlotId}
        data-ad-format="horizontal"
        data-full-width-responsive="true"
      />
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center gap-1.5 text-[11px] font-bold text-[var(--ad-peach-text)] tracking-wider uppercase bg-[var(--ad-peach-bg)] border border-[var(--ad-peach-border)] rounded-2xl">
        <Info className="w-3.5 h-3.5 text-[var(--ad-peach-text)]/80" />
        <span>SPONSORED ADVERTISEMENT</span>
        <span className="text-[10px] text-[var(--ad-peach-muted)] font-mono font-medium hidden sm:inline">(728×90 Leaderboard)</span>
      </div>
    </div>
  );
};

