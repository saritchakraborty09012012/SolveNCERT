import { create } from 'zustand';
import type {
  TestConfig,
  MockTest,
  TestAttempt,
  AnswerRecord,
  TestResult,
  TestStatus,
  MockQuestion,
  WrongQuestion,
} from '@/lib/mock-tests/types';
import {
  saveCurrentTest,
  getCurrentTest,
  clearCurrentTest,
  saveCurrentAttempt,
  getCurrentAttempt,
  clearCurrentAttempt,
  saveTestResult,
  getTestResultsAsync,
  autosaveProgress,
  getAutosavedProgress,
  clearAutosavedProgress,
  saveWrongQuestions,
  getWrongQuestionsForRevision,
  saveTestConfig,
} from '@/lib/mock-tests/storage';
import {
  calculateResults,
  identifyStrengths,
  identifyWeaknesses,
  generateRecommendations,
} from '@/lib/mock-tests/analytics';
import {
  updateMockTestPerformance,
  updateWeakAreas,
  updateStrongAreas,
  addWrongQuestionToHistory,
} from '@/lib/mock-tests/shared-knowledge';

interface MockTestState {
  status: TestStatus;
  config: TestConfig | null;
  test: MockTest | null;
  attempt: TestAttempt | null;
  answers: AnswerRecord[];
  currentIndex: number;
  result: TestResult | null;
  results: TestResult[];
  isGenerating: boolean;
  error: string | null;
  isFullScreen: boolean;
  showReview: boolean;

