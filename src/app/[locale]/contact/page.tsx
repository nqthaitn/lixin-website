"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";

export default function ContactPage() {
  const t = useTranslations("contact");
  const tServices = useTranslations("services");
  const tFooter = useTranslations("footer");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    date: "",
    time: "",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        setSubmitError(data.error || "Có lỗi xảy ra, vui lòng thử lại");
        return;
      }

      setShowSuccess(true);
      setFormData({
        name: "",
        phone: "",
        email: "",
        service: "",
        date: "",
        time: "",
        notes: "",
      });
      setTimeout(() => setShowSuccess(false), 5000);
    } catch {
      setSubmitError("Lỗi kết nối, vui lòng thử lại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const services = [
    "accounting",
    "management",
    "tax",
    "finance",
    "investment",
    "hr",
    "tech",
    "customs",
    "setup",
  ];

  return (
    <div className="pt-16 pb-20">
      {/* Hero */}
      <section className="bg-gray-950 text-white py-20 mb-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("title")}</h1>
          <p className="text-gray-400 text-lg">{t("subtitle")}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Contact Info */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">{t("info_title")}</h2>

            <div className="space-y-6 mb-10">
              <div className="flex items-start space-x-4">
                <div className="mt-1 bg-yellow-100 p-3 rounded-full text-yellow-600">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">{t("label_address")}</h3>
                  <p className="text-gray-600">{tFooter("address")}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="mt-1 bg-yellow-100 p-3 rounded-full text-yellow-600">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">{t("label_phone")}</h3>
                  <p className="text-gray-600">0395536768</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="mt-1 bg-yellow-100 p-3 rounded-full text-yellow-600">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">{t("label_email")}</h3>
                  <p className="text-gray-600">lixinvn.co.ltd@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div>
              <h3 className="font-semibold text-gray-900 text-lg mb-4">{t("map_title")}</h3>
              <div className="w-full h-[300px] rounded-xl overflow-hidden border border-gray-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d500!2d106.3074665!3d11.1549997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310b3b188ab57045%3A0x4512fa529b71fdd0!2zQ8O0bmcgVHkgVE5ISCBE4buLY2ggVuG7pSB2w6AgVMawIFbhuqVuIExJWElO!5e0!3m2!1svi!2s!4v1700000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lixin VN Location"
                />
              </div>
              <a
                href="https://maps.app.goo.gl/3KBZzsisuxKKapFq8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 text-sm text-yellow-600 hover:text-yellow-500 font-medium transition-colors"
              >
                <MapPin size={14} />
                {t("open_in_maps")}
              </a>
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("form_title")}</h2>

            {showSuccess && (
              <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-lg border border-green-200 font-medium">
                {t("success")}
              </div>
            )}

            {submitError && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 font-medium">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  {t("name")} *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder={t("name_placeholder")}
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    {t("phone")} *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    placeholder={t("phone_placeholder")}
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {t("email")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder={t("email_placeholder")}
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                  {t("service")}
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all bg-white"
                >
                  <option value="">{t("service_placeholder")}</option>
                  {services.map((srv) => (
                    <option key={srv} value={srv}>
                      {tServices(srv)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    {t("date")}
                  </label>
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
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                    {t("time")}
                  </label>
                  <select
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all bg-white"
                  >
                    <option value="">{t("time_placeholder")}</option>
                    <option value="8:00-10:00">{t("time_1")}</option>
                    <option value="10:00-12:00">{t("time_2")}</option>
                    <option value="14:00-16:00">{t("time_3")}</option>
                    <option value="16:00-18:00">{t("time_4")}</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  {t("notes")}
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  placeholder={t("notes_placeholder")}
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all resize-y"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? t("submitting") : t("submit")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
