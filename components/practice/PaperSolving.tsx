import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Clock,
  SkipForward,
  Send,
  Eye,
} from 'lucide-react';
import { usePracticeStore } from '@/store/practiceStore';

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

const getDotStyle = (status: string): React.CSSProperties => {
  if (status === 'current') return { background: 'var(--brand-primary)', color: '#fff' };
  if (status === 'answered') return { background: '#10b981', color: '#fff' };
  if (status === 'bookmarked') return { background: '#fbbf24', color: '#78350f' };
  if (status === 'skipped') return { background: '#f87171', color: '#fff' };
  return { background: 'var(--surface-2)', color: 'var(--text-muted)', border: '1px solid var(--border)' };
};

export default function PaperSolving() {
  const {
    currentPaper,
    solving,
    setSolvingState,
    setAnswer,
    toggleBookmark,
    toggleSkip,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    setView,
    setIsSubmitting,
    setResultAnalytics,
    setWrongQuestions,
    setXpEarned,
  } = usePracticeStore();

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setLocalSubmitting] = useState(false);
  const [elapsed, setElapsed] = useState(solving.timeElapsed || 0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const questions = currentPaper?.questions || [];
  const currentIndex = solving.currentQuestion;
  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(solving.answers).length;
  const bookmarkedCount = solving.bookmarks?.size || 0;
  const skippedCount = solving.skipped?.size || 0;

  useEffect(() => {
    if (solving.isPaused || !solving.timeStarted) return;

    timerRef.current = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        setSolvingState({ timeElapsed: next });
        return next;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [solving.isPaused, solving.timeStarted, setSolvingState]);

  const handleSubmit = async () => {
    setShowSubmitModal(true);
  };

  const confirmSubmit = async () => {
    if (!currentPaper || isSubmitting) return;

    setLocalSubmitting(true);
    setIsSubmitting(true);

    try {
      const attempts = questions.map((q, idx) => ({
        questionIndex: idx,
        selectedAnswer: solving.answers[idx] || null,
        isBookmarked: solving.bookmarks?.has(idx) || false,
        isSkipped: solving.skipped?.has(idx) || false,
        timeSpentSec: 0,
      }));

      const res = await fetch('/api/practice/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paper: currentPaper, attempts }),
      });

      const data = await res.json();

      if (res.ok) {
        setResultAnalytics(data.analytics);
        setWrongQuestions(data.wrongQuestions || []);
        setXpEarned(data.xpEarned || 0);
        setView('result');
      }
    } catch (err) {
      console.error('Submit failed:', err);
    } finally {
      setLocalSubmitting(false);
      setIsSubmitting(false);
      setShowSubmitModal(false);
    }
  };

  const getQuestionStatus = (idx: number): string => {
    if (idx === currentIndex) return 'current';
    if (solving.answers[idx]) return 'answered';
    if (solving.bookmarks?.has(idx)) return 'bookmarked';
    if (solving.skipped?.has(idx)) return 'skipped';
    return 'default';
  };

  if (!currentPaper || !currentQ) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p style={{ color: 'var(--text-muted)' }}>No paper loaded. Go back and select a paper.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface-0)' }}>
      {/* Top Bar */}
      <div
        className="sticky top-0 z-30 backdrop-blur-xl shadow-sm"
        style={{ background: 'var(--surface-0)', borderBottom: '1px solid var(--border)' }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setView('create')}
            className="flex items-center gap-2 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-medium">Back</span>
          </button>

          <div className="flex-1 mx-4 text-center">
            <h1
              className="text-sm sm:text-base font-semibold truncate"
              style={{ color: 'var(--text-primary)' }}
            >
              {currentPaper.subject} — {currentPaper.chapter}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-2 rounded-full px-3 py-1.5"
              style={{ background: 'var(--surface-2)' }}
            >
              <Clock className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <span
                className="text-sm font-mono font-semibold"
                style={{ color: 'var(--text-secondary)' }}
              >
                {formatTime(elapsed)}
              </span>
            </div>
            <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Q {currentIndex + 1}/{totalQuestions}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: '2px', background: 'var(--border)' }}>
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
              background: 'var(--brand-primary)',
            }}
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
        {/* Question Navigation Sidebar - Desktop */}
        <div className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-24 space-y-4">
            <div
              className="rounded-2xl shadow-sm p-4"
              style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
            >
              <h3
                className="text-xs font-semibold uppercase tracking-wider mb-3"
                style={{ color: 'var(--text-muted)' }}
              >
                Navigation
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToQuestion(idx)}
                    className="w-9 h-9 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center hover:scale-110"
                    style={getDotStyle(getQuestionStatus(idx))}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div
              className="rounded-2xl shadow-sm p-4 space-y-3"
              style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
            >
              <h3
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'var(--text-muted)' }}
              >
                Progress
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: 'var(--text-secondary)' }}>Answered</span>
                  <span className="font-semibold" style={{ color: '#10b981' }}>
                    {answeredCount}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: 'var(--text-secondary)' }}>Bookmarked</span>
                  <span className="font-semibold" style={{ color: '#f59e0b' }}>
                    {bookmarkedCount}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: 'var(--text-secondary)' }}>Skipped</span>
                  <span className="font-semibold" style={{ color: '#ef4444' }}>
                    {skippedCount}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: 'var(--text-secondary)' }}>Remaining</span>
                  <span className="font-semibold" style={{ color: 'var(--text-muted)' }}>
                    {totalQuestions - answeredCount - skippedCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Mobile Navigation Grid */}
          <div
            className="lg:hidden mb-6 rounded-2xl shadow-sm p-4"
            style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
          >
            <div className="grid grid-cols-10 sm:grid-cols-15 gap-1.5">
              {questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToQuestion(idx)}
                  className="w-8 h-8 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center hover:scale-110"
                  style={getDotStyle(getQuestionStatus(idx))}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Question Card */}
          <div
            className="rounded-2xl shadow-sm overflow-hidden"
            style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
          >
            {/* Question Header */}
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold"
                  style={{
                    background: 'rgba(var(--u3-primary), 0.15)',
                    color: 'var(--brand-primary)',
                  }}
                >
                  {currentIndex + 1}
                </span>
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background:
                      currentQ.type === 'mcq'
                        ? 'rgba(var(--u3-primary), 0.12)'
                        : currentQ.type === 'assertion-reason'
                        ? 'rgba(249, 115, 22, 0.12)'
                        : 'rgba(14, 165, 233, 0.12)',
                    color:
                      currentQ.type === 'mcq'
                        ? 'var(--brand-primary)'
                        : currentQ.type === 'assertion-reason'
                        ? '#ea580c'
                        : '#0284c7',
                  }}
                >
                  {currentQ.type}
                </span>
                <span
                  className="px-2 py-0.5 rounded text-xs font-medium"
                  style={{
                    background:
                      currentQ.difficulty === 'easy'
                        ? 'rgba(16, 185, 129, 0.12)'
                        : currentQ.difficulty === 'moderate'
                        ? 'rgba(245, 158, 11, 0.12)'
                        : 'rgba(239, 68, 68, 0.12)',
                    color:
                      currentQ.difficulty === 'easy'
                        ? '#10b981'
                        : currentQ.difficulty === 'moderate'
                        ? '#f59e0b'
                        : '#ef4444',
                  }}
                >
                  {currentQ.difficulty?.charAt(0).toUpperCase() + currentQ.difficulty?.slice(1)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleBookmark(currentIndex)}
                  className="p-2 rounded-xl transition-all duration-200"
                  style={{
                    background: solving.bookmarks?.has(currentIndex)
                      ? 'rgba(245, 158, 11, 0.12)'
                      : 'var(--surface-2)',
                    color: solving.bookmarks?.has(currentIndex)
                      ? '#f59e0b'
                      : 'var(--text-muted)',
                  }}
                  title="Bookmark"
                >
                  {solving.bookmarks?.has(currentIndex) ? (
                    <BookmarkCheck className="w-5 h-5" />
                  ) : (
                    <Bookmark className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => toggleSkip(currentIndex)}
                  className="p-2 rounded-xl transition-all duration-200"
                  style={{
                    background: solving.skipped?.has(currentIndex)
                      ? 'rgba(239, 68, 68, 0.12)'
                      : 'var(--surface-2)',
                    color: solving.skipped?.has(currentIndex)
                      ? '#ef4444'
                      : 'var(--text-muted)',
                  }}
                  title="Skip"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Question Body */}
            <div className="px-6 py-6">
              <p
                className="text-base leading-relaxed mb-6"
                style={{ color: 'var(--text-primary)' }}
              >
                {currentQ.text}
              </p>

              {/* Read-only options for MCQ / Assertion-Reason (student types the answer) */}
              {(currentQ.type === 'mcq' || currentQ.type === 'assertion-reason') &&
                currentQ.options && (
                  <div className="space-y-2 mb-6">
                    {currentQ.options.map((option, optIdx) => {
                      const letter = String.fromCharCode(65 + optIdx);
                      return (
                        <div
                          key={optIdx}
                          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left border select-none"
                          style={{
                            background: 'var(--surface-2)',
                            borderColor: 'var(--border)',
                          }}
                        >
                          <span
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                            style={{
                              background: 'var(--surface-0)',
                              color: 'var(--text-muted)',
                            }}
                          >
                            {letter}
                          </span>
                          <span style={{ color: 'var(--text-secondary)' }}>
                            {option}
                          </span>
                        </div>
                      );
                    })}
                    <p className="text-xs pt-1" style={{ color: 'var(--text-muted)' }}>
                      Type the full correct option below, e.g. &quot;C) Photosynthesis&quot;
                    </p>
                  </div>
                )}

              {/* Textarea for ALL question types */}
              <div>
                <textarea
                  value={solving.answers[currentIndex] || ''}
                  onChange={(e) => setAnswer(currentIndex, e.target.value)}
                  placeholder={
                    currentQ.type === 'mcq' || currentQ.type === 'assertion-reason'
                      ? 'Type the full option, e.g. "D) Xyz"...'
                      : 'Type your answer here...'
                  }
                  rows={currentQ.type === 'mcq' || currentQ.type === 'assertion-reason' ? 2 : 8}
                  className="w-full p-4 rounded-xl outline-none transition-all duration-200 resize-none focus:border-[var(--brand-primary)]"
                  style={{
                    background: 'var(--surface-2)',
                    color: 'var(--text-primary)',
                    border: '2px solid var(--border)',
                  }}
                />
              </div>
            </div>

            {/* Related Info */}
            {(currentQ.topic || currentQ.relatedConcept || currentQ.revisionTip) && (
              <div className="px-6 pb-6">
                <div
                  className="rounded-xl p-4"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
                >
                  {currentQ.topic && (
                    <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                      <span className="font-semibold">Topic:</span> {currentQ.topic}
                    </p>
                  )}
                  {currentQ.relatedConcept && (
                    <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                      <span className="font-semibold">Related:</span> {currentQ.relatedConcept}
                    </p>
                  )}
                  {currentQ.revisionTip && (
                    <p className="text-sm italic" style={{ color: 'var(--text-muted)' }}>
                      Tip: {currentQ.revisionTip}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Navigation */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={prevQuestion}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200"
              style={{
                background: currentIndex === 0 ? 'var(--surface-2)' : 'var(--surface-1)',
                color: currentIndex === 0 ? 'var(--text-muted)' : 'var(--text-primary)',
                border: '1px solid var(--border)',
                opacity: currentIndex === 0 ? 0.5 : 1,
                cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-2.5 font-semibold rounded-xl shadow-md transition-all duration-200"
              style={{
                background: 'var(--brand-primary)',
                color: 'var(--brand-primary-foreground, #fff)',
              }}
            >
              <Send className="w-4 h-4" />
              Submit Paper
            </button>

            <button
              onClick={nextQuestion}
              disabled={currentIndex === totalQuestions - 1}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200"
              style={{
                background:
                  currentIndex === totalQuestions - 1 ? 'var(--surface-2)' : 'var(--surface-1)',
                color:
                  currentIndex === totalQuestions - 1
                    ? 'var(--text-muted)'
                    : 'var(--text-primary)',
                border: '1px solid var(--border)',
                opacity: currentIndex === totalQuestions - 1 ? 0.5 : 1,
                cursor: currentIndex === totalQuestions - 1 ? 'not-allowed' : 'pointer',
              }}
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !isSubmitting && setShowSubmitModal(false)}
          />
          <div
            className="relative rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200"
            style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
          >
            <div className="text-center">
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(var(--u3-primary), 0.12)' }}
              >
                <Eye className="w-8 h-8" style={{ color: 'var(--brand-primary)' }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Submit Paper?
              </h3>
              <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                You have answered{' '}
                <span className="font-semibold" style={{ color: 'var(--brand-primary)' }}>
                  {answeredCount}
                </span>{' '}
                out of{' '}
                <span className="font-semibold">{totalQuestions}</span> questions.
                {skippedCount > 0 && (
                  <span className="block mt-1 text-sm" style={{ color: '#ef4444' }}>
                    {skippedCount} question(s) skipped.
                  </span>
                )}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 font-medium rounded-xl transition-colors disabled:opacity-50"
                  style={{
                    background: 'var(--surface-2)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border)',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSubmit}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 font-semibold rounded-xl transition-all shadow-md disabled:opacity-50"
                  style={{
                    background: 'var(--brand-primary)',
                    color: 'var(--brand-primary-foreground, #fff)',
                  }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Confirm Submit'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
