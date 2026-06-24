import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getNewsList } from "@/lib/news";
import NewsPageClient from "@/components/news/NewsPageClient";

// Static/ISR: the default news list is pre-rendered and edge-cached (revalidate
// 300s, flushed on admin publish via revalidateTag("news")). Category filtering
// and search are handled client-side from the URL, so the page no longer reads
// searchParams and stays static.
export const revalidate = 300;

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("news");

  // Default browse (latest published), shared across visitors via the cache.
  const { news, total } = await getNewsList("all", 12);

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
      <Suspense fallback={null}>
        <NewsPageClient
          initialNews={news}
          totalCount={total}
          locale={locale}
          translations={translations}
        />
      </Suspense>
    </div>
  );
}
