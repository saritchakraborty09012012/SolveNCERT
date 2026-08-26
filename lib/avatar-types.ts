export type Expression =
  | 'neutral'
  | 'happy'
  | 'sad'
  | 'angry'
  | 'surprised'
  | 'thinking'
  | 'focused'
  | 'concerned'
  | 'excited'
  | 'joy'
  | 'sympathy'

export type SpeechState = {
  speaking: boolean
  amp: number
  word?: string
  wordAt?: number
}

export const EMOJI_EXPRESSION: Record<string, Expression> = {
  '😀': 'happy',
  '😃': 'happy',
  '😄': 'happy',
  '😁': 'happy',
  '😆': 'happy',
  '😊': 'happy',
  '🙂': 'happy',
  '😍': 'happy',
  '🥰': 'happy',
  '😎': 'happy',
  '😠': 'angry',
  '😡': 'angry',
  '🤬': 'angry',
  '😤': 'angry',
  '👿': 'angry',
  '😢': 'sad',
  '😭': 'sad',
  '😞': 'sad',
  '😔': 'sad',
  '🙁': 'sad',
  '☹️': 'sad',
  '😥': 'sad',
  '😮': 'surprised',
  '😯': 'surprised',
  '😲': 'surprised',
  '😳': 'surprised',
  '😱': 'surprised',
  '🤯': 'surprised',
  '😦': 'surprised',
}

export function detectExpression(text: string): Expression {
  for (const [emoji, expression] of Object.entries(EMOJI_EXPRESSION)) {
    if (text.includes(emoji)) return expression
  }
  return 'neutral'
}

export function stripEmoji(text: string): string {
  return text
    .replace(/[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\u{FE0F}\u{200D}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
}
