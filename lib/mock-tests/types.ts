export type Difficulty = 'easy' | 'moderate' | 'hard' | 'mixed';

export type QuestionType =
  | 'mcq'
  | 'assertion-reason'
  | 'case-based'
  | 'competency-based'
  | 'hots'
  | 'numerical'
  | 'fill-blanks'
  | 'match-following'
  | 'short-answer'
  | 'long-answer';

export type ClassLevel = '9' | '10' | '11' | '12';

export type TestStatus = 'setup' | 'in-progress' | 'review' | 'submitted' | 'results';

export interface TestConfig {
  classLevel: ClassLevel;
  subject: string;
  book: string;
  chapters: string[];
  chapterMode: 'single' | 'multiple' | 'entire-book';
  difficulty: Difficulty;
  questionCount: number;
}

export interface MockQuestion {
  id: string;
  number: number;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  concept: string;
  revisionTip: string;
  difficulty: 'easy' | 'moderate' | 'hard';
  chapter: string;
  chapterNumber: number;
  subject: string;
  marks: number;
  timeEstimate: number;
  caseData?: string;
  assertionStatement?: string;
  reasonStatement?: string;
  matchPairs?: { left: string; right: string }[];
  numericalData?: string;
}

export interface MockTest {
  id: string;
  config: TestConfig;
  questions: MockQuestion[];
  totalMarks?: number;
  totalQuestions?: number;
  createdAt: Date | string;
  timeLimit: number;
}

export interface TestAttempt {
  id: string;
  testId: string;
  startTime: Date | string;
  endTime?: Date | string;
  status?: string;
  autoSubmitted: boolean;
}

export interface AnswerRecord {
  questionId: string;
  selectedAnswer: number;
  timeTaken: number;
  isCorrect?: boolean;
  correct?: boolean;
  skipped?: boolean;
  isSkipped?: boolean;
  bookmarked?: boolean;
  isBookmarked?: boolean;
  timestamp?: Date | string;
}

export interface TestResult {
  id: string;
  testId: string;
  attemptId: string;
  config: TestConfig;
  score: number;
  totalMarks: number;
  percentage: number;
  accuracy: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: number;
  timeTaken: number;
  timeLimit: number;
  questionResults: QuestionResult[];
  topicWiseAccuracy: TopicWiseAccuracy[];
  typeWiseAccuracy: TypeWiseAccuracy[];
  difficultyWisePerformance: DifficultyWisePerformance[];
  timeAnalysis: TimeAnalysis;
  performanceRating: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  submittedAt: string;
}

export interface QuestionResult {
  questionId: string;
  questionNumber: number;
  question: string;
  type: QuestionType;
  difficulty: 'easy' | 'moderate' | 'hard';
  chapter: string;
  subject: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  isSkipped: boolean;
  timeTaken: number;
  explanation: string;
  concept: string;
  revisionTip: string;
  marks: number;
  maxMarks: number;
}

export interface TopicWiseAccuracy {
  chapter: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  timeTaken: number;
}

export interface TypeWiseAccuracy {
  type: QuestionType;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
}

export interface DifficultyWisePerformance {
  difficulty: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
}

export interface TimeAnalysis {
  totalTime: number;
  avgTimePerQuestion: number;
  fastestQuestion: { id: string; time: number };
  slowestQuestion: { id: string; time: number };
  timeManagementRating: string;
  questionsWithinTime: number;
  questionsOverTime: number;
}

export interface WrongQuestion {
  id: string;
  questionId: string;
  question: string;
  type: QuestionType;
  chapter: string;
  subject: string;
  difficulty: string;
  correctAnswer: string;
  selectedAnswer: string;
  explanation: string;
  concept: string;
  timesWrong: number;
  timesCorrect: number;
  lastAttempted: string;
  mastered: boolean;
}

export interface SharedLearningData {
  completedChapters: string[];
  completedTopics: string[];
  weakAreas: string[];
  strongAreas: string[];
  frequentMistakes: string[];
  wrongQuestionHistory: string[];
  revisionHistory: string[];
  preferredDifficulty: Difficulty;
  learningPace: string;
  preferredLanguage: string;
  mockTestPerformance: PerformanceSummary[];
  practicePerformance: PerformanceSummary[];
  quizPerformance: PerformanceSummary[];
  aiTutorProgress: { topicsCovered: number; totalTime: number };
  studyRoomActivity: { sessionsJoined: number; lastActive: string };
  recommendedRevisionTopics: string[];
}

export interface PerformanceSummary {
  testId: string;
  score: number;
  percentage: number;
  subject: string;
  date: string;
}

export interface ExamTimerState {
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  isWarning: boolean;
}

export interface NavigationState {
  currentIndex: number;
  totalQuestions: number;
  answeredQuestions: Set<number>;
  bookmarkedQuestions: Set<number>;
  skippedQuestions: Set<number>;
}
