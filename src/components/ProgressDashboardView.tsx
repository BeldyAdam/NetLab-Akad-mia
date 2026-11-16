import React, { useState } from 'react';
import { Download, RotateCcw, Upload } from 'lucide-react';
import type { Lesson, LessonNote, ProgressStats, QuizResult } from '../types/curriculum';

interface ProgressDashboardViewProps {
  lessons: Lesson[];
  progress: ProgressStats;
  completedLessons: string[];
  completedLabSteps: Record<string, string[]>;
  quizScores: Record<string, QuizResult>;
  notes: Record<string, LessonNote>;
  onSelectLesson: (lessonId: string) => void;
  onResetAll: () => void;
  onImportJson: (jsonText: string) => boolean;
}

export const ProgressDashboardView: React.FC<ProgressDashboardViewProps> = ({
  lessons,
  progress,
  completedLessons,
  completedLabSteps,
  quizScores,
  notes,
  onSelectLesson,
  onResetAll,
  onImportJson,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExport = () => {
    const raw = localStorage.getItem('netlab-akademia-storage-v1');
    const data = raw ? JSON.parse(raw)?.state ?? {} : {};
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `netlab-haladas-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = onImportJson(String(reader.result ?? ''));
      setImportStatus(
        ok ? 'Mentés sikeresen visszaállítva!' : 'Hibás JSON mentési fájl.'
      );
      setTimeout(() => setImportStatus(null), 3000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="border-b border-slate-200 pb-5 dark:border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Tanulási Haladás és Jegyzetek Áttekintése
        </h1>
        <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
          Minden előrehaladásod, kvízeredményed és saját jegyzeted automatikusan mentésre kerül a helyi tárhelyre offline módban is.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs text-slate-500 dark:text-slate-400">Elért szint</div>
          <div className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
            {progress.levelTitle}
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-sky-700 tabular-nums dark:text-sky-400">
            {progress.overallPercent}%
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs text-slate-500 dark:text-slate-400">Befejezett leckék</div>
          <div className="mt-2 font-mono text-2xl font-bold text-slate-900 tabular-nums dark:text-white">
            {progress.completedLessonsCount} / {progress.totalLessonsCount}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs text-slate-500 dark:text-slate-400">Sikeres kvízek</div>
          <div className="mt-2 font-mono text-2xl font-bold text-emerald-700 tabular-nums dark:text-emerald-400">
            {progress.passedQuizzesCount} / {progress.totalLessonsCount}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs text-slate-500 dark:text-slate-400">Packet Tracer lépések</div>
          <div className="mt-2 font-mono text-2xl font-bold text-slate-900 tabular-nums dark:text-white">
            {progress.completedLabStepsCount} / {progress.totalLabStepsCount}
          </div>
        </div>
      </div>

      {/* Module Breakdown Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-5 py-3.5 dark:border-slate-800">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Modulok részletes állapota
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                <th className="px-5 py-3 font-medium">Modul</th>
                <th className="px-5 py-3 font-medium">Állapot</th>
                <th className="px-5 py-3 font-medium">Labor</th>
                <th className="px-5 py-3 font-medium">Kvíz</th>
                <th className="px-5 py-3 font-medium">Jegyzet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {lessons.map((lesson) => {
                const done = completedLessons.includes(lesson.id);
                const labDone = (completedLabSteps[lesson.id] ?? []).length;
                const labTotal = lesson.packetTracerLab.steps.length;
                const quiz = quizScores[lesson.id];
                const hasNote = (notes[lesson.id]?.content?.trim().length ?? 0) > 0;

                return (
                  <tr
                    key={lesson.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                  >
                    <td className="px-5 py-3">
                      <button
                        type="button"
                        onClick={() => onSelectLesson(lesson.id)}
                        className="font-semibold text-sky-700 hover:underline dark:text-sky-400 text-left"
                      >
                        {lesson.number}. {lesson.title}
                      </button>
                    </td>
                    <td className="px-5 py-3 font-medium">
                      {done ? (
                        <span className="text-emerald-700 dark:text-emerald-400">Teljesítve</span>
                      ) : (
                        <span className="text-slate-500 dark:text-slate-400">Folyamatban</span>
                      )}
                    </td>
                    <td className="px-5 py-3 font-mono tabular-nums text-slate-700 dark:text-slate-300">
                      {labDone}/{labTotal}
                    </td>
                    <td className="px-5 py-3 font-mono tabular-nums">
                      {quiz ? (
                        <span
                          className={
                            quiz.passed
                              ? 'font-semibold text-emerald-700 dark:text-emerald-400'
                              : 'text-amber-700 dark:text-amber-400'
                          }
                        >
                          {quiz.score}/{quiz.total}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-300">
                      {hasNote ? 'Mentve' : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Offline Backup / Export / Reset */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Adatmentés és Visszaállítás (Offline JSON)
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Exportáld a haladásodat és jegyzeteidet egy helyi fájlba, vagy vidd át másik gépre.
          </p>
          {importStatus && (
            <p className="mt-1.5 text-xs font-medium text-sky-700 dark:text-sky-400">
              {importStatus}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            Mentés exportálása
          </button>

          <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap shrink-0">
            <Upload className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Mentés betöltése</span>
            <input
              type="file"
              accept="application/json"
              onChange={handleImportFile}
              className="sr-only"
            />
          </label>

          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40 whitespace-nowrap shrink-0"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Haladás nullázása
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onResetAll();
                setConfirmReset(false);
              }}
              className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700 whitespace-nowrap shrink-0"
            >
              Biztosan törlöm az összes haladást
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
