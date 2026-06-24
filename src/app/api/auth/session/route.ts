import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    // Validate against the Auth server and return only a boolean — never echo
    // the session object (it carries access/refresh tokens).
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return NextResponse.json({ session: Boolean(user) }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
