import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  const { status } = await request.json();
  if (status !== 'APPROVED' && status !== 'REJECTED') {
    return NextResponse.json({ error: 'Statut invalide.' }, { status: 400 });
  }
  const offer = await prisma.jobOffer.findUnique({ where: { id }, select: { id: true } });
  if (!offer) return NextResponse.json({ error: 'Offre introuvable.' }, { status: 404 });
  await prisma.jobOffer.update({ where: { id }, data: { status } });
  return NextResponse.json({ ok: true });
}
