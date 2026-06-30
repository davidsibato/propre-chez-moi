"use client";
import { useI18n } from "@/lib/i18n-context";

export default function ConfidentialitePage() {
  const { lang } = useI18n();

  const content = {
    fr: {
      title: "Politique de confidentialité",
      updated: "Dernière mise à jour : 20 juin 2026",
      sections: [
        { heading: "1. Données collectées", body: "PropreChezVous collecte les informations que vous nous fournissez lors de votre inscription : nom, prénom, adresse email, numéro de téléphone, ville et quartier. Pour les prestataires, nous collectons également les documents d'identité et le CV dans le cadre du processus de candidature." },
        { heading: "2. Utilisation des données", body: "Vos données sont utilisées pour : gérer votre compte, traiter vos réservations, vous envoyer des confirmations et notifications de service, améliorer notre plateforme, et nous conformer à nos obligations légales. Nous n'utilisons pas vos données à des fins publicitaires tierces." },
        { heading: "3. Partage des données", body: "Nous ne vendons jamais vos données personnelles. Vos informations peuvent être partagées avec le prestataire concerné par votre réservation (nom, adresse d'intervention) et avec nos prestataires techniques (Supabase, Resend) dans le strict cadre de l'exécution du service." },
        { heading: "4. Sécurité", body: "Vos données sont stockées de manière sécurisée sur des serveurs en Europe via Supabase. Les paiements sont traités par des prestataires certifiés (Airtel Money, Orange Money, Stripe). Nous appliquons le chiffrement en transit (HTTPS/TLS) et au repos." },
        { heading: "5. Vos droits", body: "Vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, contactez-nous à : contact@proprechezvous.cg. Nous répondrons dans un délai de 30 jours." },
        { heading: "6. Cookies", body: "Nous utilisons uniquement des cookies techniques essentiels au fonctionnement du site (session, préférence de langue). Aucun cookie publicitaire ou de suivi tiers n'est utilisé." },
        { heading: "7. Contact", body: "Pour toute question relative à cette politique, écrivez-nous à contact@proprechezvous.cg ou à l'adresse : PropreChezVous, Kinshasa, République Démocratique du Congo." },
      ],
    },
    en: {
      title: "Privacy Policy",
      updated: "Last updated: 20 June 2026",
      sections: [
        { heading: "1. Data collected", body: "PropreChezVous collects the information you provide when registering: name, email address, phone number, city and neighbourhood. For cleaners, we also collect identity documents and a CV as part of the application process." },
        { heading: "2. Use of data", body: "Your data is used to: manage your account, process bookings, send service confirmations and notifications, improve our platform, and comply with our legal obligations. We do not use your data for third-party advertising." },
        { heading: "3. Data sharing", body: "We never sell your personal data. Your information may be shared with the cleaner involved in your booking (name, service address) and with our technical providers (Supabase, Resend) solely to deliver the service." },
        { heading: "4. Security", body: "Your data is stored securely on European servers via Supabase. Payments are processed by certified providers (Airtel Money, Orange Money, Stripe). We apply encryption in transit (HTTPS/TLS) and at rest." },
        { heading: "5. Your rights", body: "You have the right to access, correct, delete, and export your personal data. To exercise these rights, contact us at: contact@proprechezvous.cg. We will respond within 30 days." },
        { heading: "6. Cookies", body: "We only use essential technical cookies required for the site to function (session, language preference). No advertising or third-party tracking cookies are used." },
        { heading: "7. Contact", body: "For any questions about this policy, write to us at contact@proprechezvous.cg or at: PropreChezVous, Kinshasa, Democratic Republic of Congo." },
      ],
    },
    es: {
      title: "Política de privacidad",
      updated: "Última actualización: 20 de junio de 2026",
      sections: [
        { heading: "1. Datos recopilados", body: "PropreChezVous recopila la información que nos proporcionas al registrarte: nombre, apellido, correo electrónico, teléfono, ciudad y barrio. Para los limpiadores, también recopilamos documentos de identidad y CV como parte del proceso de solicitud." },
        { heading: "2. Uso de los datos", body: "Tus datos se utilizan para: gestionar tu cuenta, procesar reservas, enviarte confirmaciones y notificaciones de servicio, mejorar nuestra plataforma y cumplir con nuestras obligaciones legales. No usamos tus datos para publicidad de terceros." },
        { heading: "3. Compartición de datos", body: "Nunca vendemos tus datos personales. Tu información puede compartirse con el limpiador de tu reserva (nombre, dirección de servicio) y con nuestros proveedores técnicos (Supabase, Resend) únicamente para prestar el servicio." },
        { heading: "4. Seguridad", body: "Tus datos se almacenan de forma segura en servidores europeos a través de Supabase. Los pagos son procesados por proveedores certificados (Airtel Money, Orange Money, Stripe). Aplicamos cifrado en tránsito (HTTPS/TLS) y en reposo." },
        { heading: "5. Tus derechos", body: "Tienes derecho a acceder, rectificar, eliminar y exportar tus datos personales. Para ejercer estos derechos, contáctanos en: contact@proprechezvous.cg. Responderemos en un plazo de 30 días." },
        { heading: "6. Cookies", body: "Solo utilizamos cookies técnicas esenciales para el funcionamiento del sitio (sesión, preferencia de idioma). No se utilizan cookies publicitarias ni de seguimiento de terceros." },
        { heading: "7. Contacto", body: "Para cualquier pregunta sobre esta política, escríbenos a contact@proprechezvous.cg o a: PropreChezVous, Kinshasa, República Democrática del Congo." },
      ],
    },
  }[lang];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{content.title}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-10 border-b border-gray-200 dark:border-slate-700 pb-6">{content.updated}</p>
      <div className="space-y-8">
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
