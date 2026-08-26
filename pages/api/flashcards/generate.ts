import type { NextApiRequest, NextApiResponse } from 'next'
import { GoogleGenAI } from '@google/genai'
import { createAdminClient } from '@/lib/supabase'

const PRIMARY_MODEL = 'gemini-3.6-flash'
const FALLBACK_MODELS = ['gemini-flash-latest', 'gemini-flash-lite-latest']

function friendlyError(message: string): { code: string; message: string } {
  if (/api key|forbidden|401|403|permission|invalid api/i.test(message)) {
    return { code: 'AUTH', message: 'AI service authentication failed.' }
  }
  if (/quota|429|rate limit|resource exhausted/i.test(message)) {
    return { code: 'QUOTA', message: 'AI service quota exceeded. Please try again.' }
  }
  if (/network|fetch failed|undici|socket hang up/i.test(message)) {
    return { code: 'NETWORK', message: 'Network error while reaching the AI service.' }
  }
  return { code: 'API', message: 'The AI service returned an error. Please try again.' }
}

interface GenerateRequest {
  classLevel: number
  subject: string
  book: string
  chapter: string
  chapterNumber: number
  numPages: number
}

interface FlashcardQuestion {
  question: string
  answer: string
}

interface FlashcardPage {
  questions: FlashcardQuestion[]
}

interface GeminiResponse {
  questions: FlashcardQuestion[]
}

function distributeQuestions(questions: FlashcardQuestion[], numPages: number): FlashcardPage[] {
  const perPage = Math.ceil(questions.length / numPages)
  const pages: FlashcardPage[] = []
  for (let i = 0; i < numPages; i++) {
    const slice = questions.slice(i * perPage, (i + 1) * perPage)
    if (slice.length > 0) {
      pages.push({ questions: slice })
    }
  }
  return pages
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { code: 'METHOD', message: 'Method not allowed.' } })
  }

  const apiKey = process.env.GEMINI_FLASHCARD_KEY || process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: { code: 'NO_KEY', message: 'GEMINI_FLASHCARD_KEY is not configured.' } })
  }

  const body: GenerateRequest = req.body
  if (!body.subject || !body.chapter || !body.numPages || !body.classLevel) {
    return res.status(400).json({ error: { code: 'EMPTY', message: 'classLevel, subject, chapter, and numPages are required.' } })
  }

  const totalQuestions = body.numPages * 4
  const admin = createAdminClient()

  // Check cache for class 9
  if (body.classLevel === 9) {
    try {
      const { data: cached } = await admin
        .from('generated_flashcards')
        .select('id, cards, created_at')
        .eq('class_level', 'class-9')
        .eq('subject', body.subject)
        .eq('chapter', body.chapter)
        .limit(1)
        .single()

      if (cached && cached.cards && Array.isArray(cached.cards) && cached.cards.length > 0) {
        return res.status(200).json({
          flashcards: {
            title: `${body.chapter} - Class ${body.classLevel} ${body.subject}`,
            pages: cached.cards,
            metadata: {
              classLevel: body.classLevel,
              subject: body.subject,
              book: body.book,
              chapter: body.chapter,
              chapterNumber: body.chapterNumber || 1,
              numPages: body.numPages,
              totalQuestions: cached.cards.reduce((acc: number, p: FlashcardPage) => acc + p.questions.length, 0),
              generatedAt: cached.created_at,
            },
          },
          cached: true,
          flashcardId: cached.id,
        })
      }
    } catch {
      // Cache miss — continue to generate
    }
  }

  const prompt = `You are a flashcard generator for CBSE students. Generate exactly ${totalQuestions} exam-relevant questions with detailed answers covering the FULL chapter: "${body.chapter}" from Class ${body.classLevel} ${body.subject} (Book: ${body.book}).

Requirements:
- Mix easy, medium, and hard questions
- Include definitions, explanations, examples, and applications
- Cover the ENTIRE chapter, not just the beginning
- Make questions clear and concise
- Make answers informative but brief (2-4 sentences each)

Return ONLY valid JSON (no markdown, no extra text):
{"questions": [{"question": "...", "answer": "..."}]}`

  const ai = new GoogleGenAI({ apiKey })
  let lastError: unknown = null

  for (const model of [PRIMARY_MODEL, ...FALLBACK_MODELS]) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
          maxOutputTokens: 65536,
        },
      })

      const raw = response.text?.trim()
      if (!raw) {
        return res.status(502).json({ error: { code: 'EMPTY', message: 'The AI service returned an empty response.' } })
      }

      let parsed: GeminiResponse
      try {
        parsed = JSON.parse(raw)
      } catch {
        const match = raw.match(/\{[\s\S]*\}/)
        if (match) {
          parsed = JSON.parse(match[0])
        } else {
          return res.status(502).json({ error: { code: 'PARSE', message: 'Could not parse AI response.' } })
        }
      }

      if (!parsed.questions || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
        return res.status(502).json({ error: { code: 'PARSE', message: 'AI response missing questions array.' } })
      }

      const pages = distributeQuestions(parsed.questions, body.numPages)

      const flashcardData = {
        title: `${body.chapter} - Class ${body.classLevel} ${body.subject}`,
        pages,
        metadata: {
          classLevel: body.classLevel,
          subject: body.subject,
          book: body.book,
          chapter: body.chapter,
          chapterNumber: body.chapterNumber || 1,
          numPages: body.numPages,
          totalQuestions: parsed.questions.length,
          generatedAt: new Date().toISOString(),
        },
      }

      // Save to cache (non-blocking)
      try {
        await admin.from('generated_flashcards').insert({
          class_level: `class-${body.classLevel}`,
          subject: body.subject,
          book: body.book,
          chapter: body.chapter,
          chapter_number: body.chapterNumber || 1,
          cards: pages,
          total_cards: parsed.questions.length,
        })
      } catch (saveErr) {
        console.error('Failed to cache flashcard:', saveErr)
      }

      return res.status(200).json({
        flashcards: flashcardData,
        cached: false,
      })
    } catch (err) {
      lastError = err
      const message = err instanceof Error ? err.message : String(err)
      if (/(not found|404|not supported|does not exist|invalid argument.*model)/i.test(message)) continue
      break
    }
  }

  const message = lastError instanceof Error ? lastError.message : String(lastError)
  console.error('Flashcard generation error:', message)
  const friendly = friendlyError(message)
  if (process.env.NODE_ENV === 'development' && message) (friendly as any).detail = message.slice(0, 500)
  return res.status(502).json({ error: friendly })
}
