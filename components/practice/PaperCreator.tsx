import { useState, useMemo, useEffect } from 'react';
import { ClipboardList, ChevronDown, Loader2, AlertCircle, BookOpen, Hash, BarChart3, Sparkles, Zap } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { CLASS_9_SUBJECTS } from '@/lib/content';
import { usePracticeStore } from '@/store/practiceStore';
import { useAuthStore } from '@/store/authStore';
import { getPracticeRemainingCalls, incrementPracticeCall, hasReachedPracticeLimit } from '@/lib/guestLimits';

const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Easy', description: 'Basic recall & understanding questions', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', ring: 'ring-emerald-500/50' },
  { value: 'moderate', label: 'Moderate', description: 'Application & analysis level', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', ring: 'ring-amber-500/50' },
  { value: 'hard', label: 'Hard', description: 'Higher-order thinking & evaluation', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', ring: 'ring-rose-500/50' },
] as const;

const QUESTION_PRESETS = [10, 15, 20, 30, 40, 50] as const;

export default function PaperCreator() {
  const {
    config,
    setConfig,
    setCurrentPaper,
    setView,
    setSolvingState,
    isGenerating,
    setIsGenerating,
    generationError,
    setGenerationError,
  } = usePracticeStore();

  const { isGuest } = useAuthStore();
  const [remainingCalls, setRemainingCalls] = useState(5);

  useEffect(() => {
    if (isGuest) setRemainingCalls(getPracticeRemainingCalls());
  }, [isGuest]);

  const uniqueSubjects = useMemo(() => {
    const seen = new Set<string>();
    return CLASS_9_SUBJECTS.filter((s) => {
      if (seen.has(s.name)) return false;
      seen.add(s.name);
      return true;
    });
  }, []);

  const selectedSubject = useMemo(
    () => CLASS_9_SUBJECTS.find((s) => s.name === config.subject) ?? null,
    [config.subject]
  );

  const chapters = useMemo(() => selectedSubject?.chapters ?? [], [selectedSubject]);

  const handleSubjectChange = (subjectName: string) => {
    const subject = CLASS_9_SUBJECTS.find((s) => s.name === subjectName);
    setConfig({
      ...config,
      subject: subjectName,
      book: subject?.book ?? '',
      chapter: '',
    });
  };

  const handleGenerate = async () => {
    if (!config.subject || !config.chapter || !config.difficulty || config.questionCount <= 0) return;

    // Guest rate limiting: 5 free API calls per day
    if (isGuest && hasReachedPracticeLimit()) {
      setGenerationError('You\'ve used all 5 free practice papers for today. Sign up to get unlimited access!');
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const res = await fetch('/api/practice/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({ error: { message: 'Generation failed' } }));
        const msg = errBody.error?.message || errBody.error || `Server error (${res.status})`;
        throw new Error(msg);
      }

      const data = await res.json();
      setCurrentPaper(data.paper);
      setSolvingState({ timeStarted: Date.now() });
      setView('solving');

      // Track guest usage
      if (isGuest) {
        incrementPracticeCall();
        setRemainingCalls(getPracticeRemainingCalls());
      }
    } catch (err) {
      setGenerationError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: 'var(--brand-primary)', color: '#fff' }}
        >
          <ClipboardList size={20} />
        </div>
        <div>
          <h1
            className="text-xl font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            Create Practice Paper
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Configure and generate a custom practice paper
          </p>
        </div>
      </div>

      {/* Card */}
      <div
        className="rounded-2xl p-6 shadow-lg"
        style={{
          background: 'var(--surface-1)',
          border: '1px solid var(--border)',
        }}
      >
        <div className="space-y-6">
          {/* Class Selector */}
          <div>
            <label
              className="mb-1.5 flex items-center gap-2 text-sm font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              <BookOpen size={14} />
              Class
            </label>
            <div
              className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium"
              style={{
                background: 'var(--surface-0)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
              }}
            >
              Class 9
              <span
                className="ml-auto rounded-full px-2 py-0.5 text-xs"
                style={{
                  background: 'var(--brand-primary)',
                  color: '#fff',
                }}
              >
                Only
              </span>
            </div>
          </div>

          {/* Subject Selector */}
          <div>
            <label
              className="mb-1.5 flex items-center gap-2 text-sm font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              <BookOpen size={14} />
              Subject
            </label>
            <div className="relative">
              <select
                value={config.subject}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full appearance-none rounded-xl px-4 py-3 pr-10 text-sm font-medium outline-none transition-shadow focus:ring-2"
                style={{
                  background: 'var(--surface-0)',
                  color: config.subject ? 'var(--text-primary)' : 'var(--text-muted)',
                  border: '1px solid var(--border)',
                  '--tw-ring-color': 'var(--brand-primary)',
                } as React.CSSProperties}
              >
                <option value="">Select a subject</option>
                {uniqueSubjects.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-muted)' }}
              />
            </div>
          </div>

          {/* Book Field (auto-filled, disabled) */}
          <div>
            <label
              className="mb-1.5 flex items-center gap-2 text-sm font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              <BookOpen size={14} />
              Book
            </label>
            <input
              type="text"
              readOnly
              value={config.book}
              placeholder="Auto-selected from subject"
              className="w-full cursor-not-allowed rounded-xl px-4 py-3 text-sm font-medium opacity-60"
              style={{
                background: 'var(--surface-0)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
              }}
            />
          </div>

          {/* Chapter Selector */}
          <div>
            <label
              className="mb-1.5 flex items-center gap-2 text-sm font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              <BookOpen size={14} />
              Chapter
            </label>
            <div className="relative">
              <select
                value={config.chapter}
                onChange={(e) => setConfig({ ...config, chapter: e.target.value })}
                disabled={!config.subject}
                className="w-full appearance-none rounded-xl px-4 py-3 pr-10 text-sm font-medium outline-none transition-shadow focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  background: 'var(--surface-0)',
                  color: config.chapter ? 'var(--text-primary)' : 'var(--text-muted)',
                  border: '1px solid var(--border)',
                  '--tw-ring-color': 'var(--brand-primary)',
                } as React.CSSProperties}
              >
                <option value="">
                  {config.subject ? 'Select a chapter' : 'Select a subject first'}
                </option>
                {chapters.map((ch) => (
                  <option key={ch.slug} value={ch.slug}>
                    Ch {ch.number}. {ch.title}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-muted)' }}
              />
            </div>
          </div>

          {/* Difficulty Selector */}
          <div>
            <label
              className="mb-2 flex items-center gap-2 text-sm font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              <BarChart3 size={14} />
              Difficulty
            </label>
            <div className="grid grid-cols-3 gap-3">
              {DIFFICULTY_OPTIONS.map((opt) => {
                const selected = config.difficulty === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setConfig({ ...config, difficulty: opt.value })}
                    className={cn(
                      'flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-4 text-center transition-all',
                      selected
                        ? `${opt.bg} ${opt.border} ring-2 ${opt.ring}`
                        : 'hover:border-opacity-50'
                    )}
                    style={
                      !selected
                        ? {
                            background: 'var(--surface-0)',
                            borderColor: 'var(--border)',
                          }
                        : undefined
                    }
                  >
                    <span className={cn('text-sm font-bold', selected ? opt.color : '')} style={!selected ? { color: 'var(--text-primary)' } : undefined}>
                      {opt.label}
                    </span>
                    <span
                      className="text-[11px] leading-tight"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {opt.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Number of Questions */}
          <div>
            <label
              className="mb-2 flex items-center gap-2 text-sm font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              <Hash size={14} />
              Number of Questions
            </label>
            <div className="flex flex-wrap gap-2">
              {QUESTION_PRESETS.map((n) => {
                const selected = config.questionCount === n;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setConfig({ ...config, questionCount: n })}
                    className={cn(
                      'rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition-all',
                      selected
                        ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white shadow-md'
                        : ''
                    )}
                    style={
                      !selected
                        ? {
                            background: 'var(--surface-0)',
                            borderColor: 'var(--border)',
                            color: 'var(--text-primary)',
                          }
                        : undefined
                    }
                  >
                    {n}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex items-center gap-3">
              <label className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Custom:
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={config.questionCount}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    questionCount: Math.max(1, Math.min(100, Number(e.target.value) || 1)),
                  })
                }
                className="w-20 rounded-lg px-3 py-1.5 text-sm font-medium outline-none focus:ring-2"
                style={{
                  background: 'var(--surface-0)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  '--tw-ring-color': 'var(--brand-primary)',
                } as React.CSSProperties}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Guest Remaining Calls */}
      {isGuest && (
        <div
          className={cn(
            'flex items-center gap-2 rounded-xl border p-3 text-sm',
            remainingCalls > 0
              ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/30'
              : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/30'
          )}
        >
          <Zap size={16} className={remainingCalls > 0 ? 'text-amber-500' : 'text-red-500'} />
          <span className={remainingCalls > 0 ? 'text-amber-700 dark:text-amber-300' : 'text-red-600 dark:text-red-400'}>
            {remainingCalls > 0
              ? `${remainingCalls} free ${remainingCalls === 1 ? 'paper' : 'papers'} left today`
              : 'Daily limit reached — Sign up for unlimited access'}
          </span>
        </div>
      )}

      {/* Error Display */}
      {generationError && (
        <div
          className="flex items-start gap-3 rounded-xl border p-4"
          style={{
            background: 'rgba(239,68,68,0.08)',
            borderColor: 'rgba(239,68,68,0.25)',
          }}
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-400" />
          <div>
            <p className="text-sm font-medium text-red-400">Generation Failed</p>
            <p className="mt-1 text-xs text-red-400/80">{generationError}</p>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <button
        type="button"
        onClick={handleGenerate}
        disabled={isGenerating || !config.subject || !config.chapter || !config.difficulty}
        className={cn(
          'flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold transition-all',
          'disabled:cursor-not-allowed disabled:opacity-50'
        )}
        style={{
          background: isGenerating ? 'var(--surface-1)' : 'var(--brand-primary)',
          color: isGenerating ? 'var(--text-muted)' : '#fff',
          border: '1px solid var(--border)',
        }}
      >
        {isGenerating ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Generating Paper...
          </>
        ) : (
          <>
            <Sparkles size={18} />
            Generate Practice Paper
          </>
        )}
      </button>
    </div>
  );
}
