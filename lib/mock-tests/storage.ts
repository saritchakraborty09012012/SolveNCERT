import type { TestConfig, MockTest, TestAttempt, AnswerRecord, TestResult, WrongQuestion } from './types'
import { supabase } from '@/lib/supabase'

// ---------------------------------------------------------------------------
// Module-level state
// ---------------------------------------------------------------------------

let _currentUserId: string | null = null

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const KEYS = {
  CONFIGS: 'sn_mt_configs',
  CURRENT_TEST: 'sn_mt_current_test',
  CURRENT_ATTEMPT: 'sn_mt_current_attempt',
  RESULTS: 'sn_mt_results',
  WRONG_QUESTIONS: 'sn_mt_wrong_questions',
  AUTOSAVE_PREFIX: 'sn_mt_autosave_',
} as const

const MAX_CONFIGS = 20
const MAX_RESULTS = 50

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isClient(): boolean {
  return typeof window !== 'undefined'
}

function getStorageItem<T>(key: string, fallback: T): T {
  if (!isClient()) return fallback
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function setStorageItem<T>(key: string, value: T): void {
  if (!isClient()) return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or unavailable
  }
}

function removeStorageItem(key: string): void {
  if (!isClient()) return
  try {
    localStorage.removeItem(key)
  } catch {
    // Ignore
  }
}

// ---------------------------------------------------------------------------
// Supabase row mappers
// ---------------------------------------------------------------------------

function mapSupabaseResults(data: any[]): TestResult[] {
  return data.map((row) => ({
    id: row.id,
    testId: row.test_id,
    attemptId: row.attempt_id,
    config: row.config ?? {},
    score: row.score,
    totalMarks: row.total_marks,
    percentage: row.percentage,
    accuracy: row.accuracy,
    correctAnswers: row.correct_answers,
    incorrectAnswers: row.incorrect_answers,
    skippedQuestions: row.skipped_questions,
    timeTaken: row.time_taken,
    timeLimit: row.time_limit,
    questionResults: row.question_results ?? [],
    topicWiseAccuracy: row.topic_wise_accuracy ?? [],
    typeWiseAccuracy: row.type_wise_accuracy ?? [],
    difficultyWisePerformance: row.difficulty_wise_performance ?? [],
    timeAnalysis: row.time_analysis ?? { totalTime: 0, avgTimePerQuestion: 0, fastestQuestion: { id: '', time: 0 }, slowestQuestion: { id: '', time: 0 }, timeManagementRating: '', questionsWithinTime: 0, questionsOverTime: 0 },
    performanceRating: row.performance_rating ?? '',
    strengths: row.strengths ?? [],
    weaknesses: row.weaknesses ?? [],
    recommendations: row.recommendations ?? [],
    submittedAt: row.submitted_at,
  }))
}

function mapSupabaseWrongQuestions(data: any[]): WrongQuestion[] {
  return data.map((row) => ({
    id: row.id,
    questionId: row.question_id ?? row.id,
    question: row.question_text,
    type: row.question_type,
    chapter: row.chapter,
    subject: row.subject,
    difficulty: row.difficulty,
    correctAnswer: row.correct_answer,
    selectedAnswer: row.selected_answer,
    explanation: row.explanation,
    concept: row.concept,
    timesWrong: row.times_wrong,
    timesCorrect: row.times_correct,
    lastAttempted: row.last_attempted,
    mastered: row.mastered,
  }))
}

// ---------------------------------------------------------------------------
// Auth lifecycle
// ---------------------------------------------------------------------------

export function setStorageUserId(userId: string | null): void {
  _currentUserId = userId
}

