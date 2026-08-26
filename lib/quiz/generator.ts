import { GoogleGenAI } from '@google/genai';
import { QuizConfig, QuizQuestion, QuestionType, QuizDifficulty } from '@/types/quiz';
import { buildQuizContext, getSubjectKnowledge } from '@/lib/quiz/knowledge-base';
import { getWrongQuestions } from '@/lib/quiz/shared-knowledge';

const PRIMARY_MODEL = 'gemini-3.6-flash';
const FALLBACK_MODELS = ['gemini-flash-latest', 'gemini-flash-lite-latest'];

const QUESTION_TYPES: Record<QuizDifficulty, QuestionType[]> = {
  easy: ['mcq', 'match_following'],
  moderate: ['mcq', 'assertion_reason', 'match_following'],
  hard: ['mcq', 'assertion_reason', 'match_following'],
};

export function determineQuestionMix(
  subject: string,
  difficulty: QuizDifficulty,
  count: number
): QuestionType[] {
  const types = QUESTION_TYPES[difficulty] || QUESTION_TYPES.moderate;
  const mix: QuestionType[] = [];
  for (let i = 0; i < count; i++) {
    mix.push(types[i % types.length]);
  }
  return mix;
}

export function buildQuizPrompt(
  config: QuizConfig,
  context: string,
  wrongQs: any[]
): string {
  const { subject, chapter, difficulty, numQuestions } = config;
  const totalQuestions = numQuestions || 10;
  const questionTypes = determineQuestionMix(subject, difficulty, totalQuestions);

  const wrongSection = wrongQs.length > 0
    ? `\n\nREVISION QUESTIONS (based on student's past mistakes - include similar concepts):\n${JSON.stringify(wrongQs.slice(0, 5), null, 2)}`
    : '';

  return `You are an expert NCERT/CBSE quiz question generator for ${subject}.

SUBJECT KNOWLEDGE CONTEXT:
${context}

TOPICS TO FOCUS ON: All topics in ${chapter || 'the subject'}
DIFFICULTY: ${difficulty}
QUESTION TYPES NEEDED: ${questionTypes.join(', ')}
TOTAL QUESTIONS: ${totalQuestions}${wrongSection}

Generate exactly ${totalQuestions} quiz questions. Return ONLY a valid JSON array (no markdown, no explanation).

STRICT RULE - ONLY OBJECTIVE QUESTIONS:
- Use ONLY these types: "mcq", "assertion_reason", "match_following"
- NO subjective questions (no short_answer, no long_answer, no fill_blank, no numerical without options)
- assertion_reason is MCQ-style: it MUST have exactly 4 options

Each question MUST follow this structure:
{
  "type": "<mcq|assertion_reason|match_following>",
  "text": "The question text",
  "options": ["A. option1", "B. option2", "C. option3", "D. option4"],
  "correctAnswer": "A" or specific answer text,
  "explanation": "Detailed NCERT-based explanation",
  "relatedConcept": "Chapter concept name",
  "revisionTip": "Quick revision note",
  "difficulty": "${difficulty}",
  "topic": "Specific topic name",
  "marks": 1
}

RULES:
- MCQ must have exactly 4 options with A, B, C, D labels
- Assertion-Reason format: "Assertion (A): ... Reason (R): ..." in text, with 4 standard options:
  ["A. Both A and R are true and R is the correct explanation of A", "B. Both A and R are true but R is not the correct explanation of A", "C. A is true but R is false", "D. A is false but R is true"]
- Match following: options should be pairs like "Column A item - Column B item", correctAnswer matches them
- Every question MUST have 4 options - never leave options empty
- All questions must be NCERT-aligned and accurate
- Explanations must reference NCERT concepts
- Return ONLY the JSON array, nothing else`;
}

export async function generateQuiz(
  config: QuizConfig,
  userId?: string
): Promise<QuizQuestion[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured');

  const { subject, chapter, difficulty = 'moderate', numQuestions = 10 } = config;

  const knowledge = getSubjectKnowledge(subject);
  const context = buildQuizContext(subject, chapter, difficulty);

  let wrongQuestions: any[] = [];
  if (userId) {
    wrongQuestions = await getWrongQuestions(userId, subject);
  }

  const maxWrong = Math.ceil(numQuestions * 0.2);
  const wrongQs = wrongQuestions.slice(0, maxWrong);

  const prompt = buildQuizPrompt(config, context, wrongQs);

  const contents = [{ role: 'user' as const, parts: [{ text: prompt }] }];

  const isModelMissing = (m: string) =>
    /(not found|404|not supported|does not exist|invalid argument.*model)/i.test(m);
  const isRetryable = (m: string) =>
    /(fetch failed|network|timeout|etimedout|econnreset|econnrefused|socket|enotfound|ehostunreach|503|unavailable|overload|high demand|500|internal error|rate limit|429|quota)/i.test(m);

  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

  let lastError: unknown = null;

  for (const model of [PRIMARY_MODEL, ...FALLBACK_MODELS]) {
    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            temperature: 0.7,
            maxOutputTokens: 8192,
          },
        });

        const responseText = (response.text || '').trim();
        if (!responseText) {
          throw new Error('Empty response from AI');
        }

        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
          throw new Error('Failed to parse quiz response from AI');
        }

        const rawQuestions = (JSON.parse(jsonMatch[0]) as any[])
          .filter((q) => Array.isArray(q.options) && q.options.length >= 2);

        const questions: QuizQuestion[] = rawQuestions.map((q, idx) => ({
          id: `q_${Date.now()}_${idx}`,
          index: idx,
          type: ['mcq', 'assertion_reason', 'match_following'].includes(q.type) ? q.type : 'mcq',
          text: q.text || '',
          options: Array.isArray(q.options) ? q.options.map((opt: any) =>
            typeof opt === 'string' ? opt : String(opt?.text ?? opt?.label ?? '')
          ).filter(Boolean) : [],
          correctAnswer: q.correctAnswer || '',
          isSkipped: false,
          explanation: q.explanation || '',
          relatedConcept: q.relatedConcept || '',
          revisionTip: q.revisionTip || '',
          difficulty: q.difficulty || difficulty,
          topic: q.topic || chapter || '',
          marks: q.marks || 1,
        }));

        return questions;
      } catch (err) {
        lastError = err;
        const message = err instanceof Error ? err.message : String(err);

        if (isModelMissing(message)) break;

        if (isRetryable(message) && attempt < maxAttempts) {
          await delay(attempt * 2000);
          continue;
        }
        break;
      }
    }
  }

  const message = lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(`Quiz generation failed: ${message}`);
}
