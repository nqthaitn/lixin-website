"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  Calculator,
  Receipt,
  Building2,
  ArrowRight,
  Shield,
  Users,
  TrendingUp,
} from "lucide-react";

export default function HomePage() {
  const t = useTranslations("home");
  const common = useTranslations("common");

  const featuredServices = [
    { icon: Calculator, key: "accounting" as const, title: "Dịch vụ kế toán" },
    { icon: Receipt, key: "tax" as const, title: "Tư vấn thuế" },
    { icon: Building2, key: "setup" as const, title: "Thành lập DN" },
  ];

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative bg-gray-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-yellow-500/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              {t("hero_title")}{" "}
              <span className="text-yellow-500">{t("hero_highlight")}</span>
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
                <div className="text-3xl sm:text-4xl font-bold text-yellow-500">
                  {stat.value}
                </div>
                <div className="mt-2 text-gray-600 text-sm sm:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {t("featured_title")}
            </h2>
            <p className="mt-4 text-gray-600 text-lg">{t("featured_subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredServices.map(({ icon: Icon, key }) => (
              <div
                key={key}
                className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg hover:border-yellow-500/50 transition-all group"
              >
                <div className="w-14 h-14 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-yellow-500/20 transition-colors">
                  <Icon size={28} className="text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {key === "accounting" && t("featured_title")}
                  {key === "tax" && t("featured_title")}
                  {key === "setup" && t("featured_title")}
                </h3>
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

      {/* CTA */}
      <section className="bg-yellow-500 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-black">
            {t("cta_title")}
          </h2>
          <p className="mt-4 text-black/70 text-lg max-w-2xl mx-auto">
            {t("cta_subtitle")}
          </p>
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
