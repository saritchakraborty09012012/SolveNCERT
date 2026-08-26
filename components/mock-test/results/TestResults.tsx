import React, { useState } from 'react'
import { useMockTestStore } from '@/store/mockTestStore'
import { cn } from '@/utils/helpers'
import {
  Trophy,
  Target,
  Clock,
  CheckCircle2,
  XCircle,
  Minus,
  TrendingUp,
  BarChart3,
  Brain,
  Lightbulb,
  RotateCcw,
  Home,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  Star,
  AlertCircle,
  BookOpen,
  Timer,
  ArrowLeft,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import MathRenderer from '@/components/features/MathRenderer'
import type { QuestionResult, TopicWiseAccuracy, TimeAnalysis } from '@/lib/mock-tests/types'

type Tab = 'overview' | 'questions' | 'analytics' | 'revision'

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m === 0) return `${s}s`
  return `${m}m ${s}s`
}

function getGrade(percentage: number): { label: string; color: string; bg: string } {
  if (percentage >= 80) return { label: 'Excellent', color: '#34d399', bg: 'rgba(16,185,129,0.12)' }
  if (percentage >= 60) return { label: 'Good', color: 'var(--brand-primary)', bg: 'color-mix(in srgb, var(--brand-primary) 12%, transparent)' }
  if (percentage >= 40) return { label: 'Average', color: '#fbbf24', bg: 'rgba(245,158,11,0.12)' }
  return { label: 'Needs Improvement', color: '#f87171', bg: 'rgba(239,68,68,0.12)' }
}

function getScoreRingColor(percentage: number): string {
  if (percentage >= 80) return '#10b981'
  if (percentage >= 60) return '#3b82f6'
  if (percentage >= 40) return '#f59e0b'
  return '#f43f5e'
}

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: Trophy },
  { id: 'questions', label: 'Question Analysis', icon: Eye },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'revision', label: 'Smart Revision', icon: Brain },
]

