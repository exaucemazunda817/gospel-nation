import type { Metadata } from 'next';
import Link from 'next/link';
import HeroBackground from '@/components/HeroBackground';
import Reveal from '@/components/Reveal';
import ValveText from '@/components/ValveText';
import { fr } from '@/lib/typo';
import { prisma } from '@/lib/prisma';
import TestimonyForm from './TestimonyForm';
import { isHttpUrl } from '@/lib/validation';

// Régénérée au plus toutes les 60 s : sinon figée au build ; ménage aussi la base Neon.
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Témoignages',
  description:
    'Ce que Dieu accomplit dans la vie des membres de Gospel Nation — et si c\'était votre tour ?'
};

type Testimony = { id: string; authorName: string; content: string; videoUrl: string | null };

function TestimoniesList({ testimonies }: { testimonies: Testimony[] }) {
  return (
    <ul className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
      {testimonies.map((t, index) => (
        <li key={t.id}>
          <Reveal className="h-full" delay={(index % 3) * 0.06}>
            <article className="gn-card-lift gn-spot flex h-full flex-col gap-3 rounded-lg border border-gn-line bg-white p-6">
              <span aria-hidden="true" className="font-serif text-5xl leading-none text-gn-gold">“</span>
              <ValveText text={t.content} />
              <p className="mt-auto border-t border-gn-line pt-3 font-serif text-sm font-semibold text-gn-ink">{t.authorName}</p>
              {isHttpUrl(t.videoUrl) && (
                <a
                  href={t.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center text-sm font-semibold text-gn-gold-dark hover:underline"
                >
                  Voir la vidéo
                </a>
              )}
            </article>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

export default async function TemoignagesPage() {
  // wantsPublished en plus du statut APPROVED : sécurité en double, même si
  // un administrateur approuvait par erreur un témoignage dont l'auteur
  // n'avait pas coché l'accord de publication.
  const testimonies = await prisma.testimony.findMany({
    where: { status: 'APPROVED', wantsPublished: true },
    orderBy: { createdAt: 'desc' },
    select: { id: true, authorName: true, content: true, videoUrl: true }
  });

  return (
    <div className="bg-gn-cream-bg">
      <section data-page-hero className="relative h-[320px] overflow-hidden border-b border-gn-gold/20 bg-gn-black sm:h-[380px]">
        <HeroBackground first="/hero/temoignages.jpg" position="object-top" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gn-black/85 via-gn-black/55 to-gn-black/30 sm:bg-gradient-to-r sm:from-gn-black/85 sm:via-gn-black/50 sm:to-gn-black/20" />
        <div className="gn-glow pointer-events-none absolute inset-0" />
        <Reveal className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-5 pt-[88px] sm:px-10 sm:pt-[104px]">
          <p className="mb-1 text-xs text-gn-cream/80">
            <Link href="/" className="inline-flex min-h-[44px] items-center hover:text-gn-gold">Accueil</Link> / <span className="text-gn-gold-light">Témoignages</span>
          </p>
          <h1 className="font-serif text-3xl font-bold text-gn-cream sm:text-hero">Témoignages</h1>
          <p className="mt-3.5 max-w-md text-sm text-gn-cream/90">
            {fr("Ce que Dieu accomplit dans la vie des membres de Gospel Nation. Et si c'était à votre tour de partager le vôtre ?")}
          </p>
        </Reveal>
      </section>

      {/* Sans témoignage publié, pas de boîte vide : l'invitation à témoigner vient directement. */}
      {testimonies.length > 0 && (
        <section className="bg-gn-cream-bg">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-10 sm:py-16">
            <Reveal>
              <h2 className="mb-8 font-serif text-3xl font-semibold text-gn-ink">Ils témoignent</h2>
            </Reveal>
            <TestimoniesList testimonies={testimonies} />
          </div>
        </section>
      )}

      <section id="temoigner" className="gn-glow relative overflow-hidden bg-gn-black">
        <Reveal className="relative mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-10 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal>
            <div className="flex flex-col gap-4">
              <h2 className="font-serif text-3xl font-semibold leading-snug text-gn-cream">
                Partagez votre témoignage
              </h2>
              <p className="max-w-measure text-sm leading-relaxed text-gn-muted">
                Racontez ce que Dieu a fait dans votre vie : votre histoire peut encourager toute l&apos;église.
              </p>
              <p className="max-w-measure text-sm leading-relaxed text-gn-muted">
                Votre témoignage n&apos;est publié que si vous cochez l&apos;accord de publication, et après relecture
                par l&apos;équipe. Vous pouvez signer de votre prénom seulement.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="relative rounded-2xl bg-gn-cream-bg p-7 sm:p-10">
              <span className="gn-beam" aria-hidden="true" />
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
