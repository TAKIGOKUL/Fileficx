/**
 * AdSense gating. Ads are only requested on screens with substantial publisher content
 * (homepage content, guides, about). Tool-only, legal and contact screens pause ad requests,
 * per the "Google-served ads on screens without publisher content" policy.
 */
export const ADSENSE_CLIENT = 'ca-pub-2244853446692512';
const SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;

type AdsQueue = unknown[] & { pauseAdRequests?: 0 | 1 };

export function setAdsAllowed(allowed: boolean) {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { adsbygoogle?: AdsQueue };
  const q: AdsQueue = (w.adsbygoogle = w.adsbygoogle || []);
  q.pauseAdRequests = allowed ? 0 : 1;

  // Pages rendered without the script (e.g. /privacy) load it on first visit to a content page
  if (allowed && !document.querySelector('script[src*="adsbygoogle.js"]')) {
    const s = document.createElement('script');
    s.async = true;
    s.src = SRC;
    s.crossOrigin = 'anonymous';
    document.head.appendChild(s);
  }
}
