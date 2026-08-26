'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { ResponseSection } from '@/lib/avatar/types'

export const KIND_LABEL: Record<ResponseSection['kind'], string> = {
  statement: 'EXPLANATION',
  bullets: 'KEY POINTS',
  code: 'CODE',
  math: 'FORMULA',
  recap: 'REMEMBER',
  joke: 'NOTE',
}

/** Fast word-by-word reveal for a single content line. */
export function RevealLine({ text, delay }: { text: string; delay: number }) {
  const words = useRef(text.split(/\s+/).filter(Boolean)).current
  const [visible, setVisible] = useState(0)

  useEffect(() => {
    const start = setTimeout(() => {
      if (words.length === 0) {
        setVisible(0)
        return
      }
      const stepMs = Math.max(18, Math.min(42, 560 / words.length))
      let i = 0
      const id = setInterval(() => {
        i++
        setVisible(i)
        if (i >= words.length) clearInterval(id)
      }, stepMs)
      return () => clearInterval(id)
    }, delay)
    return () => clearTimeout(start)
  }, [words, delay])

  return (
    <>
      {words.slice(0, visible).join(' ')}
      {visible < words.length ? <span className="animate-pulse">▌</span> : null}
    </>
  )
}

function Line({ text, delay, kind }: { text: string; delay: number; kind: ResponseSection['kind'] }) {
  return (
    <p
      className={`font-mono fs-body leading-relaxed ${
        kind === 'code'
          ? 'text-cyan-100'
          : kind === 'math'
            ? 'text-center text-[1.15em] text-cyan-200 text-glow'
            : kind === 'joke'
              ? 'italic text-cyan-100/90'
              : 'text-cyan-50/90'
      }`}
    >
      <RevealLine text={text} delay={delay} />
    </p>
  )
}

/** Determine card size based on content amount and kind */
function getCardSize(section: ResponseSection): 'compact' | 'default' | 'expanded' | 'massive' {
  const totalWords = section.content.reduce((acc, c) => acc + c.split(/\s+/).filter(Boolean).length, 0)
  const contentLines = section.content.length

  if (section.kind === 'joke' || (totalWords < 20 && contentLines <= 2)) return 'compact'
  if (totalWords > 120 || contentLines > 8) return 'massive'
  if (totalWords > 60 || contentLines > 4) return 'expanded'
  return 'default'
}

const SIZE_CLASSES = {
  compact: 'max-h-[180px]',
  default: 'max-h-[320px]',
  expanded: 'max-h-[480px]',
  massive: 'max-h-[600px]',
}

const KIND_COLORS: Record<ResponseSection['kind'], string> = {
  statement: 'border-cyan-400/35 bg-slate-950/75 shadow-[0_0_34px_-10px_rgba(34,211,238,0.55)]',
  bullets: 'border-emerald-400/35 bg-slate-950/75 shadow-[0_0_34px_-10px_rgba(52,211,153,0.55)]',
  code: 'border-violet-400/35 bg-slate-950/80 shadow-[0_0_34px_-10px_rgba(167,139,250,0.55)]',
  math: 'border-amber-400/35 bg-slate-950/75 shadow-[0_0_34px_-10px_rgba(251,191,36,0.55)]',
  recap: 'border-rose-400/35 bg-slate-950/75 shadow-[0_0_34px_-10px_rgba(251,113,133,0.55)]',
  joke: 'border-cyan-300/25 bg-slate-950/60 shadow-[0_0_24px_-10px_rgba(34,211,238,0.35)]',
}

const KIND_ACCENT: Record<ResponseSection['kind'], string> = {
  statement: 'bg-cyan-300',
  bullets: 'bg-emerald-300',
  code: 'bg-violet-300',
  math: 'bg-amber-300',
  recap: 'bg-rose-300',
  joke: 'bg-cyan-200',
}

export function ResponsePanel({
  section,
  index,
  side,
  onFocus,
}: {
  section: ResponseSection
  index: number
  side: 'left' | 'right'
  onFocus: (index: number | null) => void
}) {
  const enterDelay = 0.18 + index * 0.38
  const cardSize = getCardSize(section)

  useEffect(() => {
    const words = section.content.reduce((acc, c) => acc + c.split(/\s+/).filter(Boolean).length, 0)
    const revealMs = Math.max(700, words * 60)
    const focusAt = enterDelay * 1000 + 120
    const releaseAt = enterDelay * 1000 + revealMs

    const t1 = setTimeout(() => onFocus(index), focusAt)
    const t2 = setTimeout(() => onFocus(null), releaseAt)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [enterDelay, index, section, onFocus])

  const lineDelay = (i: number) => (enterDelay + 0.35 + i * 0.18) * 1000

  return (
    <motion.div
      initial={{ opacity: 0, y: 26, x: side === 'left' ? -34 : 34, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      transition={{ duration: 0.55, delay: enterDelay, ease: 'easeOut' }}
      className={`relative overflow-hidden rounded-xl border backdrop-blur-md ${SIZE_CLASSES[cardSize]} ${
        KIND_COLORS[section.kind]
      } ${cardSize === 'massive' ? 'col-span-full' : ''} ${
        side === 'left'
          ? 'lg:[transform:perspective(1000px)_rotateY(-6deg)]'
          : 'lg:[transform:perspective(1000px)_rotateY(6deg)]'
      }`}
    >
      <span className="hud-scanline" aria-hidden="true" />
      <span className="hud-3d__corner hud-3d__corner--tl" aria-hidden="true" />
      <span className="hud-3d__corner hud-3d__corner--tr" aria-hidden="true" />
      <span className="hud-3d__corner hud-3d__corner--bl" aria-hidden="true" />
      <span className="hud-3d__corner hud-3d__corner--br" aria-hidden="true" />

      <div className="px-4 py-3">
        <motion.div
          initial={{ opacity: 0, letterSpacing: '0.1em' }}
          animate={{ opacity: 1, letterSpacing: '0.32em' }}
          transition={{ duration: 0.5, delay: enterDelay + 0.08 }}
          className="flex items-center gap-2"
        >
          <span className={`h-1.5 w-1.5 rounded-full ${KIND_ACCENT[section.kind]} shadow-[0_0_8px_rgba(34,211,238,0.9)]`} />
          <h3 className="font-display fs-title font-bold uppercase text-cyan-100 text-glow">
            {section.heading}
          </h3>
          <span className="ml-auto font-mono fs-micro tracking-[0.2em] text-cyan-300/50">
            {KIND_LABEL[section.kind]} / {String(index + 1).padStart(2, '0')}
          </span>
        </motion.div>

        <div className="mt-2 space-y-1.5 overflow-y-auto hud-scroll-slim">
          {section.content.map((line, i) => (
            <div key={i} className="flex gap-2">
              {section.kind === 'bullets' && (
                <span className="mt-px shrink-0 font-mono text-[10px] text-emerald-300/80">◆</span>
              )}
              <Line text={line} delay={lineDelay(i)} kind={section.kind} />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-cyan-300/50 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-cyan-300/50 to-transparent" />
    </motion.div>
  )
}
