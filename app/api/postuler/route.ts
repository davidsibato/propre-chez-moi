import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";
import { getSupabaseAdmin } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_APPLICATION_EMAIL!;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();

    const prenom     = form.get("prenom") as string;
    const nom        = form.get("nom") as string;
    const email      = form.get("email") as string;
    const telephone  = form.get("telephone") as string;
    const ville      = form.get("ville") as string;
    const experience = form.get("experience") as string;
    const motivation = form.get("motivation") as string;
    const services   = form.getAll("services") as string[];
    const cvFile     = form.get("cv") as File | null;
    const idFile     = form.get("id_piece") as File | null;

    // Validate required fields
    if (!prenom || !nom || !email || !telephone || !ville || !motivation) {
      return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const timestamp = Date.now();
    const fileUrls: { cv?: string; id?: string } = {};

    // Upload files to Supabase Storage
    async function uploadFile(file: File, label: string): Promise<string | undefined> {
      const ext = file.name.split(".").pop() ?? "bin";
      const path = `applications/${timestamp}_${label}_${prenom}_${nom}.${ext}`;
      const bytes = await file.arrayBuffer();
      const { error } = await supabase.storage
        .from("pcv-applications")
        .upload(path, Buffer.from(bytes), { contentType: file.type, upsert: false });
      if (error) {
        console.error(`Storage upload error (${label}):`, error.message);
        return undefined;
      }
      const { data } = supabase.storage.from("pcv-applications").getPublicUrl(path);
      return data.publicUrl;
    }

    if (cvFile && cvFile.size > 0) fileUrls.cv = await uploadFile(cvFile, "cv");
    if (idFile && idFile.size > 0) fileUrls.id = await uploadFile(idFile, "id");

    // Insert application record into DB
    const { error: dbError } = await supabase
      .from("candidatures")
      .insert({
        prenom, nom, email, telephone, ville,
        experience: experience ? parseInt(experience) : null,
        motivation,
        services,
        cv_url: fileUrls.cv ?? null,
        id_url: fileUrls.id ?? null,
        statut: "en_attente",
      });
    if (dbError) {
      // Non-fatal: log but continue — email still goes out
      console.error("DB insert error:", dbError.message);
    }

    // Send email to admin (address is server-only, never exposed to client)
    const serviceList = services.length ? services.join(", ") : "—";
    const emailBody = `
<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px">
  <div style="background:#059669;padding:16px 24px;border-radius:12px 12px 0 0">
    <h1 style="color:#fff;margin:0;font-size:20px">Nouvelle candidature prestataire — PropreChezVous</h1>
  </div>
  <div style="background:#f9fafb;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:8px 0;color:#6b7280;width:140px">Nom complet</td><td style="padding:8px 0;font-weight:600;color:#111827">${prenom} ${nom}</td></tr>
      <tr><td style="padding:8px 0;color:#6b7280">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#059669">${email}</a></td></tr>
      <tr><td style="padding:8px 0;color:#6b7280">Téléphone</td><td style="padding:8px 0;color:#111827">${telephone}</td></tr>
      <tr><td style="padding:8px 0;color:#6b7280">Ville</td><td style="padding:8px 0;color:#111827">${ville}</td></tr>
      <tr><td style="padding:8px 0;color:#6b7280">Expérience</td><td style="padding:8px 0;color:#111827">${experience ? `${experience} an(s)` : "Non précisé"}</td></tr>
      <tr><td style="padding:8px 0;color:#6b7280">Services</td><td style="padding:8px 0;color:#111827">${serviceList}</td></tr>
    </table>
    <div style="margin-top:16px;padding:16px;background:#fff;border-radius:8px;border:1px solid #e5e7eb">
      <p style="margin:0 0 8px;font-weight:600;color:#111827">Motivation</p>
      <p style="margin:0;color:#374151;white-space:pre-wrap">${motivation}</p>
    </div>
    <div style="margin-top:16px;display:flex;gap:12px;flex-wrap:wrap">
      ${fileUrls.cv ? `<a href="${fileUrls.cv}" style="display:inline-block;background:#059669;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">📄 Télécharger le CV</a>` : "<span style='color:#9ca3af;font-size:14px'>CV non fourni</span>"}
      ${fileUrls.id ? `<a href="${fileUrls.id}" style="display:inline-block;background:#1d4ed8;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">🪪 Télécharger la pièce d'identité</a>` : "<span style='color:#9ca3af;font-size:14px'>Pièce d'identité non fournie</span>"}
    </div>
    <p style="margin-top:20px;font-size:12px;color:#9ca3af">Candidature reçue le ${new Date().toLocaleString("fr-FR", { timeZone: "Africa/Brazzaville" })} — PropreChezVous</p>
  </div>
</div>`;

    await resend.emails.send({
      from: `PropreChezVous <${FROM_EMAIL}>`,
      to: [ADMIN_EMAIL],
      replyTo: email,
      subject: `Candidature prestataire — ${prenom} ${nom} (${ville})`,
      html: emailBody,
    });

    // Send confirmation email to applicant
    await resend.emails.send({
      from: `PropreChezVous <${FROM_EMAIL}>`,
      to: [email],
      subject: "Candidature reçue — PropreChezVous",
      html: `
<div style="font-family:sans-serif;max-width:560px;margin:auto;padding:24px">
  <div style="background:#059669;padding:16px 24px;border-radius:12px 12px 0 0">
    <h1 style="color:#fff;margin:0;font-size:20px">Candidature reçue ✓</h1>
  </div>
  <div style="background:#f9fafb;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
    <p style="color:#111827">Bonjour <strong>${prenom}</strong>,</p>
    <p style="color:#374151">Nous avons bien reçu votre candidature pour rejoindre l'équipe PropreChezVous à <strong>${ville}</strong>.</p>
    <p style="color:#374151">Notre équipe examine chaque dossier avec soin. Vous recevrez une réponse dans les <strong>5 à 7 jours ouvrés</strong>.</p>
    <p style="color:#374151">Merci de votre intérêt,<br><strong>L'équipe PropreChezVous</strong></p>
  </div>
</div>`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Postuler API error:", err);
    return NextResponse.json({ error: "Erreur serveur. Veuillez réessayer." }, { status: 500 });
  }
}
