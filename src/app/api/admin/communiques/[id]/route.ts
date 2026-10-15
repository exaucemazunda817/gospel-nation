import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

// Protégées par src/proxy.ts (session admin).
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { pinned } = await request.json();
  if (typeof pinned !== 'boolean') return NextResponse.json({ error: 'Valeur invalide.' }, { status: 400 });
  const exists = await prisma.announcement.findUnique({ where: { id }, select: { id: true } });
  if (!exists) return NextResponse.json({ error: 'Communiqué introuvable.' }, { status: 404 });
  await prisma.announcement.update({ where: { id }, data: { pinned } });
  revalidatePath('/');
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const exists = await prisma.announcement.findUnique({ where: { id }, select: { id: true } });
  if (!exists) return NextResponse.json({ error: 'Communiqué introuvable.' }, { status: 404 });
  await prisma.announcement.delete({ where: { id } });
  revalidatePath('/');
  return NextResponse.json({ ok: true });
}
