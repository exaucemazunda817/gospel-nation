import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendVisitorWelcome, sendVisitTeamAlert } from '@/lib/email';
import { allowRequest, TOO_MANY_REQUESTS_MESSAGE } from '@/lib/rate-limit';
import { parseVisitInput } from '@/lib/visit-input';
import { anonymizeOldVisits } from '@/lib/visits-db';

export async function POST(request: NextRequest) {
  // 30 par heure et par adresse : plus large que les autres formulaires, car
  // plusieurs familles peuvent s'inscrire depuis le même réseau Wi-Fi à l'église.
  if (!(await allowRequest('visite', request, 30, 60 * 60 * 1000))) {
    return NextResponse.json({ error: TOO_MANY_REQUESTS_MESSAGE }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  // Champ piège, invisible pour une personne : un robot le remplit. On répond
  // « ok » sans rien enregistrer pour ne pas lui dire qu'il a été repéré.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  const parsed = parseVisitInput(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const data = parsed.data;

  // Double envoi (double clic, retour arrière) : même nom, même jour → une seule ligne.
  const existing = await prisma.visit.findFirst({
    where: {
      visitDate: data.visitDate,
      firstName: { equals: data.firstName, mode: 'insensitive' },
      lastName: { equals: data.lastName, mode: 'insensitive' }
    },
    select: { id: true }
  });
  if (existing) return NextResponse.json({ ok: true });

  const visit = await prisma.visit.create({ data });

  // Alertes par e-mail : inactives tant que Resend n'est pas configuré. Un envoi
  // qui échoue ne doit jamais empêcher l'enregistrement de la visite.
  const [team, visitor] = await Promise.all([
    sendVisitTeamAlert(visit),
    visit.email ? sendVisitorWelcome({ firstName: visit.firstName, email: visit.email, visitDate: visit.visitDate }) : null
  ]);
  const stamps: { teamEmailSentAt?: Date; visitorEmailSentAt?: Date } = {};
  if (team.ok) stamps.teamEmailSentAt = new Date();
  if (visitor?.ok) stamps.visitorEmailSentAt = new Date();
  if (Object.keys(stamps).length > 0) {
    await prisma.visit.update({ where: { id: visit.id }, data: stamps }).catch(() => undefined);
  }

  // Effacement des vieilles données : de temps en temps, sans tâche planifiée.
  if (Math.random() < 0.05) await anonymizeOldVisits();

  return NextResponse.json({ ok: true });
}
