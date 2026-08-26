import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const userId = req.query.userId as string;
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  try {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .select('id, subject, chapter, chapter_slug, difficulty, total_questions, correct_count, percentage, time_taken_seconds, status, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    return res.status(200).json({ history: data || [] });
  } catch (err) {
    console.error('Quiz history error:', err);
    return res.status(500).json({ error: 'Failed to fetch quiz history' });
  }
}
