import React from 'react';
import { Menu, Search } from 'lucide-react';
import type { ActiveView } from '../store/useLearningStore';

interface TopBarProps {
  activeView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  onOpenSearch: () => void;
  onToggleMobileMenu: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeView,
  onSelectView,
  onOpenSearch,
  onToggleMobileMenu,
}) => {
  const navItems: Array<{ id: ActiveView; label: string }> = [
    { id: 'lesson', label: 'Tananyag' },
    { id: 'glossary', label: 'Szótár' },
    { id: 'progress', label: 'Haladás' },
    { id: 'setup', label: 'Packet Tracer' },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-8 border-b border-slate-200 bg-white/95 px-4 backdrop-blur-sm lg:px-6 dark:border-slate-800 dark:bg-slate-950/95">
      {/* Zone 1: Single-line brand wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          aria-label="Oldalsáv megnyitása"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 lg:hidden dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Menu className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onSelectView('lesson')}
          className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 dark:text-white"
        >
          NetLab Akadémia
        </button>
      </div>

      {/* Zone 2: 4 concise single-line nav links */}
      <nav aria-label="Fő navigáció" className="hidden md:flex items-center gap-7">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectView(item.id)}
              className={`relative py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                isActive
                  ? 'text-sky-700 dark:text-sky-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              {item.label}
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-[17px] h-0.5 bg-sky-600 dark:bg-sky-400"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center shrink-0">
        <button
          type="button"
          onClick={onOpenSearch}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-700 whitespace-nowrap shrink-0"
        >
          <Search className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Keresés</span>
          <kbd className="hidden sm:inline-block rounded bg-slate-700 px-1.5 py-0.5 font-mono text-[10px] text-slate-200 dark:bg-sky-700">
            Ctrl K
          </kbd>
        </button>
      </div>
    </header>
  );
};
