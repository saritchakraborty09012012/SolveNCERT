import type { PracticePaperConfig, Difficulty } from './types';
import { buildNCERTContext } from './ncert-context';
import { getSharedKnowledge, getTopicsForRevision } from './shared-knowledge';

function getDifficultyInstructions(difficulty: Difficulty): string {
  if (difficulty === 'easy') {
    return 'Focus on basic recall, definitions, simple applications. 40% MCQs (direct recall), 20% Fill in Blanks/Match, 20% Short Answer, 20% Simple Numericals. Keep language simple and direct.';
  }
  if (difficulty === 'hard') {
    return 'Focus on higher-order thinking, complex problems, exam-level difficulty. 15% MCQs (tricky), 20% HOTS, 15% Case-based/Competency, 15% Numericals (multi-step), 15% Long Answer (analytical), 15% Assertion-Reason (subtle). Challenge deep understanding.';
  }
  return 'Balance recall and application. 20% MCQs (application), 12% Assertion-Reason, 12% Case-based, 8% Competency, 18% Short Answer, 12% Numericals (multi-step), 10% Long Answer. Test conceptual understanding.';
}

function getQuestionTypeDistribution(count: number, difficulty: Difficulty): string {
  if (difficulty === 'easy') {
    const mcq = Math.ceil(count * 0.35);
    const fib = Math.ceil(count * 0.15);
    const mtf = Math.ceil(count * 0.1);
    const sa = Math.ceil(count * 0.25);
    const num = count - mcq - fib - mtf - sa;
    return `MCQs: ~${mcq}, Fill in Blanks: ~${fib}, Match the Following: ~${mtf}, Short Answer: ~${sa}, Numericals: ~${Math.max(num,0)}. Total: ${count}`;
  }
  if (difficulty === 'hard') {
    const mcq = Math.ceil(count * 0.15);
    const ar = Math.ceil(count * 0.12);
    const cb = Math.ceil(count * 0.12);
    const hots = Math.ceil(count * 0.1);
    const num = Math.ceil(count * 0.12);
    const la = Math.ceil(count * 0.15);
    const comp = Math.ceil(count * 0.1);
    const rest = count - mcq - ar - cb - hots - num - la - comp;
    return `MCQs: ~${mcq}, Assertion-Reason: ~${ar}, Case-based: ~${cb}, HOTS: ~${hots}, Numericals: ~${num}, Long Answer: ~${la}, Competency: ~${comp}, Short Answer: ~${Math.max(rest,0)}. Total: ${count}`;
  }
  const mcq = Math.ceil(count * 0.2);
  const ar = Math.ceil(count * 0.12);
  const cb = Math.ceil(count * 0.12);
  const comp = Math.ceil(count * 0.08);
  const sa = Math.ceil(count * 0.18);
  const num = Math.ceil(count * 0.12);
  const la = Math.ceil(count * 0.1);
  const rest = count - mcq - ar - cb - comp - sa - num - la;
  return `MCQs: ~${mcq}, Assertion-Reason: ~${ar}, Case-based: ~${cb}, Competency: ~${comp}, Short Answer: ~${sa}, Numericals: ~${num}, Long Answer: ~${la}, Other: ~${Math.max(rest,0)}. Total: ${count}`;
}

