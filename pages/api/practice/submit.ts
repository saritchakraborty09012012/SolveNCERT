import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import type { PracticeQuestion, PracticePaper, PracticeAnalytics } from '@/lib/practice/types';

interface AttemptData {
  questionIndex: number;
  selectedAnswer: string | null;
  isSkipped: boolean;
  isBookmarked: boolean;
  timeSpentSec: number;
}

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'to', 'of', 'in', 'on',
  'at', 'by', 'for', 'with', 'about', 'as', 'into', 'and', 'or', 'but', 'if', 'then', 'than',
  'so', 'such', 'that', 'this', 'these', 'those', 'it', 'its', 'from', 'will', 'would', 'can',
  'could', 'should', 'shall', 'may', 'might', 'must', 'do', 'does', 'did', 'has', 'have', 'had',
  'not', 'no', 'yes', 'all', 'any', 'both', 'each', 'when', 'where', 'which', 'who', 'whom',
  'why', 'how', 'what', 'because', 'due', 'also', 'very', 'more', 'most', 'some', 'their',
]);

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractOptionLetter(text: string): string | null {
  const match = text.trim().match(/^([a-dA-D])\s*[).:\-]?\s/);
  if (match) return match[1].toLowerCase();
  const bare = text.trim().match(/^([a-dA-D])$/);
  if (bare) return bare[1].toLowerCase();
  return null;
}

function isAnswerCorrect(
  studentAnswer: string,
  correctAnswer: string,
  type: string
): boolean {
  const student = (studentAnswer || '').trim();
  const correct = (correctAnswer || '').trim();
  if (!student) return false;

  const normStudent = normalizeText(student);
  const normCorrect = normalizeText(correct);
  if (!normStudent || !normCorrect) return false;

  if (normStudent === normCorrect) return true;

  if (type === 'mcq' || type === 'assertion-reason') {
    const studentLetter = extractOptionLetter(student);
    const correctLetter = extractOptionLetter(correct);
    if (studentLetter && correctLetter) return studentLetter === correctLetter;
    if (studentLetter && !correctLetter) {
      return normCorrect.startsWith(studentLetter + ' ') || normCorrect.includes(normStudent);
    }
    return normCorrect.includes(normStudent) || normStudent.includes(normCorrect);
  }

  const studentNumbers: string[] = normStudent.match(/\d+(?:\.\d+)?/g) || [];
  const correctNumbers: string[] = normCorrect.match(/\d+(?:\.\d+)?/g) || [];
  if (studentNumbers.length > 0 && correctNumbers.length > 0) {
    const allNumbersMatch = studentNumbers.every((n) => correctNumbers.includes(n));
    if (allNumbersMatch) return true;
  }

  const correctKeywords = normCorrect
    .split(' ')
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
  if (correctKeywords.length === 0) return normStudent === normCorrect;

  const studentWords = new Set(normStudent.split(' '));
  const matched = correctKeywords.filter((kw) =>
    studentWords.has(kw) ||
    [...studentWords].some((sw) => sw.length > 3 && (sw.startsWith(kw) || kw.startsWith(sw)))
  );
  const coverage = matched.length / correctKeywords.length;
  return coverage >= 0.6;
}

