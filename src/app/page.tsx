import Image from 'next/image';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import HeroVideo from '@/components/HeroVideo';
import HorizontalScroller from '@/components/HorizontalScroller';
import EventsMarquee from '@/components/EventsMarquee';
import { church, gospelNewsIssues } from '@/lib/content';
import { prisma } from '@/lib/prisma';
import { formatEventDateTime } from '@/lib/dates';

// Régénérée au plus toutes les 60 s : sinon figée au build ; ménage aussi la base Neon.
export const revalidate = 60;

const DEPARTMENT_ICONS: Record<string, React.ReactNode> = {
  fire: (
    <>
      <path d="M7 11V5a2 2 0 1 1 4 0v4" />
      <path d="M11 9V4a2 2 0 1 1 4 0v5" />
      <path d="M15 9.5V6a2 2 0 1 1 4 0v8a6 6 0 0 1-6 6h-1a6 6 0 0 1-5-2.7L4.3 13a1.6 1.6 0 0 1 2.4-2.1L7 11.5" />
    </>
  ),
  accueil: <path d="M12 21s-7.5-4.9-10-9.4C.4 8 2 4.5 5.6 4A5.6 5.6 0 0 1 12 7.5 5.6 5.6 0 0 1 18.4 4C22 4.5 23.6 8 22 11.6 19.5 16.1 12 21 12 21z" />,
  'gospel-kids': (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.5 19c.6-3 3.2-5 6.5-5s5.9 2 6.5 5" />
      <circle cx="17.5" cy="9" r="2.6" />
      <path d="M15.8 14.2c2.6.4 4.6 2.1 5.1 4.4" />
    </>
  ),
  'nation-united': (
    <>
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="4" ry="9" />
      <line x1="3" y1="12" x2="21" y2="12" />
    </>
  ),
  'one-love': <path d="M12 21s-7.5-4.9-10-9.4C.4 8 2 4.5 5.6 4A5.6 5.6 0 0 1 12 7.5 5.6 5.6 0 0 1 18.4 4C22 4.5 23.6 8 22 11.6 19.5 16.1 12 21 12 21z" />,
  'one-nation': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 2.5 15.5 0 18M12 3c-2.5 2.5-2.5 15.5 0 18" />
    </>
  ),
  valorous: <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3z" />,
  'ecole-nation-classe': (
    <>
      <path d="M15 3H6v18h9" />
      <path d="M15 3l4 1.5v15L15 21" />
      <circle cx="12" cy="12" r="0.8" fill="currentColor" stroke="none" />
    </>
  )
};

