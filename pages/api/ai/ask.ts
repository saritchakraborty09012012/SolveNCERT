import type { NextApiRequest, NextApiResponse } from 'next';
import { askAI, type AIMode } from '@/lib/groq';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { query, mode = 'doubt', context, fileContent } = req.body;
  if (!query?.trim() && !fileContent) return res.status(400).json({ error: 'Query required' });
  try {
    const answer = await askAI(query || '', mode as AIMode, context, fileContent);
    return res.status(200).json({ answer });
  } catch (err) {
    console.error('AI error:', err);
    return res.status(500).json({ error: 'AI temporarily unavailable.' });
  }
}
