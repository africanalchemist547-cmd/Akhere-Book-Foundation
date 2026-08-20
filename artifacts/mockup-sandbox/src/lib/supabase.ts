import { createClient } from "@supabase/supabase-js";

// ─── Supabase Client Initialization ───────────────────────────────────────
//
// TERMINOLOGY NOTE:
// Supabase currently labels this key "anon public" in their dashboard
// (Settings > API > Project API Keys).
// We store it as VITE_SUPABASE_PUBLISHABLE_KEY to make clear it is the
// browser-safe/public key — not the service_role/secret key.
//
// NEVER place the service_role key here or in any frontend code.
// The service_role key bypasses all Row Level Security and must only
// ever be used in a secure server-side environment.
//
// ─── Graceful initialization ────────────────────────────────────────────────
// The client is initialized with placeholder values if environment variables
// are not yet configured. This allows the build to succeed and the site to
// render using local mock data before Supabase credentials are added.
//
// Once you add real credentials (locally in .env or in Netlify environment
// variables), the live Supabase connection will activate automatically.
// ─────────────────────────────────────────────────────────────────────────────

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "";

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabasePublishableKey || "placeholder-anon-key"
);

/**
 * Returns true if real Supabase credentials have been configured.
 * Use this to decide whether to fetch from Supabase or fall back to mock data.
 *
 * @example
 *   if (isSupabaseConfigured()) {
 *     const { data } = await supabase.from('projects').select('*');
 *   } else {
 *     return MOCK_PROJECTS;
 *   }
 */
export const isSupabaseConfigured = (): boolean => {
  return (
    !!import.meta.env.VITE_SUPABASE_URL &&
    (!!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
      !!import.meta.env.VITE_SUPABASE_ANON_KEY)
  );
};
