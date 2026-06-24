import type { createClient } from "@/lib/supabase/server";

type ServerClient = Awaited<ReturnType<typeof createClient>>;

/**
 * Return the authenticated user, or null if there is no valid session.
 *
 * Uses `getUser()` (which revalidates the JWT against the Auth server) rather
 * than `getSession()` (which only decodes the cookie). Use this for every
 * server-side authorization decision.
 */
export async function requireUser(supabase: ServerClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
