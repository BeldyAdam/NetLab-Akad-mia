import React, { useState } from 'react';
import { Globe, Play, RotateCcw } from 'lucide-react';

const DORA_STEPS = [
  {
    code: 'D',
    name: 'DHCP Discover',
    direction: 'Kliens → Szerver (Broadcast)',
    detail: 'Az új PC még nem tudja az IP címét (0.0.0.0), ezért Broadcast üzenetet küld: "Van itt DHCP szerver?"',
  },
  {
    code: 'O',
    name: 'DHCP Offer',
    direction: 'Szerver → Kliens',
    detail: 'A Router DHCP Pool-ja felajánlja a 192.168.1.11 /24 címet, a 192.168.1.1 Gateway-t és a 8.8.8.8 DNS-t.',
  },
  {
    code: 'R',
    name: 'DHCP Request',
    direction: 'Kliens → Szerver (Broadcast)',
    detail: 'A PC jelzi, hogy elfogadja a felajánlott 192.168.1.11 címet.',
  },
  {
    code: 'A',
    name: 'DHCP Acknowledge',
    direction: 'Szerver → Kliens',
    detail: 'A Router véglegesíti a bérletet (Lease). A PC hálózati kártyája mostantól aktív IP-vel rendelkezik!',
  },
];

export const DhcpNatSim: React.FC = () => {
  const [doraStep, setDoraStep] = useState(0);
  const [natSessions, setNatSessions] = useState<
    Array<{ insideLocal: string; insideGlobal: string; outsideGlobal: string }>
  >([]);

  const dhcpDone = doraStep >= 4;

  const openWebSession = () => {
    if (!dhcpDone) return;
    const port = 51000 + natSessions.length * 7;
    const natPort = 10001 + natSessions.length;
    setNatSessions((prev) => [
      {
        insideLocal: `192.168.1.11:${port}`,
        insideGlobal: `203.0.113.1:${natPort}`,
        outsideGlobal: '93.184.216.34:443',
      },
      ...prev.slice(0, 3),
    ]);
  };

  const reset = () => {
    setDoraStep(0);
    setNatSessions([]);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={dhcpDone}
            onClick={() => setDoraStep((s) => Math.min(4, s + 1))}
            className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-3.5 py-2 text-xs font-medium text-white hover:bg-sky-700 disabled:opacity-40 whitespace-nowrap shrink-0"
          >
            <Play className="h-3.5 w-3.5" aria-hidden="true" />
            {dhcpDone ? 'DHCP IP kiosztva (192.168.1.11)' : `DORA lépés (${doraStep}/4)`}
          </button>

          <button
            type="button"
            disabled={!dhcpDone}
            onClick={openWebSession}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-xs font-medium text-emerald-800 hover:bg-emerald-100 disabled:opacity-40 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 whitespace-nowrap shrink-0"
          >
            <Globe className="h-3.5 w-3.5" aria-hidden="true" />
            Webkérés küldése (PAT teszt)
          </button>
        </div>

        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Újraindítás
        </button>
      </div>

      <div className="mt-4 grid gap-5 lg:grid-cols-2">
        {/* DHCP DORA pipeline */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            1. fázis: DHCP DORA folyamat
          </div>
          {DORA_STEPS.map((item, idx) => {
            const active = idx < doraStep;
            const current = idx === doraStep - 1;
            return (
              <div
                key={item.code}
                className={`rounded-lg border p-3 text-xs transition-colors ${
                  current
                    ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/50'
                    : active
                      ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20'
                      : 'border-slate-200 bg-slate-50/70 opacity-60 dark:border-slate-800 dark:bg-slate-950'
                }`}
              >
                <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white">
                  <span>{item.name}</span>
                  <span className="font-mono text-[11px] text-slate-500">{item.direction}</span>
                </div>
                <p className="mt-1 text-slate-600 dark:text-slate-300">{item.detail}</p>
              </div>
            );
          })}
        </div>

        {/* NAT Overload table */}
        <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
          <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            2. fázis: Router PAT (NAT Overload) táblázat
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {dhcpDone
              ? 'Kattints a "Webkérés küldése" gombra, hogy lásd, hogyan fordítja át a Router a 192.168.1.11 privát címet a 203.0.113.1 publikus címre egyedi portokkal!'
              : 'Előbb fejezd be a 4 DHCP lépést, hogy a PC érvényes IP címet kapjon.'}
          </p>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  <th className="pb-2 font-medium">Inside Local (Privát)</th>
                  <th className="pb-2 font-medium">Inside Global (Publikus)</th>
                  <th className="pb-2 font-medium">Cél (Web)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px] dark:divide-slate-800">
                {natSessions.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-5 text-center font-sans text-slate-400">
                      Még nincs aktív kimenő internetes munkamenet
                    </td>
                  </tr>
                ) : (
                  natSessions.map((row, idx) => (
                    <tr key={idx} className="text-slate-800 dark:text-slate-200">
                      <td className="py-2">{row.insideLocal}</td>
                      <td className="py-2 font-semibold text-sky-700 dark:text-sky-400">
                        {row.insideGlobal}
                      </td>
                      <td className="py-2">{row.outsideGlobal}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
