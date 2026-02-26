"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

const RichEditor = dynamic(() => import("@/components/admin/RichEditor"), { ssr: false });

const LANG_TABS = [
  { key: "vi", label: "🇻🇳 Tiếng Việt" },
  { key: "en", label: "🇬🇧 English" },
  { key: "zh", label: "🇨🇳 中文" },
];

const CATEGORIES = [
  { value: "general", label: "Thuế / Chung" },
  { value: "accounting", label: "Kế toán" },
  { value: "legal", label: "Pháp lý" },
];

const PLACEHOLDERS: Record<string, { title: string; excerpt: string; content: string }> = {
  vi: {
    title: "Nhập tiêu đề tiếng Việt",
    excerpt: "Nhập tóm tắt tiếng Việt",
    content: "Nhập nội dung tiếng Việt",
  },
  en: {
    title: "Enter English title",
    excerpt: "Enter English excerpt",
    content: "Enter English content",
  },
  zh: { title: "输入中文标题", excerpt: "输入中文摘要", content: "输入中文内容" },
};

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [activeLang, setActiveLang] = useState("vi");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title_vi: "",
    title_en: "",
    title_zh: "",
    excerpt_vi: "",
    excerpt_en: "",
    excerpt_zh: "",
    content_vi: "",
    content_en: "",
    content_zh: "",
    category: "general",
    cover_image: "",
    status: "draft" as "draft" | "published",
  });

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`/api/news/${id}`);
        if (!res.ok) throw new Error("Not found");
        const { data } = await res.json();
        setForm({
          title_vi: data.title_vi || "",
          title_en: data.title_en || "",
          title_zh: data.title_zh || "",
          excerpt_vi: data.excerpt_vi || "",
          excerpt_en: data.excerpt_en || "",
          excerpt_zh: data.excerpt_zh || "",
          content_vi: data.content_vi || "",
          content_en: data.content_en || "",
          content_zh: data.content_zh || "",
          category: data.category || "other",
          cover_image: data.cover_image || "",
          status: data.status || "draft",
        });
      } catch {
        setError("Không tìm thấy tin tức");
      } finally {
        setFetching(false);
      }
    };
    fetchNews();
  }, [id]);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (status: "draft" | "published") => {
    if (!form.title_vi.trim()) {
      setError("Tiêu đề tiếng Việt là bắt buộc");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/news/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, status }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Lỗi khi cập nhật");
        return;
      }

      router.push("/admin/news");
    } catch {
      setError("Lỗi kết nối, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bạn chắc chắn muốn xóa tin này?")) return;

    try {
      const res = await fetch(`/api/news/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/admin/news");
      }
    } catch {
      alert("Xóa thất bại");
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  const ph = PLACEHOLDERS[activeLang];

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa tin tức</h1>
        <Link href="/admin/news" className="text-gray-500 hover:text-gray-700 text-sm">
          ← Quay lại
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">{error}</div>
      )}

      {/* Language Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {LANG_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveLang(tab.key)}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeLang === tab.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Language-specific fields */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
          <input
            type="text"
            value={form[`title_${activeLang}` as keyof typeof form]}
            onChange={(e) => updateField(`title_${activeLang}`, e.target.value)}
            placeholder={ph.title}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tóm tắt</label>
          <textarea
            rows={3}
            value={form[`excerpt_${activeLang}` as keyof typeof form]}
            onChange={(e) => updateField(`excerpt_${activeLang}`, e.target.value)}
            placeholder={ph.excerpt}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
          {!fetching &&
            LANG_TABS.map((tab) => (
              <div key={tab.key} className={activeLang === tab.key ? "block" : "hidden"}>
                <RichEditor
                  key={`editor-${tab.key}-${id}`}
                  content={form[`content_${tab.key}` as keyof typeof form]}
                  onChange={(html) => updateField(`content_${tab.key}`, html)}
                  placeholder={PLACEHOLDERS[tab.key].content}
                />
              </div>
            ))}
        </div>
      </div>

      {/* Common fields */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin chung</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
            <select
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL ảnh đại diện</label>
            <input
              type="text"
              value={form.cover_image}
              onChange={(e) => updateField("cover_image", e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleSubmit("published")}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Đang lưu..." : "Đăng bài"}
          </button>
          <button
            onClick={() => handleSubmit("draft")}
            disabled={loading}
            className="bg-gray-200 text-gray-800 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 transition-colors"
          >
            Lưu nháp
          </button>
          <Link href="/admin/news" className="text-gray-500 hover:text-gray-700 px-4 py-2.5">
            Hủy
          </Link>
        </div>
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition-colors"
        >
          Xóa bài
        </button>
      </div>
    </div>
  );
}
