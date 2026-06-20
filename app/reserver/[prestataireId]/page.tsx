"use client";
import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { prestataires, quartiersBrazzaville, quartiersKinshasa, quartiersPointeNoire } from "@/lib/data";
import { getCurrentUser, addReservation } from "@/lib/store";
import { Reservation } from "@/lib/types";
import { getCurrency, formatWithUSD } from "@/lib/currency";
import { ChevronLeft, CheckCircle, Smartphone, CreditCard, Info } from "lucide-react";

type Step = "details" | "paiement" | "confirmation";
type MethodePaiement = "airtel_money" | "orange_money" | "card" | "paypal";

const METHODES = [
  { id: "airtel_money" as const, label: "Airtel Money", emoji: "📱", desc: "Paiement mobile rapide" },
  { id: "orange_money" as const, label: "Orange Money", emoji: "🟠", desc: "Paiement mobile Orange" },
  { id: "card" as const, label: "Carte bancaire", emoji: "💳", desc: "Visa, Mastercard" },
  { id: "paypal" as const, label: "PayPal", emoji: "🅿️", desc: "Compte PayPal" },
];

export default function ReserverPage({ params }: { params: Promise<{ prestataireId: string }> }) {
  const { prestataireId } = use(params);
  const router = useRouter();
  const p = prestataires.find((x) => x.id === prestataireId);
  if (!p) { notFound(); return null as never; }

  const currency = getCurrency(p.ville);

  const [step, setStep] = useState<Step>("details");
  const [date, setDate] = useState("");
  const [heure, setHeure] = useState("08:00");
  const [duree, setDuree] = useState(2);
  const [service, setService] = useState(p.services[0] || "Ménage complet");
  const [adresse, setAdresse] = useState("");
  const [quartier, setQuartier] = useState("");
  const [instructions, setInstructions] = useState("");
  const [methode, setMethode] = useState<MethodePaiement>("airtel_money");
  const [numeroMobile, setNumeroMobile] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [reservationId, setReservationId] = useState("");

  const montant = p.tarifHoraire * duree;
  const { main: montantStr, usd } = formatWithUSD(montant, p.ville);
  const { main: tarifStr } = formatWithUSD(p.tarifHoraire, p.ville);

  const quartiers =
    p.ville === "Brazzaville" ? quartiersBrazzaville
    : p.ville === "Kinshasa" ? quartiersKinshasa
    : quartiersPointeNoire;

  const today = new Date().toISOString().split("T")[0];

  const isMobile = methode === "airtel_money" || methode === "orange_money";
  const isCard = methode === "card";
  const isPaypal = methode === "paypal";

  const paiementValide =
    (isMobile && numeroMobile.length >= 8) ||
    (isCard && cardNumber.length >= 16 && cardExpiry && cardCvc) ||
    (isPaypal && paypalEmail.includes("@"));

  function handleReserver() {
    const user = getCurrentUser();
    if (!user) { router.push("/auth/connexion"); return; }
    if (!p) return;
    setLoading(true);
    const prestataireIdVal = p.id;
    setTimeout(() => {
      const id = `r_${Date.now()}`;
      const reservation: Reservation = {
        id,
        clientId: user.id,
        prestataireId: prestataireIdVal,
        service,
        date,
        heureDebut: heure,
        duree,
        adresse,
        quartier,
        ville: p.ville,
        instructions,
        montant,
        statut: "confirmee",
        paiement: {
          statut: "paye",
          methode: isMobile ? methode as "airtel_money" | "orange_money" : "cash",
          numeroCarte: isMobile ? numeroMobile : isCard ? cardNumber.slice(-4) : paypalEmail,
          transactionId: `PCV-${Date.now()}`,
        },
        createdAt: new Date().toISOString().split("T")[0],
      };
      addReservation(reservation);
      setReservationId(id);
      setStep("confirmation");
      setLoading(false);
    }, 1800);
  }

  if (step === "confirmation") {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Réservation confirmée !</h1>
          <p className="text-gray-600 mb-1">Référence : <strong className="font-mono">#{reservationId}</strong></p>
          <p className="text-gray-500 text-sm mb-8">{p.prenom} {p.nom} vous contactera sous peu.</p>
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-sm text-emerald-900 mb-8 text-left space-y-1">
            <div className="font-semibold mb-2">Récapitulatif</div>
            <div className="flex justify-between"><span>Service</span><span>{service}</span></div>
            <div className="flex justify-between"><span>Date</span><span>{date} à {heure}</span></div>
            <div className="flex justify-between"><span>Durée</span><span>{duree}h</span></div>
            <div className="flex justify-between font-bold border-t border-emerald-200 pt-2 mt-2">
              <span>Total payé</span><span>{montantStr} <span className="font-normal text-emerald-600 text-xs">({usd})</span></span>
            </div>
          </div>
          <Link href="/tableau-de-bord/client"
            className="block bg-emerald-600 text-white font-semibold py-3 rounded-xl hover:bg-emerald-700 transition-colors">
            Voir mes réservations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href={`/prestataires/${p.id}`} className="flex items-center gap-1 text-sm text-gray-600 hover:text-emerald-600 mb-6">
        <ChevronLeft className="w-4 h-4" /> Retour au profil
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Réserver {p.prenom} {p.nom}</h1>

      {/* Steps */}
      <div className="flex items-center gap-3 mb-8">
        {(["details", "paiement"] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors
              ${step === s || (s === "details" && step === "paiement")
                ? "bg-emerald-600 text-white"
                : "bg-gray-200 text-gray-600"}`}>
              {i + 1}
            </div>
            <span className={`text-sm font-medium ${step === s ? "text-gray-900" : "text-gray-500"}`}>
              {s === "details" ? "Détails" : "Paiement"}
            </span>
            {i < 1 && <div className="w-10 h-0.5 bg-gray-200 mx-1" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          {step === "details" && (
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">Service</label>
                <select value={service} onChange={(e) => setService(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 text-sm bg-white">
                  {p.services.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1.5">Date</label>
                  <input type="date" required min={today} value={date} onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1.5">Heure de début</label>
                  <select value={heure} onChange={(e) => setHeure(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 text-sm bg-white">
                    {["07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"].map((h) => (
                      <option key={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">Durée</label>
                <div className="grid grid-cols-6 gap-2">
                  {[1,2,3,4,5,6].map((d) => (
                    <button key={d} type="button" onClick={() => setDuree(d)}
                      className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors
                        ${duree === d ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-gray-200 text-gray-700 hover:border-emerald-300"}`}>
                      {d}h
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">Adresse exacte</label>
                <input value={adresse} onChange={(e) => setAdresse(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 text-sm"
                  placeholder="N° et nom de la rue..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">Quartier</label>
                <select value={quartier} onChange={(e) => setQuartier(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 text-sm bg-white">
                  <option value="">Choisir un quartier...</option>
                  {quartiers.map((q) => <option key={q}>{q}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">Instructions <span className="text-gray-500 font-normal">(optionnel)</span></label>
                <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 text-sm resize-none"
                  placeholder="Accès, produits à utiliser, pièces prioritaires..." />
              </div>
              <button onClick={() => setStep("paiement")} disabled={!date || !adresse || !quartier}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-colors">
                Continuer vers le paiement
              </button>
            </div>
          )}

          {step === "paiement" && (
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-5">
              <h2 className="font-semibold text-gray-900">Mode de paiement</h2>

              <div className="grid grid-cols-2 gap-3">
                {METHODES.map((m) => (
                  <label key={m.id}
                    className={`flex items-center gap-3 p-3.5 border-2 rounded-xl cursor-pointer transition-colors
                      ${methode === m.id ? "border-emerald-500 bg-emerald-50" : "border-gray-200 hover:border-emerald-200"}`}>
                    <input type="radio" name="methode" value={m.id} checked={methode === m.id}
                      onChange={() => setMethode(m.id)} className="accent-emerald-600" />
                    <span className="text-xl">{m.emoji}</span>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{m.label}</div>
                      <div className="text-xs text-gray-500">{m.desc}</div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Mobile money fields */}
              {isMobile && (
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                    Numéro {methode === "airtel_money" ? "Airtel" : "Orange"} Money
                  </label>
                  <input type="tel" value={numeroMobile} onChange={(e) => setNumeroMobile(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 text-sm"
                    placeholder="+242 06 ..." />
                  <div className="flex items-start gap-2 mt-2 text-xs text-gray-500">
                    <Smartphone className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    Vous recevrez une notification de confirmation sur votre téléphone.
                  </div>
                </div>
              )}

              {/* Card fields */}
              {isCard && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">Numéro de carte</label>
                    <div className="relative">
                      <input type="text" value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 text-sm pr-10"
                        placeholder="1234 5678 9012 3456" maxLength={16} />
                      <CreditCard className="absolute right-3 top-3.5 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1.5">Expiration</label>
                      <input type="text" value={cardExpiry}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                          if (v.length >= 3) v = v.slice(0,2) + "/" + v.slice(2);
                          setCardExpiry(v);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 text-sm"
                        placeholder="MM/AA" maxLength={5} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1.5">CVC</label>
                      <input type="text" value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 text-sm"
                        placeholder="123" maxLength={4} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Info className="w-3.5 h-3.5 flex-shrink-0" />
                    Paiement sécurisé SSL. Vos données ne sont pas stockées.
                  </div>
                </div>
              )}

              {/* PayPal field */}
              {isPaypal && (
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1.5">Email PayPal</label>
                  <input type="email" value={paypalEmail} onChange={(e) => setPaypalEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 text-sm"
                    placeholder="votre@paypal.com" />
                  <div className="flex items-start gap-2 mt-2 text-xs text-gray-500">
                    <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    Vous serez redirigé vers PayPal pour finaliser le paiement.
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button onClick={() => setStep("details")}
                  className="flex-1 border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:border-gray-300 transition-colors">
                  Retour
                </button>
                <button onClick={handleReserver} disabled={!paiementValide || loading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-colors">
                  {loading ? "Traitement..." : `Payer ${montantStr}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4">Récapitulatif</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                {p.prenom[0]}{p.nom[0]}
              </div>
              <div>
                <div className="font-medium text-sm text-gray-900">{p.prenom} {p.nom}</div>
                <div className="text-xs text-gray-500">{p.ville}</div>
              </div>
            </div>
            <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
              <div className="flex justify-between text-gray-700"><span className="text-gray-500">Service</span><span>{service}</span></div>
              {date && <div className="flex justify-between text-gray-700"><span className="text-gray-500">Date</span><span>{date}</span></div>}
              <div className="flex justify-between text-gray-700"><span className="text-gray-500">Heure</span><span>{heure}</span></div>
              <div className="flex justify-between text-gray-700"><span className="text-gray-500">Durée</span><span>{duree}h</span></div>
              <div className="flex justify-between text-gray-700"><span className="text-gray-500">Tarif/h</span><span>{tarifStr}</span></div>
            </div>
            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-gray-900">Total</span>
                <div className="text-right">
                  <div className="font-bold text-emerald-700 text-lg">{montantStr}</div>
                  <div className="text-xs text-gray-500">{usd}</div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500 bg-gray-50 rounded-lg p-2.5">
              💡 {currency === "FCFA" ? "Prix en Franc CFA · Congo-Brazzaville" : "Prix en Franc Congolais · RDC"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
