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

export const metadata: Metadata = {
  title: "Lixin Vietnam — Kế toán & Tư vấn thuế",
  description:
    "Công ty TNHH Dịch vụ và Tư vấn Lixin — Dịch vụ kế toán, tư vấn thuế, thành lập doanh nghiệp tại Việt Nam",
};

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
    <html lang={locale} className="scroll-smooth">
      <body className={`${inter.className} bg-white text-gray-900 antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <ZaloChat />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
