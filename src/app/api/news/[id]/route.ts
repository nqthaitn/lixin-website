import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";

// Columns an admin may set when updating an article. Prevents mass-assignment
// of internal fields (id, slug, author, view_count, timestamps, ...).
const EDITABLE_FIELDS = [
  "title_vi",
  "title_en",
  "title_zh",
  "content_vi",
  "content_en",
  "content_zh",
  "excerpt_vi",
  "excerpt_en",
  "excerpt_zh",
  "category",
  "cover_image",
  "status",
  "source_url",
  "is_highlight",
  "tags",
  "meta_desc_vi",
  "meta_desc_en",
  "meta_desc_zh",
] as const;

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Admin-only: this endpoint returns any article (including drafts), so it
    // must require an authenticated session. Public reads go through the
    // published-only helpers in lib/news.ts.
    if (!(await requireUser(supabase))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase.from("news").select("*").eq("id", id).single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    if (!(await requireUser(supabase))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Only allow whitelisted columns through — never spread the raw body.
    const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
    for (const field of EDITABLE_FIELDS) {
      if (field in body) update[field] = body[field];
    }

    const { data, error } = await supabase
      .from("news")
      .update(update)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidateTag("news", "max");

    return NextResponse.json({ data }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    if (!(await requireUser(supabase))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase.from("news").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidateTag("news", "max");

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
