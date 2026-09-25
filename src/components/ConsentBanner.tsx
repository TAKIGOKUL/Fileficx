import React, { useState, useEffect } from 'react';
import { ShieldCheck, Settings, X, Lock } from 'lucide-react';

export interface ConsentSettings {
  necessary: boolean;
  analytics: boolean;
  advertising: boolean;
  personalization: boolean;
  timestamp: string;
}

const STORAGE_KEY = 'fileficx_cmp_consent';

export const ConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [showPreferences, setShowPreferences] = useState<boolean>(false);
  const [consent, setConsent] = useState<ConsentSettings>({
    necessary: true,
    analytics: true,
    advertising: true,
    personalization: true,
    timestamp: new Date().toISOString()
  });

  useEffect(() => {
    const savedConsent = localStorage.getItem(STORAGE_KEY);
    if (!savedConsent) {
      setIsVisible(true);
    } else {
      try {
        setConsent(JSON.parse(savedConsent));
      } catch (e) {
        setIsVisible(true);
      }
    }

    const handleReopen = () => {
      setIsVisible(true);
      setShowPreferences(true);
    };

    window.addEventListener('open_cmp_preferences', handleReopen);
    return () => window.removeEventListener('open_cmp_preferences', handleReopen);
  }, []);

  const saveConsent = (updated: ConsentSettings) => {
    const finalData = { ...updated, timestamp: new Date().toISOString() };
    setConsent(finalData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(finalData));
    setIsVisible(false);
    setShowPreferences(false);

    if (typeof window !== 'undefined') {
      (window as any).google_cmp_consent = finalData;
    }
  };

  const handleConsentAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      advertising: true,
      personalization: true,
      timestamp: new Date().toISOString()
    });
  };

  const handleRejectNonEssential = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      advertising: false,
      personalization: false,
      timestamp: new Date().toISOString()
    });
  };

  const handleSavePreferences = () => {
    saveConsent(consent);
  };

  if (!isVisible) return null;

  return (
    <aside
      className="fixed bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 max-w-4xl mx-auto z-50 animate-slide-up"
      aria-label="Google Certified Privacy & Cookie Consent Management"
    >
      <div className="bg-[var(--bg-card)] border-2 border-[var(--accent)] rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-lg">
        {!showPreferences ? (
          /* Main 3-Choice Google CMP Consent Message (Consent, Do Not Consent, Manage Options) */
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-[var(--text-primary)] text-sm">
                    Privacy & Cookie Preferences (EEA / UK / Swiss TCF v2.2)
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)]">
                    Certified CMP
                  </span>
                </div>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  We and our Google AdSense partners process data (such as cookie IDs & device attributes) to deliver personalized ads, analyze site traffic, and protect serverless processing. Your personal document files never touch any server.
                </p>
              </div>
            </div>

            {/* 3 Choice Buttons: Consent All | Do Not Consent | Manage Options */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0 justify-end">
              <button
                onClick={handleConsentAll}
                className="btn btn-primary text-xs py-2 px-3.5 rounded-xl font-bold flex-1 md:flex-initial"
              >
                Consent (Accept All)
              </button>
              <button
                onClick={handleRejectNonEssential}
                className="btn btn-outline text-xs py-2 px-3.5 rounded-xl font-bold flex-1 md:flex-initial"
              >
                Do Not Consent
              </button>
              <button
                onClick={() => setShowPreferences(true)}
                className="btn btn-secondary text-xs py-2 px-3 rounded-xl font-bold flex items-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Manage Options</span>
              </button>
            </div>
          </div>
        ) : (
          /* Granular Preferences Modal Dialog */
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-[var(--accent)]" />
                <h3 className="font-bold text-[var(--text-primary)] text-sm">
                  Granular Consent Preferences
                </h3>
              </div>
              <button
                onClick={() => setShowPreferences(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Necessary Storage */}
              <div className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--text-primary)]">Strictly Necessary</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    Always Active
                  </span>
                </div>
                <p className="text-[10px] text-[var(--text-muted)]">
                  Required for WASM image processing, theme state, and local security.
                </p>
              </div>

              {/* Advertising Cookies */}
              <div className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--text-primary)]">Personalized Ads (AdSense)</span>
                  <input
                    type="checkbox"
                    checked={consent.advertising}
                    onChange={(e) => setConsent({ ...consent, advertising: e.target.checked })}
                    className="accent-[var(--accent)] w-4 h-4 cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-[var(--text-muted)]">
                  Allows Google AdSense partners to serve tailored relevant advertisements.
                </p>
              </div>

              {/* Analytics */}
              <div className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--text-primary)]">Performance & Analytics</span>
                  <input
                    type="checkbox"
                    checked={consent.analytics}
                    onChange={(e) => setConsent({ ...consent, analytics: e.target.checked })}
                    className="accent-[var(--accent)] w-4 h-4 cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-[var(--text-muted)]">
                  Measures site speed, usage metrics, and document processing optimization.
                </p>
              </div>

              {/* Personalization */}
              <div className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--text-primary)]">Content Personalization</span>
                  <input
                    type="checkbox"
                    checked={consent.personalization}
                    onChange={(e) => setConsent({ ...consent, personalization: e.target.checked })}
                    className="accent-[var(--accent)] w-4 h-4 cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-[var(--text-muted)]">
                  Remembers your preferred exam portal presets and dimension presets.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] text-xs">
              <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-500" /> 100% Zero Server File Upload Guarantee
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRejectNonEssential}
                  className="btn btn-outline text-xs py-1.5 px-3 rounded-xl font-bold"
                >
                  Reject Optional
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="btn btn-primary text-xs py-1.5 px-4 rounded-xl font-bold"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
