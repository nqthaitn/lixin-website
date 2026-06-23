import { setRequestLocale } from "next-intl/server";
import HomePageClient from "@/components/HomePageClient";
import { getLatestNews } from "@/lib/news";

// ISR: pre-render the page and refresh at most every 5 min. Admin publish also
// flushes it instantly via revalidateTag("news").
export const revalidate = 300;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Server-side, cached fetch — news is in the initial HTML (no client waterfall,
  // no layout shift). Shared across visitors via unstable_cache (tag: "news").
  const newsItems = await getLatestNews(4);

  return <HomePageClient newsItems={newsItems} />;
}
