import type { Metadata } from 'next';
import Link from 'next/link';
import PlaceholderNote from '@/components/PlaceholderNote';
import Reveal from '@/components/Reveal';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Offres et services'
};

export default async function ServicesPage() {
  const offers = await prisma.memberOffer.findMany({
    where: { status: 'APPROVED' },
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="bg-gn-cream-bg">
      <section className="gn-glow relative h-[220px] overflow-hidden border-b border-gn-gold/20 bg-gn-black sm:h-[260px]">
        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-5 sm:px-10">
          <p className="mb-3.5 text-xs text-gn-muted">
            <Link href="/" className="hover:text-gn-gold">Accueil</Link> / <span className="text-gn-gold">Offres et services</span>
          </p>
          <h1 className="font-serif text-3xl font-bold text-gn-cream sm:text-[38px]">Offres et services</h1>
          <p className="mt-3.5 max-w-lg text-sm text-gn-muted">
            Découvrez ce que les membres de Gospel Nation proposent — et soutenez-vous les uns les autres.
          </p>
        </div>
      </section>

      <section className="border-b border-gn-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5 px-5 py-9 sm:px-10">
          <p className="max-w-xl text-sm leading-relaxed text-gn-ink/60">
            Chaque membre a un talent, un métier ou un service à offrir à la communauté. Cet espace accueillera
            bientôt aussi les offres d&apos;emploi, une fois les comptes membres actifs.
          </p>
        </div>
      </section>

      <section className="bg-gn-cream-bg">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-10 sm:py-16">
          {offers.length === 0 ? (
            <PlaceholderNote>Aucun service publié pour le moment.</PlaceholderNote>
          ) : (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {offers.map((offer, index) => (
                <Reveal key={offer.id} delay={index * 0.06}>
                  <div className="flex h-full flex-col gap-3.5 rounded-lg border border-gn-line bg-white p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#eee7d6] to-[#e3dabd]">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a8946a" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="9" cy="8" r="3.2" />
                          <path d="M2.5 19c.6-3 3.2-5 6.5-5s5.9 2 6.5 5" />
                          <circle cx="17.5" cy="9" r="2.6" />
                          <path d="M15.8 14.2c2.6.4 4.6 2.1 5.1 4.4" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-serif text-[15px] font-semibold text-gn-ink">
                          {offer.user.firstName} {offer.user.lastName}
                        </p>
                        {offer.category && (
                          <span className="mt-0.5 inline-block rounded-full bg-gn-gold/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gn-gold-line">
                            {offer.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="mb-1.5 font-serif text-[14.5px] font-semibold text-gn-ink">{offer.title}</p>
                      <p className="text-[12.5px] leading-relaxed text-gn-ink/60">{offer.description}</p>
                    </div>
                    {(offer.contactPhone || offer.externalUrl) && (
                      <div className="mt-auto flex flex-wrap gap-4 border-t border-gn-line pt-3.5">
                        {offer.contactPhone && (
                          <a
                            href={`https://wa.me/${offer.contactPhone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-[12.5px] font-semibold text-gn-gold-line hover:underline"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.1-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2.4z" />
                            </svg>
                            Contacter le membre
                          </a>
                        )}
                        {offer.externalUrl && (
                          <a
                            href={offer.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[12.5px] font-semibold text-gn-gold-line hover:underline"
                          >
                            Voir le site →
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          )}
          <div className="mt-10">
            <PlaceholderNote>
              Vous êtes membre et proposez un produit ou un service ? Cet espace accueillera bientôt un
              formulaire de publication en libre-service, une fois les comptes membres actifs.
            </PlaceholderNote>
          </div>
        </div>
      </section>
    </div>
  );
}
