import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cncdirblgyvseazxndvj.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuY2RpcmJsZ3l2c2VhenhuZHZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMzMxMTQsImV4cCI6MjA4NzYwOTExNH0.K0f4zhM2TTsNeFCytjxrrH2vDy49EF6QSPtxEW0Hcu0";
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://lixinvn.com";
  const locales = ["vi", "en", "zh"];
  const routes = [
    { url: "", priority: 1.0, changeFrequency: "daily" as const },
    { url: "/services", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/news", priority: 0.8, changeFrequency: "daily" as const },
    { url: "/about", priority: 0.7, changeFrequency: "weekly" as const },
    { url: "/contact", priority: 0.6, changeFrequency: "weekly" as const },
  ];

  const sitemapUrls: MetadataRoute.Sitemap = [];

  // Generate static routes for all locales
  locales.forEach((locale) => {
    routes.forEach((route) => {
      sitemapUrls.push({
        url: `${baseUrl}/${locale}${route.url}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      });
    });
  });

  // Fetch published news slugs from Supabase
  const { data: news } = await supabase.from("news").select("slug").eq("status", "published");

  if (news) {
    locales.forEach((locale) => {
      news.forEach((item) => {
        sitemapUrls.push({
          url: `${baseUrl}/${locale}/news/${item.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        });
      });
    });
  }

  return sitemapUrls;
}
