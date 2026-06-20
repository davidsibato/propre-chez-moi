"use client";
import Link from "next/link";
import { CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";

const STEP_NUM = { fr: "ÉTAPE", en: "STEP", es: "PASO" };

export default function CommentCaMarchePage() {
  const { lang, t } = useI18n();
  const step = STEP_NUM[lang];

  const clientSteps = {
    fr: [
      { title: "Choisissez votre service", desc: "Parcourez nos services : nettoyage, repassage, cuisine, vitres et plus encore. Filtrez par ville et disponibilité.", icon: "🔍" },
      { title: "Sélectionnez un prestataire", desc: "Consultez les profils, les avis clients et les tarifs horaires. Tous nos prestataires sont sélectionnés et vérifiés par l'équipe PCV.", icon: "👤" },
      { title: "Réservez en ligne", desc: "Choisissez la date, l'heure et la durée de l'intervention. Indiquez votre adresse et vos instructions particulières.", icon: "📅" },
      { title: "Payez en toute sécurité", desc: "Réglez via Airtel Money, Orange Money, carte bancaire ou PayPal. Paiement sécurisé, aucun espèce accepté.", icon: "💳" },
      { title: "Votre prestataire arrive", desc: "Votre prestataire arrive à l'heure convenue, équipé et professionnel, pour effectuer le travail à la perfection.", icon: "✨" },
    ],
    en: [
      { title: "Choose your service", desc: "Browse our services: cleaning, ironing, cooking, windows and more. Filter by city and availability.", icon: "🔍" },
      { title: "Select a cleaner", desc: "View profiles, client reviews and hourly rates. All our cleaners are handpicked and vetted by the PCV team.", icon: "👤" },
      { title: "Book online", desc: "Choose the date, time, and duration. Provide your address and any special instructions.", icon: "📅" },
      { title: "Pay securely", desc: "Pay via Airtel Money, Orange Money, credit card or PayPal. Secure payment — no cash accepted.", icon: "💳" },
      { title: "Your cleaner arrives", desc: "Your cleaner arrives on time, equipped and professional, ready to do a great job.", icon: "✨" },
    ],
    es: [
      { title: "Elige tu servicio", desc: "Explora nuestros servicios: limpieza, planchado, cocina, ventanas y más. Filtra por ciudad y disponibilidad.", icon: "🔍" },
      { title: "Selecciona un limpiador", desc: "Consulta perfiles, reseñas de clientes y tarifas horarias. Todos nuestros limpiadores son seleccionados y verificados por el equipo PCV.", icon: "👤" },
      { title: "Reserva en línea", desc: "Elige la fecha, hora y duración. Indica tu dirección e instrucciones especiales.", icon: "📅" },
      { title: "Paga de forma segura", desc: "Paga con Airtel Money, Orange Money, tarjeta bancaria o PayPal. Pago seguro — no se acepta efectivo.", icon: "💳" },
      { title: "Tu limpiador llega", desc: "Tu limpiador llega puntual, equipado y profesional, listo para hacer un excelente trabajo.", icon: "✨" },
    ],
  }[lang];

  const proSteps = {
    fr: [
      { title: "Postulez auprès de PCV", desc: "Envoyez votre candidature à contact@proprechezvous.cg avec vos références, expériences et une pièce d'identité valide.", icon: "📝" },
      { title: "Sélection et entretien", desc: "Notre équipe examine votre dossier et vous contacte pour un entretien. Nous vérifions votre identité, vos références et votre casier judiciaire.", icon: "🔍" },
      { title: "Formation et certification PCV", desc: "Une fois sélectionné, vous suivez notre formation aux standards PCV. Vous obtenez le badge « Certifié PCV ».", icon: "🏅" },
      { title: "Votre profil est publié", desc: "Votre profil apparaît sur la plateforme et commence à recevoir des réservations de clients vérifiés.", icon: "🌟" },
      { title: "Accomplissez les missions & soyez payé", desc: "Gérez vos disponibilités depuis votre tableau de bord. Recevez votre paiement par Mobile Money après chaque mission.", icon: "💰" },
    ],
    en: [
      { title: "Apply to PCV", desc: "Send your application to contact@proprechezvous.cg with your references, experience, and a valid ID.", icon: "📝" },
      { title: "Selection & interview", desc: "Our team reviews your application and contacts you for an interview. We verify your identity, references, and criminal record.", icon: "🔍" },
      { title: "PCV training & certification", desc: "Once selected, you complete our PCV standards training and receive the 'PCV Certified' badge.", icon: "🏅" },
      { title: "Your profile goes live", desc: "Your profile appears on the platform and starts receiving bookings from verified clients.", icon: "🌟" },
      { title: "Complete missions & get paid", desc: "Manage your availability from your dashboard. Receive payment via Mobile Money after each completed job.", icon: "💰" },
    ],
    es: [
      { title: "Postúlate en PCV", desc: "Envía tu solicitud a contact@proprechezvous.cg con tus referencias, experiencia y un documento de identidad válido.", icon: "📝" },
      { title: "Selección y entrevista", desc: "Nuestro equipo revisa tu solicitud y te contacta para una entrevista. Verificamos tu identidad, referencias y antecedentes penales.", icon: "🔍" },
      { title: "Formación y certificación PCV", desc: "Una vez seleccionado, completas nuestra formación de estándares PCV y recibes la insignia 'Certificado PCV'.", icon: "🏅" },
      { title: "Tu perfil se publica", desc: "Tu perfil aparece en la plataforma y comienza a recibir reservas de clientes verificados.", icon: "🌟" },
      { title: "Completa misiones y cobra", desc: "Gestiona tu disponibilidad desde tu panel. Recibe el pago por Mobile Money tras cada misión completada.", icon: "💰" },
    ],
  }[lang];

  const guarantees = {
    fr: [
      "Tous les prestataires sont sélectionnés et vérifiés par notre équipe",
      "Satisfaction garantie ou remboursement intégral",
      "Paiement 100% sécurisé (Mobile Money, carte, PayPal)",
      "Support client disponible 7j/7 de 8h à 20h",
      "Assurance responsabilité civile incluse",
      "Annulation gratuite jusqu'à 24h avant la mission",
    ],
    en: [
      "All cleaners are hand-selected and vetted by our team",
      "Satisfaction guaranteed or full refund",
      "100% secure payment (Mobile Money, card, PayPal)",
      "Customer support 7 days a week, 8am–8pm",
      "Civil liability insurance included",
      "Free cancellation up to 24h before the job",
    ],
    es: [
      "Todos los limpiadores son seleccionados y verificados por nuestro equipo",
      "Satisfacción garantizada o reembolso completo",
      "Pago 100% seguro (Mobile Money, tarjeta, PayPal)",
      "Soporte al cliente 7 días a la semana de 8h a 20h",
      "Seguro de responsabilidad civil incluido",
      "Cancelación gratuita hasta 24h antes de la misión",
    ],
  }[lang];

  const vetNotice = {
    fr: {
      title: "Prestataires sélectionnés par PCV",
      body: "Les prestataires sur PropreChezVous ne s'inscrivent pas eux-mêmes. Chaque professionnel est recruté, interviewé et certifié par notre équipe avant d'apparaître sur la plateforme. Vous ne verrez que des prestataires approuvés.",
      cta: "Postuler comme prestataire",
      href: "/postuler",
    },
    en: {
      title: "Cleaners selected by PCV",
      body: "Cleaners on PropreChezVous don't self-register. Every professional is recruited, interviewed, and certified by our team before appearing on the platform. You will only see approved cleaners.",
      cta: "Apply as a cleaner",
      href: "/postuler",
    },
    es: {
      title: "Limpiadores seleccionados por PCV",
      body: "Los limpiadores en PropreChezVous no se registran por sí mismos. Cada profesional es reclutado, entrevistado y certificado por nuestro equipo antes de aparecer en la plataforma. Solo verás limpiadores aprobados.",
      cta: "Solicitar como limpiador",
      href: "/postuler",
    },
  }[lang];

  const titles = {
    fr: { h1: t("how_title"), sub: t("how_desc"), clients: t("how_for_clients"), pros: t("how_for_pros"), guar: t("how_guarantees"), findBtn: t("find_provider") },
    en: { h1: t("how_title"), sub: t("how_desc"), clients: t("how_for_clients"), pros: t("how_for_pros"), guar: t("how_guarantees"), findBtn: t("find_provider") },
    es: { h1: t("how_title"), sub: t("how_desc"), clients: t("how_for_clients"), pros: t("how_for_pros"), guar: t("how_guarantees"), findBtn: t("find_provider") },
  }[lang];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{titles.h1}</h1>
        <p className="text-gray-600">{titles.sub}</p>
      </div>

      {/* Vetting notice banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-10 flex gap-4">
        <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-900 mb-1">{vetNotice.title}</p>
          <p className="text-sm text-amber-800">{vetNotice.body}</p>
        </div>
      </div>

      {/* For clients */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm">{titles.clients}</span>
        </h2>
        <div className="space-y-6">
          {clientSteps.map((s, i) => (
            <div key={i} className="flex gap-5">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-2xl flex-shrink-0">{s.icon}</div>
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex-1">
                <div className="text-xs font-bold text-emerald-600 mb-1">{step} {i + 1}</div>
                <h3 className="font-bold text-gray-900 mb-1">{s.title}</h3>
                <p className="text-gray-600 text-sm">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* For providers */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">{titles.pros}</span>
        </h2>
        <div className="space-y-6">
          {proSteps.map((s, i) => (
            <div key={i} className="flex gap-5">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl flex-shrink-0">{s.icon}</div>
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex-1">
                <div className="text-xs font-bold text-blue-600 mb-1">{step} {i + 1}</div>
                <h3 className="font-bold text-gray-900 mb-1">{s.title}</h3>
                <p className="text-gray-600 text-sm">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href={vetNotice.href}
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors text-sm">
            {vetNotice.cta} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Guarantees */}
      <section className="bg-emerald-50 rounded-2xl p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">{titles.guar}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {guarantees.map((g) => (
            <div key={g} className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              {g}
            </div>
          ))}
        </div>
      </section>

      <div className="text-center">
        <Link href="/prestataires" className="bg-emerald-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-emerald-700 transition-colors inline-block">
          {titles.findBtn}
        </Link>
      </div>
    </div>
  );
}
