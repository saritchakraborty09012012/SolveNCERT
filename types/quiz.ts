export type QuizDifficulty = 'easy' | 'moderate' | 'hard';

export type QuestionType =
  | 'mcq'
  | 'assertion_reason'
  | 'case_based'
  | 'competency'
  | 'hots'
  | 'numerical'
  | 'fill_blank'
  | 'match_following'
  | 'short_answer'
  | 'long_answer';

export type QuizStatus = 'in_progress' | 'completed' | 'abandoned';

export interface QuizOption {
  label: string;
  text: string;
}

export interface MatchPair {
  left: string;
  right: string;
}

export interface QuizQuestion {
  id: string;
  index: number;
  type: QuestionType;
  text: string;
  options?: QuizOption[];
  matchPairs?: MatchPair[];
  correctAnswer: string;
  studentAnswer?: string;
  isCorrect?: boolean;
  isSkipped: boolean;
  explanation: string;
  relatedConcept: string;
  revisionTip: string;
  difficulty: QuizDifficulty;
  topic: string;
  marks: number;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  classNum: number;
  subject: string;
  book: string;
  bookSlug: string;
  chapter?: string;
  chapterSlug?: string;
  difficulty: QuizDifficulty;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  score: number;
  percentage: number;
  timeTakenSeconds: number;
  timeLimitSeconds: number;
  questionTypes: QuestionType[];
  status: QuizStatus;
  startedAt: string;
  completedAt?: string;
  createdAt: string;
  questions: QuizQuestion[];
}

export interface QuizResults {
  attempt: QuizAttempt;
  analytics: QuizAnalyticsSummary;
  insights: QuizInsights;
}

export interface QuizAnalyticsSummary {
  score: number;
  percentage: number;
  accuracy: number;
  timeTaken: string;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  totalQuestions: number;
  performanceRating: string;
  performanceColor: string;
}

export interface QuizInsights {
  strengths: string[];
  weaknesses: string[];
  topicAccuracy: { topic: string; accuracy: number; attempted: number }[];
  typeAccuracy: { type: string; accuracy: number; attempted: number }[];
  difficultyPerformance: { difficulty: string; accuracy: number; attempted: number }[];
  recommendedRevision: string[];
  frequentMistakes: string[];
}

export interface QuizConfig {
  classNum: number;
  subject: string;
  book: string;
  bookSlug: string;
  chapter?: string;
  chapterSlug?: string;
  difficulty: QuizDifficulty;
  numQuestions: number;
}

export interface QuizCreationState {
  step: number;
  config: QuizConfig;
  isGenerating: boolean;
  error?: string;
}

export interface WrongQuestion {
  id: string;
  userId: string;
  questionText: string;
  questionType: QuestionType;
  subject: string;
  chapter?: string;
  chapterSlug?: string;
  correctAnswer: string;
  studentAnswer?: string;
  explanation: string;
  relatedConcept: string;
  timesSeen: number;
  timesCorrect: number;
  mastered: boolean;
  lastSeenAt: string;
  createdAt: string;
}

export interface LearningProfileData {
  id: string;
  userId: string;
  completedChapters: string[];
  completedTopics: string[];
  weakAreas: string[];
  strongAreas: string[];
  preferredDifficulty: QuizDifficulty;
  preferredLanguage: string;
  learningPace: number;
  totalQuizzesTaken: number;
  totalQuestionsAttempted: number;
  overallAccuracy: number;
  streakDays: number;
  lastQuizDate?: string;
  xpEarned: number;
  level: number;
  badges: string[];
  createdAt: string;
  updatedAt: string;
}

export interface QuizHistoryEntry {
  id: string;
  subject: string;
  chapter?: string;
  difficulty: QuizDifficulty;
  totalQuestions: number;
  correctCount: number;
  percentage: number;
  timeTakenSeconds: number;
  status: QuizStatus;
  createdAt: string;
}

export interface QuizPerformanceTrend {
  date: string;
  percentage: number;
  accuracy: number;
  questionsAttempted: number;
}

export interface SubjectAnalytics {
  subject: string;
  totalAttempted: number;
  totalCorrect: number;
  avgPercentage: number;
  bestPercentage: number;
  chapters: ChapterAnalytics[];
}

export interface ChapterAnalytics {
  chapter: string;
  chapterSlug: string;
  totalAttempted: number;
  totalCorrect: number;
  avgPercentage: number;
  weakTopics: string[];
  strongTopics: string[];
}

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  mcq: 'Multiple Choice',
  assertion_reason: 'Assertion & Reason',
  case_based: 'Case-based',
  competency: 'Competency-based',
  hots: 'HOTS',
  numerical: 'Numerical',
  fill_blank: 'Fill in the Blanks',
  match_following: 'Match the Following',
  short_answer: 'Short Answer',
  long_answer: 'Long Answer',
};

export const DIFFICULTY_CONFIG = {
  easy: { label: 'Easy', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-200 dark:border-emerald-800', emoji: '🟢' },
  moderate: { label: 'Moderate', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-800', emoji: '🟡' },
  hard: { label: 'Hard', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/30', border: 'border-rose-200 dark:border-rose-800', emoji: '🔴' },
};

export const QUIZ_QUESTION_PRESETS = [5, 10, 15, 20, 25, 50] as const;

export const TIME_LIMITS: Record<number, number> = {
  5: 300,
  10: 600,
  15: 900,
  20: 1200,
  25: 1500,
  50: 3000,
};
