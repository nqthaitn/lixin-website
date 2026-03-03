"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { News } from "@/types/news";
import { ArrowRight, Clock, Newspaper } from "lucide-react";

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  vi: {
    general: "Thuế",
    tax: "Thuế",
    accounting: "Kế toán",
    legal: "Pháp lý",
    business: "Doanh nghiệp",
    other: "Khác",
  },
  en: {
    general: "Tax",
    tax: "Tax",
    accounting: "Accounting",
    legal: "Legal",
    business: "Business",
    other: "Other",
  },
  zh: {
    general: "税务",
    tax: "税务",
    accounting: "会计",
    legal: "法律",
    business: "商业",
    other: "其他",
  },
};

function formatDate(dateStr: string, locale: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale === "zh" ? "zh-CN" : locale === "en" ? "en-US" : "vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getTitle(item: News, locale: string) {
  return (item as unknown as Record<string, string>)[`title_${locale}`] || item.title_vi;
}

function getExcerpt(item: News, locale: string) {
  return (item as unknown as Record<string, string>)[`excerpt_${locale}`] || item.excerpt_vi;
}

export default function NewsPage() {
  const t = useTranslations("news");
  const locale = useLocale();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news?status=published&limit=30");
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

  const categories = ["all", ...new Set(news.map((n) => n.category))];
  const filteredNews =
    selectedCategory === "all" ? news : news.filter((n) => n.category === selectedCategory);
  const highlightNews = filteredNews[0];
  const restNews = filteredNews.slice(1);

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative bg-gray-950 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            {t("title")}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-4 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-gray-900 text-yellow-500 shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat === "all"
                  ? locale === "vi"
                    ? "Tất cả"
                    : locale === "en"
                      ? "All"
                      : "全部"
                  : CATEGORY_LABELS[locale]?.[cat] || cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* News Content */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/6 mb-3" />
                  <div className="h-6 bg-gray-200 rounded w-2/3 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                </div>
              ))}
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-20">
              <Newspaper size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">{t("no_news")}</p>
            </div>
          ) : (
            <>
              {/* Highlight Article - first article featured */}
              {highlightNews && (
                <Link href={`/news/${highlightNews.id}` as "/news"} className="block mb-8 group">
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-yellow-300">
                    <div className="grid grid-cols-1 lg:grid-cols-5">
                      {/* Cover image only if exists */}
                      {highlightNews.cover_image && (
                        <div className="lg:col-span-2 h-56 lg:h-auto overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={highlightNews.cover_image}
                            alt={getTitle(highlightNews, locale)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div
                        className={`p-8 lg:p-10 flex flex-col justify-center ${highlightNews.cover_image ? "lg:col-span-3" : "lg:col-span-5"}`}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-yellow-500 text-black">
                            {CATEGORY_LABELS[locale]?.[highlightNews.category] ||
                              highlightNews.category}
                          </span>
                          <span className="text-gray-400 text-sm flex items-center gap-1">
                            <Clock size={14} />
                            {formatDate(highlightNews.created_at, locale)}
                          </span>
                        </div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-yellow-600 transition-colors">
                          {getTitle(highlightNews, locale)}
                        </h2>
                        <p className="text-gray-500 leading-relaxed line-clamp-3 mb-5">
                          {getExcerpt(highlightNews, locale)}
                        </p>
                        <div className="inline-flex items-center text-yellow-600 font-semibold group-hover:text-yellow-500 transition-colors">
                          {t("read_more")}
                          <ArrowRight
                            className="ml-2 group-hover:translate-x-1 transition-transform"
                            size={18}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Article List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {restNews.map((item) => {
                  const title = getTitle(item, locale);
                  const excerpt = getExcerpt(item, locale);
                  const categoryLabel = CATEGORY_LABELS[locale]?.[item.category] || item.category;

                  return (
                    <Link
                      key={item.id}
                      href={`/news/${item.id}` as "/news"}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group hover:-translate-y-0.5 hover:border-yellow-300"
                    >
                      {/* Only show image if exists */}
                      {item.cover_image && (
                        <div className="h-44 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.cover_image}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-800">
                            {categoryLabel}
                          </span>
                          <span className="text-gray-400 text-xs flex items-center gap-1">
                            <Clock size={12} />
                            {formatDate(item.created_at, locale)}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-yellow-600 transition-colors leading-snug">
                          {title}
                        </h3>

                        <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                          {excerpt}
                        </p>

                        <span className="inline-flex items-center text-yellow-600 text-sm font-semibold group-hover:text-yellow-500 transition-colors">
                          {t("read_more")}
                          <ArrowRight
                            className="ml-1 group-hover:translate-x-1 transition-transform"
                            size={14}
                          />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
