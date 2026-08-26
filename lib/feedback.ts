import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';

export type FeedbackSource =
  | 'general'
  | 'ai-notes'
  | 'ai-flashcards'
  | 'ai-doubt-solver'
  | 'ai-search'
  | 'ai-learn'
  | 'ai-practice'
  | 'ai-mock-test';

interface SubmitFeedbackOpts {
  stars: number;
  source?: FeedbackSource;
  keywords?: string[];
  text?: string;
}

/**
 * Submit star-rating feedback. Only logged-in users can submit.
 */
export async function submitFeedback({
  stars,
  source = 'general',
  keywords,
  text,
}: SubmitFeedbackOpts): Promise<boolean> {
  const { user } = useAuthStore.getState();
  if (!user) return false;

  const { error } = await supabase.from('feedback').insert({
    user_id: user.id,
    star_rating: stars,
    source,
    keywords: keywords?.length ? keywords : null,
    experience_text: text?.trim() || null,
  });
  return !error;
}
