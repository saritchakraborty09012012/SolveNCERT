import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export interface BookmarkInput {
  subject: string;
  chapterCode: string;
  chapterSlug: string;
  chapterTitle: string;
  questionId: string;
  questionNumber: string;
  questionText: string;
}

export interface BookmarkRow {
  id: string;
  subject: string;
  chapter_code: string;
  chapter_slug: string;
  chapter_title: string;
  question_id: string;
  question_number: string;
  question_text: string;
  created_at: string;
}

interface BookmarksState {
  // Set of `${subject}:${chapterCode}:${questionId}` for O(1) "is this bookmarked" checks
  keys: Set<string>;
  items: BookmarkRow[];
  loaded: boolean;
  loading: boolean;
  fetchAll: (userId: string) => Promise<void>;
  toggle: (userId: string, b: BookmarkInput) => Promise<void>;
  remove: (userId: string, id: string) => Promise<void>;
  isBookmarked: (subject: string, chapterCode: string, questionId: string) => boolean;
  reset: () => void;
}

function keyOf(subject: string, chapterCode: string, questionId: string) {
  return `${subject}:${chapterCode}:${questionId}`;
}

export const useBookmarksStore = create<BookmarksState>((set, get) => ({
  keys: new Set(),
  items: [],
  loaded: false,
  loading: false,

  fetchAll: async (userId: string) => {
    if (get().loading) return;
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error || !data) { set({ loading: false, loaded: true }); return; }
      const rows = data as BookmarkRow[];
      set({
        items: rows,
        keys: new Set(rows.map(r => keyOf(r.subject, r.chapter_code, r.question_id))),
        loaded: true, loading: false,
      });
    } catch {
      set({ loading: false, loaded: true });
    }
  },

  toggle: async (userId: string, b: BookmarkInput) => {
    const k = keyOf(b.subject, b.chapterCode, b.questionId);
    const already = get().keys.has(k);

    if (already) {
      // optimistic remove
      set(s => ({
        keys: new Set([...s.keys].filter(x => x !== k)),
        items: s.items.filter(i => keyOf(i.subject, i.chapter_code, i.question_id) !== k),
      }));
      await supabase.from('bookmarks').delete()
        .eq('user_id', userId).eq('subject', b.subject)
        .eq('chapter_code', b.chapterCode).eq('question_id', b.questionId);
    } else {
      // optimistic add (temp id, replaced on next fetch)
      const optimistic: BookmarkRow = {
        id: `temp-${k}`, subject: b.subject, chapter_code: b.chapterCode,
        chapter_slug: b.chapterSlug, chapter_title: b.chapterTitle,
        question_id: b.questionId, question_number: b.questionNumber,
        question_text: b.questionText, created_at: new Date().toISOString(),
      };
      set(s => ({ keys: new Set([...s.keys, k]), items: [optimistic, ...s.items] }));
      const { error } = await supabase.from('bookmarks').insert({
        user_id: userId, subject: b.subject, chapter_code: b.chapterCode,
        chapter_slug: b.chapterSlug, chapter_title: b.chapterTitle,
        question_id: b.questionId, question_number: b.questionNumber,
        question_text: b.questionText,
      });
      if (error) {
        // roll back on failure (e.g. offline)
        set(s => ({
          keys: new Set([...s.keys].filter(x => x !== k)),
          items: s.items.filter(i => i.id !== optimistic.id),
        }));
      }
    }
  },

  remove: async (userId: string, id: string) => {
    const item = get().items.find(i => i.id === id);
    set(s => ({ items: s.items.filter(i => i.id !== id) }));
    if (item) {
      const k = keyOf(item.subject, item.chapter_code, item.question_id);
      set(s => ({ keys: new Set([...s.keys].filter(x => x !== k)) }));
    }
    await supabase.from('bookmarks').delete().eq('id', id).eq('user_id', userId);
  },

  isBookmarked: (subject, chapterCode, questionId) => get().keys.has(keyOf(subject, chapterCode, questionId)),

  reset: () => set({ keys: new Set(), items: [], loaded: false, loading: false }),
}));
