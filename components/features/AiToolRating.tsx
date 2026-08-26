import React, { useEffect, useState } from 'react';
import { Star, X, Sparkles } from 'lucide-react';
import { useFeedbackStore } from '@/store/feedbackStore';
import { submitFeedback, type FeedbackSource } from '@/lib/feedback';
import toast from 'react-hot-toast';

const TOOL_LABELS: Record<string, string> = {
  'ai-notes': 'AI Notes',
  'ai-flashcards': 'AI Flashcards',
  'ai-doubt-solver': 'AI Doubt Solver',
  'ai-search': 'AI Smart Search',
  'ai-learn': 'AI Learn',
  'ai-practice': 'Practice Paper',
  'ai-mock-test': 'Mock Test',
};

const MOOD_LABELS: Record<number, string> = {
  1: 'Very Bad', 2: 'Average', 3: 'Good', 4: 'Very Good', 5: 'Excellent',
};

export default function AiToolRating() {
  const pendingAiTool = useFeedbackStore(s => s.pendingAiTool);
  const dismissAiRating = useFeedbackStore(s => s.dismissAiRating);
  const markAiToolRated = useFeedbackStore(s => s.markAiToolRated);
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Hydration-safe: only render client-driven UI after mount
  useEffect(() => { setMounted(true); }, []);

  if (!mounted || !pendingAiTool) return null;

  const displayRating = hoverRating ?? rating ?? 0;
  const toolLabel = TOOL_LABELS[pendingAiTool] || pendingAiTool;
  const source = pendingAiTool as FeedbackSource;

  async function submit() {
    if (!rating || !pendingAiTool) return;
    setSubmitting(true);
    try {
      const ok = await submitFeedback({ stars: rating, source });
      if (ok) {
        toast.success(`${toolLabel} feedback — ${rating} star${rating > 1 ? 's' : ''}!`);
        markAiToolRated(pendingAiTool);
      } else {
        toast.error('Could not submit feedback right now.');
        setSubmitting(false);
      }
    } catch {
      toast.error('Could not submit feedback right now.');
      setSubmitting(false);
    }
  }

  function dismiss() {
    dismissAiRating();
    setRating(null);
    setHoverRating(null);
    setSubmitting(false);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={dismiss} />
      <div className="relative bg-[var(--surface-0)] rounded-2xl shadow-2xl w-full max-w-xs p-5 border border-[var(--border)]">
        <button onClick={dismiss} aria-label="Close" className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)]">
          <X size={14} />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
            <Sparkles size={16} className="text-amber-400" />
          </div>
          <div>
            <p className="font-display font-bold text-sm text-[var(--text-primary)]">Rate {toolLabel}</p>
            <p className="text-[10px] text-[var(--text-muted)]">How was your experience?</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              onMouseEnter={() => setHoverRating(n)}
              onMouseLeave={() => setHoverRating(null)}
              onClick={() => setRating(n)}
              className="p-0.5"
              aria-label={`${n} star${n > 1 ? 's' : ''}`}
            >
              <Star
                size={24}
                className={n <= displayRating ? 'text-amber-400' : 'text-[var(--border)]'}
                fill={n <= displayRating ? 'currentColor' : 'none'}
              />
            </button>
          ))}
        </div>

        {displayRating > 0 && (
          <p className="text-center text-[11px] font-semibold text-amber-500 mb-3">{MOOD_LABELS[displayRating]}</p>
        )}

        {rating !== null && (
          <button onClick={submit} disabled={submitting} className="btn-primary w-full justify-center text-sm py-2">
            {submitting ? 'Submitting…' : `Submit ${rating} Star${rating > 1 ? 's' : ''}`}
          </button>
        )}
      </div>
    </div>
  );
}
