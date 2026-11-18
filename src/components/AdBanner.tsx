import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  variant?: 'top' | 'sidebar' | 'bottom' | 'side-left' | 'side-right';
  className?: string;
  client?: string;
  slot?: string;
}

const DEFAULT_CLIENT = 'ca-pub-2244853446692512';

/**
 * AdBanner Component
 * 
 * Compliant with Google AdSense Policies:
 * - Only mounts ins.adsbygoogle when a real, verified data-ad-slot is provided.
 * - Avoids rendering fake or dummy slot IDs that trigger AdSense policy violations.
 * - Does not render mock or simulated ad placeholders that obscure the screen.
 * - Relies on Google Auto Ads during initial site review.
 */
export const AdBanner: React.FC<AdBannerProps> = ({
  variant = 'bottom',
  className = '',
  client = DEFAULT_CLIENT,
  slot
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const isPushedRef = useRef(false);

  // Validate slot: ignore known dummy placeholders
  const isValidSlot = Boolean(
    slot &&
    slot.trim().length >= 8 &&
    !['1234567890', '0987654321', '1122334455', '5544332211', '6677889900'].includes(slot.trim())
  );

  useEffect(() => {
    if (!isValidSlot || isPushedRef.current) return;

    try {
      if (typeof window !== 'undefined') {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        isPushedRef.current = true;
      }
    } catch (err) {
      // Gracefully handle ad blocker or uninitialized adsbygoogle
    }
  }, [isValidSlot, slot]);

  // If no valid ad unit slot is configured, do not render broken or simulated ad containers.
  // Google Auto Ads will automatically place compliant ads when enabled in AdSense dashboard.
  if (!isValidSlot) {
    return null;
  }

  return (
    <div
      ref={adRef}
      className={`ad-slot-wrapper my-6 flex justify-center items-center overflow-hidden w-full max-w-4xl mx-auto ${className}`}
      data-ad-variant={variant}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdBanner;
