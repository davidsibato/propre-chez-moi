"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import { services, villes } from "@/lib/data";
import { Upload, CheckCircle, Loader2, X, FileText, CreditCard } from "lucide-react";

const MAX_FILE_MB = 5;
const ACCEPT_DOC = ".pdf,.doc,.docx";
const ACCEPT_ID  = ".pdf,.jpg,.jpeg,.png,.webp";

function FilePicker({ label, accept, hint, file, onChange, onClear }: {
  label: string; accept: string; hint: string;
  file: File | null; onChange: (f: File) => void; onClear: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-1">{label}</p>
      {file ? (
        <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
          <FileText className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="text-sm text-emerald-800 truncate flex-1">{file.name}</span>
          <span className="text-xs text-emerald-600">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
          <button type="button" onClick={onClear} className="text-emerald-500 hover:text-red-500 flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="w-full border-2 border-dashed border-gray-200 hover:border-emerald-400 rounded-xl p-5 text-center transition-colors group"
        >
          <Upload className="w-6 h-6 text-gray-400 group-hover:text-emerald-500 mx-auto mb-2" />
          <p className="text-sm text-gray-500 group-hover:text-emerald-700">{hint}</p>
          <p className="text-xs text-gray-400 mt-1">Max {MAX_FILE_MB} MB</p>
        </button>
      )}
      <input ref={ref} type="file" accept={accept} className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onChange(f); e.target.value = ""; }} />
    </div>
  );
}

