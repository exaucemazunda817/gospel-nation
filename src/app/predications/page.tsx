import type { Metadata } from 'next';
import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PlaceholderNote from '@/components/PlaceholderNote';
import Reveal from '@/components/Reveal';
import Skeleton from '@/components/Skeleton';
import { prisma } from '@/lib/prisma';
import { predicationsPlaceholder } from '@/lib/content';

// Régénérée au plus toutes les 60 s : sinon figée au build ; ménage aussi la base Neon.
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Prédications',
  description:
    'Réécoutez et relisez les messages prêchés à Gospel Nation, classés par date.'
};

function SermonsGridSkeleton() {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex h-full flex-col gap-3.5 rounded-lg bg-white p-4 shadow-sm">
          <Skeleton className="h-[170px] w-full" />
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

async function SermonsList() {
  const sermons = await prisma.sermon.findMany({ orderBy: { date: 'desc' } });

  if (sermons.length === 0) {
    return <PlaceholderNote>{predicationsPlaceholder}</PlaceholderNote>;
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {sermons.map((sermon, index) => (
        <Reveal key={sermon.id} delay={index * 0.06}>
          <article className="gn-card-lift flex h-full flex-col gap-3.5 rounded-lg bg-white p-4 shadow-sm">
            {sermon.videoUrl ? (
              <a
                href={sermon.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex h-[170px] items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-gn-black-soft to-gn-black"
              >
                {sermon.coverImageUrl && (
                  <Image
                    src={sermon.coverImageUrl}
                    alt={sermon.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/35" />
                <div className="relative flex h-[52px] w-[52px] items-center justify-center rounded-full border border-gn-gold/50 bg-gn-cream/10 backdrop-blur-sm">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--gn-gold)">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </a>
            ) : (
              <div className="relative flex h-[170px] items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-gn-black-soft to-gn-black">
                <div
                  className="gn-radial-gold absolute inset-0 opacity-50"
                />
                <div className="relative flex h-[52px] w-[52px] items-center justify-center rounded-full border border-gn-gold/50 bg-gn-cream/10">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--gn-gold)">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}
            <div>
              <p className="mb-0.5 text-xs uppercase tracking-wide text-gn-gold-dark">
                {new Date(sermon.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                {sermon.series && ` — ${sermon.series}`}
              </p>
              <p className="font-serif text-base font-semibold text-gn-ink">{sermon.title}</p>
              <p className="mt-1 text-xs text-gn-muted-strong">{sermon.speaker}</p>
            </div>
            {sermon.notesContent && (
              <p className="line-clamp-4 text-sm leading-relaxed text-gn-ink/70">{sermon.notesContent}</p>
            )}
            <div className="mt-auto flex flex-wrap items-center gap-4 pt-1">
              {sermon.documentUrl && (
                <a
                  href={sermon.documentUrl}
                  download
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-gn-gold px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-gn-black transition-opacity hover:opacity-90"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                    <path d="M12 3v12" />
                    <path d="m7 10 5 5 5-5" />
                    <path d="M5 21h14" />
                  </svg>
                  Notes (PDF)
                </a>
              )}
              {sermon.videoUrl && (
                <a
                  href={sermon.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center text-xs font-semibold text-gn-gold-line hover:underline"
                >
                  Voir la vidéo
                </a>
              )}
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

export default function PredicationsPage() {
  return (
    <div className="bg-gn-cream-bg">
      <section className="relative h-[220px] overflow-hidden border-b border-gn-gold/20 bg-gn-black sm:h-[260px]">
        <Image src="/hero/predications.jpg" alt="" fill className="gn-kenburns object-cover object-top" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gn-black/85 via-gn-black/55 to-gn-black/30 sm:bg-gradient-to-r sm:from-gn-black/85 sm:via-gn-black/50 sm:to-gn-black/20" />
        <div className="gn-glow pointer-events-none absolute inset-0" />
        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-5 sm:px-10">
          <p className="mb-1 text-xs text-gn-cream/80">
            <Link href="/" className="inline-flex min-h-[44px] items-center hover:text-gn-gold">Accueil</Link> / <span className="text-gn-gold-light">Prédications</span>
          </p>
          <h1 className="font-serif text-3xl font-bold text-gn-cream sm:text-hero">Prédications</h1>
          <p className="mt-3.5 max-w-md text-sm text-gn-cream/90">
            Réécoutez et relisez les messages prêchés à Gospel Nation, classés par date.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-20">
        <Suspense fallback={<SermonsGridSkeleton />}>
          <SermonsList />
        </Suspense>
      </div>
    </div>
  );
}
