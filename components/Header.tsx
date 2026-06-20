"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { User } from "@/lib/types";
import { getCurrentUser, setCurrentUser } from "@/lib/store";
import { useI18n } from "@/lib/i18n-context";
import LanguageSwitcher from "./LanguageSwitcher";
import { Menu, X, ChevronDown, LogOut, LayoutDashboard } from "lucide-react";

function PcvLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="bg-emerald-600 text-white font-black text-base px-2 py-0.5 rounded-md tracking-wide">PCV</span>
      <span className="font-bold text-lg text-gray-900 dark:text-white">PropreChezVous</span>
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => { setUser(getCurrentUser()); }, [pathname]);

  function logout() {
    setCurrentUser(null);
    setUser(null);
    router.push("/");
  }

  const dashboardPath =
    user?.role === "admin" ? "/admin"
    : user?.role === "prestataire" ? "/tableau-de-bord/prestataire"
    : "/tableau-de-bord/client";

  const navLink = (href: string, label: string) => (
    <Link href={href}
      className={`text-sm font-medium transition-colors ${
        pathname.startsWith(href)
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400"
      }`}>
      {label}
    </Link>
  );

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <PcvLogo />

          <nav className="hidden md:flex items-center gap-7">
            {navLink("/services", t("nav_services"))}
            {navLink("/prestataires", t("nav_prestataires"))}
            {navLink("/comment-ca-marche", t("nav_how"))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher />

            {user ? (
              <div className="relative ml-1">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    {user.prenom[0]}{user.nom[0]}
                  </div>
                  <span>{user.prenom}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 py-1 z-50">
                    <Link href={dashboardPath}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-700"
                      onClick={() => setUserMenuOpen(false)}>
                      <LayoutDashboard className="w-4 h-4" /> {t("nav_dashboard")}
                    </Link>
                    <button onClick={logout}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left">
                      <LogOut className="w-4 h-4" /> {t("nav_logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/connexion"
                  className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors ml-1">
                  {t("nav_login")}
                </Link>
                <Link href="/auth/inscription"
                  className="bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                  {t("nav_register")}
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2 text-gray-700 dark:text-gray-200" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 px-4 py-4 space-y-3">
          <Link href="/services" className="block text-sm font-medium text-gray-800 dark:text-gray-100" onClick={() => setMenuOpen(false)}>{t("nav_services")}</Link>
          <Link href="/prestataires" className="block text-sm font-medium text-gray-800 dark:text-gray-100" onClick={() => setMenuOpen(false)}>{t("nav_prestataires")}</Link>
          <Link href="/comment-ca-marche" className="block text-sm font-medium text-gray-800 dark:text-gray-100" onClick={() => setMenuOpen(false)}>{t("nav_how")}</Link>
          <div className="pt-1"><LanguageSwitcher /></div>
          <hr className="border-gray-200 dark:border-slate-700" />
          {user ? (
            <>
              <Link href={dashboardPath} className="block text-sm font-semibold text-emerald-700 dark:text-emerald-400" onClick={() => setMenuOpen(false)}>{t("nav_dashboard")}</Link>
              <button onClick={logout} className="block text-sm font-medium text-red-600">{t("nav_logout")}</button>
            </>
          ) : (
            <>
              <Link href="/auth/connexion" className="block text-sm font-medium text-gray-800 dark:text-gray-100" onClick={() => setMenuOpen(false)}>{t("nav_login")}</Link>
              <Link href="/auth/inscription" className="block bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-lg text-center" onClick={() => setMenuOpen(false)}>{t("nav_register")}</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
