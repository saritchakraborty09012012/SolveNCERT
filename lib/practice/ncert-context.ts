import { CLASS_9_SUBJECTS } from '@/lib/content';
import { SCIENCE_BOOK_CONTEXT } from '@/lib/content-science';
import { ENGLISH_BOOK_CONTEXT } from '@/lib/content-english';
import { SST_BOOK_CONTEXT } from '@/lib/content-sst';
import { IT_BOOK_CONTEXT } from '@/lib/content-it';
import { EMPLOYABILITY_BOOK_CONTEXT } from '@/lib/content-employability';
import { ADVMATH_BOOK_CONTEXT } from '@/lib/content-advmath';
import { ADVSCIENCE_BOOK_CONTEXT } from '@/lib/content-advscience';
import { MATHS_BOOK_CONTEXT } from '@/lib/content';
import type { PracticePaperConfig } from './types';

function getBookContext(subject: string): string {
  switch (subject.toLowerCase()) {
    case 'maths':
    case 'mathematics':
      return MATHS_BOOK_CONTEXT;
    case 'science':
      return SCIENCE_BOOK_CONTEXT;
    case 'english':
      return ENGLISH_BOOK_CONTEXT;
    case 'social science':
    case 'sst':
      return SST_BOOK_CONTEXT;
    case 'it':
    case 'information technology':
      return IT_BOOK_CONTEXT;
    case 'employability skills':
      return EMPLOYABILITY_BOOK_CONTEXT;
    case 'advanced maths':
    case 'advanced mathematics':
      return ADVMATH_BOOK_CONTEXT;
    case 'advanced science':
      return ADVSCIENCE_BOOK_CONTEXT;
    case 'hindi':
      return 'Hindi Ganga Class 9 NCERT - Covers prose, poetry, drama, and grammar for CBSE Class 9.';
    case 'sanskrit':
      return 'Sanskrit Sharda Class 9 NCERT - Covers prose, poetry, and grammar for CBSE Class 9.';
    default:
      return `${subject} Class 9 NCERT textbook content.`;
  }
}

function getChapterList(subject: string, bookSlug?: string): string {
  const sub = CLASS_9_SUBJECTS.find(
    (s) => s.name.toLowerCase() === subject.toLowerCase() || s.id.toLowerCase() === subject.toLowerCase()
  );
  if (!sub) return '';

  return sub.chapters
    .map((ch) => `Chapter ${ch.number}: ${ch.title} (Code: ${ch.code})`)
    .join('\n');
}

function getChapterTopics(chapterCode: string, subject: string): string {
  const sub = CLASS_9_SUBJECTS.find(
    (s) => s.name.toLowerCase() === subject.toLowerCase() || s.id.toLowerCase() === subject.toLowerCase()
  );
  if (!sub) return '';

  const chapter = sub.chapters.find((ch) => ch.code === chapterCode);
  if (!chapter) return '';

  const exerciseInfo = chapter.exercises
    .map((ex) => `${ex.title} (${ex.questions.length} questions)`)
    .join(', ');

  return `Chapter: ${chapter.title}\nExercises: ${exerciseInfo}\nTotal NCERT questions in this chapter: ${chapter.exercises.reduce((sum, ex) => sum + ex.questions.length, 0)}`;
}

export function buildNCERTContext(config: PracticePaperConfig): string {
  const bookContext = getBookContext(config.subject);
  const chapterList = getChapterList(config.subject, config.book);
  const chapterTopics = config.chapterCode ? getChapterTopics(config.chapterCode, config.subject) : '';

  return `
=== NCERT TEXTBOOK KNOWLEDGE BASE ===

${bookContext}

AVAILABLE CHAPTERS:
${chapterList}

${chapterTopics ? `SELECTED CHAPTER DETAILS:\n${chapterTopics}` : ''}

IMPORTANT: All questions must be strictly based on this NCERT syllabus. Do not generate questions from topics outside this textbook. Ensure every concept, formula, and fact referenced is accurate and syllabus-aligned.
`.trim();
}
