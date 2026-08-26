interface QuizProgressProps {
  total: number;
  current: number;
  answers: Record<string, { answer: string; isSkipped: boolean }>;
  questionIds: string[];
  onNavigate: (index: number) => void;
}

function getDotColor(
  questionId: string,
  index: number,
  current: number,
  answers: Record<string, { answer: string; isSkipped: boolean }>
): string {
  if (index === current) return 'var(--brand-primary)';
  const entry = answers[questionId];
  if (!entry) return 'var(--surface-2)';
  if (entry.isSkipped) return '#f59e0b';
  if (entry.answer) return '#22c55e';
  return 'var(--surface-2)';
}

export default function QuizProgress({
  total,
  current,
  answers,
  questionIds,
  onNavigate,
}: QuizProgressProps) {
  const answeredCount = questionIds.filter((id) => {
    const e = answers[id];
    return e && e.answer && !e.isSkipped;
  }).length;

  const skippedCount = questionIds.filter((id) => {
    const e = answers[id];
    return e?.isSkipped;
  }).length;

  const progressPct = ((current + 1) / total) * 100;

  return (
    <div className="w-full">
      {/* Counter + stats */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {current + 1} / {total}
        </span>
        <div className="flex gap-3 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full" style={{ background: '#22c55e' }} />
            {answeredCount}
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full" style={{ background: '#f59e0b' }} />
            {skippedCount}
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full" style={{ background: 'var(--surface-2)' }} />
            {total - answeredCount - skippedCount}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full overflow-hidden mb-4" style={{ background: 'var(--surface-2)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            background: 'var(--brand-primary)',
            width: `${progressPct}%`,
          }}
        />
      </div>

      {/* Question dots */}
      <div className="flex flex-wrap gap-1.5">
        {questionIds.map((id, i) => (
          <button
            key={id}
            onClick={() => onNavigate(i)}
            className="w-7 h-7 rounded-lg text-xs font-bold transition-all duration-200 hover:scale-110"
            style={{
              background: getDotColor(id, i, current, answers),
              color: i === current ? '#fff' : 'var(--text-muted)',
              border: i === current ? '2px solid var(--brand-primary)' : '2px solid transparent',
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
