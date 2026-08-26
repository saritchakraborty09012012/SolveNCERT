import posthog from 'posthog-js';

let initialized = false;

export function initPostHog() {
  if (typeof window === 'undefined' || initialized) return;
  const key  = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
  if (!key) return;

  posthog.init(key, {
    api_host:              host || 'https://us.i.posthog.com',
    capture_pageview:      false, // manual
    capture_pageleave:     true,
    autocapture:           false,
    disable_session_recording: false,
    loaded: (ph) => {
      if (process.env.NODE_ENV === 'development') ph.opt_out_capturing();
    },
  });
  initialized = true;
}

export function captureEvent(event: string, props?: Record<string, unknown>) {
  if (!initialized || typeof window === 'undefined') return;
  try { posthog.capture(event, props); } catch { /* silent */ }
}

export function identifyUser(id: string, traits?: Record<string, unknown>) {
  if (!initialized || typeof window === 'undefined') return;
  try { posthog.identify(id, traits); } catch { /* silent */ }
}

export function resetUser() {
  if (!initialized || typeof window === 'undefined') return;
  try { posthog.reset(); } catch { /* silent */ }
}
