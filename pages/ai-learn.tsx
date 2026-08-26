import React, { useState, useCallback, useEffect, useRef } from 'react'
import Head from 'next/head'
import { AvatarStateController, useAvatarSystem } from '@/components/avatar/avatar-state-controller'
import { HoloFace } from '@/components/holo-face'
import { MatrixRain } from '@/components/matrix-rain'
import { Waveform } from '@/components/waveform'
import { HUDShell } from '@/components/avatar/hud-shell'
import { AIResponseRenderer } from '@/components/avatar/ai-response-renderer'
import { MobileResponseDeck } from '@/components/avatar/mobile-response-deck'
import { AIInput } from '@/components/avatar/ai-input'
import { TunnelTransition } from '@/components/ai-learn/tunnel-transition'
import { OnboardingFlow } from '@/components/ai-learn/onboarding-flow'
import { LearnSidebar } from '@/components/ai-learn/learn-sidebar'
import { QuickActions } from '@/components/ai-learn/quick-actions'
import { LiveIndicator } from '@/components/ai-learn/live-indicator'
import { useLiveMode } from '@/hooks/use-live-mode'
import { hasCompletedOnboarding, updateStreak, addXP } from '@/lib/ai-learn/profile'
import { useFeedbackStore } from '@/store/feedbackStore'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

