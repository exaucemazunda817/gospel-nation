import CopyButton from '@/components/CopyButton';
import Reveal from '@/components/Reveal';
import YoutubePlayer from '@/components/YoutubePlayer';
import { YOUTUBE_LIVE_URL, type LiveStatus } from '@/lib/youtube-live';
import { formatEventDateTime } from '@/lib/dates';

function LiveDot() {
  return (
    <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75 motion-reduce:hidden" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-600" />
    </span>
  );
}

// Ligne « Direct » posée dans la bande Prochain culte / Lieu de l'accueil.
export function LiveStrip({ live }: { live: LiveStatus }) {
  return (
    <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-5 gap-y-3 border-t border-gn-line px-5 py-4 sm:px-10">
      <div className="flex items-center gap-3">
        {live.status === 'live' ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
            <LiveDot /> En direct
          </span>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gn-gold-line)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="2" />
            <path d="M16.2 7.8a6 6 0 0 1 0 8.4M7.8 16.2a6 6 0 0 1 0-8.4M19 5a10 10 0 0 1 0 14M5 19A10 10 0 0 1 5 5" />
          </svg>
        )}
        <p className="text-sm text-gn-ink">
          {live.status === 'live'
            ? 'Notre culte est diffusé en ce moment.'
            : live.status === 'upcoming' && live.startsAt
              ? `Prochain direct : ${formatEventDateTime(live.startsAt)}.`
              : 'Nos cultes du dimanche et du mercredi sont diffusés en direct sur YouTube.'}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {live.status === 'live' ? (
          <a
            href="#direct"
            className="inline-flex min-h-[44px] items-center rounded-full bg-red-600 px-5 text-xs font-bold uppercase tracking-wide text-white transition-opacity hover:opacity-90"
          >
            Regarder maintenant
          </a>
        ) : (
          <a
            href={YOUTUBE_LIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center rounded-full bg-gn-black px-5 text-xs font-bold uppercase tracking-wide text-gn-cream transition-opacity hover:opacity-90"
          >
            Suivre le direct
          </a>
        )}
        <CopyButton text={YOUTUBE_LIVE_URL} label="Copier le lien du live" />
      </div>
    </div>
  );
}

// Lecteur du direct, sur l'accueil, uniquement quand un culte est diffusé.
export function LivePlayer({ live }: { live: LiveStatus }) {
  if (live.status !== 'live') return null;
  return (
    <section id="direct" aria-labelledby="direct-titre" className="scroll-mt-24 bg-gn-black">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-10 sm:py-12">
        <Reveal className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-red-500">
              <LiveDot /> En direct maintenant
            </p>
            <h2 id="direct-titre" className="mt-2 font-serif text-3xl font-semibold text-gn-cream">{live.title}</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`https://www.youtube.com/watch?v=${live.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center text-sm font-semibold text-gn-gold hover:underline"
            >
              Ouvrir sur YouTube
            </a>
            <CopyButton text={YOUTUBE_LIVE_URL} label="Copier le lien du live" tone="dark" />
          </div>
        </Reveal>
        <div className="overflow-hidden rounded-lg">
          <YoutubePlayer videoId={live.videoId} title={live.title} coverUrl={`https://img.youtube.com/vi/${live.videoId}/hqdefault_live.jpg`} />
        </div>
      </div>
    </section>
  );
}
