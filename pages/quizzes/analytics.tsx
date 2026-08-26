import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import { getPerformanceColor } from '@/lib/quiz/analytics';
import { BarChart3, TrendingUp, Target, Brain, Trophy, BookOpen, ArrowRight, ChevronRight, Star } from 'lucide-react';

interface SubjectStat { subject: string; quizzesTaken: number; totalQuestions: number; correctCount: number; avgPercentage: number; bestPercentage: number; }
interface TrendPoint { percentage: number; created_at: string; }
interface DiffStat { difficulty: string; accuracy: number; attempted: number; }
interface TopicStat { topic: string; accuracy: number; attempted: number; }
interface OverallStat { totalQuizzes: number; overallAccuracy: number; avgScore: number; totalQuestions: number; }

const SUBJECT_ICONS: Record<string, string> = { Mathematics: '📐', Science: '🔬', English: '📖', 'Social Science': '🌍' };
const SUBJECT_GRADIENTS: Record<string, string> = {
  Mathematics: 'from-blue-500 to-indigo-600', Science: 'from-emerald-500 to-teal-600',
  English: 'from-amber-500 to-orange-600', 'Social Science': 'from-rose-500 to-pink-600',
};

export default function QuizAnalyticsPage() {
  const { user, isGuest } = useAuthStore();
  const [subjects, setSubjects] = useState<SubjectStat[]>([]);
  const [trends, setTrends] = useState<TrendPoint[]>([]);
  const [overall, setOverall] = useState<OverallStat | null>(null);
  const [diffPerf, setDiffPerf] = useState<DiffStat[]>([]);
  const [weakTopics, setWeakTopics] = useState<TopicStat[]>([]);
  const [strongTopics, setStrongTopics] = useState<TopicStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || isGuest) { setLoading(false); return; }
    (async () => {
      try {
        const { data: attempts } = await supabase
          .from('quiz_attempts')
          .select('subject, chapter, difficulty, correct_count, total_questions, percentage, status, created_at')
          .eq('user_id', user.id).eq('status', 'completed').order('created_at', { ascending: false });
        if (!attempts?.length) { setLoading(false); return; }

        const subMap: Record<string, SubjectStat> = {};
        const diffMap: Record<string, { c: number; t: number }> = {};
        const topicMap: Record<string, { c: number; t: number }> = {};
        let totalQ = 0, totalC = 0;

        for (const a of attempts) {
          totalQ += a.total_questions; totalC += a.correct_count;
          if (!subMap[a.subject]) subMap[a.subject] = { subject: a.subject, quizzesTaken: 0, totalQuestions: 0, correctCount: 0, avgPercentage: 0, bestPercentage: 0 };
          const s = subMap[a.subject]; s.quizzesTaken++; s.totalQuestions += a.total_questions; s.correctCount += a.correct_count;
          s.avgPercentage += a.percentage; s.bestPercentage = Math.max(s.bestPercentage, a.percentage);
          const d = a.difficulty || 'moderate';
          if (!diffMap[d]) diffMap[d] = { c: 0, t: 0 }; diffMap[d].t += a.total_questions; diffMap[d].c += a.correct_count;
          if (a.chapter) { if (!topicMap[a.chapter]) topicMap[a.chapter] = { c: 0, t: 0 }; topicMap[a.chapter].t += a.total_questions; topicMap[a.chapter].c += a.correct_count; }
        }

        setSubjects(Object.values(subMap).map(s => ({ ...s, avgPercentage: Math.round(s.avgPercentage / s.quizzesTaken) })));
        setTrends(attempts.slice(0, 10).reverse().map(a => ({ percentage: a.percentage, created_at: a.created_at })));
        setOverall({ totalQuizzes: attempts.length, overallAccuracy: totalQ > 0 ? Math.round((totalC / totalQ) * 100) : 0, avgScore: Math.round(attempts.reduce((s, a) => s + a.percentage, 0) / attempts.length), totalQuestions: totalQ });
        setDiffPerf(Object.entries(diffMap).map(([difficulty, v]) => ({ difficulty, accuracy: v.t > 0 ? Math.round((v.c / v.t) * 100) : 0, attempted: v.t })));
        const topics = Object.entries(topicMap).map(([topic, v]) => ({ topic, accuracy: v.t > 0 ? Math.round((v.c / v.t) * 100) : 0, attempted: v.t })).filter(t => t.attempted >= 3);
        setWeakTopics(topics.filter(t => t.accuracy < 60).sort((a, b) => a.accuracy - b.accuracy).slice(0, 5));
        setStrongTopics(topics.filter(t => t.accuracy >= 75).sort((a, b) => b.accuracy - a.accuracy).slice(0, 5));
      } catch (e) { console.error('Analytics fetch error:', e); } finally { setLoading(false); }
    })();
  }, [user?.id, isGuest]);

  if (isGuest || !user) {
    return (
      <Layout title="Quiz Analytics" canonical="/quizzes/analytics">
        <div className="max-w-screen-sm mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 mb-5">
            <BarChart3 size={28} className="text-blue-500" />
          </div>
          <h1 className="text-xl font-display font-bold text-[var(--text-primary)] mb-2">Quiz Analytics</h1>
          <p className="text-sm text-[var(--text-muted)] mb-6 max-w-xs mx-auto">
            Sign in to track your quiz performance and improvement over time.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/quizzes" className="btn-primary text-sm px-6">Take a Quiz <ChevronRight size={14} /></Link>
            <Link href="/auth/signup" className="btn-ghost text-sm px-6">Sign Up Free</Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Quiz Analytics | SolveNCERT" description="Track your quiz performance, accuracy, and improvement trends." canonical="/quizzes/analytics">
      <div className="max-w-screen-lg mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[var(--text-primary)] flex items-center gap-2">
            <BarChart3 size={24} className="text-blue-500" /> Quiz Analytics
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Track your performance across all quizzes</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : !overall ? (
          <div className="card p-10 text-center">
            <Trophy size={40} className="mx-auto text-amber-300 mb-3" />
            <p className="font-semibold text-[var(--text-primary)] mb-1">No quizzes taken yet</p>
            <p className="text-sm text-[var(--text-muted)] mb-5">Take your first quiz to start tracking your progress.</p>
            <Link href="/quizzes" className="btn-primary text-sm px-6 inline-flex items-center gap-1.5">Start a Quiz <ArrowRight size={14} /></Link>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[
                { label: 'Quizzes Taken', value: overall.totalQuizzes, icon: BookOpen, color: 'text-blue-500' },
                { label: 'Overall Accuracy', value: `${overall.overallAccuracy}%`, icon: Target, color: 'text-emerald-500' },
                { label: 'Average Score', value: `${overall.avgScore}%`, icon: TrendingUp, color: 'text-violet-500' },
                { label: 'Total Questions', value: overall.totalQuestions, icon: Brain, color: 'text-amber-500' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="card p-4 sm:p-5 text-center">
                  <Icon size={20} className={`${color} mx-auto mb-2`} />
                  <p className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">{value}</p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {subjects.length > 0 && (
              <section>
                <h2 className="text-lg font-display font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2"><BookOpen size={18} /> Subject-wise Performance</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {subjects.map(s => (
                    <div key={s.subject} className="card p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{SUBJECT_ICONS[s.subject] || '📚'}</span>
                          <span className="font-semibold text-sm text-[var(--text-primary)]">{s.subject}</span>
                        </div>
                        <span className={`text-sm font-bold ${getPerformanceColor(s.avgPercentage)}`}>{s.avgPercentage}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[var(--surface-2)] overflow-hidden mb-2">
                        <div className={`h-full rounded-full bg-gradient-to-r ${SUBJECT_GRADIENTS[s.subject] || 'from-gray-400 to-gray-500'} transition-all duration-700`} style={{ width: `${Math.min(s.avgPercentage, 100)}%` }} />
                      </div>
                      <div className="flex justify-between text-[10px] text-[var(--text-muted)]">
                        <span>{s.quizzesTaken} quizzes</span><span>Best: {s.bestPercentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {trends.length > 1 && (
              <section>
                <h2 className="text-lg font-display font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2"><TrendingUp size={18} /> Performance Trend</h2>
                <div className="card p-4 sm:p-5">
                  <div className="flex items-end gap-1.5 sm:gap-2 h-36 sm:h-44">
                    {trends.map((t, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[9px] font-medium text-[var(--text-muted)]">{t.percentage}%</span>
                        <div className="w-full rounded-t-md bg-gradient-to-t from-blue-500 to-blue-400 dark:from-blue-600 dark:to-blue-500 transition-all duration-500 min-h-[4px]"
                          style={{ height: `${Math.max(t.percentage, 5)}%` }}
                          title={`${t.percentage}% — ${new Date(t.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`} />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-2 px-1"><span>Oldest</span><span>Latest</span></div>
                </div>
              </section>
            )}

            {diffPerf.length > 0 && (
              <section>
                <h2 className="text-lg font-display font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2"><Target size={18} /> Difficulty-wise Performance</h2>
                <div className="grid grid-cols-3 gap-3">
                  {diffPerf.map(d => {
                    const colorCls = d.difficulty === 'easy'
                      ? 'text-emerald-500 bg-emerald-500'
                      : d.difficulty === 'hard'
                        ? 'text-rose-500 bg-rose-500'
                        : 'text-amber-500 bg-amber-500';
                    return (
                      <div key={d.difficulty} className="card p-4 text-center">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--text-muted)] mb-2">{d.difficulty}</p>
                        <p className={`text-2xl font-bold ${colorCls.split(' ')[0]}`}>{d.accuracy}%</p>
                        <div className="w-full h-1.5 rounded-full bg-[var(--surface-2)] mt-2 overflow-hidden">
                          <div className={`h-full rounded-full ${colorCls.split(' ')[1]}`} style={{ width: `${d.accuracy}%` }} />
                        </div>
                        <p className="text-[10px] text-[var(--text-muted)] mt-1.5">{d.attempted} questions</p>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {weakTopics.length > 0 && (
                <section>
                  <h2 className="text-lg font-display font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2"><Brain size={18} className="text-rose-500" /> Needs Improvement</h2>
                  <div className="space-y-2">
                    {weakTopics.map(t => (
                      <div key={t.topic} className="card p-3 flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--text-primary)] truncate">{t.topic}</p>
                          <p className="text-[10px] text-[var(--text-muted)]">{t.attempted} questions</p>
                        </div>
                        <span className="text-sm font-bold text-rose-500 ml-2">{t.accuracy}%</span>
                      </div>
                    ))}
                  </div>
                  <div className="card p-3 mt-2 border border-amber-200 dark:border-amber-800">
                    <p className="text-xs text-[var(--text-secondary)]"><span className="font-semibold">Tip:</span> Revise NCERT examples and solved problems in weak areas.</p>
                  </div>
                </section>
              )}
              {strongTopics.length > 0 && (
                <section>
                  <h2 className="text-lg font-display font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2"><Star size={18} className="text-emerald-500" /> Strongest Topics</h2>
                  <div className="space-y-2">
                    {strongTopics.map(t => (
                      <div key={t.topic} className="card p-3 flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--text-primary)] truncate">{t.topic}</p>
                          <p className="text-[10px] text-[var(--text-muted)]">{t.attempted} questions</p>
                        </div>
                        <span className="text-sm font-bold text-emerald-500 ml-2">{t.accuracy}%</span>
                      </div>
                    ))}
                  </div>
                  <div className="card p-3 mt-2 border border-emerald-200 dark:border-emerald-800">
                    <p className="text-xs text-[var(--text-secondary)]"><span className="font-semibold">Great job!</span> Keep the momentum with mixed quizzes.</p>
                  </div>
                </section>
              )}
            </div>

            <div className="text-center pt-4">
              <Link href="/quizzes" className="btn-primary text-sm px-6 inline-flex items-center gap-1.5">Take Another Quiz <ArrowRight size={14} /></Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
