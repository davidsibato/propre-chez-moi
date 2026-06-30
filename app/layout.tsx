import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { I18nProvider } from "@/lib/i18n-context";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PropreChezVous — Ménage à domicile en RDC et Congo",
  description:
    "Trouvez des professionnels du ménage vérifiés à Kinshasa, Lubumbashi, Brazzaville et Pointe-Noire. Réservez en ligne, payez par M-Pesa, Airtel Money ou Orange Money.",
  keywords: ["ménage", "nettoyage", "Kinshasa", "Lubumbashi", "Brazzaville", "Congo", "RDC", "prestataire", "domicile"],
  openGraph: {
    title: "PropreChezVous — Ménage à domicile en RDC et Congo",
    description: "La première plateforme congolaise de services ménagers à domicile.",
    locale: "fr_CD",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 antialiased">
        <I18nProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
