'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2, Mic, MicOff, Send, Square, X, Radio } from 'lucide-react'
import { useAvatarSystem } from './avatar-state-controller'
import { canSendAiMessage } from '@/lib/ai-learn/rate-limiter'
import { useAuthStore } from '@/store/authStore'

type Props = {
  liveMode?: {
    isActive: boolean
    status: string
    onToggle: () => void
  }
}

export function AIInput({ liveMode }: Props) {
  const { status, voice, sendMessage, handleTyping, stopSpeech, toggleListening, error, clearError } =
    useAvatarSystem()
  const [value, setValue] = useState('')
  const taRef = useRef<HTMLTextAreaElement>(null)
  const { isGuest } = useAuthStore()

  const busy = status === 'thinking' || status === 'generating'
  const displayValue = voice.isListening ? voice.interimTranscript : value
  const { allowed } = canSendAiMessage()
  const canSend = displayValue.trim().length > 0 && !busy && allowed
  const liveActive = liveMode?.isActive ?? false

  useEffect(() => {
    const ta = taRef.current
    if (!ta) return
    ta.style.height = '0px'
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`
  }, [displayValue])

  const submit = () => {
    const text = displayValue.trim()
    if (!text || busy) return
    if (voice.isListening) voice.stopListening()
    setValue('')
    clearError()
    sendMessage(text)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      submit()
    }
  }

  const placeholder = liveActive
    ? liveMode?.status === 'listening'
      ? 'Speak now...'
      : liveMode?.status === 'thinking'
        ? 'Thinking...'
        : liveMode?.status === 'speaking'
          ? 'Tap to interrupt...'
          : 'Live mode active...'
    : busy
      ? status === 'generating' ? 'Structuring your notes...' : 'Reasoning...'
      : !allowed && isGuest
        ? 'Sign up to continue learning...'
        : voice.isListening
          ? 'Listening... speak now'
          : 'Ask NEXUS anything...'

  return (
    <div className="w-full max-w-2xl">
      {error && (
        <div className="mb-2 flex items-center gap-2 rounded-lg border border-red-400/40 bg-red-950/40 px-3 py-2 backdrop-blur-md">
          <X className="h-3 w-3 shrink-0 text-red-300" />
          <p className="min-w-0 flex-1 truncate font-mono text-[11px] tracking-wide text-red-100/90">{error}</p>
          <button type="button" onClick={clearError} aria-label="Dismiss error"
            className="shrink-0 rounded border border-red-400/40 px-2 py-0.5 font-mono text-[10px] text-red-200 hover:bg-red-500/20">
            DISMISS
          </button>
        </div>
      )}

      <div className={`flex items-end gap-2 rounded-xl border p-2 backdrop-blur-md transition-all ${
        liveActive
          ? 'border-red-400/40 bg-slate-950/85 shadow-[0_0_50px_-12px_rgba(239,68,68,0.5)]'
          : 'border-cyan-400/30 bg-slate-950/75 shadow-[0_0_40px_-12px_rgba(80,200,255,0.55)]'
      }`}>
        {/* Mic button */}
        <button
          type="button"
          onClick={toggleListening}
          disabled={!voice.recognitionSupported || busy || liveActive}
          aria-label={voice.isListening ? 'Stop listening' : 'Voice input'}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${
            voice.isListening
              ? 'border-red-400/70 bg-red-500/25 text-red-100 shadow-[0_0_14px_rgba(248,113,113,0.4)]'
              : 'border-cyan-300/40 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/20'
          }`}
        >
          {voice.isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </button>

        {/* Live button */}
        <button
          type="button"
          onClick={liveMode?.onToggle}
          disabled={busy}
          aria-label={liveActive ? 'Stop live mode' : 'Start live conversation'}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-all disabled:cursor-not-allowed disabled:opacity-35 ${
            liveActive
              ? 'border-red-400/70 bg-red-500/25 text-red-100 shadow-[0_0_14px_rgba(239,68,68,0.5)] animate-pulse'
              : 'border-orange-400/40 bg-orange-400/10 text-orange-300/80 hover:bg-orange-400/20 hover:border-orange-400/60'
          }`}
        >
          <Radio className="h-4 w-4" />
        </button>

        {/* Input */}
        <textarea
          ref={taRef}
          value={displayValue}
          readOnly={voice.isListening || busy || !allowed || liveActive}
          onChange={(e) => {
            if (voice.isListening || liveActive) return
            setValue(e.target.value)
            handleTyping(e.target.value)
          }}
          onKeyDown={onKeyDown}
          rows={1}
          placeholder={placeholder}
          className="min-h-9 max-h-[120px] min-w-0 flex-1 resize-none bg-transparent px-2 py-2 font-mono text-sm text-cyan-50 placeholder:text-cyan-200/35 focus:outline-none disabled:opacity-55"
          aria-label="Message for the AI teacher"
        />

        {/* Send / Stop / Busy */}
        {status === 'speaking' && !liveActive ? (
          <button type="button" onClick={stopSpeech}
            className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-red-400/45 bg-red-500/15 px-3 font-display text-[11px] font-medium tracking-widest text-red-100 transition-colors hover:bg-red-500/25">
            <Square className="h-3 w-3" /> STOP
          </button>
        ) : busy ? (
          <div className="flex h-9 w-20 shrink-0 items-center justify-center gap-2 rounded-lg border border-cyan-300/30 bg-cyan-400/5 font-display text-[10px] tracking-widest text-cyan-200/80">
            <Loader2 className="h-3 w-3 animate-spin" />
            {status === 'generating' ? 'GEN' : 'AI'}
          </div>
        ) : (
          <button type="button" onClick={submit} disabled={!canSend || liveActive}
            className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-cyan-300/50 bg-cyan-400/20 px-3 font-display text-[11px] font-semibold tracking-widest text-cyan-50 transition-colors hover:bg-cyan-400/35 disabled:cursor-not-allowed disabled:opacity-40">
            <Send className="h-3 w-3" /> SEND
          </button>
        )}
      </div>

      <div className="mt-1.5 flex items-center justify-between font-mono text-[9px] tracking-[0.2em] text-cyan-300/35">
        <span>{liveActive ? 'LIVE MODE ACTIVE' : 'ENTER SEND \u00B7 SHIFT+ENTER NEW LINE'}</span>
        <span>{liveActive ? 'TAP RADIO TO STOP' : voice.recognitionSupported ? 'VOICE INPUT ONLINE' : 'TEXT ONLY'}</span>
      </div>

      {!allowed && isGuest && (
        <div className="mt-2 rounded-lg border border-amber-500/25 bg-amber-950/40 px-3 py-2 text-center">
          <p className="text-xs text-amber-200/80">
            You have used all your guest trials for today. <span className="font-semibold">Sign up</span> to unlock more learning features.
          </p>
        </div>
      )}
    </div>
  )
}
