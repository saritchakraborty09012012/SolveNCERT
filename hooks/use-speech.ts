import { useCallback, useEffect, useMemo, useRef, useState } from "react"

type UseSpeechOptions = {
  onFinalTranscript?: (text: string) => void
  analyserEnabled?: boolean
}

type SpeakOptions = {
  voice?: SpeechSynthesisVoice
  onStart?: () => void
  onBoundary?: () => void
  onEnd?: () => void
}

export function useSpeech({ onFinalTranscript, analyserEnabled = true }: UseSpeechOptions = {}) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [micLevel, setMicLevel] = useState(0)
  const [mouthOpen, setMouthOpen] = useState(0)
  const [interimTranscript, setInterimTranscript] = useState("")
  const [recognitionSupported, setRecognitionSupported] = useState(false)

  const recognitionRef = useRef<any>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const SpeechRecognition =
      typeof window !== "undefined" && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
    setRecognitionSupported(Boolean(SpeechRecognition))
  }, [])

  const stopMicMeter = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    analyserRef.current = null
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {})
      audioCtxRef.current = null
    }
    setMicLevel(0)
  }, [])

  const startListening = useCallback(async () => {
    if (isListening) return
    setInterimTranscript("")

    if (analyserEnabled) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        streamRef.current = stream
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
        audioCtxRef.current = audioCtx
        const source = audioCtx.createMediaStreamSource(stream)
        const analyser = audioCtx.createAnalyser()
        analyser.fftSize = 256
        source.connect(analyser)
        analyserRef.current = analyser

        const data = new Uint8Array(analyser.frequencyBinCount)
        const tick = () => {
          analyser.getByteFrequencyData(data)
          const avg = data.reduce((a, b) => a + b, 0) / data.length
          setMicLevel(Math.min(1, avg / 90))
          rafRef.current = requestAnimationFrame(tick)
        }
        tick()
      } catch {
        // mic permission denied
      }
    }

    const SpeechRecognition =
      typeof window !== "undefined" && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = "en-US"

      recognition.onresult = (event: any) => {
        let interim = ""
        let final = ""
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            final += transcript
          } else {
            interim += transcript
          }
        }
        if (interim) setInterimTranscript(interim)
        if (final) {
          setInterimTranscript("")
          onFinalTranscript?.(final.trim())
        }
      }

      recognition.onerror = () => {
        setIsListening(false)
        stopMicMeter()
      }

      recognition.onend = () => {
        setIsListening(false)
        stopMicMeter()
      }

      recognitionRef.current = recognition
      recognition.start()
    }

    setIsListening(true)
  }, [isListening, onFinalTranscript, stopMicMeter])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    recognitionRef.current = null
    setIsListening(false)
    stopMicMeter()
  }, [stopMicMeter])

  const speak = useCallback((text: string, options: SpeakOptions = {}) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      options.onEnd?.()
      return
    }
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.98
    utterance.pitch = 0.92
    if (options.voice) utterance.voice = options.voice

    utterance.onstart = () => {
      setIsSpeaking(true)
      options.onStart?.()
    }
    utterance.onend = () => {
      setIsSpeaking(false)
      setMouthOpen(0)
      options.onEnd?.()
    }
    utterance.onerror = () => {
      setIsSpeaking(false)
      setMouthOpen(0)
      options.onEnd?.()
    }
    utterance.onboundary = () => {
      setMouthOpen(0.4 + Math.random() * 0.6)
      setTimeout(() => setMouthOpen(0.1), 90)
      options.onBoundary?.()
    }

    window.speechSynthesis.speak(utterance)
  }, [])

  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    setIsSpeaking(false)
    setMouthOpen(0)
  }, [])

  useEffect(() => {
    return () => {
      stopMicMeter()
      recognitionRef.current?.stop()
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [stopMicMeter])

  return useMemo(
    () => ({
      isListening,
      isSpeaking,
      micLevel,
      mouthOpen,
      interimTranscript,
      recognitionSupported,
      speechSupported:
        typeof window !== 'undefined' &&
        typeof window.SpeechSynthesisUtterance !== 'undefined' &&
        'speechSynthesis' in window,
      ttsSupported: typeof window !== 'undefined' && 'speechSynthesis' in window,
      startListening,
      stopListening,
      speak,
      stopSpeaking,
    }),
    [
      isListening,
      isSpeaking,
      micLevel,
      mouthOpen,
      interimTranscript,
      recognitionSupported,
      startListening,
      stopListening,
      speak,
      stopSpeaking,
    ],
  )
}
