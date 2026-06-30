import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-7xl font-black text-emerald-600 mb-4">404</p>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Page introuvable</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Cette page n&apos;existe pas ou a été déplacée.</p>
        <Link href="/" className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
