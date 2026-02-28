"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { News } from "@/types/news";

const CATEGORY_LABELS: Record<string, string> = {
  tax: "Thuế",
  accounting: "Kế toán",
  legal: "Pháp lý",
  business: "Doanh nghiệp",
  other: "Khác",
};

export default function AdminNewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/news?status=${filter}&limit=100`);
      const data = await res.json();
      setNews(data.data || []);
    } catch {
      console.error("Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn chắc chắn muốn xóa tin này?")) return;

    try {
      const res = await fetch(`/api/news/${id}`, { method: "DELETE" });
      if (res.ok) {
        setNews((prev) => prev.filter((n) => n.id !== id));
      }
    } catch {
      alert("Xóa thất bại");
    }
  };

  const tabs = [
    { key: "all" as const, label: "Tất cả" },
    { key: "published" as const, label: "Đã đăng" },
    { key: "draft" as const, label: "Bản nháp" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý tin tức</h1>
        <Link
          href="/admin/news/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          + Thêm tin mới
        </Link>
      </div>

      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === tab.key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Đang tải...</div>
        ) : news.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-lg mb-2">Chưa có tin tức nào</p>
            <Link href="/admin/news/new" className="text-blue-600 hover:underline">
              Thêm tin tức đầu tiên →
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  #
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Tiêu đề
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Danh mục
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Trạng thái
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Ngày tạo
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {news.map((item, idx) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500">{idx + 1}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 line-clamp-1">
                      {item.title_vi || "Chưa có tiêu đề"}
                      {item.source_url && (
                        <a
                          href={item.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-400 hover:text-blue-600"
                          title="Xem bài gốc"
                        >
                          🔗
                        </a>
                      )}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                      {CATEGORY_LABELS[item.category] || item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        item.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.status === "published" ? "Đã đăng" : "Nháp"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <Link
                      href={`/admin/news/${item.id}/edit`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Sửa
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
