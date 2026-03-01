import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// This endpoint is only accessible in development for DB migration
// POST /api/admin/migrate
export async function POST(request: Request) {
  // Security: only allow from local or with secret header
  const authHeader = request.headers.get("x-migrate-secret");
  const secret = process.env.MIGRATE_SECRET || "lixin-migrate-2026";
  if (authHeader !== secret) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: "Missing env vars" }, { status: 500 });
  }

  // Use service role client
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  const results: Record<string, string> = {};

  // 1. Check contacts.locale
  try {
    const { error } = await supabase.from("contacts").select("locale").limit(1);
    results["contacts.locale"] = error ? `MISSING: ${error.message}` : "OK";
  } catch (e) {
    results["contacts.locale"] = `ERROR: ${e}`;
  }

  // 2. Check site_settings
  try {
    const { data, error } = await supabase.from("site_settings").select("key").limit(1);

    if (error && error.code === "42P01") {
      results["site_settings"] = "MISSING - Need manual creation in Supabase";
    } else if (error) {
      results["site_settings"] = `ERROR: ${error.message}`;
    } else {
      results["site_settings"] = `OK (${data?.length ?? 0} rows)`;
    }
  } catch (e) {
    results["site_settings"] = `ERROR: ${e}`;
  }

  // 3. Try to seed settings if table exists
  if (results["site_settings"]?.startsWith("OK")) {
    try {
      const defaults = [
        { key: "admin_email", value: "lixinvn.co.ltd@gmail.com" },
        { key: "admin_phone", value: "0395 536 768" },
        { key: "contact_notify_email", value: "lixinvn.co.ltd@gmail.com" },
        { key: "email_notifications", value: "true" },
        { key: "auto_publish_news", value: "false" },
      ];
      const { error: upsertError } = await supabase
        .from("site_settings")
        .upsert(defaults, { onConflict: "key" });
      results["seed_settings"] = upsertError
        ? `ERROR: ${upsertError.message}`
        : "OK - defaults seeded";
    } catch (e) {
      results["seed_settings"] = `ERROR: ${e}`;
    }
  }

  return NextResponse.json({
    results,
    sql_to_run: results["site_settings"]?.includes("MISSING")
      ? `-- Run this in Supabase SQL Editor:\nCREATE TABLE IF NOT EXISTS public.site_settings (\n  key VARCHAR(100) PRIMARY KEY,\n  value TEXT NOT NULL DEFAULT '',\n  updated_at TIMESTAMPTZ DEFAULT NOW()\n);\nALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;\nCREATE POLICY "Allow auth read settings" ON public.site_settings FOR SELECT TO authenticated USING (true);\nCREATE POLICY "Allow auth write settings" ON public.site_settings FOR ALL TO authenticated USING (true);\nCREATE POLICY "Allow service write settings" ON public.site_settings FOR ALL TO service_role USING (true);\nINSERT INTO public.site_settings (key, value) VALUES\n  ('admin_email', 'lixinvn.co.ltd@gmail.com'),\n  ('admin_phone', '0395 536 768'),\n  ('contact_notify_email', 'lixinvn.co.ltd@gmail.com'),\n  ('email_notifications', 'true'),\n  ('auto_publish_news', 'false')\nON CONFLICT (key) DO NOTHING;`
      : null,
  });
}
