export interface LatLng { lat: number; lng: number }

// Haversine distance in km
export function distanceKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
    Math.cos((b.lat * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(h));
}

// Approximate coordinates per quartier
export const QUARTIER_COORDS: Record<string, LatLng> = {
  // Brazzaville
  Bacongo:      { lat: -4.2900, lng: 15.2500 },
  Makélékélé:   { lat: -4.3100, lng: 15.2300 },
  Moungali:     { lat: -4.2500, lng: 15.2700 },
  Ouenzé:       { lat: -4.2300, lng: 15.2800 },
  Talangaï:     { lat: -4.2100, lng: 15.2900 },
  Mfilou:       { lat: -4.3300, lng: 15.2200 },
  Djiri:        { lat: -4.1800, lng: 15.3100 },
  Madibou:      { lat: -4.3500, lng: 15.2100 },
  "Poto-Poto":  { lat: -4.2600, lng: 15.2650 },
  Plateau:      { lat: -4.2634, lng: 15.2429 },
  // Kinshasa
  Gombe:        { lat: -4.3100, lng: 15.3200 },
  Limete:       { lat: -4.3400, lng: 15.3600 },
  Ngaliema:     { lat: -4.3700, lng: 15.2800 },
  Kalamu:       { lat: -4.3500, lng: 15.3300 },
  Lemba:        { lat: -4.3900, lng: 15.3700 },
  Ndjili:       { lat: -4.4100, lng: 15.4100 },
  Masina:       { lat: -4.3800, lng: 15.4500 },
  Kimbanseke:   { lat: -4.4300, lng: 15.4800 },
  Bandalungwa:  { lat: -4.3300, lng: 15.3100 },
  Kintambo:     { lat: -4.3200, lng: 15.2900 },
  // Pointe-Noire
  Loandjili:    { lat: -4.7500, lng: 11.8600 },
  "Tié-Tié":   { lat: -4.7700, lng: 11.8500 },
  Ngoyo:        { lat: -4.8000, lng: 11.8400 },
  "Mvou-Mvou": { lat: -4.7900, lng: 11.8700 },
  "Centre-ville": { lat: -4.7727, lng: 11.8635 },
};

export function getCoords(quartier: string): LatLng | null {
  return QUARTIER_COORDS[quartier] ?? null;
}
