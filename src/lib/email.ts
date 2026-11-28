import { church } from '@/lib/content';
import { formatTimeFr } from '@/lib/appointments';
import { formatVisitDay, formatVisitDayWithYear, peopleLabel, totalPeople, visitServiceFor } from '@/lib/visits';

// Envoi d'e-mails via Resend (https://resend.com), par simple appel HTTP : pas
// de dépendance à ajouter. Tant que RESEND_API_KEY et EMAIL_FROM ne sont pas
// définis, rien n'est envoyé et l'appelant en est informé (le site continue de
// fonctionner normalement, l'admin voit simplement qu'aucun e-mail n'est parti).
//
// EMAIL_FROM doit utiliser un domaine vérifié dans Resend, par exemple
// "Gospel Nation <rendez-vous@gospelnation.org>". Sans domaine vérifié, Resend
// ne livre qu'à l'adresse du compte Resend lui-même : impossible d'écrire aux
// visiteurs.

// RESEND_API_URL ne sert qu'aux tests (faux serveur local) ; en production, Resend.
const RESEND_URL = process.env.RESEND_API_URL || 'https://api.resend.com/emails';
const SEND_TIMEOUT_MS = 8000;

export type EmailResult =
  | { ok: true }
  | { ok: false; reason: 'not-configured' | 'invalid-address' | 'failed' };

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value) && value.length <= 254;
}

// Les noms viennent d'un formulaire public : on les échappe avant de les
// glisser dans le HTML du message.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function sendEmail(params: { to: string; subject: string; text: string; html: string }): Promise<EmailResult> {
  if (!isEmailConfigured()) return { ok: false, reason: 'not-configured' };
  if (!isValidEmail(params.to)) return { ok: false, reason: 'invalid-address' };

  try {
    const response = await fetch(RESEND_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: [params.to],
        subject: params.subject,
        text: params.text,
        html: params.html
      }),
      signal: AbortSignal.timeout(SEND_TIMEOUT_MS)
    });
    if (!response.ok) {
      // Le corps de la réponse peut citer l'adresse du destinataire : on ne
      // journalise que le code HTTP.
      console.error(`Resend a refusé l'envoi (HTTP ${response.status})`);
      return { ok: false, reason: 'failed' };
    }
    return { ok: true };
  } catch (error) {
    console.error("Envoi d'e-mail impossible", error instanceof Error ? error.name : error);
    return { ok: false, reason: 'failed' };
  }
}

// La date est stockée à minuit UTC (« 2026-09-22 ») : on la formate en UTC pour
// ne pas la faire glisser d'un jour selon le fuseau du serveur.
function formatLongDate(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  });
}

