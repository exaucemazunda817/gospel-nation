import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isValidEmail } from '@/lib/email';
import { allowRequest, TOO_MANY_REQUESTS_MESSAGE } from '@/lib/rate-limit';
import { tooLong } from '@/lib/validation';

function str(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export async function POST(request: NextRequest) {
  if (!(await allowRequest('rendez-vous', request, 15, 60 * 60 * 1000))) {
    return NextResponse.json({ error: TOO_MANY_REQUESTS_MESSAGE }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const requesterName = str(body.requesterName);
  const requesterPhone = str(body.requesterPhone);
  const requesterEmail = str(body.requesterEmail) || null;
  const reason = str(body.reason);
  const preferredDateRaw = str(body.preferredDate);

  if (!requesterName || !requesterPhone || !reason || !preferredDateRaw) {
    return NextResponse.json(
      { error: 'Le nom, le téléphone, le motif et la date souhaitée sont obligatoires.' },
      { status: 400 }
    );
  }

  if (tooLong(requesterName, 100) || tooLong(requesterPhone, 30) || tooLong(reason, 2000) || (requesterEmail && tooLong(requesterEmail, 200))) {
    return NextResponse.json({ error: 'Un des champs est trop long.' }, { status: 400 });
  }

  if (requesterEmail && !isValidEmail(requesterEmail)) {
    return NextResponse.json({ error: 'Adresse e-mail invalide.' }, { status: 400 });
  }

  const preferredDate = new Date(preferredDateRaw);
  if (Number.isNaN(preferredDate.getTime())) {
    return NextResponse.json({ error: 'Date invalide.' }, { status: 400 });
  }
  // Le formulaire ne propose que des mardis, mais on revérifie côté serveur
  // (le pasteur ne reçoit que ce jour-là) plutôt que de faire confiance au
  // seul <select> du client.
  if (preferredDate.getUTCDay() !== 2) {
    return NextResponse.json(
      { error: 'Le pasteur ne reçoit que le mardi — merci de choisir un mardi.' },
      { status: 400 }
    );
  }

  const appointment = await prisma.appointment.create({
    data: { requesterName, requesterPhone, requesterEmail, reason, preferredDate }
  });

  return NextResponse.json({ id: appointment.id });
}
