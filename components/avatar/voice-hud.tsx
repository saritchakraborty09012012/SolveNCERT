import { Mic, MicOff, Square } from 'lucide-react'
import { HUDPanel } from './hud-panel'
import { useAvatarSystem } from './avatar-state-controller'

function MicBars({ speaking }: { speaking: boolean }) {
  return (
    <div className={`voice-bars ${speaking ? 'voice-bars--speak' : 'voice-bars--live'}`}>
      {Array.from({ length: 12 }).map((_, i) => (
        <span key={i} />
      ))}
    </div>
  )
}

export function VoiceHUD({ flat = false }: { flat?: boolean }) {
  const { voice, toggleListening, stopSpeech } = useAvatarSystem()

  const label = voice.isListening ? 'LISTENING' : voice.isSpeaking ? 'SPEAKING' : 'IDLE'
  const labelColor = voice.isListening
    ? 'text-red-300'
    : voice.isSpeaking
      ? 'text-cyan-200'
      : 'text-cyan-400/60'

  return (
    <HUDPanel
      flat={flat}
      title="Voice Control"
      icon={voice.isListening ? <Mic className="h-[1.25em] w-[1.25em] animate-pulse" /> : <Mic className="h-[1.25em] w-[1.25em]" />}
      side="left"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <MicBars speaking={voice.isSpeaking} />
          <span className={`font-mono fs-label tracking-[0.25em] ${labelColor}`}>{label}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleListening}
            disabled={!voice.recognitionSupported}
            aria-label={voice.isListening ? 'Stop listening' : 'Start voice input'}
            className={`flex h-[1.6em] w-[1.6em] shrink-0 items-center justify-center rounded border transition-colors ${
              voice.isListening
                ? 'border-red-400/60 bg-red-500/20 text-red-200'
                : 'border-cyan-400/40 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/25'
            } disabled:cursor-not-allowed disabled:opacity-40`}
          >
            {voice.isListening ? <MicOff className="h-[0.9em] w-[0.9em]" /> : <Mic className="h-[0.9em] w-[0.9em]" />}
          </button>
          {voice.isSpeaking && (
            <button
              type="button"
              onClick={stopSpeech}
              aria-label="Stop speaking"
              className="flex h-[1.6em] w-[1.6em] shrink-0 items-center justify-center rounded border border-red-400/40 bg-red-500/15 text-red-200 hover:bg-red-500/25"
            >
              <Square className="h-[0.8em] w-[0.8em]" />
            </button>
          )}
        </div>
      </div>
      {!voice.recognitionSupported && (
        <p className="mt-1 font-mono fs-micro tracking-[0.2em] text-cyan-300/40">
          VOICE INPUT UNAVAILABLE
        </p>
      )}
    </HUDPanel>
  )
}
