import type { NextApiRequest, NextApiResponse } from 'next';
import { generateMockTest } from '@/lib/mock-tests/generator';
import { getWrongQuestionsForRevision } from '@/lib/mock-tests/storage';
import type { TestConfig } from '@/lib/mock-tests/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
  }

  const { config, wrongQuestionIds } = req.body as { config: TestConfig; wrongQuestionIds?: string[] };

  if (!config || !config.subject || !config.questionCount) {
    return res.status(400).json({ error: 'Invalid config' });
  }

  try {
    const wrongTexts = getWrongQuestionsForRevision(config.subject, 10).map(wq => wq.question);

    const mockTest = await generateMockTest(config, wrongTexts);

    return res.status(200).json({ questions: mockTest.questions, totalQuestions: mockTest.totalQuestions });
  } catch (err: any) {
    console.error('Mock test generation error:', err?.message || err);
    return res.status(500).json({ error: 'Failed to generate mock test' });
  }
}
