import { createClient } from "@supabase/supabase-js";

/**
 * Cookie-less Supabase client for PUBLIC, read-only data (published news, etc.).
 *
 * The cookie-based server client (./server.ts) forces every page into dynamic
 * rendering because it reads `cookies()`. Public content doesn't need the user's
 * session, so this anon client can be wrapped in `unstable_cache` / ISR for
 * real caching. Use this for anything a logged-out visitor would see; keep using
 * ./server.ts for admin/auth-gated routes.
 */
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
