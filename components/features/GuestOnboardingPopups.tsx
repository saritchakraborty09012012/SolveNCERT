import React, { useCallback, useEffect, useState } from 'react';
import { X, Sparkles, Bot, MessageCircleQuestion } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

/**
 * Guest-only onboarding popups, shown once per visit (browser session):
 *   1. Welcome / mission modal
 *   2. Speech bubble pointing at the "AI Tools" header menu
 *   3. Speech bubble pointing at the red query header button
 * Logged-in and premium users never see these.
 */
const DONE_KEY = 'sn_guest_popups_done';

const AI_TOOLS = [
  { name: 'Ask Anything', desc: 'ask beyond your textbook — any subject, any doubt' },
  { name: 'AI Learn', desc: 'step-by-step AI tutor' },
  { name: 'Notes Generator', desc: 'one-click chapter notes' },
  { name: 'Answer Checker', desc: 'board-exam answer checking' },
  { name: 'Flash Cards', desc: 'quick revision cards' },
  { name: 'Quizzes & Mock Tests', desc: 'chapter-wise practice' },
];

function markDone() {
  try { sessionStorage.setItem(DONE_KEY, '1'); } catch { /* ignore */ }
}

/** Speech-bubble dialogue box with an upward arrow pointing at a header element. */
function AnchorBubble({ targetId, children, onNext }: {
  targetId: string;
  children: React.ReactNode;
  onNext: () => void;
}) {
  const [pos, setPos] = useState<{ left: number; top: number; arrowLeft: number } | null>(null);

  const recompute = useCallback(() => {
    if (typeof window === 'undefined') return;
    const vw = window.innerWidth;
    const w = Math.min(340, vw - 24);
    const fallback = { left: (vw - w) / 2, top: 76, arrowLeft: w / 2 - 8 };
    const el = document.getElementById(targetId);
    if (!el) { setPos(fallback); return; }
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) { setPos(fallback); return; }
    const left = Math.min(Math.max(r.left + r.width / 2 - w / 2, 12), vw - w - 12);
    const arrowLeft = Math.min(Math.max(r.left + r.width / 2 - left - 8, 16), w - 32);
    setPos({ left, top: r.bottom + 14, arrowLeft });
  }, [targetId]);

  useEffect(() => {
    recompute();
    window.addEventListener('resize', recompute);
    window.addEventListener('scroll', recompute, true);
    return () => {
      window.removeEventListener('resize', recompute);
      window.removeEventListener('scroll', recompute, true);
    };
  }, [recompute]);

  // Glow ring on the target button while the bubble points at it
  useEffect(() => {
    const el = document.getElementById(targetId);
    if (el) el.classList.add('sc-pop-highlight');
    return () => { if (el) el.classList.remove('sc-pop-highlight'); };
  }, [targetId]);

  if (!pos) return null;

  return (
    <div
      role="dialog"
      aria-label="Tip"
      className="fixed z-[95]"
      style={{ left: pos.left, top: pos.top, width: 'min(340px, calc(100vw - 24px))' }}
    >
      {/* upward arrow */}
      <div
        className="absolute -top-2 w-4 h-4 rotate-45 border-l border-t"
        style={{
          left: pos.arrowLeft,
          background: 'var(--surface-0)',
          borderColor: 'color-mix(in srgb, var(--brand-primary) 45%, transparent)',
        }}
      />
      <div
        className="relative rounded-2xl border shadow-2xl p-4"
        style={{
          background: 'var(--surface-0)',
          borderColor: 'color-mix(in srgb, var(--brand-primary) 45%, transparent)',
        }}
      >
        <button
          type="button"
          onClick={onNext}
          aria-label="Close"
          className="absolute top-2.5 right-2.5 p-1.5 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)] transition-colors"
        >
          <X size={14} />
        </button>
        {children}
        <button
          type="button"
          onClick={onNext}
          className="mt-3 w-full px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: 'var(--brand-primary)' }}
        >
          OK
        </button>
      </div>
    </div>
  );
}

