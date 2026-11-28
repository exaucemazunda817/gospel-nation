// « Je viens pour la première fois » : règles partagées par le formulaire public,
// l'API, la feuille d'accueil et l'admin. Sans dépendance serveur (utilisé aussi
// dans des composants client).
import { church } from '@/lib/content';
import { SITE_URL } from '@/lib/site';

// Les visiteurs sont invités aux trois cultes ouverts à tous : dimanche, mardi
// (Nation United) et mercredi (enseignement). L'intercession du vendredi n'est
// pas proposée. Les libellés et les heures viennent de `church.schedule` pour
// ne jamais diverger du reste du site.
const VISIT_SERVICE_LABELS: Record<number, { day: string; label: string }> = {
  0: { day: 'Dimanche', label: 'Culte du dimanche' },
  2: { day: 'Mardi', label: 'Nation United, culte de la jeunesse' },
  3: { day: 'Mercredi', label: "Culte d'enseignement" }
};

export type VisitService = { weekday: number; label: string; time: string; startHour: number; startMinute: number };

function buildServices(): Record<number, VisitService> {
  const out: Record<number, VisitService> = {};
  for (const [weekday, wanted] of Object.entries(VISIT_SERVICE_LABELS)) {
    const entry = church.schedule.find((s) => s.day === wanted.day && s.label === wanted.label);
    if (!entry) continue;
    const match = entry.time.match(/^(\d{1,2})h(\d{2})?/);
    if (!match) continue;
    out[Number(weekday)] = {
      weekday: Number(weekday),
      label: entry.label,
      // « 9h30 – 11h30 » devient « 9h30 » : on annonce l'heure d'arrivée.
      time: `${match[1]}h${match[2] ?? ''}`,
      startHour: Number(match[1]),
      startMinute: Number(match[2] ?? 0)
    };
  }
  return out;
}

const SERVICES = buildServices();

export function visitServiceFor(date: Date): VisitService | null {
  return SERVICES[date.getUTCDay()] ?? null;
}

// Jour d'aujourd'hui à Kinshasa (UTC+1 toute l'année), à minuit UTC : même
// convention que la date enregistrée d'une visite.
export function todayInKinshasa(now: Date = new Date()): Date {
  const wall = new Date(now.getTime() + 3600_000);
  return new Date(Date.UTC(wall.getUTCFullYear(), wall.getUTCMonth(), wall.getUTCDate()));
}

// « 2026-12-06 » → Date à minuit UTC ; null si le texte n'est pas une vraie date.
export function visitDateFromValue(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value ? null : date;
}

export const VISIT_HORIZON_DAYS = 60;

// Une visite se choisit sur un jour de culte ouvert à tous, d'aujourd'hui à 60 jours.
export function isAllowedVisitDate(date: Date, now: Date = new Date()): boolean {
  if (!visitServiceFor(date)) return false;
  const today = todayInKinshasa(now).getTime();
  const time = date.getTime();
  return time >= today && time <= today + VISIT_HORIZON_DAYS * 86400_000;
}

// Le premier du mois s'écrit « 1er » en français (« mardi 1er décembre »).
function formatWithOrdinal(date: Date, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('fr-FR', { ...options, timeZone: 'UTC' })
    .formatToParts(date)
    .map((part) => (part.type === 'day' && part.value === '1' ? '1er' : part.value))
    .join('');
}

// « dimanche 6 décembre », dans le fuseau UTC puisque la date est à minuit UTC.
export function formatVisitDay(date: Date): string {
  return formatWithOrdinal(date, { weekday: 'long', day: 'numeric', month: 'long' });
}

export function formatVisitDayWithYear(date: Date): string {
  return formatWithOrdinal(date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export type VisitDayOption = { value: string; label: string; weekday: number };

// Les prochains cultes ouverts à tous (4 semaines). Un culte déjà commencé
// aujourd'hui n'est plus proposé. À calculer dans le navigateur, jamais au rendu
// serveur : la page est préparée au déploiement et figerait des dates passées.
export function upcomingVisitDays(now: Date = new Date(), weeks = 4): VisitDayOption[] {
  const today = todayInKinshasa(now);
  const out: VisitDayOption[] = [];
  for (let add = 0; add < weeks * 7; add++) {
    const date = new Date(today.getTime() + add * 86400_000);
    const service = visitServiceFor(date);
    if (!service) continue;
    const start = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), service.startHour - 1, service.startMinute);
    if (start <= now.getTime()) continue;
    out.push({
      value: date.toISOString().slice(0, 10),
      weekday: service.weekday,
      label: `${formatVisitDay(date)} · ${service.label}, ${service.time}`
    });
  }
  return out;
}

// Instant précis du début du culte (pour « Ajouter à mon agenda »).
export function visitStartInstant(date: Date): Date | null {
  const service = visitServiceFor(date);
  if (!service) return null;
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), service.startHour - 1, service.startMinute));
}

export const SOURCE_OPTIONS = [
  { value: 'invitation', label: "Un membre m'a invité" },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'youtube', label: 'YouTube ou le direct' },
  { value: 'qr', label: 'Une affiche ou un QR code' },
  { value: 'passage', label: "En passant devant l'église" },
  { value: 'autre', label: 'Autre' }
] as const;

