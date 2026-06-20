import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const supabase = getSupabaseAdmin();

  // Verify caller is admin
  const authHeader = req.headers.get("authorization");
  if (authHeader) {
    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const body = await req.json();
  const { email, password, nom, prenom, telephone, ville, quartier, bio, tarif, experience, certifie, services } = body;

  // 1. Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (authError || !authData.user) {
    return NextResponse.json({ error: authError?.message || "Erreur auth" }, { status: 400 });
  }

  const userId = authData.user.id;

  // 2. Insert profile
  const { error: profileError } = await supabase.from("profiles").insert({
    id: userId, nom, prenom, telephone,
    role: "prestataire",
    ville, quartier,
  });
  if (profileError) {
    await supabase.auth.admin.deleteUser(userId);
    return NextResponse.json({ error: profileError.message }, { status: 400 });
  }

  // 3. Insert prestataire
  const { error: prestError } = await supabase.from("prestataires").insert({
    id: userId,
    bio,
    tarif_horaire: tarif,
    experience,
    certifie,
    disponible: true,
  });
  if (prestError) {
    return NextResponse.json({ error: prestError.message }, { status: 400 });
  }

  // 4. Insert services
  if (services?.length) {
    await supabase.from("prestataire_services").insert(
      services.map((s: string) => ({ prestataire_id: userId, service: s }))
    );
  }

  return NextResponse.json({ ok: true, userId });
}
