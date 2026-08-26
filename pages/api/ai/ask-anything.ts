import type { NextApiRequest, NextApiResponse } from 'next';
import { askAnythingAI } from '@/lib/groq';
import { retrieveSolutions } from '@/lib/solution-retrieval';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { query, history } = req.body as { query?: string; history?: { role: 'user' | 'assistant'; content: string }[] };
  if (!query?.trim()) return res.status(400).json({ error: 'Query required' });
  try {
    const solutionContext = retrieveSolutions(query);
    const answer = await askAnythingAI(query, Array.isArray(history) ? history : [], solutionContext);
    return res.status(200).json({ answer });
  } catch (err) {
    console.error('Ask Anything error:', err);
    return res.status(500).json({ error: 'AI temporarily unavailable.' });
  }
}
