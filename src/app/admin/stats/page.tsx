"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { News } from "@/types/news";

const CATEGORY_LABELS: Record<string, string> = {
  tax: "Thuế",
  general: "Thuế",
  accounting: "Kế toán",
  legal: "Pháp lý",
  business: "Doanh nghiệp",
  other: "Khác",
};

export default function AdminStatsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news?status=all&limit=1000")
      .then((res) => res.json())
      .then((data) => setNews(data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const { totalReads, published, avgReads, top, byCategory } = useMemo(() => {
    const pub = news.filter((n) => n.status === "published");
    const total = pub.reduce((sum, n) => sum + (n.view_count || 0), 0);
    const sorted = [...pub].sort((a, b) => (b.view_count || 0) - (a.view_count || 0));

    const cat = new Map<string, number>();
    for (const n of pub) {
      cat.set(n.category, (cat.get(n.category) || 0) + (n.view_count || 0));
    }
    const catRows = [...cat.entries()].sort((a, b) => b[1] - a[1]);

    return {
      totalReads: total,
      published: pub.length,
      avgReads: pub.length ? Math.round(total / pub.length) : 0,
      top: sorted.slice(0, 10),
      byCategory: catRows,
    };
  }, [news]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  const cards = [
    {
      label: "Tổng lượt đọc bài",
      value: totalReads.toLocaleString("vi-VN"),
      icon: "👁️",
      bg: "bg-blue-50",
      text: "text-blue-700",
    },
    {
      label: "Bài đã đăng",
      value: published.toLocaleString("vi-VN"),
      icon: "📰",
      bg: "bg-green-50",
      text: "text-green-700",
    },
    {
      label: "Trung bình / bài",
      value: avgReads.toLocaleString("vi-VN"),
      icon: "📊",
      bg: "bg-yellow-50",
      text: "text-yellow-700",
    },
  ];

  const maxCat = byCategory.length ? byCategory[0][1] : 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Thống kê</h1>

      {/* Read-count summary (from the DB view_count counter) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((c) => (
          <div key={c.label} className={`${c.bg} rounded-xl p-6 border border-gray-100`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{c.label}</p>
                <p className={`text-3xl font-bold ${c.text} mt-1`}>{c.value}</p>
              </div>
              <span className="text-3xl">{c.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top articles by reads */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Bài đọc nhiều nhất</h2>
          </div>
          {top.length === 0 ? (
            <div className="p-6 text-center text-gray-500">Chưa có dữ liệu</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {top.map((item, i) => (
                <div key={item.id} className="px-6 py-3 flex items-center gap-3">
                  <span className="w-6 text-center text-sm font-bold text-gray-400">{i + 1}</span>
                  <Link
                    href={`/admin/news/${item.id}/edit`}
                    className="flex-1 min-w-0 text-sm font-medium text-gray-900 truncate hover:text-yellow-600"
                  >
                    {item.title_vi || "(Chưa có tiêu đề)"}
                  </Link>
                  <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                    👁️ {(item.view_count || 0).toLocaleString("vi-VN")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reads by category */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Lượt đọc theo danh mục</h2>
          </div>
          {byCategory.length === 0 ? (
            <div className="p-6 text-center text-gray-500">Chưa có dữ liệu</div>
          ) : (
            <div className="p-6 space-y-4">
              {byCategory.map(([cat, count]) => (
                <div key={cat}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{CATEGORY_LABELS[cat] || cat}</span>
                    <span className="text-gray-500">{count.toLocaleString("vi-VN")}</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-yellow-500"
                      style={{ width: maxCat ? `${Math.max(4, (count / maxCat) * 100)}%` : "0%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Site-wide traffic lives in Vercel Web Analytics, not our DB. */}
      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Lượt truy cập toàn site</h2>
        <p className="text-sm text-gray-600">
          Số liệu truy cập / khách duy nhất / trang xem nhiều được thu thập bằng{" "}
          <span className="font-medium">Vercel Web Analytics</span> (không cookie, không PII). Xem
          chi tiết tại{" "}
          <a
            href="https://vercel.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-600 font-medium hover:text-yellow-500 underline"
          >
            Vercel Dashboard → Analytics
          </a>
          .
        </p>
      </div>
    </div>
  );
}
