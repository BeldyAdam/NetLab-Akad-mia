import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react';

type TopologyMode = 'star' | 'mesh';

export const TopologySimulator: React.FC = () => {
  const [mode, setMode] = useState<TopologyMode>('star');
  const [cutLinks, setCutLinks] = useState<string[]>([]);
  const [switchDown, setSwitchDown] = useState(false);

  const toggleLink = (id: string) => {
    setCutLinks((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const reset = () => {
    setCutLinks([]);
    setSwitchDown(false);
  };

  // Compute reachability between PC1, PC2, PC3, PC4
  const isStarHealthy = (pc: string) => !switchDown && !cutLinks.includes(`star-${pc}`);

  // Mesh adjacency for 4 nodes: PC1, PC2, PC3, PC4
  const meshEdges: Array<{ id: string; a: string; b: string; x1: number; y1: number; x2: number; y2: number }> = [
    { id: 'm-12', a: 'PC1', b: 'PC2', x1: 120, y1: 65, x2: 360, y2: 65 },
    { id: 'm-34', a: 'PC3', b: 'PC4', x1: 120, y1: 215, x2: 360, y2: 215 },
    { id: 'm-13', a: 'PC1', b: 'PC3', x1: 120, y1: 65, x2: 120, y2: 215 },
    { id: 'm-24', a: 'PC2', b: 'PC4', x1: 360, y1: 65, x2: 360, y2: 215 },
    { id: 'm-14', a: 'PC1', b: 'PC4', x1: 120, y1: 65, x2: 360, y2: 215 },
    { id: 'm-23', a: 'PC2', b: 'PC3', x1: 360, y1: 65, x2: 120, y2: 215 },
  ];

  const getMeshConnectedCount = () => {
    const active = meshEdges.filter((e) => !cutLinks.includes(e.id));
    const visited = new Set<string>(['PC1']);
    const queue = ['PC1'];
    while (queue.length > 0) {
      const curr = queue.shift()!;
      for (const edge of active) {
        if (edge.a === curr && !visited.has(edge.b)) {
          visited.add(edge.b);
          queue.push(edge.b);
        } else if (edge.b === curr && !visited.has(edge.a)) {
          visited.add(edge.a);
          queue.push(edge.a);
        }
      }
    }
    return visited.size;
  };

  const starConnectedCount = ['PC1', 'PC2', 'PC3', 'PC4'].filter(isStarHealthy).length;
  const connectedCount = mode === 'star' ? starConnectedCount : getMeshConnectedCount();
  const allReachable = connectedCount === 4;

  const starNodes = [
    { id: 'PC1', x: 100, y: 60 },
    { id: 'PC2', x: 380, y: 60 },
    { id: 'PC3', x: 100, y: 220 },
    { id: 'PC4', x: 380, y: 220 },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => {
              setMode('star');
              reset();
            }}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              mode === 'star'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            Star Topology (Switch)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('mesh');
              reset();
            }}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              mode === 'mesh'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            Full Mesh Topology
          </button>
        </div>

        <div className="flex items-center gap-2">
          {mode === 'star' && (
            <button
              type="button"
              onClick={() => setSwitchDown((s) => !s)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                switchDown
                  ? 'border-red-300 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/60 dark:text-red-300'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
              }`}
            >
              {switchDown ? 'Switch visszakapcsolása' : 'Központi Switch leállítása'}
            </button>
          )}
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Alaphelyzet
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-5 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
            <svg viewBox="0 0 480 280" className="h-64 w-full" role="img" aria-label="Interaktív hálózati topológia diagram">
              {mode === 'star' ? (
                <>
                  {starNodes.map((n) => {
                    const linkId = `star-${n.id}`;
                    const isCut = cutLinks.includes(linkId);
                    const active = !isCut && !switchDown;
                    return (
                      <g key={linkId}>
                        <line
                          x1={240}
                          y1={140}
                          x2={n.x}
                          y2={n.y}
                          stroke={isCut ? '#DC2626' : active ? '#0284C7' : '#94A3B8'}
                          strokeWidth={isCut ? 2.5 : 3}
                          strokeDasharray={isCut ? '6 5' : undefined}
                        />
                        <circle
                          cx={(240 + n.x) / 2}
                          cy={(140 + n.y) / 2}
                          r={12}
                          fill={isCut ? '#FEE2E2' : '#FFFFFF'}
                          stroke={isCut ? '#DC2626' : '#CBD5E1'}
                          strokeWidth={1.5}
                          className="cursor-pointer"
                          onClick={() => toggleLink(linkId)}
                        />
                        <text
                          x={(240 + n.x) / 2}
                          y={(140 + n.y) / 2 + 4}
                          textAnchor="middle"
                          fontSize="11"
                          fontWeight="600"
                          fill={isCut ? '#B91C1C' : '#475569'}
                          className="pointer-events-none select-none"
                        >
                          {isCut ? '✕' : '✂'}
                        </text>
                      </g>
                    );
                  })}

                  {/* Central Switch */}
                  <g
                    className="cursor-pointer"
                    onClick={() => setSwitchDown((s) => !s)}
                  >
                    <rect
                      x={196}
                      y={118}
                      width={88}
                      height={44}
                      rx={8}
                      fill={switchDown ? '#FEE2E2' : '#0284C7'}
                      stroke={switchDown ? '#DC2626' : '#0369A1'}
                      strokeWidth={2}
                    />
                    <text
                      x={240}
                      y={144}
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="700"
                      fill={switchDown ? '#991B1B' : '#FFFFFF'}
                    >
                      {switchDown ? 'SWITCH OFF' : 'Switch S1'}
                    </text>
                  </g>

                  {starNodes.map((n) => {
                    const ok = isStarHealthy(n.id);
                    return (
                      <g key={n.id}>
                        <rect
                          x={n.x - 32}
                          y={n.y - 20}
                          width={64}
                          height={40}
                          rx={8}
                          fill={ok ? '#FFFFFF' : '#FEF2F2'}
                          stroke={ok ? '#059669' : '#DC2626'}
                          strokeWidth={2}
                        />
                        <text
                          x={n.x}
                          y={n.y + 4}
                          textAnchor="middle"
                          fontSize="12"
                          fontWeight="600"
                          fill={ok ? '#0F172A' : '#991B1B'}
                        >
                          {n.id}
                        </text>
                      </g>
                    );
                  })}
                </>
              ) : (
                <>
                  {meshEdges.map((e) => {
                    const isCut = cutLinks.includes(e.id);
                    return (
                      <g key={e.id}>
                        <line
                          x1={e.x1}
                          y1={e.y1}
                          x2={e.x2}
                          y2={e.y2}
                          stroke={isCut ? '#DC2626' : '#0284C7'}
                          strokeWidth={isCut ? 2 : 2.5}
                          strokeDasharray={isCut ? '6 5' : undefined}
                        />
                        <circle
                          cx={(e.x1 + e.x2) / 2 + (e.id === 'm-14' ? -22 : e.id === 'm-23' ? 22 : 0)}
                          cy={(e.y1 + e.y2) / 2}
                          r={11}
                          fill={isCut ? '#FEE2E2' : '#FFFFFF'}
                          stroke={isCut ? '#DC2626' : '#CBD5E1'}
                          strokeWidth={1.5}
                          className="cursor-pointer"
                          onClick={() => toggleLink(e.id)}
                        />
                        <text
                          x={(e.x1 + e.x2) / 2 + (e.id === 'm-14' ? -22 : e.id === 'm-23' ? 22 : 0)}
                          y={(e.y1 + e.y2) / 2 + 4}
                          textAnchor="middle"
                          fontSize="10"
                          fontWeight="600"
                          fill={isCut ? '#B91C1C' : '#475569'}
                          className="pointer-events-none select-none"
                        >
                          {isCut ? '✕' : '✂'}
                        </text>
                      </g>
                    );
                  })}
                  {[
                    { id: 'PC1', x: 120, y: 65 },
                    { id: 'PC2', x: 360, y: 65 },
                    { id: 'PC3', x: 120, y: 215 },
                    { id: 'PC4', x: 360, y: 215 },
                  ].map((n) => (
                    <g key={n.id}>
                      <rect
                        x={n.x - 32}
                        y={n.y - 20}
                        width={64}
                        height={40}
                        rx={8}
                        fill="#FFFFFF"
                        stroke="#0284C7"
                        strokeWidth={2}
                      />
                      <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="12" fontWeight="600" fill="#0F172A">
                        {n.id}
                      </text>
                    </g>
                  ))}
                </>
              )}
            </svg>
            <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
              Kattints a kábeleken lévő ✂ ikonokra a szakadás szimulálásához!
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 lg:col-span-2">
          <div className="space-y-3">
            <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Hálózati állapot
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                {allReachable ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" aria-hidden="true" />
                    <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                      TELJES KAPCSOLAT (4/4 eszköz)
                    </span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" aria-hidden="true" />
                    <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                      RÉSZLEGES VAGY MEGSZAKADT ({connectedCount}/4 elérhető)
                    </span>
                  </>
                )}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {mode === 'star'
                  ? switchDown
                    ? 'A központi Switch leállása miatt a teljes csillag topológia megszakadt (Single Point of Failure).'
                    : cutLinks.length > 0
                      ? 'Egy kábel elszakadása csak az adott PC-t választotta le, a többi gép továbbra is eléri a Switch-et.'
                      : 'Minden PC közvetlenül csatlakozik a Switch-hez. Próbálj elvágni egy kábelt vagy leállítani a Switch-et!'
                  : cutLinks.length === 0
                    ? 'Full Mesh módban minden eszköz közvetlen redundáns úttal rendelkezik. Vágj el 1-2 kábelt és nézd meg, működik-e még!'
                    : allReachable
                      ? 'Bár kábel szakadt el, a többi alternatív Mesh útvonalon továbbra is minden eszköz eléri egymást!'
                      : 'Túl sok redundáns link szakadt el, egy csomópont elszigetelődött.'}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 p-4 text-xs dark:border-slate-800">
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                Költség vs. Megbízhatóság
              </div>
              <div className="mt-2 space-y-1.5 text-slate-600 dark:text-slate-300 tabular-nums">
                <div className="flex justify-between">
                  <span>Szükséges kábelek száma:</span>
                  <span className="font-mono font-medium">{mode === 'star' ? '4 db' : '6 db'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Elvágott linkek:</span>
                  <span className="font-mono font-medium">{cutLinks.length} db</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
