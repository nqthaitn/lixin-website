"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Filter, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { Contact, PAGE_SIZE } from "./constants";
import { ContactCard } from "./ContactCard";
import { ContactDetailModal } from "./ContactDetailModal";
import { ReplyModal } from "./ReplyModal";
import { DeleteDialog } from "./DeleteDialog";
import { Toast, ToastState } from "./Toast";

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
  const [toast, setToast] = useState<ToastState | null>(null);

  // Reply email (shared for both inline quick reply and modal reply)
  const [replyTarget, setReplyTarget] = useState<Contact | null>(null);
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const openReply = (contact: Contact) => {
    setReplyTarget(contact);
    setReplySubject(`Re: Yêu cầu tư vấn — ${contact.name}`);
    setReplyMessage("");
  };

  const closeReply = () => {
    setReplyTarget(null);
    setReplyMessage("");
  };

  const sendReply = async () => {
    if (!replyTarget?.email || !replyMessage.trim()) return;
    setSendingReply(true);
    try {
      const res = await fetch("/api/contacts/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactId: replyTarget.id,
          to: replyTarget.email,
          subject: replySubject,
          message: replyMessage,
        }),
      });
      if (res.ok) {
        showToast("success", `Đã gửi email cho ${replyTarget.email}`);
        closeReply();
        fetchContacts();
      } else {
        const data = await res.json();
        showToast("error", data.error || "Gửi email thất bại");
      }
    } catch {
      showToast("error", "Lỗi kết nối, vui lòng thử lại.");
    } finally {
      setSendingReply(false);
    }
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

  const deleteContact = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/contacts?id=${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("success", `Đã xóa liên hệ "${deleteTarget.name}"`);
        setDeleteTarget(null);
        if (selectedContact?.id === deleteTarget.id) closeDetail();
        fetchContacts();
      } else {
        showToast("error", "Xóa thất bại, vui lòng thử lại.");
      }
    } catch {
      showToast("error", "Lỗi kết nối, vui lòng thử lại.");
    } finally {
      setDeleting(false);
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
        <div className="flex flex-col gap-3">
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

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <div className="relative">
              <Filter
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <select
                value={statusFilter}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm appearance-none bg-white"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="new">🔵 Mới</option>
                <option value="contacted">🟡 Đã liên hệ</option>
                <option value="converted">🟢 Thành công</option>
                <option value="rejected">🔴 Từ chối</option>
              </select>
            </div>

            <select
              value={serviceFilter}
              onChange={(e) => handleServiceChange(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm appearance-none bg-white"
            >
              <option value="all">Tất cả dịch vụ</option>
              <option value="general">Chung</option>
              <option value="accounting">Kế toán</option>
              <option value="other">Khác</option>
            </select>

            <button
              onClick={handleSearch}
              className="col-span-2 md:col-span-1 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-xl border border-gray-200 flex items-center justify-center h-64">
            <div className="text-gray-500">Đang tải...</div>
          </div>
        ) : contacts.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-center h-64 text-gray-500">
            <MessageSquare size={48} className="mb-4 text-gray-300" />
            <p>Không tìm thấy liên hệ nào</p>
          </div>
        ) : (
          contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onReply={openReply}
              onDetail={openDetail}
              onDelete={setDeleteTarget}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 bg-white rounded-xl border border-gray-200 px-6 py-4">
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

      {selectedContact && (
        <ContactDetailModal
          contact={selectedContact}
          editStatus={editStatus}
          editNote={editNote}
          saving={saving}
          onEditStatus={setEditStatus}
          onEditNote={setEditNote}
          onClose={closeDetail}
          onSave={saveContact}
          onDelete={setDeleteTarget}
          onReply={(c) => {
            closeDetail();
            openReply(c);
          }}
        />
      )}

      {replyTarget && (
        <ReplyModal
          target={replyTarget}
          subject={replySubject}
          message={replyMessage}
          sending={sendingReply}
          onSubject={setReplySubject}
          onMessage={setReplyMessage}
          onClose={closeReply}
          onSend={sendReply}
        />
      )}

      {deleteTarget && (
        <DeleteDialog
          target={deleteTarget}
          deleting={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={deleteContact}
        />
      )}

      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
