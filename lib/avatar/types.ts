import type { Expression } from '@/lib/avatar-types'

export type AvatarStatus = 'idle' | 'listening' | 'thinking' | 'generating' | 'speaking'

export type GazePoint = {
  x: number
  y: number
}

export type GazeTarget =
  | 'forward'
  | 'input'
  | 'status'
  | 'generation'
  | 'left'
  | 'right'

export type ConversationMessage = {
  role: 'user' | 'model'
  text: string
}

export type SectionKind =
  | 'statement'
  | 'bullets'
  | 'code'
  | 'math'
  | 'recap'
  | 'joke'

export type ResponseSection = {
  id: string
  heading: string
  kind: SectionKind
  content: string[]
}

export type StructuredResponse = {
  title: string
  summary: string
  emotion: Expression
  sections: ResponseSection[]
}

export type SystemCapabilities = {
  apiKeyConfigured: boolean
  speechSupported: boolean
  recognitionSupported: boolean
}

export type SecurityState = {
  sessionSecure: boolean
  connectionSecure: boolean
  inputProtected: boolean
  since: string
}
