"use client";
import { useI18n } from "@/lib/i18n-context";

export default function ConditionsPage() {
  const { lang } = useI18n();

  const content = {
    fr: {
      title: "Conditions d'utilisation",
      updated: "Dernière mise à jour : 20 juin 2026",
      sections: [
        { heading: "1. Objet", body: "Les présentes conditions régissent l'utilisation de la plateforme PropreChezVous (PCV), service de mise en relation entre clients et prestataires de services ménagers au Congo-Brazzaville et en République Démocratique du Congo." },
        { heading: "2. Inscription et comptes", body: "L'inscription est réservée aux personnes majeures (18 ans et plus). Vous êtes responsable de la confidentialité de vos identifiants. Les comptes prestataires sont créés exclusivement par l'équipe PCV après vérification d'identité. Tout compte frauduleux sera immédiatement suspendu." },
        { heading: "3. Réservations et paiements", body: "Toute réservation effectuée via PCV constitue un contrat de service entre le client et le prestataire. Le paiement s'effectue exclusivement en ligne via les méthodes proposées (Airtel Money, M-Pesa, Orange Money, carte bancaire, PayPal). Aucun paiement en espèces n'est accepté. PCV prélève une commission de 15% sur chaque transaction." },
        { heading: "4. Annulation et remboursement", body: "L'annulation est gratuite jusqu'à 24 heures avant la prestation. En deçà de ce délai, des frais d'annulation équivalents à 50% du montant peuvent s'appliquer. En cas de prestation non conforme, PCV s'engage à trouver une solution amiable ou à procéder au remboursement intégral dans un délai de 5 jours ouvrés." },
        { heading: "5. Responsabilités", body: "PCV agit comme intermédiaire et ne peut être tenu responsable des dommages causés pendant une prestation au-delà du montant de celle-ci, sauf faute grave avérée. Tous les prestataires bénéficient d'une assurance responsabilité civile professionnelle." },
        { heading: "6. Interdictions", body: "Il est interdit de : contacter les prestataires en dehors de la plateforme pour éviter les commissions, publier des avis frauduleux, usurper l'identité d'autrui, utiliser la plateforme à des fins illégales. Toute violation entraîne la suspension définitive du compte." },
        { heading: "7. Propriété intellectuelle", body: "Le nom PropreChezVous, le logo PCV, le contenu éditorial et le code source de la plateforme sont la propriété exclusive de David Sibato. Toute reproduction sans autorisation est interdite." },
        { heading: "8. Droit applicable", body: "Les présentes conditions sont régies par le droit de la République Démocratique du Congo. Tout litige sera soumis à la juridiction compétente de Kinshasa, RDC, sans préjudice des droits applicables en République du Congo-Brazzaville pour les utilisateurs de cette juridiction." },
      ],
    },
    en: {
      title: "Terms of Use",
      updated: "Last updated: 20 June 2026",
      sections: [
        { heading: "1. Purpose", body: "These terms govern the use of the PropreChezVous (PCV) platform, a service connecting clients and home cleaning professionals in Congo-Brazzaville and the Democratic Republic of Congo." },
        { heading: "2. Registration and accounts", body: "Registration is restricted to adults (18 years and over). You are responsible for keeping your credentials confidential. Cleaner accounts are created exclusively by the PCV team after identity verification. Any fraudulent account will be immediately suspended." },
        { heading: "3. Bookings and payments", body: "Any booking made via PCV constitutes a service contract between the client and the cleaner. Payment is made exclusively online via the methods offered (Airtel Money, M-Pesa, Orange Money, card, PayPal). No cash payments are accepted. PCV charges a 15% commission on each transaction." },
        { heading: "4. Cancellation and refunds", body: "Cancellation is free up to 24 hours before the service. Within this period, a cancellation fee of 50% of the booking amount may apply. In the event of a non-conforming service, PCV commits to finding an amicable solution or issuing a full refund within 5 business days." },
        { heading: "5. Liability", body: "PCV acts as an intermediary and cannot be held liable for damages caused during a service beyond the amount of that service, except in cases of proven gross negligence. All cleaners have professional liability insurance." },
        { heading: "6. Prohibited conduct", body: "It is prohibited to: contact cleaners outside the platform to avoid commissions, post fraudulent reviews, impersonate others, or use the platform for illegal purposes. Any violation results in permanent account suspension." },
        { heading: "7. Intellectual property", body: "The name PropreChezVous, the PCV logo, editorial content and the platform source code are the exclusive property of David Sibato. Any reproduction without authorisation is prohibited." },
        { heading: "8. Governing law", body: "These terms are governed by the laws of the Democratic Republic of Congo. Any dispute will be submitted to the competent jurisdiction of Kinshasa, DRC, without prejudice to the rights applicable in the Republic of Congo-Brazzaville for users in that jurisdiction." },
      ],
    },
    es: {
      title: "Condiciones de uso",
      updated: "Última actualización: 20 de junio de 2026",
      sections: [
        { heading: "1. Objeto", body: "Estas condiciones rigen el uso de la plataforma PropreChezVous (PCV), servicio de intermediación entre clientes y profesionales de limpieza a domicilio en Congo-Brazzaville y la República Democrática del Congo." },
        { heading: "2. Registro y cuentas", body: "El registro está reservado a personas mayores de edad (18 años o más). Eres responsable de mantener la confidencialidad de tus credenciales. Las cuentas de limpiadores son creadas exclusivamente por el equipo PCV tras verificación de identidad. Cualquier cuenta fraudulenta será suspendida de inmediato." },
        { heading: "3. Reservas y pagos", body: "Cualquier reserva realizada a través de PCV constituye un contrato de servicio entre el cliente y el limpiador. El pago se realiza exclusivamente en línea mediante los métodos ofrecidos (Airtel Money, M-Pesa, Orange Money, tarjeta, PayPal). No se aceptan pagos en efectivo. PCV cobra una comisión del 15% en cada transacción." },
        { heading: "4. Cancelaciones y reembolsos", body: "La cancelación es gratuita hasta 24 horas antes del servicio. Dentro de este plazo, puede aplicarse una tarifa de cancelación equivalente al 50% del importe. En caso de servicio no conforme, PCV se compromete a encontrar una solución amistosa o a realizar un reembolso completo en 5 días hábiles." },
        { heading: "5. Responsabilidad", body: "PCV actúa como intermediario y no puede ser considerado responsable de los daños causados durante un servicio más allá del importe del mismo, salvo negligencia grave probada. Todos los limpiadores cuentan con seguro de responsabilidad civil profesional." },
        { heading: "6. Conductas prohibidas", body: "Está prohibido: contactar a los limpiadores fuera de la plataforma para evitar comisiones, publicar reseñas fraudulentas, suplantar la identidad de otros o usar la plataforma con fines ilegales. Cualquier infracción conlleva la suspensión permanente de la cuenta." },
        { heading: "7. Propiedad intelectual", body: "El nombre PropreChezVous, el logo PCV, el contenido editorial y el código fuente de la plataforma son propiedad exclusiva de David Sibato. Cualquier reproducción sin autorización está prohibida." },
        { heading: "8. Derecho aplicable", body: "Estas condiciones se rigen por el derecho de la República Democrática del Congo. Cualquier litigio se someterá a la jurisdicción competente de Kinshasa, RDC, sin perjuicio de los derechos aplicables en la República del Congo-Brazzaville para los usuarios de esa jurisdicción." },
      ],
    },
  }[lang];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{content.title}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-10 border-b border-gray-200 dark:border-slate-700 pb-6">{content.updated}</p>
      <div className="space-y-4">
        {content.sections.map((s) => (
          <div key={s.heading} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700">
            <h2 className="text-base font-bold text-emerald-700 dark:text-emerald-400 mb-3">{s.heading}</h2>
            <p className="text-gray-700 dark:text-gray-200 text-sm leading-7">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
