import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { church } from '@/lib/content';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Une question, une demande de prière ou l\'envie d\'en savoir plus ? Écrivez à Gospel Nation, Ma Campagne, Kinshasa.'
};

export default function ContactPage() {
  const schedule = church.schedule[0];
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
    {
      label: 'Horaires des cultes',
      value: `${schedule.day} — ${schedule.time}`,
      path: (
        <>
          <circle cx="12" cy="12" r="9" />
          <polyline points="12 7 12 12 16 14" />
        </>
      )
    }
  ];

  return (
    <div className="bg-gn-black">
      <section className="relative h-[220px] overflow-hidden border-b border-gn-gold/20 bg-gn-black sm:h-[260px]">
        <Image src="/hero/contact.jpg" alt="" fill className="gn-kenburns object-cover object-top" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gn-black/85 via-gn-black/55 to-gn-black/30 sm:bg-gradient-to-r sm:from-gn-black/85 sm:via-gn-black/50 sm:to-gn-black/20" />
        <div className="gn-glow pointer-events-none absolute inset-0" />
        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-5 sm:px-10">
          <p className="mb-1 text-xs text-gn-cream/80">
            <Link href="/" className="inline-flex min-h-[44px] items-center hover:text-gn-gold">Accueil</Link> / <span className="text-gn-gold-light">Contact</span>
          </p>
          <h1 className="font-serif text-3xl font-bold text-gn-cream sm:text-hero">Contactez-nous</h1>
        </div>
      </section>

      <section className="bg-gn-black">
        <div className="mx-auto grid max-w-6xl gap-14 px-5 py-16 sm:px-10 sm:py-20 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="flex flex-col gap-7">
            <p className="text-sm leading-relaxed text-gn-muted">
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
                  <p className="mb-1 text-xs uppercase tracking-wide text-gn-muted">{item.label}</p>
                  <p className="font-serif text-base font-semibold text-gn-cream">{item.value}</p>
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
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-2xl bg-gn-cream-bg p-7 sm:p-11">
              <p className="mb-6 font-serif text-xl font-semibold text-gn-ink">Envoyez-nous un message</p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
