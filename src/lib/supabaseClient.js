import { createClient } from '@supabase/supabase-js';

const url = process.env.REACT_APP_SUPABASE_URL;
const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// When the env vars are absent the app keeps running on the bundled mock data,
// so the existing UAT demo never breaks. As soon as a project URL + anon key
// are configured, every service switches to the live Supabase database.
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

if (!isSupabaseConfigured && typeof window !== 'undefined') {
  // eslint-disable-next-line no-console
  console.warn(
    '[FinOps360] Supabase env vars not set - running on mock data. ' +
      'Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY to use the live database.'
  );
}
