import React, { useState } from 'react'
import { cn } from '@/utils/helpers'
import { CheckCircle2, XCircle, Minus, ChevronDown, ChevronUp, Clock, BookOpen, Lightbulb, AlertCircle, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import MathRenderer from '@/components/features/MathRenderer'

interface QuestionResult {
  questionId: string
  questionNumber: number
  question: string
  type: string
  difficulty: string
  chapter: string
  subject: string
  selectedAnswer: string | null
  correctAnswer: string
  isCorrect: boolean
  isSkipped: boolean
  timeTaken: number
  explanation: string
  concept: string
  revisionTip: string
  marks: number
  maxMarks: number
}

type FilterType = 'all' | 'correct' | 'incorrect' | 'skipped'

const filterTabs: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'correct', label: 'Correct' },
  { key: 'incorrect', label: 'Incorrect' },
  { key: 'skipped', label: 'Skipped' },
]

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (mins === 0) return `${secs}s`
  return `${mins}m ${secs}s`
}

function getDifficultyColor(difficulty: string): React.CSSProperties {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return { background: 'rgba(16,185,129,0.15)', color: '#34d399' }
    case 'medium':
      return { background: 'rgba(245,158,11,0.15)', color: '#fbbf24' }
    case 'hard':
      return { background: 'rgba(239,68,68,0.15)', color: '#f87171' }
    default:
      return { background: 'var(--surface-2)', color: 'var(--text-secondary)' }
  }
}

function getTypeColor(type: string): React.CSSProperties {
  switch (type.toLowerCase()) {
    case 'mcq':
      return { background: 'color-mix(in srgb, var(--brand-primary) 12%, transparent)', color: 'var(--brand-primary)' }
    case 'true/false':
      return { background: 'rgba(167,139,250,0.15)', color: '#a78bfa' }
    case 'assertion-reason':
      return { background: 'rgba(129,140,248,0.15)', color: '#818cf8' }
    case 'case-based':
      return { background: 'rgba(244,114,182,0.15)', color: '#f472b6' }
    default:
      return { background: 'var(--surface-2)', color: 'var(--text-secondary)' }
  }
}

