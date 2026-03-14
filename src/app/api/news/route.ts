import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSettingValue } from "@/app/api/admin/settings/route";

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const offset = (page - 1) * limit;
    const category = searchParams.get("category");
    const q = searchParams.get("q")?.trim();
    const fromDate = searchParams.get("from");
    const toDate = searchParams.get("to");
    const sort = searchParams.get("sort") || "created_at";
    const locale = searchParams.get("locale") || "vi";

    const supabase = await createClient();

    const sortField = ["view_count", "like_count"].includes(sort) ? sort : "created_at";

    let query = supabase
      .from("news")
      .select("*", { count: "exact" })
      .order(sortField, { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    if (q && q.length >= 2) {
      const titleField = `title_${locale}`;
      const excerptField = `excerpt_${locale}`;
      query = query.or(`${titleField}.ilike.%${q}%,${excerptField}.ilike.%${q}%,tags.ilike.%${q}%`);
    }

    if (fromDate) {
      query = query.gte("created_at", fromDate);
    }
    if (toDate) {
      query = query.lte("created_at", toDate);
    }

    const { data, count, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const total = count || 0;
    return NextResponse.json(
      {
        data,
        total,
        page,
        limit,
        hasMore: offset + limit < total,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title_vi,
      title_en,
      title_zh,
      content_vi,
      content_en,
      content_zh,
      excerpt_vi,
      excerpt_en,
      excerpt_zh,
      category,
      cover_image,
      status,
      source_url,
    } = body;

    if (!title_vi) {
      return NextResponse.json({ error: "title_vi is required" }, { status: 400 });
    }

    const baseSlug = slugify(title_vi);
    const slug = `${baseSlug}-${Date.now()}`;

    const { data, error } = await supabase
      .from("news")
      .insert([
        {
          slug,
          title_vi,
          title_en: title_en || "",
          title_zh: title_zh || "",
          content_vi: content_vi || "",
          content_en: content_en || "",
          content_zh: content_zh || "",
          excerpt_vi: excerpt_vi || "",
          excerpt_en: excerpt_en || "",
          excerpt_zh: excerpt_zh || "",
          category: category || "general",
          cover_image: cover_image || "",
          // Admin explicitly sets status → use it as-is
          // Cron/external doesn't send status → check auto_publish_news setting
          status:
            status ||
            ((await getSettingValue("auto_publish_news").catch(() => "false")) === "true"
              ? "published"
              : "draft"),
          source_url: source_url || null,
          author: session.user.email || "",
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
