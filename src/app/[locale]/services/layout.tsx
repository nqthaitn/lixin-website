import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    vi: "Dịch vụ Kế toán, Thuế, Thành lập Công ty tại Tây Ninh",
    en: "Accounting, Tax, Company Registration Services in Tay Ninh",
    zh: "西宁省会计、税务、公司注册服务",
  };

  const descriptions: Record<string, string> = {
    vi: "Khám phá 9 dịch vụ chuyên nghiệp của Lixin Vietnam: kế toán, tư vấn thuế, thành lập công ty, thành lập hộ kinh doanh, doanh nghiệp tại Tây Ninh. Giải pháp toàn diện cho doanh nghiệp.",
    en: "Explore 9 professional services by Lixin Vietnam: accounting, tax advisory, company registration, and business setup in Tay Ninh. Comprehensive solutions for businesses.",
    zh: "探索 Lixin Vietnam 的9项专业服务：西宁省的会计、税务咨询、公司注册及企业设立。为您提供全方位的企业解决方案。",
  };

  return {
    title: titles[locale] || titles.vi,
    description: descriptions[locale] || descriptions.vi,
  };
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
