import {
  MockQuestion,
  TestConfig,
  AnswerRecord,
  QuestionResult,
  TopicWiseAccuracy,
  TypeWiseAccuracy,
  DifficultyWisePerformance,
  TimeAnalysis,
  TestResult,
  QuestionType,
} from './types';

export function calculateQuestionResults(
  questions: MockQuestion[],
  answers: AnswerRecord[]
): QuestionResult[] {
  return questions.map((question) => {
    const answer = answers.find((a) => a.questionId === question.id);
    const selectedAnswer = answer?.selectedAnswer != null ? String(answer.selectedAnswer) : '';
    const isSkipped = answer?.isSkipped ?? answer?.skipped ?? true;
    const isCorrect = !isSkipped && selectedAnswer === question.correctAnswer;
    const timeTaken = answer?.timeTaken ?? 0;

    return {
      questionId: question.id,
      questionNumber: question.number,
      question: question.question,
      type: question.type,
      difficulty: question.difficulty,
      chapter: question.chapter,
      subject: question.subject,
      selectedAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect,
      isSkipped,
      timeTaken,
      explanation: question.explanation,
      concept: question.concept,
      revisionTip: question.revisionTip,
      marks: isCorrect ? question.marks : 0,
      maxMarks: question.marks,
    };
  });
}

export function calculateTopicWiseAccuracy(
  questions: MockQuestion[],
  answers: AnswerRecord[]
): TopicWiseAccuracy[] {
  const map = new Map<string, { total: number; correct: number; time: number }>();

  for (const question of questions) {
    const existing = map.get(question.chapter) ?? { total: 0, correct: 0, time: 0 };
    existing.total += 1;

    const answer = answers.find((a) => a.questionId === question.id);
    if (answer && !(answer.isSkipped ?? answer.skipped) && String(answer.selectedAnswer) === question.correctAnswer) {
      existing.correct += 1;
    }
    existing.time += answer?.timeTaken ?? 0;

    map.set(question.chapter, existing);
  }

  return Array.from(map.entries()).map(([chapter, data]) => ({
    chapter,
    totalQuestions: data.total,
    correctAnswers: data.correct,
    accuracy: data.total > 0 ? (data.correct / data.total) * 100 : 0,
    timeTaken: data.time,
  }));
}

export function calculateTypeWiseAccuracy(
  questions: MockQuestion[],
  answers: AnswerRecord[]
): TypeWiseAccuracy[] {
  const map = new Map<QuestionType, { total: number; correct: number }>();

  for (const question of questions) {
    const existing = map.get(question.type) ?? { total: 0, correct: 0 };
    existing.total += 1;

    const answer = answers.find((a) => a.questionId === question.id);
    if (answer && !(answer.isSkipped ?? answer.skipped) && String(answer.selectedAnswer) === question.correctAnswer) {
      existing.correct += 1;
    }

    map.set(question.type, existing);
  }

  return Array.from(map.entries()).map(([type, data]) => ({
    type,
    totalQuestions: data.total,
    correctAnswers: data.correct,
    accuracy: data.total > 0 ? (data.correct / data.total) * 100 : 0,
  }));
}

export function calculateDifficultyWise(
  questions: MockQuestion[],
  answers: AnswerRecord[]
): DifficultyWisePerformance[] {
  const map = new Map<string, { total: number; correct: number }>();

  for (const question of questions) {
    const existing = map.get(question.difficulty) ?? { total: 0, correct: 0 };
    existing.total += 1;

    const answer = answers.find((a) => a.questionId === question.id);
    if (answer && !(answer.isSkipped ?? answer.skipped) && String(answer.selectedAnswer) === question.correctAnswer) {
      existing.correct += 1;
    }

    map.set(question.difficulty, existing);
  }

  return Array.from(map.entries()).map(([difficulty, data]) => ({
    difficulty,
    totalQuestions: data.total,
    correctAnswers: data.correct,
    accuracy: data.total > 0 ? (data.correct / data.total) * 100 : 0,
  }));
}

export function calculateTimeAnalysis(
  questions: MockQuestion[],
  answers: AnswerRecord[],
  timeSpent: number
): TimeAnalysis {
  if (questions.length === 0) {
    return {
      totalTime: timeSpent,
      avgTimePerQuestion: 0,
      fastestQuestion: { id: '', time: 0 },
      slowestQuestion: { id: '', time: 0 },
      timeManagementRating: 'Needs Improvement',
      questionsWithinTime: 0,
      questionsOverTime: 0,
    };
  }

  let fastestTime = Infinity;
  let slowestTime = -Infinity;
  let fastestId = '';
  let slowestId = '';
  let questionsWithinTime = 0;
  let questionsOverTime = 0;

  for (const question of questions) {
    const answer = answers.find((a) => a.questionId === question.id);
    const timeTaken = answer?.timeTaken ?? 0;

    if (timeTaken < fastestTime) {
      fastestTime = timeTaken;
      fastestId = question.id;
    }
    if (timeTaken > slowestTime) {
      slowestTime = timeTaken;
      slowestId = question.id;
    }

    if (timeTaken > 0 && timeTaken <= question.timeEstimate) {
      questionsWithinTime += 1;
    } else if (timeTaken > question.timeEstimate) {
      questionsOverTime += 1;
    }
  }

  const avgTimePerQuestion = timeSpent / questions.length;

  let timeManagementRating: string;
  if (avgTimePerQuestion < 60) {
    timeManagementRating = 'Excellent';
  } else if (avgTimePerQuestion < 120) {
    timeManagementRating = 'Good';
  } else if (avgTimePerQuestion < 180) {
    timeManagementRating = 'Average';
  } else {
    timeManagementRating = 'Needs Improvement';
  }

  return {
    totalTime: timeSpent,
    avgTimePerQuestion,
    fastestQuestion: { id: fastestId, time: fastestTime },
    slowestQuestion: { id: slowestId, time: slowestTime },
    timeManagementRating,
    questionsWithinTime,
    questionsOverTime,
  };
}

