import Image from 'next/image';
import Link from 'next/link';
import type { Sermon } from '@prisma/client';
import AutoScrollBand from '@/components/AutoScrollBand';
import { BackLink } from '@/components/BackLink';
import Reveal from '@/components/Reveal';
import ShareButtons from '@/components/ShareButtons';
import YoutubePlayer from '@/components/YoutubePlayer';
import { SITE_URL } from '@/lib/site';
import { fr } from '@/lib/typo';
import { formatSermonDate, pickSuggestions, themeOf, toSummary, youtubeId, type SermonSummary } from '@/lib/sermons';

const SUGGESTION_COUNT = 6;

function Chevron({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0" aria-hidden="true">
      <path d={direction === 'left' ? 'm15 6-6 6 6 6' : 'm9 6 6 6-6 6'} />
    </svg>
  );
}

function PlayBadge() {
  return (
    <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/10">
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gn-gold/60 bg-gn-black/60 backdrop-blur-sm">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--gn-gold)" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </span>
  );
}

// Voisine chronologique (plus ancienne ou plus récente) de la prédication ouverte.
function Neighbour({ sermon, direction }: { sermon: SermonSummary; direction: 'older' | 'newer' }) {
  return (
    <Link
      href={`/predications/${sermon.id}`}
      className={`group flex items-center gap-4 rounded-lg border border-white/10 p-3 transition-colors hover:border-gn-gold ${
        direction === 'newer' ? 'sm:flex-row-reverse sm:text-right' : ''
      }`}
    >
      <span className="text-gn-gold">
        <Chevron direction={direction === 'older' ? 'left' : 'right'} />
      </span>
      <div className="relative aspect-video w-24 shrink-0 overflow-hidden rounded-lg bg-gn-black-soft">
        {sermon.coverImageUrl && <Image src={sermon.coverImageUrl} alt="" fill sizes="96px" className="object-cover" />}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gn-muted">{direction === 'older' ? 'Prédication plus ancienne' : 'Prédication plus récente'}</p>
        <p className="mt-1 line-clamp-2 font-serif text-base font-semibold leading-snug text-gn-cream">{fr(sermon.title)}</p>
      </div>
    </Link>
  );
}

function SuggestionCard({ sermon }: { sermon: SermonSummary }) {
  return (
    <Link
      href={`/predications/${sermon.id}`}
      draggable={false}
      className="gn-card-lift gn-spot group flex w-full flex-col overflow-hidden rounded-lg border border-gn-line bg-white"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-gn-black-soft to-gn-black">
        {sermon.coverImageUrl && (
          <Image src={sermon.coverImageUrl} alt="" fill sizes="(max-width: 640px) 78vw, 300px" draggable={false} className="object-cover" />
        )}
        <PlayBadge />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="line-clamp-2 font-serif text-base font-semibold leading-snug text-gn-ink">{fr(sermon.title)}</p>
        <p className="mt-2 text-xs text-gn-muted-strong">
          {sermon.speaker}, {formatSermonDate(sermon.date)}
        </p>
      </div>
    </Link>
  );
}

