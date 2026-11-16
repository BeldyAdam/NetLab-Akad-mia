import React, { useState } from 'react';
import { Download, ExternalLink, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowGuide(true);
    }
  };

  const inIframe =
    typeof window !== 'undefined' && window.self !== window.top;

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
          isInstallable
            ? 'bg-sky-600 text-white hover:bg-sky-700'
            : 'border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800'
        }`}
      >
        <Download className="h-3.5 w-3.5" aria-hidden="true" />
        {isIOS ? 'Telepítés iOS-re' : 'Offline telepítés'}
      </button>

      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Offline asztali telepítési útmutató"
        >
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                {isIOS
                  ? 'Telepítés iPhone / iPad eszközre'
                  : 'Offline asztali alkalmazás telepítése (PWA)'}
              </h3>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                aria-label="Útmutató bezárása"
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {isIOS ? (
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                1. Koppints a Safari <strong>Megosztás</strong> gombjára.
                <br />
                2. Görgess le és válaszd a <strong>Főképernyőhöz adás</strong> opciót.
              </p>
            ) : (
              <div className="mt-3 space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {inIframe && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
                    Jelenleg beágyazott előnézetben nézed az oldalt, ahol a böngésző biztonsági okból nem mutatja az azonnali telepítés gombot. Nyisd meg külön böngészőfülben a telepítéshez!
                  </div>
                )}
                <ol className="space-y-1.5">
                  <li>
                    <strong>1.</strong> Ha külön fülön vagy (Google Chrome vagy Microsoft Edge), kattints a címsor jobb szélén megjelenő <strong>Telepítés (⊕ / számítógép ikon)</strong> gombra.
                  </li>
                  <li>
                    <strong>2.</strong> Vagy a böngésző jobb felső menüjében válaszd: <strong>Mentés és megosztás → Oldal telepítése alkalmazásként</strong> (Edge: <strong>Alkalmazások → Telepítés</strong>).
                  </li>
                  <li>
                    <strong>3.</strong> Telepítés után a <strong>NetLab Akadémia</strong> önálló asztali programként fut és 100%-ban offline is megnyitható!
                  </li>
                </ol>
                {inIframe && (
                  <a
                    href={typeof window !== 'undefined' ? window.location.href : '/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-3.5 py-2 text-xs font-medium text-white hover:bg-sky-700"
                  >
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    Megnyitás új böngészőfülben
                  </a>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="mt-4 w-full rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Bezárás
            </button>
          </div>
        </div>
      )}
    </>
  );
};
