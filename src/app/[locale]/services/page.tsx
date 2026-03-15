"use client";

import { useTranslations } from "next-intl";
import {
  Calculator,
  BarChart3,
  Receipt,
  DollarSign,
  TrendingUp,
  Users,
  Cpu,
  Ship,
  Building2,
  ArrowRight,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { useScrollReveal, useStaggerReveal } from "@/hooks/useScrollReveal";

const services = [
  { key: "accounting", icon: Calculator },
  { key: "management", icon: BarChart3 },
  { key: "tax", icon: Receipt },
  { key: "finance", icon: DollarSign },
  { key: "investment", icon: TrendingUp },
  { key: "hr", icon: Users },
  { key: "tech", icon: Cpu },
  { key: "customs", icon: Ship },
  { key: "setup", icon: Building2 },
];

export default function ServicesPage() {
  const t = useTranslations("services");

  const gridReveal = useStaggerReveal<HTMLDivElement>();
  const ctaReveal = useScrollReveal<HTMLDivElement>();

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative bg-gray-950 text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="hero-title text-4xl md:text-5xl font-bold mb-4">{t("title")}</h1>
          <p className="hero-subtitle text-gray-400 text-lg">{t("subtitle")}</p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div ref={gridReveal.ref} className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map(({ key, icon: Icon }, index) => (
              <div
                key={key}
                className={`service-card-enhanced bg-white border border-gray-200 rounded-xl p-8 hover:border-yellow-500/50 group stagger-item ${gridReveal.isVisible ? "is-visible" : ""}`}
                style={{
                  transitionDelay: gridReveal.isVisible ? `${index * 100}ms` : "0ms",
                }}
              >
                <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-yellow-500/20 group-hover:scale-110 transition-all">
                  <Icon size={24} className="text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t(key)}</h3>
                <p className="text-gray-600 mb-4">{t(`${key}_desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-yellow-500 py-16">
        <div
          ref={ctaReveal.ref}
          className={`max-w-7xl mx-auto px-4 text-center scroll-reveal ${ctaReveal.isVisible ? "is-visible" : ""}`}
        >
          <h2 className="text-3xl font-bold text-black mb-4">{t("cta_title")}</h2>
          <p className="text-black/70 mb-8">{t("cta_text")}</p>
          <Link
            href="/contact"
            className="cta-button-pulse inline-flex items-center bg-black text-yellow-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
          >
            {t("cta_button")}
            <ArrowRight className="ml-2" size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
