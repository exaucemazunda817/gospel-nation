import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 });
  }

  const rows = await prisma.readingProgress.findMany({ where: { clerkUserId: userId } });
  const progress: Record<number, { ot: boolean; nt: boolean }> = {};
  for (const row of rows) {
    progress[row.day] = { ot: row.ot, nt: row.nt };
  }
  return NextResponse.json({ progress });
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 });
  }

  const body = await request.json();
  const day = Number(body.day);
  const part = body.part;
  const value = Boolean(body.value);

  if (!Number.isInteger(day) || day < 1 || (part !== 'ot' && part !== 'nt')) {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const row = await prisma.readingProgress.upsert({
    where: { clerkUserId_day: { clerkUserId: userId, day } },
    create: { clerkUserId: userId, day, [part]: value },
    update: { [part]: value }
  });

  return NextResponse.json({ day: row.day, ot: row.ot, nt: row.nt });
}

export async function DELETE() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 });
  }

  await prisma.readingProgress.deleteMany({ where: { clerkUserId: userId } });
  return NextResponse.json({ ok: true });
}