export async function loadAllFromSupabase(userId: string): Promise<void> {
  _currentUserId = userId

  try {
    const [resultsRes, wrongRes] = await Promise.all([
      supabase.from('mock_test_results').select('*').eq('user_id', userId),
      supabase.from('wrong_questions').select('*').eq('user_id', userId),
    ])

    if (resultsRes.data && !resultsRes.error) {
      const mapped = mapSupabaseResults(resultsRes.data)
      const local = getStorageItem<TestResult[]>(KEYS.RESULTS, [])
      const merged = [
        ...mapped,
        ...local.filter((r) => !mapped.some((m) => m.id === r.id)),
      ].slice(0, MAX_RESULTS)
      setStorageItem(KEYS.RESULTS, merged)
    }

    if (wrongRes.data && !wrongRes.error) {
      const mapped = mapSupabaseWrongQuestions(wrongRes.data)
      const local = getStorageItem<WrongQuestion[]>(KEYS.WRONG_QUESTIONS, [])
      const merged = [...mapped]
      for (const lq of local) {
        const idx = merged.findIndex((m) => m.question === lq.question)
        if (idx < 0) {
          merged.push(lq)
        } else {
          merged[idx] = {
            ...merged[idx],
            timesWrong: Math.max(merged[idx].timesWrong, lq.timesWrong),
            mastered: merged[idx].mastered || lq.mastered,
          }
        }
      }
      setStorageItem(KEYS.WRONG_QUESTIONS, merged)
    }
  } catch {
    // Supabase unreachable; localStorage cache stays as-is
  }
}

export function clearAllStorageOnLogout(): void {
  _currentUserId = null
  removeStorageItem(KEYS.RESULTS)
  removeStorageItem(KEYS.WRONG_QUESTIONS)
  removeStorageItem(KEYS.CONFIGS)
}

// ---------------------------------------------------------------------------
// Test configs (localStorage only)
// ---------------------------------------------------------------------------

export function saveTestConfig(config: TestConfig): void {
  const configs = getStorageItem<TestConfig[]>(KEYS.CONFIGS, [])
  const key = (c: TestConfig) => `${c.subject}-${c.book}`
  const updated = [config, ...configs.filter((c) => key(c) !== key(config))].slice(0, MAX_CONFIGS)
  setStorageItem(KEYS.CONFIGS, updated)
}

export function getSavedTestConfigs(): TestConfig[] {
  return getStorageItem<TestConfig[]>(KEYS.CONFIGS, [])
}

// ---------------------------------------------------------------------------
// Current test (localStorage only — session)
// ---------------------------------------------------------------------------

export function saveCurrentTest(test: MockTest): void {
  setStorageItem(KEYS.CURRENT_TEST, test)
}

export function getCurrentTest(): MockTest | null {
  return getStorageItem<MockTest | null>(KEYS.CURRENT_TEST, null)
}

export function clearCurrentTest(): void {
  removeStorageItem(KEYS.CURRENT_TEST)
}

export function saveCurrentAttempt(attempt: TestAttempt): void {
  setStorageItem(KEYS.CURRENT_ATTEMPT, attempt)
}

export function getCurrentAttempt(): TestAttempt | null {
  return getStorageItem<TestAttempt | null>(KEYS.CURRENT_ATTEMPT, null)
}

export function clearCurrentAttempt(): void {
  removeStorageItem(KEYS.CURRENT_ATTEMPT)
}

// ---------------------------------------------------------------------------
// Test results (Supabase primary)
// ---------------------------------------------------------------------------

export async function saveTestResult(result: TestResult): Promise<void> {
  const results = getStorageItem<TestResult[]>(KEYS.RESULTS, [])
  const updated = [result, ...results.filter((r) => r.id !== result.id)].slice(0, MAX_RESULTS)
  setStorageItem(KEYS.RESULTS, updated)

  if (_currentUserId) {
    try {
      await supabase.from('mock_test_results').insert({
        id: result.id,
        user_id: _currentUserId,
        test_id: result.testId,
        attempt_id: result.attemptId,
        config: result.config,
        score: result.score,
        total_marks: result.totalMarks,
        percentage: result.percentage,
        accuracy: result.accuracy,
        correct_answers: result.correctAnswers,
        incorrect_answers: result.incorrectAnswers,
        skipped_questions: result.skippedQuestions,
        time_taken: result.timeTaken,
        time_limit: result.timeLimit,
        question_results: result.questionResults,
        topic_wise_accuracy: result.topicWiseAccuracy,
        type_wise_accuracy: result.typeWiseAccuracy,
        difficulty_wise_performance: result.difficultyWisePerformance,
        time_analysis: result.timeAnalysis,
        performance_rating: result.performanceRating,
        strengths: result.strengths,
        weaknesses: result.weaknesses,
        recommendations: result.recommendations,
        submitted_at: result.submittedAt,
      })
    } catch {
      // Supabase insert failed; localStorage already saved
    }
  }
}

