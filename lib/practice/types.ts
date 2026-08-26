// ─── Practice Papers Types ────────────────────────────────────────────────────

export type QuestionType =
  | 'mcq'
  | 'assertion-reason'
  | 'case-based'
  | 'competency-based'
  | 'hots'
  | 'numerical'
  | 'fill-in-blank'
  | 'match-the-following'
  | 'short-answer'
  | 'long-answer';

export type Difficulty = 'easy' | 'moderate' | 'hard';

export interface PracticeQuestion {
  index: number;
  type: QuestionType;
  text: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: Difficulty;
  topic: string;
  relatedConcept: string;
  revisionTip: string;
  marks?: number;
}

export interface PracticePaperConfig {
  classLevel: string;
  subject: string;
  book: string;
  chapter: string;
  chapterCode?: string;
  difficulty: Difficulty;
  questionCount: number;
}

export interface PracticePaper {
  id: string;
  user_id: string;
  class_level: string;
  subject: string;
  book: string;
  chapter: string;
  chapter_code: string | null;
  difficulty: Difficulty;
  question_count: number;
  questions: PracticeQuestion[];
  time_taken_sec: number | null;
  is_completed: boolean;
  created_at: string;
  completed_at: string | null;
}

export interface PracticeAttempt {
  id: string;
  paper_id: string;
  user_id: string;
  question_index: number;
  question_type: string;
  question_text: string;
  selected_answer: string | null;
  correct_answer: string;
  is_correct: boolean;
  is_skipped: boolean;
  is_bookmarked: boolean;
  difficulty: string;
  topic: string | null;
  explanation: string | null;
  related_concept: string | null;
  revision_tip: string | null;
  time_spent_sec: number | null;
  created_at: string;
}

export interface PracticeAnalytics {
  id: string;
  paper_id: string;
  user_id: string;
  total_questions: number;
  correct_count: number;
  incorrect_count: number;
  skipped_count: number;
  score: number;
  percentage: number;
  accuracy: number;
  time_taken_sec: number;
  overall_rating: string;
  topic_wise: Record<string, { total: number; correct: number; accuracy: number }>;
  type_wise: Record<string, { total: number; correct: number; accuracy: number }>;
  difficulty_wise: Record<string, { total: number; correct: number; accuracy: number }>;
  strengths: string[];
  weaknesses: string[];
  improvement_areas: string[];
  recommended_revision: string[];
  created_at: string;
}

export interface WrongQuestion {
  id: string;
  user_id: string;
  paper_id: string | null;
  question_index: number;
  question_type: string;
  question_text: string;
  selected_answer: string | null;
  correct_answer: string;
  subject: string;
  chapter: string;
  chapter_code: string | null;
  topic: string | null;
  difficulty: string;
  times_seen: number;
  times_correct: number;
  mastered: boolean;
  created_at: string;
  last_seen_at: string;
}

// ─── Shared Learning Knowledge Types ──────────────────────────────────────────

export interface SharedLearningData {
  completedChapters: { chapter: string; subject: string; ts: number }[];
  weakAreas: { topic: string; subject: string; chapter: string; severity: number }[];
  strongAreas: { topic: string; subject: string; accuracy: number }[];
  frequentlyMistakes: { question: string; correctAnswer: string; topic: string; count: number }[];
  wrongQuestionHistory: { question: string; correctAnswer: string; topic: string; ts: number }[];
  revisionHistory: { topic: string; subject: string; ts: number; score?: number }[];
  preferredDifficulty: Difficulty;
  learningPace: 'fast' | 'moderate' | 'slow';
  practicePerformance: { subject: string; avgScore: number; totalPapers: number; lastPracticed: string }[];
  quizPerformance: { subject: string; avgScore: number; totalQuizzes: number }[];
  aiTutorProgress: { topicsCovered: number; totalXP: number; level: number };
  recommendedRevisionTopics: string[];
}

// ─── Paper Generation Response ────────────────────────────────────────────────

export interface GeneratePaperResponse {
  paper: PracticePaper;
  fromCache?: boolean;
}

export interface SubmitPaperResponse {
  analytics: PracticeAnalytics;
  wrongQuestions: WrongQuestion[];
  xpEarned: number;
}

// ─── UI State Types ───────────────────────────────────────────────────────────

export type PracticeView = 'create' | 'solving' | 'result' | 'history';

export interface SolvingState {
  currentQuestion: number;
  answers: Record<number, string>;
  bookmarks: Set<number>;
  skipped: Set<number>;
  timeStarted: number;
  timeElapsed: number;
  isPaused: boolean;
}

// ─── Export Types ─────────────────────────────────────────────────────────────

export interface ExportOptions {
  includeAnswers: boolean;
  includeExplanations: boolean;
  includeSolutions: boolean;
  format: 'pdf' | 'print';
}
