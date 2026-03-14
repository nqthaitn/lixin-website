"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "@/i18n/routing";
import { News } from "@/types/news";
import { ArrowRight, Clock, Newspaper, Loader2, ChevronDown, Eye, TrendingUp } from "lucide-react";

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
  return new Date(dateStr).toLocaleDateString(
    locale === "zh" ? "zh-CN" : locale === "en" ? "en-US" : "vi-VN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}

function getField(item: News, field: string, locale: string) {
  return (
    (item as unknown as Record<string, string>)[`${field}_${locale}`] ||
    (item as unknown as Record<string, string>)[`${field}_vi`]
  );
}

function estimateReadTime(content: string) {
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

interface NewsPageClientProps {
  initialNews: News[];
  totalCount: number;
  locale: string;
  initialCategory?: string;
  initialQuery?: string;
  translations: {
    title: string;
    subtitle: string;
    no_news: string;
    read_more: string;
    filter_all: string;
    load_more: string;
    end_of_list: string;
    popular_articles: string;
    min_read: string;
  };
}

export default function NewsPageClient({
  initialNews,
  totalCount,
  locale,
  initialCategory = "all",
  initialQuery = "",
  translations,
}: NewsPageClientProps) {
  const [news, setNews] = useState<News[]>(initialNews);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialNews.length < totalCount);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [popularNews, setPopularNews] = useState<News[]>([]);
  const loaderRef = useRef<HTMLDivElement>(null);

  const categories = ["all", ...new Set(initialNews.map((n) => n.category))];

  // Load popular news for sidebar
  useEffect(() => {
    fetch("/api/news/popular")
      .then((res) => res.json())
      .then((data) => setPopularNews(data.data || []))
      .catch(() => {});
  }, []);

  // Category change → reset & re-fetch
  const handleCategoryChange = useCallback(
    async (cat: string) => {
      setSelectedCategory(cat);
      setIsLoading(true);
      setPage(1);

      const params = new URLSearchParams({
        page: "1",
        limit: "12",
        status: "published",
        locale,
      });
      if (cat !== "all") params.set("category", cat);
      if (initialQuery) params.set("q", initialQuery);

      try {
        const res = await fetch(`/api/news?${params}`);
        const data = await res.json();
        setNews(data.data || []);
        setHasMore(data.hasMore || false);
      } catch {
        /* ignore */
      }
      setIsLoading(false);
    },
    [locale, initialQuery]
  );

  // Load more news
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    const nextPage = page + 1;

    const params = new URLSearchParams({
      page: String(nextPage),
      limit: "12",
      status: "published",
      locale,
    });
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (initialQuery) params.set("q", initialQuery);

    try {
      const res = await fetch(`/api/news?${params}`);
      const data = await res.json();
      setNews((prev) => [...prev, ...(data.data || [])]);
      setHasMore(data.hasMore || false);
      setPage(nextPage);
    } catch {
      /* ignore */
    }
    setIsLoading(false);
  }, [isLoading, hasMore, page, locale, selectedCategory, initialQuery]);

  // IntersectionObserver for infinity scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const el = loaderRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasMore, isLoading, loadMore]);

  const highlightNews = news[0];
  const restNews = news.slice(1);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gray-950 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            {translations.title}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">{translations.subtitle}</p>
          {initialQuery && (
            <p className="text-yellow-500 text-sm mt-3">
              {locale === "vi"
                ? "Kết quả tìm kiếm cho"
                : locale === "en"
                  ? "Search results for"
                  : "搜索结果"}
              : <span className="font-semibold">&quot;{initialQuery}&quot;</span>
            </p>
          )}
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-4 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat
                    ? "bg-gray-900 text-yellow-500 shadow-md scale-105"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat === "all" ? translations.filter_all : CATEGORY_LABELS[locale]?.[cat] || cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* News Content */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main content */}
            <div className="flex-1 min-w-0">
              {isLoading && news.length === 0 ? (
                /* Skeleton loading */
                <div className="space-y-5">
                  <SkeletonHighlight />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {[1, 2, 3, 4].map((i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                </div>
              ) : news.length === 0 ? (
                <div className="text-center py-20">
                  <Newspaper size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">{translations.no_news}</p>
                </div>
              ) : (
                <>
                  {/* Highlight Article */}
                  {highlightNews && (
                    <Link
                      href={`/news/${highlightNews.slug || highlightNews.id}` as "/news"}
                      className="block mb-8 group"
                    >
                      <article className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-yellow-300">
                        <div className="grid grid-cols-1 lg:grid-cols-5">
                          {highlightNews.cover_image && (
                            <div className="lg:col-span-2 h-56 lg:h-auto overflow-hidden">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={highlightNews.cover_image}
                                alt={getField(highlightNews, "title", locale)}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          )}
                          <div
                            className={`p-8 lg:p-10 flex flex-col justify-center ${highlightNews.cover_image ? "lg:col-span-3" : "lg:col-span-5"}`}
                          >
                            <div className="flex items-center gap-3 mb-4">
                              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-yellow-500 text-black">
                                {CATEGORY_LABELS[locale]?.[highlightNews.category] ||
                                  highlightNews.category}
                              </span>
                              <time
                                className="text-gray-400 text-sm flex items-center gap-1"
                                dateTime={highlightNews.created_at}
                              >
                                <Clock size={14} />
                                {formatDate(highlightNews.created_at, locale)}
                              </time>
                              <span className="text-gray-300 text-xs flex items-center gap-1">
                                <Eye size={12} />
                                {highlightNews.view_count || 0}
                              </span>
                            </div>
                            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-yellow-600 transition-colors">
                              {getField(highlightNews, "title", locale)}
                            </h2>
                            <p className="text-gray-500 leading-relaxed line-clamp-3 mb-3">
                              {getField(highlightNews, "excerpt", locale)}
                            </p>
                            <div className="flex items-center gap-4">
                              <span className="text-xs text-gray-400">
                                {estimateReadTime(getField(highlightNews, "content", locale) || "")}{" "}
                                {translations.min_read}
                              </span>
                              <span className="inline-flex items-center text-yellow-600 font-semibold group-hover:text-yellow-500 transition-colors">
                                {translations.read_more}
                                <ArrowRight
                                  className="ml-2 group-hover:translate-x-1 transition-transform"
                                  size={18}
                                />
                              </span>
                            </div>
                          </div>
                        </div>
                      </article>
                    </Link>
                  )}

                  {/* Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {restNews.map((item) => (
                      <Link
                        key={item.id}
                        href={`/news/${item.slug || item.id}` as "/news"}
                        className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group hover:-translate-y-0.5 hover:border-yellow-300"
                      >
                        <article>
                          {item.cover_image && (
                            <div className="h-44 overflow-hidden">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={item.cover_image}
                                alt={getField(item, "title", locale)}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          )}
                          <div className="p-5">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-800">
                                {CATEGORY_LABELS[locale]?.[item.category] || item.category}
                              </span>
                              <time
                                className="text-gray-400 text-xs flex items-center gap-1"
                                dateTime={item.created_at}
                              >
                                <Clock size={12} />
                                {formatDate(item.created_at, locale)}
                              </time>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-yellow-600 transition-colors leading-snug">
                              {getField(item, "title", locale)}
                            </h3>
                            <p className="text-gray-500 text-sm line-clamp-2 mb-3 leading-relaxed">
                              {getField(item, "excerpt", locale)}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-400 flex items-center gap-1">
                                <Eye size={11} />
                                {item.view_count || 0} ·{" "}
                                {estimateReadTime(getField(item, "content", locale) || "")}{" "}
                                {translations.min_read}
                              </span>
                              <span className="inline-flex items-center text-yellow-600 text-sm font-semibold group-hover:text-yellow-500 transition-colors">
                                {translations.read_more}
                                <ArrowRight
                                  className="ml-1 group-hover:translate-x-1 transition-transform"
                                  size={14}
                                />
                              </span>
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>

                  {/* Infinity scroll loader */}
                  <div ref={loaderRef} className="py-8 text-center">
                    {isLoading && (
                      <div className="flex items-center justify-center gap-2 text-gray-400">
                        <Loader2 size={20} className="animate-spin" />
                        <span className="text-sm">{translations.load_more}...</span>
                      </div>
                    )}
                    {!hasMore && news.length > 0 && (
                      <div className="flex items-center justify-center gap-2 text-gray-400">
                        <ChevronDown size={16} />
                        <span className="text-sm">{translations.end_of_list}</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Sidebar — Popular articles */}
            <aside className="w-full lg:w-80 flex-shrink-0">
              <div className="lg:sticky lg:top-32">
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                    <TrendingUp size={18} className="text-yellow-500" />
                    {translations.popular_articles}
                  </h3>
                  {popularNews.length === 0 ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse flex gap-3">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0" />
                          <div className="flex-1 space-y-2 py-1">
                            <div className="h-3 bg-gray-100 rounded w-full" />
                            <div className="h-3 bg-gray-100 rounded w-2/3" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {popularNews.map((item, index) => (
                        <Link
                          key={item.id}
                          href={`/news/${item.slug || item.id}` as "/news"}
                          className="flex gap-3 group"
                        >
                          <div className="relative flex-shrink-0">
                            {item.cover_image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.cover_image}
                                alt=""
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                                <Newspaper size={20} className="text-gray-300" />
                              </div>
                            )}
                            <span className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-yellow-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                              {index + 1}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight group-hover:text-yellow-600 transition-colors">
                              {getField(item, "title", locale)}
                            </p>
                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                              <Eye size={10} />
                              {item.view_count || 0}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

function SkeletonHighlight() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-5">
        <div className="lg:col-span-2 h-56 lg:h-72 bg-gray-100" />
        <div className="lg:col-span-3 p-8 space-y-4">
          <div className="flex gap-3">
            <div className="h-6 w-16 bg-gray-100 rounded-full" />
            <div className="h-6 w-32 bg-gray-100 rounded" />
          </div>
          <div className="h-8 bg-gray-100 rounded w-3/4" />
          <div className="h-4 bg-gray-100 rounded w-full" />
          <div className="h-4 bg-gray-100 rounded w-2/3" />
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
      <div className="h-44 bg-gray-100" />
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-14 bg-gray-100 rounded-full" />
          <div className="h-5 w-24 bg-gray-100 rounded" />
        </div>
        <div className="h-5 bg-gray-100 rounded w-full" />
        <div className="h-4 bg-gray-100 rounded w-3/4" />
      </div>
    </div>
  );
}
