'use client'

import { useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { X, TrendingUp, BookOpen, AlertTriangle, Clock, Trophy, Zap, CircleHelp } from 'lucide-react'
import { getMemory, type LearningMemory } from '@/lib/ai-learn/profile'

type Props = { onClose: () => void }

export function PerformanceAnalytics({ onClose }: Props) {
  const router = useRouter()
  const [memory] = useState<LearningMemory>(getMemory)

  const stats = [
    { icon: Zap, label: 'Total XP', value: memory.totalXP.toLocaleString(), color: 'text-yellow-400' },
    { icon: Trophy, label: 'Level', value: String(memory.level), color: 'text-cyan-400' },
    { icon: TrendingUp, label: 'Day Streak', value: `${memory.streak} days`, color: 'text-green-400' },
    { icon: BookOpen, label: 'Topics Done', value: String(memory.completedTopics.length), color: 'text-blue-400' },
    { icon: AlertTriangle, label: 'Mistakes Saved', value: String(memory.mistakes.length), color: 'text-amber-400' },
    { icon: Clock, label: 'Study Time', value: `${memory.totalMinutesStudied} min`, color: 'text-purple-400' },
  ]

  const subjectCounts: Record<string, number> = {}
  for (const t of memory.completedTopics) {
    subjectCounts[t.subject] = (subjectCounts[t.subject] || 0) + 1
  }
  const sortedSubjects = Object.entries(subjectCounts).sort((a, b) => b[1] - a[1])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-[#04080c]/90 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg mx-4 max-h-[80vh] rounded-2xl border border-cyan-500/20 bg-[#0a1628]/95 shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-cyan-500/10">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white">Performance Analytics</h2>
          </div>
          <button onClick={onClose} className="text-cyan-400/40 hover:text-cyan-300 transition-colors">
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-cyan-800/20 bg-cyan-950/20 p-3 text-center">
                <s.icon className={`size-4 mx-auto mb-1 ${s.color}`} />
                <p className="text-lg font-bold text-white">{s.value}</p>
                <p className="text-[10px] text-cyan-400/50 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>

          {sortedSubjects.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-cyan-300/60 uppercase tracking-wider mb-2">Subjects Covered</h3>
              <div className="space-y-1.5">
                {sortedSubjects.map(([subject, count]) => (
                  <div key={subject} className="flex items-center gap-2">
                    <span className="text-xs text-cyan-200/60 flex-1">{subject}</span>
                    <div className="w-24 h-1.5 rounded-full bg-cyan-900/30 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-cyan-400/50"
                        style={{ width: `${Math.min(100, (count / Math.max(1, sortedSubjects[0][1])) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-cyan-400/40 w-6 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {memory.weakChapters.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-amber-300/60 uppercase tracking-wider mb-2">Weak Areas</h3>
              <div className="flex flex-wrap gap-1.5">
                {memory.weakChapters.map((w, i) => (
                  <span key={i} className="rounded-lg bg-amber-400/10 border border-amber-400/20 px-2 py-1 text-[10px] text-amber-300">
                    {w.chapter} ({w.subject})
                  </span>
                ))}
              </div>
            </div>
          )}

          {memory.badges.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-cyan-300/60 uppercase tracking-wider mb-2">Badges</h3>
              <div className="flex flex-wrap gap-1.5">
                {memory.badges.map((b, i) => (
                  <span key={i} className="rounded-lg bg-cyan-400/10 border border-cyan-400/20 px-2 py-1 text-[10px] text-cyan-300">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => { onClose(); router.push('/quizzes'); }}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-xs font-semibold text-amber-300 hover:bg-amber-400/20 transition-all"
          >
            <CircleHelp className="size-3.5" /> Take a Quiz
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