function AvatarExperience() {
  const {
    speechRef, expressionRef, gazeRef, status, expression, mode, setMode,
    sendMessage: aiSendMessage, response,
  } = useAvatarSystem()
  const showAiRatingFor = useFeedbackStore(s => s.showAiRatingFor)
  const [liveActive, setLiveActive] = useState(false)
  const [liveStatus, setLiveStatus] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle')
  const [liveInterimText, setLiveInterimText] = useState('')
  const liveStatusRef = useRef<'idle' | 'listening' | 'thinking' | 'speaking'>('idle')
  const avatarStatusRef = useRef(status)
  const wasSpeakingRef = useRef(false)

  useEffect(() => { avatarStatusRef.current = status }, [status])

  const handleLiveUserMessage = useCallback((text: string) => {
    setLiveStatus('thinking')
    liveStatusRef.current = 'thinking'
    aiSendMessage(text)
  }, [aiSendMessage])

  const handleLiveStatusChange = useCallback((s: 'idle' | 'listening' | 'thinking' | 'speaking') => {
    setLiveStatus(s)
    liveStatusRef.current = s
  }, [])

  const liveMode = useLiveMode({
    onUserMessage: handleLiveUserMessage,
    onStatusChange: handleLiveStatusChange,
  })

  // Auto-TTS bridge: when avatar finishes generating → reveal → speaks → onEnd → restart listening
  useEffect(() => {
    if (!liveActive) return
    if (status === 'speaking') wasSpeakingRef.current = true
    if (wasSpeakingRef.current && status === 'idle') {
      wasSpeakingRef.current = false
      setTimeout(() => {
        if (liveActive && liveMode.isActive) {
          setLiveStatus('listening')
          liveStatusRef.current = 'listening'
        }
      }, 400)
    }
  }, [status, liveActive, liveMode.isActive])

  // Trigger AI tool rating when response is received
  useEffect(() => {
    if (status === 'speaking' && response) {
      showAiRatingFor('ai-learn')
    }
  }, [status, response, showAiRatingFor])

  const toggleLiveMode = useCallback(() => {
    if (liveActive) {
      liveMode.stop()
      setLiveActive(false)
      setLiveStatus('idle')
      setLiveInterimText('')
    } else {
      setLiveActive(true)
      wasSpeakingRef.current = false
      liveMode.start()
    }
  }, [liveActive, liveMode])

  const interruptLive = useCallback(() => {
    if (liveStatusRef.current === 'speaking') {
      window.speechSynthesis?.cancel()
      liveMode.interrupt()
      setLiveStatus('listening')
      liveStatusRef.current = 'listening'
    }
  }, [liveMode])

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      <LearnSidebar onModeChange={setMode} activeMode={mode} />

      <main className="relative flex-1 overflow-hidden">
        <MatrixRain />

        <Link
          href="/"
          className="pointer-events-auto absolute top-4 left-4 z-30 flex items-center gap-1.5 rounded-lg border border-cyan-800/30 bg-[#0a1628]/80 backdrop-blur-xl px-3 py-2 text-xs font-medium text-cyan-300/70 transition-all hover:border-cyan-500/40 hover:text-cyan-200 hover:bg-[#0a1628]/90"
        >
          <ArrowLeft className="size-3.5" />
          <span className="hidden sm:inline">Home</span>
        </Link>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 90% at 50% 38%, rgba(10,40,80,0.15) 0%, rgba(5,10,24,0.55) 60%, rgba(3,6,16,0.92) 100%)',
          }}
        />

        <div className="absolute inset-0 pointer-events-none" style={{ transform: 'translateX(-112px)' }}>
          <HoloFace speechRef={speechRef} expressionRef={expressionRef} gazeRef={gazeRef} />
        </div>

        <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-col items-center gap-1 pt-6">
          <h1 className="font-display text-sm font-bold tracking-[0.5em] text-cyan-200/90">
            N E X U S
          </h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-cyan-300/40">
            AI LEARN · NEURAL INTERFACE
          </p>
          <div className="mt-1.5 flex items-center gap-2.5">
            {liveActive ? (
              <>
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.9)]" />
                </span>
                <span className="font-mono text-[10px] font-medium tracking-[0.3em] text-red-300/85">
                  LIVE
                </span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-red-300/45">
                  {liveStatus.toUpperCase()}
                </span>
              </>
            ) : (
              <>
                <span className="relative flex h-1.5 w-1.5">
                  <span
                    className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${
                      status === 'speaking' || status === 'thinking' ? 'bg-cyan-300' : 'bg-cyan-400/60'
                    }`}
                  />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-200 shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
                </span>
                <span className="font-mono text-[10px] font-medium tracking-[0.3em] text-cyan-100/85">
                  {status.toUpperCase()}
                </span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-cyan-300/45">
                  {expression.toUpperCase()} MODE
                </span>
              </>
            )}
          </div>
        </header>

        <HUDShell />
        <AIResponseRendererWithKey />
        <MobileResponseDeckWithKey />
        <QuickActions />

        <AnimatePresence>
          {liveActive && (
            <LiveIndicator
              isActive={liveActive}
              status={liveStatus}
              interimText={liveInterimText}
              onToggle={toggleLiveMode}
              onInterrupt={interruptLive}
            />
          )}
        </AnimatePresence>

        <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-3 pb-5">
          <div className="w-full max-w-xl px-8">
            <Waveform speechRef={speechRef} />
          </div>
          <AIInput liveMode={{
            isActive: liveActive,
            status: liveStatus,
            onToggle: toggleLiveMode,
          }} />
        </div>
      </main>
    </div>
  )
}

function AIResponseRendererWithKey() {
  const { scene, messageCount } = useAvatarSystem()
  if (scene !== 'response') return null
  return <AIResponseRenderer key={messageCount} />
}

function MobileResponseDeckWithKey() {
  const { scene, messageCount } = useAvatarSystem()
  if (scene !== 'response') return null
  return <MobileResponseDeck key={messageCount} />
}

function RateLimitBanner({ message, remaining }: { message: string; remaining?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="fixed top-20 left-1/2 -translate-x-1/2 z-[95] max-w-md mx-4 rounded-xl border border-amber-500/30 bg-amber-950/80 backdrop-blur-xl px-4 py-3 shadow-2xl"
    >
      <div className="flex items-start gap-2">
        <AlertCircle className="size-4 text-amber-400 mt-0.5 shrink-0" />
        <p className="text-sm text-amber-100/90">{message}</p>
      </div>
      {remaining !== undefined && remaining > 0 && (
        <p className="text-xs text-amber-300/50 mt-1 ml-6">{remaining} {remaining === 1 ? 'query' : 'queries'} remaining today.</p>
      )}
    </motion.div>
  )
}

export default function AiLearnPage() {
  const [showTunnel, setShowTunnel] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(!hasCompletedOnboarding())
  const [rateLimitMsg, setRateLimitMsg] = useState<string | null>(null)
  const [rateLimitRemaining, setRateLimitRemaining] = useState<number | undefined>(undefined)

  React.useEffect(() => {
    updateStreak()
  }, [])

  const handleOnboardingComplete = useCallback(() => {
    setShowOnboarding(false)
    addXP(50)
  }, [])

  return (
    <>
      <Head>
        <title>AI Learn — Smart NCERT Tutor | SolveNCERT</title>
        <meta name="description" content="AI-powered learning assistant for CBSE students. Ask questions, get step-by-step explanations and concept breakdowns." />
        <link rel="canonical" href="https://solvencert.com/ai-learn" />
      </Head>

      <AnimatePresence>
        {showTunnel && <TunnelTransition onComplete={() => setShowTunnel(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showOnboarding && !showTunnel && (
          <OnboardingFlow onComplete={handleOnboardingComplete} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {rateLimitMsg && <RateLimitBanner message={rateLimitMsg} remaining={rateLimitRemaining} />}
      </AnimatePresence>

      <AvatarStateController>
        <AvatarExperience />
      </AvatarStateController>
    </>
  )
}
