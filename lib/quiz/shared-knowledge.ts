import { supabase } from '@/lib/supabase';
import type { QuizDifficulty, WrongQuestion, LearningProfileData } from '@/types/quiz';

const MASTERY_THRESHOLD = 3;

export async function getLearningProfile(
  userId: string
): Promise<LearningProfileData | null> {
  try {
    const { data, error } = await supabase
      .from('learning_profile')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      userId: data.user_id,
      completedChapters: data.completed_chapters ?? [],
      completedTopics: data.completed_topics ?? [],
      weakAreas: data.weak_areas ?? [],
      strongAreas: data.strong_areas ?? [],
      preferredDifficulty: data.preferred_difficulty ?? 'moderate',
      preferredLanguage: data.preferred_language ?? 'en',
      learningPace: data.learning_pace ?? 50,
      totalQuizzesTaken: data.total_quizzes_taken ?? 0,
      totalQuestionsAttempted: data.total_questions_attempted ?? 0,
      overallAccuracy: data.overall_accuracy ?? 0,
      streakDays: data.streak_days ?? 0,
      lastQuizDate: data.last_quiz_date ?? undefined,
      xpEarned: data.xp_earned ?? 0,
      level: data.level ?? 1,
      badges: data.badges ?? [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch {
    return null;
  }
}

export async function upsertLearningProfile(
  userId: string,
  updates: Partial<LearningProfileData>
): Promise<LearningProfileData | null> {
  try {
    const dbUpdates: Record<string, unknown> = { user_id: userId };

    if (updates.completedChapters !== undefined)
      dbUpdates.completed_chapters = updates.completedChapters;
    if (updates.completedTopics !== undefined)
      dbUpdates.completed_topics = updates.completedTopics;
    if (updates.weakAreas !== undefined)
      dbUpdates.weak_areas = updates.weakAreas;
    if (updates.strongAreas !== undefined)
      dbUpdates.strong_areas = updates.strongAreas;
    if (updates.preferredDifficulty !== undefined)
      dbUpdates.preferred_difficulty = updates.preferredDifficulty;
    if (updates.preferredLanguage !== undefined)
      dbUpdates.preferred_language = updates.preferredLanguage;
    if (updates.learningPace !== undefined)
      dbUpdates.learning_pace = updates.learningPace;
    if (updates.totalQuizzesTaken !== undefined)
      dbUpdates.total_quizzes_taken = updates.totalQuizzesTaken;
    if (updates.totalQuestionsAttempted !== undefined)
      dbUpdates.total_questions_attempted = updates.totalQuestionsAttempted;
    if (updates.overallAccuracy !== undefined)
      dbUpdates.overall_accuracy = updates.overallAccuracy;
    if (updates.streakDays !== undefined)
      dbUpdates.streak_days = updates.streakDays;
    if (updates.lastQuizDate !== undefined)
      dbUpdates.last_quiz_date = updates.lastQuizDate;
    if (updates.xpEarned !== undefined) dbUpdates.xp_earned = updates.xpEarned;
    if (updates.level !== undefined) dbUpdates.level = updates.level;
    if (updates.badges !== undefined) dbUpdates.badges = updates.badges;

    dbUpdates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('learning_profile')
      .upsert(dbUpdates, { onConflict: 'user_id' })
      .select()
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      userId: data.user_id,
      completedChapters: data.completed_chapters ?? [],
      completedTopics: data.completed_topics ?? [],
      weakAreas: data.weak_areas ?? [],
      strongAreas: data.strong_areas ?? [],
      preferredDifficulty: data.preferred_difficulty ?? 'moderate',
      preferredLanguage: data.preferred_language ?? 'en',
      learningPace: data.learning_pace ?? 50,
      totalQuizzesTaken: data.total_quizzes_taken ?? 0,
      totalQuestionsAttempted: data.total_questions_attempted ?? 0,
      overallAccuracy: data.overall_accuracy ?? 0,
      streakDays: data.streak_days ?? 0,
      lastQuizDate: data.last_quiz_date ?? undefined,
      xpEarned: data.xp_earned ?? 0,
      level: data.level ?? 1,
      badges: data.badges ?? [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch {
    return null;
  }
}

export async function updateAfterQuiz(
  userId: string,
  subject: string,
  chapter: string,
  chapterSlug: string,
  correct: number,
  total: number,
  difficulty: QuizDifficulty,
  weakTopics: string[],
  strongTopics: string[]
): Promise<LearningProfileData | null> {
  try {
    const profile = await getLearningProfile(userId);
    const now = new Date().toISOString();
    const accuracy = total > 0 ? (correct / total) * 100 : 0;

    const completedChapters = profile?.completedChapters ?? [];
    const chapterKey = `${subject}::${chapterSlug}`;
    const updatedChapters =
      accuracy >= 60 && !completedChapters.includes(chapterKey)
        ? [...completedChapters, chapterKey]
        : completedChapters;

    const existingWeak = profile?.weakAreas ?? [];
    const existingStrong = profile?.strongAreas ?? [];
    const updatedWeak = [
      ...new Set([...existingWeak, ...weakTopics].filter(Boolean)),
    ];
    const updatedStrong = [
      ...new Set([...existingStrong, ...strongTopics].filter(Boolean)),
    ];

    const totalAttempted =
      (profile?.totalQuestionsAttempted ?? 0) + total;
    const previousCorrect =
      ((profile?.overallAccuracy ?? 0) / 100) *
      (profile?.totalQuestionsAttempted ?? 0);
    const newOverallAccuracy =
      totalAttempted > 0
        ? ((previousCorrect + correct) / totalAttempted) * 100
        : 0;

    const today = now.split('T')[0];
    const lastDate = profile?.lastQuizDate?.split('T')[0];
    let streakDays = profile?.streakDays ?? 0;
    if (!lastDate) {
      streakDays = 1;
    } else if (lastDate !== today) {
      const diff =
        (new Date(today).getTime() - new Date(lastDate).getTime()) /
        (1000 * 60 * 60 * 24);
      streakDays = diff <= 1 ? streakDays + 1 : 1;
    }

    const diffBonus = difficulty === 'hard' ? 5 : difficulty === 'moderate' ? 3 : 1;
    const xpGain = Math.round(10 * (accuracy / 100) + diffBonus);
    const newXP = (profile?.xpEarned ?? 0) + xpGain;
    const newLevel = Math.floor(newXP / 100) + 1;

    return upsertLearningProfile(userId, {
      completedChapters: updatedChapters,
      weakAreas: updatedWeak,
      strongAreas: updatedStrong,
      totalQuizzesTaken: (profile?.totalQuizzesTaken ?? 0) + 1,
      totalQuestionsAttempted: totalAttempted,
      overallAccuracy: newOverallAccuracy,
      streakDays,
      lastQuizDate: now,
      xpEarned: newXP,
      level: newLevel,
      preferredDifficulty:
        newOverallAccuracy >= 80
          ? 'hard'
          : newOverallAccuracy >= 50
          ? 'moderate'
          : 'easy',
    });
  } catch {
    return null;
  }
}

export async function getWrongQuestions(
  userId: string,
  subject?: string
): Promise<WrongQuestion[]> {
  try {
    let query = supabase
      .from('wrong_questions')
      .select('*')
      .eq('user_id', userId)
      .eq('mastered', false)
      .order('created_at', { ascending: false });

    if (subject) {
      query = query.eq('subject', subject);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((row) => ({
      id: row.id,
      userId: row.user_id,
      questionText: row.question_text,
      questionType: row.question_type,
      subject: row.subject,
      chapter: row.chapter ?? undefined,
      chapterSlug: row.chapter_slug ?? undefined,
      correctAnswer: row.correct_answer,
      studentAnswer: row.student_answer ?? undefined,
      explanation: row.explanation,
      relatedConcept: row.related_concept,
      timesSeen: row.times_seen,
      timesCorrect: row.times_correct,
      mastered: row.mastered,
      lastSeenAt: row.last_seen_at,
      createdAt: row.created_at,
    }));
  } catch {
    return [];
  }
}

export async function addWrongQuestion(
  userId: string,
  questionData: {
    questionText: string;
    questionType: string;
    subject: string;
    chapter?: string;
    chapterSlug?: string;
    correctAnswer: string;
    studentAnswer?: string;
    explanation: string;
    relatedConcept: string;
  }
): Promise<WrongQuestion | null> {
  try {
    const { data: existing } = await supabase
      .from('wrong_questions')
      .select('id, times_seen')
      .eq('user_id', userId)
      .eq('question_text', questionData.questionText)
      .eq('subject', questionData.subject)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from('wrong_questions')
        .update({
          times_seen: existing.times_seen + 1,
          times_correct: 0,
          mastered: false,
          last_seen_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error || !data) return null;

      return {
        id: data.id,
        userId: data.user_id,
        questionText: data.question_text,
        questionType: data.question_type,
        subject: data.subject,
        chapter: data.chapter ?? undefined,
        chapterSlug: data.chapter_slug ?? undefined,
        correctAnswer: data.correct_answer,
        studentAnswer: data.student_answer ?? undefined,
        explanation: data.explanation,
        relatedConcept: data.related_concept,
        timesSeen: data.times_seen,
        timesCorrect: data.times_correct,
        mastered: data.mastered,
        lastSeenAt: data.last_seen_at,
        createdAt: data.created_at,
      };
    }

    const insertData = {
      user_id: userId,
      question_text: questionData.questionText,
      question_type: questionData.questionType,
      subject: questionData.subject,
      chapter: questionData.chapter ?? null,
      chapter_slug: questionData.chapterSlug ?? null,
      correct_answer: questionData.correctAnswer,
      student_answer: questionData.studentAnswer ?? null,
      explanation: questionData.explanation,
      related_concept: questionData.relatedConcept,
      times_seen: 1,
      times_correct: 0,
      mastered: false,
      last_seen_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('wrong_questions')
      .insert(insertData)
      .select()
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      userId: data.user_id,
      questionText: data.question_text,
      questionType: data.question_type,
      subject: data.subject,
      chapter: data.chapter ?? undefined,
      chapterSlug: data.chapter_slug ?? undefined,
      correctAnswer: data.correct_answer,
      studentAnswer: data.student_answer ?? undefined,
      explanation: data.explanation,
      relatedConcept: data.related_concept,
      timesSeen: data.times_seen,
      timesCorrect: data.times_correct,
      mastered: data.mastered,
      lastSeenAt: data.last_seen_at,
      createdAt: data.created_at,
    };
  } catch {
    return null;
  }
}

export async function markWrongQuestionCorrect(
  userId: string,
  questionText: string,
  subject: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('wrong_questions')
      .select('id, times_correct')
      .eq('user_id', userId)
      .eq('question_text', questionText)
      .eq('subject', subject)
      .single();

    if (error || !data) return false;

    const newTimesCorrect = data.times_correct + 1;
    const mastered = newTimesCorrect >= MASTERY_THRESHOLD;

    const { error: updateError } = await supabase
      .from('wrong_questions')
      .update({
        times_correct: newTimesCorrect,
        mastered,
        last_seen_at: new Date().toISOString(),
      })
      .eq('id', data.id);

    return !updateError;
  } catch {
    return false;
  }
}

export async function getSharedLearningData(userId: string) {
  try {
    const [profile, wrongQuestions] = await Promise.all([
      getLearningProfile(userId),
      getWrongQuestions(userId),
    ]);

    const subjectBreakdown: Record<
      string,
      { total: number; mastered: number; accuracy: number }
    > = {};

    for (const wq of wrongQuestions) {
      if (!subjectBreakdown[wq.subject]) {
        subjectBreakdown[wq.subject] = { total: 0, mastered: 0, accuracy: 0 };
      }
      subjectBreakdown[wq.subject].total++;
      if (wq.mastered) subjectBreakdown[wq.subject].mastered++;
    }

    for (const subject of Object.keys(subjectBreakdown)) {
      const { total, mastered } = subjectBreakdown[subject];
      subjectBreakdown[subject].accuracy =
        total > 0 ? (mastered / total) * 100 : 0;
    }

    const unmasteredCount = wrongQuestions.filter((w) => !w.mastered).length;

    return {
      profile,
      wrongQuestions,
      subjectBreakdown,
      unmasteredCount,
      topWeakTopics: profile?.weakAreas.slice(0, 10) ?? [],
      topStrongTopics: profile?.strongAreas.slice(0, 10) ?? [],
      recommendedDifficulty: profile?.preferredDifficulty ?? 'moderate',
      learningPace: profile?.learningPace ?? 50,
      xpEarned: profile?.xpEarned ?? 0,
      level: profile?.level ?? 1,
    };
  } catch {
    return {
      profile: null,
      wrongQuestions: [] as WrongQuestion[],
      subjectBreakdown: {},
      unmasteredCount: 0,
      topWeakTopics: [] as string[],
      topStrongTopics: [] as string[],
      recommendedDifficulty: 'moderate' as QuizDifficulty,
      learningPace: 50,
      xpEarned: 0,
      level: 1,
    };
  }
}

export async function getQuizRecommendations(userId: string) {
  try {
    const [profile, wrongQuestions] = await Promise.all([
      getLearningProfile(userId),
      getWrongQuestions(userId),
    ]);

    const weakTopics = profile?.weakAreas ?? [];
    const highPriorityWrong = wrongQuestions
      .filter((w) => !w.mastered && w.timesSeen >= 2)
      .sort((a, b) => b.timesSeen - a.timesSeen)
      .slice(0, 10);

    const subjectWeakness: Record<string, number> = {};
    for (const wq of wrongQuestions.filter((w) => !w.mastered)) {
      subjectWeakness[wq.subject] = (subjectWeakness[wq.subject] ?? 0) + 1;
    }

    const weakestSubject = Object.entries(subjectWeakness).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0];

    const accuracy = profile?.overallAccuracy ?? 0;
    const difficulty: QuizDifficulty =
      accuracy >= 80 ? 'hard' : accuracy >= 50 ? 'moderate' : 'easy';

    return {
      suggestedDifficulty: difficulty,
      suggestedSubjects: weakestSubject ? [weakestSubject] : [],
      weakTopicsToFocus: weakTopics.slice(0, 5),
      highPriorityWrongQuestions: highPriorityWrong,
      recommendedQuestionCount:
        accuracy < 50 ? 10 : accuracy < 75 ? 15 : 20,
      reasons: [
        ...(weakestSubject
          ? [`Focus on ${weakestSubject} — most unmastered questions here.`]
          : []),
        ...(weakTopics.length > 0
          ? [`Review weak topics: ${weakTopics.slice(0, 3).join(', ')}.`]
          : []),
        ...(accuracy < 50
          ? ['Your accuracy is low — try easier quizzes to build confidence.']
          : accuracy >= 80
          ? ['Great accuracy — challenge yourself with harder questions!']
          : []),
      ],
    };
  } catch {
    return {
      suggestedDifficulty: 'moderate' as QuizDifficulty,
      suggestedSubjects: [] as string[],
      weakTopicsToFocus: [] as string[],
      highPriorityWrongQuestions: [] as WrongQuestion[],
      recommendedQuestionCount: 10,
      reasons: ['Unable to load recommendations. Try again later.'],
    };
  }
}