export async function getTestResultsAsync(): Promise<TestResult[]> {
  if (_currentUserId) {
    try {
      const { data, error } = await supabase
        .from('mock_test_results')
        .select('*')
        .eq('user_id', _currentUserId)
        .order('submitted_at', { ascending: false })

      if (data && !error) {
        const mapped = mapSupabaseResults(data)
        const local = getStorageItem<TestResult[]>(KEYS.RESULTS, [])
        const merged = [
          ...mapped,
          ...local.filter((r) => !mapped.some((m) => m.id === r.id)),
        ].slice(0, MAX_RESULTS)
        setStorageItem(KEYS.RESULTS, merged)
        return merged
      }
    } catch {
      // Fall through to localStorage
    }
  }
  return getStorageItem<TestResult[]>(KEYS.RESULTS, [])
}

export function getTestResults(): TestResult[] {
  return getStorageItem<TestResult[]>(KEYS.RESULTS, [])
}

export function getTestResult(resultId: string): TestResult | null {
  const results = getStorageItem<TestResult[]>(KEYS.RESULTS, [])
  return results.find((r) => r.id === resultId) ?? null
}

// ---------------------------------------------------------------------------
// Wrong questions (Supabase primary)
// ---------------------------------------------------------------------------

export async function saveWrongQuestions(questions: WrongQuestion[]): Promise<void> {
  const existing = getStorageItem<WrongQuestion[]>(KEYS.WRONG_QUESTIONS, [])

  const merged = [...existing]
  for (const q of questions) {
    const idx = merged.findIndex((e) => e.question === q.question)
    if (idx >= 0) {
      merged[idx] = {
        ...merged[idx],
        timesWrong: merged[idx].timesWrong + 1,
        lastAttempted: q.lastAttempted || new Date().toISOString(),
      }
    } else {
      merged.push({ ...q, timesWrong: q.timesWrong || 1 })
    }
  }

  setStorageItem(KEYS.WRONG_QUESTIONS, merged)

  if (_currentUserId) {
    try {
      for (const q of questions) {
        const existingQ = merged.find((m) => m.question === q.question)
        const upsertPayload: Record<string, any> = {
          user_id: _currentUserId,
          question_text: q.question,
          question_type: q.type,
          chapter: q.chapter,
          subject: q.subject,
          difficulty: q.difficulty,
          correct_answer: q.correctAnswer,
          selected_answer: q.selectedAnswer,
          explanation: q.explanation,
          concept: q.concept,
          times_wrong: existingQ?.timesWrong ?? q.timesWrong,
          times_correct: q.timesCorrect,
          mastered: q.mastered,
          last_attempted: q.lastAttempted || new Date().toISOString(),
        }

        if (q.id) {
          upsertPayload.id = q.id
        }

        await supabase.from('wrong_questions').upsert(upsertPayload, {
          onConflict: 'user_id,question_text',
        })
      }
    } catch {
      // Supabase upsert failed; localStorage already saved
    }
  }
}

