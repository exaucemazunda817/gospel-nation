import Image from 'next/image';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import HeroVideo from '@/components/HeroVideo';
import AutoScrollBand from '@/components/AutoScrollBand';
import DepartmentLogo from '@/components/DepartmentLogo';
import EventsMarquee from '@/components/EventsMarquee';
import Valve from '@/components/Valve';
import { LivePlayer, LiveStrip } from '@/components/LiveSection';
import { getLiveStatus } from '@/lib/youtube-live';
import FeaturedSermon from '@/components/FeaturedSermon';
import { church, gospelNewsIssues } from '@/lib/content';
import { prisma } from '@/lib/prisma';
import { departmentSummary } from '@/lib/departments';
import { formatEventWhen } from '@/lib/dates';

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

  const [departments, departmentCount, recentSermons, upcomingEvent, live] = await Promise.all([
    prisma.department.findMany({ orderBy: { order: 'asc' }, take: 6 }),
    prisma.department.count(),
    prisma.sermon.findMany({ orderBy: { date: 'desc' }, take: 12 }),
    prisma.event.findFirst({
      where: { OR: [{ eventDate: { gte: startOfToday } }, { endDate: { gte: startOfToday } }] },
      orderBy: { eventDate: 'asc' }
    }),
    getLiveStatus()
  ]);

  // Accueil : uniquement les prédications du dimanche (décision de Mazunda du
  // 19/10/2026). « Dernière prédication » = le dernier culte du dimanche, puis les
  // deux dimanches précédents. Les cultes du mercredi restent sur /predications.
  // Séminaires (24/10/2026) : seule la DERNIÈRE prédication d'une série « Séminaire … »
  // rejoint l'accueil (ex. jour 4 de « Séminaire Crois Seulement »), triée par date
  // avec les dimanches. Dès qu'un dimanche plus récent est publié, le séminaire
  // quitte l'accueil (décision de Mazunda du 25/10/2026) : seuls des dimanches restent.
  const isSunday = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'Africa/Kinshasa' }) === 'Sun';
  const seenSeminars = new Set<string>();
  const latestSunday = recentSermons.find((s) => !s.series?.startsWith('Séminaire') && isSunday(new Date(s.date)));
  const sundaySermons = recentSermons.filter((s) => {
    if (s.series?.startsWith('Séminaire')) {
      if (latestSunday && s.date <= latestSunday.date) return false;
      if (seenSeminars.has(s.series)) return false;
      seenSeminars.add(s.series);
      return true;
    }
    return isSunday(new Date(s.date));
  });
  const sermons = (sundaySermons.length ? sundaySermons : recentSermons).slice(0, 3);

  // Numéros les plus récents d'abord.
  const issues = [...gospelNewsIssues].sort((a, b) => b.volume - a.volume);

  const schedule = church.schedule[1];
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(church.address)}`;

  // Cartes réutilisées : en bande (téléphone) et en grille (ordinateur).
  const issueCard = (issue: (typeof issues)[number], index: number) => (
    <a
      href={issue.fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="gn-spot group flex h-full w-full items-center gap-5 rounded-lg border border-gn-line bg-white p-4 transition-colors hover:border-gn-gold"
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
        <p className="mb-1.5 font-serif text-lg font-semibold text-gn-ink">
          Gospel News, volume {issue.volume}
        </p>
        <p className="text-xs text-gn-muted-strong">{issue.date}, télécharger le PDF</p>
      </div>
    </a>
  );
  const departmentCard = (dept: (typeof departments)[number]) => (
    <Link
      draggable={false}
      href={`/departements/${dept.slug}`}
      className="gn-card-lift gn-spot group flex h-full w-full flex-col overflow-hidden rounded-lg border border-gn-line bg-gn-cream-bg"
    >
      <div className="gn-photo-hover relative aspect-[4/3] w-full overflow-hidden bg-gn-black">
        {dept.imageUrl ? (
          <DepartmentLogo slug={dept.slug} name={dept.name} sizes="(max-width: 640px) 40vw, 240px" />
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
        <p className="line-clamp-3 text-sm leading-relaxed text-gn-ink/70">{departmentSummary(dept)}</p>
      </div>
    </Link>
  );

  return (
    <div className="bg-gn-black">
      {/* Hero */}
      <section data-home-hero className="relative overflow-hidden bg-gn-black">
        <HeroVideo src="/video/hero-accueil.mp4" poster="/video/hero-accueil-poster.jpg" />
        <div className="pointer-events-none absolute inset-0 bg-gn-black/70" />
        {/* Voile supplémentaire côté texte : la vidéo contient son propre
            texte incrusté par endroits, qui peut entrer en collision avec le
            titre superposé. On assombrit davantage la zone où le texte
            s'affiche (bas sur mobile où il est centré, gauche sur desktop où
            il est aligné à gauche) sans assombrir toute la vidéo. */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gn-black/90 via-gn-black/60 to-gn-black/15 sm:bg-gradient-to-r sm:from-gn-black/85 sm:via-gn-black/35 sm:to-transparent" />
        <div className="gn-glow absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-36 sm:px-10 sm:pb-28 sm:pt-44 lg:pb-32 lg:pt-48">
          <Reveal>
            <div className="mx-auto flex max-w-xl flex-col items-center gap-5 text-center sm:mx-0 sm:items-start sm:gap-6 sm:text-left">
              <p className="font-serif text-base italic font-medium text-gn-gold">{church.name}</p>
              <h1 className="font-serif text-4xl font-bold leading-[1.12] text-gn-cream sm:text-display">
                {church.tagline}
              </h1>
              <p className="max-w-md text-sm leading-snug text-gn-cream/85 sm:text-base sm:leading-relaxed">
                Une famille spirituelle qui accueille, forme et envoie ceux qui cherchent Dieu. Rejoignez-nous
                pour adorer, apprendre et servir ensemble.
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-3 sm:justify-start">
                <Link
                  href="/predications"
                  className="inline-flex min-h-[44px] items-center rounded-full bg-gradient-to-br from-gn-gold-light to-gn-gold px-7 text-xs font-bold uppercase tracking-wide text-gn-black transition-opacity hover:opacity-90"
                >
                  Écouter la dernière prédication
                </Link>
                <a
                  href="#visite"
                  className="inline-flex min-h-[44px] items-center rounded-full border border-gn-cream/35 px-[26px] text-xs font-semibold uppercase tracking-wide text-gn-cream transition-colors hover:border-gn-gold hover:text-gn-gold"
                >
                  Planifier ma visite
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Prochain culte / Lieu */}
      <section id="visite" className="scroll-mt-28 border-b border-gn-line bg-gn-cream">
        <Reveal className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5 px-5 py-6 sm:px-10">
          <div className="flex items-center gap-3.5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gn-gold-line)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <polyline points="12 7 12 12 16 14" />
            </svg>
            <div>
              <p className="mb-0.5 text-xs font-semibold text-gn-muted-strong">Prochain culte</p>
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
              <p className="mb-0.5 text-xs font-semibold text-gn-muted-strong">Lieu</p>
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
        {/* Direct des cultes sur YouTube : lien à ouvrir ou à copier */}
        <LiveStrip live={live} />
      </section>

      {/* Lecteur du direct, seulement pendant un culte diffusé */}
      <LivePlayer live={live} />

      {/* Bande défilante : événement à venir, cultes, services, départements */}
      <EventsMarquee
        event={upcomingEvent ? { title: upcomingEvent.title, when: upcomingEvent.eventDate ? formatEventWhen(upcomingEvent.eventDate, upcomingEvent.endDate) : '' } : null}
        departments={departments.map((department) => ({ name: department.name, slug: department.slug, imageUrl: department.imageUrl }))}
      />

      {/* La valve : communiqués et événements à venir (vide = rien d'affiché) */}
      <Valve />

      {/* Vedette : la dernière prédication, puis les deux précédentes */}
      <FeaturedSermon sermons={sermons} />

      {/* Dernières parutions (revues Gospel News) */}
      {issues.length > 0 && (
        <section className="bg-gn-cream">
          <div className="mx-auto max-w-6xl px-5 py-11 sm:px-10 sm:py-14">
            <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-x-4 gap-y-1 sm:mb-8">
              <div>
                <h2 className="font-serif text-3xl font-semibold text-gn-ink">Dernières parutions</h2>
                <p className="mt-2 max-w-measure text-sm text-gn-muted-strong">
                  {issues.length} revue{issues.length > 1 ? 's' : ''} Gospel News à télécharger, la plus récente date du {issues[0].date}.
                </p>
              </div>
              <Link
                href="/departements/gospel-news"
                className="inline-flex min-h-[44px] items-center text-sm font-semibold text-gn-gold-dark hover:underline"
              >
                Voir tous les articles
              </Link>
            </Reveal>
            {/* Téléphone : bande qui défile ; dès sm : grille de deux colonnes */}
            <div className="-mx-5 sm:hidden">
              <AutoScrollBand label="Dernières parutions" fade={false}>
                {issues.map((issue, index) => (
                  <div key={issue.fileUrl} className="flex w-[86vw] shrink-0">
                    {issueCard(issue, index)}
                  </div>
                ))}
              </AutoScrollBand>
            </div>
            <div className="hidden gap-6 sm:grid sm:grid-cols-2">
              {issues.map((issue, index) => (
                <Reveal key={issue.fileUrl} delay={index * 0.06}>
                  {issueCard(issue, index)}
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Nos départements */}
      <section className="overflow-x-clip bg-white">
        <div className="mx-auto max-w-6xl px-5 py-11 sm:px-10 sm:py-14">
          <Reveal className="mb-6 max-w-lg sm:mb-7">
            <h2 className="mb-3 font-serif text-3xl font-semibold text-gn-ink">Nos départements</h2>
            <p className="text-sm leading-relaxed text-gn-ink/70">
              {departmentCount} équipes à rejoindre pour servir selon vos dons, au sein de l&apos;église.
            </p>
          </Reveal>
          {/* Bande sur toute la largeur de l'écran : les cartes entrent et sortent par
              les bords de l'écran, sans voile ni coupure au bord du contenu. */}
          <div className="mx-[calc(50%-50vw)]">
            <AutoScrollBand label="Nos départements" fade={false}>
              {departments.map((dept) => (
                <div key={dept.slug} className="flex w-[78vw] max-w-[340px] shrink-0 sm:w-[320px]">
                  {departmentCard(dept)}
                </div>
              ))}
            </AutoScrollBand>
          </div>
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
