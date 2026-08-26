import React from 'react'
import { cn } from '@/utils/helpers'
import { BarChart3, TrendingUp, Clock, Target, Zap, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'

interface TopicWiseAccuracy {
  chapter: string
  totalQuestions: number
  correctAnswers: number
  accuracy: number
  timeTaken: number
}

interface TypeWiseAccuracy {
  type: string
  totalQuestions: number
  correctAnswers: number
  accuracy: number
}

interface DifficultyWisePerformance {
  difficulty: string
  totalQuestions: number
  correctAnswers: number
  accuracy: number
}

interface TimeAnalysis {
  totalTime: number
  avgTimePerQuestion: number
  fastestQuestion: { id: string; time: number }
  slowestQuestion: { id: string; time: number }
  timeManagementRating: string
  questionsWithinTime: number
  questionsOverTime: number
}

interface PerformanceChartsProps {
  topicWiseAccuracy: TopicWiseAccuracy[]
  typeWiseAccuracy: TypeWiseAccuracy[]
  difficultyWisePerformance: DifficultyWisePerformance[]
  timeAnalysis: TimeAnalysis
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  visible: { transition: { staggerChildren: 0.1 } },
}

function getAccuracyColor(accuracy: number): string {
  if (accuracy >= 80) return 'bg-[#10b981]'
  if (accuracy >= 50) return 'bg-[#f59e0b]'
  return 'bg-[#ef4444]'
}

function getAccuracyTextColor(accuracy: number): string {
  if (accuracy >= 80) return 'text-[#34d399]'
  if (accuracy >= 50) return 'text-[#fbbf24]'
  return 'text-[#f87171]'
}

function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case 'easy': return '#22c55e'
    case 'moderate': return '#3b82f6'
    case 'hard': return '#ef4444'
    default: return '#6b7280'
  }
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}m ${secs}s`
}

export default function PerformanceCharts({
  topicWiseAccuracy,
  typeWiseAccuracy,
  difficultyWisePerformance,
  timeAnalysis,
}: PerformanceChartsProps) {
  const totalQuestions = timeAnalysis.questionsWithinTime + timeAnalysis.questionsOverTime
  const withinTimePercent = totalQuestions > 0 ? (timeAnalysis.questionsWithinTime / totalQuestions) * 100 : 0

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="space-y-6"
    >
      <motion.div variants={fadeInUp} className="flex items-center gap-2">
        <BarChart3 className="h-6 w-6 text-[var(--brand-primary)]" />
        <h2 className="text-2xl font-bold">Performance Analytics</h2>
      </motion.div>

      <motion.div variants={fadeInUp} className="bg-[var(--surface-1)] rounded-xl p-6 shadow-sm border border-[var(--border)]">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-5 w-5 text-[var(--brand-primary)]" />
          <h3 className="text-lg font-semibold">Topic-wise Accuracy</h3>
        </div>
        <div className="space-y-4">
          {topicWiseAccuracy.map((topic) => (
            <div key={topic.chapter} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--text-primary)] truncate max-w-[60%]">
                  {topic.chapter}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--text-muted)]">
                    {topic.correctAnswers}/{topic.totalQuestions}
                  </span>
                  <span className={cn('text-sm font-bold', getAccuracyTextColor(topic.accuracy))}>
                    {topic.accuracy.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="h-3 bg-[var(--surface-2)] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${topic.accuracy}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={cn('h-full rounded-full', getAccuracyColor(topic.accuracy))}
                />
              </div>
            </div>
          ))}
          {topicWiseAccuracy.length === 0 && (
            <p className="text-sm text-[var(--text-muted)] text-center py-4">No topic data available</p>
          )}
        </div>
      </motion.div>

      <motion.div variants={fadeInUp} className="bg-[var(--surface-1)] rounded-xl p-6 shadow-sm border border-[var(--border)]">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-[var(--brand-primary)]" />
          <h3 className="text-lg font-semibold">Question Type Accuracy</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {typeWiseAccuracy.map((type) => (
            <div
              key={type.type}
              className="bg-[var(--surface-2)] rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--text-primary)]">{type.type}</span>
                <span className={cn('text-sm font-bold', getAccuracyTextColor(type.accuracy))}>
                  {type.accuracy.toFixed(1)}%
                </span>
              </div>
              <div className="h-3 bg-[var(--surface-3)] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${type.accuracy}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={cn('h-full rounded-full', getAccuracyColor(type.accuracy))}
                />
              </div>
              <div className="text-xs text-[var(--text-muted)]">
                {type.correctAnswers} correct out of {type.totalQuestions}
              </div>
            </div>
          ))}
          {typeWiseAccuracy.length === 0 && (
            <p className="text-sm text-[var(--text-muted)] text-center py-4 col-span-2">
              No question type data available
            </p>
          )}
        </div>
      </motion.div>

      <motion.div variants={fadeInUp} className="bg-[var(--surface-1)] rounded-xl p-6 shadow-sm border border-[var(--border)]">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="h-5 w-5 text-[var(--brand-primary)]" />
          <h3 className="text-lg font-semibold">Difficulty-wise Performance</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {difficultyWisePerformance.map((diff) => {
            const color = getDifficultyColor(diff.difficulty)
            const circumference = 2 * Math.PI * 40
            const offset = circumference - (diff.accuracy / 100) * circumference

            return (
              <div
                key={diff.difficulty}
                className="bg-[var(--surface-2)] rounded-lg p-6 flex flex-col items-center space-y-3"
              >
                <span className="text-sm font-semibold text-[var(--text-primary)] capitalize">
                  {diff.difficulty}
                </span>
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      strokeWidth="8"
                      style={{ stroke: 'var(--surface-3)' }}
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={color}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset: offset }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold" style={{ color }}>
                      {diff.accuracy.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div className="text-xs text-[var(--text-muted)] text-center">
                  {diff.correctAnswers}/{diff.totalQuestions} correct
                </div>
              </div>
            )
          })}
          {difficultyWisePerformance.length === 0 && (
            <p className="text-sm text-[var(--text-muted)] text-center py-4 col-span-3">
              No difficulty data available
            </p>
          )}
        </div>
      </motion.div>

      <motion.div variants={fadeInUp} className="bg-[var(--surface-1)] rounded-xl p-6 shadow-sm border border-[var(--border)]">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-[var(--brand-primary)]" />
          <h3 className="text-lg font-semibold">Time Performance</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-[var(--surface-2)] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-[#fbbf24]" />
                <span className="text-sm font-medium text-[var(--text-primary)]">Avg. Time per Question</span>
              </div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {formatTime(Math.round(timeAnalysis.avgTimePerQuestion))}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg p-3" style={{ background: 'rgba(16,185,129,0.08)' }}>
                <p className="text-xs text-[#34d399] font-medium mb-1">Fastest</p>
                <p className="text-sm font-bold text-[#34d399]">
                  {formatTime(timeAnalysis.fastestQuestion.time)}
                </p>
              </div>
              <div className="rounded-lg p-3" style={{ background: 'rgba(239,68,68,0.08)' }}>
                <p className="text-xs text-[#f87171] font-medium mb-1">Slowest</p>
                <p className="text-sm font-bold text-[#f87171]">
                  {formatTime(timeAnalysis.slowestQuestion.time)}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-[var(--surface-2)] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[var(--text-primary)]">Time Management Rating</span>
                <span className="text-sm font-bold text-[var(--brand-primary)]">
                  {timeAnalysis.timeManagementRating}
                </span>
              </div>
            </div>

            <div className="bg-[var(--surface-2)] rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-[var(--text-primary)]">Questions Within Time</span>
                <span className="text-sm font-bold text-[#34d399]">
                  {timeAnalysis.questionsWithinTime}/{totalQuestions}
                </span>
              </div>
              <div className="h-3 bg-[var(--surface-3)] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${withinTimePercent}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full bg-[#10b981]"
                />
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-[var(--text-muted)]">
                  {withinTimePercent.toFixed(0)}% within time
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  {timeAnalysis.questionsOverTime} over time
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
