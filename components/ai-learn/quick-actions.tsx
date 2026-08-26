'use client'

import { useState } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { Shuffle, Map, BookOpen, MessageSquareWarning, FileCheck, Sparkles, Trophy, Lightbulb, X, CircleHelp } from 'lucide-react'
import { PracticeGenerator } from './practice-generator'

type Props = {
  onAskAi?: (prompt: string) => void
}

const QUICK_ACTIONS = [
  { id: 'practice', icon: Shuffle, label: 'Practice', color: 'text-green-400' },
  { id: 'quiz', icon: CircleHelp, label: 'Quiz Me', color: 'text-amber-400' },
  { id: 'roadmap', icon: Map, label: 'Roadmap', color: 'text-blue-400' },
  { id: 'ncert', icon: BookOpen, label: 'NCERT Reader', color: 'text-purple-400' },
  { id: 'doubt', icon: MessageSquareWarning, label: 'Doubt Solver', color: 'text-amber-400' },
  { id: 'answer-check', icon: FileCheck, label: 'Answer Check', color: 'text-pink-400' },
  { id: 'visualize', icon: Sparkles, label: 'Visualize', color: 'text-cyan-400' },
  { id: 'marks-booster', icon: Trophy, label: 'Marks Booster', color: 'text-yellow-400' },
  { id: 'why-correct', icon: Lightbulb, label: 'Why Correct?', color: 'text-orange-400' },
]

export function QuickActions({ onAskAi }: Props) {
  const router = useRouter()
  const [showPractice, setShowPractice] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const handleAction = (id: string) => {
    switch (id) {
      case 'practice':
        setShowPractice(true)
        break
      case 'quiz':
        router.push('/quizzes')
        break
      case 'roadmap':
        onAskAi?.('Generate a learning roadmap for this topic. Break it into subtopics with logical progression, estimated time, and difficulty levels.')
        break
      case 'ncert':
        onAskAi?.('Explain this NCERT concept line by line. Use the exact textbook language and then break it down simply.')
        break
      case 'doubt':
        onAskAi?.('I have a doubt about this concept. Please explain it from scratch and help me understand where I might be confused.')
        break
      case 'answer-check':
        onAskAi?.('I want to check my answer. Please evaluate it against CBSE marking scheme criteria and suggest improvements.')
        break
      case 'visualize':
        onAskAi?.('Create a visual explanation of this concept. Use diagrams, flowcharts, or analogies to help me visualize it.')
        break
      case 'marks-booster':
        onAskAi?.('Review my answer and tell me what CBSE keywords I am missing for full marks. Give me an improved version.')
        break
      case 'why-correct':
        onAskAi?.('Explain why this answer is correct. Break down the reasoning step by step and connect it to NCERT concepts.')
        break
    }
    setExpanded(false)
  }

  return (
    <>
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-30 hidden md:block">
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-0 top-1/2 -translate-y-1/2 mr-12 space-y-1.5"
            >
              {QUICK_ACTIONS.map((action) => (
                <motion.button
                  key={action.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => handleAction(action.id)}
                  className="flex items-center gap-2 rounded-xl border border-cyan-800/20 bg-[#0a1628]/90 backdrop-blur-xl px-3 py-2 text-xs text-cyan-200/70 hover:border-cyan-500/30 hover:text-white transition-all shadow-lg"
                >
                  <action.icon className={`size-3.5 ${action.color}`} />
                  {action.label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setExpanded(!expanded)}
          className={`relative flex size-10 items-center justify-center rounded-xl border transition-all shadow-lg ${
            expanded
              ? 'border-cyan-400/40 bg-cyan-400/15 text-cyan-300'
              : 'border-cyan-800/25 bg-[#0a1628]/80 text-cyan-400/50 hover:border-cyan-500/30 hover:text-cyan-300'
          } backdrop-blur-xl`}
        >
          {expanded ? <X className="size-4" /> : <Sparkles className="size-4" />}
        </motion.button>
      </div>

      <AnimatePresence>
        {showPractice && (
          <PracticeGenerator onClose={() => setShowPractice(false)} onAskAi={onAskAi} />
        )}
      </AnimatePresence>
    </>
  )
}
