"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  Calculator,
  Receipt,
  Building2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  DollarSign,
} from "lucide-react";
import { News } from "@/types/news";

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  vi: { general: "Thuế", accounting: "Kế toán", legal: "Pháp lý" },
  en: { general: "Tax", accounting: "Accounting", legal: "Legal" },
  zh: { general: "税务", accounting: "会计", legal: "法律" },
};

export default function HomePage() {
  const t = useTranslations("home");
  const st = useTranslations("services");
  const nt = useTranslations("news");
  const common = useTranslations("common");
  const locale = useLocale();

  const featuredServices = [
    { icon: Receipt, titleKey: "tax" as const, descKey: "tax_desc" as const },
    { icon: Calculator, titleKey: "accounting" as const, descKey: "accounting_desc" as const },
    { icon: Building2, titleKey: "setup" as const, descKey: "setup_desc" as const },
  ];

  const [newsItems, setNewsItems] = useState<News[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news?status=published&limit=6");
        if (res.ok) {
          const { data } = await res.json();
          setNewsItems(data || []);
        }
      } catch {
        // ignore
      }
    };
    fetchNews();
  }, []);

  const totalSlides = Math.max(1, Math.ceil(newsItems.length / 3));

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    if (totalSlides <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const visibleNews = newsItems.slice(currentSlide * 3, currentSlide * 3 + 3);

  const categoryColors: Record<string, string> = {
    general: "bg-red-100 text-red-700",
    accounting: "bg-blue-100 text-blue-700",
    legal: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative bg-gray-950 text-white overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full opacity-40 blur-[120px] bg-gradient-radial from-yellow-500/50 to-transparent" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full opacity-40 blur-[120px] bg-gradient-radial from-yellow-500/30 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                {t("hero_title")} <span className="text-yellow-500">{t("hero_highlight")}</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-gray-400 leading-relaxed">
                {t("hero_subtitle")}
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center bg-yellow-500 text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-400 transition-colors"
                >
                  {t("hero_cta")}
                  <ArrowRight className="ml-2" size={20} />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center border border-gray-600 text-gray-300 px-8 py-4 rounded-lg text-lg font-medium hover:border-yellow-500 hover:text-yellow-500 transition-colors"
                >
                  {t("hero_cta2")}
                </Link>
              </div>
            </div>

            {/* Glass Card Dashboard */}
            <div className="relative h-[400px] hidden lg:block">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                <div className="flex gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <h3 className="text-white font-semibold mb-4">Tax Dashboard 2026</h3>
                <div className="flex items-end gap-4 h-[120px] mb-6 border-b border-white/10">
                  <div className="flex-1 bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-t origin-bottom animate-[growUp_1.5s_ease-out_forwards] h-[40%]" />
                  <div className="flex-1 bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-t origin-bottom animate-[growUp_1.5s_0.2s_ease-out_forwards] h-[60%]" />
                  <div className="flex-1 bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-t origin-bottom animate-[growUp_1.5s_0.4s_ease-out_forwards] h-[30%]" />
                  <div className="flex-1 bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-t origin-bottom animate-[growUp_1.5s_0.6s_ease-out_forwards] h-[90%]" />
                </div>
                <div className="flex items-center gap-3 text-sm text-green-400">
                  <span className="w-6 h-6 rounded-full bg-black/50 flex items-center justify-center">
                    ✓
                  </span>
                  <span>All clear</span>
                </div>
              </div>

              <div className="absolute bottom-[10%] right-[-5%] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center gap-4 animate-[float_6s_ease-in-out_infinite] shadow-xl">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center text-yellow-500">
                  <DollarSign size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-sm font-semibold">Cost Opt.</span>
                  <span className="text-green-400 text-xs">- 20% Taxes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: "200+", label: t("stats_clients") },
              { value: "7+", label: t("stats_years") },
              { value: "9", label: t("stats_services") },
              { value: "10+", label: t("stats_experts") },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl sm:text-4xl font-bold text-yellow-500">{stat.value}</div>
                <div className="mt-2 text-gray-600 text-sm sm:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{t("featured_title")}</h2>
            <p className="mt-4 text-gray-600 text-lg">{t("featured_subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredServices.map(({ icon: Icon, titleKey, descKey }) => (
              <div
                key={titleKey}
                className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg hover:border-yellow-500/50 transition-all group"
              >
                <div className="w-14 h-14 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-yellow-500/20 transition-colors">
                  <Icon size={28} className="text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{st(titleKey)}</h3>
                <p className="text-gray-600 mb-4">{st(descKey)}</p>
                <Link
                  href="/services"
                  className="inline-flex items-center text-yellow-600 font-medium hover:text-yellow-500 transition-colors"
                >
                  {common("learn_more")}
                  <ArrowRight className="ml-1" size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Carousel — from Database */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{t("news_title")}</h2>
            <p className="mt-4 text-gray-600 text-lg">{t("news_subtitle")}</p>
          </div>

          {newsItems.length === 0 ? (
            <div className="text-center text-gray-500 py-8">{nt("no_news")}</div>
          ) : (
            <div className="relative">
              {totalSlides > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md hover:bg-yellow-50 hover:border-yellow-500 transition-colors"
                    aria-label="Previous"
                  >
                    <ChevronLeft size={20} className="text-gray-600" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md hover:bg-yellow-50 hover:border-yellow-500 transition-colors"
                    aria-label="Next"
                  >
                    <ChevronRight size={20} className="text-gray-600" />
                  </button>
                </>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 overflow-hidden">
                {visibleNews.map((item) => {
                  const title =
                    (item as unknown as Record<string, string>)[`title_${locale}`] || item.title_vi;
                  const excerpt =
                    (item as unknown as Record<string, string>)[`excerpt_${locale}`] ||
                    item.excerpt_vi;
                  const categoryLabel = CATEGORY_LABELS[locale]?.[item.category] || item.category;

                  return (
                    <Link
                      key={item.id}
                      href={`/news/${item.id}` as "/news"}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all group"
                    >
                      {item.cover_image ? (
                        <div className="h-48 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.cover_image}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-4xl">📰</span>
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${categoryColors[item.category] || "bg-gray-100 text-gray-700"}`}
                          >
                            {categoryLabel}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(item.created_at).toLocaleDateString(
                              locale === "zh" ? "zh-CN" : locale === "en" ? "en-US" : "vi-VN"
                            )}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-yellow-600 transition-colors">
                          {title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{excerpt}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {totalSlides > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: totalSlides }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        i === currentSlide ? "bg-yellow-500" : "bg-gray-300 hover:bg-gray-400"
                      }`}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              href="/news"
              className="inline-flex items-center text-yellow-600 font-semibold hover:text-yellow-500 transition-colors text-lg"
            >
              {t("news_more")}
              <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Lixin — Orbit Animation */}
      <section className="py-20 sm:py-24 bg-gray-950 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold">
                {t("why_title")} <span className="text-yellow-500">Lixin</span>?
              </h2>
              <p className="mt-4 text-gray-400 text-lg">{t("why_subtitle")}</p>

              <ul className="mt-8 space-y-6">
                {(["why_feature_1", "why_feature_2", "why_feature_3"] as const).map((key) => (
                  <li key={key} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-500 font-bold text-sm">
                      ✓
                    </div>
                    <div>
                      <strong className="text-white block mb-1">
                        {t(`${key}_title` as const)}
                      </strong>
                      <span className="text-gray-400 text-sm">{t(`${key}_desc` as const)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-center items-center h-[400px]">
              <div className="relative w-[300px] h-[300px] rounded-full border border-dashed border-yellow-500/30 flex items-center justify-center animate-[spin_30s_linear_infinite]">
                <div className="w-[100px] h-[100px] bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center font-bold text-xl text-black shadow-[0_0_30px_rgba(234,179,8,0.25)] animate-[spin_30s_linear_infinite_reverse]">
                  Lixin
                </div>
                <div className="absolute -top-[35px] left-[115px] w-[70px] h-[70px] bg-white/5 backdrop-blur border border-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-yellow-500 text-xs font-medium animate-[spin_30s_linear_infinite_reverse]">
                    Tax
                  </span>
                </div>
                <div className="absolute bottom-[20px] -right-[20px] w-[70px] h-[70px] bg-white/5 backdrop-blur border border-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-yellow-500 text-xs font-medium animate-[spin_30s_linear_infinite_reverse]">
                    Finance
                  </span>
                </div>
                <div className="absolute bottom-[20px] -left-[20px] w-[70px] h-[70px] bg-white/5 backdrop-blur border border-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-yellow-500 text-xs font-medium animate-[spin_30s_linear_infinite_reverse]">
                    Accounting
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-yellow-500 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-black">{t("cta_title")}</h2>
          <p className="mt-4 text-black/70 text-lg max-w-2xl mx-auto">{t("cta_subtitle")}</p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center bg-black text-yellow-500 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-900 transition-colors"
          >
            {t("cta_button")}
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
