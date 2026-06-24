export interface Contact {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  service_type: string;
  message: string | null;
  source: string;
  status: string;
  admin_note?: string | null;
  locale?: string;
  created_at: string;
}

export const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; dot: string }
> = {
  new: { label: "Mới", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  contacted: {
    label: "Đã liên hệ",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  converted: {
    label: "Thành công",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  rejected: { label: "Từ chối", bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};

export const SERVICE_LABELS: Record<string, string> = {
  general: "Chung",
  accounting: "Kế toán",
  other: "Khác",
};

export const LOCALE_CONFIG: Record<string, { flag: string; label: string }> = {
  vi: { flag: "🇻🇳", label: "Tiếng Việt" },
  en: { flag: "🇬🇧", label: "English" },
  zh: { flag: "🇨🇳", label: "中文" },
};

export const PAGE_SIZE = 20;
