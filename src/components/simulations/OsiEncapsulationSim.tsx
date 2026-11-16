import React, { useState } from 'react';
import { ArrowDown, ArrowUp, RotateCcw } from 'lucide-react';

interface LayerInfo {
  layer: number;
  name: string;
  pdu: string;
  headerAdded: string;
  description: string;
  exampleValue: string;
}

const OSI_LAYERS: LayerInfo[] = [
  {
    layer: 7,
    name: 'Application',
    pdu: 'Data',
    headerAdded: 'HTTP Request',
    description: 'A böngésző összeállítja a weboldal lekérését (GET /index.html).',
    exampleValue: 'GET /index.html HTTP/1.1',
  },
  {
    layer: 6,
    name: 'Presentation',
    pdu: 'Data',
    headerAdded: 'UTF-8 / TLS',
    description: 'Adatátalakítás, karakterkódolás és esetleges titkosítás.',
    exampleValue: 'Content-Type: text/html',
  },
  {
    layer: 5,
    name: 'Session',
    pdu: 'Data',
    headerAdded: 'Session ID',
    description: 'Munkamenet létrehozása és karbantartása a kliens és szerver között.',
    exampleValue: 'Session: #4921A',
  },
  {
    layer: 4,
    name: 'Transport',
    pdu: 'Segment',
    headerAdded: 'TCP Header',
    description: 'Forrás és cél portszámok hozzáadása a megbízható szállításhoz.',
    exampleValue: 'Src Port: 51420 → Dst Port: 80',
  },
  {
    layer: 3,
    name: 'Network',
    pdu: 'Packet',
    headerAdded: 'IPv4 Header',
    description: 'Logikai IP címek csatolása az alhálózatok közötti útválasztáshoz.',
    exampleValue: 'Src IP: 192.168.1.10 → Dst IP: 192.168.1.100',
  },
  {
    layer: 2,
    name: 'Data Link',
    pdu: 'Frame',
    headerAdded: 'Ethernet Header + FCS',
    description: 'Fizikai MAC címek és hibajelző Trailer (FCS) csatolása.',
    exampleValue: 'Src MAC: 00:1A.. → Dst MAC: 00:50.. | FCS',
  },
  {
    layer: 1,
    name: 'Physical',
    pdu: 'Bits',
    headerAdded: 'Elektromos / Optikai jel',
    description: 'A teljes Frame bináris 0 és 1 bitekként jut ki a hálózati kábelre.',
    exampleValue: '10110010 01001101 11100010...',
  },
];

export const OsiEncapsulationSim: React.FC = () => {
  const [stepIndex, setStepIndex] = useState(0); // 0..6 down (Encapsulation), 7..13 up (Decapsulation)

  const isDecapsulation = stepIndex >= 7;
  const currentLayerIdx = isDecapsulation ? 13 - stepIndex : stepIndex;
  const activeLayer = OSI_LAYERS[currentLayerIdx];

  const activeHeaders: string[] = [];
  if (!isDecapsulation) {
    for (let i = 3; i <= currentLayerIdx; i++) {
      if (i <= 5) activeHeaders.push(OSI_LAYERS[i].headerAdded);
    }
  } else {
    for (let i = 3; i <= currentLayerIdx; i++) {
      if (i <= 5) activeHeaders.push(OSI_LAYERS[i].headerAdded);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Fázis:{' '}
            <strong className="text-slate-900 dark:text-white">
              {isDecapsulation ? 'Decapsulation (Vevő oldal — felfelé)' : 'Encapsulation (Küldő oldal — lefelé)'}
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={stepIndex === 0}
            onClick={() => setStepIndex((s) => Math.max(0, s - 1))}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
          >
            Előző lépés
          </button>
          <button
            type="button"
            disabled={stepIndex === 13}
            onClick={() => setStepIndex((s) => Math.min(13, s + 1))}
            className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-700 disabled:opacity-40 whitespace-nowrap shrink-0"
          >
            {isDecapsulation ? (
              <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {stepIndex === 13 ? 'Kész' : 'Következő réteg'}
          </button>
          <button
            type="button"
            onClick={() => setStepIndex(0)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
            aria-label="Szimuláció alaphelyzetbe állítása"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-5 lg:grid-cols-2">
        {/* 7 Layers Stack */}
        <div className="space-y-1.5">
          {OSI_LAYERS.map((item, idx) => {
            const isActive = idx === currentLayerIdx;
            return (
              <button
                key={item.layer}
                type="button"
                onClick={() => setStepIndex(isDecapsulation ? 13 - idx : idx)}
                className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                  isActive
                    ? 'border-sky-600 bg-sky-50 text-sky-950 dark:border-sky-500 dark:bg-sky-950/60 dark:text-sky-100'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] font-semibold text-slate-400 tabular-nums">
                    L{item.layer}
                  </span>
                  <span className="font-semibold">{item.name}</span>
                </div>
                <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  PDU: {item.pdu}
                </span>
              </button>
            );
          })}
        </div>

        {/* Visual PDU Box */}
        <div className="flex flex-col justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Aktuális réteg: Layer {activeLayer.layer} ({activeLayer.name})</span>
              <span className="font-mono font-semibold text-sky-700 dark:text-sky-400">
                PDU: {activeLayer.pdu}
              </span>
            </div>

            <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
              {activeLayer.description}
            </p>

            <div className="mt-3 rounded-md border border-slate-200 bg-white p-2.5 font-mono text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
              {activeLayer.exampleValue}
            </div>
          </div>

          <div>
            <div className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              Csomag szerkezete ezen a rétegen:
            </div>
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
              {currentLayerIdx >= 5 && (
                <span className="rounded border border-emerald-300 bg-emerald-50 px-2 py-1 font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  L2 MAC Header
                </span>
              )}
              {currentLayerIdx >= 4 && (
                <span className="rounded border border-sky-300 bg-sky-50 px-2 py-1 font-semibold text-sky-800 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-300">
                  L3 IP Header
                </span>
              )}
              {currentLayerIdx >= 3 && (
                <span className="rounded border border-amber-300 bg-amber-50 px-2 py-1 font-semibold text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  L4 TCP Port
                </span>
              )}
              <span className="rounded border border-slate-300 bg-white px-2.5 py-1 font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
                HTTP Data
              </span>
              {currentLayerIdx >= 5 && (
                <span className="rounded border border-emerald-300 bg-emerald-50 px-2 py-1 font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  FCS Trailer
                </span>
              )}
            </div>
            {currentLayerIdx === 6 && (
              <div className="mt-2 font-mono text-xs text-sky-700 dark:text-sky-400">
                Átvitel a kábelen: 01011001 11010010 00110101 ...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
