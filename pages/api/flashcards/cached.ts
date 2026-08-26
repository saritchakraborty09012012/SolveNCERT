import type { NextApiRequest, NextApiResponse } from 'next'
import { createAdminClient } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: { code: 'METHOD', message: 'Method not allowed.' } })
  }

  const { classLevel, subject, chapter, numPages } = req.query

  if (!classLevel || !subject || !chapter || !numPages) {
    return res.status(400).json({
      error: { code: 'EMPTY', message: 'classLevel, subject, chapter, and numPages are required.' },
    })
  }

  const admin = createAdminClient()

  const { data, error } = await admin
    .from('generated_flashcards')
    .select('id, cards, created_at')
    .eq('class_level', `class-${classLevel}`)
    .eq('subject', String(subject))
    .eq('chapter', String(chapter))
    .limit(1)
    .single()

  if (error || !data) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'No cached flashcard found.' },
    })
  }

  const classNum = parseInt(String(classLevel), 10) || 9

  return res.status(200).json({
    flashcards: {
      title: `${chapter} - Class ${classNum} ${subject}`,
      pages: data.cards,
      metadata: {
        classLevel: classNum,
        subject,
        book: '',
        chapter,
        chapterNumber: 1,
        numPages: Array.isArray(data.cards) ? data.cards.length : 0,
        totalQuestions: Array.isArray(data.cards)
          ? data.cards.reduce((acc: number, p: { questions?: unknown[] }) => acc + (p.questions?.length || 0), 0)
          : 0,
        generatedAt: data.created_at,
      },
    },
    cached: true,
    cachedAt: data.created_at,
    flashcardId: data.id,
  })
}
