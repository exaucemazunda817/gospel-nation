import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isJobsAgent } from '@/lib/jobs';
import { sendJobApplicationResult } from '@/lib/email';

const MAX_TEXT = 12000;

// L'agent dépose le CV et la lettre rédigés. Le site les envoie au candidat
// (adresse de son profil) puis marque la candidature comme envoyée ; le texte
// n'est écrit nulle part. Si l'e-mail ne peut pas partir (Resend non configuré,
// panne), on répond 503 et la candidature reste en attente : l'agent réessaiera.
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isJobsAgent(request)) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }
  const text = (key: string) => {
    const v = typeof body[key] === 'string' ? (body[key] as string).trim() : '';
    return v ? v.slice(0, MAX_TEXT) : null;
  };
  const cv = text('cv');
  const letter = text('letter');
  const advice = text('advice');
  if (!cv && !letter) return NextResponse.json({ error: 'Ni CV ni lettre.' }, { status: 400 });

  const application = await prisma.jobApplication.findUnique({ where: { id }, include: { job: true } });
  if (!application) return NextResponse.json({ error: 'Candidature introuvable.' }, { status: 404 });
  if (application.status === 'SENT') return NextResponse.json({ ok: true, alreadySent: true });

  const profile = await prisma.jobProfile.findUnique({ where: { clerkUserId: application.clerkUserId } });
  if (!profile) return NextResponse.json({ error: 'Profil supprimé.' }, { status: 410 });

  // Réservation avant l'envoi : deux appels simultanés n'envoient pas deux e-mails.
  const claimed = await prisma.jobApplication.updateMany({
    where: { id, status: 'QUEUED' },
    data: { status: 'SENT', sentAt: new Date() }
  });
  if (claimed.count === 0) return NextResponse.json({ ok: true, alreadySent: true });

  const sent = await sendJobApplicationResult({
    to: profile.email,
    fullName: profile.fullName,
    jobTitle: application.job.title,
    cv,
    letter,
    advice
  });
  if (!sent.ok) {
    await prisma.jobApplication.update({ where: { id }, data: { status: 'QUEUED', sentAt: null } });
    return NextResponse.json({ error: 'E-mail non envoyé.', reason: sent.reason }, { status: 503 });
  }
  return NextResponse.json({ ok: true });
}
