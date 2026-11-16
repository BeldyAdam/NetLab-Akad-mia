import React, { useState } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';

interface RoutingStep {
  title: string;
  stage: 'pc' | 'switch1' | 'router' | 'server';
  srcMac: string;
  dstMac: string;
  srcIp: string;
  dstIp: string;
  explanation: string;
}

const STEPS: RoutingStep[] = [
  {
    stage: 'pc',
    title: '1. PC1 ellenőrzi a cél IP-t (10.0.2.50)',
    srcMac: 'AA:AA:AA:01 (PC1)',
    dstMac: 'R1:G0/0:01 (Default Gateway)',
    srcIp: '192.168.1.10',
    dstIp: '10.0.2.50',
    explanation:
      'PC1 látja, hogy a 10.0.2.50 kívül esik a 192.168.1.0/24 alhálózaton, ezért a Frame cél MAC címének a Default Gateway (R1 G0/0) MAC címét állítja be!',
  },
  {
    stage: 'switch1',
    title: '2. Switch1 továbbítja R1 felé (Layer 2)',
    srcMac: 'AA:AA:AA:01 (PC1)',
    dstMac: 'R1:G0/0:01 (Default Gateway)',
    srcIp: '192.168.1.10',
    dstIp: '10.0.2.50',
    explanation:
      'A Switch csak a Layer 2 MAC címeket nézi, nem nyúl az IP fejléchez. A cél MAC alapján átküldi a Frame-et R1 GigabitEthernet0/0 portjára.',
  },
  {
    stage: 'router',
    title: '3. Router R1 útválasztás és MAC újraírás',
    srcMac: 'R1:G0/1:02 (R1 kimenő port)',
    dstMac: 'BB:BB:BB:50 (Szerver)',
    srcIp: '192.168.1.10',
    dstIp: '10.0.2.50',
    explanation:
      'R1 lefejti a régi Frame-et, megnézi a Routing Table-ben a 10.0.2.0/24 útvonalat (G0/1), majd ÚJ Layer 2 Frame-be csomagolja a Packet-et! Az IP címek érintetlenek!',
  },
  {
    stage: 'server',
    title: '4. A Szerver megkapja a Packet-et',
    srcMac: 'R1:G0/1:02 (R1 kimenő port)',
    dstMac: 'BB:BB:BB:50 (Szerver)',
    srcIp: '192.168.1.10',
    dstIp: '10.0.2.50',
    explanation:
      'A Szerver (10.0.2.50) elfogadja a Frame-et, ellenőrzi a cél IP-t, és elkészíti az ICMP Echo Reply választ vissza a 192.168.1.10 felé.',
  },
];

export const RouterForwardingSim: React.FC = () => {
  const [stepIdx, setStepIdx] = useState(0);
  const current = STEPS[stepIdx];

  const nodes = [
    { id: 'pc', label: 'PC1', sub: '192.168.1.10', x: 65 },
    { id: 'switch1', label: 'Switch S1', sub: 'Layer 2', x: 185 },
    { id: 'router', label: 'Router R1', sub: 'GW .1.1 / .2.1', x: 315 },
    { id: 'server', label: 'Szerver', sub: '10.0.2.50', x: 435 },
  ] as const;

  const activeNodeX = nodes.find((n) => n.id === current.stage)?.x ?? 65;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
          Lépés {stepIdx + 1} / {STEPS.length}: <strong className="text-slate-900 dark:text-white">{current.title}</strong>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={stepIdx === 0}
            onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
          >
            Előző
          </button>
          <button
            type="button"
            disabled={stepIdx === STEPS.length - 1}
            onClick={() => setStepIdx((i) => Math.min(STEPS.length - 1, i + 1))}
            className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-700 disabled:opacity-40 whitespace-nowrap shrink-0"
          >
            Következő ugrás
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setStepIdx(0)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
            aria-label="Szimuláció újraindítása"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
        <svg viewBox="0 0 500 135" className="h-36 w-full" role="img" aria-label="Packet útja a Routeren keresztül">
          <line x1={65} y1={65} x2={435} y2={65} stroke="#CBD5E1" strokeWidth={3} />
          <line x1={65} y1={65} x2={activeNodeX} y2={65} stroke="#0284C7" strokeWidth={4} />
          {nodes.map((n) => {
            const isCurrent = n.id === current.stage;
            return (
              <g key={n.id} className="cursor-pointer" onClick={() => setStepIdx(nodes.findIndex((x) => x.id === n.id))}>
                <rect
                  x={n.x - 42}
                  y={38}
                  width={84}
                  height={52}
                  rx={8}
                  fill={isCurrent ? '#0284C7' : '#FFFFFF'}
                  stroke={isCurrent ? '#0369A1' : '#94A3B8'}
                  strokeWidth={2}
                />
                <text
                  x={n.x}
                  y={61}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="700"
                  fill={isCurrent ? '#FFFFFF' : '#0F172A'}
                >
                  {n.label}
                </text>
                <text
                  x={n.x}
                  y={78}
                  textAnchor="middle"
                  fontSize="9.5"
                  fill={isCurrent ? '#E0F2FE' : '#64748B'}
                >
                  {n.sub}
                </text>
              </g>
            );
          })}
          {/* Packet indicator */}
          <rect x={activeNodeX - 18} y={6} width={36} height={20} rx={4} fill="#059669" />
          <text x={activeNodeX} y={19} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#FFFFFF">
            PDU
          </text>
        </svg>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 p-3.5 text-xs dark:border-slate-800">
          <div className="font-semibold text-slate-900 dark:text-white">
            Layer 2 (Frame) — Minden ugrásnál változik
          </div>
          <div className="mt-2 space-y-1 font-mono text-[11px]">
            <div className="flex justify-between gap-2">
              <span className="text-slate-500">Source MAC:</span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">{current.srcMac}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-slate-500">Destination MAC:</span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">{current.dstMac}</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 p-3.5 text-xs dark:border-slate-800">
          <div className="font-semibold text-slate-900 dark:text-white">
            Layer 3 (Packet) — Végig állandó marad
          </div>
          <div className="mt-2 space-y-1 font-mono text-[11px]">
            <div className="flex justify-between gap-2">
              <span className="text-slate-500">Source IP:</span>
              <span className="font-semibold text-sky-700 dark:text-sky-400">{current.srcIp}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-slate-500">Destination IP:</span>
              <span className="font-semibold text-sky-700 dark:text-sky-400">{current.dstIp}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
        {current.explanation}
      </p>
    </div>
  );
};
