import React, { useState, useEffect } from 'react';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  TrendingUp,
  BarChart3,
  Brain,
  ArrowLeft,
  Download,
  RotateCcw,
  Eye,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  AlertTriangle,
} from 'lucide-react';
import { usePracticeStore } from '@/store/practiceStore';
import {
  recordPracticePerformance,
  updateWeakAreas,
  updateStrongAreas,
  recordWrongQuestion,
} from '@/lib/practice/shared-knowledge';
import { addXP } from '@/lib/ai-learn/profile';

function getRatingStyle(rating: string): React.CSSProperties {
  switch (rating?.toLowerCase()) {
    case 'excellent':
      return { background: 'rgba(16, 185, 129, 0.12)', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.35)' };
    case 'good':
      return { background: 'rgba(59, 130, 246, 0.12)', color: '#60a5fa', borderColor: 'rgba(59, 130, 246, 0.35)' };
    case 'average':
      return { background: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.35)' };
    case 'needs improvement':
    case 'needs_improvement':
      return { background: 'rgba(239, 68, 68, 0.12)', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.35)' };
    default:
      return { background: 'var(--surface-2)', color: 'var(--text-secondary)', borderColor: 'var(--border)' };
  }
}

function getScoreColor(percentage: number) {
  if (percentage > 75) return { stroke: '#10b981', text: '#34d399' };
  if (percentage > 50) return { stroke: '#f59e0b', text: '#fbbf24' };
  return { stroke: '#ef4444', text: '#f87171' };
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

function getDifficultyStyle(difficulty: string): React.CSSProperties {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return { color: '#34d399', background: 'rgba(16, 185, 129, 0.12)', borderColor: 'rgba(16, 185, 129, 0.35)' };
    case 'medium':
    case 'moderate':
      return { color: '#fbbf24', background: 'rgba(245, 158, 11, 0.12)', borderColor: 'rgba(245, 158, 11, 0.35)' };
    case 'hard':
      return { color: '#f87171', background: 'rgba(239, 68, 68, 0.12)', borderColor: 'rgba(239, 68, 68, 0.35)' };
    default:
      return { color: 'var(--text-secondary)', background: 'var(--surface-2)', borderColor: 'var(--border)' };
  }
}

