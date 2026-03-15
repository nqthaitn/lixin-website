"use client";

import { useTranslations } from "next-intl";
import { Award, Eye, Heart, Calendar } from "lucide-react";
import { useScrollReveal, useStaggerReveal } from "@/hooks/useScrollReveal";
import AnimatedCounter from "@/components/AnimatedCounter";

export default function AboutPage() {
  const t = useTranslations("about");

  const values = [
    { icon: Award, titleKey: "value_1_title", textKey: "value_1_text" },
    { icon: Eye, titleKey: "value_2_title", textKey: "value_2_text" },
    { icon: Heart, titleKey: "value_3_title", textKey: "value_3_text" },
  ];

  // Scroll reveal hooks
  const historyReveal = useScrollReveal<HTMLDivElement>();
  const historyCardReveal = useScrollReveal<HTMLDivElement>();
  const missionReveal = useStaggerReveal<HTMLDivElement>();
  const valuesReveal = useStaggerReveal<HTMLDivElement>();

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative bg-gray-950 text-white py-20 sm:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="hero-title text-4xl sm:text-5xl font-bold">{t("title")}</h1>
          <p className="hero-subtitle mt-4 text-gray-400 text-lg max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* History */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div
              ref={historyReveal.ref}
              className={`scroll-reveal ${historyReveal.isVisible ? "is-visible" : ""}`}
            >
              <div className="flex items-center space-x-3 mb-6">
                <Calendar size={24} className="text-yellow-500" />
                <h2 className="text-3xl font-bold text-gray-900">{t("history_title")}</h2>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">{t("history_text")}</p>
            </div>
            <div
              ref={historyCardReveal.ref}
              className={`bg-gray-100 rounded-2xl p-12 text-center scroll-reveal ${historyCardReveal.isVisible ? "is-visible" : ""}`}
              style={{ transitionDelay: "200ms" }}
            >
              <AnimatedCounter
                target={2019}
                suffix=""
                isVisible={historyCardReveal.isVisible}
                duration={1500}
                className="text-6xl font-bold text-yellow-500"
              />
              <div className="mt-2 text-gray-500 text-lg">Est.</div>
              <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                <div>
                  <AnimatedCounter
                    target={200}
                    suffix="+"
                    isVisible={historyCardReveal.isVisible}
                    duration={2000}
                    className="text-2xl font-bold text-gray-900"
                  />
                  <div className="text-sm text-gray-500">Khách hàng</div>
                </div>
                <div>
                  <AnimatedCounter
                    target={7}
                    suffix="+"
                    isVisible={historyCardReveal.isVisible}
                    duration={2000}
                    className="text-2xl font-bold text-gray-900"
                  />
                  <div className="text-sm text-gray-500">Năm</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 sm:py-24 bg-gray-50">
        <div ref={missionReveal.ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: "mission_title", text: "mission_text" },
              { title: "vision_title", text: "vision_text" },
            ].map((item, index) => (
              <div
                key={item.title}
                className={`service-card-enhanced bg-white border border-gray-200 rounded-xl p-8 hover:border-yellow-500/50 stagger-item ${missionReveal.isVisible ? "is-visible" : ""}`}
                style={{
                  transitionDelay: missionReveal.isVisible ? `${index * 200}ms` : "0ms",
                }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{t(item.title)}</h3>
                <p className="text-gray-600 leading-relaxed">{t(item.text)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 sm:py-24">
        <div ref={valuesReveal.ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className={`text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-16 scroll-reveal ${valuesReveal.isVisible ? "is-visible" : ""}`}
          >
            {t("values_title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map(({ icon: Icon, titleKey, textKey }, index) => (
              <div
                key={titleKey}
                className={`text-center stagger-item ${valuesReveal.isVisible ? "is-visible" : ""}`}
                style={{
                  transitionDelay: valuesReveal.isVisible ? `${200 + index * 150}ms` : "0ms",
                }}
              >
                <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform hover:scale-110 hover:bg-yellow-500/20">
                  <Icon size={32} className="text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t(titleKey)}</h3>
                <p className="text-gray-600">{t(textKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
