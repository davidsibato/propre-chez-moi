"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Lang, translations, TranslationKey } from "./translations";

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nCtx>({
  lang: "fr",
  setLang: () => {},
  t: (k) => translations.fr[k],
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const saved = localStorage.getItem("pcv_lang") as Lang | null;
    if (saved && translations[saved]) setLangState(saved);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("pcv_lang", l);
  }

  function t(key: TranslationKey): string {
    return (translations[lang] as Record<string, string>)[key] ?? translations.fr[key];
  }

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
