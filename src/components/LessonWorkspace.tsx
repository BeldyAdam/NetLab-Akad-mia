import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Clipboard,
  FlaskConical,
  HelpCircle,
  Laptop,
  StickyNote,
} from 'lucide-react';
import type { Lesson, LessonNote, QuizResult } from '../types/curriculum';
import type { LessonTab } from '../store/useLearningStore';
import { GLOSSARY_TERMS } from '../data/glossary';
import { evaluateQuiz } from '../utils/networkLogic';
import { SimulationHost } from './simulations/SimulationHost';
import { NotesPanel } from './NotesPanel';

interface LessonWorkspaceProps {
  lesson: Lesson;
  hasPrev: boolean;
  hasNext: boolean;
  activeTab: LessonTab;
  isCompleted: boolean;
  completedLabSteps: string[];
  quizResult?: QuizResult;
  savedNote?: LessonNote;
  notesOpen: boolean;
  packetTracerInstalled: boolean;
  onSelectTab: (tab: LessonTab) => void;
  onToggleComplete: () => void;
  onToggleLabStep: (stepId: string) => void;
  onSaveQuizResult: (result: QuizResult) => void;
  onSaveNote: (lessonId: string, content: string) => void;
  onToggleNotes: () => void;
  onOpenGlossaryTerm: (glossaryId: string) => void;
  onOpenSetup: () => void;
  onNavigatePrev: () => void;
  onNavigateNext: () => void;
}

