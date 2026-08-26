import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, userId, data } = req.body as {
    action: 'push' | 'pull' | 'merge';
    userId: string;
    data?: Record<string, unknown>;
  };

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    switch (action) {
      case 'pull': {
        const { data: row } = await supabase
          .from('shared_learning_data')
          .select('data, updated_at')
          .eq('user_id', userId)
          .single();

        return res.status(200).json({
          data: row?.data || null,
          updatedAt: row?.updated_at || null,
        });
      }

      case 'push': {
        if (!data) {
          return res.status(400).json({ error: 'data is required for push' });
        }

        const { error } = await supabase
          .from('shared_learning_data')
          .upsert(
            {
              user_id: userId,
              data,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' }
          );

        if (error) throw error;
        return res.status(200).json({ success: true });
      }

      case 'merge': {
        if (!data) {
          return res.status(400).json({ error: 'data is required for merge' });
        }

        const { data: existing } = await supabase
          .from('shared_learning_data')
          .select('data')
          .eq('user_id', userId)
          .single();

        const remote = (existing?.data as Record<string, unknown>) || {};
        const local = data;

        const unique = (arr: string[]) => [...new Set(arr)];
        const maxNum = (a: number, b: number) => Math.max(a, b);

        const merged: Record<string, unknown> = {
          ...remote,
          ...local,
          completedChapters: unique([
            ...((remote.completedChapters as string[]) || []),
            ...((local.completedChapters as string[]) || []),
          ]),
          completedTopics: unique([
            ...((remote.completedTopics as string[]) || []),
            ...((local.completedTopics as string[]) || []),
          ]),
          weakAreas: unique([
            ...((remote.weakAreas as string[]) || []),
            ...((local.weakAreas as string[]) || []),
          ]),
          strongAreas: unique([
            ...((remote.strongAreas as string[]) || []),
            ...((local.strongAreas as string[]) || []),
          ]),
          recommendedRevisionTopics: unique([
            ...((remote.recommendedRevisionTopics as string[]) || []),
            ...((local.recommendedRevisionTopics as string[]) || []),
          ]).slice(-20),
        };

        const { error } = await supabase
          .from('shared_learning_data')
          .upsert(
            {
              user_id: userId,
              data: merged,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' }
          );

        if (error) throw error;
        return res.status(200).json({ data: merged });
      }

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (err) {
    console.error('Sync error:', err);
    return res.status(500).json({ error: 'Sync failed' });
  }
}
