import { getLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
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

  const supabase = await createClient();

  let dbQuery = supabase
    .from("news")
    .select("*", { count: "exact" })
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .range(0, 11); // first 12 items

  if (category && category !== "all") {
    dbQuery = dbQuery.eq("category", category);
  }

  if (query && query.length >= 2) {
    const titleField = `title_${locale}`;
    const excerptField = `excerpt_${locale}`;
    dbQuery = dbQuery.or(
      `${titleField}.ilike.%${query}%,${excerptField}.ilike.%${query}%,tags.ilike.%${query}%`
    );
  }

  const { data, count } = await dbQuery;
  const news: News[] = data || [];

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
        totalCount={count || 0}
        locale={locale}
        initialCategory={category}
        initialQuery={query}
        translations={translations}
      />
    </div>
  );
}
