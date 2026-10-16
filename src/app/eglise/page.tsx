import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import HeroBackground from '@/components/HeroBackground';
import Reveal from '@/components/Reveal';
import { church } from '@/lib/content';
import { fr } from '@/lib/typo';

export const metadata: Metadata = {
  title: 'À propos'
};

const values = [
  {
    title: 'La Parole',
    description: 'La Bible comme fondement de notre foi et de notre enseignement.',
    path: <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21z" />
  },
  {
    title: 'La prière',
    description: 'Un dialogue constant avec Dieu, individuel et communautaire.',
    path: (
      <>
        <path d="M7 11V5a2 2 0 1 1 4 0v4" />
        <path d="M11 9V4a2 2 0 1 1 4 0v5" />
        <path d="M15 9.5V6a2 2 0 1 1 4 0v8a6 6 0 0 1-6 6h-1a6 6 0 0 1-5-2.7L4.3 13a1.6 1.6 0 0 1 2.4-2.1L7 11.5" />
      </>
    )
  },
  {
    title: 'La communauté',
    description: 'Grandir ensemble, se soutenir et marcher côte à côte.',
    path: (
      <>
        <circle cx="9" cy="8" r="3.2" />
        <path d="M2.5 19c.6-3 3.2-5 6.5-5s5.9 2 6.5 5" />
        <circle cx="17.5" cy="9" r="2.6" />
        <path d="M15.8 14.2c2.6.4 4.6 2.1 5.1 4.4" />
      </>
    )
  },
  {
    title: 'La mission',
    description: "Porter l'Évangile ici et au-delà de nos frontières.",
    path: (
      <>
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
        <line x1="3" y1="12" x2="21" y2="12" />
      </>
    )
  }
];

