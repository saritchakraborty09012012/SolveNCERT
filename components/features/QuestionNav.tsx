import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ListOrdered, X } from 'lucide-react';

export interface NavQuestion { id: string; number: string; section?: string; }

function scrollToQuestion(id: string) {
  const el = document.getElementById(`q-${id}`);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Sticky question-number jump nav.
 * Desktop (xl+): sticky sidebar panel with a grid of question numbers.
 * Mobile/tablet: floating round button bottom-right that expands into a small panel.
 * Pass the already-scoped question list (per exercise for maths, per active tab for science).
 */
export default function QuestionNav({ questions, label = 'Questions' }: { questions: NavQuestion[]; label?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    if (localStorage.getItem('sn_question_nav_hint_dismissed') === '1') return;
    const first = window.setTimeout(() => { setShowHint(true); window.setTimeout(() => setShowHint(false), 3500); }, 2200);
    return () => window.clearTimeout(first);
  }, []);
  if (!questions || questions.length === 0) return null;
  const groups = questions.reduce<{ name: string; items: NavQuestion[] }[]>((all, q) => {
    const name = q.section || label;
    const group = all.find(g => g.name === name);
    if (group) group.items.push(q); else all.push({ name, items: [q] });
    return all;
  }, []);

  return (
    <>
      {/* Desktop sticky panel */}
      <aside className="hidden lg:block w-44 flex-shrink-0">
        <div className="sticky top-28 card p-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2 flex items-center gap-1">
            <ListOrdered size={11} /> {label}
          </p>
          <div className="max-h-[65vh] overflow-y-auto scrollbar-hide space-y-3">
            {groups.map(group => <div key={group.name}>
              {groups.length > 1 && <p className="mb-1 text-[9px] font-semibold leading-tight text-blue-600 dark:text-blue-300">{group.name}</p>}
              <div className="grid grid-cols-4 gap-1">{group.items.map(q => (
              <button
                key={q.id}
                onClick={() => scrollToQuestion(q.id)}
                title={`Jump to Q${q.number}`}
                className="min-w-0 w-full min-h-8 px-1 py-1 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-[10px] font-semibold text-[var(--text-secondary)] flex items-center justify-center text-center break-words transition-colors"
              >
                {q.number}
              </button>
              ))}</div></div>)}
          </div>
        </div>
      </aside>

      {/* Mobile / tablet edge handle + expandable panel */}
      {mounted && typeof document !== 'undefined' && createPortal(
        <div className="lg:hidden fixed right-0 top-1/2 -translate-y-1/2 z-40 flex items-center">
          {mobileOpen && (
            <div className="card p-3 w-56 max-h-72 overflow-y-auto shadow-xl border border-[var(--border)] flex-shrink-0">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Jump to Question</p>
                <button onClick={() => setMobileOpen(false)} aria-label="Close question nav">
                  <X size={14} className="text-[var(--text-muted)]" />
                </button>
              </div>
              <div className="space-y-3">
                {groups.map(group => <div key={group.name}>
                  {groups.length > 1 && <p className="mb-1 text-[10px] font-semibold text-blue-600 dark:text-blue-300">{group.name}</p>}
                  <div className="grid grid-cols-5 gap-1">{group.items.map(q => (
                  <button
                    key={q.id}
                    onClick={() => { scrollToQuestion(q.id); setMobileOpen(false); }}
                    className="min-w-0 w-full min-h-9 px-1 py-1 rounded-lg bg-[var(--surface-2)] text-[10px] font-semibold text-[var(--text-secondary)] flex items-center justify-center text-center break-words"
                  >
                    {q.number}
                  </button>
                  ))}</div></div>)}
              </div>
            </div>
          )}
          {showHint && !mobileOpen && <div className="absolute right-7 top-1/2 -translate-y-1/2 w-36 rounded-2xl bg-[var(--surface-0)] text-[var(--text-secondary)] px-3 py-2 text-[10px] font-semibold shadow-soft-lg animate-fade-in"><button onClick={() => { localStorage.setItem('sn_question_nav_hint_dismissed', '1'); setShowHint(false); }} aria-label="Dismiss navigation hint" className="absolute right-2 top-2 rounded-full p-1 hover:bg-[var(--surface-2)]"><X size={11} /></button><span className="block pr-3">Jump to any question</span><span className="absolute -right-1 top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-l-4 border-l-[var(--accent-amber)]" /></div>}
          <button
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle question navigator"
            className="w-3.5 h-20 rounded-l-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center transition-colors flex-shrink-0"
          >
            {mobileOpen ? <X size={18} /> : <ListOrdered size={18} />}
          </button>
        </div>,
        document.body
      )}
    </>
  );
}
