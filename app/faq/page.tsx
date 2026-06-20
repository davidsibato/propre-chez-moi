"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";

function Accordion({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-5 py-4 text-left bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors"
      >
        <span className="font-semibold text-gray-900 dark:text-white text-sm">{q}</span>
        <ChevronDown className={`w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 ml-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 py-4 bg-gray-50 dark:bg-slate-900 border-t border-gray-100 dark:border-slate-700">
          <p className="text-sm text-gray-700 dark:text-gray-200 leading-7">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  const { lang } = useI18n();

  const content = {
    fr: {
      title: "Questions fréquentes",
      sub: "Trouvez rapidement une réponse à vos questions.",
      clients: {
        heading: "Pour les clients",
        items: [
          { q: "Comment réserver un prestataire ?", a: "Choisissez un service sur la page Prestataires, sélectionnez un profil, cliquez sur « Réserver maintenant » et suivez les étapes : date, heure, adresse, puis paiement en ligne." },
          { q: "Quels modes de paiement sont acceptés ?", a: "Airtel Money, Orange Money, carte bancaire Visa/Mastercard et PayPal. Aucun paiement en espèces n'est accepté pour garantir la traçabilité et la sécurité." },
          { q: "Puis-je annuler ma réservation ?", a: "Oui, l'annulation est gratuite jusqu'à 24 heures avant la prestation. En-deçà, des frais de 50% peuvent s'appliquer." },
          { q: "Que faire si je ne suis pas satisfait ?", a: "Contactez-nous dans les 48h suivant la prestation à contact@proprechezvous.cg. Nous proposons une re-prestation gratuite ou un remboursement intégral selon les cas." },
          { q: "Les prestataires sont-ils vérifiés ?", a: "Oui. Chaque prestataire est recruté, interviewé et certifié par notre équipe avant d'apparaître sur la plateforme. Nous vérifions leur identité, leurs références et leur casier judiciaire." },
        ],
      },
      providers: {
        heading: "Pour les prestataires",
        items: [
          { q: "Comment rejoindre PropreChezVous ?", a: "Remplissez le formulaire de candidature sur la page « Devenir prestataire ». Notre équipe examine chaque dossier et vous recontacte sous 5 à 7 jours ouvrés." },
          { q: "Quelle commission prélève PCV ?", a: "PCV prélève 15% sur chaque mission. Ce montant couvre l'assurance responsabilité civile, la mise en avant de votre profil et les frais de paiement." },
          { q: "Comment suis-je payé ?", a: "Votre paiement est versé sur votre compte Mobile Money (Airtel ou Orange) après confirmation de la mission, généralement dans les 24 à 48 heures." },
          { q: "Puis-je choisir mes disponibilités ?", a: "Oui. Vous gérez vos disponibilités depuis votre tableau de bord. Vous pouvez accepter ou refuser des missions selon votre planning." },
        ],
      },
    },
    en: {
      title: "Frequently asked questions",
      sub: "Find quick answers to your questions.",
      clients: {
        heading: "For clients",
        items: [
          { q: "How do I book a cleaner?", a: "Browse the Cleaners page, select a profile, click 'Book now' and follow the steps: date, time, address, then pay online." },
          { q: "What payment methods are accepted?", a: "Airtel Money, Orange Money, Visa/Mastercard card and PayPal. No cash payments are accepted to ensure traceability and security." },
          { q: "Can I cancel my booking?", a: "Yes, cancellation is free up to 24 hours before the service. Within this window, a 50% fee may apply." },
          { q: "What if I'm not satisfied?", a: "Contact us within 48 hours of the service at contact@proprechezvous.cg. We offer a free redo or a full refund depending on the situation." },
          { q: "Are cleaners vetted?", a: "Yes. Every cleaner is recruited, interviewed and certified by our team before appearing on the platform. We verify their identity, references and criminal record." },
        ],
      },
      providers: {
        heading: "For cleaners",
        items: [
          { q: "How do I join PropreChezVous?", a: "Fill in the application form on the 'Become a cleaner' page. Our team reviews every application and gets back to you within 5–7 business days." },
          { q: "What commission does PCV charge?", a: "PCV charges 15% on each job. This covers professional liability insurance, profile promotion and payment processing fees." },
          { q: "How do I get paid?", a: "Your payment is transferred to your Mobile Money account (Airtel or Orange) after the job is confirmed, usually within 24–48 hours." },
          { q: "Can I set my own availability?", a: "Yes. You manage your availability from your dashboard. You can accept or decline jobs based on your schedule." },
        ],
      },
    },
    es: {
      title: "Preguntas frecuentes",
      sub: "Encuentra rápidamente respuestas a tus preguntas.",
      clients: {
        heading: "Para clientes",
        items: [
          { q: "¿Cómo reservo un limpiador?", a: "Navega por la página de Limpiadores, selecciona un perfil, haz clic en 'Reservar ahora' y sigue los pasos: fecha, hora, dirección y luego paga en línea." },
          { q: "¿Qué métodos de pago se aceptan?", a: "Airtel Money, Orange Money, tarjeta Visa/Mastercard y PayPal. No se aceptan pagos en efectivo para garantizar la trazabilidad y seguridad." },
          { q: "¿Puedo cancelar mi reserva?", a: "Sí, la cancelación es gratuita hasta 24 horas antes del servicio. Dentro de ese plazo, puede aplicarse una tarifa del 50%." },
          { q: "¿Qué pasa si no estoy satisfecho?", a: "Contáctanos dentro de las 48 horas posteriores al servicio en contact@proprechezvous.cg. Ofrecemos un servicio de repetición gratuito o un reembolso completo según el caso." },
          { q: "¿Los limpiadores están verificados?", a: "Sí. Cada limpiador es reclutado, entrevistado y certificado por nuestro equipo antes de aparecer en la plataforma. Verificamos su identidad, referencias y antecedentes penales." },
        ],
      },
      providers: {
        heading: "Para limpiadores",
        items: [
          { q: "¿Cómo me uno a PropreChezVous?", a: "Completa el formulario de solicitud en la página 'Convertirse en limpiador'. Nuestro equipo revisa cada solicitud y te contacta en 5 a 7 días hábiles." },
          { q: "¿Qué comisión cobra PCV?", a: "PCV cobra el 15% en cada misión. Este monto cubre el seguro de responsabilidad civil, la promoción de tu perfil y los gastos de pago." },
          { q: "¿Cómo me pagan?", a: "Tu pago se transfiere a tu cuenta Mobile Money (Airtel u Orange) tras la confirmación de la misión, generalmente en 24 a 48 horas." },
          { q: "¿Puedo gestionar mi disponibilidad?", a: "Sí. Gestionas tu disponibilidad desde tu panel. Puedes aceptar o rechazar misiones según tu horario." },
        ],
      },
    },
  }[lang];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{content.title}</h1>
        <p className="text-gray-600 dark:text-gray-300">{content.sub}</p>
      </div>
      <section className="mb-10">
        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">
          <span className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full">{content.clients.heading}</span>
        </h2>
        <div className="space-y-3">
          {content.clients.items.map((item) => <Accordion key={item.q} q={item.q} a={item.a} />)}
        </div>
      </section>
      <section>
        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full">{content.providers.heading}</span>
        </h2>
        <div className="space-y-3">
          {content.providers.items.map((item) => <Accordion key={item.q} q={item.q} a={item.a} />)}
        </div>
      </section>
    </div>
  );
}
