import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Search } from 'lucide-react';
import { GLOSSARY_TERMS } from '../data/glossary';
import type { GlossaryCategory } from '../types/curriculum';

interface GlossaryViewProps {
  highlightedId: string | null;
  onSelectLesson: (lessonId: string) => void;
}

const CATEGORIES: Array<'Összes' | GlossaryCategory> = [
  'Összes',
  'Alapok',
  'Switching és VLAN',
  'IP és Routing',
  'Szolgáltatások',
];

export const GlossaryView: React.FC<GlossaryViewProps> = ({
  highlightedId,
  onSelectLesson,
}) => {
  const [filterText, setFilterText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'Összes' | GlossaryCategory>('Összes');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!highlightedId) return;
    setSelectedCategory('Összes');
    setFilterText('');
    const timer = setTimeout(() => {
      const target = containerRef.current?.querySelector(
        `[data-term-id="${highlightedId}"]`
      );
      if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 60);
    return () => clearTimeout(timer);
  }, [highlightedId]);

  const filteredTerms = useMemo(() => {
    const q = filterText.trim().toLowerCase();
    return GLOSSARY_TERMS.filter((item) => {
      const catMatch = selectedCategory === 'Összes' || item.category === selectedCategory;
      if (!catMatch) return false;
      if (!q) return true;
      return (
        item.term.toLowerCase().includes(q) ||
        (item.fullName ?? '').toLowerCase().includes(q) ||
        item.definition.toLowerCase().includes(q)
      );
    });
  }, [filterText, selectedCategory]);

  return (
    <div ref={containerRef} className="mx-auto max-w-5xl space-y-6">
      <div className="border-b border-slate-200 pb-5 dark:border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Hálózati Szótár (IT Jargon)
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          Az iparágban használt angol szakkifejezések magyar magyarázata és gyakorlati példái. A szakkifejezéseket szándékosan az eredeti angol alakjukban hagyjuk, ahogy a munkahelyeken és a Cisco CLI-ben is találkozol velük.
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search
              className="pointer-events-none absolute top-2.5 left-3 h-3.5 w-3.5 text-slate-400"
              aria-hidden="true"
            />
            <label htmlFor="glossary-search" className="sr-only">
              Szűrés a szótárban
            </label>
            <input
              id="glossary-search"
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Szűrés (pl. Trunk, ARP)..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pr-3 pl-8 text-xs text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {filteredTerms.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          Nincs a szűrésnek megfelelő szakkifejezés.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredTerms.map((item) => {
            const isHighlighted = item.id === highlightedId;
            return (
              <article
                key={item.id}
                data-term-id={item.id}
                className={`flex flex-col justify-between rounded-xl border p-5 transition-colors ${
                  isHighlighted
                    ? 'border-sky-500 bg-sky-50/40 dark:border-sky-500 dark:bg-sky-950/30'
                    : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      {item.term}
                    </h2>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {item.category}
                    </span>
                  </div>
                  {item.fullName && (
                    <div className="mt-0.5 font-mono text-[11px] text-sky-700 dark:text-sky-400">
                      {item.fullName}
                    </div>
                  )}
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {item.definition}
                  </p>
                  <div className="mt-3 rounded-lg bg-slate-50 p-2.5 text-xs text-slate-600 dark:bg-slate-950 dark:text-slate-300">
                    <strong className="text-slate-800 dark:text-slate-200">Példa: </strong>
                    {item.example}
                  </div>
                </div>

                {item.relatedLessonId && (
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => onSelectLesson(item.relatedLessonId!)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-sky-700 hover:underline dark:text-sky-400"
                    >
                      Ugrás a kapcsolódó leckéhez
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
