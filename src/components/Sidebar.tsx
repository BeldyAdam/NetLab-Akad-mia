import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  Laptop,
  Moon,
  Search,
  Sun,
  X,
} from 'lucide-react';
import type { Lesson, ProgressStats } from '../types/curriculum';
import type { ActiveView } from '../store/useLearningStore';
import { PWAInstallButton } from './PWAInstallButton';

interface SidebarProps {
  lessons: Lesson[];
  activeLessonId: string;
  activeView: ActiveView;
  completedLessons: string[];
  quizScores: Record<string, { passed: boolean }>;
  progress: ProgressStats;
  packetTracerInstalled: boolean;
  theme: 'light' | 'dark';
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onSelectLesson: (lessonId: string) => void;
  onSelectView: (view: ActiveView) => void;
  onOpenSearch: () => void;
  onToggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  lessons,
  activeLessonId,
  activeView,
  completedLessons,
  quizScores,
  progress,
  packetTracerInstalled,
  theme,
  mobileOpen,
  onCloseMobile,
  onSelectLesson,
  onSelectView,
  onOpenSearch,
  onToggleTheme,
}) => {
  const content = (
    <div className="flex h-full flex-col bg-white dark:bg-slate-900">
      {/* Mobile Header inside drawer */}
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 lg:hidden dark:border-slate-800">
        <span className="text-sm font-bold text-slate-900 dark:text-white">
          Tananyag modulok
        </span>
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Oldalsáv bezárása"
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* Persistent Progress Bar (Haladásmérő sáv) */}
      <div className="border-b border-slate-200 p-4 dark:border-slate-800">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Aktuális szint
          </span>
          <span
            data-testid="overall-progress-percent"
            className="font-mono text-sm font-bold text-sky-700 tabular-nums dark:text-sky-400"
          >
            {progress.overallPercent}%
          </span>
        </div>
        <div className="mt-1 text-xs font-semibold text-slate-900 dark:text-white">
          {progress.levelTitle}
        </div>
        <div
          className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
          role="progressbar"
          aria-valuenow={progress.overallPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Teljes tanulási haladás"
        >
          <div
            className="h-full rounded-full bg-sky-600 transition-all duration-300 dark:bg-sky-500"
            style={{ width: `${progress.overallPercent}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 tabular-nums dark:text-slate-400">
          <span>
            {progress.completedLessonsCount}/{progress.totalLessonsCount} lecke
          </span>
          <span>
            {progress.passedQuizzesCount}/{progress.totalLessonsCount} kvíz
          </span>
        </div>
      </div>

      {/* Sidebar Quick Search */}
      <div className="border-b border-slate-100 px-3 py-2.5 dark:border-slate-800">
        <button
          type="button"
          onClick={() => {
            onOpenSearch();
            onCloseMobile();
          }}
          className="flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:border-slate-700"
        >
          <Search className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">Keresés fogalmakra, leckékre...</span>
        </button>
      </div>

      {/* Mobile quick view switcher */}
      <div className="grid grid-cols-2 gap-1.5 border-b border-slate-100 p-3 md:hidden dark:border-slate-800">
        <button
          type="button"
          onClick={() => {
            onSelectView('glossary');
            onCloseMobile();
          }}
          className={`rounded-lg px-2.5 py-2 text-xs font-medium ${
            activeView === 'glossary'
              ? 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
              : 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
          }`}
        >
          Szótár
        </button>
        <button
          type="button"
          onClick={() => {
            onSelectView('progress');
            onCloseMobile();
          }}
          className={`rounded-lg px-2.5 py-2 text-xs font-medium ${
            activeView === 'progress'
              ? 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
              : 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
          }`}
        >
          Haladás
        </button>
      </div>

      {/* Curriculum Lessons */}
      <nav aria-label="Kurzus modulok" className="flex-1 overflow-y-auto p-3">
        <div className="mb-2 px-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          Tananyag modulok
        </div>
        <ul className="space-y-1">
          {lessons.map((lesson) => {
            const isActive = activeView === 'lesson' && activeLessonId === lesson.id;
            const isCompleted = completedLessons.includes(lesson.id);
            const quizPassed = quizScores[lesson.id]?.passed;

            return (
              <li key={lesson.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelectLesson(lesson.id);
                    onCloseMobile();
                  }}
                  className={`group flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2.5 text-left transition-colors ${
                    isActive
                      ? 'bg-sky-50 text-sky-950 dark:bg-sky-950/70 dark:text-sky-100'
                      : 'text-slate-700 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <span
                    className={`mt-0.5 font-mono text-xs font-semibold tabular-nums ${
                      isActive
                        ? 'text-sky-700 dark:text-sky-400'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {lesson.number}.
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold leading-snug">{lesson.title}</div>
                    <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                      {lesson.difficulty} · {lesson.estimatedMinutes} perc
                      {quizPassed ? ' · Kvíz OK' : ''}
                    </div>
                  </div>
                  {isCompleted && (
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                      aria-label="Teljesítve"
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Utilities */}
      <div className="space-y-2 border-t border-slate-200 p-3 dark:border-slate-800">
        <button
          type="button"
          onClick={() => {
            onSelectView('setup');
            onCloseMobile();
          }}
          className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <span className="flex items-center gap-2 truncate">
            <Laptop className="h-3.5 w-3.5 shrink-0 text-sky-600 dark:text-sky-400" aria-hidden="true" />
            <span className="truncate">Packet Tracer</span>
          </span>
          <span
            className={`text-[11px] font-semibold whitespace-nowrap shrink-0 ${
              packetTracerInstalled
                ? 'text-emerald-700 dark:text-emerald-400'
                : 'text-amber-700 dark:text-amber-400'
            }`}
          >
            {packetTracerInstalled ? 'Kész' : 'Előkészítés'}
          </span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              onSelectView('glossary');
              onCloseMobile();
            }}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
          >
            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
            Szótár
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Váltás világos módra' : 'Váltás sötét módra'}
            className="inline-flex h-8 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800 shrink-0"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Moon className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>

        <PWAInstallButton />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop persistent sidebar */}
      <aside className="hidden w-80 shrink-0 border-r border-slate-200 lg:block dark:border-slate-800">
        <div className="sticky top-14 h-[calc(100vh-3.5rem)]">{content}</div>
      </aside>

      {/* Mobile slide-over drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/50"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative z-10 h-full w-72 max-w-[85vw] border-r border-slate-200 shadow-xl dark:border-slate-800">
            {content}
          </aside>
        </div>
      )}
    </>
  );
};