  setStatus: (status: TestStatus) => void;
  setConfig: (config: TestConfig) => void;
  startTest: (test: MockTest, config: TestConfig) => void;
  answerQuestion: (
    questionId: string,
    selectedAnswer: number,
    timeTaken: number
  ) => void;
  skipQuestion: (questionId: string) => void;
  toggleBookmark: (questionId: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  goToQuestion: (index: number) => void;
  submitTest: () => void;
  autoSubmit: () => void;
  loadPreviousResults: () => void;
  setGenerating: (isGenerating: boolean) => void;
  setError: (error: string | null) => void;
  toggleFullScreen: () => void;
  setShowReview: (show: boolean) => void;
  reset: () => void;
  loadSavedTest: () => void;
}

const defaultConfig: TestConfig = {
  classLevel: '9',
  subject: 'maths',
  book: 'Ganita Manjari Part I',
  chapters: [],
  chapterMode: 'entire-book',
  difficulty: 'mixed',
  questionCount: 20,
};

const initialState = {
  status: 'setup' as TestStatus,
  config: null as TestConfig | null,
  test: null as MockTest | null,
  attempt: null as TestAttempt | null,
  answers: [] as AnswerRecord[],
  currentIndex: 0,
  result: null as TestResult | null,
  results: [] as TestResult[],
  isGenerating: false,
  error: null as string | null,
  isFullScreen: false,
  showReview: false,
};

function persistAnswers(testId: string, answers: AnswerRecord[]) {
  autosaveProgress(testId, answers);
}

function processSubmittedTest(
  test: MockTest,
  answers: AnswerRecord[],
  config: TestConfig,
  startTime: Date | string
): TestResult {
  const startMs = startTime instanceof Date ? startTime.getTime() : new Date(startTime).getTime();
  const timeSpent = Math.floor((Date.now() - startMs) / 1000);
  return calculateResults(test.questions, answers, config, timeSpent);
}

function updateSharedLearningData(
  result: TestResult,
  answers: AnswerRecord[],
  allQuestions: MockQuestion[]
) {
  // Fire-and-forget: these write to Supabase async but we don't block UI
  updateMockTestPerformance({
    testId: result.testId,
    score: result.score,
    percentage: result.percentage,
    subject: result.config.subject,
    date: result.submittedAt,
  });

  const incorrectChapters = new Set<string>();
  const correctChapters = new Set<string>();

  answers.forEach((answer) => {
    const question = allQuestions.find((q) => q.id === answer.questionId);
    if (!question) return;

    if (answer.isCorrect || answer.correct) {
      correctChapters.add(question.chapter);
    } else {
      incorrectChapters.add(question.chapter);
      addWrongQuestionToHistory(answer.questionId);
    }
  });

  if (incorrectChapters.size > 0) {
    updateWeakAreas(Array.from(incorrectChapters));
  }

  if (correctChapters.size > 0) {
    updateStrongAreas(Array.from(correctChapters));
  }
}

function collectWrongQuestions(
  answers: AnswerRecord[],
  questions: MockQuestion[]
): WrongQuestion[] {
  const wrong: WrongQuestion[] = []
  for (const answer of answers) {
    if (answer.isSkipped || answer.skipped || answer.selectedAnswer === -1) continue
    const q = questions.find((qq) => qq.id === answer.questionId)
    if (!q) continue
    wrong.push({
      id: crypto.randomUUID(),
      questionId: q.id,
      question: q.question,
      type: q.type,
      chapter: q.chapter,
      subject: q.subject,
      difficulty: q.difficulty,
      correctAnswer: q.correctAnswer,
      selectedAnswer: String(answer.selectedAnswer),
      explanation: q.explanation,
      concept: q.concept,
      timesWrong: 1,
      timesCorrect: 0,
      lastAttempted: new Date().toISOString(),
      mastered: false,
    })
  }
  return wrong
}

export const useMockTestStore = create<MockTestState>((set, get) => ({
  ...initialState,

  setStatus: (status) => set({ status }),

  setConfig: (config) => set({ config }),

  startTest: (test, config) => {
    const attempt: TestAttempt = {
      id: crypto.randomUUID(),
      testId: test.id,
      startTime: new Date(),
      status: 'in-progress',
      autoSubmitted: false,
    };

    const savedAnswers = getAutosavedProgress(test.id);

    saveCurrentTest(test);
    saveCurrentAttempt(attempt);
    saveTestConfig(config);

    set({
      test,
      config,
      attempt,
      answers: savedAnswers || [],
      currentIndex: 0,
      result: null,
      status: 'in-progress',
      error: null,
    });
  },

  answerQuestion: (questionId, selectedAnswer, timeTaken) => {
    const { test, answers } = get();
    if (!test) return;

    const existingIndex = answers.findIndex((a) => a.questionId === questionId);
    const newAnswer: AnswerRecord = {
      questionId,
      selectedAnswer,
      timeTaken,
      isCorrect:
        test.questions.find((q) => q.id === questionId)?.correctAnswer ===
        String(selectedAnswer),
      skipped: false,
      bookmarked:
        existingIndex >= 0 ? answers[existingIndex].bookmarked : false,
      timestamp: new Date(),
    };

    let updatedAnswers: AnswerRecord[];
    if (existingIndex >= 0) {
      updatedAnswers = [...answers];
      updatedAnswers[existingIndex] = newAnswer;
    } else {
      updatedAnswers = [...answers, newAnswer];
    }

    set({ answers: updatedAnswers });
    persistAnswers(test.id, updatedAnswers);
  },

  skipQuestion: (questionId) => {
    const { test, answers } = get();
    if (!test) return;

    const existingIndex = answers.findIndex((a) => a.questionId === questionId);
    const skippedAnswer: AnswerRecord = {
      questionId,
      selectedAnswer: -1,
      timeTaken: 0,
      isCorrect: false,
      skipped: true,
      bookmarked:
        existingIndex >= 0 ? answers[existingIndex].bookmarked : false,
      timestamp: new Date(),
    };

    let updatedAnswers: AnswerRecord[];
    if (existingIndex >= 0) {
      updatedAnswers = [...answers];
      updatedAnswers[existingIndex] = skippedAnswer;
    } else {
      updatedAnswers = [...answers, skippedAnswer];
    }

    set({ answers: updatedAnswers });
    persistAnswers(test.id, updatedAnswers);
  },

  toggleBookmark: (questionId) => {
    const { answers, test } = get();
    if (!test) return;

    const updatedAnswers = answers.map((a) =>
      a.questionId === questionId ? { ...a, bookmarked: !a.bookmarked } : a
    );

    set({ answers: updatedAnswers });
    persistAnswers(test.id, updatedAnswers);
  },

  nextQuestion: () => {
    const { currentIndex, test } = get();
    if (!test) return;
    const maxIndex = test.questions.length - 1;
    if (currentIndex < maxIndex) {
      set({ currentIndex: currentIndex + 1 });
    }
  },

  prevQuestion: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1 });
    }
  },

  goToQuestion: (index) => {
    const { test } = get();
    if (!test) return;
    if (index >= 0 && index < test.questions.length) {
      set({ currentIndex: index });
    }
  },

  submitTest: () => {
    const { test, answers, config, attempt } = get();
    if (!test || !config || !attempt) return;

    const result = processSubmittedTest(test, answers, config, attempt.startTime);

    // Fire-and-forget: save wrong questions to Supabase
    const wrongQuestions = collectWrongQuestions(answers, test.questions);
    if (wrongQuestions.length > 0) {
      saveWrongQuestions(wrongQuestions);
    }

    // Fire-and-forget: update shared learning data in Supabase
    updateSharedLearningData(result, answers, test.questions);

    // Save result to Supabase + localStorage
    saveTestResult(result);
    clearAutosavedProgress();
    clearCurrentTest();
    clearCurrentAttempt();

    set({
      result,
      status: 'submitted',
      attempt: { ...attempt, status: 'completed' },
    });
  },

  autoSubmit: () => {
    const { test, answers, config, attempt } = get();
    if (!test || !config || !attempt) return;

    const result = processSubmittedTest(test, answers, config, attempt.startTime);

    // Fire-and-forget: save wrong questions to Supabase
    const wrongQuestions = collectWrongQuestions(answers, test.questions);
    if (wrongQuestions.length > 0) {
      saveWrongQuestions(wrongQuestions);
    }

    // Fire-and-forget: update shared learning data in Supabase
    updateSharedLearningData(result, answers, test.questions);

    // Save result to Supabase + localStorage
    saveTestResult(result);
    clearAutosavedProgress();
    clearCurrentTest();

    const completedAttempt: TestAttempt = {
      ...attempt,
      status: 'completed',
      autoSubmitted: true,
    };

    saveCurrentAttempt(completedAttempt);

    set({
      result,
      status: 'submitted',
      attempt: completedAttempt,
    });
  },

  loadPreviousResults: async () => {
    const results = await getTestResultsAsync();
    set({ results });
  },

  setGenerating: (isGenerating) => set({ isGenerating }),

  setError: (error) => set({ error }),

  toggleFullScreen: () => set((state) => ({ isFullScreen: !state.isFullScreen })),

  setShowReview: (show) => set({ showReview: show }),

  reset: () => {
    clearAutosavedProgress();
    clearCurrentTest();
    clearCurrentAttempt();
    set({ ...initialState });
  },

  loadSavedTest: () => {
    const savedTest = getCurrentTest();
    const savedAttempt = getCurrentAttempt();
    const savedAnswers = savedTest
      ? getAutosavedProgress(savedTest.id)
      : null;
    const savedConfig = localStorage.getItem('mockTestConfig');

    if (savedTest && savedAttempt) {
      set({
        test: savedTest,
        attempt: savedAttempt,
        answers: savedAnswers || [],
        config: savedConfig ? JSON.parse(savedConfig) : defaultConfig,
        status: savedAttempt.status as TestStatus,
        currentIndex: 0,
      });
    }
  },
}));
