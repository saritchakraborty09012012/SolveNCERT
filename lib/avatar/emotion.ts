import type { Expression } from '@/lib/avatar-types'
import type { AvatarStatus } from './types'

export interface EmotionClassifier {
  classifyUser(text: string): Expression | null
  classifyAi(text: string): Expression | null
}

const VALID: readonly Expression[] = [
  'neutral',
  'happy',
  'sad',
  'angry',
  'surprised',
  'thinking',
  'focused',
  'concerned',
  'excited',
  'joy',
  'sympathy',
]

export function isEmotion(value: unknown): value is Expression {
  return typeof value === 'string' && (VALID as readonly string[]).includes(value)
}

const RE = {
  frustrated:
    /\b(frustrat|confus|don'?t understand|do not understand|\bstuck\b|help me understand|i don'?t get it|no idea|lost|struggling)\b/i,
  sad: /\b(sad|upset|depress|scared|anxious|worri|afraid|hurt|cry|lonely|tired of)\b/i,
  grateful: /\b(thanks|thank you|great|awesome|amazing|love it|perfect|wow|nice|cool|appreciate)\b/i,
  joke: /\b(joke|funny|make me laugh|humor|humour|laugh)\b/i,
  excitedUser: /\b(wow|amazing|excited|crazy|whoa|let'?s go|finally)\b/i,
  academic:
    /\b(what is|define|explain|how does|how do|why does|why do|difference between|ncert|cbse|formula|equation|physics|chemistry|biology|mathematics|maths|math|history|geography|science|definition|concept|exam|exam|solve|derive)\b/i,
  clear: /\b(i get it|understood|makes sense|now i see|clear now|got it)\b/i,
}

export class RuleEmotionClassifier implements EmotionClassifier {
  classifyUser(text: string): Expression | null {
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

  classifyAi(text: string): Expression | null {
    const t = ` ${text.trim()} `
    if (RE.joke.test(t)) return 'joy'
    if (RE.excitedUser.test(t)) return 'excited'
    if (RE.sad.test(t)) return 'sympathy'
    if (RE.clear.test(t)) return 'happy'
    return null
  }
}

export const ruleEmotionClassifier = new RuleEmotionClassifier()

export type EmotionSignal = {
  userText?: string
  aiText?: string
  aiEmotion?: Expression | null
  override?: Expression | null
  typing?: boolean
  status: AvatarStatus
}

export function deriveExpression({
  userText,
  aiText,
  aiEmotion,
  override,
  typing,
  status,
}: EmotionSignal): Expression {
  if (status === 'thinking' || status === 'generating') return 'thinking'
  if (typing && status !== 'speaking') return 'neutral'
  if (override && isEmotion(override)) return override

  const user = userText ? ruleEmotionClassifier.classifyUser(userText) : null
  const strongNegative: Expression[] = ['concerned', 'sympathy']
  if (user && strongNegative.includes(user)) return user

  if (status === 'speaking') {
    if (aiEmotion && isEmotion(aiEmotion)) return aiEmotion
    const ai = aiText ? ruleEmotionClassifier.classifyAi(aiText) : null
    return ai ?? user ?? 'neutral'
  }

  if (aiEmotion && isEmotion(aiEmotion)) return aiEmotion
  if (aiText) {
    const ai = ruleEmotionClassifier.classifyAi(aiText)
    if (ai) return ai
  }
  return user ?? 'neutral'
}
