import React, { useState } from 'react';
import { CheckCircle2, Columns2, Download, ExternalLink, HardDriveDownload, Laptop, Terminal } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PacketTracerSetupViewProps {
  installed: boolean;
  onSetInstalled: (installed: boolean) => void;
  onStartLearning: () => void;
}

export const PacketTracerSetupView: React.FC<PacketTracerSetupViewProps> = ({
  installed,
  onSetInstalled,
  onStartLearning,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showManualSteps, setShowManualSteps] = useState(false);
  const inIframe = typeof window !== 'undefined' && window.self !== window.top;

  const handleOfflineInstall = async () => {
    if (isInstallable) {
      const ok = await install();
      if (!ok) setShowManualSteps(true);
    } else {
      setShowManualSteps((prev) => !prev);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="border-b border-slate-200 pb-5 dark:border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Cisco Packet Tracer Előkészítés és Offline Telepítés
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          A kurzus gyakorlati laborjaihoz telepítsd a gépedre a hivatalos, ingyenes Cisco Packet Tracer szimulátort, és ha szeretnéd, telepítsd magát a NetLab Akadémiát is önálló offline asztali alkalmazásként.
        </p>
      </div>

      {/* Offline PWA Installer Card right under Packet Tracer tab */}
      <div className="rounded-xl border border-sky-200 bg-sky-50/60 p-5 dark:border-sky-900 dark:bg-sky-950/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
              <HardDriveDownload className="h-4 w-4 text-sky-600 dark:text-sky-400" aria-hidden="true" />
              NetLab Akadémia — Offline Asztali Alkalmazás Telepítése
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {isInstalled
                ? 'Az alkalmazás már telepítve van önálló ablakban. A teljes tananyag, a szimulációk és a jegyzeteid internetkapcsolat nélkül is működnek.'
                : 'Telepítsd az alkalmazást a gépedre (PWA), így internet nélkül is megnyithatod az Asztalról vagy a Start menüből, közvetlenül a Packet Tracer mellett.'}
            </p>
          </div>

          {isInstalled ? (
            <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 whitespace-nowrap shrink-0">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Offline mód telepítve
            </div>
          ) : (
            <button
              type="button"
              onClick={handleOfflineInstall}
              className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-sky-700 whitespace-nowrap shrink-0"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              {isInstallable
                ? 'Offline alkalmazás telepítése'
                : 'Offline telepítő megnyitása'}
            </button>
          )}
        </div>

        {showManualSteps && !isInstalled && (
          <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 text-xs leading-relaxed text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            {isIOS ? (
              <p>
                iPhone / iPad esetén koppints a Safari <strong>Megosztás</strong> gombjára, majd válaszd a <strong>Főképernyőhöz adás</strong> opciót.
              </p>
            ) : (
              <div className="space-y-2.5">
                {inIframe && (
                  <p className="font-medium text-amber-800 dark:text-amber-300">
                    Megjegyzés: Az AI Studio előnézeti kereten belül (iframe) a böngésző letiltja az automatikus telepítőablakot. Nyisd meg az oldalt új böngészőfülben az alábbi gombbal:
                  </p>
                )}
                <ol className="space-y-1">
                  <li>1. Chrome vagy Edge böngészőben nyisd meg az alkalmazást külön fülön.</li>
                  <li>2. Kattints a címsor jobb oldalán a <strong>Telepítés</strong> ikonra (vagy Menü → <strong>Mentés és megosztás → Telepítés alkalmazásként</strong>).</li>
                  <li>3. Ezután a NetLab Akadémia önálló offline programként indul, és a bal oldalsáv alján is elérhető marad.</li>
                </ol>
                {inIframe && (
                  <a
                    href={typeof window !== 'undefined' ? window.location.href : '/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-medium text-white hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-700"
                  >
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    Megnyitás új böngészőfülben a telepítéshez
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Side-by-side workflow explanation */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <Columns2 className="h-4 w-4 text-sky-600 dark:text-sky-400" aria-hidden="true" />
            Side-by-Side (Egymás melletti) tanulás
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            A NetLab Akadémia és a Cisco Packet Tracer külön ablakban futnak a gépeden. Nincs szükség külső fájlok importálására: minden laborfeladatot nulláról, saját kézzel építesz fel, így alakul ki a valódi mérnöki rutin!
          </p>
          <ul className="mt-3 space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <li>1. Bal oldalon olvasod az elméletet és kipróbálod a beépített szimulációt.</li>
            <li>2. Jobb oldalon megnyitod a Packet Tracer-t, és elhelyezed a Router / Switch eszközöket.</li>
            <li>3. Egy kattintással kimásolod a Cisco IOS CLI parancsokat és kipipálod a lépéseket.</li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <Download className="h-4 w-4 text-sky-600 dark:text-sky-400" aria-hidden="true" />
            Cisco Packet Tracer telepítése (Windows / macOS / Linux)
          </div>
          <ol className="mt-2.5 space-y-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            <li>
              <strong className="text-slate-900 dark:text-white">1. Regisztráció:</strong> Hozz létre egy ingyenes fiókot a Cisco Skills for All / Networking Academy oldalon (<span className="font-mono">skillsforall.com</span> vagy <span className="font-mono">netacad.com</span>).
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">2. Letöltés:</strong> Nyisd meg a „Getting Started with Cisco Packet Tracer” ingyenes kurzust, és töltsd le az operációs rendszerednek megfelelő (8.2+) telepítőt.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">3. Offline futtatás:</strong> Telepítés és az első bejelentkezés után a Packet Tracer is képes korlátozott módban vagy lokálisan futni a gépeden, ez az alkalmazás pedig 100%-ban offline is elérhető marad!
            </li>
          </ol>
        </div>
      </div>

      {/* Packet Tracer Essential Shortcuts */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
          <Terminal className="h-4 w-4 text-sky-600 dark:text-sky-400" aria-hidden="true" />
          Legfontosabb Packet Tracer gyorsbillentyűk
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3 text-xs">
          <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
            <div className="font-mono font-semibold text-slate-900 dark:text-white">Alt + D</div>
            <div className="mt-1 text-slate-600 dark:text-slate-300">
              Fast Forward Time — felgyorsítja a Switch portok (STP) zöldre váltását.
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
            <div className="font-mono font-semibold text-slate-900 dark:text-white">Shift + S</div>
            <div className="mt-1 text-slate-600 dark:text-slate-300">
              Váltás Realtime és Simulation mód között a csomagok lépésenkénti követéséhez.
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
            <div className="font-mono font-semibold text-slate-900 dark:text-white">P</div>
            <div className="mt-1 text-slate-600 dark:text-slate-300">
              Simple PDU (boríték) kiválasztása gyors Ping teszthez két eszköz között.
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-900 dark:text-white">
          <input
            type="checkbox"
            checked={installed}
            onChange={(e) => onSetInstalled(e.target.checked)}
            className="h-4 w-4 accent-emerald-600"
          />
          <span className="flex items-center gap-2">
            <Laptop className="h-4 w-4 text-sky-600 dark:text-sky-400" aria-hidden="true" />
            Telepítettem a Cisco Packet Tracer-t a gépemre, készen állok a laborokra.
          </span>
        </label>

        <button
          type="button"
          onClick={onStartLearning}
          className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-xs font-medium text-white hover:bg-sky-700 whitespace-nowrap shrink-0"
        >
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          Vissza a tananyaghoz
        </button>
      </div>
    </div>
  );
};
