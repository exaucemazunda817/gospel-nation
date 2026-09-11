import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import PlaceholderNote from '@/components/PlaceholderNote';
import Reveal from '@/components/Reveal';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Services des membres'
};

export default async function ServicesPage() {
  const offers = await prisma.memberOffer.findMany({
    where: { status: 'APPROVED' },
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <PageHero
        eyebrow="Entraide et entrepreneuriat"
        title="Services des membres"
        subtitle="Les produits et services proposés par des membres de Gospel Nation. Un espace qui accueillera bientôt aussi les offres d'emploi."
      />

      <div className="gn-section-light">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          {offers.length === 0 ? (
            <PlaceholderNote>Aucun service publié pour le moment.</PlaceholderNote>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {offers.map((offer, index) => (
                <Reveal key={offer.id} delay={index * 0.08}>
                  <div className="gn-card-lift h-full rounded-2xl border border-gn-ink/10 bg-white p-6">
                    {offer.category && (
                      <p className="text-xs font-semibold uppercase tracking-wide text-gn-gold-dark">
                        {offer.category}
                      </p>
                    )}
                    <h2 className="mt-1 text-lg font-bold text-gn-ink">{offer.title}</h2>
                    <p className="mt-2 text-sm text-gn-ink/70">{offer.description}</p>
                    <p className="mt-3 text-xs text-gn-ink/50">
                      Par {offer.user.firstName} {offer.user.lastName}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm">
                      {offer.contactPhone && (
                        <a
                          href={`https://wa.me/${offer.contactPhone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full bg-gn-gold px-4 py-2 font-semibold text-gn-black transition-all hover:scale-105 hover:bg-gn-gold-dark"
                        >
                          {offer.contactPhone}
                        </a>
                      )}
                      {offer.externalUrl && (
                        <a
                          href={offer.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full border border-gn-gold-dark px-4 py-2 font-semibold text-gn-gold-dark transition-all hover:scale-105 hover:bg-gn-gold-dark hover:text-white"
                        >
                          Voir le site →
                        </a>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}

          <div className="mt-8">
            <PlaceholderNote>
              Vous êtes membre et proposez un produit ou un service ? Cet espace accueillera bientôt un
              formulaire de publication, ainsi que les offres d&apos;emploi, une fois les comptes membres
              actifs.
            </PlaceholderNote>
          </div>
        </div>
      </div>
    </div>
  );
}
