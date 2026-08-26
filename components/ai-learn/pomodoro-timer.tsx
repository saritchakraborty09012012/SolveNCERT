'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Timer, Coffee } from 'lucide-react'
import { addMinutesStudied } from '@/lib/ai-learn/profile'

type Props = { onTimeUpdate?: (minutes: number) => void }

const WORK_MINUTES = 25
const BREAK_MINUTES = 5
const LONG_BREAK_MINUTES = 15
const POMODOROS_BEFORE_LONG = 4

export function PomodoroTimer({ onTimeUpdate }: Props) {
  const [isWork, setIsWork] = useState(true)
  const [secondsLeft, setSecondsLeft] = useState(WORK_MINUTES * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [pomodoroCount, setPomodoroCount] = useState(0)
  const [totalWorkMinutes, setTotalWorkMinutes] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)

  const totalSeconds = isWork
    ? (pomodoroCount % POMODOROS_BEFORE_LONG === POMODOROS_BEFORE_LONG - 1 ? LONG_BREAK_MINUTES : WORK_MINUTES) * 60
    : BREAK_MINUTES * 60
  const progress = 1 - secondsLeft / totalSeconds
  const minutes = Math.floor(secondsLeft / 60)
  const secs = secondsLeft % 60

  const clearTimer = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
  }, [])

  useEffect(() => {
    if (!isRunning) { clearTimer(); return }
    startTimeRef.current = Date.now()
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearTimer()
          if (isWork) {
            const mins = Math.round((Date.now() - (startTimeRef.current ?? Date.now())) / 60000)
            setTotalWorkMinutes((t) => {
              const next = t + Math.max(1, mins)
              addMinutesStudied(Math.max(1, mins))
              onTimeUpdate?.(next)
              return next
            })
            const newCount = pomodoroCount + 1
            setPomodoroCount(newCount)
            const isLong = newCount % POMODOROS_BEFORE_LONG === 0
            setIsWork(false)
            return (isLong ? LONG_BREAK_MINUTES : BREAK_MINUTES) * 60
          } else {
            setIsWork(true)
            return WORK_MINUTES * 60
          }
        }
        return prev - 1
      })
    }, 1000)
    return clearTimer
  }, [isRunning, isWork, pomodoroCount, clearTimer, onTimeUpdate])

  const reset = () => { clearTimer(); setIsRunning(false); setIsWork(true); setSecondsLeft(WORK_MINUTES * 60) }

  const circumference = 2 * Math.PI * 54
  const dashOffset = circumference * (1 - progress)

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative size-32">
        <svg className="size-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(34,211,238,0.08)" strokeWidth="5" />
          <circle
            cx="60" cy="60" r="54" fill="none"
            stroke={isWork ? 'rgba(34,211,238,0.7)' : 'rgba(34,211,238,0.3)'}
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-2xl font-bold text-white tabular-nums">
            {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-400/60">
            {isWork ? 'FOCUS' : 'BREAK'}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="flex items-center gap-1.5 rounded-lg bg-cyan-500/15 border border-cyan-400/30 px-3 py-1.5 text-xs font-medium text-cyan-300 hover:bg-cyan-500/25 transition-colors"
        >
          {isRunning ? <Pause className="size-3" /> : <Play className="size-3" />}
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button onClick={reset} className="flex items-center gap-1.5 rounded-lg border border-cyan-800/30 px-3 py-1.5 text-xs text-cyan-400/60 hover:text-cyan-300 transition-colors">
          <RotateCcw className="size-3" />
        </button>
      </div>

      <div className="flex items-center gap-3 text-[10px] text-cyan-400/40">
        <span className="flex items-center gap-1"><Timer className="size-3" /> {pomodoroCount} completed</span>
        <span className="flex items-center gap-1"><Coffee className="size-3" /> {totalWorkMinutes} min studied</span>
      </div>
    </div>
  )
}
