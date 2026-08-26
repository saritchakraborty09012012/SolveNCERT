'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronDown, CheckCircle2, XCircle, Lightbulb, Shuffle } from 'lucide-react'
import { addXP, addMistake } from '@/lib/ai-learn/profile'

type Props = {
  onClose: () => void
  onAskAi?: (prompt: string) => void
}

type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Olympiad'
type QuestionType = 'mcq' | 'assertion-reason' | 'case-based' | 'short-answer' | 'long-answer' | 'numerical' | 'fill-blanks' | 'match'

const QUESTION_TYPES: { id: QuestionType; label: string }[] = [
  { id: 'mcq', label: 'MCQs' },
  { id: 'assertion-reason', label: 'Assertion & Reason' },
  { id: 'case-based', label: 'Case Based' },
  { id: 'short-answer', label: 'Short Answer' },
  { id: 'long-answer', label: 'Long Answer' },
  { id: 'numerical', label: 'Numericals' },
  { id: 'fill-blanks', label: 'Fill in Blanks' },
  { id: 'match', label: 'Match Following' },
]

const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard', 'Olympiad']

export function PracticeGenerator({ onClose, onAskAi }: Props) {
  const [topic, setTopic] = useState('')
  const [qType, setQType] = useState<QuestionType>('mcq')
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium')
  const [count, setCount] = useState(5)
  const [generating, setGenerating] = useState(false)

  const generate = () => {
    if (!topic.trim()) return
    setGenerating(true)
    const prompt = `Generate ${count} ${difficulty}-level ${qType === 'mcq' ? 'multiple choice questions' : qType} on the topic "${topic}" for CBSE students. For each question, provide: the question, options if MCQ, the correct answer, and a brief explanation. Return as JSON array with objects having: question, options (array for MCQ), answer, explanation.`
    onAskAi?.(prompt)
    setTimeout(() => { setGenerating(false); onClose() }, 500)
  }

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
        className="w-full max-w-md mx-4 rounded-2xl border border-cyan-500/20 bg-[#0a1628]/95 p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Shuffle className="size-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white">Practice Generator</h2>
          </div>
          <button onClick={onClose} className="text-cyan-400/40 hover:text-cyan-300 transition-colors">
            <X className="size-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-cyan-400/50 mb-1.5 block">Topic</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Quadratic Equations, Photosynthesis..."
              className="w-full rounded-lg border border-cyan-800/30 bg-cyan-950/20 px-3 py-2.5 text-sm text-white placeholder:text-cyan-200/25 focus:outline-none focus:border-cyan-500/40"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-cyan-400/50 mb-1.5 block">Question Type</label>
            <div className="flex flex-wrap gap-1.5">
              {QUESTION_TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setQType(t.id as QuestionType)}
                  className={`rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-all ${
                    qType === t.id
                      ? 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300'
                      : 'border-cyan-800/20 text-cyan-200/40 hover:border-cyan-600/20'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-cyan-400/50 mb-1.5 block">Difficulty</label>
            <div className="flex gap-1.5">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 rounded-lg border px-2 py-1.5 text-[11px] font-medium transition-all ${
                    difficulty === d
                      ? d === 'Olympiad' ? 'border-amber-400/30 bg-amber-400/10 text-amber-300' : 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300'
                      : 'border-cyan-800/20 text-cyan-200/40 hover:border-cyan-600/20'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-cyan-400/50 mb-1.5 block">Number of Questions: {count}</label>
            <input
              type="range"
              min={1}
              max={20}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
            <div className="flex justify-between text-[9px] text-cyan-400/30">
              <span>1</span><span>20</span>
            </div>
          </div>

          <button
            onClick={generate}
            disabled={!topic.trim() || generating}
            className="w-full rounded-xl bg-cyan-500/20 border border-cyan-400/40 py-3 text-sm font-bold text-cyan-300 transition-all hover:bg-cyan-500/30 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {generating ? 'Generating...' : `Generate ${count} Questions`}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
