// Règles de validation des offres publiées en libre-service (/services/proposer).
// Partagées par l'API : tout ce qui vient du navigateur est revérifié ici.

export const OFFER_CATEGORIES = [
  'Restauration',
  'Audiovisuel',
  'Commerce',
  'Formation',
  'Santé et bien-être',
  'Beauté et mode',
  'Bâtiment et artisanat',
  'Informatique',
  "Offre d'emploi",
  'Autre'
] as const;

export const OFFER_LIMITS = { name: 80, title: 100, description: 1000, url: 300 } as const;

// Au-delà, l'admin n'a plus qu'à trancher les offres déjà déposées.
export const MAX_PENDING_OFFERS_PER_ACCOUNT = 3;

export type OfferInput = {
  authorName: string;
  title: string;
  description: string;
  category: string;
  contactPhone: string | null;
  contactEmail: string | null;
  externalUrl: string | null;
};

function str(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

// Numéros saisis à la congolaise (0812345678, 812345678) ou avec indicatif
// (+243…, 00243…) : on stocke « +243… », la forme attendue par wa.me sur la
// page publique. Un numéro étranger avec indicatif reste tel quel.
function normalizePhone(raw: string): string | null {
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  else if (digits.length === 10 && digits.startsWith('0')) digits = `243${digits.slice(1)}`;
  else if (digits.length === 9) digits = `243${digits}`;
  return digits.length >= 9 && digits.length <= 15 ? `+${digits}` : null;
}

// Seuls http(s) sont acceptés : le lien est affiché tel quel sur la page
// publique, un « javascript: » y serait exécuté au clic.
function normalizeUrl(raw: string): string | null {
  const candidate = /^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(candidate);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    if (!url.hostname.includes('.')) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function parseOfferInput(
  body: unknown
): { ok: true; data: OfferInput } | { ok: false; error: string } {
  const input = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;

  const authorName = str(input.authorName);
  const title = str(input.title);
  const description = str(input.description);
  const category = str(input.category);

  if (!authorName || !title || !description || !category) {
    return { ok: false, error: 'Le nom, le titre, la description et la catégorie sont obligatoires.' };
  }
  if (authorName.length > OFFER_LIMITS.name) {
    return { ok: false, error: `Le nom ne peut pas dépasser ${OFFER_LIMITS.name} caractères.` };
  }
  if (title.length > OFFER_LIMITS.title) {
    return { ok: false, error: `Le titre ne peut pas dépasser ${OFFER_LIMITS.title} caractères.` };
  }
  if (description.length > OFFER_LIMITS.description) {
    return { ok: false, error: `La description ne peut pas dépasser ${OFFER_LIMITS.description} caractères.` };
  }
  if (!(OFFER_CATEGORIES as readonly string[]).includes(category)) {
    return { ok: false, error: 'Catégorie invalide.' };
  }

  const phoneRaw = str(input.contactPhone);
  let contactPhone: string | null = null;
  if (phoneRaw) {
    contactPhone = normalizePhone(phoneRaw);
    if (!contactPhone) return { ok: false, error: 'Numéro de téléphone invalide.' };
  }

  const emailRaw = str(input.contactEmail);
  let contactEmail: string | null = null;
  if (emailRaw) {
    if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(emailRaw) || emailRaw.length > 254) {
      return { ok: false, error: 'Adresse e-mail invalide.' };
    }
    contactEmail = emailRaw;
  }

  const urlRaw = str(input.externalUrl);
  let externalUrl: string | null = null;
  if (urlRaw) {
    if (urlRaw.length > OFFER_LIMITS.url) return { ok: false, error: 'Le lien est trop long.' };
    externalUrl = normalizeUrl(urlRaw);
    if (!externalUrl) return { ok: false, error: 'Le lien doit être une adresse web valide (https://…).' };
  }

  if (!contactPhone && !contactEmail && !externalUrl) {
    return {
      ok: false,
      error: 'Indiquez au moins un moyen de vous contacter : téléphone, e-mail ou lien.'
    };
  }

  return {
    ok: true,
    data: { authorName, title, description, category, contactPhone, contactEmail, externalUrl }
  };
}