export default function PostulerPage() {
  const { lang } = useI18n();
  const router = useRouter();

  const [form, setForm] = useState({
    prenom: "", nom: "", email: "", telephone: "",
    ville: "", experience: "", motivation: "",
    services: [] as string[],
  });
  const [cvFile,   setCvFile]   = useState<File | null>(null);
  const [idFile,   setIdFile]   = useState<File | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState(false);

  const text = {
    fr: {
      title: "Rejoindre l'équipe PropreChezVous",
      sub: "Postulez pour devenir prestataire certifié PCV. Notre équipe examine chaque candidature et vous contacte sous 5 à 7 jours ouvrés.",
      prenom: "Prénom *", nom: "Nom *", email: "Email *", tel: "Téléphone *",
      ville: "Ville *", exp: "Années d'expérience", mot: "Lettre de motivation *",
      motPh: "Décrivez votre expérience, pourquoi vous souhaitez rejoindre PCV, vos points forts... (min. 100 caractères)",
      svc: "Services que vous proposez *",
      cvLbl: "CV / Curriculum Vitae *", cvHint: "Cliquez pour déposer votre CV (PDF, Word)",
      idLbl: "Pièce d'identité *", idHint: "Carte nationale, passeport ou permis de conduire (PDF, image)",
      submit: "Envoyer ma candidature",
      submitting: "Envoi en cours...",
      successTitle: "Candidature envoyée !",
      successMsg: "Merci pour votre intérêt. Vous allez recevoir un email de confirmation. Notre équipe vous répondra dans les 5 à 7 jours ouvrés.",
      backHome: "Retour à l'accueil",
      notice: "Vos documents sont transmis de façon sécurisée et ne sont accessibles qu'à l'équipe PCV.",
    },
    en: {
      title: "Join the PropreChezVous team",
      sub: "Apply to become a PCV certified cleaner. Our team reviews each application and contacts you within 5–7 business days.",
      prenom: "First name *", nom: "Last name *", email: "Email *", tel: "Phone *",
      ville: "City *", exp: "Years of experience", mot: "Cover letter *",
      motPh: "Describe your experience, why you want to join PCV, your strengths... (min. 100 characters)",
      svc: "Services you offer *",
      cvLbl: "CV / Resume *", cvHint: "Click to upload your CV (PDF, Word)",
      idLbl: "Photo ID *", idHint: "National ID, passport or driver's licence (PDF, image)",
      submit: "Submit my application",
      submitting: "Submitting...",
      successTitle: "Application submitted!",
      successMsg: "Thank you for your interest. You will receive a confirmation email. Our team will get back to you within 5–7 business days.",
      backHome: "Back to home",
      notice: "Your documents are transmitted securely and are only accessible to the PCV team.",
    },
    es: {
      title: "Únete al equipo de PropreChezVous",
      sub: "Solicita convertirte en limpiador certificado PCV. Nuestro equipo revisa cada solicitud y te contacta en 5 a 7 días hábiles.",
      prenom: "Nombre *", nom: "Apellido *", email: "Correo *", tel: "Teléfono *",
      ville: "Ciudad *", exp: "Años de experiencia", mot: "Carta de presentación *",
      motPh: "Describe tu experiencia, por qué quieres unirte a PCV, tus puntos fuertes... (mín. 100 caracteres)",
      svc: "Servicios que ofreces *",
      cvLbl: "CV / Currículum *", cvHint: "Haz clic para subir tu CV (PDF, Word)",
      idLbl: "Documento de identidad *", idHint: "DNI, pasaporte o licencia de conducir (PDF, imagen)",
      submit: "Enviar mi solicitud",
      submitting: "Enviando...",
      successTitle: "¡Solicitud enviada!",
      successMsg: "Gracias por tu interés. Recibirás un correo de confirmación. Nuestro equipo te responderá en 5 a 7 días hábiles.",
      backHome: "Volver al inicio",
      notice: "Tus documentos se transmiten de forma segura y solo son accesibles al equipo PCV.",
    },
  }[lang];

  function toggleService(s: string) {
    setForm((f) => ({
      ...f,
      services: f.services.includes(s)
        ? f.services.filter((x) => x !== s)
        : [...f.services, s],
    }));
  }

  function validateFile(file: File, label: string): string | null {
    if (file.size > MAX_FILE_MB * 1024 * 1024) return `${label} trop volumineux (max ${MAX_FILE_MB} MB).`;
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.motivation.trim().length < 100) {
      setError(lang === "fr" ? "La lettre de motivation doit faire au moins 100 caractères."
        : lang === "en" ? "Cover letter must be at least 100 characters."
        : "La carta de presentación debe tener al menos 100 caracteres.");
      return;
    }
    if (form.services.length === 0) {
      setError(lang === "fr" ? "Sélectionnez au moins un service."
        : lang === "en" ? "Select at least one service."
        : "Selecciona al menos un servicio.");
      return;
    }
    if (!cvFile) {
      setError(lang === "fr" ? "Veuillez joindre votre CV."
        : lang === "en" ? "Please attach your CV."
        : "Por favor adjunta tu CV.");
      return;
    }
    if (!idFile) {
      setError(lang === "fr" ? "Veuillez joindre une pièce d'identité."
        : lang === "en" ? "Please attach a photo ID."
        : "Por favor adjunta un documento de identidad.");
      return;
    }

    const cvErr = validateFile(cvFile, "CV");
    const idErr = validateFile(idFile, lang === "fr" ? "Pièce d'identité" : "ID");
    if (cvErr || idErr) { setError(cvErr ?? idErr!); return; }

    setLoading(true);
    const body = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (Array.isArray(v)) v.forEach((x) => body.append(k, x));
      else body.append(k, v);
    });
    body.append("cv", cvFile);
    body.append("id_piece", idFile);

    try {
      const res = await fetch("/api/postuler", { method: "POST", body });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erreur serveur");
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{text.successTitle}</h1>
          <p className="text-gray-600 mb-8">{text.successMsg}</p>
          <button onClick={() => router.push("/")}
            className="bg-emerald-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-emerald-700 transition-colors">
            {text.backHome}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">PCV Careers</span>
        <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-3">{text.title}</h1>
        <p className="text-gray-600">{text.sub}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identity */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <span className="w-6 h-6 bg-emerald-600 text-white text-xs font-bold rounded-full flex items-center justify-center">1</span>
            {lang === "fr" ? "Informations personnelles" : lang === "en" ? "Personal information" : "Información personal"}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">{text.prenom}</label>
              <input required value={form.prenom} onChange={(e) => setForm({...form, prenom: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">{text.nom}</label>
              <input required value={form.nom} onChange={(e) => setForm({...form, nom: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">{text.email}</label>
            <input required type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">{text.tel}</label>
              <input required type="tel" value={form.telephone} onChange={(e) => setForm({...form, telephone: e.target.value})}
                placeholder="+242 06 ..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">{text.ville}</label>
              <select required value={form.ville} onChange={(e) => setForm({...form, ville: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white">
                <option value="">—</option>
                {villes.map((v) => <option key={v}>{v}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">{text.exp}</label>
            <select value={form.experience} onChange={(e) => setForm({...form, experience: e.target.value})}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white">
              <option value="">—</option>
              {["0","1","2","3","4","5","6","7","8","9","10"].map((n) => (
                <option key={n} value={n}>{n === "10" ? "10+" : n} {lang === "fr" ? "an(s)" : lang === "en" ? "year(s)" : "año(s)"}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Services */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <span className="w-6 h-6 bg-emerald-600 text-white text-xs font-bold rounded-full flex items-center justify-center">2</span>
            {text.svc}
          </h2>
          <div className="flex flex-wrap gap-2">
            {services.map((s) => (
              <button key={s.id} type="button" onClick={() => toggleService(s.nom)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  form.services.includes(s.nom)
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-gray-700 border-gray-200 hover:border-emerald-400"
                }`}>
                {s.icone} {s.nom}
              </button>
            ))}
          </div>
        </div>

        {/* Motivation */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <span className="w-6 h-6 bg-emerald-600 text-white text-xs font-bold rounded-full flex items-center justify-center">3</span>
            {text.mot}
          </h2>
          <textarea required rows={6} value={form.motivation} onChange={(e) => setForm({...form, motivation: e.target.value})}
            placeholder={text.motPh}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none" />
          <p className={`text-xs ${form.motivation.length >= 100 ? "text-emerald-600" : "text-gray-400"}`}>
            {form.motivation.length} / 100 {lang === "fr" ? "caractères min." : lang === "en" ? "characters min." : "caracteres mín."}
          </p>
        </div>

        {/* Documents */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <span className="w-6 h-6 bg-emerald-600 text-white text-xs font-bold rounded-full flex items-center justify-center">4</span>
            {lang === "fr" ? "Documents requis" : lang === "en" ? "Required documents" : "Documentos requeridos"}
          </h2>
          <FilePicker
            label={text.cvLbl} accept={ACCEPT_DOC} hint={text.cvHint}
            file={cvFile} onChange={setCvFile} onClear={() => setCvFile(null)} />
          <FilePicker
            label={text.idLbl} accept={ACCEPT_ID} hint={text.idHint}
            file={idFile} onChange={setIdFile} onClear={() => setIdFile(null)} />
          <div className="flex items-start gap-2 bg-blue-50 rounded-xl p-3">
            <CreditCard className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">{text.notice}</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading}
          className="w-full bg-emerald-600 text-white font-semibold py-3.5 rounded-xl hover:bg-emerald-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2 text-base">
          {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> {text.submitting}</> : text.submit}
        </button>
      </form>
    </div>
  );
}
