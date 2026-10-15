import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import EmptyState from '@/components/EmptyState';
import Reveal from '@/components/Reveal';
import { prisma } from '@/lib/prisma';
import { BackStrip } from '@/components/BackLink';
import CopyButton from '@/components/CopyButton';
import { fr } from '@/lib/typo';

// Régénérée au plus toutes les 60 s : sinon figée au build ; ménage aussi la base Neon.
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Dons'
};

const steps = [
  { title: 'Choisissez un moyen', text: 'Mobile Money ou virement, selon ce qui vous est le plus simple.' },
  { title: 'Envoyez votre don', text: 'Utilisez les coordonnées affichées ci-dessus. Le montant est libre.' },
  { title: 'Écrivez-nous si vous le souhaitez', text: 'Pour une confirmation ou une question, un message suffit.' }
];

export default async function DonsPage() {
  const methods = await prisma.donationMethod.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' }
  });

  return (
    <div className="bg-gn-cream-bg">
      <section className="relative h-[240px] overflow-hidden border-b border-gn-gold/20 bg-gn-black sm:h-[300px]">
        <Image src="/hero/dons.jpg" alt="" fill className="gn-kenburns object-cover object-top" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gn-black/85 via-gn-black/55 to-gn-black/30 sm:bg-gradient-to-r sm:from-gn-black/85 sm:via-gn-black/50 sm:to-gn-black/20" />
        <div className="gn-glow pointer-events-none absolute inset-0" />
        <Reveal className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-5 sm:px-10">
          <p className="mb-1 text-xs text-gn-cream/80">
            <Link href="/" className="inline-flex min-h-[44px] items-center hover:text-gn-gold">Accueil</Link> / <span className="text-gn-gold-light">Dons</span>
          </p>
          <h1 className="max-w-lg font-serif text-3xl font-bold leading-tight text-gn-cream sm:text-hero">
            Semer dans la maison de Dieu
          </h1>
          <p className="mt-3.5 max-w-lg text-sm text-gn-cream/90">
            Vos dons soutiennent la vie de l&apos;église et nos œuvres sociales, dont le ministère One Love
            auprès des enfants de la rue.
          </p>
        </Reveal>
      </section>

      <BackStrip />

      <section className="bg-gn-cream-bg">
        <Reveal className="mx-auto max-w-6xl px-5 py-14 sm:px-10 sm:py-16">
          <figure className="mx-auto mb-12 max-w-2xl border-l-2 border-gn-gold pl-5">
            <blockquote className="font-serif text-lg italic leading-relaxed text-gn-ink sm:text-xl">
              {fr("« Que chacun donne comme il l'a résolu en son cœur, sans tristesse ni contrainte ; car Dieu aime celui qui donne avec joie. »")}
            </blockquote>
            <figcaption className="mt-2 text-sm font-semibold text-gn-gold-dark">2 Corinthiens 9:7, Louis Segond</figcaption>
          </figure>

          <h2 className="mb-8 font-serif text-3xl font-semibold text-gn-ink">Choisissez un moyen de don</h2>
          {methods.length === 0 ? (
            <EmptyState
              title="Les moyens de don arrivent bientôt"
              text="Les coordonnées pour donner (Mobile Money, virement) seront publiées ici dès que l'église les aura confirmées. Pour toute question sur un don, écrivez-nous."
              action={{ href: `/contact?sujet=${encodeURIComponent('Question sur un don')}`, label: 'Nous contacter' }}
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {methods.map((method, index) => (
                <Reveal key={method.id} className="h-full" delay={index * 0.06}>
                  <div className="gn-card-lift gn-spot flex h-full flex-col gap-4 rounded-lg border border-gn-line bg-white p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gn-black">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gn-gold)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.1-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2.4z" />
                        </svg>
                      </div>
                      <h3 className="font-serif text-lg font-semibold text-gn-ink">{method.label}</h3>
                    </div>
                    <dl className="space-y-3 text-sm">
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-gn-muted-strong">Titulaire</dt>
                        <dd className="mt-0.5 font-semibold text-gn-ink">{method.accountName}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-gn-muted-strong">Numéro</dt>
                        <dd className="mt-0.5 break-all font-serif text-xl font-semibold tabular-nums text-gn-gold-dark">{method.accountValue}</dd>
                      </div>
                    </dl>
                    {method.instructions && <p className="text-sm leading-relaxed text-gn-muted-strong">{method.instructions}</p>}
                    <div className="mt-auto pt-1">
                      <CopyButton text={method.accountValue} label="Copier le numéro" />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </Reveal>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-10 sm:py-16">
          <Reveal>
            <h2 className="mb-8 font-serif text-3xl font-semibold text-gn-ink">Comment donner</h2>
          </Reveal>
          <ol className="grid gap-6 sm:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title}>
                <Reveal className="h-full" delay={index * 0.06}>
                  <div className="flex h-full gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gn-black font-serif text-lg font-bold text-gn-gold" aria-hidden="true">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-serif text-base font-semibold text-gn-ink">{step.title}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-gn-ink/70">{step.text}</p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="gn-glow relative overflow-hidden bg-gn-black">
        <Reveal className="relative mx-auto max-w-3xl px-5 py-14 text-center sm:px-10 sm:py-16">
          <h2 className="mb-4 font-serif text-3xl font-semibold text-gn-cream">Votre générosité à l&apos;œuvre</h2>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-gn-cream/80">
            Vos dons soutiennent la vie de l&apos;église et ses œuvres sociales, dont le ministère One Love auprès des enfants de la rue.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/departements/one-love"
              className="inline-flex min-h-[44px] items-center rounded-full bg-gradient-to-br from-gn-gold-light to-gn-gold px-7 text-xs font-bold uppercase tracking-wide text-gn-black transition-opacity hover:opacity-90"
            >
              Découvrir One Love
            </Link>
            <Link
              href={`/contact?sujet=${encodeURIComponent('Question sur un don')}`}
              className="inline-flex min-h-[44px] items-center rounded-full border border-gn-cream/35 px-7 text-xs font-semibold uppercase tracking-wide text-gn-cream transition-colors hover:border-gn-gold hover:text-gn-gold"
            >
              Une question sur un don ?
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
