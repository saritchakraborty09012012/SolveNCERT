import { useState, useEffect, useRef, useCallback } from 'react';
import { Pause, Play } from 'lucide-react';

interface QuizTimerProps {
  totalSeconds: number;
  onTimeUp: () => void;
  onTick?: (remaining: number) => void;
  isPaused?: boolean;
}

function fmt(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

function clr(r: number, t: number) {
  const p = (r / t) * 100;
  return p > 50 ? '#22c55e' : p > 25 ? '#f59e0b' : '#ef4444';
}

export default function QuizTimer({ totalSeconds, onTimeUp, onTick, isPaused = false }: QuizTimerProps) {
  const [rem, setRem] = useState(totalSeconds);
  const [paused, setPaused] = useState(isPaused);
  const iv = useRef<NodeJS.Timeout | null>(null);
  const fired = useRef(false);

  const cleanup = useCallback(() => { if (iv.current) { clearInterval(iv.current); iv.current = null; } }, []);

  useEffect(() => { setRem(totalSeconds); fired.current = false; }, [totalSeconds]);
  useEffect(() => { setPaused(isPaused); }, [isPaused]);

  useEffect(() => {
    cleanup();
    if (paused || rem <= 0) return;
    iv.current = setInterval(() => {
      setRem((p) => {
        const n = p - 1;
        onTick?.(n);
        if (n <= 0) { cleanup(); if (!fired.current) { fired.current = true; onTimeUp(); } return 0; }
        return n;
      });
    }, 1000);
    return cleanup;
  }, [paused, onTick, onTimeUp, cleanup]);

  const c = clr(rem, totalSeconds);
  const pct = rem / totalSeconds;

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-12 h-12 shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="20" fill="none" stroke="var(--surface-2)" strokeWidth="4" />
          <circle cx="24" cy="24" r="20" fill="none" stroke={c} strokeWidth="4" strokeDasharray={125.66} strokeDashoffset={125.66 * (1 - pct)} strokeLinecap="round" className="transition-all duration-1000" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color: c }}>
          {rem <= 0 ? '0' : Math.ceil(pct * 100)}%
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xl font-mono font-bold tabular-nums" style={{ color: c, minWidth: '5ch' }}>{fmt(rem)}</span>
        <button onClick={() => setPaused(!paused)} className="p-1.5 rounded-lg transition-all duration-200 hover:opacity-80" style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}>
          {paused ? <Play size={14} /> : <Pause size={14} />}
        </button>
      </div>
    </div>
  );
}
