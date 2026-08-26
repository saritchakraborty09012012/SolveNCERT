import type { NextApiRequest, NextApiResponse } from 'next';
import { gradeAnswer } from '@/lib/mock-tests/generator';
import type { MockQuestion, AnswerRecord, TestConfig } from '@/lib/mock-tests/types';

interface SubmitBody {
  questions: MockQuestion[];
  answers: AnswerRecord[];
  config: TestConfig;
  timeSpent: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { questions, answers, config, timeSpent } = req.body as SubmitBody;

  if (!questions || !answers || !config) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Grade each answer
    const gradedAnswers = await Promise.all(
      answers.map(async (answer) => {
        const question = questions.find(q => q.id === answer.questionId);
        if (!question) return { ...answer, isCorrect: false, score: 0 };

        if (answer.isSkipped) {
          return { ...answer, isCorrect: false, score: 0 };
        }

        const result = await gradeAnswer(question, String(answer.selectedAnswer));
        return {
          ...answer,
          isCorrect: result.score > 0,
          score: result.score,
        };
      })
    );

    return res.status(200).json({ gradedAnswers });
  } catch (err) {
    console.error('Mock test grading error:', err);
    return res.status(500).json({ error: 'Failed to grade mock test' });
  }
}
