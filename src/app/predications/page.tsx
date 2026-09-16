import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PlaceholderNote from '@/components/PlaceholderNote';
import Reveal from '@/components/Reveal';
import { prisma } from '@/lib/prisma';
import { predicationsPlaceholder } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Prédications'
};

export default async function PredicationsPage() {
  const sermons = await prisma.sermon.findMany({ orderBy: { date: 'desc' } });

  return (
    <div className="bg-gn-cream-bg">
      <section className="relative h-[220px] overflow-hidden border-b border-gn-gold/20 bg-gn-black sm:h-[260px]">
        <Image src="/hero/predications.jpg" alt="" fill className="object-cover object-top" />
        <div className="pointer-events-none absolute inset-0 bg-gn-black/40" />
        <div className="gn-glow pointer-events-none absolute inset-0" />
        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-5 sm:px-10">
          <p className="mb-3.5 text-xs text-gn-muted">
            <Link href="/" className="hover:text-gn-gold">Accueil</Link> / <span className="text-gn-gold">Prédications</span>
          </p>
          <h1 className="font-serif text-3xl font-bold text-gn-cream sm:text-[38px]">Prédications</h1>
          <p className="mt-3.5 max-w-md text-sm text-gn-muted">
            Réécoutez et relisez les messages prêchés à Gospel Nation, classés par date.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-20">
        {sermons.length === 0 ? (
          <PlaceholderNote>{predicationsPlaceholder}</PlaceholderNote>
        ) : (
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
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={sermon.coverImageUrl}
                          alt={sermon.title}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                        className="absolute inset-0 opacity-50"
                        style={{ background: 'radial-gradient(ellipse at 75% 15%, rgba(203,172,104,.35), transparent 60%)' }}
                      />
                      <div className="relative flex h-[52px] w-[52px] items-center justify-center rounded-full border border-gn-gold/50 bg-gn-cream/10">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--gn-gold)">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="mb-0.5 text-[11px] uppercase tracking-wide text-gn-gold-dark">
                      {new Date(sermon.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      {sermon.series && ` — ${sermon.series}`}
                    </p>
                    <p className="font-serif text-base font-semibold text-gn-ink">{sermon.title}</p>
                    <p className="mt-1 text-xs text-gn-muted">{sermon.speaker}</p>
                  </div>
                  {sermon.notesContent && (
                    <p className="line-clamp-4 text-[13px] leading-relaxed text-gn-ink/70">{sermon.notesContent}</p>
                  )}
                  <div className="mt-auto flex flex-wrap items-center gap-4 pt-1">
                    {sermon.documentUrl && (
                      <a
                        href={sermon.documentUrl}
                        download
                        className="inline-flex items-center gap-2 rounded bg-gn-gold px-4 py-2.5 text-[11.5px] font-bold uppercase tracking-wide text-gn-black transition-opacity hover:opacity-90"
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
                        className="text-[12.5px] font-semibold text-gn-gold-line hover:underline"
                      >
                        Voir la vidéo →
                      </a>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
