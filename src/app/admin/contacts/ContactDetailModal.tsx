"use client";

import { X, Save, Send, Trash2 } from "lucide-react";
import { Contact, STATUS_CONFIG, SERVICE_LABELS, LOCALE_CONFIG } from "./constants";

export function ContactDetailModal({
  contact,
  editStatus,
  editNote,
  saving,
  onEditStatus,
  onEditNote,
  onClose,
  onSave,
  onDelete,
  onReply,
}: {
  contact: Contact;
  editStatus: string;
  editNote: string;
  saving: boolean;
  onEditStatus: (status: string) => void;
  onEditNote: (note: string) => void;
  onClose: () => void;
  onSave: () => void;
  onDelete: (contact: Contact) => void;
  onReply: (contact: Contact) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Chi tiết liên hệ</h2>
          <button
            onClick={onClose}
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
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {contact.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-lg">{contact.name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(contact.created_at).toLocaleString("vi-VN")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-500 text-xs mb-1">Số điện thoại</p>
                <a
                  href={`tel:${contact.phone}`}
                  className="text-blue-600 font-medium hover:underline"
                >
                  {contact.phone}
                </a>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-500 text-xs mb-1">Email</p>
                <p className="text-gray-900 font-medium">{contact.email || "—"}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-500 text-xs mb-1">Dịch vụ</p>
                <p className="text-gray-900 font-medium">
                  {SERVICE_LABELS[contact.service_type] || contact.service_type}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-500 text-xs mb-1">Nguồn</p>
                <p className="text-gray-900 font-medium">{contact.source}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-500 text-xs mb-1">Ngôn ngữ</p>
                <p className="text-gray-900 font-medium">
                  {contact.locale ? (
                    <>
                      {LOCALE_CONFIG[contact.locale]?.flag}{" "}
                      {LOCALE_CONFIG[contact.locale]?.label || contact.locale}
                    </>
                  ) : (
                    "—"
                  )}
                </p>
              </div>
            </div>

            {contact.message && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-500 text-xs mb-1">Tin nhắn</p>
                <p className="text-gray-900 text-sm whitespace-pre-wrap">{contact.message}</p>
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
                  onClick={() => onEditStatus(key)}
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú nội bộ</label>
            <textarea
              rows={3}
              value={editNote}
              onChange={(e) => onEditNote(e.target.value)}
              placeholder="Ghi chú cho nhân viên..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm resize-y"
            />
          </div>

          {/* Reply button in modal */}
          {contact.email && (
            <button
              onClick={() => onReply(contact)}
              className="flex items-center gap-2 w-full justify-center py-2.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors border border-blue-100"
            >
              <Send size={15} />
              Trả lời qua email ({contact.email})
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={() => onDelete(contact)}
            className="flex items-center gap-1.5 px-3 py-2 text-red-500 text-sm font-medium hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={15} />
            Xóa
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 text-sm font-medium hover:text-gray-800 transition-colors"
            >
              Đóng
            </button>
            <button
              onClick={onSave}
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Save size={16} />
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
