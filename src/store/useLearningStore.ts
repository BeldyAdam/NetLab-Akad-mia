import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LessonNote, QuizResult } from '../types/curriculum';

export type ActiveView = 'lesson' | 'glossary' | 'progress' | 'setup';
export type LessonTab = 'theory' | 'lab' | 'quiz';

interface LearningState {
  activeView: ActiveView;
  activeLessonId: string;
  activeLessonTab: LessonTab;
  completedLessons: string[];
  completedLabSteps: Record<string, string[]>;
  quizScores: Record<string, QuizResult>;
  notes: Record<string, LessonNote>;
  packetTracerInstalled: boolean;
  highlightedGlossaryId: string | null;
  notesOpen: boolean;
  theme: 'light' | 'dark';

  setActiveView: (view: ActiveView) => void;
  selectLesson: (lessonId: string, tab?: LessonTab) => void;
  setActiveLessonTab: (tab: LessonTab) => void;
  toggleLessonComplete: (lessonId: string) => void;
  toggleLabStep: (lessonId: string, stepId: string) => void;
  saveQuizResult: (lessonId: string, result: QuizResult) => void;
  saveNote: (lessonId: string, content: string) => void;
  setPacketTracerInstalled: (installed: boolean) => void;
  openGlossaryTerm: (glossaryId: string) => void;
  setNotesOpen: (open: boolean) => void;
  toggleTheme: () => void;
  resetAllProgress: () => void;
  importProgressJson: (jsonText: string) => boolean;
}

const initialState = {
  activeView: 'lesson' as ActiveView,
  activeLessonId: 'module-1',
  activeLessonTab: 'theory' as LessonTab,
  completedLessons: [] as string[],
  completedLabSteps: {} as Record<string, string[]>,
  quizScores: {} as Record<string, QuizResult>,
  notes: {} as Record<string, LessonNote>,
  packetTracerInstalled: false,
  highlightedGlossaryId: null as string | null,
  notesOpen: false,
  theme: 'light' as 'light' | 'dark',
};

export const useLearningStore = create<LearningState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setActiveView: (view) => set({ activeView: view }),

      selectLesson: (lessonId, tab = 'theory') =>
        set({
          activeView: 'lesson',
          activeLessonId: lessonId,
          activeLessonTab: tab,
        }),

      setActiveLessonTab: (tab) => set({ activeLessonTab: tab }),

      toggleLessonComplete: (lessonId) => {
        const current = get().completedLessons;
        const exists = current.includes(lessonId);
        set({
          completedLessons: exists
            ? current.filter((id) => id !== lessonId)
            : [...current, lessonId],
        });
      },

      toggleLabStep: (lessonId, stepId) => {
        const currentMap = get().completedLabSteps;
        const steps = currentMap[lessonId] ?? [];
        const exists = steps.includes(stepId);
        set({
          completedLabSteps: {
            ...currentMap,
            [lessonId]: exists
              ? steps.filter((id) => id !== stepId)
              : [...steps, stepId],
          },
        });
      },

      saveQuizResult: (lessonId, result) => {
        const prevScores = get().quizScores;
        const prevCompleted = get().completedLessons;
        const nextCompleted =
          result.passed && !prevCompleted.includes(lessonId)
            ? [...prevCompleted, lessonId]
            : prevCompleted;

        set({
          quizScores: {
            ...prevScores,
            [lessonId]: result,
          },
          completedLessons: nextCompleted,
        });
      },

      saveNote: (lessonId, content) => {
        const prevNotes = get().notes;
        set({
          notes: {
            ...prevNotes,
            [lessonId]: {
              content,
              updatedAt: new Date().toISOString(),
            },
          },
        });
      },

      setPacketTracerInstalled: (installed) =>
        set({ packetTracerInstalled: installed }),

      openGlossaryTerm: (glossaryId) =>
        set({
          activeView: 'glossary',
          highlightedGlossaryId: glossaryId,
        }),

      setNotesOpen: (open) => set({ notesOpen: open }),

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),

      resetAllProgress: () =>
        set({
          ...initialState,
          theme: get().theme,
        }),

      importProgressJson: (jsonText) => {
        try {
          const parsed = JSON.parse(jsonText);
          if (typeof parsed !== 'object' || parsed === null) return false;
          set({
            activeLessonId:
              typeof parsed.activeLessonId === 'string'
                ? parsed.activeLessonId
                : get().activeLessonId,
            completedLessons: Array.isArray(parsed.completedLessons)
              ? parsed.completedLessons
              : get().completedLessons,
            completedLabSteps:
              parsed.completedLabSteps && typeof parsed.completedLabSteps === 'object'
                ? parsed.completedLabSteps
                : get().completedLabSteps,
            quizScores:
              parsed.quizScores && typeof parsed.quizScores === 'object'
                ? parsed.quizScores
                : get().quizScores,
            notes:
              parsed.notes && typeof parsed.notes === 'object'
                ? parsed.notes
                : get().notes,
            packetTracerInstalled:
              typeof parsed.packetTracerInstalled === 'boolean'
                ? parsed.packetTracerInstalled
                : get().packetTracerInstalled,
          });
          return true;
        } catch {
          return false;
        }
      },
    }),
    {
      name: 'netlab-akademia-storage-v1',
    }
  )
);
