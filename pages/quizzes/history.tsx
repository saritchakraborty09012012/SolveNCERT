import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import { formatTime, getPerformanceColor } from '@/lib/quiz/analytics';
import { Clock, ChevronRight, Filter, BarChart3, Trophy, Zap } from 'lucide-react';
import { DIFFICULTY_CONFIG } from '@/types/quiz';
import type { QuizDifficulty, QuizStatus } from '@/types/quiz';

interface HistoryEntry {
  id: string;
  subject: string;
  chapter: string | null;
  difficulty: QuizDifficulty;
  total_questions: number;
  correct_count: number;
  percentage: number;
  time_taken_seconds: number;
  status: QuizStatus;
  created_at: string;
}

const SUBJECTS = ['All', 'Mathematics', 'Science', 'English', 'Social Science'];
const DIFFICULTIES: (QuizDifficulty | 'all')[] = ['all', 'easy', 'moderate', 'hard'];
const STATUSES: (QuizStatus | 'all')[] = ['all', 'completed', 'abandoned'];

export default function QuizHistoryPage() {
  const { user, isGuest } = useAuthStore();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [diffFilter, setDiffFilter] = useState<QuizDifficulty | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<QuizStatus | 'all'>('all');

  useEffect(() => {
    if (!user || isGuest) { setLoading(false); return; }

    const fetchHistory = async () => {
      const { data } = await supabase
        .from('quiz_attempts')
        .select('id, subject, chapter, difficulty, total_questions, correct_count, percentage, time_taken_seconds, status, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      setHistory((data as HistoryEntry[]) || []);
      setLoading(false);
    };

    fetchHistory();
  }, [user?.id, isGuest]);

  const filtered = useMemo(() => {
    return history.filter(h => {
      if (subjectFilter !== 'All' && h.subject !== subjectFilter) return false;
      if (diffFilter !== 'all' && h.difficulty !== diffFilter) return false;
      if (statusFilter !== 'all' && h.status !== statusFilter) return false;
      return true;
    });
  }, [history, subjectFilter, diffFilter, statusFilter]);

  const completedCount = history.filter(h => h.status === 'completed').length;
  const avgScore = completedCount > 0
    ? Math.round(history.filter(h => h.status === 'completed').reduce((s, h) => s + h.percentage, 0) / completedCount)
    : 0;

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return days === 1 ? 'yesterday' : `${days}d ago`;
  };

  if (isGuest || !user) {
    return (
      <Layout title="Quiz History" canonical="/quizzes/history">
        <div className="max-w-screen-sm mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 mb-5">
            <Clock size={28} className="text-blue-500" />
          </div>
          <h1 className="text-xl font-display font-bold text-[var(--text-primary)] mb-2">Quiz History</h1>
          <p className="text-sm text-[var(--text-muted)] mb-6 max-w-xs mx-auto">
            Sign in to save your quiz attempts and track improvement.
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
    <Layout title="Quiz History | SolveNCERT" description="Review your past quiz attempts and performance." canonical="/quizzes/history">
      <div className="max-w-screen-md mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Clock size={24} className="text-blue-500" /> Quiz History
          </h1>
          <div className="flex gap-4 mt-2 text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1"><Trophy size={12} /> {completedCount} completed</span>
            <span className="flex items-center gap-1"><BarChart3 size={12} /> Avg {avgScore}%</span>
            <span className="flex items-center gap-1"><Zap size={12} /> {history.length} total</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-5 p-2 bg-[var(--surface-2)] rounded-xl">
          <Filter size={14} className="text-[var(--text-muted)]" />
          <select
            value={subjectFilter}
            onChange={e => setSubjectFilter(e.target.value)}
            className="text-xs bg-[var(--surface-0)] border border-[var(--border)] rounded-lg px-2 py-1.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {SUBJECTS.map(s => <option key={s} value={s}>{s === 'All' ? 'All Subjects' : s}</option>)}
          </select>
          <select
            value={diffFilter}
            onChange={e => setDiffFilter(e.target.value as any)}
            className="text-xs bg-[var(--surface-0)] border border-[var(--border)] rounded-lg px-2 py-1.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Difficulty</option>
            <option value="easy">Easy</option>
            <option value="moderate">Moderate</option>
            <option value="hard">Hard</option>
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="text-xs bg-[var(--surface-0)] border border-[var(--border)] rounded-lg px-2 py-1.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="abandoned">Abandoned</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-10 text-center">
            <Clock size={40} className="mx-auto text-blue-300 mb-3" />
            <p className="font-semibold text-[var(--text-primary)] mb-1">
              {history.length === 0 ? 'No quizzes taken yet' : 'No matching quizzes'}
            </p>
            <p className="text-sm text-[var(--text-muted)] mb-5">
              {history.length === 0
                ? 'Complete your first quiz to see your history here.'
                : 'Try adjusting your filters.'}
            </p>
            {history.length === 0 && (
              <Link href="/quizzes" className="btn-primary text-sm px-6 inline-flex items-center gap-1.5">
                Start a Quiz <ChevronRight size={14} />
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtered.map(h => {
              const dc = DIFFICULTY_CONFIG[h.difficulty] || DIFFICULTY_CONFIG.moderate;
              const isCompleted = h.status === 'completed';
              return (
                <Link key={h.id} href={`/quizzes/${h.id}/results`}
                  className="card p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 hover:shadow-soft-sm hover:border-blue-200 dark:hover:border-blue-800 transition-all group">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-[var(--text-primary)]">{h.subject}</span>
                      {h.chapter && (
                        <span className="text-[10px] text-[var(--text-muted)] truncate max-w-[160px]">{h.chapter}</span>
                      )}
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${dc.color} ${dc.bg} border ${dc.border}`}>
                        {dc.emoji} {dc.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-[var(--text-muted)]">
                      <span>{h.correct_count}/{h.total_questions} correct</span>
                      <span>{formatTime(h.time_taken_seconds)}</span>
                      <span>{timeAgo(h.created_at)}</span>
                      {!isCompleted && <span className="text-amber-500 font-medium">Incomplete</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                    <div className="text-right">
                      <p className={`text-xl font-bold ${getPerformanceColor(h.percentage)}`}>{h.percentage}%</p>
                    </div>
                    <ChevronRight size={16} className="text-[var(--text-muted)] group-hover:text-blue-500 transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
