"use client";

import { useState } from "react";
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

interface NewsFilterProps {
  news: News[];
  locale: string;
  translations: {
    title: string;
    subtitle: string;
    no_news: string;
    read_more: string;
    filter_all: string;
  };
}

export default function NewsFilter({ news, locale, translations }: NewsFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", ...new Set(news.map((n) => n.category))];
  const filteredNews =
    selectedCategory === "all" ? news : news.filter((n) => n.category === selectedCategory);
  const highlightNews = filteredNews[0];
  const restNews = filteredNews.slice(1);

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
                {cat === "all" ? translations.filter_all : CATEGORY_LABELS[locale]?.[cat] || cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* News Content */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredNews.length === 0 ? (
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
                            alt={getTitle(highlightNews, locale)}
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
                        </div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-yellow-600 transition-colors">
                          {getTitle(highlightNews, locale)}
                        </h2>
                        <p className="text-gray-500 leading-relaxed line-clamp-3 mb-5">
                          {getExcerpt(highlightNews, locale)}
                        </p>
                        <div className="inline-flex items-center text-yellow-600 font-semibold group-hover:text-yellow-500 transition-colors">
                          {translations.read_more}
                          <ArrowRight
                            className="ml-2 group-hover:translate-x-1 transition-transform"
                            size={18}
                          />
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              )}

              {/* Article Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {restNews.map((item) => {
                  const title = getTitle(item, locale);
                  const excerpt = getExcerpt(item, locale);
                  const categoryLabel = CATEGORY_LABELS[locale]?.[item.category] || item.category;

                  return (
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
                              alt={title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <div className="p-5">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-800">
                              {categoryLabel}
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
                            {title}
                          </h3>
                          <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                            {excerpt}
                          </p>
                          <span className="inline-flex items-center text-yellow-600 text-sm font-semibold group-hover:text-yellow-500 transition-colors">
                            {translations.read_more}
                            <ArrowRight
                              className="ml-1 group-hover:translate-x-1 transition-transform"
                              size={14}
                            />
                          </span>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
