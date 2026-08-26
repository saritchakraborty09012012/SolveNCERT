import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useMockTestStore } from '@/store/mockTestStore'
import { cn } from '@/utils/helpers'
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  SkipForward,
  AlertTriangle,
  Maximize2,
  Minimize2,
  Grid3X3,
  Send,
  Eye,
  ArrowLeft,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import MathRenderer from '@/components/features/MathRenderer'
import type { QuestionType } from '@/lib/mock-tests/types'

interface ExamInterfaceProps {
  reviewMode?: boolean
}

const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  mcq: 'MCQ',
  'assertion-reason': 'A-R',
  'case-based': 'Case',
  'competency-based': 'Comp',
  hots: 'HOTS',
  numerical: 'Num',
  'fill-blanks': 'Fill',
  'match-following': 'Match',
  'short-answer': 'Short',
  'long-answer': 'Long',
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D']

const ASSERTION_REASON_OPTIONS = [
  'Both Assertion and Reason are true and Reason is the correct explanation of Assertion',
  'Both Assertion and Reason are true but Reason is NOT the correct explanation of Assertion',
  'Assertion is true but Reason is false',
  'Assertion is false but Reason is true',
]

function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function getTimerColor(remaining: number, total: number): string {
  if (total <= 0) return 'var(--text-primary)'
  const pct = remaining / total
  if (pct < 0.25) return '#f87171'
  if (pct < 0.5) return '#fbbf24'
  return '#34d399'
}

function getTimerBg(remaining: number, total: number): React.CSSProperties {
  if (total <= 0) return { background: 'var(--surface-2)', borderColor: 'var(--border)' }
  const pct = remaining / total
  if (pct < 0.05) return { background: 'rgba(239,68,68,0.14)', borderColor: 'rgba(239,68,68,0.5)' }
  if (pct < 0.25) return { background: 'rgba(239,68,68,0.10)', borderColor: 'rgba(239,68,68,0.35)' }
  if (pct < 0.5) return { background: 'rgba(245,158,11,0.10)', borderColor: 'rgba(245,158,11,0.35)' }
  return { background: 'rgba(16,185,129,0.10)', borderColor: 'rgba(16,185,129,0.35)' }
}

function getNavColor(
  questionIndex: number,
  answers: ReturnType<typeof useMockTestStore.getState>['answers'],
  questions: { id: string }[]
): React.CSSProperties {
  const qId = questions[questionIndex]?.id
  if (!qId) return { background: 'var(--surface-2)', color: 'var(--text-muted)' }
  const answer = answers.find((a) => a.questionId === qId)
  if (!answer) return { background: 'var(--surface-2)', color: 'var(--text-secondary)' }
  if (answer.bookmarked) return { background: 'rgba(245,158,11,0.16)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.4)' }
  if (answer.skipped || answer.selectedAnswer === -1) return { background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.35)' }
  return { background: 'rgba(16,185,129,0.12)', color: '#34d399', border: '1px solid rgba(16,185,129,0.35)' }
}

