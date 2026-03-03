import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Calendar, Tag } from "lucide-react";

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

  // Try by slug first, then by id
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const news = await getNewsArticle(slug);

  if (!news) {
    return { title: "Not Found" };
  }

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
        ? {
            images: [
              {
                url: news.cover_image,
                width: 1200,
                height: 630,
                alt: title,
              },
            ],
          }
        : {}),
    },
    alternates: {
      canonical: `https://lixinvn.com/${locale}/news/${news.slug}`,
      languages: {
        vi: `https://lixinvn.com/vi/news/${news.slug}`,
        en: `https://lixinvn.com/en/news/${news.slug}`,
        zh: `https://lixinvn.com/zh/news/${news.slug}`,
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

  if (!news) {
    notFound();
  }

  const title = news[`title_${locale}`] || news.title_vi;
  const content = news[`content_${locale}`] || news.content_vi;
  const excerpt = news[`excerpt_${locale}`] || news.excerpt_vi;
  const categoryLabel = CATEGORY_LABELS[locale]?.[news.category] || news.category;

  // Article JSON-LD for SEO
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description: excerpt,
    datePublished: news.published_at || news.created_at,
    dateModified: news.updated_at || news.created_at,
    author: {
      "@type": "Organization",
      name: "Lixin Vietnam",
      url: "https://lixinvn.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Lixin Vietnam",
      url: "https://lixinvn.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://lixinvn.com/${locale}/news/${news.slug}`,
    },
    ...(news.cover_image ? { image: news.cover_image } : {}),
    articleSection: news.category,
    inLanguage: locale === "zh" ? "zh-CN" : locale === "en" ? "en-US" : "vi-VN",
  };

  // Breadcrumb JSON-LD
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
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `https://lixinvn.com/${locale}/news/${news.slug}`,
      },
    ],
  };

  return (
    <div className="pt-16 pb-20">
      {/* JSON-LD Structured Data */}
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
          {/* Breadcrumb */}
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
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
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

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/news"
            className="inline-flex items-center text-yellow-600 hover:text-yellow-500 font-medium transition-colors"
          >
            <ArrowLeft className="mr-2" size={18} />
            {t("back_to_list")}
          </Link>
        </div>
      </article>
    </div>
  );
}
