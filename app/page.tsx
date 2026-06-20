"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Shield, Clock, Smartphone, ChevronRight, CheckCircle } from "lucide-react";
import { services, prestataires, villes } from "@/lib/data";
import { formatAmount } from "@/lib/currency";
import { useI18n } from "@/lib/i18n-context";

export default function HomePage() {
  const router = useRouter();
  const { t, lang } = useI18n();
  const [ville, setVille] = useState("Brazzaville");
  const [service, setService] = useState("");

  function handleSearch() {
    const params = new URLSearchParams();
    if (ville) params.set("ville", ville);
    if (service) params.set("service", service);
    router.push(`/prestataires?${params.toString()}`);
  }

  const topPrestataires = prestataires.filter((p) => p.disponible).slice(0, 3);

  const stats = [
    { value: "500+",    label: t("stats_providers") },
    { value: "2 500+", label: t("stats_bookings") },
    { value: "4.8/5",  label: t("stats_rating") },
    { value: "3",      label: t("stats_cities") },
  ];

  const howSteps = [
    { icon: "🔍", step: "1", title: t("home_how_step1_title"), desc: t("home_how_step1_desc") },
    { icon: "📅", step: "2", title: t("home_how_step2_title"), desc: t("home_how_step2_desc") },
    { icon: "💚", step: "3", title: t("home_how_step3_title"), desc: t("home_how_step3_desc") },
    { icon: "✨", step: "4", title: t("home_how_step4_title"), desc: t("home_how_step4_desc") },
  ];

  const whyItems = [
    { icon: <Shield className="w-8 h-8" />, title: t("home_why1_title"), desc: t("home_why1_desc") },
    { icon: <Smartphone className="w-8 h-8" />, title: t("home_why2_title"), desc: t("home_why2_desc") },
    { icon: <Clock className="w-8 h-8" />, title: t("home_why3_title"), desc: t("home_why3_desc") },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
              {t("hero_title")}<br />
              <span className="text-emerald-200">{t("hero_title2")}</span>
            </h1>
            <p className="text-emerald-100 text-lg mb-8">{t("hero_desc")}</p>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-2 flex flex-col sm:flex-row gap-2">
              <select
                value={ville}
                onChange={(e) => setVille(e.target.value)}
                className="flex-1 px-4 py-3 text-gray-800 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-gray-50 dark:bg-slate-700"
              >
                {villes.map((v) => <option key={v}>{v}</option>)}
              </select>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="flex-1 px-4 py-3 text-gray-800 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-gray-50 dark:bg-slate-700"
              >
                <option value="">{t("hero_all_services")}</option>
                {services.map((s) => (
                  <option key={s.id} value={s.nom}>{s.labels[lang]}</option>
                ))}
              </select>
              <button
                onClick={handleSearch}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors whitespace-nowrap"
              >
                {t("hero_search")}
              </button>
            </div>

            <div className="flex flex-wrap gap-4 mt-6 text-sm text-emerald-100">
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> {t("hero_verified")}</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> {t("hero_secure")}</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> {t("hero_guaranteed")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{s.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t("home_services_title")}</h2>
          <Link href="/services" className="text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
            {t("view_all")} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {services.map((s) => (
            <Link
              key={s.id}
              href={`/prestataires?service=${encodeURIComponent(s.nom)}`}
              className="group bg-white dark:bg-slate-800 rounded-2xl p-5 text-center shadow-sm hover:shadow-md border border-gray-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-600 transition-all"
            >
              <div className="text-3xl mb-3">{s.icone}</div>
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                {s.labels[lang]}
              </div>
              {s.populaire && (
                <span className="text-xs bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full mt-2 inline-block">
                  {t("popular")}
                </span>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Top prestataires */}
      <section className="bg-gray-50 dark:bg-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t("home_top_title")}</h2>
            <Link href="/prestataires" className="text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
              {t("view_all")} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {topPrestataires.map((p) => (
              <Link
                key={p.id}
                href={`/prestataires/${p.id}`}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md border border-gray-100 dark:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xl font-bold">
                    {p.prenom[0]}{p.nom[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{p.prenom} {p.nom}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{p.quartier}, {p.ville}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className={`w-4 h-4 ${i <= Math.round(p.note) ? "fill-yellow-400 text-yellow-400" : "text-gray-200 dark:text-gray-600 fill-gray-200 dark:fill-gray-600"}`} />
                  ))}
                  <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">{p.note} ({p.nombreAvis} {t("reviews")})</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {p.services.slice(0, 2).map((s) => (
                    <span key={s} className="text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">{s}</span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">{formatAmount(p.tarifHoraire, p.ville)}<span className="text-sm font-normal text-gray-500 dark:text-gray-400">/h</span></span>
                  {p.certifie && (
                    <span className="flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/40 px-2 py-1 rounded-full">
                      <Shield className="w-3 h-3" /> {t("certified")}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-12">{t("how_title")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
          {howSteps.map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                {item.icon}
              </div>
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">STEP {item.step}</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why us */}
      <section className="bg-emerald-700 dark:bg-emerald-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-12">{t("home_why_title")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {whyItems.map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="text-emerald-300 flex-shrink-0">{item.icon}</div>
                <div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-emerald-100 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t("home_cta_title")}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">{t("home_cta_desc")}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/prestataires" className="bg-emerald-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-emerald-700 transition-colors">
            {t("find_provider")}
          </Link>
          <Link href="/postuler" className="border-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400 font-semibold px-8 py-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors">
            {t("become_provider")}
          </Link>
        </div>
      </section>
    </div>
  );
}
