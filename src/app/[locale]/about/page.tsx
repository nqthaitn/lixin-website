"use client";

import { useTranslations } from "next-intl";
import { Award, Eye, Heart, Calendar, Users } from "lucide-react";

export default function AboutPage() {
  const t = useTranslations("about");

  const values = [
    { icon: Award, titleKey: "value_1_title", textKey: "value_1_text" },
    { icon: Eye, titleKey: "value_2_title", textKey: "value_2_text" },
    { icon: Heart, titleKey: "value_3_title", textKey: "value_3_text" },
  ];

  const team = [
    { name: "Nguyễn Văn A", role: "Giám đốc điều hành" },
    { name: "Lý Minh B", role: "Chuyên gia thuế" },
    { name: "Trần Thị C", role: "Kế toán trưởng" },
    { name: "王大明", role: "Tư vấn đầu tư" },
  ];

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="bg-gray-950 text-white py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold">{t("title")}</h1>
          <p className="mt-4 text-gray-400 text-lg max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>
      </section>

      {/* History */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Calendar size={24} className="text-yellow-500" />
                <h2 className="text-3xl font-bold text-gray-900">{t("history_title")}</h2>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">{t("history_text")}</p>
            </div>
            <div className="bg-gray-100 rounded-2xl p-12 text-center">
              <div className="text-6xl font-bold text-yellow-500">2019</div>
              <div className="mt-2 text-gray-500 text-lg">Est.</div>
              <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">200+</div>
                  <div className="text-sm text-gray-500">Khách hàng</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">7+</div>
                  <div className="text-sm text-gray-500">Năm</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t("mission_title")}</h3>
              <p className="text-gray-600 leading-relaxed">{t("mission_text")}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t("vision_title")}</h3>
              <p className="text-gray-600 leading-relaxed">{t("vision_text")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-16">
            {t("values_title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map(({ icon: Icon, titleKey, textKey }) => (
              <div key={titleKey} className="text-center">
                <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Icon size={32} className="text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t(titleKey)}</h3>
                <p className="text-gray-600">{t(textKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{t("team_title")}</h2>
            <p className="mt-4 text-gray-600 text-lg">{t("team_subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-xl p-6 text-center border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users size={32} className="text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