export type VisitSource = (typeof SOURCE_OPTIONS)[number]['value'];

export function isVisitSource(value: unknown): value is VisitSource {
  return typeof value === 'string' && SOURCE_OPTIONS.some((o) => o.value === value);
}

export function sourceLabel(value: string | null | undefined): string {
  return SOURCE_OPTIONS.find((o) => o.value === value)?.label ?? 'Non précisé';
}

export const VISIT_STATUS_LABELS: Record<string, string> = {
  EXPECTED: 'Attendu',
  ARRIVED: 'Venu',
  NO_SHOW: 'Pas venu',
  FOLLOWED_UP: 'Suivi fait',
  MEMBER: 'Devenu membre'
};

// Visiteur lui-même + accompagnants.
export function totalPeople(visit: { companions: number }): number {
  return 1 + visit.companions;
}

// « 3 personnes, dont 1 enfant »
export function peopleLabel(visit: { companions: number; childrenCount: number }): string {
  const total = totalPeople(visit);
  const base = `${total} personne${total > 1 ? 's' : ''}`;
  return visit.childrenCount > 0 ? `${base}, dont ${visit.childrenCount} enfant${visit.childrenCount > 1 ? 's' : ''}` : base;
}

type VisitLike = {
  firstName: string;
  lastName: string;
  companions: number;
  childrenCount: number;
};

// Résumé à poster dans le groupe WhatsApp de l'accueil : prénoms, noms et nombres
// seulement. Jamais de téléphone, d'e-mail ni de demande de prière.
export function teamSummaryMessage(date: Date, visits: VisitLike[]): string {
  if (visits.length === 0) return `Aucune visite annoncée pour le ${formatVisitDay(date)}.`;
  const people = visits.reduce((n, v) => n + totalPeople(v), 0);
  const children = visits.reduce((n, v) => n + v.childrenCount, 0);
  const lines = visits.map((v) => {
    const extra = v.companions > 0 ? ` (+${v.companions}${v.childrenCount > 0 ? `, dont ${v.childrenCount} enfant${v.childrenCount > 1 ? 's' : ''}` : ''})` : '';
    return `• ${v.firstName} ${v.lastName}${extra}`;
  });
  return [
    `Nouveaux visiteurs attendus le ${formatVisitDay(date)} :`,
    '',
    ...lines,
    '',
    `Total : ${visits.length} visite${visits.length > 1 ? 's' : ''}, ${people} personne${people > 1 ? 's' : ''}${children > 0 ? `, dont ${children} enfant${children > 1 ? 's' : ''}` : ''}.`
  ].join('\n');
}

// Message de bienvenue (avant la visite) et mot de remerciement (après). Ce sont
// des modèles : WhatsApp s'ouvre avec le texte déjà écrit, l'équipe le relit et
// peut le modifier avant d'envoyer.
export function welcomeMessage(visit: { firstName: string; visitDate: Date }): string {
  const service = visitServiceFor(visit.visitDate);
  const when = `${formatVisitDay(visit.visitDate)}${service ? ` à ${service.time}` : ''}`;
  return [
    `Bonjour ${visit.firstName}, c'est l'équipe d'accueil de ${church.name}.`,
    `Nous avons bien reçu l'annonce de votre venue ${when} : nous serons heureux de vous accueillir !`,
    `Nous sommes à ${church.address}.`,
    'À très bientôt.'
  ].join('\n');
}

export function thanksMessage(visit: { firstName: string; visitDate: Date }): string {
  return [
    `Bonjour ${visit.firstName}, c'est l'équipe d'accueil de ${church.name}.`,
    `Merci de votre visite du ${formatVisitDay(visit.visitDate)} : ce fut une joie de vous accueillir.`,
    `Si vous souhaitez prier ou parler avec le pasteur, vous pouvez prendre rendez-vous : ${SITE_URL}/rendez-vous`,
    `Et pour rejoindre la famille, c'est ici : ${SITE_URL}/inscription`,
    'Bonne semaine à vous !'
  ].join('\n');
}

// Lien WhatsApp : avec un numéro il ouvre la conversation, sans numéro WhatsApp
// laisse choisir le contact ou le groupe.
export function whatsappUrl(phone: string | null, text: string): string {
  const digits = phone ? phone.replace(/\D/g, '') : '';
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

// Fichier d'agenda (.ics) pour l'iPhone et Outlook : le culte choisi, 2 h.
export function buildVisitIcs(date: Date): string | null {
  const start = visitStartInstant(date);
  const service = visitServiceFor(date);
  if (!start || !service) return null;
  const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const end = new Date(start.getTime() + 2 * 3600_000);
  const escape = (v: string) => v.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,');
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Gospel Nation//Visite//FR',
    'BEGIN:VEVENT',
    `UID:visite-${stamp(start)}@gospel-nation`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${escape(`${church.name} : ${service.label}`)}`,
    `LOCATION:${escape(`${church.address}, ${church.city}`)}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}
