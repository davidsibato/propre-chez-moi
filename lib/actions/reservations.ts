"use server";
import { supabase } from "@/lib/supabase";

export async function creerReservation(data: {
  client_id: string;
  prestataire_id: string;
  service: string;
  date: string;
  heure_debut: string;
  duree: number;
  adresse: string;
  quartier: string;
  ville: string;
  instructions?: string;
  montant: number;
  paiement_methode: "airtel_money" | "orange_money";
  paiement_numero: string;
}) {
  const transaction_id = `${data.paiement_methode === "airtel_money" ? "AM" : "OM"}-${Date.now()}`;

  const { data: reservation, error } = await supabase
    .from("reservations")
    .insert({
      ...data,
      statut: "confirmee",
      paiement_statut: "paye",
      transaction_id,
    })
    .select()
    .single();

  if (error) return { error: error.message };
  return { reservation };
}

export async function getReservationsClient(client_id: string) {
  const { data, error } = await supabase
    .from("reservations")
    .select(`*, prestataire:prestataire_id(*, profile:profiles(*))`)
    .eq("client_id", client_id)
    .order("created_at", { ascending: false });

  if (error) return { error: error.message };
  return { reservations: data };
}

export async function getReservationsPrestataire(prestataire_id: string) {
  const { data, error } = await supabase
    .from("reservations")
    .select(`*, client:client_id(*)`)
    .eq("prestataire_id", prestataire_id)
    .order("created_at", { ascending: false });

  if (error) return { error: error.message };
  return { reservations: data };
}

export async function getAllReservations() {
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { error: error.message };
  return { reservations: data };
}

export async function updateStatutReservation(
  id: string,
  statut: "confirmee" | "en_cours" | "terminee" | "annulee"
) {
  const { error } = await supabase.from("reservations").update({ statut }).eq("id", id);
  if (error) return { error: error.message };
  return { ok: true };
}