export default async function HomePage() {
  // Début de la journée (UTC) : un événement d'aujourd'hui est encore « en cours ».
  const now = new Date();
  const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  const [departments, sermons, upcomingEvent] = await Promise.all([
    prisma.department.findMany({ orderBy: { order: 'asc' }, take: 6 }),
    prisma.sermon.findMany({ orderBy: { date: 'desc' }, take: 3 }),
    prisma.event.findFirst({ where: { eventDate: { gte: startOfToday } }, orderBy: { eventDate: 'asc' } })
  ]);

  // Numéros les plus récents d'abord.
  const issues = [...gospelNewsIssues].sort((a, b) => b.volume - a.volume);

  const schedule = church.schedule[1];
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(church.address)}`;

  return (
    <div className="bg-gn-black">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gn-black">
        <HeroVideo src="/video/hero-accueil.mp4" poster="/video/hero-accueil-poster.jpg" />
        <div className="pointer-events-none absolute inset-0 bg-gn-black/70" />
        {/* Voile supplémentaire côté texte : la vidéo contient son propre
            texte incrusté par endroits, qui peut entrer en collision avec le
            titre superposé. On assombrit davantage la zone où le texte
            s'affiche (bas sur mobile où il est centré, gauche sur desktop où
            il est aligné à gauche) sans assombrir toute la vidéo. */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gn-black/55 via-gn-black/10 to-transparent sm:bg-gradient-to-r sm:from-gn-black/65 sm:via-gn-black/15 sm:to-transparent" />
        <div className="gn-glow absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-10 sm:py-28 lg:py-32">
          <Reveal>
            <div className="mx-auto flex max-w-xl flex-col items-center gap-5 text-center sm:mx-0 sm:items-start sm:gap-6 sm:text-left">
              <p className="font-serif text-base italic font-medium text-gn-gold">{church.name}</p>
              <h1 className="font-serif text-4xl font-bold leading-[1.12] text-gn-cream sm:text-display">
                {church.tagline}
              </h1>
              <p className="max-w-md text-sm leading-snug text-gn-muted sm:text-base sm:leading-relaxed">
                Une famille spirituelle qui accueille, forme et envoie ceux qui cherchent Dieu. Rejoignez-nous
                pour adorer, apprendre et servir ensemble.
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-4 sm:justify-start">
                <Link
                  href="/contact"
                  className="rounded-full bg-gradient-to-br from-gn-gold-light to-gn-gold px-7 py-[15px] text-xs font-bold uppercase tracking-wide text-gn-black transition-opacity hover:opacity-90"
                >
                  Nous contacter
                </Link>
                <Link
                  href="/predications"
                  className="rounded-full border border-gn-cream/35 px-[26px] py-[15px] text-xs font-semibold uppercase tracking-wide text-gn-cream transition-colors hover:border-gn-gold hover:text-gn-gold"
                >
                  Nos prédications
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Prochain culte / Lieu */}
      <section className="border-b border-gn-line bg-gn-cream">
        <Reveal className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5 px-5 py-6 sm:px-10">
          <div className="flex items-center gap-3.5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gn-gold-line)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <polyline points="12 7 12 12 16 14" />
            </svg>
            <div>
              <p className="mb-0.5 text-xs uppercase tracking-wide text-gn-muted-strong">Prochain culte</p>
              <p className="font-serif text-base font-semibold text-gn-ink">
                {schedule.day}, {schedule.time}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gn-gold-line)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <div>
              <p className="mb-0.5 text-xs uppercase tracking-wide text-gn-muted-strong">Lieu</p>
              <p className="max-w-md font-serif text-base font-semibold text-gn-ink">{church.address}</p>
            </div>
          </div>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center rounded-full bg-gn-black px-6 text-xs font-bold uppercase tracking-wide text-gn-cream transition-opacity hover:opacity-90"
          >
            Itinéraire
          </a>
        </Reveal>
      </section>

      {/* Dernières parutions (revues Gospel News) : bande sombre pour rompre le rythme */}
      {issues.length > 0 && (
        <section className="bg-gn-black-soft">
          <div className="mx-auto max-w-6xl px-5 py-11 sm:px-10 sm:py-14">
            <Reveal className="mb-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-0 sm:mb-6">
              <div>
                <p className="mb-1.5 font-serif text-base italic font-medium text-gn-gold">Lire</p>
                <h2 className="font-serif text-3xl font-semibold text-gn-cream">Dernières parutions</h2>
              </div>
              <Link
                href="/departements/gospel-news"
                className="-mb-2 -mt-2 inline-flex min-h-[44px] items-center sm:m-0 text-sm font-semibold text-gn-gold hover:underline"
              >
                Voir tous les articles
              </Link>
            </Reveal>
            <div className="gn-scroll-x -mx-5 flex scroll-pl-5 snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0">
              {issues.map((issue, index) => (
                <Reveal key={issue.fileUrl} delay={index * 0.06} className="w-[86%] shrink-0 snap-start sm:w-auto">
                  <a
                    href={issue.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gn-card-lift flex h-full items-center gap-5 rounded-lg border border-gn-gold/20 bg-gn-black p-4"
                  >
                    <div className="relative h-36 w-28 shrink-0 overflow-hidden rounded-lg bg-gn-black-soft">
                      <Image
                        src={issue.coverUrl}
                        alt={`Couverture de Gospel News, volume ${issue.volume}`}
                        fill
                        sizes="112px"
                        className="object-cover object-top"
                      />
                    </div>
                    <div>
                      {index === 0 && (
                        <span className="mb-2 inline-block rounded-full bg-gn-gold px-3 py-1 text-xs font-bold uppercase tracking-wide text-gn-on-gold">
                          Dernière parution
                        </span>
                      )}
                      <p className="mb-1.5 font-serif text-lg font-semibold text-gn-cream">
                        Gospel News, volume {issue.volume}
                      </p>
                      <p className="text-xs text-gn-muted">{issue.date} · Télécharger le PDF</p>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Dernières prédications */}
      <section className="bg-gn-cream-bg">
        <div className="mx-auto max-w-6xl px-5 py-11 sm:px-10 sm:py-14">
          <Reveal className="mb-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-0 sm:mb-6">
            <div>
              <p className="mb-1.5 font-serif text-base italic font-medium text-gn-gold-dark">Écouter</p>
              <h2 className="font-serif text-3xl font-semibold text-gn-ink">
                Dernières prédications
              </h2>
            </div>
            <Link
              href="/predications/catalogue"
              className="-mb-2 -mt-2 inline-flex min-h-[44px] items-center sm:m-0 text-sm font-semibold text-gn-gold-line hover:underline"
            >
              Voir toutes les prédications
            </Link>
          </Reveal>
          {sermons.length === 0 ? (
            <p className="text-sm text-gn-ink/60">Aucune prédication publiée pour le moment.</p>
          ) : (
            <div className="gn-scroll-x -mx-5 flex scroll-pl-5 snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
              {sermons.map((sermon, index) => (
                <Reveal key={sermon.id} delay={index * 0.06} className="w-[78%] shrink-0 snap-start sm:w-auto">
                  <Link href={`/predications/${sermon.id}`} className="flex flex-col gap-3.5">
                    <div className="relative flex h-[170px] items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-gn-black-soft to-gn-black lg:h-[200px]">
                      {sermon.coverImageUrl ? (
                        <Image
                          src={sermon.coverImageUrl}
                          alt={sermon.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="gn-radial-gold absolute inset-0 opacity-50" />
                      )}
                      <div className="absolute inset-0 bg-black/25" />
                      <div className="relative flex h-[52px] w-[52px] items-center justify-center rounded-full border border-gn-gold/50 bg-gn-cream/10 backdrop-blur-sm">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--gn-gold)">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="mb-1.5 font-serif text-base font-semibold text-gn-ink">{sermon.title}</p>
                      <p className="text-xs text-gn-muted-strong">
                        {sermon.speaker} · {new Date(sermon.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bande défilante : événement à venir, cultes, services, départements */}
      <EventsMarquee
        event={upcomingEvent ? { title: upcomingEvent.title, when: upcomingEvent.eventDate ? formatEventDateTime(upcomingEvent.eventDate) : '' } : null}
        departments={departments.map((department) => ({ name: department.name, slug: department.slug }))}
      />

      {/* Nos départements */}
      <section className="bg-gn-cream-bg">
        <div className="mx-auto max-w-6xl px-5 py-11 sm:px-10 sm:py-14">
          <Reveal className="mb-6 max-w-lg sm:mb-7">
            <p className="mb-1.5 font-serif text-base italic font-medium text-gn-gold-dark">Servir</p>
            <h2 className="mb-3 font-serif text-3xl font-semibold text-gn-ink">Nos départements</h2>
            <p className="text-sm leading-relaxed text-gn-ink/60">
              Chaque membre trouve sa place pour servir selon ses dons, au sein d&apos;un département de
              l&apos;église.
            </p>
          </Reveal>
          <HorizontalScroller className="gn-scroll-x -mx-5 flex scroll-pl-5 snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:-mx-10 sm:scroll-pl-10 sm:px-10">
            {departments.map((dept, index) => (
              <Reveal key={dept.slug} delay={index * 0.06} className="w-[78%] shrink-0 snap-start sm:w-[320px]">
                <Link
                  href={`/departements/${dept.slug}`}
                  className="gn-card-lift group flex h-full flex-col overflow-hidden rounded-lg border border-gn-line bg-white"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-gn-black">
                    {dept.imageUrl ? (
                      <Image
                        src={dept.imageUrl}
                        alt={dept.name}
                        fill
                        sizes="(max-width: 640px) 78vw, 320px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gn-black-soft to-gn-black">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--gn-gold)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                          {DEPARTMENT_ICONS[dept.slug] ?? <circle cx="12" cy="12" r="8" />}
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-6">
                    <p className="font-serif text-base font-semibold text-gn-ink">{dept.name}</p>
                    <p className="line-clamp-2 text-xs leading-relaxed text-gn-ink/60">{dept.description}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </HorizontalScroller>
          <Reveal className="mt-4 text-center">
            <Link
              href="/departements"
              className="inline-flex min-h-[44px] items-center text-sm font-semibold text-gn-gold-line hover:underline"
            >
              Voir tous les départements
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Devenir membre */}
      <section className="relative overflow-hidden bg-gn-black">
        <div
          className="gn-radial-gold-soft pointer-events-none absolute inset-0"
        />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-5 py-11 sm:px-10 sm:py-14 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:gap-16">
          <Reveal>
            <div>
              <p className="mb-3.5 font-serif text-base italic font-medium text-gn-gold">Rejoindre la famille</p>
              <h2 className="mb-4 font-serif text-3xl font-semibold leading-snug text-gn-cream">
                Devenez membre de Gospel Nation
              </h2>
              <p className="mb-6 max-w-md text-sm leading-relaxed text-gn-muted">
                L&apos;inscription ne prend que quelques minutes et vous donne immédiatement accès à votre
                carte de membre personnalisée.
              </p>
              <div className="mb-7 flex flex-col gap-3">
                {[
                  'Une carte de membre générée immédiatement',
                  'Un suivi pastoral personnalisé',
                  'L’accès aux événements réservés aux membres'
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--gn-gold)" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-sm text-gn-cream">{item}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/inscription"
                className="inline-flex rounded-full bg-gradient-to-br from-gn-gold-light to-gn-gold px-7 py-[15px] text-xs font-bold uppercase tracking-wide text-gn-black transition-opacity hover:opacity-90"
              >
                Devenir membre
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex items-center justify-center">
              <div className="relative aspect-[85/55] w-full max-w-[360px] overflow-hidden rounded-2xl bg-gradient-to-br from-gn-black-soft to-gn-black shadow-2xl">
                <div className="absolute inset-1.5 rounded-lg border border-gn-gold/35" />
                <div className="flex flex-col items-center gap-1 px-5 pt-4">
                  <Image src="/logo-gospel-nation.png" alt="" width={34} height={34} className="h-[34px] w-[34px] object-contain" />
                  <span className="mt-1.5 rounded-full border border-gn-gold/40 px-2.5 py-0.5 text-xs uppercase tracking-[0.14em] text-gn-gold">
                    Carte de membre
                  </span>
                </div>
                <div className="flex gap-3 px-5 py-4">
                  <div className="h-16 w-[52px] rounded-lg border-[1.5px] border-gn-gold bg-gn-card-slot" />
                  <div>
                    <p className="mb-1.5 font-serif text-base font-bold text-gn-cream">Prénom Nom</p>
                    <p className="text-xs text-gn-muted">N° MEMBRE</p>
                    <p className="text-xs font-semibold text-gn-cream">GN-2026-000123</p>
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 flex h-11 items-center justify-end bg-gradient-to-r from-gn-gold via-gn-gold-light to-gn-gold px-4">
                  <span className="text-xs font-bold uppercase tracking-wide text-gn-on-gold">Gospel Nation</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
