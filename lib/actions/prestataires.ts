"use server";
import { supabase } from "@/lib/supabase";

export async function getPrestataires(filters?: {
  ville?: string;
  service?: string;
  disponible?: boolean;
  certifie?: boolean;
}) {
  let query = supabase
    .from("prestataires")
    .select(`
      *,
      profile:profiles(*),
      services:prestataire_services(service)
    `);

  if (filters?.ville) {
    query = query.eq("profile.ville", filters.ville);
  }
  if (filters?.disponible) {
    query = query.eq("disponible", true);
  }
  if (filters?.certifie) {
    query = query.eq("certifie", true);
  }

  const { data, error } = await query.order("note", { ascending: false });
  if (error) return { error: error.message };
  return { prestataires: data };
}

export async function getPrestataire(id: string) {
  const { data, error } = await supabase
    .from("prestataires")
    .select(`*, profile:profiles(*), services:prestataire_services(service)`)
    .eq("id", id)
    .single();

  if (error) return { error: error.message };
  return { prestataire: data };
}

export async function getAvisPrestataire(prestataire_id: string) {
  const { data, error } = await supabase
    .from("avis")
    .select(`*, client:client_id(nom, prenom)`)
    .eq("prestataire_id", prestataire_id)
    .order("created_at", { ascending: false });

  if (error) return { error: error.message };
  return { avis: data };
}

export async function updateDisponibilite(id: string, disponible: boolean) {
  const { error } = await supabase.from("prestataires").update({ disponible }).eq("id", id);
  if (error) return { error: error.message };
  return { ok: true };
}
