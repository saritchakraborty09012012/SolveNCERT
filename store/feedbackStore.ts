import { create } from 'zustand';
import { useAuthStore } from '@/store/authStore';

export type AiToolName =
  | 'ai-notes'
  | 'ai-flashcards'
  | 'ai-doubt-solver'
  | 'ai-search'
  | 'ai-learn'
  | 'ai-practice'
  | 'ai-mock-test'
  | 'ask-anything';

const AI_RATED_KEY = 'sn_feedback_ai_rated';
const AI_INTERACTIONS_KEY = 'sn_feedback_ai_interactions';

/** Minimum interactions before showing AI tool rating */
const INTERACTION_THRESHOLDS: Record<AiToolName, number> = {
  'ai-notes': 1,        // generate once = done
  'ai-flashcards': 1,   // generate once = done
  'ai-doubt-solver': 2, // 2 questions answered
  'ai-search': 1,       // 1 search = done
  'ai-learn': 3,        // 3 exchanges with tutor
  'ai-practice': 1,     // generate + submit = done
  'ai-mock-test': 1,    // generate + submit = done
  'ask-anything': 2,    // 2 questions answered
};

function getAiRatedTools(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(AI_RATED_KEY) || '{}');
  } catch {
    return {};
  }
}

function markAiRated(tool: string) {
  const map = getAiRatedTools();
  map[tool] = true;
  localStorage.setItem(AI_RATED_KEY, JSON.stringify(map));
}

function getAiInteractions(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(AI_INTERACTIONS_KEY) || '{}');
  } catch {
    return {};
  }
}

function incrementAiInteraction(tool: string): number {
  const map = getAiInteractions();
  map[tool] = (map[tool] || 0) + 1;
  localStorage.setItem(AI_INTERACTIONS_KEY, JSON.stringify(map));
  return map[tool];
}

interface FeedbackState {
  /** AI tool rating popup state */
  pendingAiTool: AiToolName | null;
  showAiRatingFor: (toolName: AiToolName) => void;
  dismissAiRating: () => void;
  markAiToolRated: (toolName: AiToolName) => void;
}

export const useFeedbackStore = create<FeedbackState>((set) => ({
  pendingAiTool: null,

  /** Logged-in users only. Called AFTER the user completes an experience. */
  showAiRatingFor: (toolName) => {
    if (typeof window === 'undefined') return;

    // Feedback is only for logged-in / premium users
    const { user } = useAuthStore.getState();
    if (!user) return;

    // Already rated this tool? Don't show again
    const rated = getAiRatedTools();
    if (rated[toolName]) return;

    // Increment interaction count; only show once threshold reached
    const count = incrementAiInteraction(toolName);
    const threshold = INTERACTION_THRESHOLDS[toolName] || 1;

    if (count >= threshold) {
      set({ pendingAiTool: toolName });
    }
  },

  dismissAiRating: () => set({ pendingAiTool: null }),

  markAiToolRated: (toolName) => {
    markAiRated(toolName);
    set({ pendingAiTool: null });
  },
}));
