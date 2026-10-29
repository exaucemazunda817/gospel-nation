import type { Metadata } from 'next';
import Link from 'next/link';
import EmptyState from '@/components/EmptyState';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { fr } from '@/lib/typo';
import { prisma } from '@/lib/prisma';
import { slotsLabel } from '@/lib/jobs';

// Régénérée au plus toutes les 60 s : sinon figée au build ; ménage aussi la base Neon.
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Emplois',
  description: 'Les offres d’emploi partagées avec la communauté Gospel Nation, et une aide pour préparer votre CV et votre lettre de motivation.'
};

const BUTTON =
  'inline-flex min-h-[44px] items-center rounded-full bg-gn-gold px-6 text-sm font-semibold text-gn-black transition-colors hover:bg-gn-gold-dark';

export default async function EmploisPage() {
  const now = new Date();
  const offers = await prisma.jobOffer.findMany({
    where: { status: 'APPROVED', OR: [{ deadline: null }, { deadline: { gte: now } }] },
    orderBy: { createdAt: 'desc' }
  });
  const dropUrl = process.env.NEXT_PUBLIC_JOBS_DROP_URL;

  return (
    <div className="bg-gn-cream-bg">
      <PageHero
        eyebrow="Emplois"
        title="Des offres, et de l’aide pour postuler"
        subtitle="Remplissez votre profil une fois. Quand vous postulez, vos documents adaptés à l’offre vous arrivent par e-mail."
        image="/hero/services.jpg"
      />

      <Reveal className="mx-auto max-w-6xl px-5 py-12 sm:px-10 sm:py-14">
        <div className="mb-10 rounded-2xl border border-gn-line bg-white p-6 sm:p-8">
          <h2 className="font-serif text-xl font-semibold text-gn-ink">Comment ça marche</h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-gn-ink/75">
            <li>Créez votre profil : parcours, études, compétences.</li>
            <li>Choisissez une offre et cliquez sur « Postuler ».</li>
            <li>
              Aux heures prévues ({slotsLabel()}, heure de Kinshasa), votre CV et votre lettre de motivation,
              adaptés à l’offre, vous sont envoyés par e-mail.
            </li>
            <li>Relisez, corrigez, puis envoyez-les vous-même à l’employeur.</li>
          </ol>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/emplois/profil" className={BUTTON}>
              Mon profil de candidat
            </Link>
            {dropUrl && (
              <a
                href={dropUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center rounded-full border border-gn-ink/20 px-6 text-sm font-semibold text-gn-ink transition-colors hover:border-gn-gold"
              >
                Déposer une offre
              </a>
            )}
          </div>
        </div>

        {offers.length === 0 ? (
          <EmptyState
            headingLevel={2}
            title="Aucune offre pour le moment"
            text="Les offres validées apparaissent ici. Remplissez dès maintenant votre profil : il sera prêt quand une offre vous plaira."
            action={{ href: '/emplois/profil', label: 'Remplir mon profil' }}
          />
        ) : (
          <ul className="grid gap-5 md:grid-cols-2">
            {offers.map((offer) => (
              <li key={offer.id}>
                <Link
                  href={`/emplois/${offer.id}`}
                  className="gn-card-lift gn-spot flex h-full flex-col rounded-lg border border-gn-line bg-white p-6"
                >
                  {offer.contractType && (
                    <span className="text-xs font-bold uppercase tracking-wide text-gn-gold-line">{offer.contractType}</span>
                  )}
                  <h2 className="mt-2 font-serif text-xl font-semibold leading-snug text-gn-ink">{fr(offer.title)}</h2>
                  <p className="mt-1 text-sm text-gn-muted-strong">
                    {[offer.employer, offer.location].filter(Boolean).join(' · ')}
                  </p>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gn-ink/75">{offer.description}</p>
                  <span className="mt-auto pt-4 text-sm font-semibold text-gn-gold-line">Voir l’offre</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Reveal>
    </div>
  );
}
