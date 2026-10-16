import type { Metadata } from 'next';
import Link from 'next/link';
import { church } from '@/lib/content';
import ContactForm from './ContactForm';
import HeroBackground from '@/components/HeroBackground';
import Reveal from '@/components/Reveal';
import ContactShortcut from '@/components/ContactShortcut';
import { formatEventDayLong } from '@/lib/dates';
import { scheduleByDay } from '@/lib/schedule';
import { fr } from '@/lib/typo';

// Recalculée au plus toutes les heures : la « prochaine date » de chaque culte reste juste.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Une question, une demande de prière ou l\'envie d\'en savoir plus ? Écrivez à Gospel Nation, Ma Campagne, Kinshasa.'
};

export default function ContactPage() {
  const days = scheduleByDay();
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(church.address)}`;

  const infoItems = [
    {
      label: 'Adresse',
      value: church.address,
      path: (
        <>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </>
      )
    },
    {
      label: 'Instagram',
      value: church.instagram.replace('https://www.instagram.com/', '@'),
      path: (
        <>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
        </>
      )
    },
    {
      label: 'Facebook',
      value: church.facebook.replace('https://www.facebook.com/', 'facebook.com/'),
      path: (
        <>
          <path d="M14 8.5V11h2.8l-.4 3H14v7.5h-3V14H8.5v-3H11V8.2C11 5.9 12.4 4.5 14.5 4.5c1 0 2 .1 2 .1V7h-1.1c-1 0-1.4.6-1.4 1.5z" />
        </>
      )
    },
  ];

  return (
    <div className="bg-gn-black">
      <section data-page-hero className="relative h-[320px] overflow-hidden border-b border-gn-gold/20 bg-gn-black sm:h-[380px]">
        <HeroBackground first="/hero/contact.jpg" position="object-top" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gn-black/85 via-gn-black/55 to-gn-black/30 sm:bg-gradient-to-r sm:from-gn-black/85 sm:via-gn-black/50 sm:to-gn-black/20" />
        <div className="gn-glow pointer-events-none absolute inset-0" />
        <Reveal className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-5 pt-[88px] sm:px-10 sm:pt-[104px]">
          <p className="mb-1 text-xs text-gn-cream/80">
            <Link href="/" className="inline-flex min-h-[44px] items-center hover:text-gn-gold">Accueil</Link> / <span className="text-gn-gold-light">Contact</span>
          </p>
          <h1 className="font-serif text-3xl font-bold text-gn-cream sm:text-hero">Contactez-nous</h1>
        </Reveal>
      </section>

      {/* Raccourcis : aller droit à ce qu'on cherche */}
      <section className="border-b border-white/10 bg-gn-black">
        <ul className="mx-auto grid max-w-6xl gap-4 px-5 py-8 sm:grid-cols-3 sm:px-10 sm:py-10">
          <li>
            <Reveal className="h-full">
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="gn-card-lift gn-spot group flex h-full items-center gap-4 rounded-lg border border-white/10 bg-gn-black-soft p-5 transition-colors hover:border-gn-gold/60">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gn-gold/40 bg-gn-gold/10" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gn-gold)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <span>
                  <span className="block font-serif text-base font-semibold text-gn-cream">Nous rendre visite</span>
                  <span className="mt-0.5 block text-sm text-gn-cream/70">Itinéraire jusqu&apos;à l&apos;église</span>
                </span>
              </a>
            </Reveal>
          </li>
          <li>
            <Reveal className="h-full" delay={0.05}>
              <Link href="/rendez-vous" className="gn-card-lift gn-spot group flex h-full items-center gap-4 rounded-lg border border-white/10 bg-gn-black-soft p-5 transition-colors hover:border-gn-gold/60">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gn-gold/40 bg-gn-gold/10" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gn-gold)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="5" width="18" height="16" rx="2" />
                    <path d="M3 10h18M8 3v4M16 3v4" />
                  </svg>
                </span>
                <span>
                  <span className="block font-serif text-base font-semibold text-gn-cream">Rencontrer le pasteur</span>
                  <span className="mt-0.5 block text-sm text-gn-cream/70">Demander un rendez-vous</span>
                </span>
              </Link>
            </Reveal>
          </li>
          <li>
            <Reveal className="h-full" delay={0.1}>
              <ContactShortcut motif="priere" className="gn-card-lift gn-spot group flex h-full items-center gap-4 rounded-lg border border-white/10 bg-gn-black-soft p-5 transition-colors hover:border-gn-gold/60">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gn-gold/40 bg-gn-gold/10" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gn-gold)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 11V5a2 2 0 1 1 4 0v4" />
                    <path d="M11 9V4a2 2 0 1 1 4 0v5" />
                    <path d="M15 9.5V6a2 2 0 1 1 4 0v8a6 6 0 0 1-6 6h-1a6 6 0 0 1-5-2.7L4.3 13a1.6 1.6 0 0 1 2.4-2.1L7 11.5" />
                  </svg>
                </span>
                <span>
                  <span className="block font-serif text-base font-semibold text-gn-cream">Demander une prière</span>
                  <span className="mt-0.5 block text-sm text-gn-cream/70">Écrire à l&apos;équipe de prière</span>
                </span>
              </ContactShortcut>
            </Reveal>
          </li>
        </ul>
      </section>

      <section className="bg-gn-black">
        <Reveal className="mx-auto grid max-w-6xl gap-14 px-5 py-16 sm:px-10 sm:py-20 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="flex flex-col gap-7">
            <p className="max-w-measure text-sm leading-relaxed text-gn-muted">
              Une question, une demande de prière ou envie d&apos;en savoir plus sur Gospel Nation ? Écrivez-nous,
              nous vous répondrons rapidement.
            </p>
            {infoItems.map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border border-gn-gold/40 bg-gn-gold/10">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--gn-gold)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    {item.path}
                  </svg>
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold text-gn-muted">{item.label}</p>
                  <p className="max-w-measure font-serif text-base font-semibold text-gn-cream [overflow-wrap:anywhere]">{item.value}</p>
                </div>
              </div>
            ))}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 inline-flex min-h-[44px] w-fit items-center gap-2 rounded-full bg-gn-gold px-5 text-xs font-bold uppercase tracking-wide text-gn-black transition-opacity hover:opacity-90"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Itinéraire
            </a>
            <div className="mt-1.5 flex gap-2.5">
              <a
                href={church.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gn-gold/40 text-gn-gold transition-colors hover:bg-gn-gold/10"
                aria-label="YouTube"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.6 7.2s-.2-1.5-.8-2.2c-.8-.9-1.7-.9-2.1-1C15.9 3.8 12 3.8 12 3.8s-3.9 0-6.7.2c-.4 0-1.3.1-2.1 1-.6.7-.8 2.2-.8 2.2S2.2 9 2.2 10.7v1.5c0 1.8.2 3.5.2 3.5s.2 1.5.8 2.2c.8.9 1.9.9 2.4 1 1.7.2 7.4.2 7.4.2s3.9 0 6.7-.3c.4 0 1.3-.1 2.1-1 .6-.7.8-2.2.8-2.2s.2-1.8.2-3.5v-1.5c0-1.8-.2-3.5-.2-3.5zM9.9 14.6V8.9l5.4 2.9-5.4 2.8z" />
                </svg>
              </a>
              <a
                href={church.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gn-gold/40 text-gn-gold transition-colors hover:bg-gn-gold/10"
                aria-label="Instagram"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href={church.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gn-gold/40 text-gn-gold transition-colors hover:bg-gn-gold/10"
                aria-label="Facebook"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14 8.5V11h2.8l-.4 3H14v7.5h-3V14H8.5v-3H11V8.2C11 5.9 12.4 4.5 14.5 4.5c1 0 2 .1 2 .1V7h-1.1c-1 0-1.4.6-1.4 1.5z" />
                </svg>
              </a>
            </div>

            <div className="mt-3 border-t border-white/10 pt-7">
              <h2 className="mb-4 font-serif text-xl font-semibold text-gn-cream">Horaires des cultes</h2>
              <ul className="space-y-4">
                {days.map((group) => (
                  <li key={group.day}>
                    <p className="text-xs font-bold uppercase tracking-wide text-gn-gold">{group.day}</p>
                    <ul className="mt-1.5 space-y-1.5">
                      {group.items.map((item) => (
                        <li key={item.label} className="flex flex-wrap items-baseline justify-between gap-x-4 text-sm">
                          <span className="text-gn-cream">{fr(item.label)}</span>
                          <span className="font-semibold text-gn-cream/80">{item.time}</span>
                        </li>
                      ))}
                    </ul>
                    {group.items[0].next && (
                      <p className="mt-1 text-xs text-gn-cream/60">Prochain : {formatEventDayLong(group.items[0].next)}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div id="formulaire" className="flex scroll-mt-28 flex-col gap-6">
            <div className="relative rounded-2xl bg-gn-cream-bg p-7 sm:p-11">
              <span className="gn-beam" aria-hidden="true" />
              <p className="mb-6 font-serif text-xl font-semibold text-gn-ink">Envoyez-nous un message</p>
              <ContactForm />
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
