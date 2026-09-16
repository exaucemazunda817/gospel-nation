import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PlaceholderNote from '@/components/PlaceholderNote';
import Reveal from '@/components/Reveal';
import { prisma } from '@/lib/prisma';
import { temoignagesPlaceholder } from '@/lib/content';
import TestimonyForm from './TestimonyForm';

export const metadata: Metadata = {
  title: 'Témoignages'
};

export default async function TemoignagesPage() {
  const testimonies = await prisma.testimony.findMany({
    where: { status: 'APPROVED' },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="bg-gn-cream-bg">
      <section className="relative h-[220px] overflow-hidden border-b border-gn-gold/20 bg-gn-black sm:h-[260px]">
        <Image src="/hero/temoignages.jpg" alt="" fill className="object-cover object-top" />
        <div className="pointer-events-none absolute inset-0 bg-gn-black/40" />
        <div className="gn-glow pointer-events-none absolute inset-0" />
        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-5 sm:px-10">
          <p className="mb-3.5 text-xs text-gn-muted">
            <Link href="/" className="hover:text-gn-gold">Accueil</Link> / <span className="text-gn-gold">Témoignages</span>
          </p>
          <h1 className="font-serif text-3xl font-bold text-gn-cream sm:text-[38px]">Témoignages</h1>
          <p className="mt-3.5 max-w-md text-sm text-gn-muted">
            Ce que Dieu accomplit dans la vie des membres de Gospel Nation — et si c&apos;était votre tour de
            partager le vôtre ?
          </p>
        </div>
      </section>

      <section className="bg-gn-cream-bg">
        <div className="mx-auto max-w-6xl px-5 pb-6 pt-14 sm:px-10 sm:pt-16">
          {testimonies.length === 0 ? (
            <PlaceholderNote>{temoignagesPlaceholder}</PlaceholderNote>
          ) : (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {testimonies.map((t, index) => (
                <Reveal key={t.id} delay={index * 0.06}>
                  <article className="flex h-full flex-col gap-4 rounded-lg border border-gn-line bg-white p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#eee7d6] to-[#e3dabd]">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a8946a" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="9" cy="8" r="3.2" />
                          <path d="M2.5 19c.6-3 3.2-5 6.5-5s5.9 2 6.5 5" />
                          <circle cx="17.5" cy="9" r="2.6" />
                          <path d="M15.8 14.2c2.6.4 4.6 2.1 5.1 4.4" />
                        </svg>
                      </div>
                      <p className="font-serif text-[14.5px] font-semibold text-gn-ink">{t.authorName}</p>
                    </div>
                    <p className="text-[13px] italic leading-relaxed text-gn-ink/60">« {t.content} »</p>
                    {t.videoUrl && (
                      <a
                        href={t.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto flex items-center gap-1.5 text-[12.5px] font-semibold text-gn-gold-line hover:underline"
                      >
                        Voir la vidéo
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </a>
                    )}
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="gn-glow relative overflow-hidden bg-gn-black">
        <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-10 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal>
            <div className="flex flex-col gap-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gn-gold">Votre histoire compte</p>
              <h2 className="font-serif text-[28px] font-semibold leading-snug text-gn-cream">
                Partagez votre témoignage
              </h2>
              <p className="text-sm leading-relaxed text-gn-muted">
                Racontez ce que Dieu a fait dans votre vie. Votre témoignage sera publié sur le site après
                vérification par un administrateur.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="rounded-xl bg-gn-cream-bg p-7 sm:p-10">
              <p className="mb-1 font-serif text-xl font-semibold text-gn-ink">Formulaire de témoignage</p>
              <p className="mb-6 text-xs text-gn-muted">Remplissez ce formulaire pour partager ce que Dieu a fait pour vous.</p>
              <TestimonyForm />
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
