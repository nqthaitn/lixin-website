import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabasePublic } from "@/lib/supabase/public";
import { getSettingValue } from "@/app/api/admin/settings/route";

// Cache published-news browse responses at the CDN/edge for 5 min,
// serving stale while revalidating for a smoother experience.
const PUBLIC_CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
};

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

    // Public browse (published only) uses the cookie-less client so responses
    // can be CDN-cached. Admin queries (status=all/draft) keep the cookie client
    // so RLS/session still applies.
    const isPublic = !status || status === "published";
    const supabase = isPublic ? supabasePublic : await createClient();

    // Use FTS RPC when search query is present
    if (q && q.length >= 2) {
      const { data: ftsData, error: ftsError } = await supabase.rpc("search_news", {
        search_query: q,
        search_locale: locale,
        search_status: status && status !== "all" ? status : "published",
        search_category: category && category !== "all" ? category : null,
        search_limit: limit,
        search_offset: offset,
      });

      if (ftsError) {
        return NextResponse.json({ error: ftsError.message }, { status: 500 });
      }

      const total = ftsData?.[0]?.total_count || 0;
      // Remove rank and total_count from response data
      const data = (ftsData || []).map(
        ({ rank, total_count, ...rest }: Record<string, unknown>) => rest
      );

      return NextResponse.json(
        {
          data,
          total,
          page,
          limit,
          hasMore: offset + limit < total,
        },
        { status: 200, headers: isPublic ? PUBLIC_CACHE_HEADERS : undefined }
      );
    }

    // Regular query (no search) — browse/filter mode
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
      { status: 200, headers: isPublic ? PUBLIC_CACHE_HEADERS : undefined }
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

    // Flush cached public news reads so the new article shows up immediately.
    revalidateTag("news", "max");

    return NextResponse.json({ data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
