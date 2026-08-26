import type { NextApiRequest, NextApiResponse } from 'next'
import { GoogleGenAI } from '@google/genai'

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

interface NotesRequest {
  subject: string
  book: string
  chapter: string
  chapterNumber?: number
  chapterContent?: string
  instructions?: string
  classLevel?: string
}

const NOTES_SYSTEM_PROMPT = `You are an expert NCERT Class 9 teacher creating comprehensive handwritten-style study notes.

Your task is to generate detailed, well-structured notes for the given chapter. The notes should be suitable for a student preparing for exams.

OUTPUT FORMAT:
Return a JSON object with this exact structure:
{
  "title": "Chapter Title",
  "pages": [
    {
      "pageNumber": 1,
      "sections": [
        {
          "heading": "Section Heading (numbered)",
          "content": "The main content of this section...",
          "isBold": false,
          "subsections": [
            {
              "heading": "Sub-section heading",
              "content": "Sub-section content..."
            }
          ],
          "bulletPoints": ["Point 1", "Point 2"],
          "table": {
            "headers": ["Col1", "Col2"],
            "rows": [["Val1", "Val2"]]
          }
        }
      ]
    }
  ]
}

GUIDELINES:
- Generate 6-12 pages of detailed notes
- Use numbered headings (1. Introduction, 2. Topic Name, etc.)
- Include key definitions, formulas, diagrams descriptions, examples
- Use bullet points for lists of items
- Include tables where comparison is needed
- Bold important terms using **term** in content
- Keep content academic but easy to understand
- Cover all major topics from the chapter with equal weightage
- If user provided specific instructions, follow them for content style (point-wise vs paragraph, emphasis areas, word limits)
- Each page should have 3-5 sections with adequate content
- Make notes comprehensive enough for exam preparation
- Use simple, clear language suitable for Class 9 students`

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { code: 'METHOD', message: 'Method not allowed.' } })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: { code: 'NO_KEY', message: 'GEMINI_API_KEY is not configured.' } })
  }

  const body: NotesRequest = req.body
  if (!body.subject || !body.chapter) {
    return res.status(400).json({ error: { code: 'EMPTY', message: 'Subject and chapter are required.' } })
  }

  const userMessage = `Generate comprehensive notes for:
Subject: ${body.subject}
Book: ${body.book}
Chapter: ${body.chapter}${body.chapterNumber ? ` (Chapter ${body.chapterNumber})` : ''}
${body.chapterContent ? `\nChapter Content/Context:\n${body.chapterContent}` : ''}
${body.instructions ? `\n\nSpecial Instructions from student:\n${body.instructions}` : ''}

Generate detailed notes covering all topics in this chapter. Return as JSON with the specified structure.`

  const ai = new GoogleGenAI({ apiKey })
  let lastError: unknown = null

  for (const model of [PRIMARY_MODEL, ...FALLBACK_MODELS]) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        config: {
          systemInstruction: NOTES_SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          temperature: 0.7,
          maxOutputTokens: 65536,
        },
      })

      const raw = response.text?.trim()
      if (!raw) {
        return res.status(502).json({ error: { code: 'EMPTY', message: 'The AI service returned an empty response.' } })
      }

      let parsed: Record<string, unknown>
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

      return res.json({ notes: parsed })
    } catch (err) {
      lastError = err
      const message = err instanceof Error ? err.message : String(err)
      if (/(not found|404|not supported|does not exist|invalid argument.*model)/i.test(message)) continue
      break
    }
  }

  const message = lastError instanceof Error ? lastError.message : String(lastError)
  console.error('Notes generation error:', message)
  const friendly = friendlyError(message)
  if (process.env.NODE_ENV === 'development' && message) (friendly as any).detail = message.slice(0, 500)
  return res.status(502).json({ error: friendly })
}
