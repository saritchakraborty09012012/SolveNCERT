import type { NextApiRequest, NextApiResponse } from 'next'
import { createAdminClient, supabase } from '@/lib/supabase'
import crypto from 'crypto'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = createAdminClient()

  if (req.method === 'GET') {
    const { share_token } = req.query

    if (!share_token || typeof share_token !== 'string') {
      return res.status(400).json({
        error: { code: 'EMPTY', message: 'share_token is required.' },
      })
    }

    const { data, error } = await admin
      .from('generated_flashcards')
      .select('id, cards, share_token, created_at, class_level, subject, book, chapter, chapter_number')
      .eq('share_token', share_token)
      .limit(1)
      .single()

    if (error || !data) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Shared flashcard not found.' },
      })
    }

    const classNum = parseInt((data.class_level || '').replace('class-', ''), 10) || 9

    return res.status(200).json({
      sharedFlashcard: {
        title: `${data.chapter} - Class ${classNum} ${data.subject}`,
        pages: data.cards,
        metadata: {
          classLevel: classNum,
          subject: data.subject,
          book: data.book,
          chapter: data.chapter,
          chapterNumber: data.chapter_number || 1,
          numPages: Array.isArray(data.cards) ? data.cards.length : 0,
          totalQuestions: Array.isArray(data.cards)
            ? data.cards.reduce((acc: number, p: { questions?: unknown[] }) => acc + (p.questions?.length || 0), 0)
            : 0,
          generatedAt: data.created_at,
        },
      },
      shareToken: data.share_token,
      createdAt: data.created_at,
    })
  }

  if (req.method === 'POST') {
    const { flashcardId } = req.body

    if (!flashcardId) {
      return res.status(400).json({
        error: { code: 'EMPTY', message: 'flashcardId is required.' },
      })
    }

    // Check if share token already exists
    const { data: existing } = await admin
      .from('generated_flashcards')
      .select('share_token')
      .eq('id', flashcardId)
      .limit(1)
      .single()

    if (existing?.share_token) {
      return res.status(200).json({
        shareToken: existing.share_token,
        message: 'Share link already exists.',
      })
    }

    const shareToken = crypto.randomBytes(16).toString('hex')

    const { error: updateError } = await admin
      .from('generated_flashcards')
      .update({
        share_token: shareToken,
        is_public: true,
      })
      .eq('id', flashcardId)

    if (updateError) {
      console.error('Failed to create share token:', updateError)
      return res.status(500).json({
        error: { code: 'DB', message: 'Failed to create share link.' },
      })
    }

    return res.status(200).json({
      shareToken,
      message: 'Share link created successfully.',
    })
  }

  return res.status(405).json({ error: { code: 'METHOD', message: 'Method not allowed.' } })
}
