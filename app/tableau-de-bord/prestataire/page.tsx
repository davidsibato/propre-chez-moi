"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, getReservations } from "@/lib/store";
import { prestataires } from "@/lib/data";
import { Reservation, User, Prestataire } from "@/lib/types";
import { Star, Calendar, TrendingUp, CheckCircle, Clock } from "lucide-react";

const STATUT_LABELS: Record<string, { label: string; color: string }> = {
  en_attente: { label: "En attente", color: "bg-yellow-100 text-yellow-700" },
  confirmee: { label: "Confirmée", color: "bg-blue-100 text-blue-700" },
  en_cours: { label: "En cours", color: "bg-purple-100 text-purple-700" },
  terminee: { label: "Terminée", color: "bg-green-100 text-green-700" },
  annulee: { label: "Annulée", color: "bg-red-100 text-red-700" },
};

export default function PrestataireDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profil, setProfil] = useState<Prestataire | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u || u.role !== "prestataire") { router.push("/auth/connexion"); return; }
    setUser(u);
    const p = prestataires.find((x) => x.id === u.id) || null;
    setProfil(p);
    setReservations(getReservations().filter((r) => r.prestataireId === u.id));
  }, [router]);

  if (!user) return null;

  const gains = reservations.filter((r) => r.statut === "terminee").reduce((sum, r) => sum + r.montant, 0);
  const prochaines = reservations.filter((r) => ["confirmee", "en_attente"].includes(r.statut));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord prestataire</h1>
          <p className="text-gray-500 text-sm mt-1">Bonjour, {user.prenom} {user.nom}</p>
        </div>
        {profil && (
          <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${profil.disponible ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
            {profil.disponible ? "● Disponible" : "● Indisponible"}
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Note", value: profil?.note?.toString() || "—", sub: `${profil?.nombreAvis || 0} avis`, icon: <Star className="w-5 h-5" /> },
          { label: "Missions", value: reservations.length.toString(), sub: "au total", icon: <Calendar className="w-5 h-5" /> },
          { label: "À venir", value: prochaines.length.toString(), sub: "confirmées", icon: <Clock className="w-5 h-5" /> },
          { label: "Gains", value: `${gains.toLocaleString("fr-FR")}`, sub: "FCFA", icon: <TrendingUp className="w-5 h-5" /> },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="text-emerald-600 mb-2">{s.icon}</div>
            <div className="text-xl font-bold text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label} · {s.sub}</div>
          </div>
        ))}
      </div>

      {/* Profile summary */}
      {profil && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">Mon profil</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {profil.services.map((s) => (
              <span key={s} className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">{s}</span>
            ))}
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium text-emerald-700">{profil.tarifHoraire.toLocaleString("fr-FR")} FCFA/h</span>
            {profil.certifie && <span className="ml-3 text-xs text-emerald-600 flex-inline items-center"><CheckCircle className="w-3 h-3 inline mr-1" />Prestataire certifié</span>}
          </div>
        </div>
      )}

      {/* Upcoming missions */}
      <section className="mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Prochaines missions</h2>
        {prochaines.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-500">
            <div className="text-4xl mb-3">📋</div>
            <p>Aucune mission à venir pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {prochaines.map((r) => <MissionCard key={r.id} r={r} />)}
          </div>
        )}
      </section>

      {/* All missions */}
      <section>
        <h2 className="font-semibold text-gray-900 mb-4">Toutes les missions ({reservations.length})</h2>
        <div className="space-y-3">
          {reservations.map((r) => <MissionCard key={r.id} r={r} />)}
        </div>
      </section>
    </div>
  );
}

function MissionCard({ r }: { r: Reservation }) {
  const statut = STATUT_LABELS[r.statut];
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-wrap gap-4 justify-between items-center">
      <div>
        <div className="font-medium text-gray-900 text-sm">{r.service}</div>
        <div className="text-xs text-gray-500 mt-0.5">{r.date} · {r.heureDebut} · {r.duree}h · {r.quartier}, {r.ville}</div>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-bold text-emerald-700 text-sm">{r.montant.toLocaleString("fr-FR")} FCFA</span>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statut.color}`}>{statut.label}</span>
      </div>
    </div>
  );
}
