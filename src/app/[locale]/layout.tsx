import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ZaloChat from "@/components/ZaloChat";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    vi: "Lixin Vietnam — Dịch vụ Kế toán & Tư vấn Thuế tại Tây Ninh",
    en: "Lixin Vietnam — Accounting & Tax Advisory in Tay Ninh",
    zh: "Lixin Vietnam — 西宁省会计与税务咨询服务",
  };

  const descriptions: Record<string, string> = {
    vi: "Công ty TNHH Dịch vụ và Tư vấn Lixin — Dịch vụ kế toán, tư vấn thuế, thành lập công ty, thành lập hộ kinh doanh, doanh nghiệp tại Tây Ninh, Việt Nam. Đội ngũ chuyên gia Việt-Trung.",
    en: "Lixin Vietnam — Professional accounting, tax advisory, company registration, and business setup services in Tay Ninh, Vietnam. Vietnamese-Chinese expert team.",
    zh: "Lixin Vietnam — 越南西宁省专业会计、税务咨询、公司注册及企业设立服务。越中专家团队。",
  };

  return {
    title: { default: titles[locale] || titles.vi, template: `%s | Lixin Vietnam` },
    description: descriptions[locale] || descriptions.vi,
    keywords:
      locale === "vi"
        ? [
            "dịch vụ kế toán",
            "tư vấn thuế",
            "Tây Ninh",
            "thành lập doanh nghiệp",
            "kế toán Tây Ninh",
            "thuế Tây Ninh",
            "Lixin Vietnam",
            "thành lập công ty tại Tây Ninh",
            "thành lập hộ kinh doanh tại Tây Ninh",
            "thành lập doanh nghiệp tại Tây Ninh",
            "đăng ký kinh doanh Tây Ninh",
            "dịch vụ kế toán tại Tây Ninh",
            "tư vấn thuế tại Tây Ninh",
            "khai báo hải quan Tây Ninh",
            "dịch vụ kế toán trọn gói",
            "báo cáo tài chính Tây Ninh",
            "công ty kế toán Tây Ninh",
          ]
        : locale === "en"
          ? [
              "accounting services",
              "tax advisory",
              "Tay Ninh",
              "business setup",
              "Vietnam",
              "Lixin Vietnam",
              "company registration in Tay Ninh",
              "business setup Tay Ninh",
              "enterprise establishment Tay Ninh",
              "accounting services in Tay Ninh",
              "tax consulting Tay Ninh",
              "customs declaration Tay Ninh",
              "full-service accounting",
              "financial reporting Tay Ninh",
              "accounting firm Tay Ninh",
            ]
          : [
              "会计服务",
              "税务咨询",
              "西宁省",
              "企业设立",
              "越南",
              "Lixin Vietnam",
              "西宁省公司注册",
              "西宁省企业设立",
              "西宁省营业执照",
              "西宁省会计服务",
              "西宁省税务咨询",
              "西宁省海关申报",
              "全套会计服务",
              "西宁省财务报告",
              "西宁省会计事务所",
            ],
    openGraph: {
      type: "website",
      locale: locale === "vi" ? "vi_VN" : locale === "en" ? "en_US" : "zh_CN",
      url: `https://lixinvn.com/${locale}`,
      siteName: "Lixin Vietnam",
      title: titles[locale] || titles.vi,
      description: descriptions[locale] || descriptions.vi,
    },
    alternates: {
      canonical: `https://lixinvn.com/${locale}`,
      languages: {
        vi: "https://lixinvn.com/vi",
        en: "https://lixinvn.com/en",
        zh: "https://lixinvn.com/zh",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "vi" | "en" | "zh")) notFound();
  const messages = await getMessages();

  return (
    <div
      lang={locale}
      className={`${inter.className} bg-white text-gray-900 antialiased scroll-smooth`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AccountingService",
            name: "Công ty TNHH Dịch vụ và Tư vấn Lixin (Việt Nam)",
            alternateName: "Lixin Vietnam",
            url: "https://lixinvn.com",
            telephone: "+84395536768",
            email: "lixinvn.co.ltd@gmail.com",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Số 2, Tổ 4, Ấp 4, xã Truông Mít",
              addressLocality: "Tây Ninh",
              addressRegion: "Tây Ninh",
              addressCountry: "VN",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: 11.3254,
              longitude: 106.0989,
            },
            areaServed: "Tây Ninh, Việt Nam",
            serviceType: [
              "Accounting",
              "Tax Advisory",
              "Business Registration",
              "Company Formation",
              "Individual Business Setup",
            ],
            foundingDate: "2019",
            knowsLanguage: ["vi", "en", "zh"],
          }),
        }}
      />
      <NextIntlClientProvider messages={messages}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <ZaloChat />
      </NextIntlClientProvider>
    </div>
  );
}
