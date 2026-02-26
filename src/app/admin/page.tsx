"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { News } from "@/types/news";

export default function AdminDashboard() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news?status=all&limit=1000");
        const data = await res.json();
        setNews(data.data || []);
      } catch {
        console.error("Failed to fetch news");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const published = news.filter((n) => n.status === "published").length;
  const drafts = news.filter((n) => n.status === "draft").length;
  const recent = news.slice(0, 5);

  const stats = [
    {
      label: "Tổng tin tức",
      value: news.length,
      icon: "📰",
      bg: "bg-blue-50",
      text: "text-blue-700",
    },
    {
      label: "Đã đăng",
      value: published,
      icon: "✅",
      bg: "bg-green-50",
      text: "text-green-700",
    },
    {
      label: "Bản nháp",
      value: drafts,
      icon: "📝",
      bg: "bg-yellow-50",
      text: "text-yellow-700",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
        <Link
          href="/admin/news/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          + Thêm tin mới
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className={`${stat.bg} rounded-xl p-6 border border-gray-100`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.text} mt-1`}>{stat.value}</p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Tin tức mới nhất</h2>
        </div>
        {recent.length === 0 ? (
          <div className="p-6 text-center text-gray-500">Chưa có tin tức nào</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recent.map((item) => (
              <div key={item.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{item.title_vi || "Chưa có tiêu đề"}</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {new Date(item.created_at).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    item.status === "published"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {item.status === "published" ? "Đã đăng" : "Nháp"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
