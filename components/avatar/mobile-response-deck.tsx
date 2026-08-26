'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useAvatarSystem } from './avatar-state-controller'
import { CardDeck } from './card-deck'
import { KIND_LABEL, RevealLine } from './response-panel'
import type { ResponseSection } from '@/lib/avatar/types'

/**
 * MobileResponseDeck — on phones the structured reply appears as ONE card deck
 * (all sections stacked one behind the other), centred just above the voice
 * console and below the face's chin, instead of the flanking panels. The deck
 * hugs its content — its height is exactly the front card's height, so there
 * is no empty space inside the rectangles.
 *
 * Driving it:
 *  - While GENERATING, the front card types out its text then swipes to the
 *    back; the next card lifts forward and types — one card at a time, with the
 *    face tracking whichever card is typing.
 *  - While the AI READS it aloud, the cascade advances in sync with the
 *    narration, the face watching each card before it swipes away.
 *  - When reading ends the deck goes still — cards only move by hand. After a
 *    few seconds a "swipe" prompt re-peeks every 2s until the user swipes once
 *    manually, which is remembered in localStorage so it stops appearing.
 */
export function MobileResponseDeck() {
  const { response, status, scene, focusPanel } = useAvatarSystem()
  const sections = response?.sections ?? []
  const [front, setFront] = useState(0)
  const [hintPeek, setHintPeek] = useState(0)
  const [hintVisible, setHintVisible] = useState(false)
  // Typewriter runs once per reply: only during the initial generation cascade.
  // After that the text stays written — no re-typing on swipes, narration, etc.
  const [typingActive, setTypingActive] = useState(() => status === 'generating')
  const manualRef = useRef(false)

  // ---- first manual swipe is remembered and stops the swipe prompt ---------
  useEffect(() => {
    if (typeof window === 'undefined') return
    manualRef.current = localStorage.getItem('nexus-reply-swipe-seen') === '1'
  }, [])

  const markManual = useCallback(() => {
    manualRef.current = true
    if (typeof window !== 'undefined') {
      localStorage.setItem('nexus-reply-swipe-seen', '1')
    }
  }, [])

  // ---- generation / reading cascade: card types -> swipes back -> next ------
  const phase = status === 'generating' ? 'gen' : status === 'speaking' ? 'read' : null

  const schedule = useCallback(
    (i: number) => {
      setFront(i)
      focusPanel(i)
    },
    [focusPanel],
  )

  useSequenceDriving({ items: sections, phase, onStep: schedule })

  // The moment generation ends, every card is fully written and never retypes.
  useEffect(() => {
    if (status !== 'generating') setTypingActive(false)
  }, [status])

  // ---- swipe prompt: ~3.5s after reading ends, re-peeks every 2s ------------
  useEffect(() => {
    if (scene !== 'response' || status !== 'idle') {
      setHintVisible(false)
      return
    }
    setHintVisible(false)
    const show = setTimeout(() => setHintVisible(true), 3500)
    const tick = setInterval(() => setHintPeek((p) => p + 1), 2000)
    return () => {
      clearTimeout(show)
      clearInterval(tick)
    }
  }, [scene, status, response])

  if (scene !== 'response' || !response || sections.length === 0) return null

  const dismissHint = useCallback(() => {
    markManual()
    setHintVisible(false)
  }, [markManual])

  const items = sections.map((s, i) => (
    <ReplyCard key={s.id} section={s} index={i} active={i === front} revealed={!typingActive} />
  ))

  return (
    <div className="pointer-events-none absolute inset-0 md:hidden">
      {/* One deck — every reply section stacked behind the front card */}
      <div className="pointer-events-auto absolute left-1/2 bottom-[clamp(150px,20dvh,175px)] w-[calc(100vw-24px)] max-w-[540px] -translate-x-1/2">
        <SizedDeck items={items} frontIndex={front} onFrontChange={(next) => { setFront(next); dismissHint() }} />
      </div>

      {/* Swipe prompt — a hand that swipes sideways */}
      {hintVisible && !manualRef.current && (
        <div
          key={`hint-${hintPeek}`}
          className="animate-hint-peek absolute left-1/2 top-[46%] z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-cyan-300/40 bg-slate-950/85 px-3.5 py-1.5 font-mono fs-micro tracking-[0.2em] text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.4)] backdrop-blur-md"
        >
          <span className="swipe-hand text-base leading-none">👆</span>
          <span>SWIPE</span>
          <span className="swipe-arrow text-cyan-300">◀</span>
          <span className="swipe-arrow text-cyan-300">▶</span>
          <span>FOR NEXT CARD</span>
        </div>
      )}
    </div>
  )
}

