import { useMemo } from 'react'
import type { Expression } from '@/lib/avatar-types'
import type { AvatarStatus } from '@/lib/avatar/types'

export interface EmotionClassifier {
  classifyUser(text: string): Expression | null
  classifyAi(text: string): Expression | null
}

export function deriveExpression(signal: {
  userText?: string
  aiText?: string
  aiEmotion?: Expression | null
  override?: Expression | null
  typing?: boolean
  status: AvatarStatus
}): Expression {
  if (signal.status === 'thinking' || signal.status === 'generating') return 'thinking'
  if (signal.typing && signal.status !== 'speaking') return 'neutral'
  if (signal.override) return signal.override

  const RE = {
    frustrated: /\b(frustrat|confus|don'?t understand|stuck|struggling)\b/i,
    sad: /\b(sad|upset|depress|scared|anxious|worried|afraid)\b/i,
    grateful: /\b(thanks|thank you|great|awesome|amazing|perfect|wow)\b/i,
    joke: /\b(joke|funny|make me laugh|humor)\b/i,
    excitedUser: /\b(wow|amazing|excited|crazy|whoa|let'?s go)\b/i,
    academic: /\b(what is|define|explain|how does|formula|equation|physics|chemistry|biology|math|science|ncert|cbse)\b/i,
    clear: /\b(i get it|understood|makes sense|clear now|got it)\b/i,
  }

  const classifyUser = (text: string): Expression | null => {
    const t = ` ${text.trim()} `
    if (RE.joke.test(t)) return 'joy'
    if (RE.clear.test(t)) return 'happy'
    if (RE.grateful.test(t)) return 'happy'
    if (RE.frustrated.test(t)) return 'concerned'
    if (RE.sad.test(t)) return 'sympathy'
    if (RE.academic.test(t)) return 'focused'
    if (RE.excitedUser.test(t)) return 'excited'
    return null
  }

  const classifyAi = (text: string): Expression | null => {
    const t = ` ${text.trim()} `
    if (RE.joke.test(t)) return 'joy'
    if (RE.excitedUser.test(t)) return 'excited'
    if (RE.sad.test(t)) return 'sympathy'
    if (RE.clear.test(t)) return 'happy'
    return null
  }

  const user = signal.userText ? classifyUser(signal.userText) : null
  const strongNegative: Expression[] = ['concerned', 'sympathy']
  if (user && strongNegative.includes(user)) return user

  if (signal.status === 'speaking') {
    if (signal.aiEmotion) return signal.aiEmotion
    const ai = signal.aiText ? classifyAi(signal.aiText) : null
    return ai ?? user ?? 'neutral'
  }

  if (signal.aiEmotion) return signal.aiEmotion
  if (signal.aiText) {
    const ai = classifyAi(signal.aiText)
    if (ai) return ai
  }
  return user ?? 'neutral'
}

export type EmotionSignal = {
  userText?: string
  aiText?: string
  aiEmotion?: Expression | null
  override?: Expression | null
  typing?: boolean
  status: AvatarStatus
}

export function useEmotionController(signal: EmotionSignal): Expression {
  return useMemo(
    () => deriveExpression(signal),
    [signal.userText, signal.aiText, signal.aiEmotion, signal.status, signal.override, signal.typing],
  )
}
