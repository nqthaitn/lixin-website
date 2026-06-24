"use client";

import {
  Phone,
  Mail,
  Clock,
  MessageSquare,
  StickyNote,
  Send,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { Contact, STATUS_CONFIG, SERVICE_LABELS, LOCALE_CONFIG } from "./constants";

export function ContactCard({
  contact,
  onReply,
  onDetail,
  onDelete,
}: {
  contact: Contact;
  onReply: (contact: Contact) => void;
  onDetail: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
}) {
  const sc = STATUS_CONFIG[contact.status] || STATUS_CONFIG.new;
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 overflow-hidden transition-all hover:shadow-md ${
        contact.status === "new" ? "border-l-4 border-l-blue-500" : ""
      }`}
    >
      {/* Card Header */}
      <div className="px-4 sm:px-5 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          {/* Left: Avatar + Info */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
              {contact.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{contact.name}</h3>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${sc.bg} ${sc.text}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}></span>
                  {sc.label}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                  {SERVICE_LABELS[contact.service_type] || contact.service_type}
                </span>
                {contact.locale && (
                  <span
                    className="text-xs text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded"
                    title={LOCALE_CONFIG[contact.locale]?.label || contact.locale}
                  >
                    {LOCALE_CONFIG[contact.locale]?.flag || "🌐"}{" "}
                    <span className="hidden sm:inline">
                      {LOCALE_CONFIG[contact.locale]?.label || contact.locale}
                    </span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1.5 text-xs sm:text-sm text-gray-500 flex-wrap">
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                >
                  <Phone size={12} className="text-gray-400" />
                  {contact.phone}
                </a>
                {contact.email && (
                  <span className="flex items-center gap-1 truncate max-w-[160px] sm:max-w-none">
                    <Mail size={12} className="text-gray-400 flex-shrink-0" />
                    <span className="truncate">{contact.email}</span>
                  </span>
                )}
                <span className="flex items-center gap-1 text-xs">
                  <Clock size={11} className="text-gray-400" />
                  {new Date(contact.created_at).toLocaleDateString("vi-VN")}{" "}
                  {new Date(contact.created_at).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Actions - stacked on mobile, inline on desktop */}
          <div className="flex items-center gap-2 flex-shrink-0 ml-13 sm:ml-0">
            {contact.email && (
              <button
                onClick={() => onReply(contact)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
              >
                <Send size={12} />
                Trả lời
              </button>
            )}
            <button
              onClick={() => onDetail(contact)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors"
            >
              <ExternalLink size={12} />
              Chi tiết
            </button>
            <button
              onClick={() => onDelete(contact)}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Xóa"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Card Body: Message + Note */}
      {(contact.message || contact.admin_note) && (
        <div className="px-5 pb-4 pt-0">
          <div className="flex gap-3">
            {contact.message && (
              <div className="flex-1 flex items-start gap-2 px-3 py-2.5 bg-gray-50 rounded-lg min-w-0">
                <MessageSquare size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-700 whitespace-pre-wrap break-words line-clamp-3 min-w-0">
                  {contact.message}
                </div>
              </div>
            )}
            {contact.admin_note && (
              <div className="flex-1 flex items-start gap-2 px-3 py-2.5 bg-amber-50 rounded-lg border border-amber-100 min-w-0">
                <StickyNote size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-800 whitespace-pre-wrap break-words line-clamp-3 min-w-0">
                  {contact.admin_note}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
