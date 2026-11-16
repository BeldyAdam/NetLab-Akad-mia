import React, { useState } from 'react';
import { CheckCircle2, ShieldAlert, Send } from 'lucide-react';

type VlanId = 10 | 20;

export const VlanTrunkSim: React.FC = () => {
  const [sourcePc, setSourcePc] = useState<'PC-S1' | 'PC-I1'>('PC-S1');
  const [targetPc, setTargetPc] = useState<'PC-S2' | 'PC-I2'>('PC-S2');
  const [trunkEnabled, setTrunkEnabled] = useState(true);
  const [hasTested, setHasTested] = useState(false);

  const srcVlan: VlanId = sourcePc === 'PC-S1' ? 10 : 20;
  const dstVlan: VlanId = targetPc === 'PC-S2' ? 10 : 20;
  const sameVlan = srcVlan === dstVlan;
  const success = sameVlan && trunkEnabled;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor="vlan-src" className="block text-xs font-medium text-slate-600 dark:text-slate-300">
              Küldő (Switch 1)
            </label>
            <select
              id="vlan-src"
              value={sourcePc}
              onChange={(e) => {
                setSourcePc(e.target.value as 'PC-S1' | 'PC-I1');
                setHasTested(false);
              }}
              className="mt-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="PC-S1">PC-Sales-1 (VLAN 10)</option>
              <option value="PC-I1">PC-IT-1 (VLAN 20)</option>
            </select>
          </div>

          <div>
            <label htmlFor="vlan-dst" className="block text-xs font-medium text-slate-600 dark:text-slate-300">
              Cél (Switch 2)
            </label>
            <select
              id="vlan-dst"
              value={targetPc}
              onChange={(e) => {
                setTargetPc(e.target.value as 'PC-S2' | 'PC-I2');
                setHasTested(false);
              }}
              className="mt-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="PC-S2">PC-Sales-2 (VLAN 10)</option>
              <option value="PC-I2">PC-IT-2 (VLAN 20)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setHasTested(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-3.5 py-2 text-xs font-medium text-white hover:bg-sky-700 whitespace-nowrap shrink-0"
          >
            <Send className="h-3.5 w-3.5" aria-hidden="true" />
            Forgalom küldése
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            setTrunkEnabled((t) => !t);
            setHasTested(true);
          }}
          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
            trunkEnabled
              ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
              : 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
          }`}
        >
          {trunkEnabled ? '802.1Q Trunk: AKTÍV' : '802.1Q Trunk: CSAK ACCESS (VLAN 1)'}
        </button>
      </div>

      <div className="mt-4 grid items-center gap-4 md:grid-cols-3">
        {/* Switch 1 */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-950">
          <div className="text-xs font-semibold text-slate-900 dark:text-white">Switch S1</div>
          <div className="mt-2.5 space-y-2 text-xs">
            <div
              className={`rounded border p-2 ${
                sourcePc === 'PC-S1'
                  ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60'
                  : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
              }`}
            >
              <div className="font-medium">PC-Sales-1</div>
              <div className="font-mono text-[11px] text-slate-500">Access · VLAN 10</div>
            </div>
            <div
              className={`rounded border p-2 ${
                sourcePc === 'PC-I1'
                  ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60'
                  : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
              }`}
            >
              <div className="font-medium">PC-IT-1</div>
              <div className="font-mono text-[11px] text-slate-500">Access · VLAN 20</div>
            </div>
          </div>
        </div>

        {/* Trunk Link */}
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 p-4 text-center dark:border-slate-700">
          <div className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
            G0/1 ↔ G0/1 Link
          </div>
          <div
            className={`mt-2 h-2 w-full rounded-full ${
              trunkEnabled ? 'bg-sky-600' : 'bg-amber-500'
            }`}
          />
          <div className="mt-2 font-mono text-[11px] text-slate-600 dark:text-slate-300">
            {trunkEnabled
              ? `802.1Q Tag: [VLAN ${srcVlan}]`
              : 'Tag eldobva (nem Trunk)'}
          </div>
        </div>

        {/* Switch 2 */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-950">
          <div className="text-xs font-semibold text-slate-900 dark:text-white">Switch S2</div>
          <div className="mt-2.5 space-y-2 text-xs">
            <div
              className={`rounded border p-2 ${
                targetPc === 'PC-S2'
                  ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60'
                  : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
              }`}
            >
              <div className="font-medium">PC-Sales-2</div>
              <div className="font-mono text-[11px] text-slate-500">Access · VLAN 10</div>
            </div>
            <div
              className={`rounded border p-2 ${
                targetPc === 'PC-I2'
                  ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60'
                  : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
              }`}
            >
              <div className="font-medium">PC-IT-2</div>
              <div className="font-mono text-[11px] text-slate-500">Access · VLAN 20</div>
            </div>
          </div>
        </div>
      </div>

      {hasTested && (
        <div
          className={`mt-4 flex items-start gap-2.5 rounded-lg border p-3.5 text-xs ${
            success
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200'
              : 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200'
          }`}
        >
          {success ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
          ) : (
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
          )}
          <div>
            {!trunkEnabled
              ? `SIKERTELEN: A két Switch közötti port nincs Trunk módban, így a VLAN ${srcVlan} forgalma nem tud átkelni S2-re!`
              : !sameVlan
                ? `BLOKKOLVA (Layer 2 izoláció): ${sourcePc} a VLAN ${srcVlan}-ben van, míg ${targetPc} a VLAN ${dstVlan}-ben. Router (Router-on-a-Stick) nélkül a különböző VLAN-ok nem beszélhetnek egymással!`
                : `SIKERES: S1 ellátta a Frame-et 802.1Q VLAN ${srcVlan} címkével, átküldte a Trunk linken, majd S2 levette a címkét és kézbesítette ${targetPc} felé.`}
          </div>
        </div>
      )}
    </div>
  );
};
