"use client";

import { useEffect, useState } from "react";
import {
  Save,
  Bell,
  Mail,
  Phone,
  FileCheck,
  AlertCircle,
  CheckCircle,
  Settings,
  RefreshCw,
} from "lucide-react";

interface SiteSettings {
  admin_email: string;
  admin_phone: string;
  contact_notify_email: string;
  email_notifications: string;
  auto_publish_news: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  admin_email: "lixinvn.co.ltd@gmail.com",
  admin_phone: "0395 536 768",
  contact_notify_email: "lixinvn.co.ltd@gmail.com",
  email_notifications: "true",
  auto_publish_news: "false",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setSettings({ ...DEFAULT_SETTINGS, ...data.settings });
    } catch {
      showToast("error", "Không thể tải cài đặt");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Save failed");
      }
      showToast("success", "Đã lưu cài đặt thành công!");
    } catch (err) {
      showToast(
        "error",
        `Lưu thất bại: ${err instanceof Error ? err.message : "Lỗi không xác định"}`
      );
    } finally {
      setSaving(false);
    }
  };

  const toggle = (key: keyof SiteSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: prev[key] === "true" ? "false" : "true",
    }));
  };

  const set = (key: keyof SiteSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin text-gray-400" size={28} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-sm font-medium transition-all ${
            toast.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle size={18} className="text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
          )}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cài đặt hệ thống</h1>
          <p className="text-gray-500 text-sm mt-1">Cấu hình các thông số hoạt động của website</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Đang lưu..." : "Lưu cài đặt"}
        </button>
      </div>

      <div className="space-y-5">
        {/* Section: Thông tin liên hệ admin */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Settings size={16} className="text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">Thông tin Admin</h2>
              <p className="text-xs text-gray-500">Thông tin hiển thị và liên lạc</p>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Admin Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Mail size={15} className="text-gray-400" />
                Email Admin
              </label>
              <input
                type="email"
                value={settings.admin_email}
                onChange={(e) => set("admin_email", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="admin@example.com"
              />
              <p className="text-xs text-gray-400 mt-1.5">
                Email đăng nhập admin và hiển thị trên website
              </p>
            </div>

            {/* Admin Phone */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Phone size={15} className="text-gray-400" />
                Số điện thoại Admin
              </label>
              <input
                type="tel"
                value={settings.admin_phone}
                onChange={(e) => set("admin_phone", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="0xxx xxx xxx"
              />
              <p className="text-xs text-gray-400 mt-1.5">
                Số điện thoại Hotline / Zalo hiển thị trong email gửi khách
              </p>
            </div>
          </div>
        </div>

        {/* Section: Thông báo Email */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <Bell size={16} className="text-amber-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">Thông báo Email</h2>
              <p className="text-xs text-gray-500">Cấu hình gửi email tự động</p>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Toggle email notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Bell size={16} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Bật thông báo email</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Nhận email khi có liên hệ mới từ khách hàng
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggle("email_notifications")}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings.email_notifications === "true" ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.email_notifications === "true" ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Contact notify email */}
            <div
              className={
                settings.email_notifications !== "true" ? "opacity-50 pointer-events-none" : ""
              }
            >
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Mail size={15} className="text-gray-400" />
                Email nhận thông báo liên hệ
              </label>
              <input
                type="email"
                value={settings.contact_notify_email}
                onChange={(e) => set("contact_notify_email", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="notify@example.com"
              />
              <p className="text-xs text-gray-400 mt-1.5">
                Email này sẽ nhận tất cả thông báo khi có liên hệ mới từ website
              </p>
            </div>
          </div>
        </div>

        {/* Section: Quản lý tin tức */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <FileCheck size={16} className="text-emerald-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">Quản lý nội dung</h2>
              <p className="text-xs text-gray-500">Cài đặt quy trình đăng bài</p>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <FileCheck size={16} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Tự động duyệt bài viết</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Bài viết mới sẽ tự động được đăng thay vì lưu nháp
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggle("auto_publish_news")}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings.auto_publish_news === "true" ? "bg-emerald-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.auto_publish_news === "true" ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {settings.auto_publish_news === "true" && (
              <div className="mt-4 flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  Chế độ tự động duyệt đang <strong>bật</strong>. Mọi bài viết mới tạo sẽ được đăng
                  công khai ngay lập tức.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Save button (bottom) */}
        <div className="flex justify-end pt-2 pb-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Đang lưu..." : "Lưu cài đặt"}
          </button>
        </div>
      </div>
    </div>
  );
}
