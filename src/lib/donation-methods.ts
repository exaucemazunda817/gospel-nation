// Validation commune des moyens de don saisis dans l'admin. Un moyen ne peut
// pas être activé tant qu'il contient un texte provisoire « [À COMPLÉTER] » :
// le public ne doit jamais voir un faux numéro.
export const LIMITS = { label: 60, accountName: 100, accountValue: 100, instructions: 500 } as const;

export type DonationMethodInput = {
  label: string;
  accountName: string;
  accountValue: string;
  instructions: string | null;
  isActive: boolean;
};

const isPlaceholder = (text: string) => /\[\s*À COMPLÉTER/i.test(text);

export function parseDonationMethod(raw: unknown): { ok: true; data: DonationMethodInput } | { ok: false; error: string } {
  if (!raw || typeof raw !== 'object') return { ok: false, error: 'Requête invalide.' };
  const r = raw as Record<string, unknown>;
  const text = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  const label = text(r.label);
  const accountName = text(r.accountName);
  const accountValue = text(r.accountValue);
  const instructions = text(r.instructions);
  const isActive = r.isActive === true;

  if (!label || !accountName || !accountValue) return { ok: false, error: 'Le nom, le titulaire et le numéro sont obligatoires.' };
  if (label.length > LIMITS.label) return { ok: false, error: `Nom trop long (${LIMITS.label} caractères au plus).` };
  if (accountName.length > LIMITS.accountName) return { ok: false, error: `Titulaire trop long (${LIMITS.accountName} caractères au plus).` };
  if (accountValue.length > LIMITS.accountValue) return { ok: false, error: `Numéro trop long (${LIMITS.accountValue} caractères au plus).` };
  if (instructions.length > LIMITS.instructions) return { ok: false, error: `Instructions trop longues (${LIMITS.instructions} caractères au plus).` };
  if (isActive && [label, accountName, accountValue, instructions].some(isPlaceholder)) {
    return { ok: false, error: 'Remplacez le texte « À COMPLÉTER » par les vraies coordonnées avant d’activer ce moyen.' };
  }
  return { ok: true, data: { label, accountName, accountValue, instructions: instructions || null, isActive } };
}
