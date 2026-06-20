"use client";
import { useI18n } from "@/lib/i18n-context";
import { Lang } from "@/lib/translations";
import { Globe } from "lucide-react";
import { useState } from "react";

const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English",  flag: "🇬🇧" },
  { code: "es", label: "Español",  flag: "🇪🇸" },
];

export default function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const current = LANGS.find((l) => l.code === lang)!;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
      >
        <Globe className="w-4 h-4" />
        <span>{current.flag}</span>
        <span className="hidden sm:inline">{current.label}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 py-1 z-50">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setOpen(false); }}
                className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm transition-colors
                  ${lang === l.code
                    ? "bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-semibold"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700"}`}
              >
                <span>{l.flag}</span>
                <span>{l.label}</span>
                {lang === l.code && <span className="ml-auto text-emerald-600 dark:text-emerald-400">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
