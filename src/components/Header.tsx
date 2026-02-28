"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import Image from "next/image";

const locales = [
  { code: "vi" as const, label: "🇻🇳 Tiếng Việt" },
  { code: "en" as const, label: "🇬🇧 English" },
  { code: "zh" as const, label: "🇨🇳 中文" },
];

export default function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const navLinks = [
    { href: "/" as const, label: t("home") },
    { href: "/about" as const, label: t("about") },
    { href: "/services" as const, label: t("services") },
    { href: "/news" as const, label: t("news") },
    { href: "/contact" as const, label: t("contact") },
  ];

  const switchLocale = (locale: "vi" | "en" | "zh") => {
    router.replace(pathname, { locale });
    setLangOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-yellow-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo-lixin.png"
              alt="Lixin Vietnam"
              width={140}
              height={48}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-yellow-500 ${
                  pathname === link.href ? "text-yellow-500" : "text-gray-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center space-x-1 text-gray-300 hover:text-yellow-500 transition-colors"
              >
                <Globe size={18} />
                <ChevronDown size={14} />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-hidden">
                  {locales.map((loc) => (
                    <button
                      key={loc.code}
                      onClick={() => switchLocale(loc.code)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-yellow-500/10 hover:text-yellow-500 transition-colors"
                    >
                      {loc.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/contact"
              className="hidden md:inline-flex bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-400 transition-colors"
            >
              {t("booking")}
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-gray-300 hover:text-yellow-500"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block py-3 text-base font-medium transition-colors ${
                  pathname === link.href ? "text-yellow-500" : "text-gray-300 hover:text-yellow-500"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="block mt-4 bg-yellow-500 text-black text-center py-3 rounded-lg font-semibold"
            >
              {t("booking")}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
