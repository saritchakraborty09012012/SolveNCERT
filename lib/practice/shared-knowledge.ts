import { supabase } from '@/lib/supabase';
import type { SharedLearningData } from './types';

// ─── Get user's learning profile from DB ──────────────────────────────────────
export async function getSharedKnowledge(): Promise<SharedLearningData> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return getDefaultSharedData();

    const { data } = await supabase
      .from('practice_learning_profile')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!data) return getDefaultSharedData();

    return {
      completedChapters: [],
      weakAreas: data.weak_areas || [],
      strongAreas: data.strong_areas || [],
      frequentlyMistakes: data.frequent_mistakes || [],
      wrongQuestionHistory: [],
      revisionHistory: [],
      preferredDifficulty: data.preferred_difficulty || 'moderate',
      learningPace: 'moderate',
      practicePerformance: data.practice_performance || [],
      quizPerformance: [],
      aiTutorProgress: { topicsCovered: 0, totalXP: 0, level: 1 },
      recommendedRevisionTopics: data.recommended_revision || [],
    };
  } catch {
    return getDefaultSharedData();
  }
}

function getDefaultSharedData(): SharedLearningData {
  return {
    completedChapters: [],
    weakAreas: [],
    strongAreas: [],
    frequentlyMistakes: [],
    wrongQuestionHistory: [],
    revisionHistory: [],
    preferredDifficulty: 'moderate',
    learningPace: 'moderate',
    practicePerformance: [],
    quizPerformance: [],
    aiTutorProgress: { topicsCovered: 0, totalXP: 0, level: 1 },
    recommendedRevisionTopics: [],
  };
}

// ─── Record practice performance in DB ────────────────────────────────────────
export async function recordPracticePerformance(
  subject: string,
  score: number,
  totalQuestions: number
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.rpc('upsert_practice_performance', {
    p_user_id: user.id,
    p_subject: subject,
    p_score: score,
    p_total: totalQuestions,
  });
}

// ─── Update weak areas in DB ──────────────────────────────────────────────────
export async function updateWeakAreas(
  subject: string,
  chapter: string,
  incorrectTopics: string[]
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  for (const topic of incorrectTopics) {
    await supabase.rpc('upsert_practice_weak_areas', {
      p_user_id: user.id,
      p_topic: topic,
      p_subject: subject,
      p_chapter: chapter,
    });
  }
}

// ─── Update strong areas in DB ────────────────────────────────────────────────
export async function updateStrongAreas(
  subject: string,
  correctTopics: string[]
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  for (const topic of correctTopics) {
    await supabase.rpc('upsert_practice_strong_areas', {
      p_user_id: user.id,
      p_topic: topic,
      p_subject: subject,
    });
  }
}

// ─── Record wrong question in DB ──────────────────────────────────────────────
export async function recordWrongQuestion(
  question: string,
  correctAnswer: string,
  topic: string,
  subject: string
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Check if this question already exists for this user
  const { data: existing } = await supabase
    .from('practice_wrong_questions')
    .select('id, times_seen')
    .eq('user_id', user.id)
    .eq('question_text', question)
    .single();

  if (existing) {
    // Increment seen count
    await supabase.rpc('increment_wrong_question', {
      p_question_id: existing.id,
      p_was_correct: false,
    });
  }
  // If new, it was already inserted by the submit API
}

// ─── Get recommended difficulty from DB ───────────────────────────────────────
export async function getRecommendedDifficulty(): Promise<'easy' | 'moderate' | 'hard'> {
  const knowledge = await getSharedKnowledge();
  if (knowledge.practicePerformance.length === 0) return 'moderate';
  const avgScore =
    knowledge.practicePerformance.reduce((sum, p) => sum + p.avgScore, 0) /
    knowledge.practicePerformance.length;
  if (avgScore >= 80) return 'hard';
  if (avgScore >= 50) return 'moderate';
  return 'easy';
}

// ─── Get topics for revision from DB ──────────────────────────────────────────
export async function getTopicsForRevision(): Promise<string[]> {
  const knowledge = await getSharedKnowledge();
  return knowledge.weakAreas
    .sort((a, b) => b.severity - a.severity)
    .slice(0, 10)
    .map((w) => w.topic);
}

// ─── Get unmastered wrong questions for reintroduction ────────────────────────
export async function getUnmasteredWrongQuestions(limit = 5): Promise<any[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('practice_wrong_questions')
    .select('*')
    .eq('user_id', user.id)
    .eq('mastered', false)
    .order('last_seen_at', { ascending: false })
    .limit(limit);

  return data || [];
}