export default function ResultDashboard() {
  const {
    currentPaper,
    resultAnalytics,
    xpEarned,
    wrongQuestions,
    setView,
    resetPaper,
  } = usePracticeStore();
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(
    new Set()
  );
  const [showAllWrong, setShowAllWrong] = useState(false);
  const [dataRecorded, setDataRecorded] = useState(false);

  useEffect(() => {
    if (!resultAnalytics || dataRecorded) return;

    const recordData = async () => {
      try {
        if (currentPaper) {
          await recordPracticePerformance(currentPaper.subject, resultAnalytics.correct_count, resultAnalytics.total_questions);

          if (resultAnalytics.topic_wise) {
            const correctTopics: string[] = [];
            const incorrectTopics: string[] = [];
            Object.entries(resultAnalytics.topic_wise).forEach(([topic, data]) => {
              if (data.accuracy >= 75) correctTopics.push(topic);
              else if (data.accuracy < 50) incorrectTopics.push(topic);
            });
            if (correctTopics.length > 0) await updateStrongAreas(currentPaper.subject, correctTopics);
            if (incorrectTopics.length > 0) await updateWeakAreas(currentPaper.subject, currentPaper.chapter, incorrectTopics);
          }
        }

        if (wrongQuestions && wrongQuestions.length > 0) {
          for (const wq of wrongQuestions) {
            await recordWrongQuestion(wq.question_text, wq.correct_answer, wq.topic || '', wq.subject);
          }
        }

        if (xpEarned && xpEarned > 0) {
          addXP(xpEarned);
        }

        setDataRecorded(true);
      } catch (err) {
        console.error('Failed to record practice performance:', err);
      }
    };

    recordData();
  }, [resultAnalytics, wrongQuestions, xpEarned, currentPaper, dataRecorded]);

  if (!resultAnalytics) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertTriangle className="w-12 h-12" style={{ color: '#fbbf24' }} />
        <p className="text-lg font-medium" style={{ color: 'var(--text-muted)' }}>
          No results available
        </p>
        <button
          onClick={() => setView('create')}
          className="px-4 py-2 rounded-xl transition-colors"
          style={{ background: 'var(--brand-primary)', color: '#1b0e03' }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  const analytics = resultAnalytics;
  const scoreColors = getScoreColor(analytics.percentage);
  const circumference = 2 * Math.PI * 54;
  const dashOffset =
    circumference - (analytics.percentage / 100) * circumference;

  const toggleQuestion = (index: number) => {
    setExpandedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const displayedWrong = showAllWrong
    ? wrongQuestions
    : wrongQuestions?.slice(0, 5);
  return (
    <div className="min-h-screen pb-12" style={{ background: 'var(--surface-0)' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-30 backdrop-blur-xl border-b"
        style={{ background: 'color-mix(in srgb, var(--surface-0) 85%, transparent)', borderColor: 'var(--border)' }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView('create')}
              className="p-2 rounded-xl transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Practice Paper Results
              </h1>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {currentPaper ? `${currentPaper.subject} — ${currentPaper.chapter}` : 'Practice Session'}
              </p>
            </div>
          </div>
          <span
            className="px-3 py-1.5 rounded-full text-sm font-semibold border"
            style={getRatingStyle(analytics.overall_rating)}
          >
            {analytics.overall_rating}
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 space-y-6">
        {/* Score Circle + Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Score Circle Card */}
          <div
            className="lg:col-span-1 rounded-2xl border p-6 flex flex-col items-center justify-center"
            style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
          >
            <div className="relative w-36 h-36 mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="var(--surface-3)"
                  strokeWidth="10"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke={scoreColors.stroke}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold" style={{ color: scoreColors.text }}>
                  {analytics.percentage.toFixed(1)}%
                </span>
                <span className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Score</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {analytics.score}/{analytics.total_questions}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Total Marks</p>
            </div>
            {xpEarned && xpEarned > 0 && (
              <div
                className="mt-4 px-4 py-2 rounded-xl border"
                style={{ background: 'rgba(235, 170, 45, 0.12)', borderColor: 'rgba(235, 170, 45, 0.35)' }}
              >
                <p className="text-sm font-semibold" style={{ color: 'var(--brand-primary)' }}>
                  +{xpEarned} XP Earned
                </p>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div
              className="rounded-2xl border p-4 flex flex-col items-center justify-center text-center"
              style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2" style={{ background: 'rgba(235, 170, 45, 0.15)' }}>
                <Trophy className="w-5 h-5" style={{ color: 'var(--brand-primary)' }} />
              </div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {analytics.score}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Score</p>
            </div>

            <div
              className="rounded-2xl border p-4 flex flex-col items-center justify-center text-center"
              style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
                <Target className="w-5 h-5" style={{ color: '#34d399' }} />
              </div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {analytics.accuracy.toFixed(1)}%
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Accuracy</p>
            </div>

            <div
              className="rounded-2xl border p-4 flex flex-col items-center justify-center text-center"
              style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2" style={{ background: 'rgba(59, 130, 246, 0.15)' }}>
                <Clock className="w-5 h-5" style={{ color: '#60a5fa' }} />
              </div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {formatTime(analytics.time_taken_sec)}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Time Taken</p>
            </div>

            <div
              className="rounded-2xl border p-4 flex flex-col items-center justify-center text-center"
              style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2" style={{ background: 'rgba(168, 85, 247, 0.15)' }}>
                <BarChart3 className="w-5 h-5" style={{ color: '#c084fc' }} />
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="flex items-center gap-1 font-semibold" style={{ color: '#34d399' }}>
                  <CheckCircle2 className="w-3.5 h-3.5" />{' '}
                  {analytics.correct_count}
                </span>
                <span className="flex items-center gap-1 font-semibold" style={{ color: '#f87171' }}>
                  <XCircle className="w-3.5 h-3.5" />{' '}
                  {analytics.incorrect_count}
                </span>
                <span className="flex items-center gap-1 font-semibold" style={{ color: 'var(--text-muted)' }}>
                  {analytics.skipped_count}
                </span>
              </div>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Questions</p>
            </div>
          </div>
        </div>

        {/* Topic-Wise Performance */}
        {analytics.topic_wise &&
          Object.keys(analytics.topic_wise).length > 0 && (
            <div className="rounded-2xl border p-6" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5" style={{ color: 'var(--brand-primary)' }} />
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  Topic-Wise Performance
                </h2>
              </div>
              <div className="space-y-4">
                {Object.entries(analytics.topic_wise)
                  .sort(([, a], [, b]) => b.accuracy - a.accuracy)
                  .map(([topic, data]) => (
                    <div key={topic} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium truncate pr-4" style={{ color: 'var(--text-secondary)' }}>
                          {topic}
                        </span>
                        <div className="flex items-center gap-3 text-sm">
                          <span style={{ color: 'var(--text-muted)' }}>
                            {data.correct}/{data.total}
                          </span>
                          <span
                            className="font-semibold min-w-[3rem] text-right"
                            style={{
                              color:
                                data.accuracy >= 75
                                  ? '#34d399'
                                  : data.accuracy >= 50
                                    ? '#fbbf24'
                                    : '#f87171',
                            }}
                          >
                            {data.accuracy.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: `${data.accuracy}%`,
                            background:
                              data.accuracy >= 75
                                ? 'linear-gradient(90deg, #059669, #34d399)'
                                : data.accuracy >= 50
                                  ? 'linear-gradient(90deg, #d97706, #fbbf24)'
                                  : 'linear-gradient(90deg, #dc2626, #f87171)',
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

        {/* Type-Wise & Difficulty-Wise */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Question Type Accuracy */}
          {analytics.type_wise &&
            Object.keys(analytics.type_wise).length > 0 && (
              <div className="rounded-2xl border p-6" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5" style={{ color: '#c084fc' }} />
                  <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                    Question Type Accuracy
                  </h2>
                </div>
                <div className="space-y-3">
                  {Object.entries(analytics.type_wise).map(([type, data]) => (
                    <div
                      key={type}
                      className="flex items-center justify-between p-3 rounded-xl border"
                      style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}
                    >
                      <div>
                        <p className="text-sm font-medium capitalize" style={{ color: 'var(--text-secondary)' }}>
                          {type.replace(/_/g, ' ')}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {data.correct}/{data.total} correct
                        </p>
                      </div>
                      <span
                        className="text-sm font-bold"
                        style={{
                          color:
                            data.accuracy >= 75
                              ? '#34d399'
                              : data.accuracy >= 50
                                ? '#fbbf24'
                                : '#f87171',
                        }}
                      >
                        {data.accuracy.toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Difficulty-Wise Breakdown */}
          {analytics.difficulty_wise &&
            Object.keys(analytics.difficulty_wise).length > 0 && (
              <div className="rounded-2xl border p-6" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5" style={{ color: '#60a5fa' }} />
                  <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                    Difficulty Breakdown
                  </h2>
                </div>
                <div className="space-y-3">
                  {Object.entries(analytics.difficulty_wise).map(
                    ([diff, data]) => (
                      <div
                        key={diff}
                        className="flex items-center justify-between p-3 rounded-xl border"
                        style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="px-2.5 py-0.5 rounded-lg text-xs font-semibold border capitalize"
                            style={getDifficultyStyle(diff)}
                          >
                            {diff}
                          </span>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {data.correct}/{data.total}
                          </p>
                        </div>
                        <span
                          className="text-sm font-bold"
                          style={{
                            color:
                              data.accuracy >= 75
                                ? '#34d399'
                                : data.accuracy >= 50
                                  ? '#fbbf24'
                                  : '#f87171',
                          }}
                        >
                          {data.accuracy.toFixed(0)}%
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
        </div>

        {/* Strengths, Weaknesses, Improvement Areas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Strengths */}
          {analytics.strengths && analytics.strengths.length > 0 && (
            <div className="rounded-2xl border p-6" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5" style={{ color: '#34d399' }} />
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Strengths</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {analytics.strengths.map((s, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium border"
                    style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)' }}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Weaknesses */}
          {analytics.weaknesses && analytics.weaknesses.length > 0 && (
            <div className="rounded-2xl border p-6" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5" style={{ color: '#f87171' }} />
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  Weaknesses
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {analytics.weaknesses.map((w, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium border"
                    style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    {w}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Improvement Areas */}
          {analytics.improvement_areas &&
            analytics.improvement_areas.length > 0 && (
              <div className="rounded-2xl border p-6" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5" style={{ color: '#fbbf24' }} />
                  <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                    Improvement Areas
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analytics.improvement_areas.map((area, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium border"
                      style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.3)' }}
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* Recommended Revision */}
        {analytics.recommended_revision &&
          analytics.recommended_revision.length > 0 && (
            <div className="rounded-2xl border p-6" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5" style={{ color: 'var(--brand-primary)' }} />
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  Recommended Revision
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {analytics.recommended_revision.map((topic, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border"
                    style={{ background: 'rgba(235, 170, 45, 0.1)', color: 'var(--brand-primary)', borderColor: 'rgba(235, 170, 45, 0.3)' }}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

        {/* Wrong Questions Section */}
        {wrongQuestions && wrongQuestions.length > 0 && (
          <div className="rounded-2xl border p-6" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5" style={{ color: '#f87171' }} />
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  Wrong Answers Review
                </h2>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#f87171' }}
                >
                  {wrongQuestions.length}
                </span>
              </div>
              {wrongQuestions.length > 5 && (
                <button
                  onClick={() => setShowAllWrong(!showAllWrong)}
                  className="flex items-center gap-1 text-sm font-medium transition-colors"
                  style={{ color: 'var(--brand-primary)' }}
                >
                  {showAllWrong ? (
                    <>
                      Show Less <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      View All <ChevronDown className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="space-y-3">
              {displayedWrong?.map((wq, i) => {
                const isExpanded = expandedQuestions.has(i);
                return (
                  <div
                    key={wq.id || i}
                    className="rounded-xl border transition-all duration-200"
                    style={
                      isExpanded
                        ? { background: 'rgba(239, 68, 68, 0.06)', borderColor: 'rgba(239, 68, 68, 0.3)' }
                        : { background: 'var(--surface-2)', borderColor: 'var(--border)' }
                    }
                  >
                    <button
                      onClick={() => toggleQuestion(i)}
                      className="w-full px-4 py-3 flex items-start gap-3 text-left"
                    >
                      <span
                        className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold mt-0.5"
                        style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}
                      >
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                          {wq.question_text}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5 text-xs">
                          {wq.topic && (
                            <span
                              className="px-2 py-0.5 rounded-md font-medium"
                              style={{ background: 'var(--surface-3)', color: 'var(--text-secondary)' }}
                            >
                              {wq.topic}
                            </span>
                          )}
                          {wq.difficulty && (
                            <span
                              className="px-2 py-0.5 rounded-md font-medium border"
                              style={getDifficultyStyle(wq.difficulty)}
                            >
                              {wq.difficulty}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-2">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                        ) : (
                          <ChevronDown className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-3" style={{ borderTop: '1px solid var(--border)' }}>
                        {/* Student Answer */}
                        <div className="pt-3">
                          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                            Your Answer
                          </p>
                          <div className="flex items-start gap-2 p-3 rounded-xl border" style={{ background: 'rgba(239, 68, 68, 0.08)', borderColor: 'rgba(239, 68, 68, 0.25)' }}>
                            <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#f87171' }} />
                            <p className="text-sm" style={{ color: '#f87171' }}>
                              {wq.selected_answer || 'Not attempted'}
                            </p>
                          </div>
                        </div>

                        {/* Correct Answer */}
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                            Correct Answer
                          </p>
                          <div className="flex items-start gap-2 p-3 rounded-xl border" style={{ background: 'rgba(16, 185, 129, 0.08)', borderColor: 'rgba(16, 185, 129, 0.25)' }}>
                            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#34d399' }} />
                            <p className="text-sm" style={{ color: '#34d399' }}>
                              {wq.correct_answer}
                            </p>
                          </div>
                        </div>

                        {/* Explanation */}
                        {currentPaper?.questions?.[wq.question_index]?.explanation && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                              Explanation
                            </p>
                            <div className="flex items-start gap-2 p-3 rounded-xl border" style={{ background: 'rgba(59, 130, 246, 0.08)', borderColor: 'rgba(59, 130, 246, 0.25)' }}>
                              <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#60a5fa' }} />
                              <p className="text-sm" style={{ color: '#60a5fa' }}>
                                {currentPaper.questions[wq.question_index].explanation}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Revision Tip */}
                        {currentPaper?.questions?.[wq.question_index]?.revisionTip && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                              Revision Tip
                            </p>
                            <div className="flex items-start gap-2 p-3 rounded-xl border" style={{ background: 'rgba(245, 158, 11, 0.08)', borderColor: 'rgba(245, 158, 11, 0.25)' }}>
                              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#fbbf24' }} />
                              <p className="text-sm" style={{ color: '#fbbf24' }}>
                                {currentPaper.questions[wq.question_index].revisionTip}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 pb-8">
          <button
            onClick={() => {
              resetPaper();
              setView('create');
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(90deg, var(--brand-primary), var(--brand-secondary))',
              color: '#1b0e03',
              boxShadow: '0 8px 24px rgba(235, 170, 45, 0.25)',
            }}
          >
            <RotateCcw className="w-5 h-5" />
            Practice Again
          </button>
          <button
            onClick={() => setView('create')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
            }}
          >
            <Download className="w-5 h-5" />
            New Paper
          </button>
          <button
            onClick={() => window.location.href = '/quizzes'}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
            style={{
              background: 'rgba(235, 170, 45, 0.12)',
              border: '1px solid rgba(235, 170, 45, 0.35)',
              color: 'var(--brand-primary)',
            }}
          >
            Try Chapter Quizzes
          </button>
          <button
            onClick={() => setView('create')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
            }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
