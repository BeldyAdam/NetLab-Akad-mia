import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, FlaskConical, GraduationCap, Search, X } from 'lucide-react';
import { CURRICULUM_LESSONS } from '../data/curriculum';
import { GLOSSARY_TERMS } from '../data/glossary';
import { searchCurriculum } from '../utils/networkLogic';
import type { SearchResultItem } from '../types/curriculum';

interface GlobalSearchModalProps {
  open: boolean;
  onClose: () => void;
  onSelectLesson: (lessonId: string, tab?: 'theory' | 'lab' | 'quiz') => void;
  onSelectGlossary: (glossaryId: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  open,
  onClose,
  onSelectLesson,
  onSelectGlossary,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  const results = useMemo(
    () => searchCurriculum(query, CURRICULUM_LESSONS, GLOSSARY_TERMS),
    [query]
  );

  if (!open) return null;

  const handleChoose = (item: SearchResultItem) => {
    if (item.type === 'glossary' && item.targetGlossaryId) {
      onSelectGlossary(item.targetGlossaryId);
    } else if (item.type === 'lab' && item.targetLessonId) {
      onSelectLesson(item.targetLessonId, 'lab');
    } else if (item.targetLessonId) {
      onSelectLesson(item.targetLessonId, 'theory');
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/60 p-4 pt-16 sm:pt-24"
      role="dialog"
      aria-modal="true"
      aria-label="Globális keresés"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <Search className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
          <label htmlFor="global-search-input" className="sr-only">
            Keresés leckékre, fogalmakra vagy parancsokra
          </label>
          <input
            ref={inputRef}
            id="global-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Keress rá fogalomra (pl. VLAN, ARP, Subnetting, Router, DHCP)..."
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Keresés bezárása"
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {!query.trim() ? (
            <div className="p-4 text-xs text-slate-500 dark:text-slate-400">
              <div className="font-semibold text-slate-700 dark:text-slate-200">
                Gyors javaslatok
              </div>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {['VLAN', 'MAC address', 'Subnetting', 'Default Gateway', 'DHCP', 'Trunk'].map(
                  (suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setQuery(suggestion)}
                      className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      {suggestion}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
              Nincs találat a következőre: „{query}”. Próbálj másik angol szakkifejezést (pl. Switch, IP, OSPF).
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800/70">
              {results.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleChoose(item)}
                    className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/70"
                  >
                    <div className="mt-0.5 text-sky-600 dark:text-sky-400 shrink-0">
                      {item.type === 'glossary' ? (
                        <BookOpen className="h-4 w-4" aria-hidden="true" />
                      ) : item.type === 'lab' ? (
                        <FlaskConical className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <GraduationCap className="h-4 w-4" aria-hidden="true" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        {item.title}
                      </div>
                      <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        {item.subtitle}
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-xs text-slate-600 dark:text-slate-300">
                        {item.matchSnippet}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