export const LessonWorkspace: React.FC<LessonWorkspaceProps> = ({
  lesson,
  hasPrev,
  hasNext,
  activeTab,
  isCompleted,
  completedLabSteps,
  quizResult,
  savedNote,
  notesOpen,
  packetTracerInstalled,
  onSelectTab,
  onToggleComplete,
  onToggleLabStep,
  onSaveQuizResult,
  onSaveNote,
  onToggleNotes,
  onOpenGlossaryTerm,
  onOpenSetup,
  onNavigatePrev,
  onNavigateNext,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>(
    quizResult?.selectedAnswers ?? {}
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedAnswers(quizResult?.selectedAnswers ?? {});
  }, [lesson.id, quizResult?.selectedAnswers]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = evaluateQuiz(lesson.quiz, selectedAnswers);
    onSaveQuizResult(result);
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
  };

  const allAnswered = lesson.quiz.every(
    (q) => typeof selectedAnswers[q.id] === 'number'
  );

  const relatedTerms = GLOSSARY_TERMS.filter((g) =>
    lesson.keyTerms.some((t) => t.toLowerCase() === g.term.toLowerCase())
  );

  const labProgressCount = lesson.packetTracerLab.steps.filter((s) =>
    completedLabSteps.includes(s.id)
  ).length;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Lesson Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>{lesson.number}. modul</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>{lesson.difficulty}</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span className="tabular-nums">{lesson.estimatedMinutes} perc</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onToggleNotes}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                notesOpen || (savedNote?.content?.trim().length ?? 0) > 0
                  ? 'border-sky-300 bg-sky-50 text-sky-800 dark:border-sky-800 dark:bg-sky-950/60 dark:text-sky-300'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <StickyNote className="h-3.5 w-3.5" aria-hidden="true" />
              <span>
                Jegyzetek
                {(savedNote?.content?.trim().length ?? 0) > 0 ? ' (van mentett)' : ''}
              </span>
            </button>

            <button
              type="button"
              onClick={onToggleComplete}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                isCompleted
                  ? 'border border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{isCompleted ? 'Lecke teljesítve' : 'Megjelölés késznek'}</span>
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            {lesson.number}. {lesson.title}
          </h1>
          <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {lesson.subtitle}
          </p>
        </div>

        {/* Segmented Tab Controls */}
        <div
          role="tablist"
          aria-label="Lecke nézetek"
          className="flex flex-wrap items-center gap-1 self-start rounded-lg bg-slate-100 p-1 dark:bg-slate-800/80"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'theory'}
            onClick={() => onSelectTab('theory')}
            className={`inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'theory'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
            Elmélet és szimuláció
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'lab'}
            onClick={() => onSelectTab('lab')}
            className={`inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'lab'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
            Packet Tracer Labor ({labProgressCount}/{lesson.packetTracerLab.steps.length})
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'quiz'}
            onClick={() => onSelectTab('quiz')}
            className={`inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'quiz'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
            Tudáspróba ({lesson.quiz.length} kérdés)
          </button>
        </div>
      </div>

      {/* Collapsible Built-in Note-Taking Panel */}
      {notesOpen && (
        <NotesPanel
          lessonId={lesson.id}
          lessonTitle={lesson.title}
          savedNote={savedNote}
          onSave={onSaveNote}
          onClose={onToggleNotes}
        />
      )}

      {/* TAB 1: Theory & Interactive Simulation */}
      {activeTab === 'theory' && (
        <div className="space-y-6">
          {/* Interactive Simulation Stage */}
          <section aria-labelledby="sim-heading" className="space-y-2.5">
            <div>
              <h2
                id="sim-heading"
                className="text-base font-semibold text-slate-900 dark:text-white"
              >
                {lesson.simulationTitle}
              </h2>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {lesson.simulationDescription}
              </p>
            </div>
            <SimulationHost type={lesson.simulationType} />
          </section>

          {/* Digestible Theory Cards */}
          <section aria-label="Elméleti áttekintés" className="grid gap-5 md:grid-cols-2">
            {lesson.theorySections.map((sec) => (
              <article
                key={sec.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
              >
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                    {sec.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {sec.content}
                  </p>
                  <ul className="mt-3.5 space-y-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                    {sec.keyPoints.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span
                          aria-hidden="true"
                          className="mt-1.5 h-1.5 w-1.5 rounded-full bg-sky-600 shrink-0 dark:bg-sky-400"
                        />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {sec.cliTip && (
                  <div className="mt-4 rounded-lg border border-slate-200 bg-slate-950 p-3 font-mono text-xs text-slate-100 dark:border-slate-800">
                    <div className="mb-1 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Cisco IOS CLI tipp</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(sec.id, sec.cliTip!)}
                        className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300"
                      >
                        {copiedId === sec.id ? (
                          <>
                            <Check className="h-3 w-3" aria-hidden="true" />
                            Másolva
                          </>
                        ) : (
                          <>
                            <Clipboard className="h-3 w-3" aria-hidden="true" />
                            Másolás
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="overflow-x-auto whitespace-pre-wrap leading-relaxed">
                      {sec.cliTip}
                    </pre>
                  </div>
                )}
              </article>
            ))}
          </section>

          {/* Related Glossary Terms */}
          {relatedTerms.length > 0 && (
            <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  A leckéhez kapcsolódó szakkifejezések (Szótár)
                </h3>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {relatedTerms.map((term) => (
                  <button
                    key={term.id}
                    type="button"
                    onClick={() => onOpenGlossaryTerm(term.id)}
                    className="rounded-lg border border-slate-200 p-3 text-left transition-colors hover:border-sky-400 hover:bg-slate-50 dark:border-slate-800 dark:hover:border-sky-600 dark:hover:bg-slate-800/60"
                  >
                    <div className="text-xs font-semibold text-sky-700 dark:text-sky-400">
                      {term.term}
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-600 dark:text-slate-300">
                      {term.definition}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* TAB 2: Side-by-Side Cisco Packet Tracer Lab */}
      {activeTab === 'lab' && (
        <div className="space-y-5">
          {!packetTracerInstalled && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-200">
              <div className="flex items-center gap-2.5">
                <Laptop className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  A gyakorlati laborokhoz nyisd meg a számítógépeden a <strong>Cisco Packet Tracer</strong> alkalmazást egymás mellett (side-by-side) ezzel az ablakkal!
                </span>
              </div>
              <button
                type="button"
                onClick={onOpenSetup}
                className="rounded-lg bg-amber-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-500 whitespace-nowrap shrink-0"
              >
                Telepítési útmutató
              </button>
            </div>
          )}

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {lesson.packetTracerLab.title}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {lesson.packetTracerLab.scenario}
            </p>

            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-950">
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Szükséges eszközök Packet Tracerben
              </div>
              <div className="mt-1.5 text-xs text-slate-600 dark:text-slate-300">
                {lesson.packetTracerLab.devicesNeeded.join(' · ')}
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {lesson.packetTracerLab.steps.map((step, idx) => {
                const checked = completedLabSteps.includes(step.id);
                return (
                  <div
                    key={step.id}
                    className={`rounded-lg border p-4 transition-colors ${
                      checked
                        ? 'border-emerald-200 bg-emerald-50/40 dark:border-emerald-900 dark:bg-emerald-950/20'
                        : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                    }`}
                  >
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggleLabStep(step.id)}
                        className="mt-0.5 h-4 w-4 accent-emerald-600"
                      />
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {idx + 1}. lépés
                        </div>
                        <p className="mt-0.5 text-sm text-slate-900 dark:text-slate-100">
                          {step.instruction}
                        </p>
                      </div>
                    </label>

                    {step.commandSnippet && (
                      <div className="mt-3 ml-7 rounded-lg bg-slate-950 p-3 font-mono text-xs text-slate-100">
                        <div className="mb-1 flex items-center justify-between text-[11px] text-slate-400">
                          <span>Parancsok / CLI</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(step.id, step.commandSnippet!)}
                            className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300"
                          >
                            {copiedId === step.id ? (
                              <>
                                <Check className="h-3 w-3" aria-hidden="true" />
                                Másolva
                              </>
                            ) : (
                              <>
                                <Clipboard className="h-3 w-3" aria-hidden="true" />
                                Másolás
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="overflow-x-auto whitespace-pre-wrap leading-relaxed">
                          {step.commandSnippet}
                        </pre>
                      </div>
                    )}

                    {step.verificationHint && (
                      <p className="mt-2 ml-7 text-xs text-slate-600 dark:text-slate-400">
                        <strong className="text-slate-800 dark:text-slate-200">Ellenőrzés: </strong>
                        {step.verificationHint}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
              <strong>Elvárt végeredmény: </strong>
              {lesson.packetTracerLab.expectedOutcome}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Interactive Knowledge Check Quiz */}
      {activeTab === 'quiz' && (
        <form
          onSubmit={handleQuizSubmit}
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Modulzáró tudáspróba
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Legalább 66%-os eredmény szükséges a sikeres teljesítéshez.
              </p>
            </div>
            {quizResult && (
              <div
                data-testid="quiz-result-summary"
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold tabular-nums ${
                  quizResult.passed
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                }`}
              >
                Eredmény: {quizResult.score}/{quizResult.total} (
                {quizResult.passed ? 'SIKERES' : 'ISMÉTLÉS JAVASOLT'})
              </div>
            )}
          </div>

          <div className="space-y-5">
            {lesson.quiz.map((q, qIdx) => {
              const chosen = selectedAnswers[q.id];
              const isSubmitted = !!quizResult;

              return (
                <fieldset
                  key={q.id}
                  className="rounded-lg border border-slate-200 p-4 dark:border-slate-800"
                >
                  <legend className="px-1 text-sm font-semibold text-slate-900 dark:text-white">
                    {qIdx + 1}. {q.question}
                  </legend>

                  <div className="mt-3 space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = chosen === optIdx;
                      const isCorrectOption = q.correctIndex === optIdx;

                      let styleClass =
                        'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800/60';
                      if (isSubmitted) {
                        if (isCorrectOption) {
                          styleClass =
                            'border-emerald-400 bg-emerald-50 text-emerald-950 dark:border-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-100';
                        } else if (isSelected && !isCorrectOption) {
                          styleClass =
                            'border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200';
                        }
                      } else if (isSelected) {
                        styleClass =
                          'border-sky-500 bg-sky-50 text-sky-950 dark:border-sky-500 dark:bg-sky-950/50 dark:text-sky-100';
                      }

                      return (
                        <label
                          key={optIdx}
                          className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-2.5 text-xs transition-colors ${styleClass}`}
                        >
                          <input
                            type="radio"
                            name={q.id}
                            value={optIdx}
                            checked={isSelected}
                            onChange={() =>
                              setSelectedAnswers((prev) => ({
                                ...prev,
                                [q.id]: optIdx,
                              }))
                            }
                            className="h-4 w-4 accent-sky-600"
                          />
                          <span>{opt}</span>
                        </label>
                      );
                    })}
                  </div>

                  {isSubmitted && (
                    <div className="mt-3 rounded-md bg-slate-50 p-3 text-xs leading-relaxed text-slate-700 dark:bg-slate-950 dark:text-slate-300">
                      <strong className="text-slate-900 dark:text-white">Magyarázat: </strong>
                      {q.explanation}
                    </div>
                  )}
                </fieldset>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="submit"
              disabled={!allAnswered}
              className="rounded-lg bg-sky-600 px-4 py-2 text-xs font-medium text-white hover:bg-sky-700 disabled:opacity-40 whitespace-nowrap shrink-0"
            >
              Válaszok ellenőrzése és mentése
            </button>
            {quizResult && (
              <button
                type="button"
                onClick={handleRetakeQuiz}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
              >
                Válaszok törlése (Újrakezdés)
              </button>
            )}
          </div>
        </form>
      )}

      {/* Footer Prev / Next Lesson Controls */}
      <div className="flex items-center justify-between border-t border-slate-200 pt-5 dark:border-slate-800">
        <button
          type="button"
          disabled={!hasPrev}
          onClick={onNavigatePrev}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Előző modul
        </button>
        <button
          type="button"
          disabled={!hasNext}
          onClick={onNavigateNext}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-40 dark:bg-sky-600 dark:hover:bg-sky-700 whitespace-nowrap shrink-0"
        >
          Következő modul
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
