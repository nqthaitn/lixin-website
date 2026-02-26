"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { News } from "@/types/news";

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

export default function NewsDetailPage() {
  const t = useTranslations("news");
  const locale = useLocale();
  const params = useParams();
  const slug = params.slug as string;

  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // slug could be an id or actual slug — try fetching by id first
        const res = await fetch(`/api/news/${slug}`);
        if (!res.ok) throw new Error("Not found");
        const { data } = await res.json();
        setNews(data);
      } catch {
        setError("not_found");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-16 pb-20">
        <div className="max-w-3xl mx-auto px-4 py-20 text-center text-gray-500">{t("loading")}</div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="pt-16 pb-20">
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t("not_found")}</h1>
          <Link
            href="/news"
            className="inline-flex items-center text-yellow-600 hover:text-yellow-500 font-medium"
          >
            <ArrowLeft className="mr-2" size={18} />
            {t("back_to_list")}
          </Link>
        </div>
      </div>
    );
  }

  const title = (news as unknown as Record<string, string>)[`title_${locale}`] || news.title_vi;
  const content =
    (news as unknown as Record<string, string>)[`content_${locale}`] || news.content_vi;
  const excerpt =
    (news as unknown as Record<string, string>)[`excerpt_${locale}`] || news.excerpt_vi;
  const categoryLabel = CATEGORY_LABELS[locale]?.[news.category] || news.category;

  return (
    <div className="pt-16 pb-20">
      {/* Hero banner */}
      <section className="bg-gray-950 text-white py-16">
        <div className="max-w-3xl mx-auto px-4">
          <Link
            href="/news"
            className="inline-flex items-center text-gray-400 hover:text-yellow-500 transition-colors mb-6"
          >
            <ArrowLeft className="mr-2" size={18} />
            {t("back_to_list")}
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight">{title}</h1>
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {new Date(news.created_at).toLocaleDateString(
                locale === "zh" ? "zh-CN" : locale === "en" ? "en-US" : "vi-VN",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </span>
            <span className="flex items-center gap-1.5">
              <Tag size={14} />
              {categoryLabel}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-4 py-12">
        {news.cover_image && (
          <div className="mb-8 rounded-xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={news.cover_image} alt={title} className="w-full h-auto" />
          </div>
        )}

        {excerpt && (
          <p className="text-lg text-gray-600 italic border-l-4 border-yellow-500 pl-4 mb-8">
            {excerpt}
          </p>
        )}

        <div
          className="news-content text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content || t("no_content") }}
        />
      </article>
    </div>
  );
}