export async function buildPaperGenerationPrompt(config: PracticePaperConfig): Promise<string> {
  const ncertContext = buildNCERTContext(config);
  const shared = await getSharedKnowledge();
  const revisionTopics = await getTopicsForRevision();

  const weakBlock = shared.weakAreas.length > 0
    ? '\nSTUDENT WEAK AREAS (prioritize):\n' + shared.weakAreas.slice(0, 8).map((w) => '- ' + w.topic + ' (Ch: ' + w.chapter + ', Severity: ' + w.severity + '/5)').join('\n')
    : '';

  const strongBlock = shared.strongAreas.length > 0
    ? '\nSTUDENT STRONG AREAS (fewer questions):\n' + shared.strongAreas.slice(0, 5).map((s) => '- ' + s.topic + ' (' + s.accuracy + '% accuracy)').join('\n')
    : '';

  const revisionBlock = revisionTopics.length > 0
    ? '\nTOPICS NEEDING REVISION:\n' + revisionTopics.map((t) => '- ' + t).join('\n')
    : '';

  return [
    'You are an expert CBSE Class 9 question paper setter with deep knowledge of NCERT textbooks.',
    '',
    ncertContext,
    '',
    '=== PAPER CONFIGURATION ===',
    'Class: ' + config.classLevel,
    'Subject: ' + config.subject,
    'Book: ' + config.book,
    'Chapter: ' + config.chapter,
    'Difficulty: ' + config.difficulty.toUpperCase(),
    'Total Questions: ' + config.questionCount,
    '',
    '=== QUESTION DISTRIBUTION ===',
    getQuestionTypeDistribution(config.questionCount, config.difficulty),
    '',
    '=== DIFFICULTY INSTRUCTIONS ===',
    getDifficultyInstructions(config.difficulty),
    weakBlock,
    strongBlock,
    revisionBlock,
    '',
    '=== QUESTION FORMAT RULES ===',
    'IMPORTANT: Students TYPE their answers into a text box. There is NO option clicking.',
    '1. MCQs: 4 options (A/B/C/D) shown in question text, ONE correct answer. Student types the full option e.g. "C) Photosynthesis"',
    '2. Assertion-Reason: Assertion (A) + Reason (R), options A-D (Both true/false combos). Student types the full option',
    '3. Case-based: Include the case/passage in the text, with ONE question to answer',
    '4. Numericals: Complete data, multi-step calculation required. Student types the final answer with units',
    '5. Fill in the Blanks: Context with a blank to fill. Student types the missing word/phrase',
    '6. Match the Following: Column A (4-5 items) matched to Column B (4-5 items). Student types the matches e.g. "1-C, 2-A, 3-D, 4-B"',
    '7. Short Answer: 2-3 sentence response expected',
    '8. Long Answer: Detailed 4-6 sentence response expected',
    '9. HOTS: Analysis, evaluation, creation level thinking',
    '10. Competency-based: Real-world application, cross-curricular',
    '',
    '=== CRITICAL RULES ===',
    '- Each question MUST be a single, independent, standalone question',
    '- Generate EXACTLY ' + config.questionCount + ' questions in the JSON array',
    '- Do NOT embed sub-questions within a question — each array element = 1 question',
    '- Questions MUST be syllabus-aligned to the NCERT textbook',
    '- All facts, formulas, dates, concepts MUST be accurate',
    '- Age-appropriate for Class 9 (14-15 years old)',
    '- Vary sub-topics; do not repeat same concept',
    '- Each question must have a clear, unambiguous correct answer',
    '- For MCQ/Assertion-Reason: "correctAnswer" MUST be the COMPLETE option text exactly as written in options, e.g. "C) 60 cm, virtual and erect"',
    '- For text answers: "correctAnswer" MUST contain the key points/terms a grader would look for',
    '',
    '=== RESPONSE FORMAT ===',
    'Return a JSON array with EXACTLY ' + config.questionCount + ' elements. Each element must be an object with these exact fields:',
    '{',
    '  "index": 1,',
    '  "type": "mcq" | "assertion-reason" | "case-based" | "competency-based" | "hots" | "numerical" | "fill-in-blank" | "match-the-following" | "short-answer" | "long-answer",',
    '  "text": "The full question text (for case-based, include the passage/scenario here; for MCQ include the options in the text too, e.g. ... Options: A) ... B) ... C) ... D) ...)",',
    '  "options": ["A) ...", "B) ...", "C) ...", "D) ..."] (only for MCQ and Assertion-Reason, null otherwise — shown read-only, student cannot click them),',
    '  "correctAnswer": "For MCQ/AR: the complete option text e.g. \\"C) 60 cm, virtual and erect\\". For others: the model answer with all key points",',
    '  "explanation": "Detailed step-by-step explanation of the correct answer",',
    '  "difficulty": "easy" | "moderate" | "hard",',
    '  "topic": "The specific topic/concept this question tests",',
    '  "relatedConcept": "The broader concept or chapter topic this relates to",',
    '  "revisionTip": "A quick 1-2 line tip for revising this concept"',
    '}',
    '',
    'Return ONLY the JSON array, no markdown fences, no extra text.',
  ].join('\n');
}
