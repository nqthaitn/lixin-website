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
import { motion, type Variants } from "motion/react";
import { Link } from "@/i18n/routing";
import TiltCard from "@/components/TiltCard";

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

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 18 } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export default function ServicesPage() {
  const t = useTranslations("services");

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

      {/* Services Grid — Framer Motion stagger + tilt */}
      <section className="py-20">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map(({ key, icon: Icon }) => (
            <motion.div key={key} variants={fadeUp} style={{ perspective: 900 }}>
              <TiltCard className="h-full bg-white border border-gray-200 rounded-xl p-8 hover:border-yellow-500/50 hover:shadow-xl hover:shadow-yellow-500/5 group">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-yellow-500/20 transition-colors">
                  <Icon size={24} className="text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t(key)}</h3>
                <p className="text-gray-600 mb-4">{t(`${key}_desc`)}</p>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="bg-yellow-500 py-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="max-w-7xl mx-auto px-4 text-center"
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
        </motion.div>
      </section>
    </div>
  );
}
