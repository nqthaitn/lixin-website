"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Clock,
  X,
  MessageSquare,
  Save,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface Contact {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  service_type: string;
  message: string | null;
  source: string;
  status: string;
  admin_note?: string | null;
  created_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  new: { label: "Mới", bg: "bg-blue-100", text: "text-blue-700" },
  contacted: {
    label: "Đã liên hệ",
    bg: "bg-yellow-100",
    text: "text-yellow-700",
  },
  converted: {
    label: "Thành công",
    bg: "bg-green-100",
    text: "text-green-700",
  },
  rejected: { label: "Từ chối", bg: "bg-red-100", text: "text-red-700" },
};

const SERVICE_LABELS: Record<string, string> = {
  general: "Chung",
  accounting: "Kế toán",
  other: "Khác",
};

const PAGE_SIZE = 20;

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Detail modal
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [editStatus, setEditStatus] = useState("");
  const [editNote, setEditNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: PAGE_SIZE.toString(),
        offset: (page * PAGE_SIZE).toString(),
        status: statusFilter,
        service: serviceFilter,
      });
      if (searchQuery) params.set("search", searchQuery);

      const res = await fetch(`/api/contacts?${params}`);
      if (res.ok) {
        const { data, count } = await res.json();
        setContacts(data || []);
        setTotalCount(count || 0);
      }
    } catch {
      console.error("Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, serviceFilter, searchQuery]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleSearch = () => {
    setPage(0);
    setSearchQuery(searchInput);
  };

  const handleStatusChange = (status: string) => {
    setPage(0);
    setStatusFilter(status);
  };

  const handleServiceChange = (service: string) => {
    setPage(0);
    setServiceFilter(service);
  };

  const openDetail = (contact: Contact) => {
    setSelectedContact(contact);
    setEditStatus(contact.status);
    setEditNote(contact.admin_note || "");
  };

  const closeDetail = () => {
    setSelectedContact(null);
  };

  const saveContact = async () => {
    if (!selectedContact) return;
    setSaving(true);
    try {
      const res = await fetch("/api/contacts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedContact.id,
          status: editStatus,
          admin_note: editNote,
        }),
      });
      if (res.ok) {
        const { data } = await res.json();
        setContacts((prev) => prev.map((c) => (c.id === data.id ? data : c)));
        setSelectedContact(data);
        showToast("success", "Đã lưu thay đổi thành công!");
      } else {
        showToast("error", "Lưu thất bại, vui lòng thử lại.");
      }
    } catch {
      showToast("error", "Lỗi kết nối, vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const newCount = contacts.filter((c) => c.status === "new").length;

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý liên hệ</h1>
          <p className="text-sm text-gray-500 mt-1">
            Tổng cộng {totalCount} liên hệ
            {newCount > 0 && (
              <span className="ml-2 text-blue-600 font-medium">({newCount} mới)</span>
            )}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Tìm theo tên, SĐT, email..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="pl-9 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm appearance-none bg-white"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="new">🔵 Mới</option>
              <option value="contacted">🟡 Đã liên hệ</option>
              <option value="converted">🟢 Thành công</option>
              <option value="rejected">🔴 Từ chối</option>
            </select>
          </div>

          {/* Service Filter */}
          <div>
            <select
              value={serviceFilter}
              onChange={(e) => handleServiceChange(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm appearance-none bg-white"
            >
              <option value="all">Tất cả dịch vụ</option>
              <option value="general">Chung</option>
              <option value="accounting">Kế toán</option>
              <option value="other">Khác</option>
            </select>
          </div>

          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Đang tải...</div>
          </div>
        ) : contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <MessageSquare size={48} className="mb-4 text-gray-300" />
            <p>Không tìm thấy liên hệ nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Liên hệ
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Dịch vụ
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Ngày gửi
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {contacts.map((contact) => {
                  const sc = STATUS_CONFIG[contact.status] || STATUS_CONFIG.new;
                  return (
                    <tr
                      key={contact.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        contact.status === "new" ? "bg-blue-50/30" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{contact.name}</div>
                        {contact.message && (
                          <div className="text-xs text-gray-500 mt-1 max-w-[200px] truncate">
                            {contact.message}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-700">
                          <Phone size={13} className="text-gray-400" />
                          {contact.phone}
                        </div>
                        {contact.email && (
                          <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                            <Mail size={13} className="text-gray-400" />
                            {contact.email}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">
                          {SERVICE_LABELS[contact.service_type] || contact.service_type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.text}`}
                        >
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                          <Clock size={13} />
                          {new Date(contact.created_at).toLocaleDateString("vi-VN")}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {new Date(contact.created_at).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openDetail(contact)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                        >
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Hiển thị {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, totalCount)} /{" "}
              {totalCount}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm text-gray-700 font-medium px-2">
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Chi tiết liên hệ</h2>
              <button
                onClick={closeDetail}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                    {selectedContact.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">{selectedContact.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(selectedContact.created_at).toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-500 text-xs mb-1">Số điện thoại</p>
                    <a
                      href={`tel:${selectedContact.phone}`}
                      className="text-blue-600 font-medium hover:underline"
                    >
                      {selectedContact.phone}
                    </a>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-500 text-xs mb-1">Email</p>
                    <p className="text-gray-900 font-medium">{selectedContact.email || "—"}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-500 text-xs mb-1">Dịch vụ</p>
                    <p className="text-gray-900 font-medium">
                      {SERVICE_LABELS[selectedContact.service_type] || selectedContact.service_type}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-500 text-xs mb-1">Nguồn</p>
                    <p className="text-gray-900 font-medium">{selectedContact.source}</p>
                  </div>
                </div>

                {selectedContact.message && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-500 text-xs mb-1">Tin nhắn</p>
                    <p className="text-gray-900 text-sm whitespace-pre-wrap">
                      {selectedContact.message}
                    </p>
                  </div>
                )}
              </div>

              {/* Status update */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                    <button
                      key={key}
                      onClick={() => setEditStatus(key)}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                        editStatus === key
                          ? `${cfg.bg} ${cfg.text} border-current ring-2 ring-current/20`
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {cfg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Admin note */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú nội bộ
                </label>
                <textarea
                  rows={3}
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  placeholder="Ghi chú cho nhân viên..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm resize-y"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                onClick={closeDetail}
                className="px-4 py-2 text-gray-600 text-sm font-medium hover:text-gray-800 transition-colors"
              >
                Đóng
              </button>
              <button
                onClick={saveContact}
                disabled={saving}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Save size={16} />
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] animate-[slideUp_0.3s_ease-out]">
          <div
            className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border ${
              toast.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
            ) : (
              <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