/** Sizes the deck to the exact height of the card sitting at the front, so
 *  the rectangles never have empty space and shorter cards don't stretch. */
function SizedDeck({
  items,
  frontIndex,
  onFrontChange,
}: {
  items: ReactNode[]
  frontIndex: number
  onFrontChange: (next: number) => void
}) {
  const [height, setHeight] = useState(0)
  const measureRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = measureRef.current
    if (!el) return
    const target = el.children[frontIndex] as HTMLElement | undefined
    if (!target) return
    const update = () => setHeight(target.offsetHeight)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(target)
    return () => ro.disconnect()
  }, [items, frontIndex])

  return (
    <div className="relative w-full" style={{ height: height > 0 ? height : undefined }}>
      {/* invisible measuring copy — same width, holds the natural heights */}
      <div ref={measureRef} aria-hidden="true" className="pointer-events-none absolute left-0 right-0 top-0 opacity-0">
        {items.map((c, i) => (
          <div key={i} className="w-full">
            {c}
          </div>
        ))}
      </div>
      {height > 0 && (
        <div className="absolute inset-0">
          <CardDeck items={items} frontIndex={frontIndex} onFrontChange={onFrontChange} dir={-1} className="h-full" />
        </div>
      )}
    </div>
  )
}

/** Advances a deck one card at a time, spacing each step to the card length. */
function useSequenceDriving({
  items,
  phase,
  onStep,
}: {
  items: ResponseSection[]
  phase: 'gen' | 'read' | null
  onStep: (index: number) => void
}) {
  const onStepRef = useRef(onStep)
  useEffect(() => {
    onStepRef.current = onStep
  }, [onStep])

  useEffect(() => {
    if (!phase || items.length < 2) return
    const perCard = (s: ResponseSection) => {
      const words = s.content.reduce(
        (acc, c) => acc + c.split(/\s+/).filter(Boolean).length,
        0,
      )
      return phase === 'gen' ? 700 + words * 60 : 420 + words * 150
    }
    const timers: ReturnType<typeof setTimeout>[] = []
    let acc = perCard(items[0])
    for (let i = 1; i < items.length; i++) {
      timers.push(setTimeout(() => onStepRef.current(i), acc))
      acc += perCard(items[i])
    }
    return () => timers.forEach(clearTimeout)
  }, [items, phase])
}

/** A flat reply card that hugs its content — no forced height, no empty space. */
function ReplyCard({
  section,
  index,
  active,
  revealed,
}: {
  section: ResponseSection
  index: number
  active: boolean
  revealed: boolean
}) {
  return (
    <div className="hud-3d hud-3d--flat w-full">
      <div className="hud-3d__surface relative flex w-full flex-col overflow-hidden px-3 py-2">
        <span className="hud-scanline" aria-hidden="true" />
        <span className="hud-3d__corner hud-3d__corner--tl" aria-hidden="true" />
        <span className="hud-3d__corner hud-3d__corner--tr" aria-hidden="true" />
        <span className="hud-3d__corner hud-3d__corner--bl" aria-hidden="true" />
        <span className="hud-3d__corner hud-3d__corner--br" aria-hidden="true" />

        <div className="flex min-w-0 items-center gap-1.5">
          <span className="h-[0.9em] w-[0.9em] shrink-0 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
          <h3 className="min-w-0 truncate font-display fs-title font-bold uppercase leading-snug tracking-[0.1em] text-cyan-100 text-glow">
            {section.heading}
          </h3>
          {active && <span className="ml-auto shrink-0 animate-pulse text-cyan-300/80">●</span>}
        </div>

        <div className="mt-1.5 space-y-1 font-mono fs-micro leading-snug tracking-[0.08em]">
          {section.content.map((line, i) => (
            <div key={i} className="flex gap-1.5">
              {section.kind === 'bullets' && (
                <span className="mt-px shrink-0 text-cyan-300/80">◆</span>
              )}
              <span className="min-w-0">
                {active && !revealed ? (
                  <RevealLine text={line} delay={250 + i * 700} />
                ) : (
                  <span className={active ? 'text-cyan-100/90' : 'text-cyan-100/45'}>{line}</span>
                )}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-1.5 flex items-center justify-between font-mono fs-micro tracking-[0.18em] text-cyan-300/45">
          <span>{KIND_LABEL[section.kind]}</span>
          <span>{String(index + 1).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  )
}