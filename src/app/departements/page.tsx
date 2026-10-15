import type { Metadata } from 'next';
import DepartmentLogo from '@/components/DepartmentLogo';
import Link from 'next/link';
import AutoScrollBand from '@/components/AutoScrollBand';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { prisma } from '@/lib/prisma';
import { DEPARTMENT_FAMILIES, departmentFamily, departmentSummary } from '@/lib/departments';
import { fr } from '@/lib/typo';
import DepartmentGrid from './DepartmentGrid';

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

      <div className="bg-white py-12 sm:py-16">
        <Reveal className="mx-auto mb-10 max-w-3xl px-5 text-center sm:px-10">
          <p className="font-serif text-2xl font-semibold leading-snug text-gn-ink sm:text-3xl">
            {fr(`${departments.length} départements, une seule mission`)}
          </p>
          <p className="mt-4 text-base leading-relaxed text-gn-ink/70">
            {fr("Notre mission : impacter le monde à travers les 7 secteurs d'influence. Chacun de ces départements est une façon d'y servir.")}
          </p>
        </Reveal>
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
                      <DepartmentLogo slug={dept.slug} name={dept.name} sizes="(max-width: 640px) 40vw, 240px" cover />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gn-black-soft to-gn-black">
                        <span className="font-serif text-3xl font-bold text-gn-gold">{dept.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6 max-sm:relative max-sm:justify-end max-sm:bg-gradient-to-t max-sm:from-gn-black max-sm:via-gn-black/80 max-sm:to-transparent max-sm:pt-28">
                    <h2 className="font-serif text-base font-semibold text-gn-ink max-sm:text-xl max-sm:text-gn-cream">{dept.name}</h2>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gn-ink/60 max-sm:flex-none max-sm:text-gn-cream/90 sm:flex-1">{fr(departmentSummary(dept))}</p>
                    {dept.registrationOpen ? (
                      <span className="mt-3 inline-block w-fit rounded-full bg-gn-gold px-3 py-1 text-xs font-semibold text-gn-black">
                        Inscriptions ouvertes
                      </span>
                    ) : (
                      <span className="mt-3 inline-block text-sm font-semibold text-gn-gold-dark max-sm:text-gn-gold-light">En savoir plus →</span>
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

      {/* Tous les départements, par famille */}
      <section className="bg-gn-cream-bg py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-10">
          <Reveal>
            <h2 className="mb-2 font-serif text-3xl font-semibold text-gn-ink">Trouver mon département</h2>
            <p className="mb-8 max-w-measure text-sm text-gn-muted-strong">
              Choisissez une famille pour ne voir que les départements qui vous correspondent.
            </p>
          </Reveal>
          <DepartmentGrid
            departments={departments.map((d) => ({
              slug: d.slug,
              name: d.name,
              summary: departmentSummary(d),
              family: departmentFamily(d.slug),
              hasLogo: Boolean(d.imageUrl),
              registrationOpen: d.registrationOpen
            }))}
            families={[...DEPARTMENT_FAMILIES, ...(departments.some((d) => departmentFamily(d.slug) === 'Autres') ? ['Autres'] : [])]}
          />
        </div>
      </section>

      {/* Appel final */}
      <section className="gn-glow relative overflow-hidden bg-gn-black">
        <Reveal className="relative mx-auto max-w-6xl px-5 py-16 text-center sm:px-10 sm:py-20">
          <h2 className="mb-4 font-serif text-3xl font-semibold text-gn-cream">Vous ne savez pas où servir ?</h2>
          <p className="mx-auto mb-7 max-w-md text-sm text-gn-muted">
            Parlons-en avec le pasteur : il vous aidera à trouver la place où votre appel pourra porter du fruit.
          </p>
          <Link
            href="/rendez-vous"
            className="inline-flex min-h-[44px] items-center rounded-full bg-gradient-to-br from-gn-gold-light to-gn-gold px-8 text-xs font-bold uppercase tracking-wide text-gn-black transition-opacity hover:opacity-90"
          >
            Prendre rendez-vous
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
