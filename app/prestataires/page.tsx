"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { prestataires, services, villes } from "@/lib/data";
import { formatAmount } from "@/lib/currency";
import { distanceKm, QUARTIER_COORDS } from "@/lib/geo";
import { useI18n } from "@/lib/i18n-context";
import { Star, Shield, SlidersHorizontal, X, MapPin, Loader2 } from "lucide-react";

function PrestatairesContent() {
  const searchParams = useSearchParams();
  const { t, lang } = useI18n();
  const [villeFilter, setVilleFilter] = useState(searchParams.get("ville") || "");
  const [serviceFilter, setServiceFilter] = useState(searchParams.get("service") || "");
  const [dispoOnly, setDispoOnly] = useState(false);
  const [certifieOnly, setCertifieOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [nearbyMode, setNearbyMode] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const NEAR_KM = 1;

  function handleNearMe() {
    if (nearbyMode) { setNearbyMode(false); setUserCoords(null); setLocationError(""); return; }
    setLocating(true); setLocationError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => { setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setNearbyMode(true); setLocating(false); },
      () => { setLocationError(t("location_denied")); setLocating(false); },
      { timeout: 8000 }
    );
  }

  function distanceToPrestataire(p: typeof prestataires[0]): number | null {
    if (!userCoords) return null;
    const c = p.quartier ? QUARTIER_COORDS[p.quartier] : undefined;
    if (!c) return null;
    return distanceKm(userCoords, c);
  }

  const filtered = prestataires.filter((p) => {
    if (villeFilter && p.ville !== villeFilter) return false;
    if (serviceFilter && !p.services.some((s) => s.toLowerCase().includes(serviceFilter.toLowerCase()))) return false;
    if (dispoOnly && !p.disponible) return false;
    if (certifieOnly && !p.certifie) return false;
    if (nearbyMode) { const d = distanceToPrestataire(p); if (d === null || d > NEAR_KM) return false; }
    return true;
  });

  const sorted = nearbyMode
    ? [...filtered].sort((a, b) => (distanceToPrestataire(a) ?? 99) - (distanceToPrestataire(b) ?? 99)).slice(0, 6)
    : filtered;

  const inputCls = "px-4 py-2 border border-gray-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-100";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {nearbyMode ? t("nearby_title") : t("nav_prestataires")}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        {sorted.length} prestataire{sorted.length !== 1 ? "s" : ""} trouvé{sorted.length !== 1 ? "s" : ""}
      </p>

      {/* Filter bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
          <select value={villeFilter} onChange={(e) => setVilleFilter(e.target.value)} className={inputCls}>
            <option value="">{t("all_cities")}</option>
            {villes.map((v) => <option key={v}>{v}</option>)}
          </select>
          <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} className={inputCls}>
            <option value="">{t("hero_all_services")}</option>
            {services.map((s) => <option key={s.id} value={s.nom}>{s.labels[lang]}</option>)}
          </select>
          <button onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-600 dark:text-gray-300 hover:border-emerald-300 bg-white dark:bg-slate-700">
            <SlidersHorizontal className="w-4 h-4" /> {t("filters")}
          </button>
          <button onClick={handleNearMe} disabled={locating}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              nearbyMode
                ? "bg-emerald-600 text-white border-emerald-600"
                : "border-emerald-300 dark:border-emerald-600 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 bg-white dark:bg-slate-700"
            }`}>
            {locating ? <><Loader2 className="w-4 h-4 animate-spin" /> {t("locating")}</> : <><MapPin className="w-4 h-4" /> {t("near_me")}</>}
          </button>
          {(villeFilter || serviceFilter || dispoOnly || certifieOnly || nearbyMode) && (
            <button onClick={() => { setVilleFilter(""); setServiceFilter(""); setDispoOnly(false); setCertifieOnly(false); setNearbyMode(false); setUserCoords(null); setLocationError(""); }}
              className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700">
              <X className="w-4 h-4" /> {t("reset")}
            </button>
          )}
        </div>
        {showFilters && (
          <div className="flex gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-slate-700">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200 cursor-pointer">
              <input type="checkbox" checked={dispoOnly} onChange={(e) => setDispoOnly(e.target.checked)} className="rounded text-emerald-600" />
              {t("available_only")}
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200 cursor-pointer">
              <input type="checkbox" checked={certifieOnly} onChange={(e) => setCertifieOnly(e.target.checked)} className="rounded text-emerald-600" />
              {t("certified_only")}
            </label>
          </div>
        )}
        {locationError && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{locationError}</p>}
      </div>

      {/* Results */}
      {sorted.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-4">🔍</div>
          <p className="font-medium">{nearbyMode ? t("nearby_none") : t("no_results")}</p>
          {!nearbyMode && <p className="text-sm mt-1">{t("no_results_desc")}</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((p) => {
            const dist = distanceToPrestataire(p);
            return (
              <Link key={p.id} href={`/prestataires/${p.id}`}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md border border-gray-100 dark:border-slate-700 transition-all group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xl font-bold">
                      {p.prenom[0]}{p.nom[0]}
                    </div>
                    <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 ${p.disponible ? "bg-green-400" : "bg-gray-300"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">{p.prenom} {p.nom}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      {dist !== null && <span className="text-emerald-600 dark:text-emerald-400 font-medium">{dist < 0.1 ? "< 100m" : `${dist.toFixed(1)} km`} ·</span>}
                      {p.quartier}, {p.ville}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{p.note}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">({p.nombreAvis})</span>
                    </div>
                  </div>
                  {p.certifie && (
                    <span className="flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/40 px-2 py-1 rounded-full flex-shrink-0">
                      <Shield className="w-3 h-3" /> {t("certified")}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">{p.bio}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {p.services.map((s) => (
                    <span key={s} className="text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">{s}</span>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-slate-700">
                  <div>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 text-lg">{formatAmount(p.tarifHoraire, p.ville)}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">/h</span>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${p.disponible ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300" : "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400"}`}>
                    {p.disponible ? t("available") : t("unavailable")}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function PrestatairesPage() {
  return <Suspense><PrestatairesContent /></Suspense>;
}
