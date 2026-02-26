'use client';

import { useTranslations } from 'next-intl';

export default function NewsPage() {
  const t = useTranslations('news');

  const newsItems = [
    { id: 1, date: '2026-02-20', category: t('category_tax'), titleKey: 'placeholder_title_1', excerptKey: 'placeholder_excerpt_1' },
    { id: 2, date: '2026-02-18', category: t('category_accounting'), titleKey: 'placeholder_title_2', excerptKey: 'placeholder_excerpt_2' },
    { id: 3, date: '2026-02-15', category: t('category_business'), titleKey: 'placeholder_title_3', excerptKey: 'placeholder_excerpt_3' },
    { id: 4, date: '2026-02-10', category: t('category_law'), titleKey: 'placeholder_title_4', excerptKey: 'placeholder_excerpt_4' },
    { id: 5, date: '2026-02-05', category: t('category_tax'), titleKey: 'placeholder_title_5', excerptKey: 'placeholder_excerpt_5' },
    { id: 6, date: '2026-02-01', category: t('category_accounting'), titleKey: 'placeholder_title_6', excerptKey: 'placeholder_excerpt_6' },
  ];

  return (
    <div className="pt-16 pb-20">
      {/* Hero */}
      <section className="bg-gray-950 text-white py-20 mb-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
          <p className="text-gray-400 text-lg">{t('subtitle')}</p>
        </div>
      </section>

      {/* News Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
              {/* Thumbnail Placeholder */}
              <div className="w-full h-[200px] bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">Image Placeholder</span>
              </div>
              
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {item.category}
                  </span>
                  <span className="text-sm text-gray-500">{item.date}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {t(item.titleKey as any)}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {t(item.excerptKey as any)}
                </p>
                
                <button className="text-yellow-600 font-semibold hover:text-yellow-700 transition-colors">
                  Read More →
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination Placeholder */}
        <div className="mt-12 flex justify-center space-x-2">
          <button disabled className="px-4 py-2 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed">Previous</button>
          <button disabled className="px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg cursor-not-allowed">1</button>
          <button disabled className="px-4 py-2 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed">Next</button>
        </div>
      </section>
    </div>
  );
}