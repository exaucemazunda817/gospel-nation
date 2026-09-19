import { church } from '@/lib/content';

// Envoi d'e-mails via Resend (https://resend.com), par simple appel HTTP : pas
// de dépendance à ajouter. Tant que RESEND_API_KEY et EMAIL_FROM ne sont pas
// définis, rien n'est envoyé et l'appelant en est informé (le site continue de
// fonctionner normalement, l'admin voit simplement qu'aucun e-mail n'est parti).
//
// EMAIL_FROM doit utiliser un domaine vérifié dans Resend, par exemple
// "Gospel Nation <rendez-vous@gospelnation.org>". Sans domaine vérifié, Resend
// ne livre qu'à l'adresse du compte Resend lui-même : impossible d'écrire aux
// visiteurs.

const RESEND_URL = 'https://api.resend.com/emails';
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
}): Promise<EmailResult> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const date = formatLongDate(appointment.preferredDate);
  // L'adresse du site contient un tiret long : dans un e-mail, une virgule se lit mieux.
  const place = `${church.address.replace(' — ', ', ')}, ${church.city}`;
  const contactLine = siteUrl
    ? `En cas d'empêchement, merci de nous prévenir depuis la page contact : ${siteUrl}/contact`
    : "En cas d'empêchement, merci de prévenir l'église.";

  const text = [
    `Bonjour ${appointment.requesterName},`,
    '',
    `Votre demande de rendez-vous est confirmée. Le pasteur vous recevra le ${date}.`,
    '',
    `Lieu : ${place}`,
    '',
    contactLine,
    '',
    `${church.name}`
  ].join('\n');

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1f1a14">
<p>Bonjour ${escapeHtml(appointment.requesterName)},</p>
<p>Votre demande de rendez-vous est confirmée. Le pasteur vous recevra le <strong>${escapeHtml(date)}</strong>.</p>
<p><strong>Lieu :</strong> ${escapeHtml(place)}</p>
<p>${siteUrl ? `En cas d'empêchement, merci de nous prévenir depuis la <a href="${escapeHtml(siteUrl)}/contact">page contact</a>.` : "En cas d'empêchement, merci de prévenir l'église."}</p>
<p>${escapeHtml(church.name)}</p>
</div>`;

  return sendEmail({
    to: appointment.requesterEmail,
    subject: 'Votre rendez-vous avec le pasteur est confirmé',
    text,
    html
  });
}
