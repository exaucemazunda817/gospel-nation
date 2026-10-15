import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { parseDonationMethod } from '@/lib/donation-methods';

// Protégée par src/proxy.ts (session admin), comme le reste de /api/admin.
export async function POST(request: NextRequest) {
  const parsed = parseDonationMethod(await request.json().catch(() => null));
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const last = await prisma.donationMethod.findFirst({ orderBy: { order: 'desc' }, select: { order: true } });
  const created = await prisma.donationMethod.create({ data: { ...parsed.data, order: (last?.order ?? -1) + 1 } });
  revalidatePath('/dons');
  return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
}
