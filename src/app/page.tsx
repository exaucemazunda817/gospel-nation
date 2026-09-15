import Image from 'next/image';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import HeroVideo from '@/components/HeroVideo';
import { church } from '@/lib/content';
import { prisma } from '@/lib/prisma';

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
  const [departments, sermons] = await Promise.all([
    prisma.department.findMany({ orderBy: { order: 'asc' }, take: 6 }),
    prisma.sermon.findMany({ orderBy: { date: 'desc' }, take: 3 })
  ]);

  const schedule = church.schedule[1];
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(church.address)}`;

  return (
    <div className="bg-gn-black">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gn-black">
        <HeroVideo src="/video/hero-accueil.mp4" />
        <div className="pointer-events-none absolute inset-0 bg-gn-black/70" />
        <div className="gn-glow absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-10 sm:py-28 lg:py-32">
          <Reveal>
            <div className="mx-auto flex max-w-xl flex-col items-center gap-5 text-center sm:mx-0 sm:items-start sm:gap-6 sm:text-left">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gn-gold">{church.name}</p>
              <h1 className="font-serif text-4xl font-bold leading-[1.12] text-gn-cream sm:text-[52px]">
                {church.tagline}
              </h1>
              <p className="max-w-md text-[15.5px] leading-relaxed text-gn-muted">
                Une famille spirituelle qui accueille, forme et envoie ceux qui cherchent Dieu. Rejoignez-nous
                pour adorer, apprendre et servir ensemble.
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-4 sm:justify-start">
                <Link
                  href="/eglise"
                  className="flex items-center gap-2.5 rounded-full bg-gradient-to-br from-gn-gold-light to-gn-gold px-7 py-[15px] text-[12.5px] font-bold uppercase tracking-wide text-gn-black transition-opacity hover:opacity-90"
                >
                  Rejoindre un culte
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                <Link
                  href="/predications"
                  className="rounded-full border border-gn-cream/35 px-[26px] py-[15px] text-[12.5px] font-semibold uppercase tracking-wide text-gn-cream transition-colors hover:border-gn-gold hover:text-gn-gold"
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
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5 px-5 py-6 sm:px-10">
          <div className="flex items-center gap-3.5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gn-gold-line)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <polyline points="12 7 12 12 16 14" />
            </svg>
            <div>
              <p className="mb-0.5 text-[11px] uppercase tracking-wide text-gn-muted">Prochain culte</p>
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
              <p className="mb-0.5 text-[11px] uppercase tracking-wide text-gn-muted">Lieu</p>
              <p className="font-serif text-base font-semibold text-gn-ink">{church.address}</p>
            </div>
          </div>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded bg-gn-black px-6 py-3 text-[11.5px] font-bold uppercase tracking-wide text-gn-cream transition-opacity hover:opacity-90"
          >
            Itinéraire
          </a>
        </div>
      </section>

      {/* Dernières prédications */}
      <section className="bg-gn-cream-bg">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-20">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-gn-gold-dark">Écouter</p>
              <h2 className="font-serif text-[28px] font-semibold text-gn-ink sm:text-[30px]">
                Dernières prédications
              </h2>
            </div>
            <Link
              href="/predications"
              className="flex items-center gap-1.5 text-[13px] font-semibold text-gn-gold-line hover:underline"
            >
              Voir toutes les prédications
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
          {sermons.length === 0 ? (
            <p className="text-sm text-gn-ink/60">Aucune prédication publiée pour le moment.</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {sermons.map((sermon, index) => (
                <Reveal key={sermon.id} delay={index * 0.06}>
                  <Link href="/predications" className="flex flex-col gap-3.5">
                    <div className="relative flex h-[170px] items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-gn-black-soft to-gn-black">
                      {sermon.coverImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={sermon.coverImageUrl}
                          alt={sermon.title}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      ) : (
                        <div
                          className="absolute inset-0 opacity-50"
                          style={{ background: 'radial-gradient(ellipse at 75% 15%, rgba(203,172,104,.35), transparent 60%)' }}
                        />
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
                      <p className="text-xs text-gn-muted">
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

      {/* Nos départements */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-20">
          <div className="mb-11 max-w-xl">
            <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-gn-gold-dark">Servir</p>
            <h2 className="mb-3 font-serif text-[28px] font-semibold text-gn-ink sm:text-[30px]">Nos départements</h2>
            <p className="text-sm leading-relaxed text-gn-ink/60">
              Chaque membre trouve sa place pour servir selon ses dons, au sein d&apos;un département de
              l&apos;église.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((dept, index) => (
              <Reveal key={dept.slug} delay={index * 0.06}>
                <Link
                  href={`/departements/${dept.slug}`}
                  className="gn-card-lift group flex h-full flex-col overflow-hidden rounded-lg border border-gn-line bg-gn-cream-bg"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-gn-black">
                    {dept.imageUrl ? (
                      <Image
                        src={dept.imageUrl}
                        alt={dept.name}
                        fill
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
                    <p className="line-clamp-2 text-[12.5px] leading-relaxed text-gn-ink/60">{dept.description}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/departements"
              className="text-[13px] font-semibold text-gn-gold-line hover:underline"
            >
              Voir tous les départements →
            </Link>
          </div>
        </div>
      </section>

      {/* Devenir membre */}
      <section className="relative overflow-hidden bg-gn-black">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 10% 100%, rgba(168,142,86,.14), transparent 55%)' }}
        />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-10 sm:py-20 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:gap-16">
          <Reveal>
            <div>
              <p className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-gn-gold">Rejoindre la famille</p>
              <h2 className="mb-4 font-serif text-[28px] font-semibold leading-snug text-gn-cream sm:text-[30px]">
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
                    <span className="text-[13px] text-gn-cream">{item}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/inscription"
                className="inline-flex items-center gap-2.5 rounded bg-gradient-to-br from-gn-gold-light to-gn-gold px-7 py-[15px] text-[12.5px] font-bold uppercase tracking-wide text-gn-black transition-opacity hover:opacity-90"
              >
                Devenir membre
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex items-center justify-center">
              <div className="relative h-[220px] w-[300px] overflow-hidden rounded-2xl bg-gradient-to-br from-gn-black-soft to-gn-black shadow-2xl sm:w-[340px]">
                <div className="absolute inset-1.5 rounded-xl border border-gn-gold/35" />
                <div className="flex flex-col items-center gap-1 px-5 pt-4">
                  <Image src="/logo-gospel-nation.png" alt="" width={30} height={30} className="h-[30px] w-[30px] object-contain" />
                  <span className="mt-1.5 rounded-full border border-gn-gold/40 px-2.5 py-0.5 text-[8px] uppercase tracking-[0.14em] text-gn-gold">
                    Carte de membre
                  </span>
                </div>
                <div className="flex gap-3 px-5 py-4">
                  <div className="h-16 w-[52px] rounded-md border-[1.5px] border-gn-gold bg-[#241f19]" />
                  <div>
                    <p className="mb-1.5 font-serif text-[13px] font-bold text-gn-cream">Prénom Nom</p>
                    <p className="text-[8px] text-gn-muted">N° MEMBRE</p>
                    <p className="text-[9px] font-semibold text-gn-cream">GN-2026-000123</p>
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 flex h-11 items-center justify-end bg-gradient-to-r from-gn-gold via-gn-gold-light to-gn-gold px-4">
                  <span className="text-[9px] font-bold uppercase tracking-wide text-[#2a2013]">Gospel Nation</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
