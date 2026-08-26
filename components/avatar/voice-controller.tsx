import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useSpeech } from '@/hooks/use-speech'

export type SpeakOptions = {
  onStart?: () => void
  onBoundary?: () => void
  onEnd?: () => void
}

export type VoiceControllerApi = {
  isListening: boolean
  isSpeaking: boolean
  interimTranscript: string
  recognitionSupported: boolean
  ttsSupported: boolean
  speakWithVoice: (text: string, opts?: SpeakOptions) => void
  cancelSpeech: () => void
  startListening: () => void
  stopListening: () => void
}

export function useVoiceController(
  onFinalTranscript?: (text: string) => void,
): VoiceControllerApi {
  const onFinalRef = useRef(onFinalTranscript)
  useEffect(() => {
    onFinalRef.current = onFinalTranscript
  }, [onFinalTranscript])

  const handleFinal = useCallback((text: string) => {
    onFinalRef.current?.(text)
  }, [])

  const speech = useSpeech({ onFinalTranscript: handleFinal, analyserEnabled: false })

  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)

  useEffect(() => {
    if (!speech.ttsSupported) return
    const pick = () => {
      const voices = window.speechSynthesis.getVoices()
      if (!voices.length) return
      const byName =
        voices.find((v) => /(david|daniel|george|fred|alex|guy|thomas)/i.test(v.name)) ||
        voices.find((v) => v.lang.startsWith('en'))
      voiceRef.current = byName ?? voices[0]
    }
    pick()
    window.speechSynthesis.onvoiceschanged = pick
    return () => {
      window.speechSynthesis.onvoiceschanged = null
    }
  }, [speech.ttsSupported])

  const speakWithVoice = useCallback(
    (text: string, opts?: SpeakOptions) => {
      speech.speak(text, {
        voice: voiceRef.current ?? undefined,
        onStart: opts?.onStart,
        onBoundary: opts?.onBoundary,
        onEnd: opts?.onEnd,
      })
    },
    [speech.speak],
  )

  return useMemo<VoiceControllerApi>(
    () => ({
      isListening: speech.isListening,
      isSpeaking: speech.isSpeaking,
      interimTranscript: speech.interimTranscript,
      recognitionSupported: speech.recognitionSupported,
      ttsSupported: speech.ttsSupported,
      speakWithVoice,
      cancelSpeech: speech.stopSpeaking,
      startListening: speech.startListening,
      stopListening: speech.stopListening,
    }),
    [
      speech.isListening,
      speech.isSpeaking,
      speech.interimTranscript,
      speech.recognitionSupported,
      speech.ttsSupported,
      speech.stopSpeaking,
      speech.startListening,
      speech.stopListening,
      speakWithVoice,
    ],
  )
}
