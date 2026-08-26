'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Trash2, X, BookMarked } from 'lucide-react'
import { getMemory, saveMemory, type LearningMemory } from '@/lib/ai-learn/profile'

type Props = { onClose: () => void }

export function ErrorNotebook({ onClose }: Props) {
  const [memory, setMemory] = useState<LearningMemory>(getMemory)
  const mistakes = memory.mistakes.slice().reverse()

  const removeMistake = (index: number) => {
    const realIndex = memory.mistakes.length - 1 - index
    const updated = memory.mistakes.filter((_, i) => i !== realIndex)
    const newMem = saveMemory({ mistakes: updated })
    setMemory(newMem)
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
        className="w-full max-w-lg mx-4 max-h-[80vh] rounded-2xl border border-amber-500/20 bg-[#0a1628]/95 shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-amber-500/10">
          <div className="flex items-center gap-2">
            <BookMarked className="size-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white">Error Notebook</h2>
            <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-medium text-amber-300">{mistakes.length}</span>
          </div>
          <button onClick={onClose} className="text-cyan-400/40 hover:text-cyan-300 transition-colors">
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {mistakes.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="size-8 text-cyan-400/20 mx-auto mb-3" />
              <p className="text-sm text-cyan-200/40">No mistakes saved yet.</p>
              <p className="text-xs text-cyan-200/25 mt-1">When you get something wrong, it will appear here for review.</p>
            </div>
          ) : (
            mistakes.map((m, i) => (
              <div key={i} className="rounded-xl border border-cyan-800/20 bg-cyan-950/20 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-cyan-200/60 line-clamp-2">{m.question}</p>
                    <p className="text-[11px] text-cyan-300 mt-1 font-medium">Correct: {m.correctAnswer}</p>
                    <p className="text-[10px] text-cyan-400/40 mt-0.5">Topic: {m.topic}</p>
                  </div>
                  <button onClick={() => removeMistake(i)} className="text-cyan-400/20 hover:text-red-400 transition-colors flex-shrink-0">
                    <Trash2 className="size-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
