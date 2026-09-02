'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from 'react'
import type { Expression, SpeechState } from '@/lib/avatar-types'
import { stripEmoji } from '@/lib/avatar-types'
import { askGemini, fetchModelConfig } from '@/lib/avatar/gemini-client'
import { memoryTopicsFromUser } from '@/lib/avatar/structure'
import { canSendAiMessage, recordGuestUsage } from '@/lib/ai-learn/rate-limiter'
import type {
  AvatarAttachment,
  AvatarStatus,
  ConversationMessage,
  GazePoint,
  GazeTarget,
  StructuredResponse,
  SystemCapabilities,
} from '@/lib/avatar/types'
import { useEmotionController } from './emotion-controller'
import { useVoiceController, type VoiceControllerApi } from './voice-controller'

export type AvatarScene = 'hud' | 'response'

export type MemoryTag = { tag: string; ts: number }

export type AvatarSystem = {
  status: AvatarStatus
  scene: AvatarScene
  response: StructuredResponse | null
  error: string | null
  expression: Expression
  capabilities: SystemCapabilities
  memoryTags: MemoryTag[]
  currentTopic: string | null
  conceptsProcessed: number
  messageCount: number
  activity: string
  mode: string
  speechRef: MutableRefObject<SpeechState>
  expressionRef: MutableRefObject<Expression>
  gazeRef: MutableRefObject<GazePoint>
  voice: VoiceControllerApi
  sendMessage: (text: string, attachments?: AvatarAttachment[]) => void
  attachments: AvatarAttachment[]
  addAttachments: (attachments: AvatarAttachment[]) => void
  removeAttachment: (index: number) => void
  clearAttachments: () => void
  handleTyping: (text: string) => void
  toggleListening: () => void
  stopSpeech: () => void
  focusPanel: (index: number | null) => void
  revealComplete: () => void
  clearError: () => void
  setMode: (mode: string) => void
}

const AvatarSystemContext = createContext<AvatarSystem | null>(null)

export function useAvatarSystem(): AvatarSystem {
  const ctx = useContext(AvatarSystemContext)
  if (!ctx) throw new Error('useAvatarSystem must be used inside <AvatarStateController>')
  return ctx
}

const GAZE: Record<GazeTarget, GazePoint> = {
  forward: { x: 0, y: 0 },
  input: { x: 0, y: 0.62 },
  status: { x: 0.25, y: -0.32 },
  generation: { x: 0, y: -0.3 },
  left: { x: -0.55, y: -0.1 },
  right: { x: 0.55, y: -0.1 },
}

