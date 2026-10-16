import type { Metadata } from 'next';
import Link from 'next/link';
import EmptyState from '@/components/EmptyState';
import HeroBackground from '@/components/HeroBackground';
import Reveal from '@/components/Reveal';
import { fr } from '@/lib/typo';
import { prisma } from '@/lib/prisma';

// Régénérée au plus toutes les 60 s : sinon figée au build ; ménage aussi la base Neon.
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Offres et services',
  description:
    'Les produits et services proposés par les membres de Gospel Nation.'
};

const LINK = 'inline-flex min-h-[44px] items-center gap-2 rounded-full border border-gn-gold-line/50 px-4 text-sm font-semibold text-gn-gold-dark transition-colors hover:border-gn-gold hover:bg-gn-gold/10';

type Offer = Awaited<ReturnType<typeof loadOffers>>[number];

function loadOffers() {
  return prisma.memberOffer.findMany({
    where: { status: 'APPROVED' },
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  });
}

function OfferCard({ offer }: { offer: Offer }) {
  const author = offer.user ? `${offer.user.firstName} ${offer.user.lastName}` : offer.authorName;
  const hasContact = Boolean(offer.contactPhone || offer.contactEmail || offer.externalUrl);
  return (
    <article className="gn-card-lift gn-spot flex h-full flex-col rounded-lg border border-gn-line bg-white p-6">
      {offer.category && <p className="text-xs font-bold uppercase tracking-wide text-gn-gold-line">{offer.category}</p>}
      <h2 className="mt-2 font-serif text-xl font-semibold leading-snug text-gn-ink">{fr(offer.title)}</h2>
      {author && <p className="mt-1 text-sm text-gn-muted-strong">Proposé par {author}</p>}
      <p className="mt-4 text-sm leading-relaxed text-gn-ink/75">{offer.description}</p>
      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        {offer.contactPhone && (
          <a href={`https://wa.me/${offer.contactPhone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className={LINK}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4C2.7 15.6 2.2 13.8 2.2 12 2.2 6.6 6.6 2.2 12 2.2c2.6 0 5.1 1 6.9 2.9 1.8 1.8 2.9 4.3 2.9 6.9 0 5.4-4.4 9.8-9.8 9.8zm8.4-18.2C18.2 1.3 15.2.1 12 .1 5.4.1.1 5.4.1 12c0 2.1.6 4.1 1.6 5.9L0 24l6.3-1.6c1.7.9 3.7 1.4 5.7 1.4 6.6 0 11.9-5.3 11.9-11.9 0-3.2-1.2-6.2-3.5-8.3z" />
            </svg>
            WhatsApp
          </a>
        )}
        {offer.contactEmail && (
          <a href={`mailto:${offer.contactEmail}`} className={LINK}>
            E-mail
          </a>
        )}
        {offer.externalUrl && (
          <a href={offer.externalUrl} target="_blank" rel="noopener noreferrer" className={LINK}>
            Site web
          </a>
        )}
        {!hasContact && (
          <Link href={`/contact?sujet=${encodeURIComponent(`Offre : ${offer.title}`)}`} className={LINK}>
            Contacter via l&apos;église
          </Link>
        )}
      </div>
    </article>
  );
}

export default async function ServicesPage() {
  const offers = await loadOffers();

  return (
    <div className="bg-gn-cream-bg">
      <section data-page-hero className="relative h-[320px] overflow-hidden border-b border-gn-gold/20 bg-gn-black sm:h-[380px]">
        <HeroBackground first="/hero/services.jpg" position="object-top" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gn-black/85 via-gn-black/55 to-gn-black/30 sm:bg-gradient-to-r sm:from-gn-black/85 sm:via-gn-black/50 sm:to-gn-black/20" />
        <div className="gn-glow pointer-events-none absolute inset-0" />
        <Reveal className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-5 pt-[88px] sm:px-10 sm:pt-[104px]">
          <p className="mb-1 text-xs text-gn-cream/80">
            <Link href="/" className="inline-flex min-h-[44px] items-center hover:text-gn-gold">Accueil</Link> / <span className="text-gn-gold-light">Offres et services</span>
          </p>
          <h1 className="font-serif text-3xl font-bold text-gn-cream sm:text-hero">Offres et services</h1>
          <p className="mt-3.5 max-w-lg text-sm text-gn-cream/90">
            {fr("Découvrez ce que les membres de Gospel Nation proposent, et soutenez-vous les uns les autres.")}
          </p>
        </Reveal>
      </section>

      <section className="border-b border-gn-line bg-white">
        <Reveal className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5 px-5 py-9 sm:px-10">
          <p className="max-w-xl text-sm leading-relaxed text-gn-ink/60">
            Chaque membre a un talent, un métier ou un service à offrir à la communauté. Créez un compte et
            proposez votre produit, votre service ou une offre d&apos;emploi : votre annonce apparaît ici après
            vérification par l&apos;équipe.
          </p>
          <Link
            href="/services/proposer"
            className="inline-flex min-h-[44px] items-center rounded-full bg-gn-gold px-6 text-sm font-semibold text-gn-black transition-colors hover:bg-gn-gold-dark"
          >
            Proposer une offre
          </Link>
        </Reveal>
      </section>

      <section className="bg-gn-cream-bg">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-10 sm:py-16">
          {offers.length === 0 ? (
            <Reveal>
              <EmptyState
                title="Aucune offre publiée pour le moment"
                text="Un produit, un service ou une offre d'emploi à partager avec la communauté ? Proposez-le, il sera publié après vérification."
                action={{ href: '/services/proposer', label: 'Proposer une offre' }}
              />
            </Reveal>
          ) : (
            <ul className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {offers.map((offer, index) => (
                <li key={offer.id}>
                  <Reveal className="h-full" delay={(index % 3) * 0.06}>
                    <OfferCard offer={offer} />
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {offers.length > 0 && (
        <section className="gn-glow relative overflow-hidden bg-gn-black">
          <Reveal className="relative mx-auto max-w-3xl px-5 py-14 text-center sm:px-10 sm:py-16">
            <h2 className="mb-4 font-serif text-3xl font-semibold text-gn-cream">Vous avez un talent ou un commerce ?</h2>
            <p className="mx-auto mb-7 max-w-md text-sm leading-relaxed text-gn-muted">
              Faites-le connaître à la communauté : créez un compte et proposez votre offre, elle sera publiée après vérification.
            </p>
            <Link
              href="/services/proposer"
              className="inline-flex min-h-[44px] items-center rounded-full bg-gradient-to-br from-gn-gold-light to-gn-gold px-8 text-xs font-bold uppercase tracking-wide text-gn-black transition-opacity hover:opacity-90"
            >
              Proposer une offre
            </Link>
          </Reveal>
        </section>
      )}
    </div>
  );
}
