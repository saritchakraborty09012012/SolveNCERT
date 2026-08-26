'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAvatarSystem } from './avatar-state-controller'
import { CardDeck } from './card-deck'
import { VoiceHUD } from './voice-hud'
import { MemoryHUD } from './memory-hud'
import { LearningHUD } from './learning-hud'
import { AutomationHUD } from './automation-hud'
import { TaskHUD } from './task-hud'
import { SyncHUD } from './sync-hud'
import { SystemStatusHUD } from './system-status-hud'
import { SecurityHUD } from './security-hud'

/**
 * HUDShell arranges the eight HUD rectangles flanking the avatar.
 *
 * Laptop / large screens (unchanged): two static 3-D columns — four panels on
 * the left, four on the right, each with its angled `hud-3d--left`/`--right`
 * perspective look.
 *
 * Phone / small screens: the same eight panels are shown as two card decks
 * (left deck = Voice/Memory/Learning/Automation, right deck = Task/Sync/
 * System/Security). The front card side-swipes to the back every couple of
 * seconds (or by hand) while the next card lifts forward, staying on its own
 * side. During the AI response scene the phone decks hide entirely — the reply
 * card decks (MobileResponseDeck) take over those exact spots — while the
 * laptop columns recede (zoom/fade outward) behind the flanking reply panels.
 */
export function HUDShell() {
  const { scene } = useAvatarSystem()
  const dimmed = scene === 'response'
  const [leftFront, setLeftFront] = useState(0)
  const [rightFront, setRightFront] = useState(0)
  const anim = {
    opacity: dimmed ? 0.15 : 1,
    scale: dimmed ? 0.9 : 1,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  }

  return (
    <>
      {/* Laptop / large screens — original static 3-D side columns (unchanged) */}
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        <motion.div
          className="pointer-events-auto absolute left-[clamp(8px,2.2vw,44px)] top-[13%] flex w-[clamp(126px,21vw,272px)] flex-col gap-3"
          animate={{ ...anim, x: dimmed ? -26 : 0 }}
        >
          <VoiceHUD />
          <MemoryHUD />
          <LearningHUD />
          <AutomationHUD />
        </motion.div>

        <motion.div
          className="pointer-events-auto absolute right-[clamp(8px,2.2vw,44px)] top-[13%] flex w-[clamp(126px,21vw,272px)] flex-col gap-3"
          animate={{ ...anim, x: dimmed ? 26 : 0 }}
        >
          <TaskHUD />
          <SyncHUD />
          <SystemStatusHUD />
          <SecurityHUD />
        </motion.div>
      </div>

      {/* Phone / small screens — card decks on each side, just above the voice console.
          Hidden during the response scene so the reply card decks take their place. */}
      {scene !== 'response' && (
        <div className="pointer-events-none absolute inset-0 md:hidden">
        <motion.div
          className="pointer-events-auto absolute left-[clamp(8px,2.2vw,44px)] bottom-[clamp(148px,23dvh,184px)] h-[clamp(100px,13.5vh,132px)] w-[clamp(150px,24vw,272px)]"
          animate={{ ...anim, x: dimmed ? -26 : 0 }}
        >
          <CardDeck
            items={[<VoiceHUD key="voice" flat />, <MemoryHUD key="memory" flat />, <LearningHUD key="learning" flat />, <AutomationHUD key="automation" flat />]}
            frontIndex={leftFront}
            onFrontChange={setLeftFront}
            dir={-1}
            autoAdvanceMs={2000}
            className="h-full"
          />
        </motion.div>

        <motion.div
          className="pointer-events-auto absolute right-[clamp(8px,2.2vw,44px)] bottom-[clamp(148px,23dvh,184px)] h-[clamp(100px,13.5vh,132px)] w-[clamp(150px,24vw,272px)]"
          animate={{ ...anim, x: dimmed ? 26 : 0 }}
        >
          <CardDeck
            items={[<TaskHUD key="task" flat />, <SyncHUD key="sync" flat />, <SystemStatusHUD key="status" flat />, <SecurityHUD key="security" flat />]}
            frontIndex={rightFront}
            onFrontChange={setRightFront}
            dir={1}
            autoAdvanceMs={2000}
            className="h-full"
          />
        </motion.div>
      </div>
      )}
    </>
  )
}