import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { isClerkConfigured } from '@/lib/clerk-configured';
import { nextJobSlot, slotsLabel } from '@/lib/jobs';
import { isJobsAssistantEnabled } from '@/lib/jobs-enabled';
import { allowRequest, TOO_MANY_REQUESTS_MESSAGE } from '@/lib/rate-limit';

// Frein : au-delà, les candidatures en attente sont déjà nombreuses pour un seul compte.
const MAX_QUEUED_PER_ACCOUNT = 5;

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isJobsAssistantEnabled()) {
    return NextResponse.json({ error: 'L’assistant de candidature ouvre bientôt.' }, { status: 503 });
  }
  if (!isClerkConfigured) {
    return NextResponse.json({ error: 'Les comptes ne sont pas disponibles pour le moment.' }, { status: 503 });
  }
  if (!(await allowRequest('emplois-postuler', request, 20, 60 * 60 * 1000))) {
    return NextResponse.json({ error: TOO_MANY_REQUESTS_MESSAGE }, { status: 429 });
  }
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Connectez-vous pour postuler.' }, { status: 401 });

  const { id } = await params;
  const [offer, profile] = await Promise.all([
    prisma.jobOffer.findUnique({ where: { id }, select: { id: true, status: true, deadline: true } }),
    prisma.jobProfile.findUnique({ where: { clerkUserId: userId }, select: { id: true } })
  ]);
  if (!offer || offer.status !== 'APPROVED') {
    return NextResponse.json({ error: 'Offre introuvable.' }, { status: 404 });
  }
  if (offer.deadline && offer.deadline.getTime() < Date.now()) {
    return NextResponse.json({ error: 'Cette offre est clôturée.' }, { status: 410 });
  }
  if (!profile) {
    return NextResponse.json({ error: 'Remplissez d’abord votre profil.', code: 'NO_PROFILE' }, { status: 409 });
  }

  const existing = await prisma.jobApplication.findUnique({
    where: { jobId_clerkUserId: { jobId: id, clerkUserId: userId } }
  });
  if (existing) {
    return NextResponse.json({ error: 'Vous avez déjà postulé à cette offre.' }, { status: 409 });
  }
  const queued = await prisma.jobApplication.count({ where: { clerkUserId: userId, status: 'QUEUED' } });
  if (queued >= MAX_QUEUED_PER_ACCOUNT) {
    return NextResponse.json(
      { error: `Vous avez déjà ${MAX_QUEUED_PER_ACCOUNT} candidatures en attente. Patientez jusqu’à la prochaine tranche (${slotsLabel()}).` },
      { status: 429 }
    );
  }

  const processAfter = nextJobSlot();
  await prisma.jobApplication.create({ data: { jobId: id, clerkUserId: userId, processAfter } });
  return NextResponse.json({ ok: true, processAfter: processAfter.toISOString() });
}
