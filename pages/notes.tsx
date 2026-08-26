import React, { useState, useEffect, useCallback } from 'react';
import { BookOpen, Loader2, Clock, Trash2, Eye } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import NotesForm, { type NotesConfig } from '@/components/features/NotesForm';
import NotesViewer from '@/components/features/NotesViewer';
import AuthModal from '@/components/auth/AuthModal';
import { useAuthStore } from '@/store/authStore';
import { useFeedbackStore } from '@/store/feedbackStore';
import { supabase } from '@/lib/supabase';
import { cn } from '@/utils/helpers';
import { getNotesRemaining, incrementNotesGen, hasReachedNotesLimit } from '@/lib/guestLimits';
import toast from 'react-hot-toast';
import type { GeneratedNote, NotesData } from '@/types/database';

export default function NotesPage() {
  const { user, isGuest } = useAuthStore();
  const showAiRatingFor = useFeedbackStore(s => s.showAiRatingFor);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState<NotesData | null>(null);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [currentRating, setCurrentRating] = useState<string | null>(null);
  const [history, setHistory] = useState<GeneratedNote[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [authModal, setAuthModal] = useState<'login' | 'signup' | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [remaining, setRemaining] = useState(5);

  const fetchHistory = useCallback(async () => {
    if (!user) return;
    setHistoryLoading(true);
    const { data } = await supabase
      .from('generated_notes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);
    setHistory((data as GeneratedNote[]) || []);
    setHistoryLoading(false);
  }, [user?.id]);

  useEffect(() => {
    if (user) fetchHistory();
    else setHistoryLoading(false);
    setRemaining(getNotesRemaining());
  }, [user, fetchHistory]);

  async function handleGenerate(config: NotesConfig) {
    // Guest limit check
    if (isGuest && !user) {
      if (hasReachedNotesLimit()) {
        toast.error('Daily limit reached! Sign up for unlimited notes.');
        setAuthModal('signup');
        return;
      }
      incrementNotesGen();
      setRemaining(getNotesRemaining());
    }

    // Logged-in user rate limit (1 per min)
    if (user && !isGuest) {
      const lastCall = localStorage.getItem('sn_notes_last_call');
      if (lastCall) {
        const elapsed = Date.now() - parseInt(lastCall, 10);
        if (elapsed < 60000) {
          const waitSec = Math.ceil((60000 - elapsed) / 1000);
          toast.error(`Please wait ${waitSec}s before generating again.`);
          return;
        }
      }
      localStorage.setItem('sn_notes_last_call', String(Date.now()));
    }

    setLoading(true);
    try {
      const res = await fetch('/api/notes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to generate notes');
      const notesData: NotesData = data.notes;
      setNotes(notesData);
      setCurrentRating(null);
      // Save to DB only for logged-in users
      if (user) {
        const { data: saved } = await supabase
          .from('generated_notes')
          .insert({
            user_id: user.id,
            class_level: config.classLevel,
            subject: config.subject,
            book: config.book,
            chapter: config.chapter,
            chapter_number: config.chapterNumber,
            instructions: config.instructions || null,
            pages: notesData.pages,
            total_pages: notesData.pages.length,
            current_page: 1,
          })
          .select()
          .single();
        if (saved) {
          setActiveNoteId(saved.id);
          fetchHistory();
        }
      }
      toast.success('Notes generated successfully!');
      showAiRatingFor('ai-notes');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate notes');
    } finally {
      setLoading(false);
    }
  }

  async function handleRate(rating: 'up' | 'down') {
    if (!activeNoteId) return;
    setCurrentRating(rating);
    await supabase
      .from('generated_notes')
      .update({ rating })
      .eq('id', activeNoteId);
  }

  async function handleShare() {
    if (!activeNoteId) return;
    const { data } = await supabase.rpc('generate_share_token', {
      p_table: 'notes',
      p_id: activeNoteId,
    });
    if (data) {
      const url = `${window.location.origin}/notes/shared/${data}`;
      navigator.clipboard.writeText(url);
      toast.success('Share link copied to clipboard!');
    }
  }

  async function deleteNote(id: string) {
    await supabase.from('generated_notes').delete().eq('id', id);
    setHistory(prev => prev.filter(n => n.id !== id));
    if (activeNoteId === id) {
      setNotes(null);
      setActiveNoteId(null);
    }
    toast.success('Deleted');
  }

  function loadNote(note: GeneratedNote) {
    const notesData: NotesData = {
      title: note.chapter,
      pages: note.pages as unknown as NotesData['pages'],
    };
    setNotes(notesData);
    setActiveNoteId(note.id);
    setCurrentRating(note.rating);
    setShowHistory(false);
  }

  return (
    <Layout
      title="Generate Notes | SolveNCERT"
      description="AI-powered handwritten-style notes for NCERT Class 9 chapters"
      canonical="/notes"
    >
      <div className="max-w-screen-lg mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-display font-bold text-[var(--text-primary)] flex items-center gap-2">
            <BookOpen size={22} className="text-blue-500" />
            Generate Notes
          </h1>
          <div className="flex items-center gap-3">
            {!user && (
              <span className="text-[11px] text-[var(--text-muted)] bg-[var(--surface-2)] px-2.5 py-1 rounded-full">
                {remaining}/5 free today
              </span>
            )}
            {user && (
              <button
                onClick={() => setShowHistory(h => !h)}
                className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                <Clock size={14} />
                {showHistory ? 'New Notes' : 'History'}
              </button>
            )}
          </div>
        </div>

        {!notes || showHistory ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                {showHistory ? 'Your Notes History' : 'Create New Notes'}
              </h2>
              {showHistory ? (
                historyLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 size={20} className="animate-spin text-blue-500" />
                  </div>
                ) : history.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen size={32} className="mx-auto text-blue-300 mb-3" />
                    <p className="text-sm text-[var(--text-muted)]">No notes yet. Generate your first set!</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {history.map(note => (
                      <div
                        key={note.id}
                        className={cn(
                          'p-3 rounded-xl border cursor-pointer transition-all hover:shadow-sm',
                          activeNoteId === note.id
                            ? 'border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-950/20'
                            : 'border-[var(--border)] hover:border-blue-200 dark:hover:border-blue-800'
                        )}
                        onClick={() => loadNote(note)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[var(--text-primary)] truncate">{note.chapter}</p>
                            <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                              {note.subject} &middot; {note.total_pages} pages &middot; {new Date(note.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={e => { e.stopPropagation(); loadNote(note); }}
                              className="p-1.5 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-blue-500 transition-colors"
                            >
                              <Eye size={13} />
                            </button>
                            <button
                              onClick={e => { e.stopPropagation(); deleteNote(note.id); }}
                              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-[var(--text-muted)] hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <NotesForm onGenerate={handleGenerate} loading={loading} />
              )}
            </div>

            {!showHistory && (
              <div className="card p-6 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mb-4">
                  <BookOpen size={36} className="text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  Handwritten-Style Notes
                </h3>
                <p className="text-sm text-[var(--text-muted)] max-w-xs">
                  Select your chapter and let AI generate comprehensive notes in a beautiful ruled notebook format.
                  Just like writing on a real copy!
                </p>
                <div className="mt-6 space-y-2 text-left text-xs text-[var(--text-muted)]">
                  <p className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-500 text-[10px]">1</span> Select class, subject & chapter</p>
                  <p className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-500 text-[10px]">2</span> Add any special instructions</p>
                  <p className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-500 text-[10px]">3</span> Generate & study with ruled notes</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <NotesViewer
              notes={notes}
              noteId={activeNoteId || undefined}
              onRate={handleRate}
              currentRating={currentRating}
              onShare={handleShare}
            />
          </div>
        )}
      </div>

      {authModal && <AuthModal mode={authModal} onClose={() => setAuthModal(null)} onSwitch={m => setAuthModal(m)} />}
    </Layout>
  );
}
