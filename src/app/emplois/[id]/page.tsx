import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { BackStrip } from '@/components/BackLink';
import { prisma } from '@/lib/prisma';
import { isClerkConfigured } from '@/lib/clerk-configured';
import { slotsLabel } from '@/lib/jobs';
import { fr } from '@/lib/typo';
import ApplyButton from './ApplyButton';

// Dépend du compte connecté (candidature déjà faite, profil rempli) : rendue à la demande.
export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const offer = await prisma.jobOffer.findFirst({ where: { id, status: 'APPROVED' }, select: { title: true, description: true } });
  if (!offer) return { title: 'Offre introuvable' };
  return { title: offer.title, description: offer.description.slice(0, 155) };
}

export default async function OffrePage({ params }: Props) {
  const { id } = await params;
  const offer = await prisma.jobOffer.findFirst({ where: { id, status: 'APPROVED' } });
  if (!offer) notFound();
  const closed = Boolean(offer.deadline && offer.deadline < new Date());

  const userId = isClerkConfigured ? (await auth()).userId : null;
  const [profile, application] = userId
    ? await Promise.all([
        prisma.jobProfile.findUnique({ where: { clerkUserId: userId }, select: { id: true } }),
        prisma.jobApplication.findUnique({
          where: { jobId_clerkUserId: { jobId: id, clerkUserId: userId } },
          select: { status: true }
        })
      ])
    : [null, null];

  const state = closed
    ? 'closed'
    : !userId
      ? 'signedOut'
      : !profile
        ? 'noProfile'
        : application
          ? application.status === 'SENT'
            ? 'sent'
            : 'queued'
          : 'ready';

  return (
    <div className="bg-gn-cream-bg">
      <PageHero eyebrow={offer.contractType ?? 'Offre d’emploi'} title={offer.title} image="/hero/services.jpg" />
      <BackStrip href="/emplois" />

      <Reveal className="mx-auto max-w-3xl px-5 py-12 sm:px-10 sm:py-14">
        <p className="text-sm text-gn-muted-strong">
          {[offer.employer, offer.location].filter(Boolean).join(' · ')}
          {offer.deadline && ` · Avant le ${offer.deadline.toLocaleDateString('fr-FR', { timeZone: 'Africa/Kinshasa' })}`}
        </p>
        <h2 className="mt-6 font-serif text-xl font-semibold text-gn-ink">Description</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gn-ink/80">{fr(offer.description)}</p>
        {offer.requirements && (
          <>
            <h2 className="mt-6 font-serif text-xl font-semibold text-gn-ink">Ce que l’offre demande</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gn-ink/80">{offer.requirements}</p>
          </>
        )}

        <div className="mt-8 rounded-2xl border border-gn-line bg-white p-6">
          <h2 className="font-serif text-lg font-semibold text-gn-ink">Postuler</h2>
          <p className="mt-1 text-sm text-gn-ink/70">
            Vos documents adaptés à cette offre vous sont envoyés par e-mail aux heures prévues ({slotsLabel()}, heure de Kinshasa).
            Vous les envoyez ensuite vous-même à l’employeur.
          </p>
          <div className="mt-4">
            {state === 'closed' && <p className="text-sm font-medium text-gn-ink">Cette offre est clôturée.</p>}
            {state === 'signedOut' && (
              <Link
                href={`/connexion?redirect_url=/emplois/${id}`}
                className="inline-flex min-h-[44px] items-center rounded-full bg-gn-gold px-6 text-sm font-semibold text-gn-black hover:bg-gn-gold-dark"
              >
                Me connecter pour postuler
              </Link>
            )}
            {state === 'noProfile' && (
              <Link
                href={`/emplois/profil?retour=/emplois/${id}`}
                className="inline-flex min-h-[44px] items-center rounded-full bg-gn-gold px-6 text-sm font-semibold text-gn-black hover:bg-gn-gold-dark"
              >
                Remplir mon profil d’abord
              </Link>
            )}
            {state === 'ready' && <ApplyButton jobId={id} />}
            {state === 'queued' && (
              <p className="text-sm font-medium text-gn-ink">Candidature enregistrée : vos documents arrivent par e-mail à la prochaine tranche.</p>
            )}
            {state === 'sent' && <p className="text-sm font-medium text-gn-ink">Documents envoyés : vérifiez votre boîte e-mail (et les courriers indésirables).</p>}
          </div>
        </div>

        {(offer.contactPhone || offer.contactEmail || offer.externalUrl) && (
          <p className="mt-6 text-sm text-gn-ink/70">
            Contact de l’employeur :{' '}
            {[offer.contactPhone, offer.contactEmail, offer.externalUrl].filter(Boolean).join(' · ')}
          </p>
        )}
      </Reveal>
    </div>
  );
}
