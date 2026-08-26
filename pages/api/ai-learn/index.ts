import type { NextApiRequest, NextApiResponse } from 'next'
import { GoogleGenAI } from '@google/genai'
import { salvageStructured, sanitizeStructured } from '@/lib/avatar/structure'
import { buildSystemPrompt } from '@/lib/ai-learn/system-prompt'

const PRIMARY_MODEL = 'gemini-3.6-flash'
const FALLBACK_MODELS = ['gemini-flash-latest', 'gemini-flash-lite-latest']

type IncomingMessage = { role?: string; text?: string }

function friendlyError(message: string): { code: string; message: string } {
  if (/api key|forbidden|401|403|permission|invalid api/i.test(message)) {
    return { code: 'AUTH', message: 'AI service authentication failed. Check that GEMINI_API_KEY is valid.' }
  }
  if (/quota|429|rate limit|resource exhausted/i.test(message)) {
    return { code: 'QUOTA', message: 'AI service quota exceeded. Please try again in a moment.' }
  }
  if (/network|fetch failed|undici|socket hang up/i.test(message)) {
    return { code: 'NETWORK', message: 'Network error while reaching the AI service.' }
  }
  return { code: 'API', message: 'The AI service returned an error. Please try again.' }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return res.json({ configured: Boolean(process.env.GEMINI_API_KEY), model: PRIMARY_MODEL })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: { code: 'METHOD', message: 'Method not allowed.' } })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: { code: 'NO_KEY', message: 'GEMINI_API_KEY is not configured.' } })
  }

  let body: { messages?: IncomingMessage[]; mode?: string; profile?: Record<string, unknown> } = {}
  try { body = req.body } catch { /* malformed */ }

  const messages = Array.isArray(body.messages) ? body.messages.filter((m) => m && m.text) : []
  if (messages.length === 0) {
    return res.status(400).json({ error: { code: 'EMPTY', message: 'No message supplied.' } })
  }

  const mode = typeof body.mode === 'string' ? body.mode : undefined
  const profile = body.profile as { classLevel?: string; board?: string; language?: string; learningGoals?: string[]; targetMarks?: string; weakSubjects?: string[]; teachingStyles?: string[]; competitiveExams?: string[]; otherExam?: string } | undefined

  const systemPrompt = buildSystemPrompt(
    profile ? {
      classLevel: profile.classLevel ?? '',
      board: profile.board ?? 'CBSE',
      language: profile.language ?? 'English',
      learningGoals: profile.learningGoals ?? [],
      targetMarks: profile.targetMarks ?? '',
      weakSubjects: profile.weakSubjects ?? [],
      teachingStyles: profile.teachingStyles ?? [],
      competitiveExams: profile.competitiveExams ?? [],
      otherExam: profile.otherExam ?? '',
      completedOnboarding: true,
    } : null,
    mode,
  )

  const contents = messages.map((m) => ({
    role: m.role === 'model' ? 'model' : 'user',
    parts: [{ text: String(m.text) }],
  }))

  const ai = new GoogleGenAI({ apiKey })
  let lastError: unknown = null

  for (const model of [PRIMARY_MODEL, ...FALLBACK_MODELS]) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          temperature: 0.6,
          maxOutputTokens: 2000,
        },
      })

      const raw = response.text?.trim()
      if (!raw) {
        return res.status(502).json({ error: { code: 'EMPTY', message: 'The AI service returned an empty response.' } })
      }

      return res.json({
        text: raw,
        structured: sanitizeStructured(raw) ?? salvageStructured(raw) ?? null,
      })
    } catch (err) {
      lastError = err
      const message = err instanceof Error ? err.message : String(err)
      if (/(not found|404|not supported|does not exist|invalid argument.*model)/i.test(message)) continue
      break
    }
  }

  const message = lastError instanceof Error ? lastError.message : String(lastError)
  return res.status(502).json({ error: friendlyError(message) })
}
