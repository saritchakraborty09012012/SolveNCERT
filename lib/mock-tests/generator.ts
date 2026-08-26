import { GoogleGenAI } from '@google/genai';
import {
  MockQuestion,
  MockTest,
  QuestionType,
  TestConfig,
} from './types';
import { CLASS_9_KNOWLEDGE } from './question-bank';

let genaiClient: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!genaiClient) {
    genaiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || '',
    });
  }
  return genaiClient;
}

  const MODEL_CHAIN = ['gemini-3.6-flash', 'gemini-flash-latest', 'gemini-flash-lite-latest'];

async function generateWithFallback(params: {
  contents: string;
  config?: Record<string, unknown>;
}): Promise<string> {
  const client = getClient();
  let lastError: unknown = null;
  for (const model of MODEL_CHAIN) {
    try {
      const response = await client.models.generateContent({
        model,
        contents: params.contents,
        config: params.config,
      });
      const text = response.text || '';
      if (text.trim()) return text;
      lastError = new Error('Empty response from ' + model);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError instanceof Error ? lastError : new Error('All models failed');
}

interface TypeDistribution {
  type: QuestionType;
  count: number;
  percentage: number;
}

export function buildSubjectContext(config: TestConfig): string {
  const knowledge = CLASS_9_KNOWLEDGE[config.subject];
  if (!knowledge) return '';

  const lines: string[] = [];
  lines.push('Subject: ' + knowledge.name);
  lines.push('Book: ' + knowledge.book);
  lines.push('');
  lines.push('Chapters and Topics:');
  lines.push('---');

  const chaptersToInclude =
    config.chapterMode === 'entire-book'
      ? knowledge.chapters
        : knowledge.chapters.filter(function (ch) {
            return config.chapters.includes(String(ch.chapterNumber));
          });

  for (var i = 0; i < chaptersToInclude.length; i++) {
    var ch = chaptersToInclude[i];
    lines.push('Chapter ' + ch.chapterNumber + ': ' + ch.chapter);
    lines.push('Topics: ' + ch.topics.join(', '));
    lines.push('Key Concepts: ' + ch.keyConcepts.join(', '));
    if (ch.formulas && ch.formulas.length > 0) {
      lines.push('Formulas: ' + ch.formulas.join('; '));
    }
    if (ch.importantTerms && ch.importantTerms.length > 0) {
      lines.push('Important Terms: ' + ch.importantTerms.join(', '));
    }
    lines.push('');
  }

  return lines.join('\n');
}


export function getQuestionTypeDistribution(count: number): TypeDistribution[] {
  var distributions: TypeDistribution[] = [];

  if (count <= 20) {
    distributions = [
      { type: 'mcq', count: 0, percentage: 30 },
      { type: 'short-answer', count: 0, percentage: 25 },
      { type: 'long-answer', count: 0, percentage: 15 },
      { type: 'fill-blanks', count: 0, percentage: 10 },
      { type: 'assertion-reason', count: 0, percentage: 10 },
      { type: 'match-following', count: 0, percentage: 5 },
      { type: 'numerical', count: 0, percentage: 5 },
    ];
  } else if (count <= 50) {
    distributions = [
      { type: 'mcq', count: 0, percentage: 25 },
      { type: 'short-answer', count: 0, percentage: 18 },
      { type: 'long-answer', count: 0, percentage: 11 },
      { type: 'fill-blanks', count: 0, percentage: 8 },
      { type: 'assertion-reason', count: 0, percentage: 8 },
      { type: 'numerical', count: 0, percentage: 8 },
      { type: 'case-based', count: 0, percentage: 6 },
      { type: 'competency-based', count: 0, percentage: 6 },
      { type: 'hots', count: 0, percentage: 5 },
      { type: 'match-following', count: 0, percentage: 5 },
    ];
  } else {
    distributions = [
      { type: 'mcq', count: 0, percentage: 22 },
      { type: 'short-answer', count: 0, percentage: 16 },
      { type: 'long-answer', count: 0, percentage: 10 },
      { type: 'fill-blanks', count: 0, percentage: 8 },
      { type: 'assertion-reason', count: 0, percentage: 8 },
      { type: 'numerical', count: 0, percentage: 8 },
      { type: 'case-based', count: 0, percentage: 8 },
      { type: 'competency-based', count: 0, percentage: 7 },
      { type: 'hots', count: 0, percentage: 7 },
      { type: 'match-following', count: 0, percentage: 6 },
    ];
  }

  var totalAssigned = 0;
  for (var i = 0; i < distributions.length; i++) {
    distributions[i].count = Math.floor(
      (distributions[i].percentage / 100) * count
    );
    totalAssigned += distributions[i].count;
  }

  var remaining = count - totalAssigned;
  var idx = 0;
  while (remaining > 0) {
    distributions[idx % distributions.length].count++;
    remaining--;
    idx++;
  }

  return distributions.filter(function (d) {
    return d.count > 0;
  });
}


export function getMarksForType(type: QuestionType): number {
  switch (type) {
    case 'mcq':
      return 1;
    case 'assertion-reason':
      return 1;
    case 'case-based':
      return 4;
    case 'competency-based':
      return 4;
    case 'hots':
      return 5;
    case 'numerical':
      return 3;
    case 'fill-blanks':
      return 1;
    case 'match-following':
      return 1;
    case 'short-answer':
      return 3;
    case 'long-answer':
      return 5;
    default:
      return 1;
  }
}

export function getTimeForType(type: QuestionType): number {
  switch (type) {
    case 'mcq':
      return 60;
    case 'assertion-reason':
      return 90;
    case 'case-based':
      return 180;
    case 'competency-based':
      return 180;
    case 'hots':
      return 150;
    case 'numerical':
      return 120;
    case 'fill-blanks':
      return 45;
    case 'match-following':
      return 60;
    case 'short-answer':
      return 120;
    case 'long-answer':
      return 240;
    default:
      return 60;
  }
}


export function buildPrompt(
  config: TestConfig,
  subjectContext: string,
  distribution: TypeDistribution[]
): string {
  var parts: string[] = [];

  parts.push('You are an expert CBSE Class 9 question paper generator.');
  parts.push('');
  parts.push('TASK: Generate exactly ' + config.questionCount + ' questions for a mock test.');
  parts.push('');
  parts.push('SUBJECT INFORMATION:');
  parts.push(subjectContext);
  parts.push('');
  parts.push('DIFFICULTY LEVEL: ' + config.difficulty.toUpperCase());
  parts.push('');
  parts.push('QUESTION TYPE DISTRIBUTION:');

  for (var i = 0; i < distribution.length; i++) {
    var d = distribution[i];
    parts.push('- ' + d.type + ': ' + d.count + ' questions');
  }

  parts.push('');
  parts.push('STRICT RULES:');
  parts.push('1. Follow NCERT Class 9 syllabus strictly.');
  parts.push('2. Output ONLY a valid JSON array. No markdown, no explanation, no text outside the JSON.');
  parts.push('3. Each question must follow the exact schema below.');
  parts.push('4. For MCQs: provide exactly 4 options in the options array.');
  parts.push('5. For assertion-reason: include assertionStatement and reasonStatement fields, plus options [A] Both true and correct, [B] Assertion true reason false, [C] Both false, [D] Assertion false reason true.');
  parts.push('6. For case-based: include a caseData field with the case scenario or passage.');
  parts.push('7. For match-following: include a matchPairs array with left and right pairs.');
  parts.push('8. For numerical: include a numericalData field with the problem details.');
  parts.push('9. difficulty must be one of: easy, moderate, hard.');
  parts.push('10. chapterNumber must be the actual NCERT chapter number.');
  parts.push('');
  parts.push('JSON SCHEMA:');
  parts.push('[');
  parts.push('  {');
  parts.push('    "number": 1,');
  parts.push('    "type": "mcq",');
  parts.push('    "question": "The question text",');
  parts.push('    "options": ["Option A", "Option B", "Option C", "Option D"],');
  parts.push('    "correctAnswer": "The correct answer text",');
  parts.push('    "explanation": "Detailed explanation",');
  parts.push('    "concept": "The core concept being tested",');
  parts.push('    "revisionTip": "Quick revision tip for this concept",');
  parts.push('    "difficulty": "moderate",');
  parts.push('    "chapter": "Chapter name",');
  parts.push('    "chapterNumber": 1,');
  parts.push('    "caseData": "For case-based only",');
  parts.push('    "assertionStatement": "For assertion-reason only",');
  parts.push('    "reasonStatement": "For assertion-reason only",');
  parts.push('    "matchPairs": [{"left": "Item 1", "right": "Match A"}],');
  parts.push('    "numericalData": "For numerical only"');
  parts.push('  }');
  parts.push(']');
  parts.push('');
  parts.push('For fill-blanks questions, use "____" in the question to indicate the blank.');
  parts.push('For match-following, provide 4-5 pairs in matchPairs and phrase the question as "Match the following".');
  parts.push('For numerical, include the numericalData with relevant values and ask the student to solve.');

  if (config.chapterMode !== 'entire-book' && config.chapters.length > 0) {
    parts.push('');
    parts.push('CHAPTERS TO FOCUS ON: ' + config.chapters.join(', '));
  }

  parts.push('');
  parts.push('Generate the JSON array now. Return ONLY the JSON array with no additional text.');

  return parts.join('\n');
}


export function parseAIResponse(text: string): MockQuestion[] {
  var cleaned = text.trim();

  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  cleaned = cleaned.trim();

  var firstBracket = cleaned.indexOf('[');
  var lastBracket = cleaned.lastIndexOf(']');

  if (firstBracket === -1 || lastBracket === -1) {
    throw new Error('No JSON array found in AI response');
  }

  var jsonStr = cleaned.substring(firstBracket, lastBracket + 1);

  var parsed = JSON.parse(jsonStr);

  if (!Array.isArray(parsed)) {
    throw new Error('Parsed response is not an array');
  }

  var questions: MockQuestion[] = parsed.map(function (
    item: any,
    index: number
  ) {
    var qType: QuestionType = item.type || 'mcq';
    return {
      id: 'q-' + Date.now() + '-' + index,
      number: item.number || index + 1,
      type: qType,
      question: item.question || '',
      options: item.options || undefined,
      correctAnswer: item.correctAnswer || '',
      explanation: item.explanation || '',
      concept: item.concept || '',
      revisionTip: item.revisionTip || '',
      difficulty: item.difficulty || 'moderate',
      chapter: item.chapter || '',
      chapterNumber: item.chapterNumber || 0,
      subject: '',
      marks: getMarksForType(qType),
      timeEstimate: getTimeForType(qType),
      caseData: item.caseData || undefined,
      assertionStatement: item.assertionStatement || undefined,
      reasonStatement: item.reasonStatement || undefined,
      matchPairs: item.matchPairs || undefined,
      numericalData: item.numericalData || undefined,
    };
  });

  return questions;
}


export async function generateMockTest(
  config: TestConfig,
  wrongQuestionTexts: string[] = []
): Promise<MockTest> {
  var subjectContext = buildSubjectContext(config);
  var distribution = getQuestionTypeDistribution(config.questionCount);
  var prompt = buildPrompt(config, subjectContext, distribution);

  if (wrongQuestionTexts.length > 0) {
    prompt += '\n\n';
    prompt += 'IMPORTANT: The student has previously answered these questions incorrectly. Avoid repeating the same questions and generate similar practice questions on the same concepts:\n';
    for (var i = 0; i < wrongQuestionTexts.length; i++) {
      prompt += '- ' + wrongQuestionTexts[i] + '\n';
    }
  }

  prompt += '\n\nDifficulty distribution: ';
  if (config.difficulty === 'easy') {
    prompt += '50% easy, 35% moderate, 15% hard';
  } else if (config.difficulty === 'moderate') {
    prompt += '30% easy, 50% moderate, 20% hard';
  } else if (config.difficulty === 'hard') {
    prompt += '15% easy, 35% moderate, 50% hard';
  } else {
    prompt += '25% easy, 50% moderate, 25% hard';
  }

  prompt += '\n\nChapter numbers for reference:';

  var knowledge = CLASS_9_KNOWLEDGE[config.subject];
  if (knowledge) {
    var chaptersForSubject =
      config.chapterMode === 'entire-book'
        ? knowledge.chapters
        : knowledge.chapters.filter(function (ch) {
            return config.chapters.includes(ch.chapter);
          });
    for (var j = 0; j < chaptersForSubject.length; j++) {
      var chapter = chaptersForSubject[j];
      prompt +=
        '\n- Chapter ' +
        chapter.chapterNumber +
        ': ' +
        chapter.chapter;
    }
  }

  var responseText = await generateWithFallback({
    contents: prompt,
    config: {
      temperature: 0.7,
      maxOutputTokens: 16000,
    },
  });
  var questions = parseAIResponse(responseText);

  for (var k = 0; k < questions.length; k++) {
    questions[k].subject = config.subject;
    questions[k].number = k + 1;
    if (!questions[k].id) {
      questions[k].id = 'q-' + Date.now() + '-' + k;
    }
  }

  var totalMarks = 0;
  var totalTime = 0;
  for (var m = 0; m < questions.length; m++) {
    totalMarks += questions[m].marks;
    totalTime += questions[m].timeEstimate;
  }

  var mockTest: MockTest = {
    id: 'mock-' + Date.now(),
    config: config,
    questions: questions,
    totalMarks: totalMarks,
    totalQuestions: questions.length,
    createdAt: new Date().toISOString(),
    timeLimit: totalTime,
  };

  return mockTest;
}


export async function gradeAnswer(
  question: MockQuestion,
  studentAnswer: string
): Promise<{ score: number; feedback: string }> {
  if (question.type === 'mcq' || question.type === 'assertion-reason') {
    var normalizedStudent = studentAnswer.trim().toLowerCase();
    var normalizedCorrect = question.correctAnswer.trim().toLowerCase();

    if (
      normalizedStudent === normalizedCorrect ||
      normalizedStudent === normalizedCorrect.charAt(0)
    ) {
      return {
        score: question.marks,
        feedback: 'Correct! ' + question.explanation,
      };
    } else {
      return {
        score: 0,
        feedback:
          'Incorrect. The correct answer is: ' +
          question.correctAnswer +
          '. ' +
          question.explanation,
      };
    }
  }

  if (question.type === 'fill-blanks' || question.type === 'match-following') {
    var normalizedStudent2 = studentAnswer
      .trim()
      .toLowerCase()
      .replace(/[.,]/g, '');
    var normalizedCorrect2 = question.correctAnswer
      .trim()
      .toLowerCase()
      .replace(/[.,]/g, '');

    if (normalizedStudent2 === normalizedCorrect2) {
      return {
        score: question.marks,
        feedback: 'Correct! ' + question.explanation,
      };
    } else {
      return {
        score: 0,
        feedback:
          'Incorrect. The correct answer is: ' +
          question.correctAnswer +
          '. ' +
          question.explanation,
      };
    }
  }

  var gradingPrompt =
    'You are a CBSE Class 9 examiner. Grade the following answer.\n\n';
  gradingPrompt += 'Question: ' + question.question + '\n';
  gradingPrompt += 'Correct Answer: ' + question.correctAnswer + '\n';
  gradingPrompt += 'Concept: ' + question.concept + '\n';
  gradingPrompt += 'Student Answer: ' + studentAnswer + '\n';
  gradingPrompt += 'Maximum Marks: ' + question.marks + '\n\n';
  gradingPrompt +=
    'Grade the answer on a scale of 0 to ' + question.marks + '.\n';
  gradingPrompt +=
    'Consider partial credit for answers that demonstrate understanding even if not complete.\n';
  gradingPrompt += 'Return your response in the following JSON format:\n';
  gradingPrompt += '{"score": <number>, "feedback": "<detailed feedback>"}\n';
  gradingPrompt += 'Return ONLY the JSON object with no additional text.';

  try {
    var gradingResponse = await generateWithFallback({
      contents: gradingPrompt,
      config: {
        temperature: 0.3,
        maxOutputTokens: 1000,
      },
    });

    var responseText = gradingResponse || '';
    var cleaned = responseText.trim();

    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.substring(7);
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.substring(3);
    }
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.substring(0, cleaned.length - 3);
    }
    cleaned = cleaned.trim();

    var firstBrace = cleaned.indexOf('{');
    var lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }

    var result = JSON.parse(cleaned);
    var score = Math.min(
      Math.max(0, parseInt(result.score, 10) || 0),
      question.marks
    );

    return {
      score: score,
      feedback: result.feedback || 'Answer graded.',
    };
  } catch {
    return {
      score: 0,
      feedback:
        'Unable to grade automatically. The correct answer is: ' +
        question.correctAnswer +
        '. ' +
        question.explanation,
    };
  }
}