export async function sendAppointmentConfirmation(appointment: {
  requesterName: string;
  requesterEmail: string;
  preferredDate: Date;
  // « HH:MM », déjà validée par l'appelant.
  time: string;
  // Vrai quand l'heure a changé après un premier e-mail de confirmation.
  updated?: boolean;
}): Promise<EmailResult> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const date = `${formatLongDate(appointment.preferredDate)} à ${formatTimeFr(appointment.time)}`;
  const intro = appointment.updated
    ? "L'heure de votre rendez-vous a changé."
    : 'Votre demande de rendez-vous est confirmée.';
  // L'adresse du site contient un tiret long : dans un e-mail, une virgule se lit mieux.
  const place = `${church.address.replace(' — ', ', ')}, ${church.city}`;
  const contactLine = siteUrl
    ? `En cas d'empêchement, merci de nous prévenir depuis la page contact : ${siteUrl}/contact`
    : "En cas d'empêchement, merci de prévenir l'église.";

  const text = [
    `Bonjour ${appointment.requesterName},`,
    '',
    `${intro} Le pasteur vous recevra le ${date}.`,
    '',
    `Lieu : ${place}`,
    '',
    contactLine,
    '',
    `${church.name}`
  ].join('\n');

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1f1a14">
<p>Bonjour ${escapeHtml(appointment.requesterName)},</p>
<p>${escapeHtml(intro)} Le pasteur vous recevra le <strong>${escapeHtml(date)}</strong>.</p>
<p><strong>Lieu :</strong> ${escapeHtml(place)}</p>
<p>${siteUrl ? `En cas d'empêchement, merci de nous prévenir depuis la <a href="${escapeHtml(siteUrl)}/contact">page contact</a>.` : "En cas d'empêchement, merci de prévenir l'église."}</p>
<p>${escapeHtml(church.name)}</p>
</div>`;

  return sendEmail({
    to: appointment.requesterEmail,
    subject: appointment.updated
      ? 'Votre rendez-vous avec le pasteur : nouvelle heure'
      : 'Votre rendez-vous avec le pasteur est confirmé',
    text,
    html
  });
}

// E-mail de candidature : le CV et la lettre rédigés par l'agent partent au
// candidat, à l'adresse de SON profil (jamais une adresse fournie par l'agent).
// Rien n'est conservé sur le site. Les textes sont échappés avant d'entrer dans le HTML.
export async function sendJobApplicationResult(params: {
  to: string;
  fullName: string;
  jobTitle: string;
  cv: string | null;
  letter: string | null;
  advice: string | null;
}): Promise<EmailResult> {
  const sections: { title: string; body: string }[] = [];
  if (params.cv) sections.push({ title: 'Votre CV adapté', body: params.cv });
  if (params.letter) sections.push({ title: 'Votre lettre de motivation', body: params.letter });
  if (params.advice) sections.push({ title: 'Conseils pour cette candidature', body: params.advice });

  const subject = `Votre candidature : ${params.jobTitle}`.slice(0, 150);
  const text = [
    `Bonjour ${params.fullName},`,
    '',
    `Voici les documents préparés pour l'offre « ${params.jobTitle} ». Relisez-les et corrigez-les avant de les envoyer à l'employeur.`,
    '',
    ...sections.flatMap((s) => [`=== ${s.title} ===`, s.body, '']),
    `${church.name}`
  ].join('\n');

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1f1a14">
<p>Bonjour ${escapeHtml(params.fullName)},</p>
<p>Voici les documents préparés pour l'offre « ${escapeHtml(params.jobTitle)} ». Relisez-les et corrigez-les avant de les envoyer à l'employeur.</p>
${sections
  .map(
    (s) =>
      `<h3 style="margin:24px 0 8px">${escapeHtml(s.title)}</h3><div style="white-space:pre-wrap;border-left:3px solid #d99a3d;padding-left:12px">${escapeHtml(s.body)}</div>`
  )
  .join('\n')}
<p style="margin-top:24px">${escapeHtml(church.name)}</p>
</div>`;

  return sendEmail({ to: params.to, subject, text, html });
}

