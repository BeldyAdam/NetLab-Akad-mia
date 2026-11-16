import React, { useState } from 'react';
import { CheckCircle2, Terminal, XCircle } from 'lucide-react';

export const CapstoneBuilderSim: React.FC = () => {
  const [trunkConfigured, setTrunkConfigured] = useState(false);
  const [subinterfaceEncap, setSubinterfaceEncap] = useState(true);
  const [ospfAdvertised, setOspfAdvertised] = useState(false);
  const [pingResult, setPingResult] = useState<string[] | null>(null);

  const runPingDiagnostic = () => {
    if (!trunkConfigured) {
      setPingResult([
        'Pinging 10.10.10.50 with 32 bytes of data:',
        'Request timed out. (Hiba: S1-HQ G0/1 portja Access módban maradt — a VLAN 10 Frame nem jut fel R1-HQ-ra!)',
        'Packets: Sent = 4, Received = 0, Lost = 4 (100% loss)',
      ]);
      return;
    }
    if (!subinterfaceEncap) {
      setPingResult([
        'Pinging 10.10.10.50 with 32 bytes of data:',
        'Request timed out. (Hiba: R1-HQ G0/0.10 alinterfészén hiányzik az "encapsulation dot1Q 10" beállítás!)',
        'Packets: Sent = 4, Received = 0, Lost = 4 (100% loss)',
      ]);
      return;
    }
    if (!ospfAdvertised) {
      setPingResult([
        'Pinging 10.10.10.50 with 32 bytes of data:',
        'Reply from 172.16.0.1: Destination host unreachable. (Hiba: R1 Routing Table nem ismeri a 10.10.10.0/24 hálózatot — kapcsold be az OSPF hirdetést!)',
        'Packets: Sent = 4, Received = 0, Lost = 4 (100% loss)',
      ]);
      return;
    }
    setPingResult([
      'Pinging 10.10.10.50 with 32 bytes of data:',
      'Reply from 10.10.10.50: bytes=32 time=2ms TTL=126',
      'Reply from 10.10.10.50: bytes=32 time=1ms TTL=126',
      'Reply from 10.10.10.50: bytes=32 time=1ms TTL=126',
      'Reply from 10.10.10.50: bytes=32 time=1ms TTL=126',
      'Packets: Sent = 4, Received = 4, Lost = 0 (0% loss) — SIKERES VÉGPONT-VÉGPONT KAPCSOLAT!',
    ]);
  };

  const allReady = trunkConfigured && subinterfaceEncap && ospfAdvertised;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-900 dark:text-white">
            Konfigurációs ellenőrzőkapuk (Sales-PC → Intranet Szerver)
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-3 text-xs hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
            <input
              type="checkbox"
              checked={trunkConfigured}
              onChange={(e) => {
                setTrunkConfigured(e.target.checked);
                setPingResult(null);
              }}
              className="mt-0.5 h-4 w-4 accent-sky-600"
            />
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">
                1. S1-HQ G0/1 Trunk engedélyezése
              </div>
              <div className="mt-0.5 font-mono text-[11px] text-slate-500">
                interface g0/1 → switchport mode trunk
              </div>
            </div>
          </label>

          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-3 text-xs hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
            <input
              type="checkbox"
              checked={subinterfaceEncap}
              onChange={(e) => {
                setSubinterfaceEncap(e.target.checked);
                setPingResult(null);
              }}
              className="mt-0.5 h-4 w-4 accent-sky-600"
            />
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">
                2. R1-HQ G0/0.10 Router-on-a-Stick 802.1Q
              </div>
              <div className="mt-0.5 font-mono text-[11px] text-slate-500">
                encapsulation dot1Q 10 · ip address 192.168.10.1
              </div>
            </div>
          </label>

          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-3 text-xs hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
            <input
              type="checkbox"
              checked={ospfAdvertised}
              onChange={(e) => {
                setOspfAdvertised(e.target.checked);
                setPingResult(null);
              }}
              className="mt-0.5 h-4 w-4 accent-sky-600"
            />
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">
                3. OSPF útvonalhirdetés R1-HQ és R2-Branch között
              </div>
              <div className="mt-0.5 font-mono text-[11px] text-slate-500">
                router ospf 1 → network 10.10.10.0 0.0.0.255 area 0
              </div>
            </div>
          </label>

          <button
            type="button"
            onClick={runPingDiagnostic}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-xs font-medium text-white hover:bg-sky-700 whitespace-nowrap shrink-0"
          >
            <Terminal className="h-4 w-4" aria-hidden="true" />
            Ping teszt futtatása: Sales-PC → 10.10.10.50
          </button>
        </div>

        <div className="flex flex-col justify-between rounded-lg border border-slate-200 bg-slate-950 p-4 font-mono text-xs text-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px] text-slate-400">
              <span>Sales-PC Command Prompt</span>
              <span className="flex items-center gap-1.5">
                {allReady ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                    <span className="text-emerald-400">KÉSZEN ÁLL</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
                    <span className="text-amber-400">HIBAKERESÉS</span>
                  </>
                )}
              </span>
            </div>

            <div className="mt-3 space-y-1.5 leading-relaxed">
              <div className="text-sky-400">C:\&gt; ping 10.10.10.50</div>
              {pingResult ? (
                pingResult.map((line, i) => (
                  <div
                    key={i}
                    className={
                      line.includes('Hiba') || line.includes('100% loss')
                        ? 'text-amber-300'
                        : line.includes('SIKERES')
                          ? 'font-semibold text-emerald-400'
                          : 'text-slate-300'
                    }
                  >
                    {line}
                  </div>
                ))
              ) : (
                <div className="text-slate-500">
                  Kapcsold be a hiányzó hálózati rétegeket bal oldalon, majd indítsd el a ping tesztet!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