export async function getWrongQuestionsAsync(subject?: string): Promise<WrongQuestion[]> {
  if (_currentUserId) {
    try {
      let query = supabase
        .from('wrong_questions')
        .select('*')
        .eq('user_id', _currentUserId)

      if (subject) {
        query = query.eq('subject', subject)
      }

      const { data, error } = await query

      if (data && !error) {
        const mapped = mapSupabaseWrongQuestions(data)
        const local = getStorageItem<WrongQuestion[]>(KEYS.WRONG_QUESTIONS, [])
        const merged = [...mapped]
        for (const lq of local) {
          const idx = merged.findIndex((m) => m.question === lq.question)
          if (idx < 0) {
            merged.push(lq)
          } else {
            merged[idx] = {
              ...merged[idx],
              timesWrong: Math.max(merged[idx].timesWrong, lq.timesWrong),
              mastered: merged[idx].mastered || lq.mastered,
            }
          }
        }
        setStorageItem(KEYS.WRONG_QUESTIONS, merged)
        return merged
      }
    } catch {
      // Fall through to localStorage
    }
  }
  return getStorageItem<WrongQuestion[]>(KEYS.WRONG_QUESTIONS, [])
}

export function getWrongQuestions(subject?: string): WrongQuestion[] {
  const all = getStorageItem<WrongQuestion[]>(KEYS.WRONG_QUESTIONS, [])
  if (!subject) return all
  return all.filter((q) => q.subject === subject)
}

export function updateWrongQuestion(id: string, updates: Partial<WrongQuestion>): void {
  const all = getStorageItem<WrongQuestion[]>(KEYS.WRONG_QUESTIONS, [])
  const idx = all.findIndex((q) => q.id === id)
  if (idx < 0) return
  all[idx] = { ...all[idx], ...updates }
  setStorageItem(KEYS.WRONG_QUESTIONS, all)

  if (_currentUserId) {
    supabase
      .from('wrong_questions')
      .update({
        ...(updates.question !== undefined && { question_text: updates.question }),
        ...(updates.type !== undefined && { question_type: updates.type }),
        ...(updates.chapter !== undefined && { chapter: updates.chapter }),
        ...(updates.subject !== undefined && { subject: updates.subject }),
        ...(updates.difficulty !== undefined && { difficulty: updates.difficulty }),
        ...(updates.correctAnswer !== undefined && { correct_answer: updates.correctAnswer }),
        ...(updates.selectedAnswer !== undefined && { selected_answer: updates.selectedAnswer }),
        ...(updates.explanation !== undefined && { explanation: updates.explanation }),
        ...(updates.concept !== undefined && { concept: updates.concept }),
        ...(updates.timesWrong !== undefined && { times_wrong: updates.timesWrong }),
        ...(updates.timesCorrect !== undefined && { times_correct: updates.timesCorrect }),
        ...(updates.mastered !== undefined && { mastered: updates.mastered }),
        ...(updates.lastAttempted !== undefined && { last_attempted: updates.lastAttempted }),
      })
      .eq('id', id)
      .then(() => {}, () => {})
  }
}

export function getWrongQuestionsForRevision(subject: string, limit = 20): WrongQuestion[] {
  const all = getStorageItem<WrongQuestion[]>(KEYS.WRONG_QUESTIONS, [])
  return all
    .filter((q) => q.subject === subject && !q.mastered)
    .sort((a, b) => (b.timesWrong || 0) - (a.timesWrong || 0))
    .slice(0, limit)
}

// ---------------------------------------------------------------------------
// Autosave (localStorage only)
// ---------------------------------------------------------------------------

export function autosaveProgress(testId: string, answers: AnswerRecord[]): void {
  setStorageItem(KEYS.AUTOSAVE_PREFIX + testId, answers)
}

export function getAutosavedProgress(testId: string): AnswerRecord[] | null {
  return getStorageItem<AnswerRecord[] | null>(KEYS.AUTOSAVE_PREFIX + testId, null)
}

export function clearAutosavedProgress(testId?: string): void {
  if (testId) {
    removeStorageItem(KEYS.AUTOSAVE_PREFIX + testId)
  } else {
    // Clear all autosaves
    Object.keys(localStorage).filter(k => k.startsWith(KEYS.AUTOSAVE_PREFIX)).forEach(k => localStorage.removeItem(k))
  }
}
