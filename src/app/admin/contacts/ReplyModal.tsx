"use client";

import { X, Send } from "lucide-react";
import { Contact } from "./constants";

export function ReplyModal({
  target,
  subject,
  message,
  sending,
  onSubject,
  onMessage,
  onClose,
  onSend,
}: {
  target: Contact;
  subject: string;
  message: string;
  sending: boolean;
  onSubject: (subject: string) => void;
  onMessage: (message: string) => void;
  onClose: () => void;
  onSend: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
              <Send size={16} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Trả lời email</h2>
              <p className="text-xs text-gray-500">
                Gửi đến: {target.name} ({target.email})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Original message */}
        {target.message && (
          <div className="mx-6 mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-xs text-gray-500 mb-1 font-medium">Tin nhắn gốc:</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-4">
              {target.message}
            </p>
          </div>
        )}

        {/* Reply form */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Tiêu đề</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => onSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Nội dung</label>
            <textarea
              rows={6}
              value={message}
              onChange={(e) => onMessage(e.target.value)}
              placeholder={`Kính gửi ${target.name},\n\nCảm ơn Quý khách đã liên hệ đến Lixin VN.\n\n...`}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 text-sm font-medium hover:text-gray-800 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onSend}
            disabled={sending || !message.trim()}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Send size={15} />
            {sending ? "Đang gửi..." : "Gửi email"}
          </button>
        </div>
      </div>
    </div>
  );
}