export default function TestResults() {
  const result = useMockTestStore((s) => s.result)
  const test = useMockTestStore((s) => s.test)
  const answers = useMockTestStore((s) => s.answers)
  const config = useMockTestStore((s) => s.config)
  const reset = useMockTestStore((s) => s.reset)
  const setStatus = useMockTestStore((s) => s.setStatus)

  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null)

  if (!result || !test) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--surface-0)' }}>
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 mx-auto text-[var(--text-muted)]" />
          <p className="text-[var(--text-secondary)] font-medium">No results available</p>
        </div>
      </div>
    )
  }

  const grade = getGrade(result.percentage)
  const circumference = 2 * Math.PI * 54
  const strokeDashoffset = circumference - (result.percentage / 100) * circumference

  const weakChapters = result.topicWiseAccuracy
    .filter((t) => t.accuracy < 60)
    .sort((a, b) => a.accuracy - b.accuracy)

  const strongChapters = result.topicWiseAccuracy
    .filter((t) => t.accuracy >= 70)
    .sort((a, b) => b.accuracy - a.accuracy)

  const incorrectResults = result.questionResults.filter((r) => !r.isCorrect && !r.isSkipped)

  const handleRetake = () => {
    reset()
    setStatus('setup')
  }

  const handleHome = () => {
    reset()
    setStatus('setup')
  }

  const toggleQuestion = (num: number) => {
    setExpandedQuestion(expandedQuestion === num ? null : num)
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface-0)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Test Results</h1>
                <p className="text-sm text-[var(--text-muted)] mt-1">
                  {config?.subject} &middot; {result.totalMarks} marks &middot; {test.totalQuestions} questions
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRetake}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-[var(--text-secondary)] bg-[var(--surface-1)] border border-[var(--border)] hover:bg-[var(--surface-2)] shadow-sm transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">Retake</span>
                </button>
                <button
                  onClick={handleHome}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-[var(--text-secondary)] bg-[var(--surface-1)] border border-[var(--border)] hover:bg-[var(--surface-2)] shadow-sm transition-all"
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Home</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-1 p-1 bg-[var(--surface-1)] rounded-2xl border border-[var(--border)] shadow-sm mb-6 overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-1 justify-center',
                    activeTab === tab.id
                      ? 'bg-[var(--brand-primary)] text-white shadow-md'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--surface-2)]'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              )
            })}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="bg-[var(--surface-1)] rounded-2xl border border-[var(--border)] shadow-sm p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row items-center gap-8">
                    <div className="relative flex-shrink-0">
                      <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="54" fill="none" strokeWidth="8" style={{ stroke: 'var(--surface-3)' }} />
                        <motion.circle
                          cx="60"
                          cy="60"
                          r="54"
                          fill="none"
                          stroke={getScoreRingColor(result.percentage)}
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          initial={{ strokeDashoffset: circumference }}
                          animate={{ strokeDashoffset }}
                          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span
                          className="text-4xl font-bold text-[var(--text-primary)]"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                        >
                          {Math.round(result.percentage)}%
                        </motion.span>
                        <span className="text-xs font-semibold mt-1 px-2.5 py-0.5 rounded-full" style={{ color: grade.color, background: grade.bg }}>
                          {grade.label}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 w-full">
                      <div className="text-center sm:text-left mb-4">
                        <h2 className="text-xl font-bold text-[var(--text-primary)]">
                          {result.score} / {result.totalMarks} marks
                        </h2>
                        <p className="text-sm text-[var(--text-muted)] mt-1">
                          You answered {result.correctAnswers} out of {test.totalQuestions} questions correctly
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-3 rounded-xl border" style={{ background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.3)' }}>
                          <div className="flex items-center justify-center gap-1.5 mb-1">
                            <CheckCircle2 className="w-4 h-4 text-[#34d399]" />
                            <span className="text-xs font-semibold text-[#34d399]">Correct</span>
                          </div>
                          <p className="text-2xl font-bold text-[#34d399]">{result.correctAnswers}</p>
                        </div>
                        <div className="text-center p-3 rounded-xl border" style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.3)' }}>
                          <div className="flex items-center justify-center gap-1.5 mb-1">
                            <XCircle className="w-4 h-4 text-[#f87171]" />
                            <span className="text-xs font-semibold text-[#f87171]">Incorrect</span>
                          </div>
                          <p className="text-2xl font-bold text-[#f87171]">{result.incorrectAnswers}</p>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                          <div className="flex items-center justify-center gap-1.5 mb-1">
                            <Minus className="w-4 h-4 text-[var(--text-muted)]" />
                            <span className="text-xs font-semibold text-[var(--text-secondary)]">Skipped</span>
                          </div>
                          <p className="text-2xl font-bold text-[var(--text-muted)]">{result.skippedQuestions}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[var(--surface-1)] rounded-2xl border border-[var(--border)] shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 rounded-lg" style={{ background: 'color-mix(in srgb, var(--brand-primary) 12%, transparent)' }}>
                        <Target className="w-4 h-4 text-[var(--brand-primary)]" />
                      </div>
                      <span className="text-sm font-semibold text-[var(--text-secondary)]">Accuracy</span>
                    </div>
                    <p className="text-3xl font-bold text-[var(--text-primary)]">{Math.round(result.accuracy)}%</p>
                    <div className="mt-2 h-1.5 bg-[var(--surface-2)] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[var(--brand-primary)] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${result.accuracy}%` }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                      />
                    </div>
                  </div>

                  <div className="bg-[var(--surface-1)] rounded-2xl border border-[var(--border)] shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 rounded-lg" style={{ background: 'rgba(245,158,11,0.12)' }}>
                        <Clock className="w-4 h-4 text-[#fbbf24]" />
                      </div>
                      <span className="text-sm font-semibold text-[var(--text-secondary)]">Time Taken</span>
                    </div>
                    <p className="text-3xl font-bold text-[var(--text-primary)]">{formatTime(result.timeTaken)}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      of {formatTime(result.timeLimit)} allowed
                    </p>
                  </div>

                  <div className="bg-[var(--surface-1)] rounded-2xl border border-[var(--border)] shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 rounded-lg" style={{ background: 'rgba(167,139,250,0.12)' }}>
                        <Timer className="w-4 h-4 text-[#a78bfa]" />
                      </div>
                      <span className="text-sm font-semibold text-[var(--text-secondary)]">Avg. Time / Q</span>
                    </div>
                    <p className="text-3xl font-bold text-[var(--text-primary)]">
                      {formatTime(Math.round(result.timeAnalysis.avgTimePerQuestion))}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] mt-1 capitalize">
                      {result.timeAnalysis.timeManagementRating}
                    </p>
                  </div>
                </div>

                <div className="bg-[var(--surface-1)] rounded-2xl border border-[var(--border)] shadow-sm p-5 sm:p-6">
                  <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-4">Time Analysis</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-[var(--text-muted)] mb-1">Fastest Question</p>
                      <p className="text-sm font-semibold text-[var(--text-secondary)]">
                        {formatTime(result.timeAnalysis.fastestQuestion.time)}
                      </p>
                      <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                        Q{result.questionResults.findIndex((q) => q.questionId === result.timeAnalysis.fastestQuestion.id) + 1}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-muted)] mb-1">Slowest Question</p>
                      <p className="text-sm font-semibold text-[var(--text-secondary)]">
                        {formatTime(result.timeAnalysis.slowestQuestion.time)}
                      </p>
                      <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                        Q{result.questionResults.findIndex((q) => q.questionId === result.timeAnalysis.slowestQuestion.id) + 1}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-muted)] mb-1">Within Time</p>
                      <p className="text-sm font-semibold text-[#34d399]">
                        {result.timeAnalysis.questionsWithinTime} questions
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-muted)] mb-1">Over Time</p>
                      <p className="text-sm font-semibold text-[#f87171]">
                        {result.timeAnalysis.questionsOverTime} questions
                      </p>
                    </div>
                  </div>
                </div>

                {strongChapters.length > 0 && (
                  <div className="bg-[var(--surface-1)] rounded-2xl border border-[var(--border)] shadow-sm p-5 sm:p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Star className="w-5 h-5 text-[#34d399]" />
                      <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">Strengths</h3>
                    </div>
                    <div className="space-y-2">
                      {strongChapters.map((ch) => (
                        <div
                          key={ch.chapter}
                          className="flex items-center justify-between p-3 rounded-xl border"
                          style={{ background: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.25)' }}
                        >
                          <div>
                            <p className="text-sm font-semibold text-[var(--text-secondary)]">{ch.chapter}</p>
                            <p className="text-xs text-[var(--text-muted)]">{ch.correctAnswers}/{ch.totalQuestions} correct</p>
                          </div>
                          <span className="text-sm font-bold text-[#34d399]">{Math.round(ch.accuracy)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.weaknesses.length > 0 && (
                  <div className="bg-[var(--surface-1)] rounded-2xl border border-[var(--border)] shadow-sm p-5 sm:p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <AlertCircle className="w-5 h-5 text-[#fbbf24]" />
                      <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">Weaknesses</h3>
                    </div>
                    <div className="space-y-2">
                      {weakChapters.map((ch) => (
                        <div
                          key={ch.chapter}
                          className="flex items-center justify-between p-3 rounded-xl border"
                          style={{ background: 'rgba(245,158,11,0.06)', borderColor: 'rgba(245,158,11,0.25)' }}
                        >
                          <div>
                            <p className="text-sm font-semibold text-[var(--text-secondary)]">{ch.chapter}</p>
                            <p className="text-xs text-[var(--text-muted)]">{ch.correctAnswers}/{ch.totalQuestions} correct</p>
                          </div>
                          <span className="text-sm font-bold text-amber-600">{Math.round(ch.accuracy)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.recommendations.length > 0 && (
                  <div className="bg-[var(--surface-1)] rounded-2xl border border-[var(--border)] shadow-sm p-5 sm:p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Lightbulb className="w-5 h-5 text-[var(--brand-primary)]" />
                      <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">Recommendations</h3>
                    </div>
                    <div className="space-y-2.5">
                      {result.recommendations.map((rec, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3 rounded-xl border"
                          style={{ background: 'color-mix(in srgb, var(--brand-primary) 7%, transparent)', borderColor: 'color-mix(in srgb, var(--brand-primary) 25%, transparent)' }}
                        >
                          <TrendingUp className="w-4 h-4 text-[var(--brand-primary)] mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleRetake}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-[var(--brand-primary)] shadow-lg hover:opacity-90 transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Retake Test
                  </button>
                  <button
                    onClick={handleHome}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-[var(--text-secondary)] bg-[var(--surface-1)] border border-[var(--border)] hover:bg-[var(--surface-2)] shadow-sm transition-all"
                  >
                    <Home className="w-4 h-4" />
                    Back to Home
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'questions' && (
              <motion.div
                key="questions"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                {result.questionResults.map((qr) => {
                  const isExpanded = expandedQuestion === qr.questionNumber
                  const statusStyle = qr.isCorrect
                    ? { borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.05)' }
                    : qr.isSkipped
                    ? { borderColor: 'var(--border)', background: 'var(--surface-1)' }
                    : { borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)' }

                  return (
                    <motion.div
                      key={qr.questionId}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl border shadow-sm overflow-hidden"
                      style={statusStyle}
                    >
                      <button
                        onClick={() => toggleQuestion(qr.questionNumber)}
                        className="w-full flex items-center gap-3 p-4 text-left"
                      >
                        <span
                          className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
                          style={
                            qr.isCorrect
                              ? { background: 'rgba(16,185,129,0.15)', color: '#34d399' }
                              : qr.isSkipped
                              ? { background: 'var(--surface-2)', color: 'var(--text-secondary)' }
                              : { background: 'rgba(239,68,68,0.15)', color: '#f87171' }
                          }
                        >
                          {qr.questionNumber}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-[var(--text-muted)] uppercase">{qr.type}</span>
                            <span className="text-[10px] text-[var(--text-muted)]">|</span>
                            <span className="text-[10px] font-medium text-[var(--text-muted)] capitalize">{qr.difficulty}</span>
                            <span className="text-[10px] text-[var(--text-muted)]">|</span>
                            <span className="text-[10px] text-[var(--text-muted)]">{qr.chapter}</span>
                          </div>
                          <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-1">
                            <MathRenderer text={qr.question.slice(0, 120)} />
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {qr.isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-[#34d399]" />
                          ) : qr.isSkipped ? (
                            <Minus className="w-5 h-5 text-[var(--text-muted)]" />
                          ) : (
                            <XCircle className="w-5 h-5 text-[#f87171]" />
                          )}
                          <span className="text-xs text-[var(--text-muted)]">{formatTime(qr.timeTaken)}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
                          )}
                        </div>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 pt-0 border-t border-[var(--border)]">
                              <div className="mt-4 space-y-3">
                                <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                                  <p className="text-xs font-bold text-[var(--text-muted)] uppercase mb-1.5">Question</p>
                                  <div className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                    <MathRenderer text={qr.question} />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div className="p-3 rounded-xl border" style={{ background: 'rgba(239,68,68,0.06)', borderColor: 'rgba(239,68,68,0.25)' }}>
                                    <p className="text-xs font-bold text-[#f87171] uppercase mb-1">Your Answer</p>
                                    <p className="text-sm text-[var(--text-primary)]">
                                      {qr.isSkipped ? (
                                        <span className="text-[var(--text-muted)] italic">Skipped</span>
                                      ) : (
                                        <MathRenderer text={qr.selectedAnswer} />
                                      )}
                                    </p>
                                  </div>
                                  <div className="p-3 rounded-xl border" style={{ background: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.25)' }}>
                                    <p className="text-xs font-bold text-[#34d399] uppercase mb-1">Correct Answer</p>
                                    <p className="text-sm text-[var(--text-primary)]">
                                      <MathRenderer text={qr.correctAnswer} />
                                    </p>
                                  </div>
                                </div>

                                {qr.explanation && (
                                  <div className="p-3 rounded-xl border" style={{ background: 'color-mix(in srgb, var(--brand-primary) 7%, transparent)', borderColor: 'color-mix(in srgb, var(--brand-primary) 25%, transparent)' }}>
                                    <p className="text-xs font-bold text-[var(--brand-primary)] uppercase mb-1.5">Explanation</p>
                                    <div className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                      <MathRenderer text={qr.explanation} />
                                    </div>
                                  </div>
                                )}

                                {qr.concept && (
                                  <div className="p-3 rounded-xl border" style={{ background: 'rgba(167,139,250,0.08)', borderColor: 'rgba(167,139,250,0.3)' }}>
                                    <p className="text-xs font-bold text-[#a78bfa] uppercase mb-1.5">Concept</p>
                                    <p className="text-sm text-[var(--text-secondary)]">{qr.concept}</p>
                                  </div>
                                )}

                                {qr.revisionTip && (
                                  <div className="p-3 rounded-xl border" style={{ background: 'rgba(245,158,11,0.06)', borderColor: 'rgba(245,158,11,0.25)' }}>
                                    <p className="text-xs font-bold text-[#fbbf24] uppercase mb-1.5">Revision Tip</p>
                                    <p className="text-sm text-[var(--text-secondary)]">{qr.revisionTip}</p>
                                  </div>
                                )}

                                <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] pt-1">
                                  <span>Marks: {qr.marks}/{qr.maxMarks}</span>
                                  <span>Time: {formatTime(qr.timeTaken)}</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="bg-[var(--surface-1)] rounded-2xl border border-[var(--border)] shadow-sm p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <BarChart3 className="w-5 h-5 text-[var(--brand-primary)]" />
                    <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">Topic-wise Accuracy</h3>
                  </div>
                  <div className="space-y-3">
                    {result.topicWiseAccuracy.map((topic) => (
                      <div key={topic.chapter}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-medium text-[var(--text-secondary)] truncate pr-2">{topic.chapter}</span>
                          <span className="text-xs font-bold text-[var(--text-muted)] whitespace-nowrap">
                            {topic.correctAnswers}/{topic.totalQuestions} &middot; {Math.round(topic.accuracy)}%
                          </span>
                        </div>
                        <div className="h-2.5 bg-[var(--surface-2)] rounded-full overflow-hidden">
                          <motion.div
                            className={cn(
                              'h-full rounded-full',
                              topic.accuracy >= 70
                                ? 'bg-[#10b981]'
                                : topic.accuracy >= 40
                                ? 'bg-[#f59e0b]'
                                : 'bg-[#f43f5e]'
                            )}
                            initial={{ width: 0 }}
                            animate={{ width: `${topic.accuracy}%` }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[var(--surface-1)] rounded-2xl border border-[var(--border)] shadow-sm p-5 sm:p-6">
                    <div className="flex items-center gap-2 mb-5">
                      <BookOpen className="w-5 h-5 text-[#a78bfa]" />
                      <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">By Question Type</h3>
                    </div>
                    <div className="space-y-3">
                      {result.typeWiseAccuracy.map((t) => (
                        <div key={t.type} className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                          <span className="text-sm font-medium text-[var(--text-secondary)] capitalize">{t.type.replace('-', ' ')}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-[var(--text-muted)]">{t.correctAnswers}/{t.totalQuestions}</span>
                            <span className={cn(
                              'text-sm font-bold',
                              t.accuracy >= 70 ? 'text-[#34d399]' : t.accuracy >= 40 ? 'text-amber-600' : 'text-[#f87171]'
                            )}>
                              {Math.round(t.accuracy)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[var(--surface-1)] rounded-2xl border border-[var(--border)] shadow-sm p-5 sm:p-6">
                    <div className="flex items-center gap-2 mb-5">
                      <TrendingUp className="w-5 h-5 text-[#34d399]" />
                      <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">By Difficulty</h3>
                    </div>
                    <div className="space-y-3">
                      {result.difficultyWisePerformance.map((d) => (
                        <div key={d.difficulty} className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-[var(--text-secondary)] capitalize">{d.difficulty}</span>
                            <span className={cn(
                              'text-sm font-bold',
                              d.accuracy >= 70 ? 'text-[#34d399]' : d.accuracy >= 40 ? 'text-amber-600' : 'text-[#f87171]'
                            )}>
                              {Math.round(d.accuracy)}%
                            </span>
                          </div>
                          <div className="h-2 bg-[var(--surface-3)] rounded-full overflow-hidden">
                            <motion.div
                              className={cn(
                                'h-full rounded-full',
                                d.accuracy >= 70 ? 'bg-emerald-500' : d.accuracy >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                              )}
                              initial={{ width: 0 }}
                              animate={{ width: `${d.accuracy}%` }}
                              transition={{ duration: 0.6, delay: 0.3 }}
                            />
                          </div>
                          <p className="text-xs text-[var(--text-muted)] mt-1.5">{d.correctAnswers} of {d.totalQuestions} correct</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--surface-1)] rounded-2xl border border-[var(--border)] shadow-sm p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <Timer className="w-5 h-5 text-[#fbbf24]" />
                    <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">Time Performance</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                      <p className="text-xs text-[var(--text-muted)] mb-1">Total Time</p>
                      <p className="text-lg font-bold text-[var(--text-secondary)]">{formatTime(result.timeAnalysis.totalTime)}</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                      <p className="text-xs text-[var(--text-muted)] mb-1">Avg. per Question</p>
                      <p className="text-lg font-bold text-[var(--text-secondary)]">{formatTime(Math.round(result.timeAnalysis.avgTimePerQuestion))}</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                      <p className="text-xs text-[var(--text-muted)] mb-1">Fastest</p>
                      <p className="text-lg font-bold text-[#34d399]">{formatTime(result.timeAnalysis.fastestQuestion.time)}</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                      <p className="text-xs text-[var(--text-muted)] mb-1">Slowest</p>
                      <p className="text-lg font-bold text-[#f87171]">{formatTime(result.timeAnalysis.slowestQuestion.time)}</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 rounded-xl border" style={{ background: 'color-mix(in srgb, var(--brand-primary) 7%, transparent)', borderColor: 'color-mix(in srgb, var(--brand-primary) 25%, transparent)' }}>
                    <p className="text-xs font-bold text-[var(--brand-primary)] uppercase mb-1">Management Rating</p>
                    <p className="text-sm font-semibold text-[var(--text-primary)] capitalize">{result.timeAnalysis.timeManagementRating}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'revision' && (
              <motion.div
                key="revision"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {weakChapters.length > 0 && (
                  <div className="bg-[var(--surface-1)] rounded-2xl border border-[var(--border)] shadow-sm p-5 sm:p-6">
                    <div className="flex items-center gap-2 mb-5">
                      <AlertCircle className="w-5 h-5 text-[#f87171]" />
                      <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">Chapters Needing Revision</h3>
                    </div>
                    <div className="space-y-3">
                      {weakChapters.map((ch) => (
                        <div
                          key={ch.chapter}
                          className="p-4 rounded-xl border"
                          style={{ background: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.25)' }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-bold text-[var(--text-primary)]">{ch.chapter}</h4>
                            <span className="text-sm font-bold text-[#f87171]">{Math.round(ch.accuracy)}%</span>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden mb-2" style={{ background: 'rgba(239,68,68,0.15)' }}>
                            <div
                              className="h-full bg-[#f87171] rounded-full"
                              style={{ width: `${ch.accuracy}%` }}
                            />
                          </div>
                          <p className="text-xs text-[var(--text-secondary)]">
                            {ch.correctAnswers} of {ch.totalQuestions} correct &middot; {formatTime(ch.timeTaken)} spent
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {incorrectResults.length > 0 && (
                  <div className="bg-[var(--surface-1)] rounded-2xl border border-[var(--border)] shadow-sm p-5 sm:p-6">
                    <div className="flex items-center gap-2 mb-5">
                      <BookOpen className="w-5 h-5 text-[#a78bfa]" />
                      <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">Questions to Revise</h3>
                    </div>
                    <div className="space-y-2">
                      {incorrectResults.map((qr) => (
                        <div
                          key={qr.questionId}
                          className="p-4 rounded-xl border"
                          style={{ background: 'rgba(167,139,250,0.06)', borderColor: 'rgba(167,139,250,0.25)' }}
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(167,139,250,0.15)', color: '#a78bfa' }}>
                                Q{qr.questionNumber}
                              </span>
                              <span className="text-xs font-medium text-[var(--text-secondary)] capitalize">{qr.chapter}</span>
                            </div>
                            <span className="text-xs font-medium text-[#f87171] capitalize">{qr.difficulty}</span>
                          </div>
                          <div className="text-sm text-[var(--text-primary)] leading-relaxed mb-2">
                            <MathRenderer text={qr.question.slice(0, 200)} />
                          </div>
                          {qr.revisionTip && (
                            <div className="flex items-start gap-2 p-2.5 rounded-lg border mt-2" style={{ background: 'rgba(245,158,11,0.06)', borderColor: 'rgba(245,158,11,0.25)' }}>
                              <Lightbulb className="w-3.5 h-3.5 text-[#fbbf24] mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{qr.revisionTip}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.strengths.length > 0 && (
                  <div className="bg-[var(--surface-1)] rounded-2xl border border-[var(--border)] shadow-sm p-5 sm:p-6">
                    <div className="flex items-center gap-2 mb-5">
                      <Star className="w-5 h-5 text-[#34d399]" />
                      <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">Strong Areas to Maintain</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.strengths.map((s, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium text-[#34d399]"
                          style={{ background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.3)' }}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {result.recommendations.length > 0 && (
                  <div className="bg-[var(--surface-1)] rounded-2xl border border-[var(--border)] shadow-sm p-5 sm:p-6">
                    <div className="flex items-center gap-2 mb-5">
                      <Lightbulb className="w-5 h-5 text-[var(--brand-primary)]" />
                      <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">Study Recommendations</h3>
                    </div>
                    <div className="space-y-2.5">
                       {result.recommendations.map((rec, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3 rounded-xl border"
                          style={{ background: 'color-mix(in srgb, var(--brand-primary) 7%, transparent)', borderColor: 'color-mix(in srgb, var(--brand-primary) 25%, transparent)' }}
                        >
                          <TrendingUp className="w-4 h-4 text-[var(--brand-primary)] mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleRetake}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-[var(--brand-primary)] shadow-lg hover:opacity-90 transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Retake Test
                  </button>
                  <button
                    onClick={handleHome}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-[var(--text-secondary)] bg-[var(--surface-1)] border border-[var(--border)] hover:bg-[var(--surface-2)] shadow-sm transition-all"
                  >
                    <Home className="w-4 h-4" />
                    Back to Home
                  </button>
                  <button
                    onClick={() => window.location.href = '/quizzes'}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold shadow-sm transition-all hover:opacity-90"
                    style={{ color: '#fbbf24', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.35)' }}
                  >
                    Try Chapter Quizzes
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
