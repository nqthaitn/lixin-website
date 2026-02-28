import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  return (
    <footer className="bg-gray-950 text-gray-400 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Image
              src="/images/logo-lixin.png"
              alt="Lixin Vietnam"
              width={140}
              height={48}
              className="h-10 w-auto object-contain"
            />
            <p className="mt-4 text-sm">{t("company")}</p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t("quick_links")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-yellow-500 transition-colors">
                  {nav("about")}
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-yellow-500 transition-colors">
                  {nav("services")}
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-yellow-500 transition-colors">
                  {nav("news")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-yellow-500 transition-colors">
                  {nav("contact")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t("contact_info")}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin size={16} className="text-yellow-500 mt-0.5 shrink-0" />
                <span>{t("address")}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={16} className="text-yellow-500 shrink-0" />
                <a href="tel:0395536768" className="hover:text-yellow-500 transition-colors">
                  {t("phone")}
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={16} className="text-yellow-500 shrink-0" />
                <a
                  href="mailto:lixinvn.co.ltd@gmail.com"
                  className="hover:text-yellow-500 transition-colors"
                >
                  {t("email")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">{t("rights")}</div>
      </div>
    </footer>
  );
}
