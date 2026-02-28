import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    vi: "Giới thiệu Lixin Vietnam — Đội ngũ chuyên gia Việt-Trung tại Tây Ninh",
    en: "About Lixin Vietnam — Vietnamese-Chinese expert team in Tay Ninh",
    zh: "关于 Lixin Vietnam — 西宁省越中专家团队",
  };

  const descriptions: Record<string, string> = {
    vi: "Đội ngũ chuyên gia Việt-Trung giàu kinh nghiệm tại Lixin Vietnam. Cam kết cung cấp dịch vụ kế toán, thuế và thành lập doanh nghiệp uy tín hàng đầu tại Tây Ninh.",
    en: "Experienced Vietnamese-Chinese expert team at Lixin Vietnam. Committed to providing top-tier accounting, tax, and business setup services in Tay Ninh.",
    zh: "Lixin Vietnam 经验丰富的越中专家团队。致力于在西宁省提供顶尖的会计、税务及企业设立服务。",
  };

  return {
    title: titles[locale] || titles.vi,
    description: descriptions[locale] || descriptions.vi,
  };
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
