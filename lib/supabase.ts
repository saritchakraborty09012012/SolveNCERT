import { createClient, SupabaseClient } from '@supabase/supabase-js';

function env(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing env var: ${key}. Add it to your deployment environment (Vercel/Cloudflare) or .env.local`);
  }
  return value;
}

let supabaseClient: SupabaseClient<any> | null = null;

/**
 * The browser/anon client. Created lazily on first property access so merely
 * importing this module during `next build` (when env vars may be absent on
 * the build machine / CI) doesn't crash with "supabaseUrl is required".
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getSupabase(): SupabaseClient<any> {
  if (!supabaseClient) {
    supabaseClient = createClient<any>(env('NEXT_PUBLIC_SUPABASE_URL'), env('NEXT_PUBLIC_SUPABASE_ANON_KEY'), {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return supabaseClient;
}

// Lazy proxy: real client is created only when a property is accessed, which
// never happens during `next build` for code that merely imports `supabase`.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase: SupabaseClient<any> = new Proxy(
  {} as SupabaseClient<any>,
  {
    get(_target, prop: string | symbol) {
      return (getSupabase() as any)[prop];
    },
    set(_target, prop: string | symbol, value: unknown) {
      (getSupabase() as any)[prop] = value;
      return true;
    },
  }
);

// Server-side admin client (never expose to browser)
export const createAdminClient = () => {
  if (typeof window !== 'undefined') {
    throw new Error('Admin client must only be used server-side');
  }
  return createClient<any>(
    env('NEXT_PUBLIC_SUPABASE_URL'),
    env('SUPABASE_SERVICE_ROLE_KEY'),
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
};
