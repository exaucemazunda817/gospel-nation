import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isJobsAgent } from '@/lib/jobs';

// Mode Gmail : la routine a elle-même envoyé les documents par Gmail à
// l'adresse du profil, puis le dit ici pour que la candidature ne soit plus
// reprise. Rien n'est écrit du contenu des documents. Un second appel est sans effet.
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isJobsAgent(request)) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  const { id } = await params;
  const application = await prisma.jobApplication.findUnique({ where: { id }, select: { id: true } });
  if (!application) return NextResponse.json({ error: 'Candidature introuvable.' }, { status: 404 });
  await prisma.jobApplication.updateMany({
    where: { id, status: 'QUEUED' },
    data: { status: 'SENT', sentAt: new Date() }
  });
  return NextResponse.json({ ok: true });
}
