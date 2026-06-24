import { createClient } from "@/lib/supabase/server";

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
};

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