export default function QuestionAnalysis({ results }: { results: QuestionResult[] }) {
  const [filter, setFilter] = useState<FilterType>('all')
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set())

  const filteredResults = results.filter((q) => {
    if (filter === 'correct') return q.isCorrect
    if (filter === 'incorrect') return !q.isCorrect && !q.isSkipped
    if (filter === 'skipped') return q.isSkipped
    return true
  })

  const stats = {
    total: results.length,
    correct: results.filter((q) => q.isCorrect).length,
    incorrect: results.filter((q) => !q.isCorrect && !q.isSkipped).length,
    skipped: results.filter((q) => q.isSkipped).length,
  }

  const toggleExpand = (questionId: string) => {
    setExpandedQuestions((prev) => {
      const next = new Set(prev)
      if (next.has(questionId)) {
        next.delete(questionId)
      } else {
        next.add(questionId)
      }
      return next
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total" value={stats.total} icon={<BookOpen className="w-4 h-4" />} color="var(--brand-primary)" bg="color-mix(in srgb, var(--brand-primary) 10%, transparent)" />
        <StatCard label="Correct" value={stats.correct} icon={<CheckCircle2 className="w-4 h-4" />} color="#34d399" bg="rgba(16,185,129,0.1)" />
        <StatCard label="Incorrect" value={stats.incorrect} icon={<XCircle className="w-4 h-4" />} color="#f87171" bg="rgba(239,68,68,0.1)" />
        <StatCard label="Skipped" value={stats.skipped} icon={<Minus className="w-4 h-4" />} color="var(--text-secondary)" bg="var(--surface-2)" />
      </div>

      <div className="flex flex-wrap gap-2">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              filter !== tab.key && 'hover:bg-[var(--surface-2)]'
            )}
            style={
              filter === tab.key
                ? { background: 'var(--brand-primary)', color: '#fff' }
                : { background: 'var(--surface-1)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }
            }
          >
            {tab.label}
            <span className="ml-1.5 text-xs opacity-75">
              ({tab.key === 'all' ? stats.total : stats[tab.key]})
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredResults.map((q) => {
            const isExpanded = expandedQuestions.has(q.questionId)
            return (
              <motion.div
                key={q.questionId}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
              >
                <button
                  onClick={() => toggleExpand(q.questionId)}
                  className="w-full px-4 sm:px-5 py-4 flex items-start gap-3 text-left hover:bg-[var(--surface-2)] transition-colors"
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {q.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-[#34d399]" />
                    ) : q.isSkipped ? (
                      <Minus className="w-5 h-5 text-[var(--text-muted)]" />
                    ) : (
                      <XCircle className="w-5 h-5 text-[#f87171]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-[var(--text-primary)]">
                        Q{q.questionNumber}.
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs font-medium" style={getTypeColor(q.type)}>
                        {q.type}
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs font-medium" style={getDifficultyColor(q.difficulty)}>
                        {q.difficulty}
                      </span>
                      <span className="text-xs text-[var(--text-muted)] hidden sm:inline">
                        {q.chapter}
                      </span>
                    </div>
                    <div className="text-sm text-[var(--text-primary)] line-clamp-2">
                      <MathRenderer text={q.question} />
                    </div>
                  </div>

                  <div className="flex-shrink-0 mt-1">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-[var(--text-muted)]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[var(--text-muted)]" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-5 pb-5 pt-0 border-t border-[var(--border)] space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Your Answer</p>
                            <p className={cn(
                              'text-sm font-semibold',
                              q.isCorrect ? 'text-[#34d399]' : q.isSkipped ? 'text-[var(--text-muted)]' : 'text-[#f87171]'
                            )}>
                              {q.selectedAnswer || 'Skipped'}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Correct Answer</p>
                            <p className="text-sm font-semibold text-[#34d399]">{q.correctAnswer}</p>
                          </div>
                          <div className="flex gap-4">
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Time
                              </p>
                              <p className="text-sm font-semibold text-[var(--text-primary)]">{formatTime(q.timeTaken)}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Marks</p>
                              <p className={cn(
                                'text-sm font-semibold',
                                q.marks === q.maxMarks ? 'text-[#34d399]' : q.marks > 0 ? 'text-[#fbbf24]' : 'text-[#f87171]'
                              )}>
                                {q.marks}/{q.maxMarks}
                              </p>
                            </div>
                          </div>
                        </div>

                        {q.explanation && (
                          <div className="rounded-lg p-4 border" style={{ background: 'color-mix(in srgb, var(--brand-primary) 7%, transparent)', borderColor: 'color-mix(in srgb, var(--brand-primary) 25%, transparent)' }}>
                            <p className="text-xs font-medium text-[var(--brand-primary)] uppercase tracking-wide mb-2 flex items-center gap-1">
                              <Lightbulb className="w-3 h-3" /> Explanation
                            </p>
                            <div className="text-sm text-[var(--text-primary)]">
                              <MathRenderer text={q.explanation} />
                            </div>
                          </div>
                        )}

                        {q.concept && (
                          <div className="rounded-lg p-4 border" style={{ background: 'rgba(167,139,250,0.08)', borderColor: 'rgba(167,139,250,0.3)' }}>
                            <p className="text-xs font-medium text-[#a78bfa] uppercase tracking-wide mb-2 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> Related Concept
                            </p>
                            <p className="text-sm text-[var(--text-primary)]">{q.concept}</p>
                          </div>
                        )}

                        {q.revisionTip && (
                          <div className="rounded-lg p-4 border" style={{ background: 'rgba(245,158,11,0.06)', borderColor: 'rgba(245,158,11,0.25)' }}>
                            <p className="text-xs font-medium text-[#fbbf24] uppercase tracking-wide mb-2 flex items-center gap-1">
                              <Star className="w-3 h-3" /> Quick Revision Tip
                            </p>
                            <p className="text-sm text-[var(--text-primary)]">{q.revisionTip}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {filteredResults.length === 0 && (
          <div className="text-center py-12 text-[var(--text-muted)]">
            <BookOpen className="w-12 h-12 mx-auto mb-3 text-[var(--text-muted)] opacity-50" />
            <p className="text-sm">No questions match this filter.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, color, bg }: { label: string; value: number; icon: React.ReactNode; color: string; bg: string }) {
  return (
    <div className="rounded-xl p-4" style={{ background: bg }}>
      <div className="flex items-center gap-2 mb-1">
        <span style={{ color }}>{icon}</span>
        <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
    </div>
  )
}
