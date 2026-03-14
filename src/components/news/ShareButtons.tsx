"use client";

import { useState } from "react";
import { Facebook, Link2, Share2, Check } from "lucide-react";

interface ShareButtonsProps {
  url: string;
  title: string;
  translations: {
    share: string;
    copy_link: string;
    copied: string;
  };
}

export default function ShareButtons({ url, title, translations }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const handleFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const handleZalo = () => {
    window.open(
      `https://zalo.me/share?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      "_blank"
    );
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500 mr-1 flex items-center gap-1">
        <Share2 size={14} />
        {translations.share}:
      </span>
      <button
        onClick={handleFacebook}
        className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"
        aria-label="Share on Facebook"
      >
        <Facebook size={16} />
      </button>
      <button
        onClick={handleZalo}
        className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors font-bold text-xs"
        aria-label="Share on Zalo"
      >
        Z
      </button>
      <button
        onClick={handleCopy}
        className={`h-9 px-3 rounded-full text-sm flex items-center gap-1.5 transition-all ${
          copied ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
        aria-label={translations.copy_link}
      >
        {copied ? <Check size={14} /> : <Link2 size={14} />}
        {copied ? translations.copied : translations.copy_link}
      </button>
    </div>
  );
}
