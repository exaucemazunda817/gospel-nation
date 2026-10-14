import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import AutoScrollBand from '@/components/AutoScrollBand';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { prisma } from '@/lib/prisma';

// Régénérée au plus toutes les 60 s : sinon figée au build ; ménage aussi la base Neon.
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Départements',
  description:
    'Worship, intercession, médias, Gospel Kids, One Love : découvrez les départements où servir à Gospel Nation.'
};

export default async function DepartementsPage() {
  const departments = await prisma.department.findMany({ orderBy: { order: 'asc' } });

  return (
    <div className="bg-gn-cream-bg">
      <PageHero
        eyebrow="Servir ensemble"
        title="Nos départements"
        subtitle="Chaque département est un espace pour servir, grandir et rejoindre une équipe selon votre appel."
        image="/hero/departements.jpg"
      />

      <div className="bg-gn-cream-bg py-12 sm:py-16">
        <Reveal>
          <AutoScrollBand label="Nos départements">
            {departments.map((dept) => (
              <div key={dept.id} className="flex w-[78vw] max-w-[340px] shrink-0 sm:w-[320px]">
                <Link
                  href={`/departements/${dept.slug}`}
                  draggable={false}
                  className="gn-card-lift gn-spot group relative flex min-h-[380px] w-full flex-col overflow-hidden rounded-lg border border-gn-line bg-white sm:min-h-0"
                >
                  <div className="gn-photo-hover relative aspect-[4/3] w-full overflow-hidden bg-gn-black max-sm:absolute max-sm:inset-0 max-sm:aspect-auto">
                    {dept.imageUrl ? (
                      <Image
                        src={dept.imageUrl}
                        alt={dept.name}
                        fill
                        sizes="(max-width: 640px) 78vw, 320px"
                        draggable={false}
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gn-black-soft to-gn-black">
                        <span className="font-serif text-3xl font-bold text-gn-gold">{dept.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6 max-sm:relative max-sm:justify-end max-sm:bg-gradient-to-t max-sm:from-gn-black max-sm:via-gn-black/80 max-sm:to-transparent max-sm:pt-28">
                    <h2 className="font-serif text-base font-semibold text-gn-ink max-sm:text-xl max-sm:text-gn-cream">{dept.name}</h2>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gn-ink/60 max-sm:flex-none max-sm:text-gn-cream/90 sm:flex-1">{dept.description}</p>
                    {dept.registrationOpen ? (
                      <span className="mt-3 inline-block w-fit rounded-full bg-gn-gold px-3 py-1 text-xs font-semibold text-gn-black">
                        Inscriptions ouvertes
                      </span>
                    ) : (
                      <span className="mt-3 inline-block text-xs text-gn-muted-strong max-sm:text-gn-cream/80">Inscriptions fermées</span>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </AutoScrollBand>
          <p className="mx-auto mt-3 max-w-md px-5 text-center text-xs text-gn-muted-strong">
            La bande s&apos;arrête quand vous la touchez ou posez la souris dessus : faites-la alors glisser pour parcourir les départements.
          </p>
        </Reveal>
      </div>
    </div>
  );
}
