// Currency rules:
// Congo-Brazzaville (Brazzaville, Pointe-Noire) → XAF / FCFA
// DRC (Kinshasa, Lubumbashi) → CDF / FC
// USD estimates shown for both

const FCFA_VILLES = ["Brazzaville", "Pointe-Noire"];

export type Currency = "FCFA" | "FC";

export function getCurrency(ville: string): Currency {
  return FCFA_VILLES.includes(ville) ? "FCFA" : "FC";
}

// Approximate exchange rates (update periodically)
const USD_RATE: Record<Currency, number> = {
  FCFA: 655,   // 1 USD ≈ 655 FCFA (XAF)
  FC: 2800,    // 1 USD ≈ 2800 FC (CDF)
};

export function toUSD(amount: number, currency: Currency): string {
  const usd = amount / USD_RATE[currency];
  return usd < 1
    ? `< $1`
    : `≈ $${Math.round(usd)}`;
}

export function formatAmount(amount: number, ville: string): string {
  const currency = getCurrency(ville);
  return `${amount.toLocaleString("fr-FR")} ${currency}`;
}

export function formatWithUSD(amount: number, ville: string): { main: string; usd: string } {
  const currency = getCurrency(ville);
  return {
    main: `${amount.toLocaleString("fr-FR")} ${currency}`,
    usd: toUSD(amount, currency),
  };
}

// Convert tarif between currencies for display (rough cross-border estimate)
export function convertTarif(amount: number, fromVille: string, toVille: string): number {
  const from = getCurrency(fromVille);
  const to = getCurrency(toVille);
  if (from === to) return amount;
  // convert via USD
  const inUSD = amount / USD_RATE[from];
  return Math.round(inUSD * USD_RATE[to]);
}
