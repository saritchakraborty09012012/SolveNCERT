import type { NextApiRequest, NextApiResponse } from 'next'
import { GoogleGenAI } from '@google/genai'

const PRIMARY_MODEL = 'gemini-3.6-flash'
const FALLBACK_MODELS = ['gemini-flash-latest', 'gemini-flash-lite-latest']

export const config = { api: { bodyParser: { sizeLimit: '2mb' } } }

interface WriteRequest {
  question?: string
  issues?: string[]
  originalAnswer?: string
  subject?: string
  classLevel?: string
  marksHint?: string
}

const SYSTEM_PROMPT = `You are a CBSE topper's answer ghost-writer for the NEW 2026 board pattern. You rewrite answers so that the STRICTEST board examiner is forced to award full marks.

RULES FOR THE PERFECT 2026-PATTERN ANSWER:
- Match length and depth exactly to the mark weightage (1/2/3/5 marks).
- Lead with the exact NCERT definition/concept, then apply it (competency-based marking).
- Hit every mandatory keyword/value-point from the NCERT-based marking scheme.
- Number your points; keep one idea per point.
- For numericals: show every step with formula → substitution → calculation → final answer WITH unit.
- Mention/describe diagrams where expected ("(Draw labelled diagram of ...)") when a diagram is essential.
- Underline-worthy key terms should be wrapped in **bold**.
- No filler, no story-telling, no irrelevant facts — strict examiners cut marks for them.

FORMAT: Return clean markdown-lite text only (use **bold**, numbered "1." points, line breaks). No headings like "Model Answer", no preamble, no explanation of what you did. Just the answer as it should be written in the copy.`

function friendlyError(message: string): { code: string; message: string } {
  if (/api key|forbidden|401|403|permission|invalid api/i.test(message)) {
    return { code: 'AUTH', message: 'AI service authentication failed.' }
  }
  if (/quota|429|rate limit|resource exhausted/i.test(message)) {
    return { code: 'QUOTA', message: 'All AI keys are rate-limited right now. Please retry in a few minutes.' }
  }
  if (/network|fetch failed|undici|socket hang up|timeout/i.test(message)) {
    return { code: 'NETWORK', message: 'Network error while reaching the AI service.' }
  }
  return { code: 'API', message: 'The AI service returned an error. Please try again.' }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { code: 'METHOD', message: 'Method not allowed.' } })
  }

  const apiKeys = Array.from(new Set([process.env.GEMINI_API_KEY, process.env.GEMINI_FLASHCARD_KEY].filter((k): k is string => Boolean(k))))
  if (apiKeys.length === 0) {
    return res.status(500).json({ error: { code: 'NO_KEY', message: 'GEMINI_API_KEY is not configured.' } })
  }

  const body = (req.body || {}) as WriteRequest
  const question = typeof body.question === 'string' ? body.question.trim().slice(0, 2000) : ''
  const issues = Array.isArray(body.issues) ? body.issues.filter((i) => typeof i === 'string' && i.trim()).slice(0, 12) : []
  const originalAnswer = typeof body.originalAnswer === 'string' ? body.originalAnswer.trim().slice(0, 4000) : ''
  const subject = typeof body.subject === 'string' && body.subject.trim() ? body.subject.trim() : 'auto-detect from question'
  const classLevel = typeof body.classLevel === 'string' && body.classLevel.trim() ? body.classLevel.trim() : 'Class 9'
  const marksHint = typeof body.marksHint === 'string' && body.marksHint.trim() ? body.marksHint.trim() : ''

  if (!question && !originalAnswer) {
    return res.status(400).json({ error: { code: 'EMPTY', message: 'Question or original answer required.' } })
  }

  const prompt = [
    `Write the perfect full-marks board answer for this question.`,
    ``,
    `Class: ${classLevel}`,
    `Subject: ${subject}`,
    marksHint ? `Mark weightage: ${marksHint}` : '',
    question ? `QUESTION: ${question}` : '',
    issues.length ? `EXAMINER REMARKS TO FIX:\n${issues.map((i, idx) => `${idx + 1}. ${i}`).join('\n')}` : '',
    originalAnswer ? `STUDENT'S ORIGINAL ANSWER (rewrite it properly):\n${originalAnswer}` : '',
    `Write ONLY the improved final answer now.`,
  ].filter(Boolean).join('\n')

  let lastError: unknown = null

  for (const apiKey of apiKeys) {
    const ai = new GoogleGenAI({ apiKey })
    for (const model of [PRIMARY_MODEL, ...FALLBACK_MODELS]) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [{ role: 'user' as const, parts: [{ text: prompt }] }],
          config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.4,
            maxOutputTokens: 4096,
          },
        })

        const text = response.text?.trim()
        if (!text) {
          return res.status(502).json({ error: { code: 'EMPTY', message: 'The AI service returned an empty response.' } })
        }

        return res.json({ answer: text.replace(/^```(?:markdown)?\s*|\s*```$/g, '').trim() })
      } catch (err) {
        lastError = err
      }
    }
  }

  const message = lastError instanceof Error ? lastError.message : String(lastError)
  return res.status(502).json({ error: friendlyError(message) })
}
