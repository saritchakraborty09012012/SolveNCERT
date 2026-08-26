import type { Chapter } from './content';
import { HISTORY_ARTS_CHAPTERS } from './content-arts-history';
import { KRITI_ARTS_CHAPTERS } from './content-arts-kriti';
import { MUSIC_ARTS_CHAPTERS } from './content-arts-music';
import { DANCE_ARTS_CHAPTERS } from './content-arts-dance';
import { VISUAL_ARTS_CHAPTERS } from './content-arts-visual';

// Arts (Madhurima — Class 9, NCERT 2026 Revised).
// Chapters 1–3: History of Arts | 4–6: Kriti (Theatre & Music)
// 7–9: Music | 10–12: Dance | 13–17: Dance & Visual Arts.
// All answers transcribed from the solution answer banks.
export const ARTS_CHAPTERS: Chapter[] = [
  ...HISTORY_ARTS_CHAPTERS,
  ...KRITI_ARTS_CHAPTERS,
  ...MUSIC_ARTS_CHAPTERS,
  ...DANCE_ARTS_CHAPTERS,
  ...VISUAL_ARTS_CHAPTERS,
];
