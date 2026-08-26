'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Phone, PhoneOff, Loader2 } from 'lucide-react'

type Props = {
  isActive: boolean
  status: 'idle' | 'listening' | 'thinking' | 'speaking'
  interimText: string
  onToggle: () => void
  onInterrupt?: () => void
}

const STATUS_LABELS: Record<string, string> = {
  idle: 'READY',
  listening: 'LISTENING...',
  thinking: 'THINKING...',
  speaking: 'SPEAKING...',
}

const STATUS_COLORS: Record<string, string> = {
  idle: 'bg-cyan-400/60',
  listening: 'bg-green-400',
  thinking: 'bg-amber-400',
  speaking: 'bg-cyan-300',
}

export function LiveIndicator({ isActive, status, interimText, onToggle, onInterrupt }: Props) {
  if (!isActive) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="fixed inset-x-0 bottom-24 z-40 flex flex-col items-center gap-2 pointer-events-none"
    >
      {/* Pulsing ring */}
      <div className="relative pointer-events-auto">
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={
            status === 'speaking'
              ? { boxShadow: ['0 0 0 0 rgba(34,211,238,0.4)', '0 0 0 20px rgba(34,211,238,0)', '0 0 0 0 rgba(34,211,238,0.4)'] }
              : status === 'listening'
                ? { boxShadow: ['0 0 0 0 rgba(74,222,128,0.4)', '0 0 0 20px rgba(74,222,128,0)', '0 0 0 0 rgba(74,222,128,0.4)'] }
                : status === 'thinking'
                  ? { boxShadow: ['0 0 0 0 rgba(251,191,36,0.4)', '0 0 0 20px rgba(251,191,36,0)', '0 0 0 0 rgba(251,191,36,0.4)'] }
                  : {}
          }
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ margin: '-6px' }}
        />

        <button
          onClick={status === 'speaking' ? onInterrupt : onToggle}
          className={`relative flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-bold tracking-wider transition-all backdrop-blur-xl shadow-2xl ${
            status === 'speaking'
              ? 'border-red-400/50 bg-red-500/20 text-red-200 hover:bg-red-500/30'
              : status === 'listening'
                ? 'border-green-400/50 bg-green-500/20 text-green-200 hover:bg-green-500/30'
                : status === 'thinking'
                  ? 'border-amber-400/50 bg-amber-500/20 text-amber-200'
                  : 'border-cyan-400/50 bg-cyan-500/20 text-cyan-200 hover:bg-cyan-500/30'
          }`}
        >
          {status === 'thinking' ? (
            <Loader2 className="size-4 animate-spin" />
          ) : status === 'speaking' ? (
            <PhoneOff className="size-4" />
          ) : (
            <Phone className="size-4" />
          )}
          <span className="flex items-center gap-1.5">
            <span className={`size-1.5 rounded-full ${STATUS_COLORS[status]}`} />
            {STATUS_LABELS[status]}
          </span>
        </button>
      </div>

      {/* Interim text bubble */}
      <AnimatePresence>
        {interimText && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="max-w-sm mx-4 rounded-xl border border-cyan-800/20 bg-[#0a1628]/80 backdrop-blur-xl px-3 py-2 text-xs text-cyan-200/60"
          >
            {interimText}
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIVE badge */}
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
        </span>
        <span className="font-mono text-[9px] font-bold tracking-[0.3em] text-red-400/80">LIVE</span>
      </div>
    </motion.div>
  )
}
