export type UserRole = "client" | "prestataire" | "admin";

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: UserRole;
  avatar?: string;
  adresse?: string;
  quartier?: string;
  ville: string;
  createdAt: string;
}

export interface Prestataire extends User {
  role: "prestataire";
  bio: string;
  services: string[];
  tarifHoraire: number;
  note: number;
  nombreAvis: number;
  disponible: boolean;
  photo: string;
  experience: number;
  certifie: boolean;
}

export type StatutReservation =
  | "en_attente"
  | "confirmee"
  | "en_cours"
  | "terminee"
  | "annulee";

export type StatutPaiement = "en_attente" | "paye" | "rembourse";

export interface Reservation {
  id: string;
  clientId: string;
  prestataireId: string;
  service: string;
  date: string;
  heureDebut: string;
  duree: number;
  adresse: string;
  quartier: string;
  ville: string;
  instructions?: string;
  montant: number;
  statut: StatutReservation;
  paiement: {
    statut: StatutPaiement;
    methode: "airtel_money" | "orange_money" | "cash";
    numeroCarte?: string;
    transactionId?: string;
  };
  createdAt: string;
}

export interface Avis {
  id: string;
  reservationId: string;
  clientId: string;
  prestataireId: string;
  note: number;
  commentaire: string;
  createdAt: string;
}
