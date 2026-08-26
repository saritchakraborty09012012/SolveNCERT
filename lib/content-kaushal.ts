import type { Chapter } from './content';
import { KAUSHAL_CH1_3_CHAPTERS } from './content-kaushal-ch1-3';
import { KAUSHAL_CH5_6_CHAPTERS } from './content-kaushal-ch5-6';
import { KAUSHAL_CH7_9_CHAPTERS } from './content-kaushal-ch7-9';
import { KAUSHAL_CH10_12_CHAPTERS } from './content-kaushal-ch10-12';

// Kaushal Vikas (Skill Education — Class 9, NCERT 2026 Revised).
// Chapters 1–3: Work with Life Forms (Agriculture, Rooftop Gardening, Precision Farming)
// 5–6: Shaping Materials & Construction | 7 & 9: Apparel & Personal and Lifestyle Services
// 10–12: Healthcare, Tourism & Additional Vocations.
// Chapters 4 and 8 (Additional Vocations) carry no numbered Q&A in the textbook, so
// they are omitted. All answers transcribed from the solution answer banks.
export const KAUSHAL_VIKAS_CHAPTERS: Chapter[] = [
  ...KAUSHAL_CH1_3_CHAPTERS,
  ...KAUSHAL_CH5_6_CHAPTERS,
  ...KAUSHAL_CH7_9_CHAPTERS,
  ...KAUSHAL_CH10_12_CHAPTERS,
];