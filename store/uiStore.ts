import { create } from 'zustand';

export type UI = 'ui1' | 'ui2' | 'ui3';

interface UIState {
  ui:    UI;
  setUi: (ui: UI) => void;
}

const UIS = ['ui1', 'ui2', 'ui3'] as const;

function applyUI(ui: UI) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-ui', ui);
}

export const useUIStore = create<UIState>((set) => ({
  ui: 'ui3',

  setUi: (ui) => {
    applyUI(ui);
    if (typeof localStorage !== 'undefined') localStorage.setItem('sn_ui', ui);
    set({ ui });
  },
}));

export function initUI() {
  const saved = (typeof localStorage !== 'undefined' ? localStorage.getItem('sn_ui') : null) as UI | null;
  const ui = saved && (UIS as readonly string[]).includes(saved) ? saved : 'ui3';
  applyUI(ui);
  useUIStore.setState({ ui });
}

/** Apply a UI variant WITHOUT persisting it — used for collab mirroring. */
export function applyUIOnly(ui: UI) {
  applyUI(ui);
  useUIStore.setState({ ui });
}

/** Restore the user's own saved UI (leaving a collab session). */
export function restoreOwnUI() {
  const saved = (typeof localStorage !== 'undefined' ? localStorage.getItem('sn_ui') : null) as UI | null;
  applyUIOnly(saved && (UIS as readonly string[]).includes(saved) ? saved : 'ui3');
}