export function AvatarStateController({ children }: { children: ReactNode }) {
  // ---- imperative handles the face reads every frame ---------------------
  const speechRef = useRef<SpeechState>({ speaking: false, amp: 0 })
  const expressionRef = useRef<Expression>('neutral')
  const gazeRef = useRef<GazePoint>({ ...GAZE.forward })
  const attachmentsRef = useRef<AvatarAttachment[]>([])

  // ---- reactive state ----------------------------------------------------
  const [status, setStatusState] = useState<AvatarStatus>('idle')
  const [scene, setScene] = useState<AvatarScene>('hud')
  const [response, setResponse] = useState<StructuredResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [expression, setExpression] = useState<Expression>('neutral')
  const [typingActive, setTypingActive] = useState(false)
  const [lastUserText, setLastUserText] = useState('')
  const [emotionOverride, setEmotionOverride] = useState<Expression | null>(null)
  const [memoryTags, setMemoryTags] = useState<MemoryTag[]>([])
  const [currentTopic, setCurrentTopic] = useState<string | null>(null)
  const [conceptsProcessed, setConceptsProcessed] = useState(0)
  const [messageCount, setMessageCount] = useState(0)
  const [mode, setModeState] = useState('default')
  const [attachments, setAttachmentsState] = useState<AvatarAttachment[]>([])
  const [capabilities, setCapabilities] = useState<SystemCapabilities>({
    apiKeyConfigured: true,
    speechSupported: false,
    recognitionSupported: false,
  })

  // ---- refs mirroring fast-changing state for stable callbacks -----------
  const statusRef = useRef<AvatarStatus>('idle')
  const responseRef = useRef<StructuredResponse | null>(null)
  const sceneRef = useRef<AvatarScene>('hud')
  const conversationRef = useRef<ConversationMessage[]>([])
  const typingResetRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const revealDoneRef = useRef(false)
  const voiceRef = useRef<VoiceControllerApi | null>(null)
  const modeRef = useRef<string>('default')

  const setStatus = useCallback((next: AvatarStatus) => {
    statusRef.current = next
    setStatusState(next)
  }, [])

  const setGaze = useCallback((target: GazeTarget) => {
    gazeRef.current = { ...GAZE[target] }
  }, [])

  // ---- emotion selector --------------------------------------------------
  const signal = useMemo(
    () => ({
      status,
      userText: typingActive ? '' : lastUserText,
      aiText: response?.summary,
      aiEmotion: response?.emotion ?? null,
      override: emotionOverride,
      typing: typingActive,
    }),
    [status, typingActive, lastUserText, response, emotionOverride],
  )
  const resolvedExpression = useEmotionController(signal)

  useEffect(() => {
    expressionRef.current = resolvedExpression
    setExpression(resolvedExpression)
  }, [resolvedExpression])

  // ---- speech amplitude driver: keeps lips alive between TTS boundaries --
  useEffect(() => {
    let raf = 0
    let t = 0
    const loop = () => {
      t++
      const s = speechRef.current
      s.amp *= 0.9
      if (s.speaking) {
        const osc =
          (Math.sin(t * 0.18) * 0.5 + 0.5) * 0.45 + (Math.sin(t * 0.41) * 0.5 + 0.5) * 0.3
        if (s.amp < osc) s.amp = osc
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  // ---- capability probe --------------------------------------------------
  useEffect(() => {
    let active = true
    fetchModelConfig().then((cfg) => {
      if (!active) return
      setCapabilities((c) => ({ ...c, apiKeyConfigured: cfg.configured }))
    })
    return () => {
      active = false
    }
  }, [])

  // ---- voice -------------------------------------------------------------
  const submitRef = useRef<(text: string) => void>(() => {})
  const voice = useVoiceController((final: string) => {
    if (final && final.trim()) submitRef.current(final.trim())
  })

  useEffect(() => {
    voiceRef.current = voice
    setCapabilities((c) => {
      if (c.speechSupported === voice.ttsSupported && c.recognitionSupported === voice.recognitionSupported) {
        return c
      }
      return {
        ...c,
        speechSupported: voice.ttsSupported,
        recognitionSupported: voice.recognitionSupported,
      }
    })
  }, [voice])

  // ---- actions -----------------------------------------------------------
  const stopSpeakingFlow = useCallback(() => {
    if (speechRef.current.speaking) {
      speechRef.current.speaking = false
      speechRef.current.amp = 0
    }
    voiceRef.current?.cancelSpeech()
    setStatus('idle')
    setEmotionOverride(null)
    setGaze('forward')
  }, [setStatus, setGaze])

  const sendMessage = useCallback(
    async (raw: string, attachments?: AvatarAttachment[]) => {
      const text = raw.trim()
      const combinedAttachments = [...(attachments ?? []), ...attachmentsRef.current]
      if (!text && combinedAttachments.length === 0) return

      attachmentsRef.current = []
      setAttachmentsState([])

      const current = statusRef.current
      if (current === 'thinking' || current === 'generating') return
      if (current === 'speaking') stopSpeakingFlow()
      if (current === 'listening') voiceRef.current?.stopListening()

      const { allowed, reason } = canSendAiMessage()
      if (!allowed) {
        setError(reason ?? 'Usage limit reached.')
        setEmotionOverride('concerned')
        return
      }

      const usageResult = recordGuestUsage()
      if (!usageResult.allowed) {
        setError(usageResult.reason ?? 'Usage limit reached.')
        setEmotionOverride('concerned')
        return
      }

      if (typingResetRef.current) clearTimeout(typingResetRef.current)
      setTypingActive(false)

      setError(null)
      setEmotionOverride(null)
      setLastUserText(text)
      setResponse(null)
      responseRef.current = null
      revealDoneRef.current = false
      setScene('hud')
      sceneRef.current = 'hud'

      const newTags = memoryTopicsFromUser(text)
      setMemoryTags((prev) => {
        const next = [...prev]
        for (const tag of newTags) {
          const existing = next.find((t) => t.tag === tag)
          if (existing) existing.ts = Date.now()
          else next.push({ tag, ts: Date.now() })
        }
        return next.slice(-10)
      })

      conversationRef.current.push({ role: 'user', text })
      setMessageCount((c) => c + 1)
      setStatus('thinking')
      setGaze('generation')

      try {
        const attachmentsPayload = combinedAttachments.length > 0 ? combinedAttachments : undefined
        const result = await askGemini(
          conversationRef.current,
          modeRef.current !== 'default' ? modeRef.current : undefined,
          attachmentsPayload,
        )
        conversationRef.current.push({ role: 'model', text: result.summary })
        setMessageCount((c) => c + 1)

        setResponse(result)
        responseRef.current = result
        setCurrentTopic(result.title)
        setConceptsProcessed((c) => c + result.sections.length)
        setMemoryTags((prev) => {
          const titleTag = result.title.toLowerCase()
          if (prev.some((t) => t.tag === titleTag)) return prev
          return [...prev, { tag: titleTag, ts: Date.now() }].slice(-10)
        })
        setEmotionOverride(null)
        setStatus('generating')
        setGaze('status')
        setScene('response')
        sceneRef.current = 'response'
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Something went wrong.'
        setError(message)
        setEmotionOverride('concerned')
        setStatus('idle')
        setGaze('forward')
      }
    },
    [setStatus, setGaze, stopSpeakingFlow],
  )

  useEffect(() => {
    submitRef.current = sendMessage
  }, [sendMessage])

  const handleTyping = useCallback(
    (text: string) => {
      if (speechRef.current.speaking) {
        setGaze('input')
        return
      }
      if (typingResetRef.current) clearTimeout(typingResetRef.current)
      if (!text.trim()) {
        setTypingActive(false)
        setGaze('forward')
        return
      }
      setTypingActive(true)
      setGaze('input')
      typingResetRef.current = setTimeout(() => {
        setTypingActive(false)
        setGaze('forward')
      }, 2400)
    },
    [setGaze],
  )

  const toggleListening = useCallback(() => {
    if (statusRef.current === 'thinking' || statusRef.current === 'generating') return
    if (voiceRef.current?.isListening) {
      voiceRef.current.stopListening()
      setTypingActive(false)
      setStatus('idle')
      setGaze('forward')
    } else {
      if (statusRef.current === 'speaking') stopSpeakingFlow()
      voiceRef.current?.startListening()
      setStatus('listening')
      setGaze('input')
    }
  }, [setStatus, setGaze, stopSpeakingFlow])

  const stopSpeech = useCallback(() => {
    stopSpeakingFlow()
    if (sceneRef.current === 'response') setGaze('status')
  }, [stopSpeakingFlow, setGaze])

  const focusPanel = useCallback(
    (index: number | null) => {
      if (index === null || index < 0) {
        setGaze('forward')
        return
      }
      setGaze(index % 2 === 0 ? 'left' : 'right')
    },
    [setGaze],
  )

  const revealComplete = useCallback(() => {
    const res = responseRef.current
    if (!res || revealDoneRef.current) return
    revealDoneRef.current = true

    const summary = stripEmoji(res.summary)
    if (!summary || !voiceRef.current?.ttsSupported) {
      setStatus('idle')
      setGaze('forward')
      return
    }

    const side: GazeTarget = res.sections.length > 0 ? 'left' : 'forward'
    setGaze(side)
    setStatus('speaking')
    voiceRef.current.speakWithVoice(summary, {
      onStart: () => {
        speechRef.current.speaking = true
      },
      onBoundary: () => {
        speechRef.current.amp = 1
      },
      onEnd: () => {
        speechRef.current.speaking = false
        speechRef.current.amp = 0
        setStatus('idle')
        setEmotionOverride(null)
        setGaze('forward')
      },
    })
  }, [setStatus, setGaze])

  const clearError = useCallback(() => setError(null), [])
  const setMode = useCallback((newMode: string) => {
    modeRef.current = newMode
    setModeState(newMode)
  }, [])

  const addAttachments = useCallback((newAttachments: AvatarAttachment[]) => {
    if (!newAttachments || newAttachments.length === 0) return
    attachmentsRef.current = [...attachmentsRef.current, ...newAttachments]
    setAttachmentsState((prev) => [...prev, ...newAttachments])
  }, [])

  const removeAttachment = useCallback((index: number) => {
    const next = attachmentsRef.current.filter((_, i) => i !== index)
    attachmentsRef.current = next
    setAttachmentsState(next)
  }, [])

  const clearAttachments = useCallback(() => {
    attachmentsRef.current = []
    setAttachmentsState([])
  }, [])

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const activity = useMemo(() => {
    switch (status) {
      case 'speaking':
        return 'NARRATING RESPONSE'
      case 'generating':
        return 'STRUCTURING NOTES'
      case 'thinking':
        return 'REASONING'
      case 'listening':
        return 'CAPTURING VOICE'
      default:
        return scene === 'response' ? 'REVIEWING NOTES' : 'STANDBY'
    }
  }, [status, scene])

  const value = useMemo<AvatarSystem>(
    () => ({
      status,
      scene,
      response,
      error,
      expression,
      capabilities,
      memoryTags,
      currentTopic,
      conceptsProcessed,
      messageCount,
      activity,
      mode,
      speechRef,
      expressionRef,
      gazeRef,
      voice,
      sendMessage,
      attachments,
      addAttachments,
      removeAttachment,
      clearAttachments,
      handleTyping,
      toggleListening,
      stopSpeech,
      focusPanel,
      revealComplete,
      clearError,
      setMode,
    }),
    [
      status,
      scene,
      response,
      error,
      expression,
      capabilities,
      memoryTags,
      currentTopic,
      conceptsProcessed,
      messageCount,
      activity,
      mode,
      speechRef,
      expressionRef,
      gazeRef,
      voice,
      sendMessage,
      attachments,
      addAttachments,
      removeAttachment,
      clearAttachments,
      handleTyping,
      toggleListening,
      stopSpeech,
      focusPanel,
      revealComplete,
      clearError,
      setMode,
    ],
  )

  return <AvatarSystemContext.Provider value={value}>{children}</AvatarSystemContext.Provider>
}