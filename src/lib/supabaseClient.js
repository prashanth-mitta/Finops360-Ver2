import { createClient } from '@supabase/supabase-js';

function runtimeEnv() {
  if (typeof window !== 'undefined' && window.__FINOPS_ENV__) return window.__FINOPS_ENV__;
  return {};
}

const runtime = runtimeEnv();
const url = process.env.REACT_APP_SUPABASE_URL || runtime.REACT_APP_SUPABASE_URL;
const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || runtime.REACT_APP_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export function getSupabaseCredentials() {
  return { url, anonKey };
}

if (!isSupabaseConfigured && typeof window !== 'undefined') {
  // eslint-disable-next-line no-console
  console.warn(
    '[FinOps360] Supabase env vars not set - running on mock data. ' +
      'Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY to use the live database.',
  );
}
