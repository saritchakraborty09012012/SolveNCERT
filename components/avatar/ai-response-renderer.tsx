'use client'

import { useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAvatarSystem } from './avatar-state-controller'
import { ResponsePanel } from './response-panel'

/**
 * AIResponseRenderer — turns the structured Gemini output into flanking
 * holographic panels on the two sides of the avatar on large screens (even
 * sections go left, odd sections go right, exactly like a desk of study
 * notes). Panels enter one by one while the face subtly tracks whichever panel
 * is currently producing, and their text scales with the viewport. On phones
 * this flanks layout is hidden — MobileResponseDeck takes over instead.
 */
export function AIResponseRenderer() {
  const { response, focusPanel, revealComplete } = useAvatarSystem()
  const sections = response?.sections ?? []

  const focusFlank = useCallback(
    (index: number | null) => {
      if (typeof window === 'undefined') return
      if (window.matchMedia('(min-width: 768px)').matches) focusPanel(index)
    },
    [focusPanel],
  )

  useEffect(() => {
    if (!response || sections.length === 0) return
    const words = sections.reduce(
      (acc, s) => acc + s.content.reduce((b, c) => b + c.split(/\s+/).filter(Boolean).length, 0),
      0,
    )
    const lastDelay = 0.18 + (sections.length - 1) * 0.38
    const total = lastDelay * 1000 + Math.max(600, words * 48) + 260
    const t = setTimeout(() => revealComplete(), total + 160)
    return () => clearTimeout(t)
  }, [response, sections, revealComplete])

  if (!response || sections.length === 0) return null

  const left = sections.map((s, i) => ({ s, i })).filter(({ i }) => i % 2 === 0)
  const right = sections.map((s, i) => ({ s, i })).filter(({ i }) => i % 2 !== 0)

  return (
    <>
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        <motion.div
          className="pointer-events-auto absolute left-[clamp(6px,2.5vw,48px)] top-[12%] flex max-h-[76dvh] w-[clamp(130px,32vw,340px)] flex-col gap-2.5 overflow-y-auto hud-scroll-slim pb-4"
          initial={{ opacity: 0, x: -90 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {left.map(({ s, i }) => (
            <ResponsePanel key={s.id} section={s} index={i} side="left" onFocus={focusFlank} />
          ))}
        </motion.div>

        <motion.div
          className="pointer-events-auto absolute right-[clamp(6px,2.5vw,48px)] top-[12%] flex max-h-[76dvh] w-[clamp(130px,32vw,340px)] flex-col gap-2.5 overflow-y-auto hud-scroll-slim pb-4"
          initial={{ opacity: 0, x: 90 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {right.map(({ s, i }) => (
            <ResponsePanel key={s.id} section={s} index={i} side="right" onFocus={focusFlank} />
          ))}
        </motion.div>
      </div>
    </>
  )
}
