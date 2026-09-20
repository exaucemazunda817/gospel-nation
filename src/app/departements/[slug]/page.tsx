import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHero from '@/components/PageHero';
import { prisma } from '@/lib/prisma';
import { gospelNewsIssues, nationClasseManuels, nationClasseProgram, oneLoveGallery, oneLoveOrg, oneLoveProject } from '@/lib/content';
import Reveal from '@/components/Reveal';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const dept = await prisma.department.findUnique({ where: { slug } });
  return { title: dept?.name ?? 'Département' };
}

export default async function DepartementDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const dept = await prisma.department.findUnique({ where: { slug } });

  if (!dept) notFound();

  const isNationClasse = slug === 'ecole-nation-classe';
  const isOneLove = slug === 'one-love';
  const isGospelNews = slug === 'gospel-news';

  return (
    <div className="bg-gn-cream-bg">
      <PageHero eyebrow={isNationClasse ? nationClasseProgram.tagline : 'Département'} title={dept.name} />

      <Reveal className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {dept.imageUrl && (
          <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-2xl">
            <Image src={dept.imageUrl} alt={dept.name} fill className="object-cover" />
          </div>
        )}
        <p className="max-w-measure text-base leading-relaxed text-gn-ink/75">
          {isNationClasse ? nationClasseProgram.vision : isOneLove ? oneLoveOrg.mission : dept.description}
        </p>

        {isOneLove && (
          <>
            <p className="mt-4 max-w-measure text-base italic leading-relaxed text-gn-ink/60">
              « {oneLoveOrg.vision} »
            </p>
            <ul className="mt-5 space-y-2">
              {oneLoveOrg.objectifs.map((objectif) => (
                <li key={objectif} className="flex gap-2.5 text-sm leading-relaxed text-gn-ink/70">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gn-gold" />
                  {objectif}
                </li>
              ))}
            </ul>
            <p className="mt-5 max-w-measure text-xs text-gn-muted-strong">
              Association One Love, fondée en {oneLoveOrg.foundedYear} par {oneLoveOrg.founders} —{' '}
              <a href={oneLoveOrg.websiteUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-gn-gold-line hover:underline">
                associationonelove.org
              </a>
            </p>

            <div className="mt-10 rounded-2xl border border-gn-line bg-white p-6 sm:p-7">
              <p className="font-serif text-base italic font-medium text-gn-gold-dark">
                Projet en cours · {oneLoveProject.partner}
              </p>
              <h2 className="mt-1 font-serif text-xl font-bold text-gn-ink">{oneLoveProject.name}</h2>
              <p className="mt-1 text-sm font-semibold text-gn-gold-line">{oneLoveProject.tagline}</p>
              <p className="mt-3 max-w-measure text-sm leading-relaxed text-gn-ink/70">{oneLoveProject.intro}</p>
              <p className="mt-3 max-w-measure text-sm leading-relaxed text-gn-ink/70">{oneLoveProject.description}</p>
              <p className="mt-3 max-w-measure text-sm leading-relaxed text-gn-ink/70">
                <span className="font-semibold text-gn-ink">Période : </span>
                {oneLoveProject.period}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-gn-ink/70">
                <span className="font-semibold text-gn-ink">Objectif : </span>
                {oneLoveProject.objectif}
              </p>
            </div>

            <div className="mt-10">
              <h2 className="font-serif text-lg font-bold text-gn-ink">En images</h2>
              <p className="mt-1 max-w-measure text-sm text-gn-ink/60">
                Photos du lancement de {oneLoveProject.name} — {oneLoveProject.firstMilestone.label},{' '}
                {oneLoveProject.firstMilestone.date}.
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {oneLoveGallery.map((photo) => (
                  <figure key={photo.src} className="overflow-hidden rounded-lg border border-gn-line bg-white">
                    <div className="relative aspect-[4/3] w-full">
                      <Image src={photo.src} alt={photo.caption} fill sizes="(max-width: 640px) 100vw, 380px" className="object-cover" />
                    </div>
                    <figcaption className="px-3.5 py-3 text-xs leading-relaxed text-gn-ink/65">
                      {photo.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-gn-line bg-white p-6">
              <h2 className="font-serif text-lg font-bold text-gn-ink">Vidéos et actualités</h2>
              <p className="mt-1 max-w-measure text-sm text-gn-ink/60">
                One Love publie régulièrement des vidéos (reels) de ses activités sur Facebook.
              </p>
              <a
                href={oneLoveOrg.facebookReelsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-[44px] items-center rounded-full bg-gn-gold px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-gn-black transition-opacity hover:opacity-90"
              >
                Voir les vidéos sur Facebook
              </a>
            </div>
          </>
        )}

        {isNationClasse && (
          <div className="mt-10 space-y-6">
            {nationClasseProgram.parcours.map((parcours, index) => (
              <div key={parcours.name} className="rounded-2xl border border-gn-line bg-white p-6 sm:p-7">
                <p className="font-serif text-base italic font-medium text-gn-gold-dark">
                  {index + 1}. {parcours.summary}
                </p>
                <h2 className="mt-1 font-serif text-xl font-bold text-gn-ink">{parcours.name}</h2>
                <p className="mt-1 text-sm font-semibold text-gn-gold-line">{parcours.subtitle}</p>
                <p className="mt-3 max-w-measure text-sm leading-relaxed text-gn-ink/70">{parcours.description}</p>
                <p className="mt-3 max-w-measure text-sm leading-relaxed text-gn-ink/70">
                  <span className="font-semibold text-gn-ink">Objectif : </span>
                  {parcours.objective}
                </p>
                <p className="mt-4 text-xs font-bold uppercase tracking-wide text-gn-muted-strong">
                  Modules ({parcours.modules.length})
                </p>
                <ol className="mt-2 grid gap-x-6 gap-y-1.5 text-sm text-gn-ink/80 sm:grid-cols-2">
                  {parcours.modules.map((module, moduleIndex) => (
                    <li key={module} className="flex gap-2">
                      <span className="text-gn-gold-dark">{moduleIndex + 1}.</span>
                      {module}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        )}

        {isNationClasse && nationClasseManuels.length > 0 && (
          <div className="mt-8">
            <h2 className="font-serif text-lg font-bold text-gn-ink">Manuels disponibles</h2>
            <p className="mt-1 max-w-measure text-sm text-gn-ink/60">
              Supports de cours des différents parcours de l&apos;École, téléchargeables au format PDF.
            </p>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {nationClasseManuels.map((manuel) => (
                <div key={manuel.fileUrl} className="gn-card-lift flex flex-col overflow-hidden rounded-lg border border-gn-line bg-white">
                  {manuel.coverUrl && (
                    <Image
                      src={manuel.coverUrl}
                      alt={manuel.module}
                      width={400}
                      height={230}
                      className="h-[160px] w-full object-cover object-top"
                    />
                  )}
                  <div className="flex flex-1 flex-col gap-2.5 p-5">
                    <span className="inline-flex w-fit items-center rounded-full bg-gn-gold/15 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-gn-gold-dark">
                      {manuel.parcours}
                    </span>
                    <p className="font-serif text-base font-semibold leading-snug text-gn-ink">{manuel.module}</p>
                    <a
                      href={manuel.fileUrl}
                      download
                      className="mt-auto inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-gn-gold px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-gn-black transition-opacity hover:opacity-90"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                        <path d="M12 3v12" />
                        <path d="m7 10 5 5 5-5" />
                        <path d="M5 21h14" />
                      </svg>
                      Télécharger le PDF
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isGospelNews && gospelNewsIssues.length > 0 && (
          <div className="mt-8">
            <h2 className="font-serif text-lg font-bold text-gn-ink">Revues publiées</h2>
            <p className="mt-1 max-w-measure text-sm text-gn-ink/60">
              Le journal trimestriel de Gospel Nation, téléchargeable au format PDF — à retrouver aussi dans la
              Bibliothèque.
            </p>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              {gospelNewsIssues.map((issue) => (
                <div key={issue.fileUrl} className="flex flex-col overflow-hidden rounded-lg border border-gn-line bg-white">
                  {issue.coverUrl && (
                    <Image
                      src={issue.coverUrl}
                      alt={`Gospel News Vol. ${issue.volume}`}
                      width={400}
                      height={230}
                      className="h-[190px] w-full object-cover object-top"
                    />
                  )}
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <p className="font-serif text-base font-semibold text-gn-ink">
                      Vol. {issue.volume} — {issue.date}
                    </p>
                    <a
                      href={issue.fileUrl}
                      download
                      className="mt-auto inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-gn-gold px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-gn-black transition-opacity hover:opacity-90"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                        <path d="M12 3v12" />
                        <path d="m7 10 5 5 5-5" />
                        <path d="M5 21h14" />
                      </svg>
                      Télécharger le PDF
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-gn-gold/30 bg-gn-black-soft p-6">
          {dept.registrationOpen ? (
            <>
              <h2 className="font-bold text-gn-gold">Inscriptions ouvertes</h2>
              <p className="mt-2 text-sm text-gn-cream/70">
                L&apos;inscription à ce département se fait depuis votre espace membre.
              </p>
              <Link
                href="/inscription"
                className="mt-4 inline-flex min-h-[44px] items-center rounded-full bg-gn-gold px-6 py-2.5 text-sm font-semibold text-gn-black transition-colors hover:bg-gn-gold-dark"
              >
                Devenir membre pour s&apos;inscrire
              </Link>
            </>
          ) : (
            <p className="text-sm text-gn-cream/60">
              Les inscriptions à ce département ne sont pas ouvertes pour le moment.
            </p>
          )}
        </div>

        <Link href="/departements" className="mt-8 inline-flex min-h-[44px] items-center text-sm text-gn-gold-line hover:underline">
          ← Retour aux départements
        </Link>
      </Reveal>
    </div>
  );
}
