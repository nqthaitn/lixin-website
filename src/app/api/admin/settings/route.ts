import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Default settings fallback if table doesn't exist yet
const DEFAULTS: Record<string, string> = {
  admin_email: "lixinvn.co.ltd@gmail.com",
  admin_phone: "0395 536 768",
  contact_notify_email: "lixinvn.co.ltd@gmail.com",
  email_notifications: "true",
  auto_publish_news: "false",
};

export async function GET() {
  try {
    const supabase = await createClient();

    // Check auth
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase.from("site_settings").select("key, value");

    if (error) {
      // Table may not exist yet, return defaults
      console.warn("[Settings] Table not found, returning defaults:", error.message);
      return NextResponse.json({ settings: DEFAULTS });
    }

    // Merge with defaults so all keys are present
    const settings = { ...DEFAULTS };
    for (const row of data || []) {
      settings[row.key] = row.value;
    }

    return NextResponse.json({ settings });
  } catch (err) {
    console.error("[Settings] GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Check auth
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { settings } = body as { settings: Record<string, string> };

    if (!settings || typeof settings !== "object") {
      return NextResponse.json({ error: "Invalid settings data" }, { status: 400 });
    }

    // Upsert each setting
    const rows = Object.entries(settings).map(([key, value]) => ({
      key,
      value: String(value),
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });

    if (error) {
      console.error("[Settings] Upsert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Settings] POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Helper to get a single setting value (for use in other routes)
export async function getSettingValue(key: string): Promise<string> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("site_settings").select("value").eq("key", key).single();
    return data?.value ?? DEFAULTS[key] ?? "";
  } catch {
    return DEFAULTS[key] ?? "";
  }
}