// Cultes regroupés par jour, dans l'ordre de la semaine ; les plages « 8h30 – 9h30 »
// s'écrivent « 8h30 à 9h30 » pour éviter tout tiret long à l'écran.
const scheduleByDay = church.schedule.reduce<{ day: string; items: { label: string; time: string }[] }[]>((acc, s) => {
  const time = s.time.replace(' – ', ' à ');
  const group = acc.find((g) => g.day === s.day);
  if (group) group.items.push({ label: s.label, time });
  else acc.push({ day: s.day, items: [{ label: s.label, time }] });
  return acc;
}, []);
const address = church.address.replace(' — ', ', ');
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(church.address)}`;

export default function EglisePage() {
  return (
    <div className="bg-white">
      {/* Fil d'ariane */}
      <section data-page-hero className="relative h-[320px] overflow-hidden border-b border-gn-gold/20 bg-gn-black sm:h-[380px]">
        <HeroBackground first="/hero/eglise-v2.jpg" position="object-center" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gn-black/85 via-gn-black/55 to-gn-black/30 sm:bg-gradient-to-r sm:from-gn-black/85 sm:via-gn-black/50 sm:to-gn-black/20" />
        <div className="gn-glow pointer-events-none absolute inset-0" />
        <Reveal className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-5 pt-[88px] sm:px-10 sm:pt-[104px]">
          <p className="mb-1 text-xs text-gn-cream/80">
            <Link href="/" className="inline-flex min-h-[44px] items-center hover:text-gn-gold">Accueil</Link> / <span className="text-gn-gold-light">À propos</span>
          </p>
          <h1 className="font-serif text-3xl font-bold text-gn-cream sm:text-hero">Qui sommes-nous</h1>
        </Reveal>
      </section>

      {/* Notre histoire */}
      <section className="bg-white">
        <Reveal className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-10 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <Reveal>
            <div className="relative h-[280px] overflow-hidden rounded-lg bg-black sm:h-[360px]">
              <Image
                src="/logo-gospel-nation-square.jpg"
                alt="Logo Gospel Nation"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-contain p-10"
              />
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div>
              <h2 className="mb-[18px] font-serif text-3xl font-semibold leading-snug text-gn-ink">
                Une famille bâtie sur la foi
              </h2>
              <p className="max-w-measure text-base leading-relaxed text-gn-ink/75">
                {fr(`${church.name} est une église de ${church.city.replace(', RDC', '')} conduite par le pasteur ${church.mainPastor.name}. Notre mission : impacter le monde à travers les 7 secteurs d'influence. Nous nous retrouvons chaque semaine autour de ${church.schedule.length} temps de culte, de prière et d'enseignement.`)}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/inscription"
                  className="inline-flex min-h-[44px] items-center rounded-full bg-gn-gold px-6 text-sm font-semibold text-gn-on-gold transition-colors hover:bg-gn-gold-light"
                >
                  Devenir membre
                </Link>
                <Link
                  href="#horaires"
                  className="inline-flex min-h-[44px] items-center rounded-full border border-gn-line px-6 text-sm font-semibold text-gn-ink transition-colors hover:border-gn-gold"
                >
                  Voir les horaires
                </Link>
              </div>
            </div>
          </Reveal>
        </Reveal>
      </section>

      {/* Nos valeurs */}
      <section className="border-y border-gn-line bg-gn-cream-bg">
        <Reveal className="mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-20">
          <h2 className="mb-10 font-serif text-3xl font-semibold text-gn-ink">Nos valeurs</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <Reveal key={value.title} delay={index * 0.06}>
                <div className="flex flex-col gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gn-black">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gn-gold)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                      {value.path}
                    </svg>
                  </div>
                  <p className="font-serif text-base font-semibold text-gn-ink">{value.title}</p>
                  <p className="text-sm leading-relaxed text-gn-ink/70">{value.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Pasteur */}
      <section className="bg-white">
        <Reveal className="mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-20">
          <h2 className="mb-10 font-serif text-3xl font-semibold text-gn-ink">Notre pasteur</h2>
          <div className="grid gap-8 sm:grid-cols-[minmax(0,360px)_1fr] sm:items-center sm:gap-12">
            <Reveal>
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gradient-to-br from-gn-avatar-from to-gn-avatar-to sm:aspect-[5/4]">
                <Image
                  src={church.mainPastor.photoUrl}
                  alt={church.mainPastor.name}
                  fill
                  sizes="(min-width: 640px) 360px, 100vw"
                  className="object-cover object-top"
                />
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="font-serif text-2xl font-semibold text-gn-ink">{church.mainPastor.name}</p>
              <p className="mt-1 text-sm font-semibold text-gn-gold-line">{church.mainPastor.title}</p>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
                <Link
                  href="/rendez-vous"
                  className="inline-flex min-h-[44px] items-center rounded-full bg-gn-gold px-6 text-sm font-semibold text-gn-on-gold transition-colors hover:bg-gn-gold-light"
                >
                  Prendre rendez-vous
                </Link>
                <a
                  href={`https://www.instagram.com/${church.mainPastor.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center text-sm text-gn-gold-dark hover:underline"
                >
                  {church.mainPastor.instagram}
                </a>
              </div>
            </Reveal>
          </div>
        </Reveal>
      </section>

      {/* Horaires */}
      <section id="horaires" className="scroll-mt-28 border-t border-gn-line bg-gn-cream-bg">
        <Reveal className="mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-20">
          <h2 className="mb-10 font-serif text-3xl font-semibold text-gn-ink">Horaires des cultes</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {scheduleByDay.map((group) => (
              <div key={group.day} className="gn-card-lift gn-spot rounded-lg border border-gn-line bg-white p-6">
                <p className="text-xs font-bold uppercase tracking-wide text-gn-gold-line">{group.day}</p>
                <ul className="mt-3 divide-y divide-gn-line">
                  {group.items.map((item) => (
                    <li key={item.label} className="flex items-baseline justify-between gap-4 py-3 first:pt-0 last:pb-0">
                      <span className="font-serif text-base font-semibold text-gn-ink">{fr(item.label)}</span>
                      <span className="shrink-0 text-sm font-semibold text-gn-ink/70">{item.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-measure text-sm text-gn-ink/60">{address}</p>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="gn-glow relative overflow-hidden bg-gn-black">
        <Reveal className="relative mx-auto max-w-6xl px-5 py-16 text-center sm:px-10 sm:py-20">
          <h2 className="mb-4 font-serif text-3xl font-semibold text-gn-cream">Rejoignez-nous ce dimanche</h2>
          <p className="mx-auto mb-7 max-w-md text-sm text-gn-muted">
            Toute la famille Gospel Nation vous attend pour ce temps de culte, de partage et de communion.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/inscription"
              className="inline-flex min-h-[44px] items-center rounded-full bg-gradient-to-br from-gn-gold-light to-gn-gold px-8 text-xs font-bold uppercase tracking-wide text-gn-black transition-opacity hover:opacity-90"
            >
              Devenir membre
            </Link>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center rounded-full border border-gn-gold/50 px-8 text-xs font-bold uppercase tracking-wide text-gn-cream transition-colors hover:border-gn-gold"
            >
              Itinéraire
            </a>
          </div>
          <p className="mx-auto mt-6 max-w-md text-xs text-gn-muted">{address}</p>
        </Reveal>
      </section>
    </div>
  );
}
