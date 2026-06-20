"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, getReservations } from "@/lib/store";
import { prestataires as mockPrestataires } from "@/lib/data";
import { services, villes, quartiersBrazzaville, quartiersKinshasa, quartiersPointeNoire } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { User } from "@/lib/types";
import { Users, Calendar, TrendingUp, Shield, CheckCircle, XCircle, Clock, Plus, X, Star } from "lucide-react";

type Tab = "overview" | "prestataires" | "reservations" | "ajouter";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState<Tab>("overview");
  const [toast, setToast] = useState("");

  useEffect(() => {
    const u = getCurrentUser();
    if (!u || u.role !== "admin") { router.push("/auth/connexion"); return; }
    setUser(u);
  }, [router]);

  if (!user) return null;

  const reservations = getReservations();
  const totalGains = reservations.filter((r) => r.paiement.statut === "paye").reduce((sum, r) => sum + r.montant, 0);
  const commission = Math.round(totalGains * 0.15);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Vue d'ensemble" },
    { id: "prestataires", label: "Prestataires" },
    { id: "reservations", label: "Réservations" },
    { id: "ajouter", label: "+ Ajouter prestataire" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium animate-pulse">
          <CheckCircle className="w-4 h-4" /> {toast}
        </div>
      )}

      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
          <p className="text-gray-500 text-sm mt-1">Tableau de bord PropreChezVous · {user.prenom} {user.nom}</p>
        </div>
        <button onClick={() => setTab("ajouter")}
          className="flex items-center gap-2 bg-emerald-600 text-white font-semibold px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors text-sm">
          <Plus className="w-4 h-4" /> Ajouter un prestataire
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8 w-fit overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
              ${tab === t.id
                ? t.id === "ajouter" ? "bg-emerald-600 text-white shadow-sm" : "bg-white shadow-sm text-gray-900"
                : "text-gray-500 hover:text-gray-700"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Prestataires", value: mockPrestataires.length, icon: <Users className="w-5 h-5" />, color: "text-blue-600" },
              { label: "Réservations", value: reservations.length, icon: <Calendar className="w-5 h-5" />, color: "text-emerald-600" },
              { label: "Volume traité", value: `${totalGains.toLocaleString("fr-FR")} FCFA`, icon: <TrendingUp className="w-5 h-5" />, color: "text-purple-600" },
              { label: "Commission (15%)", value: `${commission.toLocaleString("fr-FR")} FCFA`, icon: <Shield className="w-5 h-5" />, color: "text-orange-600" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                <div className={`${s.color} mb-3`}>{s.icon}</div>
                <div className="text-xl font-bold text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Confirmées", value: reservations.filter((r) => r.statut === "confirmee").length, color: "text-blue-600" },
              { label: "Terminées", value: reservations.filter((r) => r.statut === "terminee").length, color: "text-green-600" },
              { label: "Annulées", value: reservations.filter((r) => r.statut === "annulee").length, color: "text-red-600" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex items-center gap-4">
                <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-sm text-gray-500">Réservations<br />{s.label}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "prestataires" && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">{mockPrestataires.length} prestataires</h2>
            <button onClick={() => setTab("ajouter")}
              className="flex items-center gap-1.5 text-sm text-emerald-700 font-medium hover:underline">
              <Plus className="w-4 h-4" /> Nouveau
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 text-gray-600 font-semibold">Prestataire</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold hidden sm:table-cell">Ville</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold hidden md:table-cell">Note</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">Statut</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">Certifié</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold hidden lg:table-cell">Tarif/h</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {mockPrestataires.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {p.prenom[0]}{p.nom[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{p.prenom} {p.nom}</div>
                          <div className="text-xs text-gray-500">{p.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-700 hidden sm:table-cell">{p.ville}</td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-gray-900">{p.note}</span>
                        <span className="text-gray-500 text-xs">({p.nombreAvis})</span>
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${p.disponible ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {p.disponible ? "Disponible" : "Indisponible"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {p.certifie
                        ? <CheckCircle className="w-5 h-5 text-emerald-500" />
                        : <XCircle className="w-5 h-5 text-gray-300" />}
                    </td>
                    <td className="px-4 py-3.5 text-gray-700 font-medium hidden lg:table-cell">
                      {p.tarifHoraire.toLocaleString("fr-FR")} FCFA
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "reservations" && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {reservations.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <Clock className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">Aucune réservation pour le moment.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-5 py-3 text-gray-600 font-semibold">Référence</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">Service</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold hidden sm:table-cell">Date</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">Montant</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {reservations.map((r) => {
                    const colors: Record<string, string> = {
                      en_attente: "bg-yellow-100 text-yellow-700",
                      confirmee: "bg-blue-100 text-blue-700",
                      terminee: "bg-green-100 text-green-700",
                      annulee: "bg-red-100 text-red-700",
                      en_cours: "bg-purple-100 text-purple-700",
                    };
                    return (
                      <tr key={r.id} className="hover:bg-gray-50">
                        <td className="px-5 py-3.5 text-gray-400 font-mono text-xs">{r.id}</td>
                        <td className="px-4 py-3.5 font-semibold text-gray-900">{r.service}</td>
                        <td className="px-4 py-3.5 text-gray-600 hidden sm:table-cell">{r.date}</td>
                        <td className="px-4 py-3.5 font-bold text-emerald-700">{r.montant.toLocaleString("fr-FR")} FCFA</td>
                        <td className="px-4 py-3.5">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${colors[r.statut]}`}>
                            {r.statut.replace("_", " ")}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === "ajouter" && (
        <AjouterPrestataire onSuccess={(msg) => { showToast(msg); setTab("prestataires"); }} />
      )}
    </div>
  );
}

function AjouterPrestataire({ onSuccess }: { onSuccess: (msg: string) => void }) {
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [ville, setVille] = useState("Brazzaville");
  const [quartier, setQuartier] = useState("");
  const [bio, setBio] = useState("");
  const [tarif, setTarif] = useState(3000);
  const [experience, setExperience] = useState(1);
  const [certifie, setCertifie] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const quartiers =
    ville === "Brazzaville" ? quartiersBrazzaville
    : ville === "Kinshasa" ? quartiersKinshasa
    : quartiersPointeNoire;

  function toggleService(s: string) {
    setSelectedServices((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedServices.length === 0) { setError("Sélectionnez au moins un service."); return; }
    setLoading(true);
    setError("");

    // Create via secure API route (uses service role key server-side)
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch("/api/admin/create-prestataire", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
      },
      body: JSON.stringify({ email, password, nom, prenom, telephone, ville, quartier, bio, tarif, experience, certifie, services: selectedServices }),
    });
    const json = await res.json();

    if (!res.ok) {
      setError(json.error || "Erreur lors de la création.");
      setLoading(false);
      return;
    }

    onSuccess(`✓ Prestataire ${prenom} ${nom} créé avec succès !`);
    setLoading(false);
  }

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Ajouter un prestataire</h2>
        <p className="text-sm text-gray-500 mb-6">
          Seul l'admin peut créer des comptes prestataires. Un email de bienvenue sera envoyé automatiquement.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Identity */}
          <div>
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-3">Identité</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">Prénom</label>
                <input required value={prenom} onChange={(e) => setPrenom(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 text-sm"
                  placeholder="Prénom" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">Nom</label>
                <input required value={nom} onChange={(e) => setNom(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 text-sm"
                  placeholder="Nom de famille" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 text-sm"
                placeholder="prestataire@email.com" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">Téléphone</label>
              <input type="tel" required value={telephone} onChange={(e) => setTelephone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 text-sm"
                placeholder="+242 06 ..." />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">Ville</label>
              <select value={ville} onChange={(e) => { setVille(e.target.value); setQuartier(""); }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 text-sm bg-white">
                {villes.map((v) => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">Quartier</label>
              <select value={quartier} onChange={(e) => setQuartier(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 text-sm bg-white">
                <option value="">Choisir...</option>
                {quartiers.map((q) => <option key={q}>{q}</option>)}
              </select>
            </div>
          </div>

          {/* Professional info */}
          <div>
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-3">Profil professionnel</div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Biographie</label>
            <textarea required value={bio} onChange={(e) => setBio(e.target.value)} rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 text-sm resize-none"
              placeholder="Expérience, spécialités, points forts..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">Tarif horaire (FCFA / FC)</label>
              <input type="number" required min={1000} step={500} value={tarif} onChange={(e) => setTarif(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">Années d'expérience</label>
              <input type="number" required min={0} max={40} value={experience} onChange={(e) => setExperience(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 text-sm" />
            </div>
          </div>

          {/* Services */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Services proposés</label>
            <div className="flex flex-wrap gap-2">
              {services.map((s) => (
                <button key={s.id} type="button" onClick={() => toggleService(s.nom)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-colors
                    ${selectedServices.includes(s.nom)
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                      : "border-gray-200 text-gray-600 hover:border-emerald-300"}`}>
                  {s.icone} {s.nom}
                </button>
              ))}
            </div>
          </div>

          {/* Certification */}
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <input type="checkbox" id="certifie" checked={certifie} onChange={(e) => setCertifie(e.target.checked)}
              className="w-4 h-4 accent-emerald-600" />
            <label htmlFor="certifie" className="text-sm font-semibold text-gray-800 cursor-pointer">
              Marquer comme prestataire certifié PCV
            </label>
            <Shield className="w-4 h-4 text-emerald-600 ml-auto" />
          </div>

          {/* Password */}
          <div>
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-3">Accès compte</div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Mot de passe provisoire</label>
            <input type="text" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 text-sm font-mono"
              placeholder="Le prestataire devra le changer à la 1ère connexion" />
            <p className="text-xs text-gray-500 mt-1">Communiquez ce mot de passe au prestataire par téléphone ou SMS.</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-xl p-3 text-sm">
              <X className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors">
            {loading ? "Création en cours..." : "Créer le compte prestataire"}
          </button>
        </form>
      </div>
    </div>
  );
}