export default function ExamInterface({ reviewMode = false }: ExamInterfaceProps) {
  const test = useMockTestStore((s) => s.test)
  const answers = useMockTestStore((s) => s.answers)
  const currentIndex = useMockTestStore((s) => s.currentIndex)
  const answerQuestion = useMockTestStore((s) => s.answerQuestion)
  const skipQuestion = useMockTestStore((s) => s.skipQuestion)
  const toggleBookmark = useMockTestStore((s) => s.toggleBookmark)
  const nextQuestion = useMockTestStore((s) => s.nextQuestion)
  const prevQuestion = useMockTestStore((s) => s.prevQuestion)
  const goToQuestion = useMockTestStore((s) => s.goToQuestion)
  const submitTest = useMockTestStore((s) => s.submitTest)
  const autoSubmit = useMockTestStore((s) => s.autoSubmit)
  const isFullScreen = useMockTestStore((s) => s.isFullScreen)
  const toggleFullScreen = useMockTestStore((s) => s.toggleFullScreen)
  const showReview = useMockTestStore((s) => s.showReview)
  const setShowReview = useMockTestStore((s) => s.setShowReview)
  const attempt = useMockTestStore((s) => s.attempt)

  const [showNavPanel, setShowNavPanel] = useState(false)
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [showSaved, setShowSaved] = useState(false)
  const [textAnswers, setTextAnswers] = useState<Record<string, string>>({})
  const [matchAnswers, setMatchAnswers] = useState<Record<string, Record<number, string>>>({})
  const [reviewFilter, setReviewFilter] = useState<'all' | 'answered' | 'skipped' | 'bookmarked'>('all')

  const lastSwitchTimeRef = useRef(Date.now())
  const questionStartTimeRef = useRef(Date.now())
  const savedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const questions = test?.questions ?? []
  const currentQuestion = questions[currentIndex]
  const totalSeconds = test?.timeLimit ?? 0
  const elapsed = attempt ? Math.floor((Date.now() - new Date(attempt.startTime).getTime()) / 1000) : 0
  const remaining = Math.max(0, totalSeconds - elapsed)

  const currentAnswer = currentQuestion
    ? answers.find((a) => a.questionId === currentQuestion.id)
    : undefined

  const answeredCount = answers.filter((a) => !a.skipped && a.selectedAnswer !== -1).length
  const bookmarkedCount = answers.filter((a) => a.bookmarked).length
  const skippedCount = answers.filter((a) => a.skipped).length
  const progressPct = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0

  useEffect(() => {
    questionStartTimeRef.current = Date.now()
    lastSwitchTimeRef.current = Date.now()
  }, [currentIndex])

  useEffect(() => {
    if (isPaused || reviewMode) return
    timerIntervalRef.current = setInterval(() => {
      const now = Date.now()
      const totalElapsed = attempt ? Math.floor((now - new Date(attempt.startTime).getTime()) / 1000) : 0
      const rem = Math.max(0, totalSeconds - totalElapsed)
      setCurrentTime(rem)
      if (rem <= 0) {
        clearInterval(timerIntervalRef.current!)
        autoSubmit()
      }
    }, 1000)
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
    }
  }, [isPaused, reviewMode, attempt, totalSeconds, autoSubmit])

  useEffect(() => {
    return () => {
      if (savedTimeoutRef.current) clearTimeout(savedTimeoutRef.current)
    }
  }, [])

  const triggerSaved = useCallback(() => {
    setShowSaved(true)
    if (savedTimeoutRef.current) clearTimeout(savedTimeoutRef.current)
    savedTimeoutRef.current = setTimeout(() => setShowSaved(false), 2000)
  }, [])

  const getTimeTaken = useCallback(() => {
    return Math.floor((Date.now() - questionStartTimeRef.current) / 1000)
  }, [])

  const handleSelectOption = useCallback(
    (optionIndex: number) => {
      if (!currentQuestion || reviewMode) return
      answerQuestion(currentQuestion.id, optionIndex, getTimeTaken())
      triggerSaved()
    },
    [currentQuestion, reviewMode, answerQuestion, getTimeTaken, triggerSaved]
  )

  const handleSkip = useCallback(() => {
    if (!currentQuestion || reviewMode) return
    skipQuestion(currentQuestion.id)
    triggerSaved()
    if (currentIndex < questions.length - 1) {
      nextQuestion()
    }
  }, [currentQuestion, reviewMode, skipQuestion, currentIndex, questions.length, nextQuestion, triggerSaved])

  const handleBookmark = useCallback(() => {
    if (!currentQuestion || reviewMode) return
    toggleBookmark(currentQuestion.id)
    triggerSaved()
  }, [currentQuestion, reviewMode, toggleBookmark, triggerSaved])

  const handleTextAnswer = useCallback(
    (value: string) => {
      if (!currentQuestion || reviewMode) return
      setTextAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }))
      const numValue = value.trim() === '' ? -1 : 0
      answerQuestion(currentQuestion.id, numValue, getTimeTaken())
      triggerSaved()
    },
    [currentQuestion, reviewMode, answerQuestion, getTimeTaken, triggerSaved]
  )

  const handleMatchAnswer = useCallback(
    (pairIndex: number, rightIndex: string) => {
      if (!currentQuestion || reviewMode) return
      setMatchAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: { ...(prev[currentQuestion.id] ?? {}), [pairIndex]: rightIndex },
      }))
      answerQuestion(currentQuestion.id, 0, getTimeTaken())
      triggerSaved()
    },
    [currentQuestion, reviewMode, answerQuestion, getTimeTaken, triggerSaved]
  )

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) nextQuestion()
  }, [currentIndex, questions.length, nextQuestion])

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) prevQuestion()
  }, [currentIndex, prevQuestion])

  const handleGoTo = useCallback(
    (index: number) => {
      goToQuestion(index)
      setShowNavPanel(false)
    },
    [goToQuestion]
  )

  const handleSubmit = useCallback(() => {
    setShowSubmitConfirm(false)
    submitTest()
  }, [submitTest])

  const handlePause = useCallback(() => {
    setIsPaused((p) => !p)
  }, [])

  const handleToggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {})
    } else {
      document.exitFullscreen?.().catch(() => {})
    }
    toggleFullScreen()
  }, [toggleFullScreen])

  if (!test || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--surface-0)' }}>
        <div className="text-center space-y-4">
          <AlertTriangle className="w-12 h-12 mx-auto" style={{ color: '#fbbf24' }} />
          <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>No active test found</p>
        </div>
      </div>
    )
  }

  const isBookmarked = currentAnswer?.bookmarked ?? false
  const isCurrentAnswered = currentAnswer && !currentAnswer.skipped && currentAnswer.selectedAnswer !== -1

  const filteredReviewQuestions = questions.map((q, i) => {
    const ans = answers.find((a) => a.questionId === q.id)
    return { question: q, answer: ans, index: i }
  }).filter(({ answer }) => {
    if (reviewFilter === 'all') return true
    if (reviewFilter === 'answered') return answer && !answer.skipped && answer.selectedAnswer !== -1
    if (reviewFilter === 'skipped') return answer?.skipped || answer?.selectedAnswer === -1
    if (reviewFilter === 'bookmarked') return answer?.bookmarked
    return true
  })

  return (
    <div className={cn('min-h-screen flex flex-col')} style={{ background: 'var(--surface-0)' }}>
      <div className="sticky top-0 z-30 backdrop-blur border-b shadow-sm" style={{ background: 'color-mix(in srgb, var(--surface-1) 95%, transparent)', borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setShowReview(!showReview)}
              className="p-2 rounded-lg transition-colors hover:bg-[var(--surface-2)]"
              style={{ color: 'var(--text-muted)' }}
              title={showReview ? 'Back to exam' : 'Review all questions'}
            >
              {showReview ? <ArrowLeft className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{test.config.subject}</span>
              <span style={{ color: 'var(--border)' }}>|</span>
              <span>{test.totalQuestions} Qs</span>
              <span style={{ color: 'var(--border)' }}>|</span>
              <span>{test.totalMarks} Marks</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {showSaved && (
              <motion.span
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs font-medium px-2 py-1 rounded-md"
                style={{ color: '#34d399', background: 'rgba(16,185,129,0.12)' }}
              >
                Saved
              </motion.span>
            )}

            <div
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 font-mono text-sm font-bold transition-all',
                remaining <= 300 && remaining > 0 && 'animate-pulse'
              )}
              style={getTimerBg(remaining, totalSeconds)}
            >
              <Clock className="w-4 h-4" style={{ color: getTimerColor(remaining, totalSeconds) }} />
              <span className="tracking-wider" style={{ color: getTimerColor(remaining, totalSeconds) }}>
                {formatTime(reviewMode ? totalSeconds : currentTime || remaining)}
              </span>
              {!reviewMode && (
                <button
                  onClick={handlePause}
                  className={cn(
                    'ml-1 text-xs px-1.5 py-0.5 rounded font-sans font-medium transition-colors',
                    !isPaused && 'hover:opacity-80'
                  )}
                  style={
                    isPaused
                      ? { background: 'rgba(245,158,11,0.2)', color: '#fbbf24' }
                      : { background: 'var(--surface-3)', color: 'var(--text-secondary)' }
                  }
                >
                  {isPaused ? '▶' : '⏸'}
                </button>
              )}
            </div>

            <button
              onClick={handleToggleFullScreen}
              className="p-2 rounded-lg transition-colors hover:bg-[var(--surface-2)] hidden sm:block"
              style={{ color: 'var(--text-muted)' }}
              title="Toggle focus mode"
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {!reviewMode && (
          <div className="max-w-7xl mx-auto px-3 sm:px-6 pb-2.5">
            <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ background: 'var(--brand-primary)' }}
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
            <div className="flex justify-between mt-1 text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
              <span>{answeredCount} answered</span>
              <span>{skippedCount} skipped</span>
              <span>{bookmarkedCount} bookmarked</span>
              <span>{questions.length - answeredCount - skippedCount} remaining</span>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {showReview ? (
          <motion.div
            key="review"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 max-w-4xl mx-auto w-full px-4 py-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Review Questions</h2>
              <div className="flex gap-1.5">
                {(['all', 'answered', 'skipped', 'bookmarked'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setReviewFilter(f)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
                    style={
                      reviewFilter === f
                        ? { background: 'var(--brand-primary)', color: '#fff' }
                        : { background: 'var(--surface-2)', color: 'var(--text-secondary)' }
                    }
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {filteredReviewQuestions.map(({ question, answer, index }) => (
                <button
                  key={question.id}
                  onClick={() => handleGoTo(index)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left hover:border-[var(--brand-primary)]/40"
                  style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
                >
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                    style={getNavColor(index, answers, questions)}
                  >
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                      {question.question.slice(0, 80)}{question.question.length > 80 ? '...' : ''}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-semibold uppercase" style={{ color: 'var(--text-muted)' }}>
                        {QUESTION_TYPE_LABELS[question.type]}
                      </span>
                      <span className="text-[10px]" style={{ color: 'var(--border)' }}>|</span>
                      <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{question.marks} mark{question.marks > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {answer?.bookmarked && <BookmarkCheck className="w-4 h-4" style={{ color: '#fbbf24' }} />}
                    {answer && !answer.skipped && answer.selectedAnswer !== -1 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ color: '#34d399', background: 'rgba(16,185,129,0.12)' }}>ANS</span>
                    )}
                    {(answer?.skipped || answer?.selectedAnswer === -1) && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ color: '#f87171', background: 'rgba(239,68,68,0.12)' }}>SKIP</span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setShowSubmitConfirm(true)}
                className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all hover:opacity-90"
                style={{ background: 'var(--brand-primary)', color: '#fff' }}
              >
                <Send className="w-4 h-4" />
                Submit Test
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`question-${currentIndex}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 max-w-4xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-6"
          >
            <div className="bg-[var(--surface-1)] rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-sm font-bold" style={{ background: 'var(--brand-primary)', color: '#fff' }}>
                    {currentIndex + 1}
                  </span>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--brand-primary)' }}>
                      {QUESTION_TYPE_LABELS[currentQuestion.type]}
                    </span>
                    <span className="text-xs ml-2" style={{ color: 'var(--text-muted)' }}>
                      {currentQuestion.marks} mark{currentQuestion.marks > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleBookmark}
                  className={cn('p-2 rounded-lg transition-all', !isBookmarked && 'hover:bg-[var(--surface-3)]')}
                  style={isBookmarked ? { color: '#fbbf24', background: 'rgba(245,158,11,0.12)' } : { color: 'var(--text-muted)' }}
                  title={isBookmarked ? 'Remove bookmark' : 'Bookmark this question'}
                >
                  {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                </button>
              </div>

              <div className="px-4 sm:px-6 py-5 sm:py-6">
                {currentQuestion.type === 'case-based' && currentQuestion.caseData && (
                  <div className="mb-5 p-4 rounded-xl border" style={{ background: 'color-mix(in srgb, var(--brand-primary) 7%, transparent)', borderColor: 'color-mix(in srgb, var(--brand-primary) 25%, transparent)' }}>
                    <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--brand-primary)' }}>Case Study</p>
                    <div className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      <MathRenderer text={currentQuestion.caseData} />
                    </div>
                  </div>
                )}

                {currentQuestion.type === 'assertion-reason' && (
                  <div className="mb-5 space-y-3">
                    <div className="p-3 rounded-lg border" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
                      <span className="text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Assertion:</span>
                      <div className="mt-1 text-sm" style={{ color: 'var(--text-primary)' }}>
                        <MathRenderer text={currentQuestion.assertionStatement || currentQuestion.question} />
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
                      <span className="text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Reason:</span>
                      <div className="mt-1 text-sm" style={{ color: 'var(--text-primary)' }}>
                        <MathRenderer text={currentQuestion.reasonStatement || currentQuestion.options?.[0] || ''} />
                      </div>
                    </div>
                  </div>
                )}

                {(currentQuestion.type !== 'assertion-reason') && (
                  <div className="text-sm sm:text-[15px] leading-relaxed mb-6" style={{ color: 'var(--text-primary)' }}>
                    <MathRenderer text={currentQuestion.question} />
                  </div>
                )}

                {currentQuestion.type === 'mcq' && currentQuestion.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentQuestion.options.map((opt, i) => {
                      const selected = currentAnswer?.selectedAnswer === i
                      return (
                        <button
                          key={i}
                          onClick={() => handleSelectOption(i)}
                          disabled={reviewMode}
                          className={cn(
                            'flex items-start gap-3 p-3.5 rounded-xl border-2 text-left transition-all group',
                            reviewMode && 'cursor-default'
                          )}
                          style={
                            selected
                              ? { borderColor: 'var(--brand-primary)', background: 'color-mix(in srgb, var(--brand-primary) 10%, transparent)', boxShadow: '0 0 0 1px color-mix(in srgb, var(--brand-primary) 25%, transparent)' }
                              : { borderColor: 'var(--border)', background: 'var(--surface-1)' }
                          }
                        >
                          <span
                            className={cn(
                              'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all',
                              !selected && 'group-hover:bg-[var(--surface-3)]'
                            )}
                            style={
                              selected
                                ? { background: 'var(--brand-primary)', color: '#fff' }
                                : { background: 'var(--surface-2)', color: 'var(--text-secondary)' }
                            }
                          >
                            {OPTION_LETTERS[i]}
                          </span>
                          <span className="text-sm pt-1 leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                            <MathRenderer text={opt} />
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}

                {currentQuestion.type === 'assertion-reason' && (
                  <div className="space-y-2.5">
                    {ASSERTION_REASON_OPTIONS.map((opt, i) => {
                      const selected = currentAnswer?.selectedAnswer === i
                      return (
                        <button
                          key={i}
                          onClick={() => handleSelectOption(i)}
                          disabled={reviewMode}
                          className={cn(
                            'flex items-start gap-3 p-3.5 rounded-xl border-2 text-left transition-all w-full',
                            reviewMode && 'cursor-default'
                          )}
                          style={
                            selected
                              ? { borderColor: 'var(--brand-primary)', background: 'color-mix(in srgb, var(--brand-primary) 10%, transparent)' }
                              : { borderColor: 'var(--border)', background: 'var(--surface-1)' }
                          }
                        >
                          <span
                            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all"
                            style={
                              selected
                                ? { borderColor: 'var(--brand-primary)', background: 'var(--brand-primary)', color: '#fff' }
                                : { borderColor: 'var(--border)', color: 'var(--text-secondary)' }
                            }
                          >
                            {OPTION_LETTERS[i]}
                          </span>
                          <span className="text-sm pt-1 leading-relaxed" style={{ color: 'var(--text-primary)' }}>{opt}</span>
                        </button>
                      )
                    })}
                  </div>
                )}

                {currentQuestion.type === 'fill-blanks' && (
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                      Fill in the blank
                    </label>
                    <input
                      type="text"
                      value={textAnswers[currentQuestion.id] ?? (currentAnswer?.selectedAnswer !== -1 && currentAnswer?.selectedAnswer !== undefined ? String(currentAnswer.selectedAnswer) : '')}
                      onChange={(e) => handleTextAnswer(e.target.value)}
                      disabled={reviewMode}
                      placeholder="Type your answer..."
                      className="w-full px-4 py-3 rounded-xl border-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)]"
                      style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                    />
                  </div>
                )}

                {currentQuestion.type === 'numerical' && (
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                      Enter numerical answer
                    </label>
                    {currentQuestion.numericalData && (
                      <div className="p-3 rounded-lg border text-sm" style={{ background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.25)', color: '#fbbf24' }}>
                        <MathRenderer text={currentQuestion.numericalData} />
                      </div>
                    )}
                    <input
                      type="number"
                      value={textAnswers[currentQuestion.id] ?? (currentAnswer?.selectedAnswer !== -1 && currentAnswer?.selectedAnswer !== undefined ? String(currentAnswer.selectedAnswer) : '')}
                      onChange={(e) => handleTextAnswer(e.target.value)}
                      disabled={reviewMode}
                      placeholder="Enter value..."
                      className="w-full px-4 py-3 rounded-xl border-2 text-sm transition-all font-mono focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)]"
                      style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                    />
                  </div>
                )}

                {currentQuestion.type === 'short-answer' && (
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                      Short Answer
                    </label>
                    <textarea
                      value={textAnswers[currentQuestion.id] ?? ''}
                      onChange={(e) => handleTextAnswer(e.target.value)}
                      disabled={reviewMode}
                      rows={3}
                      placeholder="Write your answer here..."
                      className="w-full px-4 py-3 rounded-xl border-2 text-sm transition-all resize-none focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)]"
                      style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                    />
                    <p className="text-[11px] text-right" style={{ color: 'var(--text-muted)' }}>
                      {(textAnswers[currentQuestion.id] ?? '').length} characters
                    </p>
                  </div>
                )}

                {currentQuestion.type === 'long-answer' && (
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                      Detailed Answer
                    </label>
                    <textarea
                      value={textAnswers[currentQuestion.id] ?? ''}
                      onChange={(e) => handleTextAnswer(e.target.value)}
                      disabled={reviewMode}
                      rows={8}
                      placeholder="Write your detailed answer here..."
                      className="w-full px-4 py-3 rounded-xl border-2 text-sm transition-all resize-none focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)]"
                      style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                    />
                    <p className="text-[11px] text-right" style={{ color: 'var(--text-muted)' }}>
                      {(textAnswers[currentQuestion.id] ?? '').length} characters
                    </p>
                  </div>
                )}

                {currentQuestion.type === 'match-following' && currentQuestion.matchPairs && (
                  <div className="space-y-4">
                    <label className="block text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                      Match the following
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-xs font-bold mb-2" style={{ color: 'var(--text-muted)' }}>Column A</p>
                        {currentQuestion.matchPairs.map((pair, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-3 rounded-lg border"
                            style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}
                          >
                            <span className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold" style={{ background: 'color-mix(in srgb, var(--brand-primary) 15%, transparent)', color: 'var(--brand-primary)' }}>
                              {i + 1}
                            </span>
                            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                              <MathRenderer text={pair.left} />
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-bold mb-2" style={{ color: 'var(--text-muted)' }}>Column B</p>
                        {currentQuestion.matchPairs.map((pair, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <select
                              value={matchAnswers[currentQuestion.id]?.[i] ?? ''}
                              onChange={(e) => handleMatchAnswer(i, e.target.value)}
                              disabled={reviewMode}
                              className={cn(
                                'flex-1 px-3 py-2.5 rounded-lg border-2 text-sm transition-all appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30',
                                reviewMode && 'cursor-default'
                              )}
                              style={
                                matchAnswers[currentQuestion.id]?.[i]
                                  ? { borderColor: 'color-mix(in srgb, var(--brand-primary) 50%, transparent)', background: 'color-mix(in srgb, var(--brand-primary) 8%, transparent)', color: 'var(--text-primary)' }
                                  : { borderColor: 'var(--border)', background: 'var(--surface-2)', color: 'var(--text-primary)' }
                              }
                            >
                              <option value="">Select match...</option>
                              {currentQuestion.matchPairs?.map((rp, j) => (
                                <option key={j} value={String(j)}>
                                  {OPTION_LETTERS[j]}. {rp.right}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {(currentQuestion.type === 'hots' || currentQuestion.type === 'competency-based') && (
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                      {currentQuestion.type === 'hots' ? 'Higher Order Thinking' : 'Competency-based Answer'}
                    </label>
                    {currentQuestion.type === 'hots' && (
                      <p className="text-xs rounded-lg px-3 py-2 border" style={{ color: '#fbbf24', background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.25)' }}>
                        Apply critical thinking and analytical skills to answer this question.
                      </p>
                    )}
                    <textarea
                      value={textAnswers[currentQuestion.id] ?? ''}
                      onChange={(e) => handleTextAnswer(e.target.value)}
                      disabled={reviewMode}
                      rows={6}
                      placeholder="Write your answer here..."
                      className="w-full px-4 py-3 rounded-xl border-2 text-sm transition-all resize-none focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)]"
                      style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                    />
                    <p className="text-[11px] text-right" style={{ color: 'var(--text-muted)' }}>
                      {(textAnswers[currentQuestion.id] ?? '').length} characters
                    </p>
                  </div>
                )}
              </div>
            </div>

            {!reviewMode && (
              <div className="flex items-center justify-between mt-4 gap-3">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all',
                    currentIndex === 0 ? 'cursor-not-allowed opacity-40' : 'hover:bg-[var(--surface-2)]'
                  )}
                  style={
                    currentIndex === 0
                      ? { color: 'var(--text-muted)' }
                      : { color: 'var(--text-secondary)', background: 'var(--surface-1)', border: '1px solid var(--border)' }
                  }
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                    Q <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{currentIndex + 1}</span> of {questions.length}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSkip}
                    className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all hover:border-[rgba(245,158,11,0.5)]"
                    style={{ color: 'var(--text-muted)', background: 'var(--surface-1)', border: '1px solid var(--border)' }}
                  >
                    <SkipForward className="w-4 h-4" />
                    <span className="hidden sm:inline">Skip</span>
                  </button>

                  {currentIndex < questions.length - 1 ? (
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                      style={{ background: 'var(--brand-primary)', color: '#fff' }}
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowSubmitConfirm(true)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                      style={{ background: 'var(--brand-primary)', color: '#fff' }}
                    >
                      <Send className="w-4 h-4" />
                      <span className="hidden sm:inline">Submit</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!reviewMode && (
        <button
          onClick={() => setShowNavPanel(true)}
          className="fixed bottom-6 right-6 z-30 p-3 rounded-full shadow-lg transition-all hover:opacity-90 sm:hidden"
          style={{ background: 'var(--brand-primary)', color: '#fff' }}
        >
          <Grid3X3 className="w-5 h-5" />
        </button>
      )}

      <div className="hidden sm:flex fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setShowNavPanel(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg transition-all hover:bg-[var(--surface-2)]"
          style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
        >
          <Grid3X3 className="w-4 h-4" />
          Navigator
        </button>
      </div>

      <AnimatePresence>
        {showNavPanel && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
              onClick={() => setShowNavPanel(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] shadow-2xl z-50 flex flex-col"
              style={{ background: 'var(--surface-1)' }}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Question Navigator</h3>
                <button
                  onClick={() => setShowNavPanel(false)}
                  className="p-1.5 rounded-lg hover:bg-[var(--surface-2)]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="px-5 py-3 border-b flex gap-2 flex-wrap" style={{ borderColor: 'var(--border)' }}>
                <span className="flex items-center gap-1.5 text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                  <span className="w-3 h-3 rounded" style={{ background: 'rgba(16,185,129,0.25)', border: '1px solid rgba(16,185,129,0.5)' }} />
                  Answered
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                  <span className="w-3 h-3 rounded" style={{ background: 'rgba(245,158,11,0.25)', border: '1px solid rgba(245,158,11,0.5)' }} />
                  Bookmarked
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                  <span className="w-3 h-3 rounded" style={{ background: 'rgba(239,68,68,0.25)', border: '1px solid rgba(239,68,68,0.5)' }} />
                  Skipped
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                  <span className="w-3 h-3 rounded" style={{ background: 'var(--surface-3)', border: '1px solid var(--border)' }} />
                  Not visited
                </span>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4">
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((q, i) => {
                    const ans = answers.find((a) => a.questionId === q.id)
                    return (
                      <button
                        key={q.id}
                        onClick={() => handleGoTo(i)}
                        className={cn(
                          'aspect-square rounded-xl flex items-center justify-center text-xs font-bold transition-all',
                          i === currentIndex && 'ring-2 ring-[var(--brand-primary)] ring-offset-2 ring-offset-[var(--surface-1)]'
                        )}
                        style={getNavColor(i, answers, questions)}
                      >
                        {i + 1}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="px-5 py-4 border-t" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
                <div className="grid grid-cols-2 gap-2 text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
                  <span>Answered: <strong style={{ color: '#34d399' }}>{answeredCount}</strong></span>
                  <span>Skipped: <strong style={{ color: '#f87171' }}>{skippedCount}</strong></span>
                  <span>Bookmarked: <strong style={{ color: '#fbbf24' }}>{bookmarkedCount}</strong></span>
                  <span>Unvisited: <strong style={{ color: 'var(--text-primary)' }}>{questions.length - answers.length}</strong></span>
                </div>
                <button
                  onClick={() => {
                    setShowNavPanel(false)
                    setShowSubmitConfirm(true)
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                  style={{ background: 'var(--brand-primary)', color: '#fff' }}
                >
                  <Send className="w-4 h-4" />
                  Submit Test
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSubmitConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
              onClick={() => setShowSubmitConfirm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.target === e.currentTarget && setShowSubmitConfirm(false)}
            >
              <div className="rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" style={{ background: 'var(--surface-1)' }}>
                <div className="px-6 pt-6 pb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.15)' }}>
                      <AlertTriangle className="w-5 h-5" style={{ color: '#fbbf24' }} />
                    </div>
                    <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Submit Test?</h3>
                  </div>
                  <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
                    Are you sure you want to submit? You won&apos;t be able to change your answers after submission.
                  </p>

                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="text-center p-3 rounded-xl border" style={{ background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.3)' }}>
                      <p className="text-2xl font-bold" style={{ color: '#34d399' }}>{answeredCount}</p>
                      <p className="text-[11px] font-medium mt-0.5" style={{ color: '#34d399' }}>Answered</p>
                    </div>
                    <div className="text-center p-3 rounded-xl border" style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.3)' }}>
                      <p className="text-2xl font-bold" style={{ color: '#f87171' }}>{skippedCount}</p>
                      <p className="text-[11px] font-medium mt-0.5" style={{ color: '#f87171' }}>Skipped</p>
                    </div>
                    <div className="text-center p-3 rounded-xl border" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
                      <p className="text-2xl font-bold" style={{ color: 'var(--text-secondary)' }}>{questions.length - answeredCount - skippedCount}</p>
                      <p className="text-[11px] font-medium mt-0.5" style={{ color: 'var(--text-secondary)' }}>Unattempted</p>
                    </div>
                  </div>

                  {bookmarkedCount > 0 && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg border text-xs mb-4" style={{ background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.3)', color: '#fbbf24' }}>
                      <BookmarkCheck className="w-4 h-4" />
                      <span>{bookmarkedCount} question{bookmarkedCount > 1 ? 's' : ''} bookmarked for review</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 px-6 pb-6">
                  <button
                    onClick={() => setShowSubmitConfirm(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-[var(--surface-3)]"
                    style={{ color: 'var(--text-secondary)', background: 'var(--surface-2)' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                    style={{ background: 'var(--brand-primary)', color: '#fff' }}
                  >
                    <Send className="w-4 h-4" />
                    Confirm Submit
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPaused && !reviewMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm"
            onClick={handlePause}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="rounded-2xl p-8 text-center shadow-2xl max-w-sm mx-4"
              style={{ background: 'var(--surface-1)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(245,158,11,0.15)' }}>
                <Clock className="w-8 h-8" style={{ color: '#fbbf24' }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Timer Paused</h3>
              <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                Click anywhere or press the resume button to continue.
              </p>
              <button
                onClick={handlePause}
                className="px-6 py-3 rounded-xl font-semibold shadow-lg transition-all hover:opacity-90"
                style={{ background: 'var(--brand-primary)', color: '#fff' }}
              >
                Resume Exam
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
