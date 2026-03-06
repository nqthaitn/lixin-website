import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    vi: "Liên hệ Lixin Vietnam — Đặt lịch tư vấn kế toán thuế tại Tây Ninh",
    en: "Contact Lixin Vietnam — Book accounting & tax advisory in Tay Ninh",
    zh: "联系 Lixin Vietnam — 预约西宁省会计与税务咨询",
  };

  const descriptions: Record<string, string> = {
    vi: "Liên hệ Lixin Vietnam ngay để được tư vấn miễn phí về kế toán, thuế, thành lập công ty, hộ kinh doanh tại Tây Ninh. Hotline: 0395536768.",
    en: "Contact Lixin Vietnam for free consultation on accounting, tax, company registration, and business setup in Tay Ninh. Hotline: 0395536768.",
    zh: "立即联系 Lixin Vietnam，免费咨询西宁省的会计、税务、公司注册及企业设立事宜。热线电话：0395536768。",
  };

  return {
    title: titles[locale] || titles.vi,
    description: descriptions[locale] || descriptions.vi,
    openGraph: {
      type: "website",
      locale: locale === "vi" ? "vi_VN" : locale === "en" ? "en_US" : "zh_CN",
      url: `https://lixinvn.com/${locale}/contact`,
      siteName: "Lixin Vietnam",
      title: titles[locale] || titles.vi,
      description: descriptions[locale] || descriptions.vi,
    },
    alternates: {
      canonical: `https://lixinvn.com/${locale}/contact`,
      languages: {
        vi: "https://lixinvn.com/vi/contact",
        en: "https://lixinvn.com/en/contact",
        zh: "https://lixinvn.com/zh/contact",
        "x-default": "https://lixinvn.com/vi/contact",
      },
    },
  };
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
