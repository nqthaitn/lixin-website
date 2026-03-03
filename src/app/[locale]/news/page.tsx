import { getLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { News } from "@/types/news";
import NewsFilter from "@/components/NewsFilter";

export default async function NewsPage() {
  const locale = await getLocale();
  const t = await getTranslations("news");

  // Fetch data server-side → Google bot sees full content
  const supabase = await createClient();
  const { data } = await supabase
    .from("news")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(30);

  const news: News[] = data || [];

  const translations = {
    title: t("title"),
    subtitle: t("subtitle"),
    no_news: t("no_news"),
    read_more: t("read_more"),
    filter_all: locale === "vi" ? "Tất cả" : locale === "en" ? "All" : "全部",
  };

  return (
    <div className="pt-16">
      <NewsFilter news={news} locale={locale} translations={translations} />
    </div>
  );
}
