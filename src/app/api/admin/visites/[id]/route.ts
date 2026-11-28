import { NextRequest, NextResponse } from 'next/server';
import type { VisitStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

const VALID_STATUSES: readonly VisitStatus[] = ['EXPECTED', 'ARRIVED', 'NO_SHOW', 'FOLLOWED_UP', 'MEMBER'];

function isVisitStatus(value: unknown): value is VisitStatus {
  return typeof value === 'string' && (VALID_STATUSES as readonly string[]).includes(value);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;

  let body: { status?: unknown; note?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const data: { status?: VisitStatus; arrivedAt?: Date | null; followedUpAt?: Date | null; note?: string | null } = {};

  if (body.status !== undefined) {
    if (!isVisitStatus(body.status)) return NextResponse.json({ error: 'Statut invalide.' }, { status: 400 });
    data.status = body.status;
    // Les dates suivent le statut : « venu » date l'arrivée, « suivi fait » date le message.
    if (body.status === 'EXPECTED' || body.status === 'NO_SHOW') {
      data.arrivedAt = null;
      data.followedUpAt = null;
    }
    if (body.status === 'ARRIVED') {
      data.arrivedAt = new Date();
      data.followedUpAt = null;
    }
    if (body.status === 'FOLLOWED_UP') data.followedUpAt = new Date();
  }

  if (body.note !== undefined) {
    if (typeof body.note !== 'string' || body.note.length > 1000) {
      return NextResponse.json({ error: 'Note invalide (1000 caractères au plus).' }, { status: 400 });
    }
    data.note = body.note.trim() || null;
  }

  const result = await prisma.visit.updateMany({ where: { id }, data });
  if (result.count === 0) return NextResponse.json({ error: 'Visite introuvable.' }, { status: 404 });
  return NextResponse.json({ ok: true });
}

// Droit à l'effacement : un visiteur qui le demande est supprimé tout de suite.
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  const result = await prisma.visit.deleteMany({ where: { id } });
  if (result.count === 0) return NextResponse.json({ error: 'Visite introuvable.' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
