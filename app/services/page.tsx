"use client";
import Link from "next/link";
import { services } from "@/lib/data";
import { ChevronRight } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";

export default function ServicesPage() {
  const { t, lang } = useI18n();
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{t("home_services_title")}</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">{t("services_page_desc")}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s) => (
          <div key={s.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
            <div className="text-4xl mb-4">{s.icone}</div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg">{s.labels[lang]}</h2>
              {s.populaire && (
                <span className="text-xs bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">{t("popular")}</span>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{s.descriptions[lang]}</p>
            <div className="text-xs text-gray-400 dark:text-gray-500 mb-4">{t("services_min_duration")} {s.dureeMin}h</div>
            <Link
              href={`/prestataires?service=${encodeURIComponent(s.nom)}`}
              className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-sm hover:gap-2 transition-all"
            >
              {t("find_provider")} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
