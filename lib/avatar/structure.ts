import { isEmotion } from './emotion'
import type { ResponseSection, SectionKind, StructuredResponse } from './types'

export const SYSTEM_PROMPT = [
  'You are NEXUS, an elegant futuristic AI learning tutor for students (NCERT/CBSE and beyond).',
  'Answer the user clearly and accurately. Keep every answer tight and skimmable.',
  '',
  'Return ONLY valid JSON. No prose, no code fences, no markdown.',
  'Conform exactly to this schema:',
  '{',
  '  "title": "<short topic name>",',
  '  "summary": "<one sentence, max 26 words, natural speech for text-to-speech>",',
  '  "emotion": "<one of: neutral|focused|concerned|excited|joy|sympathy|happy|surprised|thinking|sad|angry>",',
  '  "sections": [',
  '    { "heading": "<UPPERCASE hud heading, max 4 words>", "kind": "<statement|bullets|code|math|recap|joke>", "content": ["<line>", "<line>"] }',
  '  ]',
  '}',
  '',
  'Rules:',
  '- 3 to 5 sections. Vary kinds naturally (a concept statement, key points, an example, a recap).',
  '- "content" items are short. For statement/recap use 2-3 sentences as separate items. For bullets use 3-5 short fact lines. For code put each code line as one item. For math use unicode symbols (E=mc²).',
  '- Heading examples: "THE CONCEPT", "KEY POINTS", "EXAMPLE", "REMEMBER", "FORMULA", "WHY IT MATTERS".',
  '- "emotion": pick the emotional colour of the conversation + answer. Sad/frustrated user -> "sympathy" or "concerned". Joke/funny -> "joy". Serious study question -> "focused". Enthusiastic -> "excited".',
  '- Preserve conversation context already given. If the user asks a follow-up, build on previous topics instead of restarting.',
].join('\n')

const KINDS: SectionKind[] = ['statement', 'bullets', 'code', 'math', 'recap', 'joke']

function isSectionKind(value: unknown): value is SectionKind {
  return typeof value === 'string' && (KINDS as string[]).includes(value)
}

function toLines(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .filter((v): v is string => typeof v === 'string' && v.trim().length > 0)
      .map((v) => v.trim())
      .slice(0, 6)
  }
  if (typeof value === 'string' && value.trim()) {
    return value
      .split(/\n+/)
      .map((l) => l.trim())
      .filter(Boolean)
      .slice(0, 6)
  }
  return []
}

function stripJsonFences(text: string): string {
  const trimmed = text.trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fenced) return fenced[1].trim()
  const start = trimmed.indexOf('{')
  const end = trimmed.lastIndexOf('}')
  if (start >= 0 && end > start) return trimmed.slice(start, end + 1)
  return trimmed
}

export function sanitizeStructured(rawText: string): StructuredResponse | null {
  let data: unknown
  try {
    data = JSON.parse(stripJsonFences(rawText))
  } catch {
    return null
  }
  if (!data || typeof data !== 'object') return null
  const obj = data as Record<string, unknown>

  const sections: ResponseSection[] = []
  if (Array.isArray(obj.sections)) {
    for (const raw of obj.sections) {
      if (!raw || typeof raw !== 'object') continue
      const sec = raw as Record<string, unknown>
      const content = toLines(sec.content)
      if (content.length === 0) continue
      sections.push({
        id: `sec-${sections.length}`,
        heading:
          typeof sec.heading === 'string' && sec.heading.trim()
            ? sec.heading.trim().toUpperCase().slice(0, 32)
            : 'SECTION',
        kind: isSectionKind(sec.kind) ? sec.kind : content.length > 2 ? 'bullets' : 'statement',
        content,
      })
    }
  }
  if (sections.length === 0) return null

  const title =
    typeof obj.title === 'string' && obj.title.trim() ? obj.title.trim().slice(0, 48) : 'AI Learn'
  let summary =
    typeof obj.summary === 'string' && obj.summary.trim() ? obj.summary.trim() : ''
  if (!summary) {
    summary = sections
      .flatMap((s) => s.content)
      .slice(0, 2)
      .join(' ')
  }

  return {
    title,
    summary: summary.slice(0, 400),
    emotion: isEmotion(obj.emotion) ? obj.emotion : 'neutral',
    sections: sections.slice(0, 6),
  }
}

function grabString(jsonish: string, key: string): string | null {
  const match = jsonish.match(new RegExp(`"${key}"\\s*:\\s*"(\\\\.|[^"\\\\])*`, 'i'))
  if (!match) return null
  return match[0]
    .replace(/^[^:]*:\s*"/, '')
    .replace(/\\"/g, '"')
    .replace(/\\n/g, ' ')
}

export function salvageStructured(rawText: string): StructuredResponse | null {
  const text = stripJsonFences(rawText)
  if (!text.trim()) return null

  const title = grabString(text, 'title')?.trim().slice(0, 48)
  const summary = grabString(text, 'summary')?.trim()
  const emotionRaw = grabString(text, 'emotion')?.trim()
  if (!title && !summary) return null

  const trimmed = (title || 'AI Learn').trim()
  const line = (summary || trimmed).slice(0, 400)
  const lines = line.split(/(?<=[.!?])\s+/).map((l) => l.trim()).filter(Boolean).slice(0, 3)

  return {
    title: trimmed,
    summary: line,
    emotion: emotionRaw && isEmotion(emotionRaw) ? emotionRaw : 'neutral',
    sections: [
      {
        id: 'sec-0',
        heading: 'RESPONSE',
        kind: 'statement',
        content: lines.length ? lines : [line],
      },
    ],
  }
}

export function buildFallback(rawText: string, title = 'AI Learn'): StructuredResponse {
  const content = rawText
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 6)

  return {
    title,
    summary: content[0] ?? 'Here is what I found.',
    emotion: 'concerned',
    sections: [
      {
        id: 'sec-0',
        heading: 'RESPONSE',
        kind: 'statement',
        content: content.length ? content : ['The response could not be structured.'],
      },
    ],
  }
}

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'your', 'all', 'can', 'with', 'what',
  'how', 'why', 'this', 'that', 'from', 'have', 'has', 'was', 'were', 'tell', 'about',
  'explain', 'please', 'some', 'would', 'could', 'should', 'there', 'their', 'its', 'it',
])

export function memoryTopicsFromUser(userText: string): string[] {
  const words = userText
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w))
  const seen = new Set<string>()
  const tags: string[] = []
  for (const w of words) {
    if (seen.has(w)) continue
    seen.add(w)
    tags.push(w.slice(0, 14))
    if (tags.length >= 3) break
  }
  return tags
}
