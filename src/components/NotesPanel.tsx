import React, { useEffect, useState } from 'react';
import { Check, Save, StickyNote, Trash2, X } from 'lucide-react';
import type { LessonNote } from '../types/curriculum';

interface NotesPanelProps {
  lessonId: string;
  lessonTitle: string;
  savedNote?: LessonNote;
  onSave: (lessonId: string, content: string) => void;
  onClose: () => void;
}

export const NotesPanel: React.FC<NotesPanelProps> = ({
  lessonId,
  lessonTitle,
  savedNote,
  onSave,
  onClose,
}) => {
  const [draft, setDraft] = useState(savedNote?.content ?? '');
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    setDraft(savedNote?.content ?? '');
    setJustSaved(false);
  }, [lessonId, savedNote?.content]);

  const handleSave = () => {
    onSave(lessonId, draft);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  const handleClear = () => {
    setDraft('');
    onSave(lessonId, '');
  };

  const formattedDate = savedNote?.updatedAt
    ? new Date(savedNote.updatedAt).toLocaleString('hu-HU', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <section
      aria-label="Lecke jegyzetek"
      className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <StickyNote className="h-4 w-4 text-sky-600 dark:text-sky-400 shrink-0" aria-hidden="true" />
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Saját jegyzetek — {lessonTitle}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {formattedDate
                ? `Utoljára mentve: ${formattedDate}`
                : 'Helyben (offline) mentődik a böngésződben'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Jegyzetpanel bezárása"
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-3">
        <label htmlFor="lesson-note-textarea" className="sr-only">
          Jegyzet szövege
        </label>
        <textarea
          id="lesson-note-textarea"
          rows={5}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            onSave(lessonId, e.target.value);
          }}
          placeholder="Írd le a legfontosabb Cisco IOS parancsokat, IP-terveket vagy kérdéseidet ehhez a leckéhez..."
          className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:bg-slate-900"
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <span className="font-mono text-[11px] text-slate-500 tabular-nums dark:text-slate-400">
          {draft.length} karakter · Automatikus offline mentés
        </span>

        <div className="flex items-center gap-2">
          {draft.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              Törlés
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-sky-700 whitespace-nowrap shrink-0"
          >
            {justSaved ? (
              <>
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                Mentve
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" aria-hidden="true" />
                Jegyzet mentése
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
