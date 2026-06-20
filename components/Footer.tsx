"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";
import { services } from "@/lib/data";

export default function Footer() {
  const { t, lang } = useI18n();

  const helpLinks = {
    fr: [
      { label: "Comment ça marche", href: "/comment-ca-marche" },
      { label: "Devenir prestataire", href: "/postuler" },
      { label: "FAQ", href: "/faq" },
    ],
    en: [
      { label: "How it works", href: "/comment-ca-marche" },
      { label: "Become a cleaner", href: "/postuler" },
      { label: "FAQ", href: "/faq" },
    ],
    es: [
      { label: "Cómo funciona", href: "/comment-ca-marche" },
      { label: "Convertirse en limpiador", href: "/postuler" },
      { label: "FAQ", href: "/faq" },
    ],
  }[lang];

  const contactNote = {
    fr: "Pour questions générales uniquement",
    en: "For general queries only",
    es: "Solo para consultas generales",
  }[lang];

  const copyright = {
    fr: `© 2026 PropreChezVous · David Sibato. ${t("footer_rights")}`,
    en: `© 2026 PropreChezVous · David Sibato. ${t("footer_rights")}`,
    es: `© 2026 PropreChezVous · David Sibato. ${t("footer_rights")}`,
  }[lang];

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="bg-emerald-500 text-white font-black text-base px-2 py-0.5 rounded-md tracking-wide">PCV</span>
              <span className="font-bold text-xl text-white">PropreChezVous</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">{t("footer_tagline")}</p>
            <div className="flex gap-3 mt-4">
              <span className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded-full">🇨🇬 Congo-Brazzaville</span>
              <span className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded-full">🇨🇩 RDC</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t("home_services_title")}</h4>
            <ul className="space-y-2 text-sm">
              {services.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/prestataires?service=${encodeURIComponent(s.nom)}`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {s.labels[lang]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              {lang === "fr" ? "Aide" : lang === "en" ? "Help" : "Ayuda"}
            </h4>
            <ul className="space-y-2 text-sm">
              {helpLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-400 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
              <li><a href="tel:+242064000000" className="text-gray-400 hover:text-white transition-colors">+242 06 400 0000</a></li>
              <li>
                <a href="mailto:contact@proprechezvous.cg" className="text-gray-400 hover:text-white transition-colors">
                  contact@proprechezvous.cg
                </a>
              </li>
              <li className="text-xs text-gray-500 italic">{contactNote}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">{copyright}</p>
          <div className="flex gap-4 text-xs text-gray-500">
            <Link href="/confidentialite" className="hover:text-gray-300 transition-colors">{t("footer_privacy")}</Link>
            <Link href="/conditions" className="hover:text-gray-300 transition-colors">{t("footer_terms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
