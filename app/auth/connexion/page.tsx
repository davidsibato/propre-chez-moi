"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { setCurrentUser } from "@/lib/store";
import { useI18n } from "@/lib/i18n-context";
import { User } from "@/lib/types";

export default function ConnexionPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError || !data.user) { setError(t("login_error")); setLoading(false); return; }
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
    if (!profile) { setError(t("login_profile_error")); setLoading(false); return; }
    const user: User = { id: profile.id, nom: profile.nom, prenom: profile.prenom, email: data.user.email!, telephone: profile.telephone || "", role: profile.role, ville: profile.ville || "", quartier: profile.quartier || "", createdAt: profile.created_at };
    setCurrentUser(user);
    if (user.role === "admin") router.push("/admin");
    else if (user.role === "prestataire") router.push("/tableau-de-bord/prestataire");
    else router.push("/tableau-de-bord/client");
  }

  const inputCls = "w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm bg-white dark:bg-slate-700";

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="bg-emerald-600 text-white font-black text-base px-2 py-0.5 rounded-md tracking-wide">PCV</span>
            <span className="font-bold text-xl text-gray-900 dark:text-white">PropreChezVous</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-5">{t("login_title")}</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">{t("login_welcome")}</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1.5">{t("login_email")}</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="vous@email.com" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100">{t("login_password")}</label>
                <Link href="/auth/reset-password" className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline">{t("login_forgot")}</Link>
              </div>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} placeholder="••••••••" />
            </div>
            {error && <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
              {loading ? t("login_loading") : t("login_submit")}
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-6">
            {t("login_no_account")}{" "}
            <Link href="/auth/inscription" className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline">{t("login_signup")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
