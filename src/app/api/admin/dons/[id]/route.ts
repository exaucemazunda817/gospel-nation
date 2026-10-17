import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { parseDonationMethod } from '@/lib/donation-methods';
import { requireAdmin } from '@/lib/admin-auth';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  const parsed = parseDonationMethod(await request.json().catch(() => null));
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const exists = await prisma.donationMethod.findUnique({ where: { id }, select: { id: true } });
  if (!exists) return NextResponse.json({ error: 'Moyen de don introuvable.' }, { status: 404 });
  await prisma.donationMethod.update({ where: { id }, data: parsed.data });
  revalidatePath('/dons');
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  const exists = await prisma.donationMethod.findUnique({ where: { id }, select: { id: true } });
  if (!exists) return NextResponse.json({ error: 'Moyen de don introuvable.' }, { status: 404 });
  await prisma.donationMethod.delete({ where: { id } });
  revalidatePath('/dons');
  return NextResponse.json({ ok: true });
}
