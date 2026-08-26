import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const userId = req.query.userId as string;
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  try {
    const { data: attempts, error } = await supabase
      .from('quiz_attempts')
      .select('subject, chapter, chapter_slug, difficulty, correct_count, incorrect_count, skipped_count, total_questions, percentage, time_taken_seconds, created_at')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!attempts?.length) return res.status(200).json({ subjects: [], trends: [], overall: null });

    const subjectMap: Record<string, { total: number; correct: number; sumPct: number; bestPct: number; count: number }> = {};
    for (const a of attempts) {
      if (!subjectMap[a.subject]) subjectMap[a.subject] = { total: 0, correct: 0, sumPct: 0, bestPct: 0, count: 0 };
      const s = subjectMap[a.subject];
      s.total += a.total_questions;
      s.correct += a.correct_count;
      s.sumPct += a.percentage;
      s.bestPct = Math.max(s.bestPct, a.percentage);
      s.count++;
    }

    const subjects = Object.entries(subjectMap).map(([subject, s]) => ({
      subject,
      totalAttempted: s.total,
      totalCorrect: s.correct,
      avgPercentage: Math.round(s.sumPct / s.count),
      bestPercentage: s.bestPct,
      quizzesTaken: s.count,
    }));

    const trends = attempts.slice(0, 30).reverse().map((a) => ({
      date: a.created_at,
      percentage: a.percentage,
      questionsAttempted: a.total_questions,
    }));

    const totalQ = attempts.reduce((s, a) => s + a.total_questions, 0);
    const totalC = attempts.reduce((s, a) => s + a.correct_count, 0);
    const overall = {
      totalQuizzes: attempts.length,
      totalQuestions: totalQ,
      totalCorrect: totalC,
      avgPercentage: totalQ > 0 ? Math.round((totalC / totalQ) * 100) : 0,
      totalTime: attempts.reduce((s, a) => s + a.time_taken_seconds, 0),
    };

    return res.status(200).json({ subjects, trends, overall });
  } catch (err) {
    console.error('Quiz analytics error:', err);
    return res.status(500).json({ error: 'Failed to fetch analytics' });
  }
}