// Prédication choisie : le lecteur occupe toute la largeur de l'écran, sur un fond
// sombre qui se prolonge sous la vidéo avec une lueur de la couleur de la
// miniature, puis le titre et les actions, la prédication voisine, et enfin les
// suggestions. `titleAs` : « h1 » sur la page propre à une prédication, « h2 »
// sur /predications où le bandeau porte déjà le « h1 ».
export default function SermonView({
  featured,
  all,
  titleAs = 'h2'
}: {
  featured: Sermon;
  all: Sermon[];
  titleAs?: 'h1' | 'h2';
}) {
  const summaries = all.map(toSummary);
  const suggestions = pickSuggestions(toSummary(featured), summaries, SUGGESTION_COUNT);
  const videoId = youtubeId(featured.videoUrl);
  const theme = themeOf(featured);
  const Title = titleAs;

  // `all` est trié de la plus récente à la plus ancienne.
  const index = summaries.findIndex((s) => s.id === featured.id);
  const newer = index > 0 ? summaries[index - 1] : null;
  const older = index >= 0 && index < summaries.length - 1 ? summaries[index + 1] : null;

  return (
    <>
      {/* Scène : le lecteur sur toute la largeur de l'écran. */}
      <section className="bg-gn-black">
        {titleAs === 'h1' && (
          <div className="px-5 pb-5 pt-2 sm:px-10">
            <div className="mx-auto max-w-6xl">
              <BackLink fallbackHref="/predications" tone="dark" />
            </div>
          </div>
        )}
        <div className={titleAs === 'h1' ? '' : 'pt-8 sm:pt-12'}>
          {videoId ? (
            <YoutubePlayer videoId={videoId} title={featured.title} coverUrl={featured.coverImageUrl} />
          ) : (
            <div className="relative mx-auto aspect-video max-h-[75vh] w-full overflow-hidden bg-gn-black">
              {featured.coverImageUrl && (
                <Image src={featured.coverImageUrl} alt="" fill priority sizes="100vw" className="object-cover" />
              )}
            </div>
          )}
        </div>
      </section>

      {/* Titre et actions, dans le prolongement de la scène. */}
      <section className="relative overflow-hidden bg-gn-black">
        {featured.coverImageUrl && (
          <div aria-hidden="true" className="gn-ambient pointer-events-none absolute inset-x-0 top-0 h-[360px]">
            <Image src={featured.coverImageUrl} alt="" fill sizes="96px" quality={30} className="object-cover" />
          </div>
        )}
        <div className="relative mx-auto max-w-4xl px-5 py-10 sm:px-10 sm:py-14">
          <Reveal>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gn-cream/80">
              <span className="font-semibold text-gn-cream">{featured.speaker}</span>
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-gn-gold" />
              <time dateTime={new Date(featured.date).toISOString().slice(0, 10)}>{formatSermonDate(featured.date)}</time>
            </div>
            <Title className="mt-3 max-w-[26ch] font-serif text-3xl font-semibold leading-tight text-gn-cream sm:text-hero">
              {fr(featured.title)}
            </Title>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-gn-gold/15 px-3.5 py-1.5 text-xs font-semibold text-gn-gold-light">{theme}</span>
              {featured.series && (
                <span className="rounded-full border border-white/20 px-3.5 py-1.5 text-xs font-semibold text-gn-cream/80">
                  Série : {featured.series}
                </span>
              )}
            </div>
            {featured.notesContent && (
              <p className="mt-7 max-w-measure whitespace-pre-line text-base leading-relaxed text-gn-cream/85">
                {featured.notesContent}
              </p>
            )}
            <div className="mt-8 flex flex-col gap-4">
              <ShareButtons title={featured.title} path={`/predications/${featured.id}`} fallbackUrl={`${SITE_URL}/predications/${featured.id}`} />
              {(featured.documentUrl || featured.videoUrl) && (
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  {featured.documentUrl && (
                    <a
                      href={featured.documentUrl}
                      download
                      className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-gn-gold-light transition-colors hover:text-gn-gold"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                        <path d="M12 3v12" />
                        <path d="m7 10 5 5 5-5" />
                        <path d="M5 21h14" />
                      </svg>
                      Télécharger les notes (PDF)
                    </a>
                  )}
                  {featured.videoUrl && (
                    <a
                      href={featured.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center text-sm font-semibold text-gn-cream/80 underline-offset-4 transition-colors hover:text-gn-gold hover:underline"
                    >
                      Voir sur YouTube
                    </a>
                  )}
                </div>
              )}
            </div>
          </Reveal>

          {(older || newer) && (
            <Reveal delay={0.05}>
              <nav aria-label="Autres prédications" className="mt-12 grid gap-3 border-t border-white/10 pt-8 sm:grid-cols-2">
                {older ? <Neighbour sermon={older} direction="older" /> : <span aria-hidden="true" className="hidden sm:block" />}
                {newer && <Neighbour sermon={newer} direction="newer" />}
              </nav>
            </Reveal>
          )}
        </div>
      </section>

      {suggestions.length > 0 && (
        <section className="bg-gn-cream-bg py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-5 sm:px-10">
            <Reveal>
              <h2 className="mb-2 font-serif text-2xl font-semibold text-gn-ink">Vous aimerez aussi écouter</h2>
              <p className="mb-8 max-w-measure text-sm text-gn-muted-strong">
                Des messages de la même série, du même thème ou du même prédicateur.
              </p>
            </Reveal>
          </div>
          {suggestions.length >= 3 ? (
            <AutoScrollBand label="Prédications suggérées">
              {suggestions.map((sermon) => (
                <div key={sermon.id} className="flex w-[78vw] max-w-[320px] shrink-0 sm:w-[300px]">
                  <SuggestionCard sermon={sermon} />
                </div>
              ))}
            </AutoScrollBand>
          ) : (
            <div className="mx-auto grid max-w-6xl gap-4 px-5 sm:grid-cols-2 sm:px-10">
              {suggestions.map((sermon) => (
                <SuggestionCard key={sermon.id} sermon={sermon} />
              ))}
            </div>
          )}
          <Reveal>
            <div className="mt-10 text-center">
              <Link
                href="/predications/catalogue"
                className="inline-flex min-h-[44px] items-center rounded-full bg-gn-gold px-7 py-3 text-sm font-semibold text-gn-on-gold transition-colors hover:bg-gn-gold-light"
              >
                Voir le catalogue des prédications
              </Link>
            </div>
          </Reveal>
        </section>
      )}
    </>
  );
}
