import type { Metadata } from 'next';
import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import EmptyState from '@/components/EmptyState';
import Reveal from '@/components/Reveal';
import ShareButtons from '@/components/ShareButtons';
import Skeleton from '@/components/Skeleton';
import DepartmentLogo from '@/components/DepartmentLogo';
import { prisma } from '@/lib/prisma';
import { church } from '@/lib/content';
import { YEARLY_HIGHLIGHTS } from '@/lib/departments';
import { SITE_URL } from '@/lib/site';
import { fr } from '@/lib/typo';
import {
  formatEventDateTime,
  formatEventDayLong,
  formatEventDayNumber,
  formatEventMonthShort,
  formatEventTime,
  nextWeeklyOccurrence
} from '@/lib/dates';

// « Valorous — La fraternité » s'écrit « Valorous : La fraternité » à l'écran.
const noDash = (text: string) => text.replace(' — ', ' : ').replace(/ — /g, ', ');

// Régénérée au plus toutes les 60 s : sinon figée au build ; ménage aussi la base Neon.
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Événements',
  description:
    'Conférences, retraites, formations et temps forts de la vie de Gospel Nation.'
};

function EventsSkeleton() {
  return (
    <section className="border-b border-gn-line bg-white">
      <Reveal className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-10 sm:py-16 lg:grid-cols-2 lg:items-center lg:gap-12">
        <Skeleton className="aspect-[4/5] w-full rounded-lg" />
        <div className="flex flex-col gap-3.5">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="mt-2 h-4 w-1/2" />
        </div>
      </Reveal>
    </section>
  );
}

