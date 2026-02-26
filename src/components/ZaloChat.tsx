"use client";

import { MessageCircle } from "lucide-react";

export default function ZaloChat() {
  return (
    <a
      href="https://zalo.me/0395536768"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-blue-500 hover:bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all group"
      aria-label="Chat Zalo"
    >
      <MessageCircle size={28} />
      <span className="absolute right-full mr-3 bg-white text-gray-800 text-sm px-3 py-1.5 rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
        Chat Zalo
      </span>
    </a>
  );
}
