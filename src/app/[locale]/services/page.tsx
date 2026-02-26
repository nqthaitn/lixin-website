'use client';

import { useTranslations } from 'next-intl';
import { Calculator, BarChart3, Receipt, DollarSign, TrendingUp, Users, Cpu, Ship, Building2 } from 'lucide-react';
import { Link } from '@/i18n/routing';

const services = [
  { key: 'accounting', icon: Calculator },
  { key: 'management', icon: BarChart3 },
  { key: 'tax', icon: Receipt },
  { key: 'finance', icon: DollarSign },
  { key: 'investment', icon: TrendingUp },
  { key: 'hr', icon: Users },
  { key: 'tech', icon: Cpu },
  { key: 'customs', icon: Ship },
  { key: 'setup', icon: Building2 },
];

export default function ServicesPage() {
  const t = useTranslations('services');

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="bg-gray-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
          <p className="text-gray-400 text-lg">{t('subtitle')}</p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map(({ key, icon: Icon }) => (
              <div
                key={key}
                className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg hover:border-yellow-500/50 transition-all group"
              >
                <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-yellow-500/20 transition-colors">
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
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-black mb-4">{t('cta_title')}</h2>
          <p className="text-black/70 mb-8">{t('cta_text')}</p>
          <Link
            href="/contact"
            className="bg-black text-yellow-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
          >
            {t('cta_button')}
          </Link>
        </div>
      </section>
    </div>
  );
}