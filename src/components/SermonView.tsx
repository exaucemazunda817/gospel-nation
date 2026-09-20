import Image from 'next/image';
import Link from 'next/link';
import type { Sermon } from '@prisma/client';
import Reveal from '@/components/Reveal';
import YoutubePlayer from '@/components/YoutubePlayer';
import { formatSermonDate, pickSuggestions, themeOf, toSummary, youtubeId } from '@/lib/sermons';

const SUGGESTION_COUNT = 6;

// Prédication choisie en grand format, suivie de « Vous aimerez aussi écouter »
// en miniatures, puis du lien vers le catalogue complet.
export default function SermonView({ featured, all }: { featured: Sermon; all: Sermon[] }) {
  const summaries = all.map(toSummary);
  const suggestions = pickSuggestions(toSummary(featured), summaries, SUGGESTION_COUNT);
  const videoId = youtubeId(featured.videoUrl);
  const theme = themeOf(featured);

  return (
    <>
      {/* Prédication choisie : le lecteur occupe toute la largeur de l'écran,
          avec un espace au-dessus pour ne pas être collé au bandeau. */}
      <section className="bg-gn-cream-bg pt-8 sm:pt-12">
        <Reveal>
          {videoId ? (
            <YoutubePlayer videoId={videoId} title={featured.title} coverUrl={featured.coverImageUrl} />
          ) : (
            <div className="relative mx-auto aspect-video max-h-[75vh] w-full overflow-hidden bg-gn-black">
              {featured.coverImageUrl && (
                <Image src={featured.coverImageUrl} alt="" fill priority sizes="100vw" className="object-cover" />
              )}
            </div>
          )}
        </Reveal>
      </section>

      <section className="border-b border-gn-line bg-white">
        <div className="mx-auto max-w-4xl px-5 py-10 sm:px-10 sm:py-12">
          <Reveal delay={0.08}>
            <div>
              <p className="mb-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-wide text-gn-gold-dark">
                <span>{formatSermonDate(featured.date)}</span>
                <span aria-hidden="true">·</span>
                <span>{featured.speaker}</span>
              </p>
              <h2 className="font-serif text-3xl font-semibold leading-snug text-gn-ink">{featured.title}</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-gn-gold/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-gn-gold-line">
                  {theme}
                </span>
                {featured.series && (
                  <span className="rounded-full border border-gn-line px-3 py-1 text-xs font-semibold text-gn-muted-strong">
                    Série : {featured.series}
                  </span>
                )}
              </div>
              {featured.notesContent && (
                <p className="mt-6 max-w-measure whitespace-pre-line text-base leading-relaxed text-gn-ink/80">
                  {featured.notesContent}
                </p>
              )}
              <div className="mt-6 flex flex-wrap items-center gap-4">
                {featured.documentUrl && (
                  <a
                    href={featured.documentUrl}
                    download
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-gn-gold px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-gn-black transition-opacity hover:opacity-90"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
                      <path d="M12 3v12" />
                      <path d="m7 10 5 5 5-5" />
                      <path d="M5 21h14" />
                    </svg>
                    Notes (PDF)
                  </a>
                )}
                {featured.videoUrl && (
                  <a
                    href={featured.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center text-sm font-semibold text-gn-gold-line hover:underline"
                  >
                    Voir sur YouTube
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {suggestions.length > 0 && (
        <section className="bg-gn-cream-bg">
          <div className="mx-auto max-w-4xl px-5 py-12 sm:px-10 sm:py-16">
            <Reveal>
              <p className="mb-2.5 font-serif text-base italic font-medium text-gn-gold-dark">À suivre</p>
              <h2 className="mb-8 font-serif text-2xl font-semibold text-gn-ink">Vous aimerez aussi écouter</h2>
            </Reveal>
            <div className="grid gap-4 md:grid-cols-2">
              {suggestions.map((sermon, index) => (
                <Reveal key={sermon.id} delay={index * 0.06}>
                  <Link
                    href={`/predications/${sermon.id}`}
                    className="gn-card-lift flex items-center gap-4 rounded-lg border border-gn-line bg-white p-3"
                  >
                    <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-gn-black-soft to-gn-black sm:w-32">
                      {sermon.coverImageUrl && (
                        <Image src={sermon.coverImageUrl} alt="" fill sizes="128px" className="object-cover" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="line-clamp-2 font-serif text-base font-semibold leading-snug text-gn-ink">{sermon.title}</p>
                      <p className="mt-1 text-xs text-gn-muted-strong">
                        {sermon.speaker} · {formatSermonDate(sermon.date)}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
            <Reveal>
              <div className="mt-10 text-center">
                <Link
                  href="/predications/catalogue"
                  className="inline-flex min-h-[44px] items-center rounded-full bg-gn-gold px-7 py-3 text-xs font-bold uppercase tracking-wide text-gn-black transition-opacity hover:opacity-90"
                >
                  Voir le catalogue des prédications
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}
