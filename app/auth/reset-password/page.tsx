"use client";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n-context";

export default function ResetPasswordPage() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputCls = "w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm bg-white dark:bg-slate-700";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setSent(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="bg-emerald-600 text-white font-black text-base px-2 py-0.5 rounded-md tracking-wide">PCV</span>
            <span className="font-bold text-xl text-gray-900 dark:text-white">PropreChezVous</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-5">{t("reset_title")}</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">{t("reset_sub")}</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-8">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="text-4xl">📧</div>
              <p className="text-emerald-700 dark:text-emerald-400 font-semibold">{t("reset_success")}</p>
              <Link href="/auth/connexion" className="block text-sm text-gray-600 dark:text-gray-300 hover:underline mt-4">{t("reset_back")}</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1.5">{t("reset_email")}</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="vous@email.com" />
              </div>
              {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                {loading ? t("reset_loading") : t("reset_submit")}
              </button>
              <p className="text-center text-sm">
                <Link href="/auth/connexion" className="text-emerald-700 dark:text-emerald-400 hover:underline">{t("reset_back")}</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
