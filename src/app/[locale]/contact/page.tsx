'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function ContactPage() {
  const t = useTranslations('contact');
  const tServices = useTranslations('services');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    date: '',
    time: '',
    notes: '',
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    // Reset form
    setFormData({
      name: '',
      phone: '',
      email: '',
      service: '',
      date: '',
      time: '',
      notes: '',
    });
    // Hide toast after 5s
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const services = [
    'accounting', 'management', 'tax', 'finance', 'investment', 
    'hr', 'tech', 'customs', 'setup'
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

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Contact Info */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('info_title')}</h2>
            
            <div className="space-y-6 mb-10">
              <div className="flex items-start space-x-4">
                <div className="mt-1 bg-yellow-100 p-3 rounded-full text-yellow-600">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">Địa chỉ</h3>
                  <p className="text-gray-600">Số 2, Tổ 4, Ấp 4, xã Truông Mít, Tỉnh Tây Ninh</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="mt-1 bg-yellow-100 p-3 rounded-full text-yellow-600">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">Điện thoại / Zalo</h3>
                  <p className="text-gray-600">0395536768</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="mt-1 bg-yellow-100 p-3 rounded-full text-yellow-600">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">Email</h3>
                  <p className="text-gray-600">lixinvn.co.ltd@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div>
              <h3 className="font-semibold text-gray-900 text-lg mb-4">{t('map_title')}</h3>
              <div className="w-full h-[300px] bg-gray-200 rounded-xl flex items-center justify-center">
                <span className="text-gray-500">Google Maps Embed Placeholder</span>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('form_title')}</h2>
            
            {showSuccess && (
              <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-lg border border-green-200 font-medium">
                {t('success')}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">{t('name')} *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder={t('name_placeholder')}
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">{t('phone')} *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    placeholder={t('phone_placeholder')}
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder={t('email_placeholder')}
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">{t('service')}</label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all bg-white"
                >
                  <option value="">{t('service_placeholder')}</option>
                  {services.map((srv) => (
                    <option key={srv} value={srv}>{tServices(srv)}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">{t('date')}</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">{t('time')}</label>
                  <select
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all bg-white"
                  >
                    <option value="">{t('time_placeholder')}</option>
                    <option value="time_1">{t('time_1')}</option>
                    <option value="time_2">{t('time_2')}</option>
                    <option value="time_3">{t('time_3')}</option>
                    <option value="time_4">{t('time_4')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">{t('notes')}</label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  placeholder={t('notes_placeholder')}
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all resize-y"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors"
              >
                {t('submit')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}