import type { Metadata } from 'next';
import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PlaceholderNote from '@/components/PlaceholderNote';
import Reveal from '@/components/Reveal';
import Skeleton from '@/components/Skeleton';
import { prisma } from '@/lib/prisma';

// Régénérée au plus toutes les 60 s : sinon figée au build ; ménage aussi la base Neon.
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Offres et services',
  description:
    'Les produits et services proposés par les membres de Gospel Nation.'
};

function OffersSkeleton() {
  return (
    <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex h-full flex-col gap-3.5 rounded-lg border border-gn-line bg-white p-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-[46px] w-[46px] shrink-0 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
        </div>
      ))}
    </div>
  );
}

async function OffersList() {
  const offers = await prisma.memberOffer.findMany({
    where: { status: 'APPROVED' },
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  });

  if (offers.length === 0) {
    return <PlaceholderNote>Aucun service publié pour le moment.</PlaceholderNote>;
  }

  return (
    <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
      {offers.map((offer, index) => (
        <Reveal key={offer.id} delay={index * 0.06}>
          <div className="gn-card-lift flex h-full flex-col gap-3.5 rounded-lg border border-gn-line bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gn-avatar-from to-gn-avatar-to">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gn-avatar-icon)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="8" r="3.2" />
                  <path d="M2.5 19c.6-3 3.2-5 6.5-5s5.9 2 6.5 5" />
                  <circle cx="17.5" cy="9" r="2.6" />
                  <path d="M15.8 14.2c2.6.4 4.6 2.1 5.1 4.4" />
                </svg>
              </div>
              <div>
                <p className="font-serif text-base font-semibold text-gn-ink">
                  {offer.user ? `${offer.user.firstName} ${offer.user.lastName}` : (offer.authorName ?? 'Membre')}
                </p>
                {offer.category && (
                  <span className="mt-0.5 inline-block rounded-full bg-gn-gold/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-gn-gold-line">
                    {offer.category}
                  </span>
                )}
              </div>
            </div>
            <div>
              <p className="mb-1.5 font-serif text-sm font-semibold text-gn-ink">{offer.title}</p>
              <p className="text-xs leading-relaxed text-gn-ink/60">{offer.description}</p>
            </div>
            {(offer.contactPhone || offer.contactEmail || offer.externalUrl) && (
              <div className="mt-auto flex flex-wrap gap-4 border-t border-gn-line pt-3.5">
                {offer.contactPhone && (
                  <a
                    href={`https://wa.me/${offer.contactPhone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-[44px] items-center gap-1.5 text-xs font-semibold text-gn-gold-line hover:underline"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.1-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2.4z" />
                    </svg>
                    Contacter le membre
                  </a>
                )}
                {offer.contactEmail && (
                  <a
                    href={`mailto:${offer.contactEmail}`}
                    className="inline-flex min-h-[44px] items-center text-xs font-semibold text-gn-gold-line hover:underline"
                  >
                    Écrire un e-mail
                  </a>
                )}
                {offer.externalUrl && (
                  <a
                    href={offer.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center text-xs font-semibold text-gn-gold-line hover:underline"
                  >
                    Voir le site
                  </a>
                )}
              </div>
            )}
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <div className="bg-gn-cream-bg">
      <section className="relative h-[220px] overflow-hidden border-b border-gn-gold/20 bg-gn-black sm:h-[260px]">
        <Image src="/hero/services.jpg" alt="" fill className="gn-kenburns object-cover object-top" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gn-black/85 via-gn-black/55 to-gn-black/30 sm:bg-gradient-to-r sm:from-gn-black/85 sm:via-gn-black/50 sm:to-gn-black/20" />
        <div className="gn-glow pointer-events-none absolute inset-0" />
        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-5 sm:px-10">
          <p className="mb-1 text-xs text-gn-cream/80">
            <Link href="/" className="inline-flex min-h-[44px] items-center hover:text-gn-gold">Accueil</Link> / <span className="text-gn-gold-light">Offres et services</span>
          </p>
          <h1 className="font-serif text-3xl font-bold text-gn-cream sm:text-hero">Offres et services</h1>
          <p className="mt-3.5 max-w-lg text-sm text-gn-cream/90">
            Découvrez ce que les membres de Gospel Nation proposent — et soutenez-vous les uns les autres.
          </p>
        </div>
      </section>

      <section className="border-b border-gn-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5 px-5 py-9 sm:px-10">
          <p className="max-w-xl text-sm leading-relaxed text-gn-ink/60">
            Chaque membre a un talent, un métier ou un service à offrir à la communauté. Vous aussi, vous pouvez
            publier votre produit, votre service ou une offre d&apos;emploi : votre annonce apparaît ici après
            vérification par un administrateur.
          </p>
          <Link
            href="/services/proposer"
            className="inline-flex min-h-[44px] items-center rounded-full bg-gn-gold px-6 text-sm font-semibold text-gn-black transition-colors hover:bg-gn-gold-dark"
          >
            Proposer une offre
          </Link>
        </div>
      </section>

      <section className="bg-gn-cream-bg">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-10 sm:py-16">
          <Suspense fallback={<OffersSkeleton />}>
            <OffersList />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
