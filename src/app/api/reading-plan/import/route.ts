import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// Fusionne la progression locale (localStorage, avant connexion) dans le
// compte — ne fait qu'ajouter des "true", ne peut jamais effacer une lecture
// déjà cochée côté serveur.
export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 });
  }

  const body = await request.json();
  const local = body.progress as Record<string, { ot?: boolean; nt?: boolean }>;
  if (!local || typeof local !== 'object') {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const existing = await prisma.readingProgress.findMany({ where: { clerkUserId: userId } });
  const existingByDay = new Map(existing.map((r) => [r.day, r]));

  for (const [dayStr, rec] of Object.entries(local)) {
    const day = Number(dayStr);
    if (!Number.isInteger(day) || day < 1) continue;
    const ot = Boolean(rec.ot) || Boolean(existingByDay.get(day)?.ot);
    const nt = Boolean(rec.nt) || Boolean(existingByDay.get(day)?.nt);
    if (!ot && !nt) continue;
    await prisma.readingProgress.upsert({
      where: { clerkUserId_day: { clerkUserId: userId, day } },
      create: { clerkUserId: userId, day, ot, nt },
      update: { ot, nt }
    });
  }

  const rows = await prisma.readingProgress.findMany({ where: { clerkUserId: userId } });
  const progress: Record<number, { ot: boolean; nt: boolean }> = {};
  for (const row of rows) progress[row.day] = { ot: row.ot, nt: row.nt };
  return NextResponse.json({ progress });
}
