"use client";
import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prestataires, avis } from "@/lib/data";
import { formatWithUSD } from "@/lib/currency";
import { Star, Shield, MapPin, Phone, Clock, ChevronLeft, CheckCircle } from "lucide-react";

export default function PrestatairePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const p = prestataires.find((x) => x.id === id);
  if (!p) notFound();

  const prestataireAvis = avis.filter((a) => a.prestataireId === id);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/prestataires" className="flex items-center gap-1 text-sm text-gray-500 hover:text-emerald-600 mb-6">
        <ChevronLeft className="w-4 h-4" /> Retour aux prestataires
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl font-bold flex-shrink-0">
                {p.prenom[0]}{p.nom[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold text-gray-900">{p.prenom} {p.nom}</h1>
                  {p.certifie && (
                    <span className="flex items-center gap-1 text-sm text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                      <Shield className="w-4 h-4" /> Prestataire certifié
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-2">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className={`w-5 h-5 ${i <= Math.round(p.note) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`} />
                  ))}
                  <span className="text-gray-700 font-medium ml-1">{p.note}</span>
                  <span className="text-gray-500 text-sm">({p.nombreAvis} avis)</span>
                </div>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 flex-wrap">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{p.quartier}, {p.ville}</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{p.experience} ans d'expérience</span>
                  <span className={`flex items-center gap-1 font-medium ${p.disponible ? "text-green-600" : "text-gray-500"}`}>
                    <span className={`w-2 h-2 rounded-full ${p.disponible ? "bg-green-500" : "bg-gray-300"}`} />
                    {p.disponible ? "Disponible" : "Indisponible"}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-5 pt-5 border-t border-gray-100">
              <h2 className="font-semibold text-gray-900 mb-2">À propos</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{p.bio}</p>
            </div>
          </div>

          {/* Services */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">Services proposés</h2>
            <div className="space-y-2">
              {p.services.map((s) => (
                <div key={s} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">Avis clients ({p.nombreAvis})</h2>
            {prestataireAvis.length > 0 ? (
              <div className="space-y-4">
                {prestataireAvis.map((a) => (
                  <div key={a.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold">C</div>
                      <div>
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map((i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i <= a.note ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`} />
                          ))}
                        </div>
                        <div className="text-xs text-gray-500">{a.createdAt}</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{a.commentaire}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Les avis s'affichent après les premières réservations.</p>
            )}
          </div>
        </div>

        {/* Sidebar booking card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24">
            <div className="text-center mb-5">
              {(() => { const { main, usd } = formatWithUSD(p.tarifHoraire, p.ville); return (<>
                <div className="text-3xl font-bold text-emerald-700">{main}</div>
                <div className="text-gray-500 text-sm">par heure <span className="text-xs">({usd})</span></div>
              </>); })()}
            </div>
            <div className="space-y-3 mb-5 text-sm text-gray-600">
              <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Annulation gratuite 24h avant</div>
              <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Paiement Mobile Money</div>
              <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Satisfaction garantie</div>
            </div>
            {p.disponible ? (
              <Link
                href={`/reserver/${p.id}`}
                className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl text-center transition-colors"
              >
                Réserver maintenant
              </Link>
            ) : (
              <button disabled className="block w-full bg-gray-200 text-gray-500 font-semibold py-3 rounded-xl text-center cursor-not-allowed">
                Indisponible
              </button>
            )}
            <a
              href={`tel:${p.telephone}`}
              className="flex items-center justify-center gap-2 mt-3 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              <Phone className="w-4 h-4" /> Appeler {p.prenom}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
