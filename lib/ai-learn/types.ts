export type FaceState = "idle" | "peek" | "listening" | "thinking" | "talking" | "joke"

export type NoteSection = {
  id: string
  heading: string
  points: string[]
  isJoke?: boolean
}

export type Topic = {
  id: string
  title: string
  keywords: string[]
  sections: NoteSection[]
}
