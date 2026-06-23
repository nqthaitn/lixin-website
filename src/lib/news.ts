import { unstable_cache } from "next/cache";
import { supabasePublic } from "@/lib/supabase/public";
import { News } from "@/types/news";

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
    let query = supabasePublic
      .from("news")
      .select("*", { count: "exact" })
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .range(0, limit - 1);

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    const { data, count } = await query;
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
  async (slug: string): Promise<News | null> => {
    let { data } = await supabasePublic
      .from("news")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single();
    if (!data) {
      const idResult = await supabasePublic
        .from("news")
        .select("*")
        .eq("id", slug)
        .eq("status", "published")
        .single();
      data = idResult.data;
    }
    return (data as News) || null;
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
