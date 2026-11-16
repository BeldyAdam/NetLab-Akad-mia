import { useEffect, useMemo, useState } from 'react';
import { CURRICULUM_LESSONS } from './data/curriculum';
import { useLearningStore } from './store/useLearningStore';
import { calculateProgressStats } from './utils/networkLogic';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { LessonWorkspace } from './components/LessonWorkspace';
import { GlossaryView } from './components/GlossaryView';
import { ProgressDashboardView } from './components/ProgressDashboardView';
import { PacketTracerSetupView } from './components/PacketTracerSetupView';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { OfflineIndicator } from './components/OfflineIndicator';

export default function App() {
  const {
    activeView,
    activeLessonId,
    activeLessonTab,
    completedLessons,
    completedLabSteps,
    quizScores,
    notes,
    packetTracerInstalled,
    highlightedGlossaryId,
    notesOpen,
    theme,
    setActiveView,
    selectLesson,
    setActiveLessonTab,
    toggleLessonComplete,
    toggleLabStep,
    saveQuizResult,
    saveNote,
    setPacketTracerInstalled,
    openGlossaryTerm,
    setNotesOpen,
    toggleTheme,
    resetAllProgress,
    importProgressJson,
  } = useLearningStore();

  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Support ?autostart=1 to jump directly to active lesson
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      setActiveView('lesson');
    }
  }, [setActiveView]);

  // Ctrl+K / Cmd+K global search shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const progressStats = useMemo(
    () =>
      calculateProgressStats(
        CURRICULUM_LESSONS,
        completedLessons,
        quizScores,
        completedLabSteps
      ),
    [completedLessons, quizScores, completedLabSteps]
  );

  const activeLessonIndex = CURRICULUM_LESSONS.findIndex(
    (l) => l.id === activeLessonId
  );
  const safeIndex = activeLessonIndex >= 0 ? activeLessonIndex : 0;
  const currentLesson = CURRICULUM_LESSONS[safeIndex];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <TopBar
        activeView={activeView}
        onSelectView={setActiveView}
        onOpenSearch={() => setSearchOpen(true)}
        onToggleMobileMenu={() => setMobileMenuOpen((o) => !o)}
      />

      <div className="flex">
        <Sidebar
          lessons={CURRICULUM_LESSONS}
          activeLessonId={currentLesson.id}
          activeView={activeView}
          completedLessons={completedLessons}
          quizScores={quizScores}
          progress={progressStats}
          packetTracerInstalled={packetTracerInstalled}
          theme={theme}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
          onSelectLesson={(id) => selectLesson(id, 'theory')}
          onSelectView={setActiveView}
          onOpenSearch={() => setSearchOpen(true)}
          onToggleTheme={toggleTheme}
        />

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          <div className="mb-5 rounded-xl border border-slate-200 bg-white p-3.5 lg:hidden dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-900 dark:text-white">
                {progressStats.levelTitle}
              </span>
              <span className="font-mono font-bold text-sky-700 tabular-nums dark:text-sky-400">
                {progressStats.overallPercent}%
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-sky-600 transition-all duration-300 dark:bg-sky-500"
                style={{ width: `${progressStats.overallPercent}%` }}
              />
            </div>
          </div>

          {activeView === 'lesson' && (
            <LessonWorkspace
              lesson={currentLesson}
              hasPrev={safeIndex > 0}
              hasNext={safeIndex < CURRICULUM_LESSONS.length - 1}
              activeTab={activeLessonTab}
              isCompleted={completedLessons.includes(currentLesson.id)}
              completedLabSteps={completedLabSteps[currentLesson.id] ?? []}
              quizResult={quizScores[currentLesson.id]}
              savedNote={notes[currentLesson.id]}
              notesOpen={notesOpen}
              packetTracerInstalled={packetTracerInstalled}
              onSelectTab={setActiveLessonTab}
              onToggleComplete={() => toggleLessonComplete(currentLesson.id)}
              onToggleLabStep={(stepId) => toggleLabStep(currentLesson.id, stepId)}
              onSaveQuizResult={(result) => saveQuizResult(currentLesson.id, result)}
              onSaveNote={saveNote}
              onToggleNotes={() => setNotesOpen(!notesOpen)}
              onOpenGlossaryTerm={openGlossaryTerm}
              onOpenSetup={() => setActiveView('setup')}
              onNavigatePrev={() => {
                if (safeIndex > 0) {
                  selectLesson(CURRICULUM_LESSONS[safeIndex - 1].id, 'theory');
                }
              }}
              onNavigateNext={() => {
                if (safeIndex < CURRICULUM_LESSONS.length - 1) {
                  selectLesson(CURRICULUM_LESSONS[safeIndex + 1].id, 'theory');
                }
              }}
            />
          )}

          {activeView === 'glossary' && (
            <GlossaryView
              highlightedId={highlightedGlossaryId}
              onSelectLesson={(id) => selectLesson(id, 'theory')}
            />
          )}

          {activeView === 'progress' && (
            <ProgressDashboardView
              lessons={CURRICULUM_LESSONS}
              progress={progressStats}
              completedLessons={completedLessons}
              completedLabSteps={completedLabSteps}
              quizScores={quizScores}
              notes={notes}
              onSelectLesson={(id) => selectLesson(id, 'theory')}
              onResetAll={resetAllProgress}
              onImportJson={importProgressJson}
            />
          )}

          {activeView === 'setup' && (
            <PacketTracerSetupView
              installed={packetTracerInstalled}
              onSetInstalled={setPacketTracerInstalled}
              onStartLearning={() => setActiveView('lesson')}
            />
          )}
        </main>
      </div>

      <GlobalSearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectLesson={(id, tab) => selectLesson(id, tab ?? 'theory')}
        onSelectGlossary={(gId) => openGlossaryTerm(gId)}
      />

      <OfflineIndicator />
    </div>
  );
}
