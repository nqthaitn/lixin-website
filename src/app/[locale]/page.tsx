"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  Calculator,
  Receipt,
  Building2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function HomePage() {
  const t = useTranslations("home");
  const st = useTranslations("services");
  const nt = useTranslations("news");
  const common = useTranslations("common");

  const featuredServices = [
    { icon: Receipt, titleKey: "tax" as const, descKey: "tax_desc" as const },
    { icon: Calculator, titleKey: "accounting" as const, descKey: "accounting_desc" as const },
    { icon: Building2, titleKey: "setup" as const, descKey: "setup_desc" as const },
  ];

  const newsItems = [
    {
      id: 1,
      titleKey: "placeholder_title_1" as const,
      excerptKey: "placeholder_excerpt_1" as const,
      category: "category_tax" as const,
      date: "2026-02-20",
    },
    {
      id: 2,
      titleKey: "placeholder_title_2" as const,
      excerptKey: "placeholder_excerpt_2" as const,
      category: "category_tax" as const,
      date: "2026-02-18",
    },
    {
      id: 3,
      titleKey: "placeholder_title_3" as const,
      excerptKey: "placeholder_excerpt_3" as const,
      category: "category_business" as const,
      date: "2026-02-15",
    },
    {
      id: 4,
      titleKey: "placeholder_title_4" as const,
      excerptKey: "placeholder_excerpt_4" as const,
      category: "category_law" as const,
      date: "2026-02-12",
    },
    {
      id: 5,
      titleKey: "placeholder_title_5" as const,
      excerptKey: "placeholder_excerpt_5" as const,
      category: "category_accounting" as const,
      date: "2026-02-10",
    },
    {
      id: 6,
      titleKey: "placeholder_title_6" as const,
      excerptKey: "placeholder_excerpt_6" as const,
      category: "category_business" as const,
      date: "2026-02-08",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = Math.ceil(newsItems.length / 3);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const visibleNews = newsItems.slice(currentSlide * 3, currentSlide * 3 + 3);

  const categoryColors: Record<string, string> = {
    category_tax: "bg-red-100 text-red-700",
    category_accounting: "bg-blue-100 text-blue-700",
    category_law: "bg-purple-100 text-purple-700",
    category_business: "bg-green-100 text-green-700",
  };

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative bg-gray-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-yellow-500/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="max-w-3xl">
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

      {/* Featured Services — 3 dịch vụ nổi bật */}
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

      {/* News Carousel */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{t("news_title")}</h2>
            <p className="mt-4 text-gray-600 text-lg">{t("news_subtitle")}</p>
          </div>

          <div className="relative">
            {/* Carousel Controls */}
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

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 overflow-hidden">
              {visibleNews.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">📰</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${categoryColors[item.category]}`}
                      >
                        {nt(item.category)}
                      </span>
                      <span className="text-sm text-gray-500">{item.date}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {nt(item.titleKey)}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{nt(item.excerptKey)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Dots */}
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
          </div>

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
