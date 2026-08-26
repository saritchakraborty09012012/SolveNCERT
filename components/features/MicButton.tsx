import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { cn } from '@/utils/helpers';

interface Props {
  onResult: (text: string) => void;
  onInterim?: (text: string) => void;
  className?: string;
  size?: 'sm' | 'md';
}

// Web Speech Recognition with best accuracy settings
export default function MicButton({ onResult, onInterim, className, size = 'sm' }: Props) {
  const [listening, setListening] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [supported, setSupported] = useState(false);
  const recogRef = useRef<SpeechRecognition | null>(null);

  // Detect support after mount — keeps server & first client render identical (no hydration mismatch)
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setSupported(!!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition));
  }, []);

  function start() {
    if (typeof window === 'undefined') return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;

    if (listening) { stop(); return; }

    const recog = new SR() as SpeechRecognition;
    recog.lang              = 'en-IN';           // Indian English
    recog.continuous        = false;
    recog.interimResults    = true;
    recog.maxAlternatives   = 5;                 // get 5 alternatives for best pick

    setLoading(true);
    recogRef.current = recog;

    recog.onstart = () => { setLoading(false); setListening(true); };

    recog.onresult = (e: SpeechRecognitionEvent) => {
      let transcript = '';
      for (let i = 0; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript;
      }
      const isFinal = e.results[e.results.length - 1].isFinal;
      if (isFinal) {
        onResult(transcript.trim());
        stop();
      } else {
        // Live (real-time) transcription while the user is still speaking
        onInterim?.(transcript.trim());
      }
    };

    recog.onerror = () => stop();
    recog.onend   = () => stop();
    recog.start();
  }

  function stop() {
    recogRef.current?.stop();
    recogRef.current = null;
    setListening(false);
    setLoading(false);
  }

  const iconSize = size === 'sm' ? 13 : 15;

  if (!supported) return null;

  return (
    <button
      onClick={start}
      title={listening ? 'Stop listening' : 'Speak your question'}
      className={cn(
        'flex-shrink-0 flex items-center justify-center rounded-lg border transition-all',
        size === 'sm'  ? 'w-8 h-8' : 'w-9 h-9',
        listening
          ? 'bg-red-500 border-red-500 text-white animate-pulse'
          : loading
            ? 'bg-[var(--surface-2)] border-[var(--border)] text-blue-500'
            : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-muted)] hover:text-blue-500 hover:border-blue-300',
        className
      )}
    >
      {loading    ? <Loader2 size={iconSize} className="animate-spin" />
       : listening ? <MicOff  size={iconSize} />
                   : <Mic     size={iconSize} />}
    </button>
  );
}
