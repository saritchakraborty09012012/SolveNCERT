import { buildFallback, salvageStructured, sanitizeStructured } from './structure'
import type { AvatarAttachment, ConversationMessage, StructuredResponse } from './types'
import { getProfile } from '@/lib/ai-learn/profile'

type ApiErrorBody = { code?: string; message?: string }

export class GeminiApiError extends Error {
  code: string
  constructor(body?: ApiErrorBody | null) {
    super(body?.message ?? 'Unknown AI service error.')
    this.name = 'GeminiApiError'
    this.code = body?.code ?? 'API'
  }
}

export type ModelConfig = { configured: boolean; model: string }

export async function fetchModelConfig(): Promise<ModelConfig> {
  try {
    const res = await fetch('/api/ai-learn', { method: 'GET' })
    if (!res.ok) return { configured: false, model: '' }
    const data = await res.json().catch(() => null)
    return { configured: Boolean(data?.configured), model: String(data?.model ?? '') }
  } catch {
    return { configured: false, model: '' }
  }
}

export async function askGemini(
  messages: ConversationMessage[],
  mode?: string,
  attachments?: AvatarAttachment[],
): Promise<StructuredResponse> {
  const profile = getProfile()

  let res: Response
  try {
    res = await fetch('/api/ai-learn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        mode: mode ?? undefined,
        attachments: attachments
          ?.map((a) => ({ name: a.name, mimeType: a.mimeType, size: a.size, dataUrl: a.dataUrl }))
          ?? undefined,
        profile: profile.completedOnboarding
          ? {
              classLevel: profile.classLevel,
              board: profile.board,
              language: profile.language,
              learningGoals: profile.learningGoals,
              targetMarks: profile.targetMarks,
              weakSubjects: profile.weakSubjects,
              teachingStyles: profile.teachingStyles,
              competitiveExams: profile.competitiveExams,
              otherExam: profile.otherExam,
            }
          : undefined,
      }),
    })
  } catch {
    throw new GeminiApiError({
      code: 'NETWORK',
      message: 'Could not reach the AI service. Check your connection.',
    })
  }

  const data: { text?: string; structured?: StructuredResponse; error?: ApiErrorBody } =
    await res.json().catch(() => ({}))

  if (!res.ok || data.error) {
    throw new GeminiApiError(data.error ?? null)
  }

  const text = (data.text ?? '').trim()
  if (!text) {
    throw new GeminiApiError({ code: 'EMPTY', message: 'The AI service returned nothing.' })
  }

  return (
    data.structured ??
    sanitizeStructured(text) ??
    salvageStructured(text) ??
    buildFallback(text)
  )
}