// Alerte à l'équipe d'accueil quand quelqu'un annonce sa venue. Adresse de
// l'équipe : WELCOME_NOTIFY_EMAIL (facultative). Seuls le nom, le jour et le
// nombre de personnes y figurent : jamais téléphone, e-mail ni demande de prière.
export async function sendVisitTeamAlert(visit: {
  firstName: string;
  lastName: string;
  visitDate: Date;
  companions: number;
  childrenCount: number;
  companionNames: string | null;
}): Promise<EmailResult> {
  const to = (process.env.WELCOME_NOTIFY_EMAIL || '').trim();
  if (!to) return { ok: false, reason: 'not-configured' };
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const day = formatVisitDayWithYear(visit.visitDate);
  const name = `${visit.firstName} ${visit.lastName}`;
  const people = peopleLabel(visit);
  const sheet = siteUrl ? `${siteUrl}/admin/visites` : '';

  const text = [
    'Bonjour,',
    '',
    `${name} annonce sa venue le ${day} (${people}).`,
    visit.companionNames ? `Accompagnants : ${visit.companionNames}` : '',
    sheet ? `Voir les visites (espace admin) : ${sheet}` : '',
    '',
    `${church.name}`
  ]
    .filter((line, index, all) => line !== '' || (index > 0 && all[index - 1] !== ''))
    .join('\n');

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1f1a14">
<p>Bonjour,</p>
<p><strong>${escapeHtml(name)}</strong> annonce sa venue le <strong>${escapeHtml(day)}</strong> (${escapeHtml(people)}).</p>
${visit.companionNames ? `<p>Accompagnants : ${escapeHtml(visit.companionNames)}</p>` : ''}
${sheet ? `<p><a href="${escapeHtml(sheet)}">Voir les visites (espace admin)</a></p>` : ''}
<p>${escapeHtml(church.name)}</p>
</div>`;

  return sendEmail({ to, subject: `Nouvelle visite annoncée : ${name}`.slice(0, 150), text, html });
}

// Accusé de réception au visiteur (s'il a donné son adresse).
export async function sendVisitorWelcome(visit: {
  firstName: string;
  email: string;
  visitDate: Date;
}): Promise<EmailResult> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const service = visitServiceFor(visit.visitDate);
  const day = `${formatVisitDayWithYear(visit.visitDate)}${service ? ` à ${service.time}` : ''}`;
  const place = `${church.address.replace(' — ', ', ')}, ${church.city}`;

  const text = [
    `Bonjour ${visit.firstName},`,
    '',
    `Nous avons bien reçu l'annonce de votre venue le ${day}. Nous serons heureux de vous accueillir !`,
    '',
    `Lieu : ${place}`,
    siteUrl ? `Plus d'informations : ${siteUrl}/visite` : '',
    '',
    `${church.name}`
  ]
    .filter((line, index, all) => line !== '' || (index > 0 && all[index - 1] !== ''))
    .join('\n');

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1f1a14">
<p>Bonjour ${escapeHtml(visit.firstName)},</p>
<p>Nous avons bien reçu l'annonce de votre venue le <strong>${escapeHtml(day)}</strong>. Nous serons heureux de vous accueillir !</p>
<p><strong>Lieu :</strong> ${escapeHtml(place)}</p>
${siteUrl ? `<p><a href="${escapeHtml(siteUrl)}/visite">Plus d'informations</a></p>` : ''}
<p>${escapeHtml(church.name)}</p>
</div>`;

  return sendEmail({ to: visit.email, subject: `Nous vous attendons le ${formatVisitDayWithYear(visit.visitDate)}`, text, html });
}

// ---------------------------------------------------------------------------
// Rappels et résumé hebdomadaire des visites (tâche planifiée /api/cron/visites)
// ---------------------------------------------------------------------------

function teamAddress(): string {
  return (process.env.WELCOME_NOTIFY_EMAIL || '').trim();
}

function wrapHtml(inner: string): string {
  return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1f1a14">\n${inner}\n<p>${escapeHtml(church.name)}</p>\n</div>`;
}

// Rappel au visiteur, la veille de sa venue.
export async function sendVisitReminder(visit: {
  firstName: string;
  email: string;
  visitDate: Date;
}): Promise<EmailResult> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const service = visitServiceFor(visit.visitDate);
  const day = `${formatVisitDay(visit.visitDate)}${service ? ` à ${service.time}` : ''}`;
  const place = `${church.address.replace(' — ', ', ')}, ${church.city}`;
  const text = [
    `Bonjour ${visit.firstName},`,
    '',
    `Petit rappel : nous vous attendons demain, ${day}. Quelqu'un de l'équipe d'accueil sera là pour vous recevoir.`,
    '',
    `Lieu : ${place}`,
    siteUrl ? `Itinéraire et horaires : ${siteUrl}/visite` : '',
    '',
    "Si vous ne pouvez finalement pas venir, ce n'est pas grave : vous serez toujours les bienvenus.",
    '',
    church.name
  ]
    .filter((line, index, all) => line !== '' || (index > 0 && all[index - 1] !== ''))
    .join('\n');
  const html = wrapHtml(`<p>Bonjour ${escapeHtml(visit.firstName)},</p>
<p>Petit rappel : nous vous attendons <strong>demain, ${escapeHtml(day)}</strong>. Quelqu'un de l'équipe d'accueil sera là pour vous recevoir.</p>
<p><strong>Lieu :</strong> ${escapeHtml(place)}</p>
${siteUrl ? `<p><a href="${escapeHtml(siteUrl)}/visite">Itinéraire et horaires</a></p>` : ''}
<p>Si vous ne pouvez finalement pas venir, ce n'est pas grave : vous serez toujours les bienvenus.</p>`);
  return sendEmail({ to: visit.email, subject: `Rappel : nous vous attendons demain`, text, html });
}

type RecapVisit = { firstName: string; lastName: string; companions: number; childrenCount: number };

function visitLine(v: RecapVisit): string {
  return `${v.firstName} ${v.lastName} (${peopleLabel(v)})`;
}

