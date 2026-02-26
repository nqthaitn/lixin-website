"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { News } from "@/types/news";
import { ArrowRight } from "lucide-react";

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  vi: {
    tax: "Thuế",
    accounting: "Kế toán",
    legal: "Pháp lý",
    business: "Doanh nghiệp",
    other: "Khác",
  },
  en: {
    tax: "Tax",
    accounting: "Accounting",
    legal: "Legal",
    business: "Business",
    other: "Other",
  },
  zh: { tax: "税务", accounting: "会计", legal: "法律", business: "商业", other: "其他" },
};

export default function NewsPage() {
  const t = useTranslations("news");
  const locale = useLocale();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news?status=published&limit=20");
        if (res.ok) {
          const data = await res.json();
          setNews(data.data || []);
        }
      } catch {
        console.error("Failed to fetch news");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="pt-16 pb-20">
      {/* Hero */}
      <section className="bg-gray-950 text-white py-20 mb-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("title")}</h1>
          <p className="text-gray-400 text-lg">{t("subtitle")}</p>
        </div>
      </section>

      {/* News Grid */}
      <section className="max-w-7xl mx-auto px-4">
        {loading ? (
          <div className="text-center py-12 text-gray-500">{t("loading")}</div>
        ) : news.length === 0 ? (
          <div className="text-center py-12 text-gray-500">{t("no_news")}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => {
              const title =
                (item as unknown as Record<string, string>)[`title_${locale}`] || item.title_vi;
              const excerpt =
                (item as unknown as Record<string, string>)[`excerpt_${locale}`] || item.excerpt_vi;
              const categoryLabel = CATEGORY_LABELS[locale]?.[item.category] || item.category;

              return (
                <Link
                  key={item.id}
                  href={`/news/${item.id}` as "/news"}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  {/* Thumbnail */}
                  {item.cover_image ? (
                    <div className="w-full h-[200px] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.cover_image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-[200px] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-4xl">📰</span>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        {categoryLabel}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(item.created_at).toLocaleDateString(
                          locale === "zh" ? "zh-CN" : locale === "en" ? "en-US" : "vi-VN"
                        )}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-yellow-600 transition-colors">
                      {title}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>

                    <span className="inline-flex items-center text-yellow-600 font-semibold group-hover:text-yellow-500 transition-colors">
                      {t("read_more")}
                      <ArrowRight className="ml-1" size={16} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
