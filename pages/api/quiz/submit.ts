import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { addWrongQuestion, markWrongQuestionCorrect, updateAfterQuiz } from '@/lib/quiz/shared-knowledge';
import type { QuizDifficulty } from '@/types/quiz';

interface AnswerEntry { questionId: string; answer: string; timeSpent: number; }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { attemptId, answers, timeTaken } = req.body as { attemptId: string; answers: AnswerEntry[]; timeTaken: number };
  if (!attemptId || !Array.isArray(answers)) return res.status(400).json({ error: 'Missing attemptId or answers' });

  try {
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    const { data: attempt } = await supabase.from('quiz_attempts').select('*').eq('id', attemptId).single();
    if (!attempt) return res.status(404).json({ error: 'Attempt not found' });

    const { data: questions } = await supabase.from('quiz_questions').select('*').eq('attempt_id', attemptId);

    let correct = 0, incorrect = 0, skipped = 0;
    const weakTopics: string[] = [], strongTopics: string[] = [];

    for (const q of questions || []) {
      const entry = answers.find((a) => a.questionId === q.id);
      const studentAnswer = entry?.answer || null;
      const isSkipped = !studentAnswer;
      const isCorrect = studentAnswer === q.correct_answer;

      if (isSkipped) skipped++;
      else if (isCorrect) { correct++; strongTopics.push(q.topic); }
      else { incorrect++; weakTopics.push(q.topic); }

      await supabase.from('quiz_questions')
        .update({ student_answer: studentAnswer, is_correct: isCorrect, is_skipped: isSkipped })
        .eq('id', q.id);

      if (userId && !isCorrect && !isSkipped) {
        await addWrongQuestion(userId, {
          questionText: q.question_text, questionType: q.question_type,
          subject: attempt.subject, chapter: attempt.chapter, chapterSlug: attempt.chapter_slug,
          correctAnswer: q.correct_answer, studentAnswer, explanation: q.explanation, relatedConcept: q.related_concept,
        });
      }
      if (userId && isCorrect) await markWrongQuestionCorrect(userId, q.question_text, attempt.subject);
    }

    const total = correct + incorrect + skipped;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    await supabase.from('quiz_attempts').update({
      correct_count: correct, incorrect_count: incorrect, skipped_count: skipped,
      score: correct, percentage, time_taken_seconds: timeTaken,
      status: 'completed', completed_at: new Date().toISOString(),
    }).eq('id', attemptId);

    if (userId) {
      await updateAfterQuiz(userId, attempt.subject, attempt.chapter || '', attempt.chapter_slug || '',
        correct, total, attempt.difficulty as QuizDifficulty, [...new Set(weakTopics)], [...new Set(strongTopics)]);
    }

    return res.status(200).json({ attemptId, correct, incorrect, skipped, percentage, timeTaken });
  } catch (err) {
    console.error('Quiz submit error:', err);
    return res.status(500).json({ error: 'Failed to submit quiz' });
  }
}
