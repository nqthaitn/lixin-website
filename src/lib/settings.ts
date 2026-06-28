import { createClient } from "@/lib/supabase/server";
import { createClient as createAnonClient } from "@supabase/supabase-js";

/**
 * Site settings stored in the `site_settings` table (key/value).
 *
 * Lives in lib/ (not in an API route) so any route can read a setting without
 * importing another route module. The admin settings route also reads/writes
 * through these defaults.
 */
export const SETTING_DEFAULTS: Record<string, string> = {
  admin_email: "lixinvn.co.ltd@gmail.com",
  admin_phone: "0395 536 768",
  contact_notify_email: "lixinvn.co.ltd@gmail.com",
  email_notifications: "true",
  auto_publish_news: "false",
  // Homepage stats — stored as display strings ("200+", "9", "29+").
  // Parsed into number + suffix at render time.
  stat_clients: "200+",
  stat_years: "7+",
  stat_services: "9",
  stat_experts: "29+",
};

/** Keys for the homepage stat counters, in display order. Anon-readable (see migration). */
export const HOME_STAT_KEYS = [
  "stat_clients",
  "stat_years",
  "stat_services",
  "stat_experts",
] as const;

/**
 * Read the homepage stat values (anon-safe — only the stat keys, which have a
 * public read policy). Uses a cookieless anon client on purpose so the homepage
 * stays statically rendered / ISR (no `cookies()` access → no forced dynamic).
 * Refresh cadence is the page's `revalidate`. Falls back to defaults on error.
 */
export async function getHomeStats(): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  for (const key of HOME_STAT_KEYS) result[key] = SETTING_DEFAULTS[key];

  try {
    const supabase = createAnonClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    );
    const { data } = await supabase
      .from("site_settings")
      .select("key, value")
      .in("key", HOME_STAT_KEYS as unknown as string[]);
    for (const row of data || []) result[row.key] = row.value;
  } catch {
    // keep defaults
  }
  return result;
}

/** Read a single setting value, falling back to the built-in default. */
export async function getSettingValue(key: string): Promise<string> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("site_settings").select("value").eq("key", key).single();
    return data?.value ?? SETTING_DEFAULTS[key] ?? "";
  } catch {
    return SETTING_DEFAULTS[key] ?? "";
  }
}
