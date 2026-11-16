import React, { useState } from 'react';
import { RotateCcw, Send } from 'lucide-react';

interface MacEntry {
  mac: string;
  port: string;
  host: string;
}

const HOSTS = [
  { id: 'PC-A', mac: '00:1A:11:11:11:AA', port: 'Fa0/1' },
  { id: 'PC-B', mac: '00:1A:22:22:22:BB', port: 'Fa0/2' },
  { id: 'PC-C', mac: '00:1A:33:33:33:CC', port: 'Fa0/3' },
  { id: 'PC-D', mac: '00:1A:44:44:44:DD', port: 'Fa0/4' },
];

export const SwitchMacTableSim: React.FC = () => {
  const [sourceId, setSourceId] = useState('PC-A');
  const [destId, setDestId] = useState('PC-C');
  const [macTable, setMacTable] = useState<MacEntry[]>([]);
  const [lastAction, setLastAction] = useState<{
    mode: 'FLOOD' | 'FORWARD' | 'IDLE';
    deliveredPorts: string[];
    summary: string;
  }>({
    mode: 'IDLE',
    deliveredPorts: [],
    summary: 'A Switch MAC Address Table jelenleg üres. Küldj egy Frame-et a tanulás megfigyeléséhez!',
  });

  const handleSendFrame = () => {
    const src = HOSTS.find((h) => h.id === sourceId)!;
    const dst = HOSTS.find((h) => h.id === destId)!;

    // 1. Learn Source MAC
    let nextTable = [...macTable];
    const alreadyLearnedSrc = nextTable.some((e) => e.mac === src.mac);
    if (!alreadyLearnedSrc) {
      nextTable.push({ mac: src.mac, port: src.port, host: src.id });
    }

    // 2. Lookup Destination MAC
    const knownDest = nextTable.find((e) => e.mac === dst.mac);

    if (!knownDest) {
      const floodedPorts = HOSTS.filter((h) => h.port !== src.port).map((h) => h.port);
      setMacTable(nextTable);
      setLastAction({
        mode: 'FLOOD',
        deliveredPorts: floodedPorts,
        summary: `1) Switch megtanulta: ${src.id} (${src.mac}) → ${src.port}. 2) Mivel ${dst.id} MAC címe még ismeretlen, a Switch FLOODING-gal kiküldte a Frame-et minden más portra (${floodedPorts.join(', ')}).`,
      });
    } else {
      setMacTable(nextTable);
      setLastAction({
        mode: 'FORWARD',
        deliveredPorts: [knownDest.port],
        summary: `Ismert Unicast! A Switch a MAC Table alapján kizárólag a célportra (${knownDest.port} → ${dst.id}) továbbította a Frame-et (Unicast Forward).`,
      });
    }
  };

  const handleReset = () => {
    setMacTable([]);
    setLastAction({
      mode: 'IDLE',
      deliveredPorts: [],
      summary: 'A Switch MAC Address Table törölve. Küldj egy új Frame-et!',
    });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor="sim-src" className="block text-xs font-medium text-slate-600 dark:text-slate-300">
              Forrás (Source)
            </label>
            <select
              id="sim-src"
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              className="mt-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {HOSTS.map((h) => (
                <option key={h.id} value={h.id} disabled={h.id === destId}>
                  {h.id} ({h.port})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sim-dst" className="block text-xs font-medium text-slate-600 dark:text-slate-300">
              Cél (Destination)
            </label>
            <select
              id="sim-dst"
              value={destId}
              onChange={(e) => setDestId(e.target.value)}
              className="mt-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {HOSTS.map((h) => (
                <option key={h.id} value={h.id} disabled={h.id === sourceId}>
                  {h.id} ({h.port})
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleSendFrame}
            className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-3.5 py-2 text-xs font-medium text-white hover:bg-sky-700 whitespace-nowrap shrink-0"
          >
            <Send className="h-3.5 w-3.5" aria-hidden="true" />
            Frame küldése
          </button>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          MAC Table törlése
        </button>
      </div>

      <div className="mt-4 grid gap-5 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {HOSTS.map((h) => {
              const isSrc = h.id === sourceId && lastAction.mode !== 'IDLE';
              const isDstHit = lastAction.deliveredPorts.includes(h.port);
              const isIntendedDst = h.id === destId;
              return (
                <div
                  key={h.id}
                  className={`rounded-lg border p-3 text-center text-xs transition-colors ${
                    isSrc
                      ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/50'
                      : isDstHit
                        ? isIntendedDst
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50'
                          : 'border-amber-400 bg-amber-50 dark:bg-amber-950/40'
                        : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950'
                  }`}
                >
                  <div className="font-semibold text-slate-900 dark:text-white">{h.id}</div>
                  <div className="mt-0.5 font-mono text-[11px] text-slate-500">{h.port}</div>
                  <div className="mt-1 font-mono text-[10px] text-slate-500">{h.mac.slice(-8)}</div>
                  {isSrc && (
                    <div className="mt-1.5 text-[11px] font-semibold text-sky-700 dark:text-sky-300">
                      Küldő
                    </div>
                  )}
                  {isDstHit && (
                    <div className="mt-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                      {isIntendedDst ? 'Cél megkapta' : 'Flood (Eldobja)'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-xs leading-relaxed text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
            <span className="font-semibold text-slate-900 dark:text-white">Döntési napló: </span>
            {lastAction.summary}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
              Switch MAC Address Table (CAM)
            </h4>
            <span className="font-mono text-[11px] text-slate-500 tabular-nums">
              {macTable.length} / 4 bejegyzés
            </span>
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  <th className="pb-2 font-medium">Port</th>
                  <th className="pb-2 font-medium">MAC address</th>
                  <th className="pb-2 font-medium">Eszköz</th>
                  <th className="pb-2 font-medium">Típus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono dark:divide-slate-800">
                {macTable.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center font-sans text-slate-400">
                      Üres táblázat — a Switch még nem látott forgalmat
                    </td>
                  </tr>
                ) : (
                  macTable.map((entry) => (
                    <tr key={entry.mac} className="text-slate-800 dark:text-slate-200">
                      <td className="py-2">{entry.port}</td>
                      <td className="py-2">{entry.mac}</td>
                      <td className="py-2 font-sans">{entry.host}</td>
                      <td className="py-2 text-emerald-700 dark:text-emerald-400">DYNAMIC</td>
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
