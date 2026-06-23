import HomePageClient from "@/components/HomePageClient";
import { getLatestNews } from "@/lib/news";

export default async function HomePage() {
  // Server-side, cached fetch — news is in the initial HTML (no client waterfall,
  // no layout shift). Shared across visitors via unstable_cache (tag: "news").
  const newsItems = await getLatestNews(4);

  return <HomePageClient newsItems={newsItems} />;
}
