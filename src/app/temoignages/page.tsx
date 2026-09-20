import type { Metadata } from 'next';
import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PlaceholderNote from '@/components/PlaceholderNote';
import Reveal from '@/components/Reveal';
import Skeleton from '@/components/Skeleton';
import { prisma } from '@/lib/prisma';
import { temoignagesPlaceholder } from '@/lib/content';
import TestimonyForm from './TestimonyForm';

// Régénérée au plus toutes les 60 s : sinon figée au build ; ménage aussi la base Neon.
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Témoignages',
  description:
    'Ce que Dieu accomplit dans la vie des membres de Gospel Nation — et si c\'était votre tour ?'
};

function TestimoniesSkeleton() {
  return (
    <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex h-full flex-col gap-4 rounded-lg border border-gn-line bg-white p-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
            <Skeleton className="h-4 w-28" />
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      ))}
    </div>
  );
}

async function TestimoniesList() {
  // wantsPublished en plus du statut APPROVED : sécurité en double, même si
  // un administrateur approuvait par erreur un témoignage dont l'auteur
  // n'avait pas coché l'accord de publication.
  const testimonies = await prisma.testimony.findMany({
    where: { status: 'APPROVED', wantsPublished: true },
    orderBy: { createdAt: 'desc' }
  });

  if (testimonies.length === 0) {
    return <PlaceholderNote>{temoignagesPlaceholder}</PlaceholderNote>;
  }

  return (
    <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
      {testimonies.map((t, index) => (
        <Reveal key={t.id} delay={index * 0.06}>
          <article className="gn-card-lift flex h-full flex-col gap-4 rounded-lg border border-gn-line bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gn-avatar-from to-gn-avatar-to">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gn-avatar-icon)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="8" r="3.2" />
                  <path d="M2.5 19c.6-3 3.2-5 6.5-5s5.9 2 6.5 5" />
                  <circle cx="17.5" cy="9" r="2.6" />
                  <path d="M15.8 14.2c2.6.4 4.6 2.1 5.1 4.4" />
                </svg>
              </div>
              <p className="font-serif text-sm font-semibold text-gn-ink">{t.authorName}</p>
            </div>
            <p className="text-sm italic leading-relaxed text-gn-ink/60">« {t.content} »</p>
            {t.videoUrl && (
              <a
                href={t.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex min-h-[44px] items-center text-xs font-semibold text-gn-gold-line hover:underline"
              >
                Voir la vidéo
              </a>
            )}
          </article>
        </Reveal>
      ))}
    </div>
  );
}

export default function TemoignagesPage() {
  return (
    <div className="bg-gn-cream-bg">
      <section className="relative h-[220px] overflow-hidden border-b border-gn-gold/20 bg-gn-black sm:h-[260px]">
        <Image src="/hero/temoignages.jpg" alt="" fill className="gn-kenburns object-cover object-top" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gn-black/85 via-gn-black/55 to-gn-black/30 sm:bg-gradient-to-r sm:from-gn-black/85 sm:via-gn-black/50 sm:to-gn-black/20" />
        <div className="gn-glow pointer-events-none absolute inset-0" />
        <Reveal className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-5 sm:px-10">
          <p className="mb-1 text-xs text-gn-cream/80">
            <Link href="/" className="inline-flex min-h-[44px] items-center hover:text-gn-gold">Accueil</Link> / <span className="text-gn-gold-light">Témoignages</span>
          </p>
          <h1 className="font-serif text-3xl font-bold text-gn-cream sm:text-hero">Témoignages</h1>
          <p className="mt-3.5 max-w-md text-sm text-gn-cream/90">
            Ce que Dieu accomplit dans la vie des membres de Gospel Nation — et si c&apos;était votre tour de
            partager le vôtre ?
          </p>
        </Reveal>
      </section>

      <section className="bg-gn-cream-bg">
        <Reveal className="mx-auto max-w-6xl px-5 pb-6 pt-14 sm:px-10 sm:pt-16">
          <Suspense fallback={<TestimoniesSkeleton />}>
            <TestimoniesList />
          </Suspense>
        </Reveal>
      </section>

      <section className="gn-glow relative overflow-hidden bg-gn-black">
        <Reveal className="relative mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-10 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal>
            <div className="flex flex-col gap-4">
              <p className="font-serif text-base italic font-medium text-gn-gold">Votre histoire compte</p>
              <h2 className="font-serif text-3xl font-semibold leading-snug text-gn-cream">
                Partagez votre témoignage
              </h2>
              <p className="text-sm leading-relaxed text-gn-muted">
                Racontez ce que Dieu a fait dans votre vie. Votre témoignage sera publié sur le site après
                vérification par un administrateur.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="rounded-2xl bg-gn-cream-bg p-7 sm:p-10">
              <p className="mb-1 font-serif text-xl font-semibold text-gn-ink">Formulaire de témoignage</p>
              <p className="mb-6 text-xs text-gn-muted-strong">Remplissez ce formulaire pour partager ce que Dieu a fait pour vous.</p>
              <TestimonyForm />
            </div>
          </Reveal>
        </Reveal>
      </section>
    </div>
  );
}
