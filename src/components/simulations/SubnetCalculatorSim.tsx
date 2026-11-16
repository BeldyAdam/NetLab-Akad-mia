import React, { useState } from 'react';
import { calculateSubnetInfo } from '../../utils/networkLogic';

const PRESETS = [
  { label: '192.168.10.45 /24', ip: '192.168.10.45', cidr: 24 },
  { label: '192.168.10.130 /26', ip: '192.168.10.130', cidr: 26 },
  { label: '10.0.5.20 /16', ip: '10.0.5.20', cidr: 16 },
  { label: '172.16.0.1 /30 (WAN)', ip: '172.16.0.1', cidr: 30 },
];

export const SubnetCalculatorSim: React.FC = () => {
  const [ipInput, setIpInput] = useState('192.168.10.45');
  const [cidr, setCidr] = useState(26);

  const info = calculateSubnetInfo(ipInput, cidr);

  const fullIpBits = info.ipBinaryOctets.join('');

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label htmlFor="subnet-ip" className="block text-xs font-medium text-slate-600 dark:text-slate-300">
              IPv4 cím
            </label>
            <input
              id="subnet-ip"
              type="text"
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              placeholder="192.168.1.10"
              className="mt-1 w-44 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-mono text-xs text-slate-900 focus:border-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="min-w-[200px]">
            <label htmlFor="subnet-cidr" className="block text-xs font-medium text-slate-600 dark:text-slate-300">
              CIDR maszk: <span className="font-mono font-semibold text-sky-700 dark:text-sky-400">/{cidr}</span> ({info.subnetMask})
            </label>
            <input
              id="subnet-cidr"
              type="range"
              min={8}
              max={30}
              value={cidr}
              onChange={(e) => setCidr(Number(e.target.value))}
              className="mt-2 w-full accent-sky-600"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                setIpInput(p.ip);
                setCidr(p.cidr);
              }}
              className="rounded-md border border-slate-200 px-2.5 py-1 font-mono text-[11px] text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {!info.valid ? (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
          Érvénytelen IPv4 formátum. Adj meg négy ponttal elválasztott 0–255 közötti számot (pl. 192.168.10.45).
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {/* Binary breakdown */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>32 bites bináris felbontás (Kék = Network bitek · Szürke = Host bitek)</span>
              <span className="font-mono tabular-nums">
                {cidr} Network bit / {32 - cidr} Host bit
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-sm">
              {[0, 1, 2, 3].map((octetIdx) => (
                <React.Fragment key={octetIdx}>
                  <div className="flex rounded border border-slate-200 bg-white px-2 py-1 dark:border-slate-800 dark:bg-slate-900">
                    {fullIpBits
                      .slice(octetIdx * 8, (octetIdx + 1) * 8)
                      .split('')
                      .map((bit, bIdx) => {
                        const globalIdx = octetIdx * 8 + bIdx;
                        const isNet = globalIdx < cidr;
                        return (
                          <span
                            key={bIdx}
                            className={
                              isNet
                                ? 'font-semibold text-sky-700 dark:text-sky-400'
                                : 'text-slate-400 dark:text-slate-500'
                            }
                          >
                            {bit}
                          </span>
                        );
                      })}
                  </div>
                  {octetIdx < 3 && <span className="text-slate-400">.</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Calculated Subnet Table */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Network Address</div>
              <div className="mt-1 font-mono text-sm font-semibold text-slate-900 dark:text-white">
                {info.networkAddress}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Broadcast Address</div>
              <div className="mt-1 font-mono text-sm font-semibold text-slate-900 dark:text-white">
                {info.broadcastAddress}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Használható Host tartomány</div>
              <div className="mt-1 font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                {info.firstUsableHost} – {info.lastUsableHost}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Használható Hostok száma</div>
              <div className="mt-1 font-mono text-sm font-semibold text-slate-900 dark:text-white tabular-nums">
                {info.usableHosts.toLocaleString('hu-HU')} gép
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Wildcard Mask (OSPF/ACL)</div>
              <div className="mt-1 font-mono text-sm font-semibold text-slate-900 dark:text-white">
                {info.wildcardMask}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Címtípus</div>
              <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                {info.isPrivate ? 'Private IP (RFC 1918)' : 'Public IP'} · {info.ipClass} osztály
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
