'use client'

import { useState } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Flame, Star, BarChart3, BookMarked, Settings, Timer, ChevronLeft, ChevronRight, CircleHelp } from 'lucide-react'
import { getMemory, type LearningMemory } from '@/lib/ai-learn/profile'
import { PomodoroTimer } from './pomodoro-timer'
import { PerformanceAnalytics } from './performance-analytics'
import { ErrorNotebook } from './error-notebook'
import { LearnProfileSettings } from './learn-profile-settings'

type Props = {
  onModeChange?: (mode: string) => void
  activeMode?: string
}

const FEYNMAN_MODES = [
  { id: 'default', label: 'Auto', desc: 'AI adapts' },
  { id: 'feynman-beginner', label: 'Beginner', desc: 'Simplest words' },
  { id: 'feynman-class6', label: 'Class 6', desc: 'Easy level' },
  { id: 'feynman-class9', label: 'Class 9', desc: 'NCERT level' },
  { id: 'feynman-exam', label: 'Exam Prep', desc: 'Marks focused' },
  { id: 'feynman-advanced', label: 'Advanced', desc: 'Deep dive' },
]

export function LearnSidebar({ onModeChange, activeMode }: Props) {
  const router = useRouter()
  const [memory] = useState<LearningMemory>(getMemory)
  const [collapsed, setCollapsed] = useState(false)
  const [showPomodoro, setShowPomodoro] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showNotebook, setShowNotebook] = useState(false)
  const [showFeynman, setShowFeynman] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const xpPercent = memory.totalXP % 100

  if (collapsed) {
    return (
      <div className="hidden lg:flex flex-col items-center gap-3 py-4 px-2">
        <button onClick={() => setCollapsed(false)} className="text-cyan-400/40 hover:text-cyan-300 transition-colors">
          <ChevronRight className="size-4" />
        </button>
        <div className="flex flex-col items-center gap-3">
          <div className="relative size-10">
            <svg className="size-full -rotate-90" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="17" fill="none" stroke="rgba(34,211,238,0.1)" strokeWidth="3" />
              <circle cx="20" cy="20" r="17" fill="none" stroke="rgba(34,211,238,0.5)" strokeWidth="3"
                strokeDasharray={2 * Math.PI * 17}
                strokeDashoffset={2 * Math.PI * 17 * (1 - xpPercent / 100)}
                strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-cyan-300">{memory.level}</span>
          </div>
          <Zap className="size-4 text-yellow-400" />
          <Flame className="size-4 text-orange-400" />
          <BookMarked className="size-4 text-amber-400" />
          <BarChart3 className="size-4 text-cyan-400" />
          <Timer className="size-4 text-purple-400" />
        </div>
      </div>
    )
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex flex-col w-56 border-r border-cyan-800/15 bg-[#060e1a]/60 overflow-y-auto"
      >
        <div className="flex items-center justify-between px-3 py-3 border-b border-cyan-800/10">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400/50">Dashboard</span>
          <button onClick={() => setCollapsed(true)} className="text-cyan-400/30 hover:text-cyan-300 transition-colors">
            <ChevronLeft className="size-3.5" />
          </button>
        </div>

        <div className="p-3 space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative size-12">
              <svg className="size-full -rotate-90" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(34,211,238,0.1)" strokeWidth="3.5" />
                <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(34,211,238,0.6)" strokeWidth="3.5"
                  strokeDasharray={2 * Math.PI * 20}
                  strokeDashoffset={2 * Math.PI * 20 * (1 - xpPercent / 100)}
                  strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">{memory.level}</span>
            </div>
            <div>
              <p className="text-xs font-bold text-white">Level {memory.level}</p>
              <p className="text-[10px] text-cyan-400/50">{xpPercent}/100 XP</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <div className="rounded-lg bg-cyan-950/30 p-2 text-center">
              <Zap className="size-3 text-yellow-400 mx-auto mb-0.5" />
              <p className="text-[11px] font-bold text-white">{memory.totalXP}</p>
              <p className="text-[8px] text-cyan-400/40">XP</p>
            </div>
            <div className="rounded-lg bg-cyan-950/30 p-2 text-center">
              <Flame className="size-3 text-orange-400 mx-auto mb-0.5" />
              <p className="text-[11px] font-bold text-white">{memory.streak}</p>
              <p className="text-[8px] text-cyan-400/40">Streak</p>
            </div>
            <div className="rounded-lg bg-cyan-950/30 p-2 text-center">
              <Star className="size-3 text-cyan-400 mx-auto mb-0.5" />
              <p className="text-[11px] font-bold text-white">{memory.badges.length}</p>
              <p className="text-[8px] text-cyan-400/40">Badges</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <button onClick={() => setShowPomodoro(!showPomodoro)}
              className="w-full flex items-center gap-2 rounded-lg border border-cyan-800/15 bg-cyan-950/20 px-2.5 py-2 text-left text-xs text-cyan-200/60 hover:border-cyan-600/30 hover:text-cyan-200 transition-all">
              <Timer className="size-3.5 text-purple-400" /> Pomodoro Timer
            </button>
            <button onClick={() => setShowAnalytics(!showAnalytics)}
              className="w-full flex items-center gap-2 rounded-lg border border-cyan-800/15 bg-cyan-950/20 px-2.5 py-2 text-left text-xs text-cyan-200/60 hover:border-cyan-600/30 hover:text-cyan-200 transition-all">
              <BarChart3 className="size-3.5 text-cyan-400" /> Analytics
            </button>
            <button onClick={() => setShowNotebook(!showNotebook)}
              className="w-full flex items-center gap-2 rounded-lg border border-cyan-800/15 bg-cyan-950/20 px-2.5 py-2 text-left text-xs text-cyan-200/60 hover:border-cyan-600/30 hover:text-cyan-200 transition-all">
              <BookMarked className="size-3.5 text-amber-400" /> Error Notebook
              {memory.mistakes.length > 0 && (
                <span className="ml-auto rounded-full bg-amber-400/15 px-1.5 py-0.5 text-[9px] text-amber-300">{memory.mistakes.length}</span>
              )}
            </button>
            <button onClick={() => setShowSettings(!showSettings)}
              className="w-full flex items-center gap-2 rounded-lg border border-cyan-800/15 bg-cyan-950/20 px-2.5 py-2 text-left text-xs text-cyan-200/60 hover:border-cyan-600/30 hover:text-cyan-200 transition-all">
              <Settings className="size-3.5 text-cyan-400" /> Profile Settings
            </button>
            <button onClick={() => router.push('/quizzes')}
              className="w-full flex items-center gap-2 rounded-lg border border-cyan-800/15 bg-cyan-950/20 px-2.5 py-2 text-left text-xs text-cyan-200/60 hover:border-cyan-600/30 hover:text-cyan-200 transition-all">
              <CircleHelp className="size-3.5 text-amber-400" /> Quizzes
            </button>
          </div>

          <div>
            <button onClick={() => setShowFeynman(!showFeynman)}
              className="flex items-center gap-1.5 text-[10px] text-cyan-400/40 uppercase tracking-wider mb-1.5 hover:text-cyan-300 transition-colors">
              <Settings className="size-3" /> Explanation Level
            </button>
            {showFeynman && (
              <div className="space-y-1">
                {FEYNMAN_MODES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => onModeChange?.(m.id)}
                    className={`w-full flex items-center justify-between rounded-lg border px-2.5 py-1.5 text-left transition-all ${
                      activeMode === m.id
                        ? 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300'
                        : 'border-cyan-800/10 bg-transparent text-cyan-200/40 hover:border-cyan-600/20'
                    }`}
                  >
                    <span className="text-[11px] font-medium">{m.label}</span>
                    <span className="text-[9px] opacity-60">{m.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showPomodoro && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-[#04080c]/90 backdrop-blur-xl"
            onClick={() => setShowPomodoro(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="rounded-2xl border border-purple-500/20 bg-[#0a1628]/95 p-6 shadow-2xl">
              <PomodoroTimer />
            </motion.div>
          </motion.div>
        )}
        {showAnalytics && <PerformanceAnalytics onClose={() => setShowAnalytics(false)} />}
        {showNotebook && <ErrorNotebook onClose={() => setShowNotebook(false)} />}
        {showSettings && <LearnProfileSettings onClose={() => setShowSettings(false)} />}
      </AnimatePresence>
    </>
  )
}
