import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/lib/supabase';
import { computeQuizAnalytics, computeInsights } from '@/lib/quiz/analytics';
import {
  QuizAttempt, QuizQuestion, QuizAnalyticsSummary, QuizInsights,
  QUESTION_TYPE_LABELS, DIFFICULTY_CONFIG,
} from '@/types/quiz';
import {
  CheckCircle, XCircle, Clock, Target, Trophy, BarChart3, Brain,
  BookOpen, AlertTriangle, Lightbulb, Star, TrendingUp, RotateCcw,
  Home, ChevronDown, ChevronUp,
} from 'lucide-react';

export default function QuizResultsPage() {
  const router = useRouter();
  const { id } = router.query;

  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedQ, setExpandedQ] = useState<Record<string, boolean>>({});
  const [showWrongOnly, setShowWrongOnly] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const cached = typeof window !== 'undefined' ? sessionStorage.getItem('sn_quiz_results_' + id) : null;
        if (cached) {
          const p = JSON.parse(cached);
          setAttempt(p.attempt as QuizAttempt);
          setQuestions((p.questions || []) as QuizQuestion[]);
          setLoading(false);
          return;
        }
        const { data, error: aErr } = await supabase
          .from('quiz_attempts').select('*').eq('id', id).single();
        if (aErr) throw aErr;
        setAttempt({
          id: data.id,
          userId: data.user_id,
          classNum: data.class_num,
          subject: data.subject,
          book: data.book,
          bookSlug: data.book_slug,
          chapter: data.chapter,
          chapterSlug: data.chapter_slug,
          difficulty: data.difficulty,
          totalQuestions: data.total_questions,
          correctCount: data.correct_count,
          incorrectCount: data.incorrect_count,
          skippedCount: data.skipped_count,
          score: data.score,
          percentage: data.percentage,
          timeTakenSeconds: data.time_taken_seconds,
          timeLimitSeconds: data.time_limit_seconds,
          questionTypes: data.question_types || [],
          status: data.status,
          startedAt: data.started_at,
          completedAt: data.completed_at,
          createdAt: data.created_at,
          questions: [],
        } as QuizAttempt);
        const { data: qData } = await supabase
          .from('quiz_questions').select('*').eq('attempt_id', id).order('question_index');
        setQuestions(((qData || []) as any[]).map((q: any) => ({
          id: q.id,
          index: q.question_index,
          type: q.question_type,
          text: q.question_text,
          options: q.options,
          correctAnswer: q.correct_answer,
          studentAnswer: q.student_answer,
          isCorrect: q.is_correct,
          isSkipped: q.is_skipped,
          explanation: q.explanation || '',
          relatedConcept: q.related_concept || '',
          revisionTip: q.revision_tip || '',
          difficulty: q.difficulty || 'moderate',
          topic: q.topic || '',
          marks: q.marks || 1,
        })) as QuizQuestion[]);
      } catch {
        setError('Failed to load quiz results.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const analytics: QuizAnalyticsSummary | null = useMemo(
    () => (attempt ? computeQuizAnalytics(attempt) : null), [attempt]);
  const insights: QuizInsights | null = useMemo(
    () => (attempt ? computeInsights({ ...attempt, questions }) : null), [attempt, questions]);

  const toggle = (qid: string) => setExpandedQ(p => ({ ...p, [qid]: !p[qid] }));
  const wrongQuestions = useMemo(() => questions.filter(q => q.isCorrect === false), [questions]);
  const displayQuestions = showWrongOnly ? wrongQuestions : questions;

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p style={{ color: 'var(--text-muted)' }}>Loading results...</p>
        </div>
      </Layout>
    );
  }

  if (error || !attempt || !analytics) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <AlertTriangle className="h-12 w-12 text-red-500" />
          <p style={{ color: 'var(--text-secondary)' }}>{error || 'Results not found.'}</p>
          <Link href="/quizzes" className="underline" style={{ color: 'var(--brand-primary)' }}>Back to Quizzes</Link>
        </div>
      </Layout>
    );
  }

  const ringColor =
    analytics.percentage >= 90 ? '#10b981' :
    analytics.percentage >= 75 ? '#3b82f6' :
    analytics.percentage >= 60 ? '#f59e0b' :
    analytics.percentage >= 40 ? '#f97316' : '#ef4444';

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <section className="flex flex-col items-center gap-3">
          <div className="relative flex items-center justify-center w-40 h-40 rounded-full border-[6px]"
            style={{ borderColor: ringColor, background: 'var(--surface-0)' }}>
            <span className="text-4xl font-bold" style={{ color: ringColor }}>{analytics.percentage}%</span>
            <Trophy className="absolute -top-3 -right-1 h-7 w-7 text-yellow-500" />
          </div>
          <h1 className="text-2xl font-semibold" style={{ color: ringColor }}>{analytics.performanceRating}</h1>
          <p className="text-sm capitalize" style={{ color: 'var(--text-muted)' }}>
            {attempt.subject}{attempt.chapter ? ` — ${attempt.chapter}` : ''} &middot; {analytics.totalQuestions} Questions
          </p>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Correct', value: analytics.correctCount, color: '#10b981', bg: 'rgba(16,185,129,0.1)', icon: CheckCircle },
            { label: 'Incorrect', value: analytics.incorrectCount, color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: XCircle },
            { label: 'Skipped', value: analytics.skippedCount, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: Target },
            { label: 'Time Taken', value: analytics.timeTaken, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', icon: Clock },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-4 flex flex-col gap-2 border"
              style={{ background: s.bg, borderColor: s.color + '33' }}>
              <s.icon className="h-5 w-5" style={{ color: s.color }} />
              <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{s.value}</span>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{s.label}</span>
            </div>
          ))}
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <BarChart3 className="h-5 w-5" /> Question Analysis
            </h2>
            {wrongQuestions.length > 0 && (
              <button onClick={() => setShowWrongOnly(p => !p)}
                className="text-sm px-3 py-1.5 rounded-lg font-medium transition-colors"
                style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)' }}>
                {showWrongOnly ? 'Show All' : `Review Wrong (${wrongQuestions.length})`}
              </button>
            )}
          </div>
          <div className="space-y-3">
            {displayQuestions.map(q => {
              const expanded = !!expandedQ[q.id];
              const dc = DIFFICULTY_CONFIG[q.difficulty];
              return (
                <div key={q.id} className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)', background: 'var(--surface-0)' }}>
                  <button onClick={() => toggle(q.id)}
                    className="w-full flex items-start gap-3 p-4 text-left transition-colors"
                    style={{ color: 'inherit' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-1)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    {q.isCorrect === true ? (
                      <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                    ) : q.isSkipped ? (
                      <Target className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Q{q.index}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold"
                          style={{ background: 'var(--surface-2)', color: 'var(--text-secondary)' }}>
                          {QUESTION_TYPE_LABELS[q.type]}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${dc.color} ${dc.bg} ${dc.border}`}>
                          {dc.emoji} {dc.label}
                        </span>
                      </div>
                      <p className="text-sm line-clamp-2" style={{ color: 'var(--text-primary)' }}>{q.text}</p>
                    </div>
                    {expanded ? <ChevronUp className="h-4 w-4 shrink-0 mt-1" style={{ color: 'var(--text-muted)' }} /> : <ChevronDown className="h-4 w-4 shrink-0 mt-1" style={{ color: 'var(--text-muted)' }} />}
                  </button>
                  {expanded && (
                    <div className="px-4 pb-4 space-y-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                      {q.isCorrect === false && (
                        <div className="rounded-lg p-3" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                          <p className="text-xs font-semibold mb-1" style={{ color: '#ef4444' }}>Your Answer</p>
                          <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{q.studentAnswer ?? 'No answer'}</p>
                        </div>
                      )}
                      <div className="rounded-lg p-3" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                        <p className="text-xs font-semibold mb-1" style={{ color: '#10b981' }}>Correct Answer</p>
                        <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{q.correctAnswer}</p>
                      </div>
                      <div className="rounded-lg p-3" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                        <p className="text-xs font-semibold mb-1 flex items-center gap-1" style={{ color: '#3b82f6' }}>
                          <Lightbulb className="h-3 w-3" /> Explanation
                        </p>
                        <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{q.explanation}</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="rounded-lg p-3" style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
                          <p className="text-xs font-semibold mb-1" style={{ color: '#a855f7' }}>Related Concept</p>
                          <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{q.relatedConcept}</p>
                        </div>
                        <div className="rounded-lg p-3" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                          <p className="text-xs font-semibold mb-1 flex items-center gap-1" style={{ color: '#f59e0b' }}>
                            <BookOpen className="h-3 w-3" /> Revision Tip
                          </p>
                          <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{q.revisionTip}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {insights && (
          <section className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Brain className="h-5 w-5" /> Learning Insights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl p-4 border" style={{ background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.2)' }}>
                <h3 className="text-sm font-semibold flex items-center gap-1 mb-2" style={{ color: '#10b981' }}>
                  <Star className="h-4 w-4" /> Strengths
                </h3>
                {insights.strengths.length > 0 ? (
                  <ul className="space-y-1">
                    {insights.strengths.map(s => (
                      <li key={s} className="text-sm flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> {s}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No strong areas yet. Keep practicing!</p>
                )}
              </div>
              <div className="rounded-xl p-4 border" style={{ background: 'rgba(244,63,94,0.08)', borderColor: 'rgba(244,63,94,0.2)' }}>
                <h3 className="text-sm font-semibold flex items-center gap-1 mb-2" style={{ color: '#f43f5e' }}>
                  <AlertTriangle className="h-4 w-4" /> Weaknesses
                </h3>
                {insights.weaknesses.length > 0 ? (
                  <ul className="space-y-1">
                    {insights.weaknesses.map(w => (
                      <li key={w} className="text-sm flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                        <XCircle className="h-3.5 w-3.5 text-rose-500" /> {w}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No weak areas identified!</p>
                )}
              </div>
            </div>

            <div className="rounded-xl border p-4" style={{ borderColor: 'var(--border)', background: 'var(--surface-0)' }}>
              <h3 className="text-sm font-semibold flex items-center gap-1 mb-3" style={{ color: 'var(--text-secondary)' }}>
                <TrendingUp className="h-4 w-4" /> Topic-wise Accuracy
              </h3>
              <div className="space-y-2">
                {insights.topicAccuracy.map(t => (
                  <div key={t.topic} className="flex items-center gap-3">
                    <span className="text-sm w-48 truncate" style={{ color: 'var(--text-secondary)' }}>{t.topic}</span>
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
                      <div className={`h-full rounded-full ${t.accuracy >= 70 ? 'bg-emerald-500' : t.accuracy >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${t.accuracy}%` }} />
                    </div>
                    <span className="text-xs font-medium w-10 text-right" style={{ color: 'var(--text-muted)' }}>{t.accuracy}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border p-4" style={{ borderColor: 'var(--border)', background: 'var(--surface-0)' }}>
              <h3 className="text-sm font-semibold flex items-center gap-1 mb-3" style={{ color: 'var(--text-secondary)' }}>
                <BarChart3 className="h-4 w-4" /> Difficulty-wise Performance
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {insights.difficultyPerformance.map(d => {
                  const dc = DIFFICULTY_CONFIG[d.difficulty as keyof typeof DIFFICULTY_CONFIG];
                  return (
                    <div key={d.difficulty} className={`rounded-lg p-3 text-center ${dc?.bg ?? ''}`}
                      style={dc ? undefined : { background: 'var(--surface-2)' }}>
                      <p className={`text-xs font-semibold mb-1 ${dc?.color ?? ''}`}>{dc?.emoji} {dc?.label ?? d.difficulty}</p>
                      <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{d.accuracy}%</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{d.attempted} questions</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {insights.recommendedRevision.length > 0 && (
              <div className="rounded-xl p-4 border" style={{ background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.2)' }}>
                <h3 className="text-sm font-semibold flex items-center gap-1 mb-2" style={{ color: '#f59e0b' }}>
                  <BookOpen className="h-4 w-4" /> Recommended Revision Chapters
                </h3>
                <ul className="space-y-1">
                  {insights.recommendedRevision.map(r => (
                    <li key={r} className="text-sm flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                      <Lightbulb className="h-3.5 w-3.5 text-amber-500" /> {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        <section className="flex flex-wrap gap-3 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <Link href={`/quizzes/${id}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-colors"
            style={{ background: 'var(--brand-primary)', color: '#fff' }}>
            <RotateCcw className="h-4 w-4" /> Try Again
          </Link>
          <Link href="/quizzes/analytics"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-colors"
            style={{ background: '#a855f7', color: '#fff' }}>
            <BarChart3 className="h-4 w-4" /> View Analytics
          </Link>
          <Link href="/quizzes"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-colors"
            style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
            <Home className="h-4 w-4" /> Back to Quizzes
          </Link>
        </section>
      </div>
    </Layout>
  );
}
