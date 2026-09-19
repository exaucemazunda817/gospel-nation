import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { isClerkConfigured } from '@/lib/clerk-configured';
import { MAX_PENDING_OFFERS_PER_ACCOUNT, parseOfferInput } from '@/lib/offers';

export async function POST(request: NextRequest) {
  // Sans Clerk, auth() lèverait une erreur : on répond proprement.
  if (!isClerkConfigured) {
    return NextResponse.json({ error: 'Les comptes ne sont pas disponibles pour le moment.' }, { status: 503 });
  }

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Connectez-vous pour proposer une offre.' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const parsed = parseOfferInput(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  // Frein anti-spam : un compte ne peut pas noyer l'admin sous les offres en
  // attente de validation.
  const pending = await prisma.memberOffer.count({ where: { clerkUserId: userId, status: 'PENDING' } });
  if (pending >= MAX_PENDING_OFFERS_PER_ACCOUNT) {
    return NextResponse.json(
      {
        error: `Vous avez déjà ${MAX_PENDING_OFFERS_PER_ACCOUNT} offres en attente de vérification. Merci de patienter avant d'en proposer une autre.`
      },
      { status: 429 }
    );
  }

  const offer = await prisma.memberOffer.create({
    data: {
      clerkUserId: userId,
      authorName: parsed.data.authorName,
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
      contactPhone: parsed.data.contactPhone,
      contactEmail: parsed.data.contactEmail,
      externalUrl: parsed.data.externalUrl
      // status : PENDING par défaut, rien n'est publié avant validation admin.
    }
  });

  return NextResponse.json({ id: offer.id });
}
