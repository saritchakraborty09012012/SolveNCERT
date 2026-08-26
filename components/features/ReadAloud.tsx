import React, { useState, useRef, useEffect } from 'react';
import { Volume2, Square, Loader2 } from 'lucide-react';
import { cn } from '@/utils/helpers';

interface Props {
  text: string;
  className?: string;
  size?: 'sm' | 'md';
  autoPlay?: boolean;
}

// Strip LaTeX/markdown into natural spoken English
function cleanForSpeech(raw: string): string {
  return raw
    // Block math $$...$$ 
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, m) => mathToSpeech(m))
    // Inline math $...$
    .replace(/\$([^$\n]+?)\$/g, (_, m) => mathToSpeech(m))
    // Bold/italic markdown
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    // HTML tags (e.g. <u>underline</u>)
    .replace(/<[^>]+>/g, '')
    // Remove heading hashes
    .replace(/#{1,6}\s+/g, '')
    // Remove table pipes
    .replace(/\|/g, ' ')
    // Remove checkmarks/bullets
    .replace(/[✓✗•]/g, '')
    // Clean extra whitespace
    .replace(/\s{3,}/g, '  ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function mathToSpeech(latex: string): string {
  return latex
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1 over $2')
    .replace(/\\sqrt\[([^\]]+)\]\{([^}]+)\}/g, '$1th root of $2')
    .replace(/\\sqrt\{([^}]+)\}/g, 'square root of $1')
    .replace(/\^{([^}]+)}/g, ' to the power $1')
    .replace(/\^(\d)/g, ' to the power $1')
    .replace(/_{([^}]+)}/g, ' subscript $1')
    .replace(/_(\d)/g, ' subscript $1')
    .replace(/\\times/g, ' times ')
    .replace(/\\div/g, ' divided by ')
    .replace(/\\pm/g, ' plus or minus ')
    .replace(/\\cdot/g, ' dot ')
    .replace(/\\leq/g, ' less than or equal to ')
    .replace(/\\geq/g, ' greater than or equal to ')
    .replace(/\\neq/g, ' not equal to ')
    .replace(/\\approx/g, ' approximately equal to ')
    .replace(/\\in/g, ' belongs to ')
    .replace(/\\notin/g, ' does not belong to ')
    .replace(/\\cup/g, ' union ')
    .replace(/\\cap/g, ' intersection ')
    .replace(/\\subset/g, ' is subset of ')
    .replace(/\\mathbb\{N\}/g, 'Natural Numbers')
    .replace(/\\mathbb\{Z\}/g, 'Integers')
    .replace(/\\mathbb\{Q\}/g, 'Rational Numbers')
    .replace(/\\mathbb\{R\}/g, 'Real Numbers')
    .replace(/\\pi/g, 'pi')
    .replace(/\\alpha/g, 'alpha')
    .replace(/\\beta/g, 'beta')
    .replace(/\\theta/g, 'theta')
    .replace(/\\therefore/g, 'therefore')
    .replace(/\\infty/g, 'infinity')
    .replace(/\\Rightarrow/g, ' implies ')
    .replace(/\\[a-zA-Z]+/g, ' ')
    .replace(/[{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Build SSML-like paused speech using chunked utterances
function buildChunks(text: string): string[] {
  // Split on sentence boundaries and paragraph breaks
  const chunks: string[] = [];
  const paragraphs = text.split(/\n\n+/);
  for (const para of paragraphs) {
    const sentences = para.split(/(?<=[.!?:])\s+/);
    for (const s of sentences) {
      const clean = s.trim();
      if (clean.length > 0) chunks.push(clean);
    }
    // Add empty chunk as paragraph pause marker
    if (paragraphs.indexOf(para) < paragraphs.length - 1) chunks.push('');
  }
  return chunks.filter((c, i) => !(c === '' && chunks[i - 1] === ''));
}

export default function ReadAloud({ text, className, size = 'sm', autoPlay = false }: Props) {
  const [playing,  setPlaying]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const stopRef   = useRef(false);
  const synth     = typeof window !== 'undefined' ? window.speechSynthesis : null;
  const lastAutoPlayed = useRef('');

  useEffect(() => {
    return () => { stopRef.current = true; synth?.cancel(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto read-out: speaks whenever `autoPlay` is on and a new text arrives.
  // Turns off (with manual stop) when autoPlay is switched off.
  useEffect(() => {
    if (autoPlay && text && text !== lastAutoPlayed.current) {
      lastAutoPlayed.current = text;
      const t = setTimeout(() => handleClick(true), 250);
      return () => clearTimeout(t);
    }
    if (!autoPlay) {
      stopRef.current = true;
      synth?.cancel();
      setPlaying(false);
      setLoading(false);
      lastAutoPlayed.current = '';
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, text]);

  function getBestVoice(): SpeechSynthesisVoice | null {
    if (!synth) return null;
    const voices = synth.getVoices();
    // Preference order: natural-sounding en-IN or en-US/GB
    const priority = [
      (v: SpeechSynthesisVoice) => v.lang === 'en-IN' && v.localService,
      (v: SpeechSynthesisVoice) => v.lang.startsWith('en') && v.name.toLowerCase().includes('premium'),
      (v: SpeechSynthesisVoice) => v.lang.startsWith('en') && v.name.toLowerCase().includes('enhanced'),
      (v: SpeechSynthesisVoice) => v.lang.startsWith('en') && v.name.toLowerCase().includes('google'),
      (v: SpeechSynthesisVoice) => v.lang.startsWith('en') && v.localService,
      (v: SpeechSynthesisVoice) => v.lang.startsWith('en'),
    ];
    for (const fn of priority) {
      const found = voices.find(fn);
      if (found) return found;
    }
    return voices[0] || null;
  }

  async function speakChunks(chunks: string[]) {
    if (!synth) return;
    const voice = getBestVoice();

    for (let i = 0; i < chunks.length; i++) {
      if (stopRef.current) break;
      const chunk = chunks[i];

      if (chunk === '') {
        // Paragraph pause: 700ms silence
        await new Promise(r => setTimeout(r, 700));
        continue;
      }

      await new Promise<void>((resolve) => {
        if (stopRef.current) { resolve(); return; }
        const utt = new SpeechSynthesisUtterance(chunk);
        if (voice) utt.voice = voice;
        utt.rate   = 0.88;   // slightly slower = more natural
        utt.pitch  = 1.0;
        utt.volume = 1.0;
        utt.lang   = voice?.lang || 'en-IN';

        // Natural pause between sentences
        utt.onend = () => {
          setTimeout(resolve, chunk.endsWith(',') ? 200 : chunk.endsWith(':') ? 350 : 150);
        };
        utt.onerror = () => resolve();
        synth.speak(utt);
      });
    }

    if (!stopRef.current) setPlaying(false);
  }

  function handleClick(forceStart = false) {
    if (!synth) return;
    if (playing && !forceStart) {
      stopRef.current = true;
      synth.cancel();
      setPlaying(false);
      setLoading(false);
      return;
    }

    if (forceStart) synth.cancel();
    stopRef.current = false;
    setLoading(true);

    const cleaned = cleanForSpeech(text);
    const chunks  = buildChunks(cleaned);

    // Voices may not be loaded yet
    const go = () => {
      setLoading(false);
      setPlaying(true);
      speakChunks(chunks);
    };

    if (synth.getVoices().length > 0) {
      go();
    } else {
      synth.onvoiceschanged = go;
    }
  }

  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <button
      onClick={() => handleClick()}
      title={playing ? 'Stop reading' : 'Read aloud'}
      className={cn(
        'inline-flex items-center gap-1 rounded-lg border transition-all select-none',
        size === 'sm'  ? 'px-2 py-1 text-[11px] font-medium'
                       : 'px-2.5 py-1.5 text-xs font-semibold',
        playing
          ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
          : 'bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border-transparent hover:border-[var(--border)]',
        className
      )}
    >
      {loading  ? <Loader2 size={iconSize} className="animate-spin" />
       : playing ? <Square  size={iconSize} />
                 : <Volume2 size={iconSize} />}
      <span>{playing ? 'Stop' : 'Read'}</span>
    </button>
  );
}
