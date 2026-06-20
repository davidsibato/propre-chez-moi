"use server";
import { supabase } from "@/lib/supabase";

export async function inscrire(data: {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  telephone: string;
  role: "client" | "prestataire";
  ville: string;
  quartier: string;
}) {
  const { data: auth, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });
  if (authError || !auth.user) return { error: authError?.message || "Erreur inscription" };

  const { error: profileError } = await supabase.from("profiles").insert({
    id: auth.user.id,
    nom: data.nom,
    prenom: data.prenom,
    telephone: data.telephone,
    role: data.role,
    ville: data.ville,
    quartier: data.quartier,
  });
  if (profileError) return { error: profileError.message };

  if (data.role === "prestataire") {
    await supabase.from("prestataires").insert({ id: auth.user.id });
  }

  return { user: auth.user };
}

export async function connecter(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  return { user: data.user, profile };
}

export async function deconnecter() {
  await supabase.auth.signOut();
}
