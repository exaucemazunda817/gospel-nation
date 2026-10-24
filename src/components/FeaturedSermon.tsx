import Image from 'next/image';
import Link from 'next/link';
import type { Sermon } from '@prisma/client';
import Reveal from '@/components/Reveal';
import SermonCover from '@/components/SermonCover';
import ShareButtons from '@/components/ShareButtons';
import { SITE_URL } from '@/lib/site';
import { fr } from '@/lib/typo';
import { formatSermonDate, themeOf } from '@/lib/sermons';

// Vedette de l'accueil (14/10/2026) : la dernière prédication en grand, avec la
// lueur de sa miniature (même langage que sa page), puis les deux précédentes en
// petit. C'est la seule audace de l'accueil : le contenu principal de l'église.
export default function FeaturedSermon({ sermons }: { sermons: Sermon[] }) {
  const [latest, ...others] = sermons;

  return (
    <section className="relative overflow-hidden bg-gn-black">
      {latest?.coverImageUrl && (
        <div aria-hidden="true" className="gn-ambient pointer-events-none absolute inset-x-0 top-0 h-[460px]">
          <Image src={latest.coverImageUrl} alt="" fill sizes="96px" quality={30} className="object-cover" />
        </div>
      )}
      <div className="relative mx-auto max-w-6xl px-5 py-11 sm:px-10 sm:py-14">
        <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-x-4 gap-y-1 sm:mb-8">
          <div>
            <h2 className="font-serif text-3xl font-semibold text-gn-cream">Dernière prédication</h2>
            <p className="mt-2 max-w-measure text-sm text-gn-cream/75">Les messages du dimanche et des séminaires, à réécouter quand vous voulez.</p>
          </div>
          <Link
            href="/predications/catalogue"
            className="inline-flex min-h-[44px] items-center text-sm font-semibold text-gn-gold hover:underline"
          >
            Voir toutes les prédications
          </Link>
        </Reveal>

        {!latest ? (
          <p className="text-sm text-gn-cream/75">Aucune prédication publiée pour le moment.</p>
        ) : (
          <>
            <Reveal delay={0.05}>
              <div className="grid items-center gap-7 lg:grid-cols-[1.55fr_1fr] lg:gap-10">
                <Link
                  href={`/predications/${latest.id}`}
                  aria-label={`Écouter : ${latest.title}`}
                  className="gn-spot gn-spot-strong group relative block aspect-video overflow-hidden rounded-lg bg-gn-black-soft"
                >
                  {latest.coverImageUrl && (
                    <SermonCover src={latest.coverImageUrl} priority sizes="(max-width: 1024px) 100vw, 60vw" />
                  )}
                  <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-black/20 transition-colors group-hover:from-black/55" />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="gn-play-ring relative flex h-20 w-20 items-center justify-center rounded-full border border-gn-gold/70 bg-gn-black/65 backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="var(--gn-gold)" aria-hidden="true">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </span>
                </Link>
                <div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gn-cream/80">
                    <span className="font-semibold text-gn-cream">{latest.speaker}</span>
                    <span aria-hidden="true" className="h-1 w-1 rounded-full bg-gn-gold" />
                    <time dateTime={new Date(latest.date).toISOString().slice(0, 10)}>{formatSermonDate(latest.date)}</time>
                  </div>
                  <h3 className="mt-3 font-serif text-3xl font-semibold leading-tight text-gn-cream sm:text-hero">
                    {fr(latest.title)}
                  </h3>
                  <span className="mt-4 inline-block rounded-full bg-gn-gold/15 px-3.5 py-1.5 text-xs font-semibold text-gn-gold-light">
                    {themeOf(latest)}
                  </span>
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Link
                      href={`/predications/${latest.id}`}
                      className="inline-flex min-h-[44px] items-center rounded-full bg-gn-gold px-6 text-sm font-semibold text-gn-on-gold transition-colors hover:bg-gn-gold-light"
                    >
                      Écouter
                    </Link>
                    <ShareButtons
                      title={latest.title}
                      path={`/predications/${latest.id}`}
                      fallbackUrl={`${SITE_URL}/predications/${latest.id}`}
                      copy={false}
                    />
                  </div>
                </div>
              </div>
            </Reveal>

            {others.length > 0 && (
              <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-2">
                <h3 className="sr-only">Prédications précédentes</h3>
                {others.map((sermon, index) => (
                  <Reveal key={sermon.id} delay={0.06 + index * 0.06}>
                    <Link
                      href={`/predications/${sermon.id}`}
                      className="gn-spot gn-spot-strong group flex items-center gap-4 rounded-lg border border-white/12 p-3 transition-colors hover:border-gn-gold"
                    >
                      <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-lg bg-gn-black-soft sm:w-32">
                        {sermon.coverImageUrl && (
                          <Image src={sermon.coverImageUrl} alt="" fill sizes="128px" className="object-cover" />
                        )}
                        <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/10">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gn-gold/60 bg-gn-black/60">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="var(--gn-gold)" aria-hidden="true">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </span>
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="line-clamp-2 font-serif text-base font-semibold leading-snug text-gn-cream">{fr(sermon.title)}</p>
                        <p className="mt-1 text-xs text-gn-muted">
                          {sermon.speaker}, {formatSermonDate(sermon.date)}
                        </p>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
