import { unstable_cache } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabasePublic } from "@/lib/supabase/public";
import { News } from "@/types/news";

export type NewsListOptions = {
  status?: string | null; // "published" | "draft" | "all"
  category?: string | null;
  sort?: string | null; // created_at | view_count | like_count
  fromDate?: string | null;
  toDate?: string | null;
  offset?: number;
  limit?: number;
};

/**
 * Single source of truth for the news-list query (filter + sort + paginate).
 * Used by the cached SSR helpers below and by GET /api/news so the browse
 * logic lives in one place. Pass whichever Supabase client fits the caller:
 * `supabasePublic` for public reads, the cookie client for admin.
 */
export function newsListQuery(client: SupabaseClient, opts: NewsListOptions = {}) {
  const { status, category, sort, fromDate, toDate, offset = 0, limit = 12 } = opts;
  const sortField = sort && ["view_count", "like_count"].includes(sort) ? sort : "created_at";

  let query = client
    .from("news")
    .select("*", { count: "exact" })
    .order(sortField, { ascending: false })
    .range(offset, offset + limit - 1);

  if (status && status !== "all") query = query.eq("status", status);
  if (category && category !== "all") query = query.eq("category", category);
  if (fromDate) query = query.gte("created_at", fromDate);
  if (toDate) query = query.lte("created_at", toDate);

  return query;
}

/**
 * Cached read helpers for PUBLIC (published) news.
 *
 * Each helper is wrapped in `unstable_cache` so the Supabase round-trip only
 * happens once per `revalidate` window across all visitors, instead of on every
 * request. The cache is tagged "news" — admin mutations call
 * `revalidateTag("news")` to flush it immediately after publishing/editing.
 */
const REVALIDATE_SECONDS = 300; // 5 minutes
const NEWS_TAG = "news";

export const getLatestNews = unstable_cache(
  async (limit = 4): Promise<News[]> => {
    const { data } = await supabasePublic
      .from("news")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(limit);
    return (data || []) as News[];
  },
  ["latest-news"],
  { revalidate: REVALIDATE_SECONDS, tags: [NEWS_TAG] }
);

export const getNewsList = unstable_cache(
  async (category = "all", limit = 12): Promise<{ news: News[]; total: number }> => {
    const { data, count } = await newsListQuery(supabasePublic, {
      status: "published",
      category,
      limit,
    });
    return { news: (data || []) as News[], total: count || 0 };
  },
  ["news-list"],
  { revalidate: REVALIDATE_SECONDS, tags: [NEWS_TAG] }
);

export const getPopularNews = unstable_cache(
  async (limit = 5): Promise<News[]> => {
    const { data } = await supabasePublic
      .from("news")
      .select(
        "id, slug, title_vi, title_en, title_zh, cover_image, view_count, created_at, category"
      )
      .eq("status", "published")
      .order("view_count", { ascending: false })
      .limit(limit);
    return (data || []) as News[];
  },
  ["popular-news"],
  { revalidate: REVALIDATE_SECONDS, tags: [NEWS_TAG] }
);

export const getNewsArticle = unstable_cache(
  async (slugOrId: string): Promise<News | null> => {
    // URLs are either a text slug or a numeric id. Query the matching column
    // directly (one round-trip) and only fall back if needed. Never query `id`
    // with a non-numeric value (Postgres would fail the int cast).
    const isNumericId = /^\d+$/.test(slugOrId);

    let data: News | null = null;
    if (!isNumericId) {
      const r = await supabasePublic
        .from("news")
        .select("*")
        .eq("slug", slugOrId)
        .eq("status", "published")
        .maybeSingle();
      data = (r.data as News) || null;
    } else {
      const r = await supabasePublic
        .from("news")
        .select("*")
        .eq("id", slugOrId)
        .eq("status", "published")
        .maybeSingle();
      data = (r.data as News) || null;
    }
    return data;
  },
  ["news-article"],
  { revalidate: REVALIDATE_SECONDS, tags: [NEWS_TAG] }
);

export const getRelatedArticles = unstable_cache(
  async (category: string, excludeId: number, limit = 3): Promise<News[]> => {
    const { data } = await supabasePublic
      .from("news")
      .select(
        "id, slug, title_vi, title_en, title_zh, cover_image, category, created_at, view_count"
      )
      .eq("status", "published")
      .eq("category", category)
      .neq("id", excludeId)
      .order("created_at", { ascending: false })
      .limit(limit);
    return (data || []) as News[];
  },
  ["related-articles"],
  { revalidate: REVALIDATE_SECONDS, tags: [NEWS_TAG] }
);
