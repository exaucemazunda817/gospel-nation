import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireWelcomeTeam } from '@/lib/admin-auth';

// L'équipe d'accueil ne peut faire qu'une chose : cocher ou décocher « arrivé ».
// Une visite déjà suivie ou devenue membre n'est jamais ramenée en arrière.
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireWelcomeTeam();
  if (denied) return denied;
  const { id } = await params;

  let arrived: unknown;
  try {
    ({ arrived } = await request.json());
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }
  if (typeof arrived !== 'boolean') return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });

  const result = await prisma.visit.updateMany({
    where: { id, status: { in: ['EXPECTED', 'ARRIVED', 'NO_SHOW'] } },
    data: arrived ? { status: 'ARRIVED', arrivedAt: new Date() } : { status: 'EXPECTED', arrivedAt: null }
  });
  return NextResponse.json({ ok: true, changed: result.count });
}
