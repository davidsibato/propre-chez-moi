"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { setCurrentUser } from "@/lib/store";
import { useI18n } from "@/lib/i18n-context";
import { User } from "@/lib/types";
import { villes, quartiersBrazzaville, quartiersKinshasa, quartiersPointeNoire, quartiersLubumbashi } from "@/lib/data";
import { UserCheck } from "lucide-react";

function InscriptionForm() {
  const router = useRouter();
  const { t } = useI18n();
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [ville, setVille] = useState("Brazzaville");
  const [quartier, setQuartier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const quartiers =
    ville === "Brazzaville" ? quartiersBrazzaville
    : ville === "Kinshasa" ? quartiersKinshasa
    : ville === "Lubumbashi" ? quartiersLubumbashi
    : quartiersPointeNoire;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError("");
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError || !authData.user) { setError(authError?.message || t("register_error_generic")); setLoading(false); return; }
    const { error: profileError } = await supabase.from("profiles").insert({ id: authData.user.id, nom, prenom, telephone, role: "client", ville, quartier });
    if (profileError) { setError(profileError.message); setLoading(false); return; }
    const user: User = { id: authData.user.id, nom, prenom, email, telephone, role: "client", ville, quartier, createdAt: new Date().toISOString().split("T")[0] };
    setCurrentUser(user);
    router.push("/tableau-de-bord/client");
  }

  const inputCls = "w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white text-sm bg-white dark:bg-slate-700";
  const selectCls = inputCls;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="bg-emerald-600 text-white font-black text-base px-2 py-0.5 rounded-md tracking-wide">PCV</span>
            <span className="font-bold text-xl text-gray-900 dark:text-white">PropreChezVous</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-5">{t("register_title")}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t("register_sub")}</p>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4 mb-6 flex items-start gap-3">
          <UserCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-emerald-800 dark:text-emerald-200">
            <span className="font-semibold">{t("register_provider_info")}</span>{" "}
            {t("register_provider_detail")}{" "}
            <Link href="/postuler" className="underline font-medium">{t("register_provider_apply")}</Link>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1.5">{t("register_first_name")}</label>
                <input required value={prenom} onChange={(e) => setPrenom(e.target.value)} className={inputCls} placeholder={t("register_first_name")} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1.5">{t("register_last_name")}</label>
                <input required value={nom} onChange={(e) => setNom(e.target.value)} className={inputCls} placeholder={t("register_last_name")} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1.5">{t("login_email")}</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="vous@email.com" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1.5">{t("register_phone")}</label>
              <input type="tel" required value={telephone} onChange={(e) => setTelephone(e.target.value)} className={inputCls} placeholder="+242 06 ..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1.5">{t("register_city")}</label>
                <select value={ville} onChange={(e) => { setVille(e.target.value); setQuartier(""); }} className={selectCls}>
                  {villes.map((v) => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1.5">{t("register_neighborhood")}</label>
                <select value={quartier} onChange={(e) => setQuartier(e.target.value)} className={selectCls}>
                  <option value="">{t("register_choose")}</option>
                  {quartiers.map((q) => <option key={q}>{q}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1.5">{t("register_password")}</label>
              <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} placeholder={t("register_min_pwd")} />
            </div>
            {error && <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors text-sm mt-2">
              {loading ? t("register_loading") : t("register_submit")}
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-6">
            {t("register_has_account")}{" "}
            <Link href="/auth/connexion" className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline">{t("register_login")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function InscriptionPage() {
  return <Suspense><InscriptionForm /></Suspense>;
}
