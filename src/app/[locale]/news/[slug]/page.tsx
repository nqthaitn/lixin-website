import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Calendar, Tag, Eye, Clock, ExternalLink, ArrowRight } from "lucide-react";
import ShareButtons from "@/components/news/ShareButtons";
import ReadingProgress from "@/components/news/ReadingProgress";

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  vi: {
    tax: "Thuế",
    accounting: "Kế toán",
    legal: "Pháp lý",
    business: "Doanh nghiệp",
    general: "Thuế",
    other: "Khác",
  },
  en: {
    tax: "Tax",
    accounting: "Accounting",
    legal: "Legal",
    business: "Business",
    general: "Tax",
    other: "Other",
  },
  zh: {
    tax: "税务",
    accounting: "会计",
    legal: "法律",
    business: "商业",
    general: "税务",
    other: "其他",
  },
};

async function getNewsArticle(slug: string) {
  const supabase = await createClient();
  let { data } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  if (!data) {
    const idResult = await supabase
      .from("news")
      .select("*")
      .eq("id", slug)
      .eq("status", "published")
      .single();
    data = idResult.data;
  }
  return data;
}

async function getRelatedArticles(category: string, excludeId: number) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("news")
    .select("id, slug, title_vi, title_en, title_zh, cover_image, category, created_at, view_count")
    .eq("status", "published")
    .eq("category", category)
    .neq("id", excludeId)
    .order("created_at", { ascending: false })
    .limit(3);
  return data || [];
}

function estimateReadTime(content: string) {
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const news = await getNewsArticle(slug);

  if (!news) return { title: "Not Found" };

  const title = news[`title_${locale}`] || news.title_vi;
  const description =
    news[`meta_desc_${locale}`] || news[`excerpt_${locale}`] || news.excerpt_vi || "";

  return {
    title,
    description,
    openGraph: {
      type: "article",
      locale: locale === "vi" ? "vi_VN" : locale === "en" ? "en_US" : "zh_CN",
      url: `https://lixinvn.com/${locale}/news/${news.slug}`,
      siteName: "Lixin Vietnam",
      title,
      description,
      publishedTime: news.published_at || news.created_at,
      modifiedTime: news.updated_at,
      section: news.category,
      ...(news.cover_image
        ? { images: [{ url: news.cover_image, width: 1200, height: 630, alt: title }] }
        : {}),
    },
    alternates: {
      canonical: `https://lixinvn.com/${locale}/news/${news.slug}`,
      languages: {
        vi: `https://lixinvn.com/vi/news/${news.slug}`,
        en: `https://lixinvn.com/en/news/${news.slug}`,
        zh: `https://lixinvn.com/zh/news/${news.slug}`,
        "x-default": `https://lixinvn.com/vi/news/${news.slug}`,
      },
    },
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations("news");

  const news = await getNewsArticle(slug);
  if (!news) notFound();

  const title = news[`title_${locale}`] || news.title_vi;
  const content = news[`content_${locale}`] || news.content_vi;
  const excerpt = news[`excerpt_${locale}`] || news.excerpt_vi;
  const categoryLabel = CATEGORY_LABELS[locale]?.[news.category] || news.category;
  const readTime = estimateReadTime(content || "");
  const articleUrl = `https://lixinvn.com/${locale}/news/${news.slug}`;

  const relatedArticles = await getRelatedArticles(news.category, news.id);

  // JSON-LD
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description: excerpt,
    datePublished: news.published_at || news.created_at,
    dateModified: news.updated_at || news.created_at,
    author: { "@type": "Organization", name: "Lixin Vietnam", url: "https://lixinvn.com" },
    publisher: { "@type": "Organization", name: "Lixin Vietnam", url: "https://lixinvn.com" },
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    ...(news.cover_image ? { image: news.cover_image } : {}),
    articleSection: news.category,
    inLanguage: locale === "zh" ? "zh-CN" : locale === "en" ? "en-US" : "vi-VN",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "vi" ? "Trang chủ" : locale === "en" ? "Home" : "首页",
        item: `https://lixinvn.com/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: locale === "vi" ? "Tin tức" : locale === "en" ? "News" : "新闻",
        item: `https://lixinvn.com/${locale}/news`,
      },
      { "@type": "ListItem", position: 3, name: title, item: articleUrl },
    ],
  };

  return (
    <div className="pt-16 pb-20">
      <ReadingProgress />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero banner */}
      <section className="bg-gray-950 text-white py-16">
        <div className="max-w-3xl mx-auto px-4">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center text-sm text-gray-400 gap-2">
              <li>
                <Link href="/" className="hover:text-yellow-500 transition-colors">
                  {locale === "vi" ? "Trang chủ" : locale === "en" ? "Home" : "首页"}
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/news" className="hover:text-yellow-500 transition-colors">
                  {locale === "vi" ? "Tin tức" : locale === "en" ? "News" : "新闻"}
                </Link>
              </li>
              <li>/</li>
              <li className="text-yellow-500 truncate max-w-[300px]">{title}</li>
            </ol>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-bold leading-tight">{title}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-400">
            <time
              className="flex items-center gap-1.5"
              dateTime={news.published_at || news.created_at}
            >
              <Calendar size={14} />
              {new Date(news.published_at || news.created_at).toLocaleDateString(
                locale === "zh" ? "zh-CN" : locale === "en" ? "en-US" : "vi-VN",
                { year: "numeric", month: "long", day: "numeric" }
              )}
            </time>
            <span className="flex items-center gap-1.5">
              <Tag size={14} />
              {categoryLabel}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {readTime} {t("min_read")}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye size={14} />
              {news.view_count || 0}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-4 py-12">
        {/* Share buttons */}
        <div className="mb-8">
          <ShareButtons
            url={articleUrl}
            title={title}
            translations={{
              share: t("share"),
              copy_link: t("copy_link"),
              copied: t("copied"),
            }}
          />
        </div>

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

        {/* Source link */}
        {news.source_url && (
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <a
              href={news.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-yellow-700 hover:text-yellow-600 font-medium transition-colors"
            >
              <ExternalLink size={16} />
              {t("source")}: {new URL(news.source_url).hostname}
            </a>
          </div>
        )}

        {/* Bottom share */}
        <div className="mt-10 pt-6 border-t border-gray-200">
          <ShareButtons
            url={articleUrl}
            title={title}
            translations={{
              share: t("share"),
              copy_link: t("copy_link"),
              copied: t("copied"),
            }}
          />
        </div>

        {/* Back link */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link
            href="/news"
            className="inline-flex items-center text-yellow-600 hover:text-yellow-500 font-medium transition-colors"
          >
            <ArrowLeft className="mr-2" size={18} />
            {t("back_to_list")}
          </Link>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{t("related_articles")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedArticles.map((item) => {
                const itemTitle =
                  (item as unknown as Record<string, string>)[`title_${locale}`] || item.title_vi;
                return (
                  <Link
                    key={item.id}
                    href={`/news/${item.slug || item.id}` as "/news"}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group hover:-translate-y-0.5 hover:border-yellow-300"
                  >
                    {item.cover_image && (
                      <div className="h-40 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.cover_image}
                          alt={itemTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-base font-bold text-gray-900 line-clamp-2 group-hover:text-yellow-600 transition-colors leading-snug mb-2">
                        {itemTitle}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{CATEGORY_LABELS[locale]?.[item.category] || item.category}</span>
                        <span className="inline-flex items-center text-yellow-600 font-semibold group-hover:text-yellow-500">
                          {t("read_more")}
                          <ArrowRight
                            className="ml-1 group-hover:translate-x-1 transition-transform"
                            size={12}
                          />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
