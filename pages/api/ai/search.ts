import type { NextApiRequest, NextApiResponse } from 'next';
import { aiSmartSearch } from '@/lib/groq';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { query } = req.body;
  if (!query?.trim()) return res.status(400).json({ results: [] });
  try {
    const results = await aiSmartSearch(query);
    return res.status(200).json({ results });
  } catch {
    return res.status(500).json({ results: [] });
  }
}
