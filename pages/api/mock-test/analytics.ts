import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    // Get performance summary
    const { data: summary } = await supabase
      .rpc('get_user_performance_summary', { p_user_id: userId });

    // Get recent results
    const { data: recentResults } = await supabase
      .from('mock_test_results')
      .select('id, percentage, accuracy, score, total_marks, submitted_at, performance_rating')
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false })
      .limit(10);

    // Get wrong questions count
    const { count: wrongCount } = await supabase
      .from('wrong_questions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('mastered', false);

    // Get mastered questions count
    const { count: masteredCount } = await supabase
      .from('wrong_questions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('mastered', true);

    return res.status(200).json({
      summary: summary?.[0] || null,
      recentResults: recentResults || [],
      wrongQuestionsCount: wrongCount || 0,
      masteredQuestionsCount: masteredCount || 0,
    });
  } catch (err) {
    console.error('Analytics error:', err);
    return res.status(500).json({ error: 'Failed to fetch analytics' });
  }
}
