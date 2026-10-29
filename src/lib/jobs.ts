// Règles des emplois : tranches d'heures, profil candidat, offres reçues de l'agent.
// Tout ce qui vient du navigateur ou de l'agent est revérifié ici.

import { timingSafeEqual } from 'node:crypto';

// Heures (Kinshasa, UTC+1 toute l'année, pas d'heure d'été) auxquelles l'agent
// rédige les candidatures. À modifier ici ET dans l'horaire de la routine.
export const JOB_SLOTS_KINSHASA = [9, 12, 15, 18, 21] as const;
const KINSHASA_OFFSET_HOURS = 1;

/** Prochaine tranche strictement après `now` (renvoyée en UTC). */
export function nextJobSlot(now: Date = new Date()): Date {
  const local = new Date(now.getTime() + KINSHASA_OFFSET_HOURS * 3600_000);
  for (let dayShift = 0; dayShift < 2; dayShift++) {
    for (const hour of JOB_SLOTS_KINSHASA) {
      const candidate = new Date(
        Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate() + dayShift, hour)
      );
      if (candidate.getTime() > local.getTime()) {
        return new Date(candidate.getTime() - KINSHASA_OFFSET_HOURS * 3600_000);
      }
    }
  }
  throw new Error('Aucune tranche horaire');
}

export function slotsLabel(): string {
  const hours = JOB_SLOTS_KINSHASA.map((h) => `${h} h`);
  return hours.length > 1 ? `${hours.slice(0, -1).join(', ')} et ${hours[hours.length - 1]}` : hours.join('');
}

export const PROFILE_LIMITS = {
  fullName: 100,
  phone: 30,
  city: 80,
  headline: 120,
  summary: 800,
  experience: 3000,
  education: 1500,
  skills: 800,
  languages: 300
} as const;

export type ProfileInput = {
  fullName: string;
  phone: string | null;
  city: string | null;
  headline: string | null;
  summary: string | null;
  experience: string | null;
  education: string | null;
  skills: string | null;
  languages: string | null;
};

function str(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function parseProfileInput(
  body: unknown
): { ok: true; data: ProfileInput } | { ok: false; error: string } {
  const input = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;
  if (input.consent !== true) {
    return { ok: false, error: 'Vous devez accepter que votre profil soit utilisé pour rédiger vos candidatures.' };
  }
  const out: Record<string, string | null> = {};
  for (const [key, max] of Object.entries(PROFILE_LIMITS)) {
    const value = str(input[key]);
    if (value.length > max) return { ok: false, error: `Un champ dépasse ${max} caractères.` };
    out[key] = value || null;
  }
  if (!out.fullName) return { ok: false, error: 'Votre nom complet est obligatoire.' };
  if (!out.experience && !out.education && !out.skills) {
    return { ok: false, error: 'Renseignez au moins vos expériences, vos études ou vos compétences.' };
  }
  return { ok: true, data: out as unknown as ProfileInput };
}

export const JOB_LIMITS = {
  title: 150,
  employer: 120,
  location: 120,
  contractType: 60,
  description: 4000,
  requirements: 2000,
  sourceRef: 200,
  contact: 300
} as const;

export type IngestedOffer = {
  title: string;
  employer: string | null;
  location: string | null;
  contractType: string | null;
  description: string;
  requirements: string | null;
  wantsCv: boolean;
  wantsLetter: boolean;
  contactPhone: string | null;
  contactEmail: string | null;
  externalUrl: string | null;
  deadline: Date | null;
  source: 'NOTION' | 'DRIVE';
  sourceRef: string;
};

// Seuls http(s) : le lien est affiché tel quel, un « javascript: » y serait exécuté au clic.
function safeUrl(raw: string): string | null {
  try {
    const url = new URL(/^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`);
    return (url.protocol === 'http:' || url.protocol === 'https:') && url.hostname.includes('.')
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

export function parseIngestedOffer(body: unknown): { ok: true; data: IngestedOffer } | { ok: false; error: string } {
  const i = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;
  const title = str(i.title);
  const description = str(i.description);
  const sourceRef = str(i.sourceRef);
  const source = i.source === 'NOTION' || i.source === 'DRIVE' ? i.source : null;
  if (!title || !description || !sourceRef || !source) {
    return { ok: false, error: 'Titre, description, source et sourceRef sont obligatoires.' };
  }
  if (
    title.length > JOB_LIMITS.title ||
    description.length > JOB_LIMITS.description ||
    sourceRef.length > JOB_LIMITS.sourceRef
  ) {
    return { ok: false, error: 'Texte trop long.' };
  }
  const opt = (key: string, max: number) => {
    const v = str(i[key]);
    return v ? v.slice(0, max) : null;
  };
  const email = opt('contactEmail', 254);
  if (email && !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) {
    return { ok: false, error: 'Adresse e-mail invalide.' };
  }
  const urlRaw = opt('externalUrl', JOB_LIMITS.contact);
  const externalUrl = urlRaw ? safeUrl(urlRaw) : null;
  if (urlRaw && !externalUrl) return { ok: false, error: 'Lien invalide.' };
  const deadlineRaw = str(i.deadline);
  const deadline = deadlineRaw ? new Date(deadlineRaw) : null;
  if (deadline && Number.isNaN(deadline.getTime())) return { ok: false, error: 'Date limite invalide.' };

  return {
    ok: true,
    data: {
      title,
      employer: opt('employer', JOB_LIMITS.employer),
      location: opt('location', JOB_LIMITS.location),
      contractType: opt('contractType', JOB_LIMITS.contractType),
      description,
      requirements: opt('requirements', JOB_LIMITS.requirements),
      wantsCv: i.wantsCv !== false,
      wantsLetter: i.wantsLetter !== false,
      contactPhone: opt('contactPhone', 30),
      contactEmail: email,
      externalUrl,
      deadline,
      source,
      sourceRef
    }
  };
}

/**
 * Accès de l'agent planifié : jeton secret (JOBS_AGENT_SECRET) en en-tête
 * Authorization: Bearer. Comparaison en temps constant ; sans secret configuré,
 * tout est refusé.
 */
export function isJobsAgent(request: Request): boolean {
  const secret = process.env.JOBS_AGENT_SECRET;
  if (!secret || secret.length < 32) return false;
  const header = request.headers.get('authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const a = Buffer.from(token);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}
