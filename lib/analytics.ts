let initialized = false;

function isBrowser() {
  return typeof window !== 'undefined';
}

export async function initPostHog() {
  if (!isBrowser() || initialized) return;
  const key  = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
  if (!key) return;

  const { default: posthog } = await import('posthog-js');

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

export async function captureEvent(event: string, props?: Record<string, unknown>) {
  if (!initialized || !isBrowser()) return;
  try {
    const { default: posthog } = await import('posthog-js');
    posthog.capture(event, props);
  } catch { /* silent */ }
}

export async function identifyUser(id: string, traits?: Record<string, unknown>) {
  if (!initialized || !isBrowser()) return;
  try {
    const { default: posthog } = await import('posthog-js');
    posthog.identify(id, traits);
  } catch { /* silent */ }
}

export async function resetUser() {
  if (!initialized || !isBrowser()) return;
  try {
    const { default: posthog } = await import('posthog-js');
    posthog.reset();
  } catch { /* silent */ }
}
