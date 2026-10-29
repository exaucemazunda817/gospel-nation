import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { isClerkConfigured } from '@/lib/clerk-configured';
import { parseProfileInput } from '@/lib/jobs';
import { allowRequest, TOO_MANY_REQUESTS_MESSAGE } from '@/lib/rate-limit';
import { isJobsAssistantEnabled } from '@/lib/jobs-enabled';

async function signedInUser() {
  if (!isClerkConfigured) return null;
  const { userId } = await auth();
  return userId;
}

export async function PUT(request: NextRequest) {
  if (!isJobsAssistantEnabled()) {
    return NextResponse.json({ error: 'L’assistant de candidature ouvre bientôt.' }, { status: 503 });
  }
  if (!(await allowRequest('emplois-profil', request, 20, 60 * 60 * 1000))) {
    return NextResponse.json({ error: TOO_MANY_REQUESTS_MESSAGE }, { status: 429 });
  }
  const userId = await signedInUser();
  if (!userId) return NextResponse.json({ error: 'Connectez-vous pour enregistrer votre profil.' }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }
  const parsed = parseProfileInput(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  // L'e-mail de réception vient du compte (vérifié par Clerk), jamais du formulaire.
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  if (!email) return NextResponse.json({ error: 'Votre compte n’a pas d’adresse e-mail.' }, { status: 400 });

  await prisma.jobProfile.upsert({
    where: { clerkUserId: userId },
    create: { clerkUserId: userId, email, consentAt: new Date(), ...parsed.data },
    update: { email, consentAt: new Date(), ...parsed.data }
  });
  return NextResponse.json({ ok: true });
}

// Droit à l'effacement : supprime le profil ET les candidatures en attente.
export async function DELETE() {
  const userId = await signedInUser();
  if (!userId) return NextResponse.json({ error: 'Non connecté.' }, { status: 401 });
  await prisma.$transaction([
    prisma.jobApplication.deleteMany({ where: { clerkUserId: userId } }),
    prisma.jobProfile.deleteMany({ where: { clerkUserId: userId } })
  ]);
  return NextResponse.json({ ok: true });
}
