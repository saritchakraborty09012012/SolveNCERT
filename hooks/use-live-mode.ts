'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type LiveModeOptions = {
  onUserMessage: (text: string) => void
  onStatusChange: (status: 'idle' | 'listening' | 'thinking' | 'speaking') => void
  language?: string
}

export type LiveModeApi = {
  isActive: boolean
  status: 'idle' | 'listening' | 'thinking' | 'speaking'
  interimText: string
  start: () => void
  stop: () => void
  interrupt: () => void
}

export function useLiveMode({ onUserMessage, onStatusChange, language = 'en-IN' }: LiveModeOptions): LiveModeApi {
  const [isActive, setIsActive] = useState(false)
  const [status, setStatus] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle')
  const [interimText, setInterimText] = useState('')

  const recognitionRef = useRef<any>(null)
  const onUserMessageRef = useRef(onUserMessage)
  const onStatusChangeRef = useRef(onStatusChange)
  const statusRef = useRef<'idle' | 'listening' | 'thinking' | 'speaking'>('idle')
  const autoRestartRef = useRef(false)

  useEffect(() => { onUserMessageRef.current = onUserMessage }, [onUserMessage])
  useEffect(() => { onStatusChangeRef.current = onStatusChange }, [onStatusChange])

  const setStatus_ = useCallback((val: 'idle' | 'listening' | 'thinking' | 'speaking') => {
    setStatus(val)
    statusRef.current = val
    onStatusChangeRef.current(val)
  }, [])

  const speak = useCallback((text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) { resolve(); return }
      window.speechSynthesis.cancel()

      const clean = text.replace(/[*_#`~\[\]{}|\\]/g, '').replace(/\s+/g, ' ').trim()
      if (!clean) { resolve(); return }
      const utterance = new SpeechSynthesisUtterance(clean)
      utterance.rate = 1.0
      utterance.pitch = 1.0
      utterance.lang = language

      const voices = window.speechSynthesis.getVoices()
      const preferred =
        voices.find((v) => /google.*female|google.*hin|zira|susan|karen|moira|tessa/i.test(v.name)) ||
        voices.find((v) => v.lang.startsWith(language.split('-')[0])) ||
        voices.find((v) => v.lang.startsWith('en'))
      if (preferred) utterance.voice = preferred

      utterance.onstart = () => setStatus_('speaking')
      utterance.onend = () => { setStatus_('idle'); resolve() }
      utterance.onerror = () => { setStatus_('idle'); resolve() }

      window.speechSynthesis.speak(utterance)
    })
  }, [language, setStatus_])

  const startRecognition = useCallback(() => {
    if (!autoRestartRef.current) return

    const SpeechRecognition =
      typeof window !== 'undefined' &&
      ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = language
    recognition.maxAlternatives = 1

    recognition.onresult = (event: any) => {
      let interim = ''
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          final += transcript
        } else {
          interim += transcript
        }
      }
      if (interim) setInterimText(interim)
      if (final.trim()) {
        setInterimText('')
        if (statusRef.current === 'speaking') {
          window.speechSynthesis?.cancel()
        }
        setStatus_('thinking')
        onUserMessageRef.current(final.trim())
      }
    }

    recognition.onerror = (e: any) => {
      if (e.error === 'aborted' || e.error === 'no-speech') {
        if (autoRestartRef.current) {
          setTimeout(() => startRecognition(), 300)
        }
        return
      }
      if (autoRestartRef.current) {
        setTimeout(() => startRecognition(), 500)
      }
    }

    recognition.onend = () => {
      if (autoRestartRef.current && statusRef.current !== 'thinking') {
        setTimeout(() => startRecognition(), 200)
      }
    }

    recognitionRef.current = recognition
    try {
      recognition.start()
      setStatus_('listening')
    } catch {}
  }, [language, setStatus_])

  const stopRecognition = useCallback(() => {
    recognitionRef.current?.stop()
    recognitionRef.current = null
  }, [])

  const start = useCallback(() => {
    autoRestartRef.current = true
    setIsActive(true)
    setInterimText('')
    startRecognition()
  }, [startRecognition])

  const stop = useCallback(() => {
    autoRestartRef.current = false
    setIsActive(false)
    stopRecognition()
    window.speechSynthesis?.cancel()
    setStatus_('idle')
    setInterimText('')
  }, [stopRecognition, setStatus_])

  const interrupt = useCallback(() => {
    if (statusRef.current === 'speaking') {
      window.speechSynthesis?.cancel()
      setStatus_('listening')
      if (autoRestartRef.current) {
        setTimeout(() => startRecognition(), 100)
      }
    }
  }, [startRecognition, setStatus_])

  useEffect(() => {
    return () => {
      autoRestartRef.current = false
      stopRecognition()
      window.speechSynthesis?.cancel()
    }
  }, [stopRecognition])

  return { isActive, status, interimText, start, stop, interrupt }
}
