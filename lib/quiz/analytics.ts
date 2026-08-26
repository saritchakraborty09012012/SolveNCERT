import {
  QuizAttempt,
  QuizQuestion,
  QuizAnalyticsSummary,
  QuizInsights,
  QuestionType,
  QuizDifficulty,
} from '@/types/quiz';

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export function getPerformanceColor(percentage: number): string {
  if (percentage >= 90) return 'text-emerald-600 dark:text-emerald-400';
  if (percentage >= 75) return 'text-blue-600 dark:text-blue-400';
  if (percentage >= 60) return 'text-amber-600 dark:text-amber-400';
  if (percentage >= 40) return 'text-orange-600 dark:text-orange-400';
  return 'text-rose-600 dark:text-rose-400';
}

export function getPerformanceRating(percentage: number): string {
  if (percentage >= 90) return 'Excellent';
  if (percentage >= 75) return 'Very Good';
  if (percentage >= 60) return 'Good';
  if (percentage >= 40) return 'Needs Improvement';
  return 'Keep Trying';
}

export function computeQuizAnalytics(attempt: QuizAttempt): QuizAnalyticsSummary {
  const { score, percentage, correctCount, incorrectCount, skippedCount, totalQuestions, timeTakenSeconds } = attempt;
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  return {
    score,
    percentage,
    accuracy,
    timeTaken: formatTime(timeTakenSeconds),
    correctCount,
    incorrectCount,
    skippedCount,
    totalQuestions,
    performanceRating: getPerformanceRating(percentage),
    performanceColor: getPerformanceColor(percentage),
  };
}

function computeTopicAccuracy(questions: QuizQuestion[]) {
  const map = new Map<string, { correct: number; total: number }>();
  for (const q of Array.isArray(questions) ? questions : []) {
    const topic = q.topic || 'General';
    const entry = map.get(topic) ?? { correct: 0, total: 0 };
    entry.total++;
    if (q.isCorrect) entry.correct++;
    map.set(topic, entry);
  }
  return Array.from(map.entries()).map(([topic, { correct, total }]) => ({
    topic,
    accuracy: Math.round((correct / total) * 100),
    attempted: total,
  }));
}

function computeTypeAccuracy(questions: QuizQuestion[]) {
  const map = new Map<string, { correct: number; total: number }>();
  for (const q of Array.isArray(questions) ? questions : []) {
    const entry = map.get(q.type) ?? { correct: 0, total: 0 };
    entry.total++;
    if (q.isCorrect) entry.correct++;
    map.set(q.type, entry);
  }
  return Array.from(map.entries()).map(([type, { correct, total }]) => ({
    type,
    accuracy: Math.round((correct / total) * 100),
    attempted: total,
  }));
}

function computeDifficultyPerformance(questions: QuizQuestion[]) {
  const map = new Map<string, { correct: number; total: number }>();
  for (const q of Array.isArray(questions) ? questions : []) {
    const entry = map.get(q.difficulty) ?? { correct: 0, total: 0 };
    entry.total++;
    if (q.isCorrect) entry.correct++;
    map.set(q.difficulty, entry);
  }
  return Array.from(map.entries()).map(([difficulty, { correct, total }]) => ({
    difficulty,
    accuracy: Math.round((correct / total) * 100),
    attempted: total,
  }));
}

export function computeInsights(attempt: QuizAttempt): QuizInsights {
  const questions = Array.isArray(attempt?.questions) ? attempt.questions : [];
  const topicAcc = computeTopicAccuracy(questions);
  const typeAcc = computeTypeAccuracy(questions);
  const diffPerf = computeDifficultyPerformance(questions);

  const strengths = topicAcc.filter((t) => t.accuracy >= 70).map((t) => t.topic);
  const weaknesses = topicAcc.filter((t) => t.accuracy < 50).map((t) => t.topic);
  const recommendedRevision = topicAcc
    .filter((t) => t.accuracy < 50)
    .sort((a, b) => a.accuracy - b.accuracy)
    .map((t) => t.topic);

  const incorrectTopics = new Map<string, number>();
  for (const q of questions) {
    if (q.isCorrect === false) {
      const topic = q.topic || 'General';
      incorrectTopics.set(topic, (incorrectTopics.get(topic) ?? 0) + 1);
    }
  }
  const frequentMistakes = Array.from(incorrectTopics.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([topic]) => topic);

  return {
    strengths,
    weaknesses,
    topicAccuracy: topicAcc,
    typeAccuracy: typeAcc,
    difficultyPerformance: diffPerf,
    recommendedRevision,
    frequentMistakes,
  };
}