// La veille : récapitulatif pour l'équipe d'accueil (noms et effectifs, jamais téléphone ni prière).
export async function sendTeamDayBefore(date: Date, visits: RecapVisit[]): Promise<EmailResult> {
  const to = teamAddress();
  if (!to) return { ok: false, reason: 'not-configured' };
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const people = visits.reduce((n, v) => n + totalPeople(v), 0);
  const day = formatVisitDayWithYear(date);
  const service = visitServiceFor(date);
  const link = siteUrl ? `${siteUrl}/admin/visites/accueil` : '';
  const text = [
    'Bonjour,',
    '',
    `Demain, ${day}${service ? ` (${service.label}, ${service.time})` : ''} : ${visits.length} visite${visits.length > 1 ? 's' : ''} annoncée${visits.length > 1 ? 's' : ''}, ${people} personne${people > 1 ? 's' : ''}.`,
    '',
    ...visits.map((v) => `• ${visitLine(v)}`),
    '',
    link ? `Feuille d'accueil (espace admin) : ${link}` : '',
    '',
    church.name
  ]
    .filter((line, index, all) => line !== '' || (index > 0 && all[index - 1] !== ''))
    .join('\n');
  const html = wrapHtml(`<p>Bonjour,</p>
<p><strong>Demain, ${escapeHtml(day)}</strong>${service ? ` (${escapeHtml(service.label)}, ${escapeHtml(service.time)})` : ''} : ${visits.length} visite${visits.length > 1 ? 's' : ''} annoncée${visits.length > 1 ? 's' : ''}, ${people} personne${people > 1 ? 's' : ''}.</p>
<ul>${visits.map((v) => `<li>${escapeHtml(visitLine(v))}</li>`).join('')}</ul>
${link ? `<p><a href="${escapeHtml(link)}">Ouvrir la feuille d'accueil (espace admin)</a></p>` : ''}`);
  return sendEmail({ to, subject: `Demain : ${visits.length} visite${visits.length > 1 ? 's' : ''} attendue${visits.length > 1 ? 's' : ''}`, text, html });
}

export type WeeklyVisitSummary = {
  from: Date;
  to: Date;
  visits: number;
  people: number;
  came: number;
  noShow: number;
  members: number;
  toFollowUp: { firstName: string; lastName: string }[];
  upcomingVisits: number;
};

// Le lundi : bilan de la semaine écoulée pour le pasteur et l'accueil.
export async function sendWeeklyVisitSummary(summary: WeeklyVisitSummary): Promise<EmailResult> {
  const to = teamAddress();
  if (!to) return { ok: false, reason: 'not-configured' };
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const link = siteUrl ? `${siteUrl}/admin/visites` : '';
  const period = `du ${formatVisitDay(summary.from)} au ${formatVisitDay(summary.to)}`;
  const follow = summary.toFollowUp.map((v) => `${v.firstName} ${v.lastName}`);
  const lines = [
    `Visites annoncées : ${summary.visits} (${summary.people} personne${summary.people > 1 ? 's' : ''})`,
    `Venues : ${summary.came}`,
    `Pas venues : ${summary.noShow}`,
    `Devenues membres : ${summary.members}`,
    `Déjà annoncées pour la semaine qui commence : ${summary.upcomingVisits}`
  ];
  const text = [
    'Bonjour,',
    '',
    `Bilan des visites ${period} :`,
    '',
    ...lines.map((l) => `• ${l}`),
    '',
    follow.length > 0 ? `À remercier (venues, pas encore de mot de suivi) : ${follow.join(', ')}.` : 'Personne en attente de mot de suivi.',
    '',
    link ? `Espace admin : ${link}` : '',
    '',
    church.name
  ]
    .filter((line, index, all) => line !== '' || (index > 0 && all[index - 1] !== ''))
    .join('\n');
  const html = wrapHtml(`<p>Bonjour,</p>
<p>Bilan des visites <strong>${escapeHtml(period)}</strong> :</p>
<ul>${lines.map((l) => `<li>${escapeHtml(l)}</li>`).join('')}</ul>
<p>${follow.length > 0 ? `<strong>À remercier</strong> (venues, pas encore de mot de suivi) : ${escapeHtml(follow.join(', '))}.` : 'Personne en attente de mot de suivi.'}</p>
${link ? `<p><a href="${escapeHtml(link)}">Ouvrir l'espace admin</a></p>` : ''}`);
  return sendEmail({ to, subject: `Visites de la semaine : ${summary.visits} annoncée${summary.visits > 1 ? 's' : ''}, ${summary.came} venue${summary.came > 1 ? 's' : ''}`, text, html });
}
