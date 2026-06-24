"use client";

import { X, CheckCircle, AlertCircle } from "lucide-react";

export type ToastState = { type: "success" | "error"; message: string };

export function Toast({ toast, onClose }: { toast: ToastState; onClose: () => void }) {
  return (
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
        <button onClick={onClose} className="ml-2 text-gray-400 hover:text-gray-600">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
