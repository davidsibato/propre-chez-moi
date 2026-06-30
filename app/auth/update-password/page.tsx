"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n-context";

export default function UpdatePasswordPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputCls = "w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm bg-white dark:bg-slate-700";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) { setError(t("register_min_pwd")); return; }
    setLoading(true); setError("");
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setDone(true);
    setTimeout(() => router.push("/auth/connexion"), 3000);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="bg-emerald-600 text-white font-black text-base px-2 py-0.5 rounded-md tracking-wide">PCV</span>
            <span className="font-bold text-xl text-gray-900 dark:text-white">PropreChezVous</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-5">{t("update_pwd_title")}</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">{t("update_pwd_sub")}</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-8">
          {done ? (
            <div className="text-center space-y-4">
              <div className="text-4xl">✅</div>
              <p className="text-emerald-700 dark:text-emerald-400 font-semibold">{t("update_pwd_success")}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Redirection automatique...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1.5">{t("update_pwd_label")}</label>
                <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} placeholder="••••••••" />
                <p className="text-xs text-gray-400 mt-1">{t("register_min_pwd")}</p>
              </div>
              {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                {loading ? t("update_pwd_loading") : t("update_pwd_submit")}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
