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

/**
 * A file attached to a message (e.g. an image, PDF, or any text/code file).
 * `dataUrl` holds a base64 data URL produced by FileReader.readAsDataURL.
 */
export type AvatarAttachment = {
  name: string
  mimeType: string
  size: number
  dataUrl: string
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
