import type { QuestionType, QuizDifficulty } from '@/types/quiz';

export interface TopicKnowledge {
  name: string;
  keywords: string[];
  concepts: string[];
  difficulty: QuizDifficulty;
  questionTypes: QuestionType[];
}

export interface ChapterKnowledge {
  id: string;
  number: number;
  title: string;
  slug: string;
  subject: string;
  topics: TopicKnowledge[];
  keyConcepts: string[];
  formulas?: string[];
}

export interface SubjectKnowledge {
  id: string;
  name: string;
  slug: string;
  book: string;
  bookSlug: string;
  chapters: ChapterKnowledge[];
}

import { MATHS_KNOWLEDGE } from './knowledge-maths';
import { SCIENCE_KNOWLEDGE } from './knowledge-science';
import { ENGLISH_KNOWLEDGE } from './knowledge-english';
import { SST_KNOWLEDGE } from './knowledge-sst';

export const ALL_SUBJECTS: SubjectKnowledge[] = [
  MATHS_KNOWLEDGE,
  SCIENCE_KNOWLEDGE,
  ENGLISH_KNOWLEDGE,
  SST_KNOWLEDGE,
];

export function getSubjectKnowledge(slug: string): SubjectKnowledge | undefined {
  return ALL_SUBJECTS.find(s => s.slug === slug);
}

export function getChapterKnowledge(subjectSlug: string, chapterSlug: string): ChapterKnowledge | undefined {
  const subject = getSubjectKnowledge(subjectSlug);
  return subject?.chapters.find(c => c.slug === chapterSlug);
}

export function getAllChaptersForSubject(subjectSlug: string): ChapterKnowledge[] {
  return getSubjectKnowledge(subjectSlug)?.chapters || [];
}

export function getTopicsForChapter(subjectSlug: string, chapterSlug: string): TopicKnowledge[] {
  return getChapterKnowledge(subjectSlug, chapterSlug)?.topics || [];
}

export function buildQuizContext(subjectSlug: string, chapterSlug?: string, difficulty?: QuizDifficulty): string {
  const subject = getSubjectKnowledge(subjectSlug);
  if (!subject) return '';

  let context = `${subject.name} (${subject.book}) - Class 9 NCERT\n\n`;

  const chapters = chapterSlug
    ? subject.chapters.filter(c => c.slug === chapterSlug)
    : subject.chapters;

  for (const ch of chapters) {
    context += `Chapter ${ch.number}: ${ch.title}\n`;
    context += `Key Concepts: ${ch.keyConcepts.join(', ')}\n`;
    if (ch.formulas) context += `Formulas: ${ch.formulas.join('; ')}\n`;

    const topics = difficulty
      ? ch.topics.filter(t => t.difficulty === difficulty)
      : ch.topics;

    for (const topic of topics) {
      context += `  Topic: ${topic.name} [${topic.difficulty}]\n`;
      context += `    Concepts: ${topic.concepts.join(', ')}\n`;
      context += `    Keywords: ${topic.keywords.join(', ')}\n`;
    }
    context += '\n';
  }

  return context;
}