async function EventsContent() {
  const [events, departments] = await Promise.all([
    prisma.event.findMany({ orderBy: { eventDate: 'asc' } }),
    prisma.department.findMany({ select: { slug: true, imageUrl: true } })
  ]);
  const hasLogo = new Set(departments.filter((d) => d.imageUrl).map((d) => d.slug));

  // Début de la journée (UTC) : un événement d'aujourd'hui est encore « à venir ».
  // Un événement sans date reste dans les événements à venir.
  const now = new Date();
  const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const upcoming = events.filter((event) => !event.eventDate || event.eventDate >= startOfToday);
  const past = events.filter((event) => event.eventDate && event.eventDate < startOfToday).reverse();
  const [featured, ...rest] = upcoming;

  // Prochaine occurrence de chaque culte de la semaine, dans l'ordre du calendrier.
  const weekly = church.schedule
    .map((service) => ({ ...service, next: nextWeeklyOccurrence(service.day, service.time) }))
    .sort((a, b) => (a.next?.getTime() ?? 0) - (b.next?.getTime() ?? 0));

  // Fonds alternés : deux sections de même couleur ne se touchent jamais.
  let tone = 0;
  const bg = () => (tone++ % 2 === 0 ? 'bg-white' : 'bg-gn-cream-bg');

  return (
    <>
      {!featured && (
        <section className={`${bg()} border-b border-gn-line`}>
          <Reveal className="mx-auto max-w-6xl px-5 py-10 sm:px-10 sm:py-12">
            <EmptyState
              title="Aucun événement daté à venir"
              text="Les prochaines dates seront annoncées ici. En attendant, retrouvez nos cultes de la semaine et les temps forts de l'année."
              action={{ href: '/predications', label: 'Écouter les prédications' }}
            />
          </Reveal>
        </section>
      )}

      {featured && (
        <section className={`${bg()} border-b border-gn-line`}>
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-10 sm:py-16 lg:grid-cols-2 lg:items-center lg:gap-12">
            <Reveal>
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
                <Image src={featured.posterImageUrl} alt={featured.title} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                <span className="absolute left-4 top-4 rounded-full bg-gn-black px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
                  À la une
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div>
                <p className="mb-2.5 font-serif text-base italic font-medium text-gn-gold-dark">
                  Prochain grand rendez-vous
                </p>
                <h2 className="mb-3.5 font-serif text-3xl font-semibold leading-snug text-gn-ink">{fr(noDash(featured.title))}</h2>
                {featured.description && (
                  <p className="mb-5 max-w-measure text-sm leading-relaxed text-gn-ink/70">{featured.description}</p>
                )}
                <div className="mb-6 flex flex-col gap-3">
                  {featured.eventDate && (
                    <div className="flex items-center gap-2.5">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--gn-gold-line)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="9" />
                        <polyline points="12 7 12 12 16 14" />
                      </svg>
                      <span className="text-sm text-gn-ink/70">
                        {formatEventDateTime(new Date(featured.eventDate))}
                      </span>
                    </div>
                  )}
                  {featured.location && (
                    <div className="flex items-center gap-2.5">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--gn-gold-line)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span className="text-sm text-gn-ink/70">{noDash(featured.location)}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                  <ShareButtons title={featured.title} path="/evenements" fallbackUrl={`${SITE_URL}/evenements`} tone="light" />
                  {featured.eventDate && (
                    <a
                      href={`/evenements/ics/${featured.slug}`}
                      download
                      className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-gn-gold-dark hover:underline"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="3" y="5" width="18" height="16" rx="2" />
                        <path d="M3 10h18M8 3v4M16 3v4M12 13v5M9.5 15.5h5" />
                      </svg>
                      Ajouter à mon calendrier
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section className={bg()}>
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-10 sm:py-16">
            <h2 className="mb-6 font-serif text-2xl font-semibold text-gn-ink">Autres événements à venir</h2>
            <div className="flex flex-col gap-4">
              {rest.map((event, index) => (
                <Reveal key={event.id} delay={index * 0.06}>
                  <div className="gn-card-lift gn-spot flex flex-col gap-4 rounded-lg border border-gn-line bg-white p-5 sm:flex-row sm:items-center sm:gap-5">
                    <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-lg bg-gn-black">
                      {event.eventDate ? (
                        <>
                          <span className="font-serif text-2xl font-bold leading-none text-gn-gold">
                            {formatEventDayNumber(new Date(event.eventDate))}
                          </span>
                          <span className="mt-0.5 text-xs font-semibold text-gn-muted">
                            {formatEventMonthShort(new Date(event.eventDate))}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg text-gn-gold">•</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="mb-1.5 font-serif text-base font-semibold text-gn-ink">{noDash(event.title)}</p>
                      <p className="text-xs text-gn-muted-strong">
                        {event.eventDate && formatEventTime(new Date(event.eventDate))}
                        {event.eventDate && formatEventTime(new Date(event.eventDate)) && event.location && ' · '}
                        {event.location && noDash(event.location)}
                      </p>
                    </div>
                    {event.eventDate && (
                      <a
                        href={`/evenements/ics/${event.slug}`}
                        download
                        className="inline-flex min-h-[44px] items-center text-sm font-semibold text-gn-gold-dark hover:underline"
                      >
                        Ajouter à mon calendrier
                      </a>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Chaque semaine */}
      <section className={bg()}>
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-10 sm:py-16">
          <Reveal>
            <h2 className="mb-2 font-serif text-2xl font-semibold text-gn-ink">Chaque semaine</h2>
            <p className="mb-8 max-w-measure text-sm text-gn-muted-strong">
              Nos cultes ont lieu toute l&apos;année. Voici la prochaine date de chacun.
            </p>
          </Reveal>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {weekly.map((service, index) => (
              <li key={`${service.day}-${service.time}`}>
                <Reveal delay={index * 0.05}>
                  <div className="gn-card-lift gn-spot h-full rounded-lg border border-gn-line bg-white p-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-gn-gold-line">
                      {service.next ? `Prochain : ${formatEventDayLong(service.next)}` : service.day}
                    </p>
                    <p className="mt-2 font-serif text-lg font-semibold text-gn-ink">{fr(service.label)}</p>
                    <p className="mt-1 text-sm text-gn-ink/70">{service.day}, {service.time.replace(' – ', ' à ')}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Les temps forts de l'année */}
      <section className={bg()}>
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-10 sm:py-16">
          <Reveal>
            <h2 className="mb-2 font-serif text-2xl font-semibold text-gn-ink">Les temps forts de l&apos;année</h2>
            <p className="mb-8 max-w-measure text-sm text-gn-muted-strong">
              Des rendez-vous qui reviennent chaque année dans nos départements. Les dates sont annoncées ici dès qu&apos;elles sont fixées.
            </p>
          </Reveal>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {YEARLY_HIGHLIGHTS.map((item, index) => (
              <li key={item.name}>
                <Reveal className="h-full" delay={(index % 4) * 0.05}>
                  <Link
                    href={`/departements/${item.slug}`}
                    className="gn-card-lift gn-spot group flex h-full flex-col overflow-hidden rounded-lg border border-gn-line bg-gn-cream-bg"
                  >
                    {hasLogo.has(item.slug) && (
                      <div className="gn-photo-hover relative aspect-[16/9] w-full bg-gn-black">
                        <DepartmentLogo slug={item.slug} name="" sizes="160px" />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-serif text-base font-semibold text-gn-ink">{fr(item.name)}</h3>
                      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-gn-ink/70">{fr(item.frequency)}</p>
                      <span className="mt-4 inline-block w-fit rounded-full border border-gn-gold-line/50 px-3 py-1 text-xs font-semibold text-gn-gold-dark">
                        Date à annoncer
                      </span>
                    </div>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {past.length > 0 && (
        <section className={bg()}>
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-10 sm:py-16">
            <h2 className="mb-6 font-serif text-2xl font-semibold text-gn-ink">Événements passés</h2>
            <ul className="grid gap-4 md:grid-cols-2">
              {past.map((event) => (
                <li key={event.id} className="flex items-stretch gap-4 rounded-lg border border-gn-line bg-gn-cream-bg p-4">
                  {event.posterImageUrl ? (
                    <div className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden rounded-lg bg-gn-black">
                      <Image src={event.posterImageUrl} alt={`Affiche : ${noDash(event.title)}`} fill sizes="96px" className="object-cover" />
                    </div>
                  ) : (
                    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-gn-black">
                      <span className="font-serif text-xl font-bold leading-none text-gn-gold">
                        {formatEventDayNumber(new Date(event.eventDate as Date))}
                      </span>
                      <span className="mt-0.5 text-xs font-semibold text-gn-muted">
                        {formatEventMonthShort(new Date(event.eventDate as Date))}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0 self-center">
                    <p className="text-xs font-semibold text-gn-gold-line">{formatEventDateTime(new Date(event.eventDate as Date))}</p>
                    <p className="mt-1 font-serif text-base font-semibold leading-snug text-gn-ink">{fr(noDash(event.title))}</p>
                    {event.description && <p className="mt-1.5 text-sm leading-relaxed text-gn-ink/70">{event.description}</p>}
                    {event.location && <p className="mt-1.5 text-xs text-gn-muted-strong">{noDash(event.location)}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}

export default function EvenementsPage() {
  return (
    <div className="bg-gn-cream-bg">
      <section className="relative h-[220px] overflow-hidden border-b border-gn-gold/20 bg-gn-black sm:h-[260px]">
        <Image src="/hero/evenements-v2.jpg" alt="" fill sizes="100vw" className="gn-kenburns object-cover object-[center_90%]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gn-black/85 via-gn-black/55 to-gn-black/30 sm:bg-gradient-to-r sm:from-gn-black/85 sm:via-gn-black/50 sm:to-gn-black/20" />
        <div className="gn-glow pointer-events-none absolute inset-0" />
        <Reveal className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-5 sm:px-10">
          <p className="mb-1 text-xs text-gn-cream/80">
            <Link href="/" className="inline-flex min-h-[44px] items-center hover:text-gn-gold">Accueil</Link> / <span className="text-gn-gold-light">Événements</span>
          </p>
          <h1 className="font-serif text-3xl font-bold text-gn-cream sm:text-hero">Événements</h1>
          <p className="mt-3.5 max-w-md text-sm text-gn-cream/90">
            Conférences, retraites, formations et temps forts de la vie de Gospel Nation.
          </p>
        </Reveal>
      </section>

      <Suspense fallback={<EventsSkeleton />}>
        <EventsContent />
      </Suspense>
    </div>
  );
}
