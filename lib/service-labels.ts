import { Lang } from "./translations";
import { services } from "./data";

/** Returns the display label for a service id or French nom, in the given language */
export function getServiceLabel(idOrNom: string, lang: Lang): string {
  const svc = services.find((s) => s.id === idOrNom || s.nom === idOrNom);
  if (!svc) return idOrNom;
  return svc.labels[lang] ?? svc.nom;
}

/** Returns the description for a service, in the given language */
export function getServiceDesc(idOrNom: string, lang: Lang): string {
  const svc = services.find((s) => s.id === idOrNom || s.nom === idOrNom);
  if (!svc) return "";
  return svc.descriptions[lang] ?? svc.descriptions.fr;
}
