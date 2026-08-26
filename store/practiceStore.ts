import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { PracticePaper, PracticePaperConfig, PracticeAnalytics, PracticeView, SolvingState, WrongQuestion } from '@/lib/practice/types';

interface PracticeState {
  view: PracticeView;
  setView: (v: PracticeView) => void;

  config: PracticePaperConfig;
  setConfig: (c: Partial<PracticePaperConfig>) => void;

  currentPaper: PracticePaper | null;
  setCurrentPaper: (p: PracticePaper | null) => void;

  solving: SolvingState;
  setSolvingState: (s: Partial<SolvingState>) => void;
  setAnswer: (index: number, answer: string) => void;
  toggleBookmark: (index: number) => void;
  toggleSkip: (index: number) => void;
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;

  isGenerating: boolean;
  setIsGenerating: (v: boolean) => void;
  generationError: string | null;
  setGenerationError: (e: string | null) => void;

  isSubmitting: boolean;
  setIsSubmitting: (v: boolean) => void;

  resultAnalytics: PracticeAnalytics | null;
  setResultAnalytics: (a: PracticeAnalytics | null) => void;

  wrongQuestions: WrongQuestion[];
  setWrongQuestions: (w: WrongQuestion[]) => void;

  history: PracticePaper[];
  historyLoading: boolean;
  loadHistory: () => Promise<void>;

  xpEarned: number;
  setXpEarned: (x: number) => void;

  resetPaper: () => void;
}

const initialSolving: SolvingState = {
  currentQuestion: 0,
  answers: {},
  bookmarks: new Set<number>(),
  skipped: new Set<number>(),
  timeStarted: 0,
  timeElapsed: 0,
  isPaused: false,
};

const defaultConfig: PracticePaperConfig = {
  classLevel: '9',
  subject: 'Mathematics',
  book: 'Ganita Manjari Part I',
  chapter: '',
  chapterCode: '',
  difficulty: 'moderate',
  questionCount: 20,
};

export const usePracticeStore = create<PracticeState>((set, get) => ({
  view: 'create',
  setView: (view) => set({ view }),

  config: defaultConfig,
  setConfig: (c) => set((s) => ({ config: { ...s.config, ...c } })),

  currentPaper: null,
  setCurrentPaper: (p) => set({ currentPaper: p }),

  solving: { ...initialSolving },
  setSolvingState: (s) => set((st) => ({ solving: { ...st.solving, ...s } })),
  setAnswer: (index, answer) =>
    set((st) => ({
      solving: { ...st.solving, answers: { ...st.solving.answers, [index]: answer } },
    })),
  toggleBookmark: (index) =>
    set((st) => {
      const newBookmarks = new Set(st.solving.bookmarks);
      if (newBookmarks.has(index)) newBookmarks.delete(index);
      else newBookmarks.add(index);
      return { solving: { ...st.solving, bookmarks: newBookmarks } };
    }),
  toggleSkip: (index) =>
    set((st) => {
      const newSkipped = new Set(st.solving.skipped);
      if (newSkipped.has(index)) newSkipped.delete(index);
      else newSkipped.add(index);
      return { solving: { ...st.solving, skipped: newSkipped } };
    }),
  goToQuestion: (index) =>
    set((st) => ({ solving: { ...st.solving, currentQuestion: index } })),
  nextQuestion: () =>
    set((st) => {
      const paper = st.currentPaper;
      if (!paper) return {};
      const next = Math.min(st.solving.currentQuestion + 1, paper.questions.length - 1);
      return { solving: { ...st.solving, currentQuestion: next } };
    }),
  prevQuestion: () =>
    set((st) => ({
      solving: { ...st.solving, currentQuestion: Math.max(st.solving.currentQuestion - 1, 0) },
    })),

  isGenerating: false,
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  generationError: null,
  setGenerationError: (generationError) => set({ generationError }),

  isSubmitting: false,
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),

  resultAnalytics: null,
  setResultAnalytics: (a) => set({ resultAnalytics: a }),

  wrongQuestions: [],
  setWrongQuestions: (w) => set({ wrongQuestions: w }),

  history: [],
  historyLoading: false,
  loadHistory: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { set({ history: [] }); return; }

    set({ historyLoading: true });
    const { data } = await supabase
      .from('practice_papers')
      .select('id, user_id, class_level, subject, book, chapter, chapter_code, difficulty, question_count, questions, time_taken_sec, is_completed, created_at, completed_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    set({ history: (data as PracticePaper[]) || [], historyLoading: false });
  },

  xpEarned: 0,
  setXpEarned: (x) => set({ xpEarned: x }),

  resetPaper: () =>
    set({
      currentPaper: null,
      solving: { ...initialSolving },
      resultAnalytics: null,
      wrongQuestions: [],
      xpEarned: 0,
      view: 'create',
    }),
}));
