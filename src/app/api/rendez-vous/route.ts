import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function str(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export async function POST(request: NextRequest) {
  const body = await request.json();

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

  const preferredDate = new Date(preferredDateRaw);
  if (Number.isNaN(preferredDate.getTime())) {
    return NextResponse.json({ error: 'Date invalide.' }, { status: 400 });
  }

  const appointment = await prisma.appointment.create({
    data: { requesterName, requesterPhone, requesterEmail, reason, preferredDate }
  });

  return NextResponse.json({ id: appointment.id });
}
