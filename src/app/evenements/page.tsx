import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PlaceholderNote from '@/components/PlaceholderNote';
import Reveal from '@/components/Reveal';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Événements'
};

export default async function EvenementsPage() {
  const events = await prisma.event.findMany({ orderBy: { eventDate: 'asc' } });
  const [featured, ...rest] = events;

  return (
    <div className="bg-gn-cream-bg">
      <section className="gn-glow relative h-[220px] overflow-hidden border-b border-gn-gold/20 bg-gn-black sm:h-[260px]">
        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-5 sm:px-10">
          <p className="mb-3.5 text-xs text-gn-muted">
            <Link href="/" className="hover:text-gn-gold">Accueil</Link> / <span className="text-gn-gold">Événements</span>
          </p>
          <h1 className="font-serif text-3xl font-bold text-gn-cream sm:text-[38px]">Événements</h1>
          <p className="mt-3.5 max-w-md text-sm text-gn-muted">
            Conférences, retraites, formations et temps forts de la vie de Gospel Nation.
          </p>
        </div>
      </section>

      {events.length === 0 ? (
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-20">
          <PlaceholderNote>Aucun événement à venir pour le moment. Revenez bientôt !</PlaceholderNote>
        </div>
      ) : (
        <>
          {featured && (
            <section className="border-b border-gn-line bg-white">
              <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-10 sm:py-16 lg:grid-cols-2 lg:items-center lg:gap-12">
                <Reveal>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[10px]">
                    <Image src={featured.posterImageUrl} alt={featured.title} fill className="object-cover" />
                    <span className="absolute left-4 top-4 rounded-full bg-gn-black px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      À la une
                    </span>
                  </div>
                </Reveal>
                <Reveal delay={0.08}>
                  <div>
                    <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-gn-gold-dark">
                      Prochain grand rendez-vous
                    </p>
                    <h2 className="mb-3.5 font-serif text-[28px] font-semibold leading-snug text-gn-ink">{featured.title}</h2>
                    {featured.description && (
                      <p className="mb-5 text-sm leading-[1.8] text-gn-ink/60">{featured.description}</p>
                    )}
                    <div className="mb-6 flex flex-col gap-3">
                      {featured.eventDate && (
                        <div className="flex items-center gap-2.5">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--gn-gold-line)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="9" />
                            <polyline points="12 7 12 12 16 14" />
                          </svg>
                          <span className="text-[13px] text-gn-ink/60">
                            {new Date(featured.eventDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} —{' '}
                            {new Date(featured.eventDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      )}
                      {featured.location && (
                        <div className="flex items-center gap-2.5">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--gn-gold-line)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          <span className="text-[13px] text-gn-ink/60">{featured.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Reveal>
              </div>
            </section>
          )}

          {rest.length > 0 && (
            <section className="bg-gn-cream-bg">
              <div className="mx-auto max-w-6xl px-5 py-14 sm:px-10 sm:py-16">
                <div className="flex flex-col gap-4">
                  {rest.map((event, index) => (
                    <Reveal key={event.id} delay={index * 0.06}>
                      <div className="flex flex-col gap-4 rounded-lg border border-gn-line bg-white p-5 sm:flex-row sm:items-center sm:gap-5">
                        <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-lg bg-gn-black">
                          {event.eventDate ? (
                            <>
                              <span className="font-serif text-[22px] font-bold leading-none text-gn-gold">
                                {new Date(event.eventDate).getDate().toString().padStart(2, '0')}
                              </span>
                              <span className="mt-0.5 text-[9.5px] uppercase tracking-wide text-gn-muted">
                                {new Date(event.eventDate).toLocaleDateString('fr-FR', { month: 'short' })}
                              </span>
                            </>
                          ) : (
                            <span className="text-lg text-gn-gold">•</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="mb-1.5 font-serif text-base font-semibold text-gn-ink">{event.title}</p>
                          <p className="text-[12.5px] text-gn-muted">
                            {event.eventDate &&
                              new Date(event.eventDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            {event.eventDate && event.location && ' · '}
                            {event.location}
                          </p>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