export default function GuestOnboardingPopups() {
  const { isGuest, loading } = useAuthStore();
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);

  useEffect(() => {
    if (loading) return;
    if (!isGuest) {           // logged-in / premium users never see these
      setStep(0);
      markDone();
      return;
    }
    let done = false;
    try { done = sessionStorage.getItem(DONE_KEY) === '1'; } catch { /* ignore */ }
    if (done) return;
    const t = setTimeout(() => setStep(1), 900);
    return () => clearTimeout(t);
  }, [isGuest, loading]);

  const advance = () => {
    setStep((s) => {
      if (s >= 3) { markDone(); return 0; }
      return (s + 1) as 1 | 2 | 3;
    });
  };
  const finish = () => { markDone(); setStep(0); };

  if (step === 0) return null;

  if (step === 1) {
    return (
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={finish} />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Welcome to SolveNCERT"
          className="relative w-full max-w-md rounded-t-2xl sm:rounded-2xl border border-[var(--border)] bg-[var(--surface-0)] shadow-2xl p-6"
        >
          <button
            type="button"
            onClick={finish}
            aria-label="Close"
            className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)] transition-colors"
          >
            <X size={16} />
          </button>

          <div className="flex items-center gap-2.5 mb-3">
            <span className="grid size-10 place-items-center rounded-xl text-white" style={{ background: 'var(--brand-primary)' }}>
              <Sparkles size={18} />
            </span>
            <h3 className="text-lg font-bold text-[var(--text-primary)] pr-8">Welcome to SolveNCERT</h3>
          </div>

          <div className="space-y-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              This website was created after seeing the critical situation of Class 9 students facing a
              drastic change in curriculum — no website providing proper solutions, scattered sources
              creating confusion and consuming precious time, and no single place with all solutions at
              one click. Outdated solutions and explanation methods were lagging students&apos; progress.
            </p>
            <p>
              Here we come — <b className="text-[var(--text-primary)]">fully AI-powered, free and human-verified</b>.
              Each question has an AI follow-up, and you can invite your friends and chat with them in real time.
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              We apologise for the delay due to the delay in book publishing from NCERT.
            </p>
          </div>

          <button
            type="button"
            onClick={advance}
            className="mt-5 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: 'var(--brand-primary)' }}
          >
            OK
          </button>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <AnchorBubble targetId="nav-ai-tools" onNext={advance}>
        <div className="flex items-center gap-2 mb-1.5 pr-6">
          <span className="grid size-7 place-items-center rounded-lg text-white" style={{ background: 'var(--brand-primary)' }}>
            <Bot size={14} />
          </span>
          <h4 className="text-sm font-bold text-[var(--text-primary)]">Check out our new AI Tools</h4>
        </div>
        <p className="text-xs text-[var(--text-muted)] mb-2">Each with its own description:</p>
        <ul className="space-y-1">
          {AI_TOOLS.map((t) => (
            <li key={t.name} className="flex items-baseline gap-1.5 text-xs">
              <span className="font-semibold text-[var(--text-primary)] whitespace-nowrap">{t.name}</span>
              <span className="text-[var(--text-muted)]">— {t.desc}</span>
            </li>
          ))}
        </ul>
      </AnchorBubble>
    );
  }

  return (
    <AnchorBubble targetId="header-query-btn" onNext={finish}>
      <div className="flex items-center gap-2 mb-1.5 pr-6">
        <span className="grid size-7 place-items-center rounded-lg bg-red-500 text-white">
          <MessageCircleQuestion size={14} />
        </span>
        <h4 className="text-sm font-bold text-[var(--text-primary)]">Found an issue? Tell us!</h4>
      </div>
      <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
        If you don&apos;t find any answer, or any answer is not up to the mark or incomplete, kindly inform
        us immediately through this red button. We would be thankful for your help.
      </p>
    </AnchorBubble>
  );
}