export function calculateResults(
  questions: MockQuestion[],
  answers: AnswerRecord[],
  config: TestConfig,
  timeSpent: number
): TestResult {
  const questionResults = calculateQuestionResults(questions, answers);
  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
  const score = questionResults.reduce((sum, r) => sum + r.marks, 0);
  const totalAnswered = questionResults.filter((r) => !r.isSkipped);
  const correctAnswers = totalAnswered.filter((r) => r.isCorrect).length;
  const incorrectAnswers = totalAnswered.filter((r) => !r.isCorrect).length;
  const skippedQuestions = questionResults.filter((r) => r.isSkipped).length;

  const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;
  const accuracy = totalAnswered.length > 0 ? (correctAnswers / totalAnswered.length) * 100 : 0;

  let performanceRating: string;
  if (percentage >= 80) {
    performanceRating = 'Excellent';
  } else if (percentage >= 60) {
    performanceRating = 'Good';
  } else if (percentage >= 40) {
    performanceRating = 'Average';
  } else {
    performanceRating = 'Needs Improvement';
  }

  const topicWiseAccuracy = calculateTopicWiseAccuracy(questions, answers);
  const typeWiseAccuracy = calculateTypeWiseAccuracy(questions, answers);
  const difficultyWisePerformance = calculateDifficultyWise(questions, answers);
  const timeAnalysis = calculateTimeAnalysis(questions, answers, timeSpent);

  const tempResult = {
    id: '',
    testId: '',
    attemptId: '',
    config,
    score,
    totalMarks,
    percentage,
    accuracy,
    correctAnswers,
    incorrectAnswers,
    skippedQuestions,
    timeTaken: timeSpent,
    timeLimit: 0,
    questionResults,
    topicWiseAccuracy,
    typeWiseAccuracy,
    difficultyWisePerformance,
    timeAnalysis,
    performanceRating,
    strengths: [] as string[],
    weaknesses: [] as string[],
    recommendations: [] as string[],
    submittedAt: new Date().toISOString(),
  };

  const strengths = identifyStrengths(tempResult);
  const weaknesses = identifyWeaknesses(tempResult);
  const recommendations = generateRecommendations(tempResult);

  return {
    ...tempResult,
    strengths,
    weaknesses,
    recommendations,
  };
}

export function identifyStrengths(results: TestResult): string[] {
  const strengths: string[] = [];

  for (const topic of results.topicWiseAccuracy) {
    if (topic.accuracy > 70) {
      strengths.push(topic.chapter);
    }
  }

  for (const type of results.typeWiseAccuracy) {
    if (type.accuracy > 70) {
      strengths.push(type.type);
    }
  }

  const easyModerate = results.difficultyWisePerformance.filter(
    (d) => d.difficulty === 'easy' || d.difficulty === 'moderate'
  );
  for (const level of easyModerate) {
    if (level.accuracy > 70) {
      strengths.push(level.difficulty);
    }
  }

  return strengths;
}

export function identifyWeaknesses(results: TestResult): string[] {
  const weaknesses: string[] = [];

  for (const topic of results.topicWiseAccuracy) {
    if (topic.accuracy < 50) {
      weaknesses.push(topic.chapter);
    }
  }

  for (const type of results.typeWiseAccuracy) {
    if (type.accuracy < 50) {
      weaknesses.push(type.type);
    }
  }

  const hardLevel = results.difficultyWisePerformance.find((d) => d.difficulty === 'hard');
  if (hardLevel && hardLevel.accuracy < 50) {
    weaknesses.push('hard');
  }

  return weaknesses;
}

export function generateRecommendations(results: TestResult): string[] {
  const recommendations: string[] = [];

  for (const topic of results.topicWiseAccuracy) {
    if (topic.accuracy < 50) {
      recommendations.push(
        `Focus on ${topic.chapter} - only ${topic.accuracy.toFixed(0)}% accuracy`
      );
    }
  }

  const weakTypes = results.typeWiseAccuracy.filter((t) => t.accuracy < 50);
  for (const type of weakTypes) {
    if (type.type === 'numerical' || type.type === 'competency-based') {
      recommendations.push(`Practice more ${type.type} questions`);
    } else {
      recommendations.push(`Review ${type.type} question format`);
    }
  }

  if (results.timeAnalysis.timeManagementRating === 'Needs Improvement') {
    recommendations.push('Review time management - practice timed tests');
  }

  if (results.timeAnalysis.questionsOverTime > results.timeAnalysis.questionsWithinTime) {
    recommendations.push(
      'Too many questions took longer than expected - work on speed'
    );
  }

  if (results.percentage < 40) {
    recommendations.push('Consider revising foundational concepts before attempting another test');
  }

  return recommendations;
}