function computeAnalytics(
  paper: PracticePaper,
  attempts: AttemptData[]
): PracticeAnalytics {
  let correct = 0;
  let incorrect = 0;
  let skipped = 0;
  const topicWise: Record<string, { total: number; correct: number; accuracy: number }> = {};
  const typeWise: Record<string, { total: number; correct: number; accuracy: number }> = {};
  const diffWise: Record<string, { total: number; correct: number; accuracy: number }> = {};
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const improvementAreas: string[] = [];
  const recommendedRevision: string[] = [];

  for (const q of paper.questions) {
    const attempt = attempts.find((a) => a.questionIndex === q.index);
    const isCorrect =
      !!attempt && !attempt.isSkipped && isAnswerCorrect(attempt.selectedAnswer || '', q.correctAnswer, q.type);
    const isSkipped = attempt?.isSkipped || !attempt?.selectedAnswer;

    if (isSkipped) skipped++;
    else if (isCorrect) correct++;
    else incorrect++;

    const topic = q.topic || 'General';
    const type = q.type;
    const diff = q.difficulty;

    if (!topicWise[topic]) topicWise[topic] = { total: 0, correct: 0, accuracy: 0 };
    topicWise[topic].total++;
    if (isCorrect) topicWise[topic].correct++;

    if (!typeWise[type]) typeWise[type] = { total: 0, correct: 0, accuracy: 0 };
    typeWise[type].total++;
    if (isCorrect) typeWise[type].correct++;

    if (!diffWise[diff]) diffWise[diff] = { total: 0, correct: 0, accuracy: 0 };
    diffWise[diff].total++;
    if (isCorrect) diffWise[diff].correct++;
  }

  for (const key in topicWise) {
    topicWise[key].accuracy = topicWise[key].total > 0
      ? Math.round((topicWise[key].correct / topicWise[key].total) * 100)
      : 0;
    if (topicWise[key].accuracy >= 80) strengths.push(key);
    else if (topicWise[key].accuracy < 50) { weaknesses.push(key); improvementAreas.push(key); }
  }
  for (const key in typeWise) {
    typeWise[key].accuracy = typeWise[key].total > 0
      ? Math.round((typeWise[key].correct / typeWise[key].total) * 100)
      : 0;
  }
  for (const key in diffWise) {
    diffWise[key].accuracy = diffWise[key].total > 0
      ? Math.round((diffWise[key].correct / diffWise[key].total) * 100)
      : 0;
  }

  const answered = correct + incorrect;
  const totalQ = paper.questions.length;
  const score = correct;
  const percentage = totalQ > 0 ? Math.round((score / totalQ) * 100) : 0;
  const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;

  let rating = 'Needs Improvement';
  if (percentage >= 90) rating = 'Outstanding';
  else if (percentage >= 75) rating = 'Excellent';
  else if (percentage >= 60) rating = 'Good';
  else if (percentage >= 40) rating = 'Average';

  recommendedRevision.push(...weaknesses.slice(0, 5));

  return {
    id: crypto.randomUUID(),
    paper_id: paper.id,
    user_id: paper.user_id,
    total_questions: totalQ,
    correct_count: correct,
    incorrect_count: incorrect,
    skipped_count: skipped,
    score,
    percentage,
    accuracy,
    time_taken_sec: attempts.reduce((s, a) => s + a.timeSpentSec, 0),
    overall_rating: rating,
    topic_wise: topicWise,
    type_wise: typeWise,
    difficulty_wise: diffWise,
    strengths,
    weaknesses,
    improvement_areas: improvementAreas,
    recommended_revision: recommendedRevision,
    created_at: new Date().toISOString(),
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { code: 'METHOD', message: 'Method not allowed.' } });
  }

  let body: { paper?: PracticePaper; attempts?: AttemptData[] } = {};
  try { body = req.body; } catch { /* malformed */ }

  const { paper, attempts } = body;
  if (!paper || !Array.isArray(attempts)) {
    return res.status(400).json({ error: { code: 'INVALID', message: 'Missing paper or attempts data.' } });
  }

  const analytics = computeAnalytics(paper, attempts);

  const wrongQuestions = paper.questions
    .filter((q) => {
      const attempt = attempts.find((a) => a.questionIndex === q.index);
      return (
        attempt &&
        !attempt.isSkipped &&
        !isAnswerCorrect(attempt.selectedAnswer || '', q.correctAnswer, q.type)
      );
    })
    .map((q) => {
      const attempt = attempts.find((a) => a.questionIndex === q.index);
      return {
        id: crypto.randomUUID(),
        paper_id: paper.id,
        user_id: paper.user_id,
        question_index: q.index,
        question_type: q.type,
        question_text: q.text,
        selected_answer: attempt?.selectedAnswer || null,
        correct_answer: q.correctAnswer,
        subject: paper.subject,
        chapter: paper.chapter,
        chapter_code: paper.chapter_code,
        topic: q.topic,
        difficulty: q.difficulty,
        times_seen: 1,
        times_correct: 0,
        mastered: false,
        created_at: new Date().toISOString(),
        last_seen_at: new Date().toISOString(),
      };
    });

  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  if (userId) {
    try {
      // 1. Update paper completion status
      await supabase.from('practice_papers').update({
        is_completed: true,
        completed_at: new Date().toISOString(),
        time_taken_sec: analytics.time_taken_sec,
      }).eq('id', paper.id);

      // 2. Save analytics
      await supabase.from('practice_analytics').insert(analytics);

      // 3. Save wrong questions
      if (wrongQuestions.length > 0) {
        await supabase.from('practice_wrong_questions').insert(
          wrongQuestions.map((wq) => ({ ...wq, user_id: userId }))
        );
      }

      // 4. Update learning profile — performance
      await supabase.rpc('upsert_practice_performance', {
        p_user_id: userId,
        p_subject: paper.subject,
        p_score: analytics.correct_count,
        p_total: analytics.total_questions,
      });

      // 5. Update learning profile — weak areas
      if (analytics.weaknesses.length > 0) {
        for (const topic of analytics.weaknesses) {
          await supabase.rpc('upsert_practice_weak_areas', {
            p_user_id: userId,
            p_topic: topic,
            p_subject: paper.subject,
            p_chapter: paper.chapter,
          });
        }
      }

      // 6. Update learning profile — strong areas
      if (analytics.strengths.length > 0) {
        for (const topic of analytics.strengths) {
          await supabase.rpc('upsert_practice_strong_areas', {
            p_user_id: userId,
            p_topic: topic,
            p_subject: paper.subject,
          });
        }
      }

      // 7. Ensure learning profile row exists
      const { data: profile } = await supabase
        .from('practice_learning_profile')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (!profile) {
        await supabase.from('practice_learning_profile').insert({
          user_id: userId,
          weak_areas: [],
          strong_areas: [],
          frequent_mistakes: [],
          practice_performance: [],
          recommended_revision: [],
        });
      }
    } catch (err) {
      console.error('Failed to persist practice data:', err);
    }
  }

  const xpEarned = Math.round(analytics.percentage * 0.5 + (analytics.total_questions - analytics.skipped_count) * 2);

  return res.status(200).json({ analytics, wrongQuestions, xpEarned });
}
