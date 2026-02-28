import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    vi: "Tin tức Kế toán, Thuế, Tài chính — Lixin Vietnam",
    en: "Accounting, Tax, Finance News — Lixin Vietnam",
    zh: "会计、税务、财务新闻 — Lixin Vietnam",
  };

  const descriptions: Record<string, string> = {
    vi: "Cập nhật tin tức mới nhất về kế toán, thuế, luật doanh nghiệp, thành lập công ty và hộ kinh doanh tại Tây Ninh và Việt Nam từ chuyên gia Lixin Vietnam.",
    en: "Stay updated with the latest news on accounting, tax, corporate law, company registration, and business setup in Tay Ninh and Vietnam from Lixin Vietnam experts.",
    zh: "从 Lixin Vietnam 专家了解西宁省及越南的会计、税务、公司法、公司注册及企业设立最新资讯。",
  };

  return {
    title: titles[locale] || titles.vi,
    description: descriptions[locale] || descriptions.vi,
  };
}

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
