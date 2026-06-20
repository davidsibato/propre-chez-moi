"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/store";
import { getReservations } from "@/lib/store";
import { prestataires } from "@/lib/data";
import { Reservation, User } from "@/lib/types";
import { Calendar, Clock, MapPin, Plus, Star } from "lucide-react";

const STATUT_LABELS: Record<string, { label: string; color: string }> = {
  en_attente: { label: "En attente", color: "bg-yellow-100 text-yellow-700" },
  confirmee: { label: "Confirmée", color: "bg-blue-100 text-blue-700" },
  en_cours: { label: "En cours", color: "bg-purple-100 text-purple-700" },
  terminee: { label: "Terminée", color: "bg-green-100 text-green-700" },
  annulee: { label: "Annulée", color: "bg-red-100 text-red-700" },
};

export default function ClientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u || u.role !== "client") { router.push("/auth/connexion"); return; }
    setUser(u);
    setReservations(getReservations().filter((r) => r.clientId === u.id));
  }, [router]);

  if (!user) return null;

  const prochaines = reservations.filter((r) => ["confirmee", "en_attente"].includes(r.statut));
  const passees = reservations.filter((r) => r.statut === "terminee");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bonjour, {user.prenom} 👋</h1>
          <p className="text-gray-500 text-sm mt-1">{user.quartier}, {user.ville}</p>
        </div>
        <Link href="/prestataires" className="flex items-center gap-2 bg-emerald-600 text-white font-semibold px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors text-sm">
          <Plus className="w-4 h-4" /> Nouvelle réservation
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Réservations", value: reservations.length, icon: <Calendar className="w-5 h-5" /> },
          { label: "À venir", value: prochaines.length, icon: <Clock className="w-5 h-5" /> },
          { label: "Terminées", value: passees.length, icon: <Star className="w-5 h-5" /> },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
            <div className="text-emerald-600 flex justify-center mb-2">{s.icon}</div>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Upcoming */}
      <section className="mb-8">
        <h2 className="font-semibold text-gray-900 mb-4">Prochaines réservations</h2>
        {prochaines.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-500">
            <div className="text-4xl mb-3">📅</div>
            <p>Aucune réservation à venir.</p>
            <Link href="/prestataires" className="text-emerald-600 text-sm font-medium mt-2 inline-block hover:underline">Réserver un prestataire</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {prochaines.map((r) => <ReservationCard key={r.id} reservation={r} />)}
          </div>
        )}
      </section>

      {/* Past */}
      <section>
        <h2 className="font-semibold text-gray-900 mb-4">Historique</h2>
        {passees.length === 0 ? (
          <p className="text-gray-500 text-sm">Aucune réservation passée.</p>
        ) : (
          <div className="space-y-4">
            {passees.map((r) => <ReservationCard key={r.id} reservation={r} />)}
          </div>
        )}
      </section>
    </div>
  );
}

function ReservationCard({ reservation: r }: { reservation: Reservation }) {
  const p = prestataires.find((x) => x.id === r.prestataireId);
  const statut = STATUT_LABELS[r.statut];

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
            {p ? `${p.prenom[0]}${p.nom[0]}` : "?"}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{r.service}</div>
            <div className="text-sm text-gray-500">{p ? `${p.prenom} ${p.nom}` : "Prestataire"}</div>
          </div>
        </div>
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${statut.color}`}>{statut.label}</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 text-sm text-gray-600">
        <div className="flex items-center gap-1"><Calendar className="w-4 h-4 text-gray-500" />{r.date}</div>
        <div className="flex items-center gap-1"><Clock className="w-4 h-4 text-gray-500" />{r.heureDebut} · {r.duree}h</div>
        <div className="flex items-center gap-1"><MapPin className="w-4 h-4 text-gray-500" />{r.quartier}</div>
      </div>
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
        <span className="text-sm font-bold text-emerald-700">{r.montant.toLocaleString("fr-FR")} FCFA</span>
        <span className="text-xs text-gray-500">
          {r.paiement.methode === "airtel_money" ? "Airtel Money" : "Orange Money"} · {r.paiement.statut === "paye" ? "✓ Payé" : "En attente"}
        </span>
      </div>
    </div>
  );
}
