import { getLocale, getTranslations } from "next-intl/server";
import { supabasePublic } from "@/lib/supabase/public";
import { getNewsList } from "@/lib/news";
import { News } from "@/types/news";
import NewsPageClient from "@/components/news/NewsPageClient";

interface PageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

export default async function NewsPage({ searchParams }: PageProps) {
  const locale = await getLocale();
  const t = await getTranslations("news");
  const params = await searchParams;
  const query = params.q || "";
  const category = params.category || "all";

  let news: News[] = [];
  let totalCount = 0;

  if (query && query.length >= 2) {
    // Search is per-query and not cached — use the cookie-less public client
    const { data: ftsData } = await supabasePublic.rpc("search_news", {
      search_query: query,
      search_locale: locale,
      search_status: "published",
      search_category: category && category !== "all" ? category : null,
      search_limit: 12,
      search_offset: 0,
    });
    news = (ftsData || []).map(
      ({ rank, total_count, ...rest }: Record<string, unknown>) => rest
    ) as News[];
    totalCount = (ftsData?.[0]?.total_count as number) || 0;
  } else {
    // Regular browse — served from the cached helper (shared across visitors)
    const result = await getNewsList(category, 12);
    news = result.news;
    totalCount = result.total;
  }

  const translations = {
    title: t("title"),
    subtitle: t("subtitle"),
    no_news: t("no_news"),
    read_more: t("read_more"),
    filter_all: t("filter_all"),
    load_more: t("load_more"),
    end_of_list: t("end_of_list"),
    popular_articles: t("popular_articles"),
    min_read: t("min_read"),
  };

  return (
    <div className="pt-16">
      <NewsPageClient
        initialNews={news}
        totalCount={totalCount}
        locale={locale}
        initialCategory={category}
        initialQuery={query}
        translations={translations}
      />
    </div>
  );
}
