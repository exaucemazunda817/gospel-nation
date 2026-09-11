import Image from 'next/image';
import Link from 'next/link';
import PlaceholderNote from '@/components/PlaceholderNote';
import Reveal from '@/components/Reveal';
import { church, missionPlaceholder } from '@/lib/content';
import { prisma } from '@/lib/prisma';

const quickLinks = [
  {
    href: '/departements',
    title: 'Nos départements',
    description: 'Worship, Intercession, Gospel Kids, Nation United, One Love et plus encore.'
  },
  {
    href: '/predications',
    title: 'Prédications',
    description: 'Notes et vidéos de nos cultes, à revoir quand vous voulez.'
  },
  {
    href: '/temoignages',
    title: 'Témoignages',
    description: "Partagez ce que Dieu a fait dans votre vie, ou lisez ceux d'autres membres."
  },
  {
    href: '/rendez-vous',
    title: 'Rendez-vous pastoral',
    description: 'Prenez un moment avec le pasteur pour un accompagnement personnel.'
  }
];

export default async function HomePage() {
  const [departments, nextEvent] = await Promise.all([
    prisma.department.findMany({ orderBy: { order: 'asc' }, take: 6 }),
    prisma.event.findFirst({ orderBy: { eventDate: 'asc' } })
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="gn-glow relative overflow-hidden bg-gn-black text-gn-cream">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-16 text-center sm:px-6 md:py-24">
          <Reveal>
            <Image
              src="/logo-gospel-nation.png"
              alt={`Logo ${church.name}`}
              width={566}
              height={429}
              className="gn-logo-shadow h-40 w-auto object-contain sm:h-52"
              priority
            />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-col items-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gn-gold">{church.tagline}</p>
              <p className="mt-4 max-w-2xl text-base text-gn-cream/85 sm:text-lg">
                Une église où chacun peut adorer, servir et grandir dans la foi. Rejoignez-nous, en
                personne ou en ligne.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <Link
                  href="/inscription"
                  className="rounded-full bg-gn-gold px-6 py-3 text-sm font-semibold text-gn-black transition-all hover:scale-105 hover:bg-gn-gold-dark"
                >
                  Devenir membre
                </Link>
                <Link
                  href="/eglise"
                  className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-gn-cream transition-all hover:scale-105 hover:bg-white/10"
                >
                  Découvrir notre église
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      <div className="gn-accent-bar" />

      {/* Horaires + adresse */}
      <section className="gn-section-light">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Reveal>
              <div className="gn-card-lift h-full rounded-xl border border-gn-gold/30 bg-white p-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-gn-gold-dark">
                  Horaires des cultes
                </p>
                <ul className="mt-2 space-y-1 text-gn-ink/80">
                  {church.schedule.map((s) => (
                    <li key={`${s.day}-${s.time}`}>
                      {s.day} — {s.time} ({s.label})
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="gn-card-lift h-full rounded-xl bg-gradient-to-br from-gn-gold to-gn-orange px-6 py-6 text-gn-black">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gn-black/70">Adresse</p>
                <p className="mt-2 text-lg font-bold">{church.address}</p>
                {church.addressIsPlaceholder && (
                  <p className="mt-1 text-sm text-gn-black/70">À confirmer avec l&apos;église.</p>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Événement à venir */}
      {nextEvent && (
        <section className="gn-glow bg-gn-black text-gn-cream">
          <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 sm:px-6 md:grid-cols-[220px_1fr]">
            <Reveal>
              <div className="relative mx-auto aspect-[4/5] w-44 overflow-hidden rounded-xl shadow-2xl md:w-full">
                <Image src={nextEvent.posterImageUrl} alt={nextEvent.title} fill className="object-cover" />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="text-center md:text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gn-gold">
                  Prochain événement
                </p>
                <h2 className="mt-2 text-2xl font-bold">{nextEvent.title}</h2>
                {nextEvent.eventDate && (
                  <p className="mt-2 text-gn-cream/80">
                    {new Date(nextEvent.eventDate).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                )}
                <Link
                  href="/evenements"
                  className="mt-5 inline-block rounded-full bg-gn-gold px-6 py-3 text-sm font-semibold text-gn-black transition-all hover:scale-105 hover:bg-gn-gold-dark"
                >
                  Voir tous les événements
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}
      <div className="gn-accent-bar" />

      {/* Liens rapides */}
      <section className="bg-gn-black">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <Reveal>
            <h2 className="text-2xl font-bold text-gn-gold">Vivez la vie de l&apos;église</h2>
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map((link, index) => (
              <Reveal key={link.href} delay={index * 0.08}>
                <Link
                  href={link.href}
                  className="gn-card-lift block h-full rounded-lg border border-white/10 bg-gn-black-soft p-4 text-sm text-gn-cream/80 hover:text-gn-cream"
                >
                  <p className="font-semibold text-gn-cream">{link.title}</p>
                  <p className="mt-1">{link.description}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Départements */}
      <section className="gn-section-light">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <Reveal>
            <h2 className="text-2xl font-bold text-gn-gold-dark">Nos départements</h2>
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((dept, index) => (
              <Reveal key={dept.slug} delay={index * 0.06}>
                <Link
                  href={`/departements/${dept.slug}`}
                  className="gn-card-lift group flex h-full items-center gap-4 overflow-hidden rounded-lg border border-gn-ink/10 bg-white p-3"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-gn-black">
                    {dept.imageUrl ? (
                      <Image
                        src={dept.imageUrl}
                        alt={dept.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gn-black to-gn-ember">
                        <span className="text-lg font-bold text-gn-gold">{dept.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-gn-ink">{dept.name}</p>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between gap-4">
            <PlaceholderNote>{missionPlaceholder}</PlaceholderNote>
            <Link
              href="/departements"
              className="hidden shrink-0 whitespace-nowrap rounded-full border border-gn-gold-dark px-5 py-2.5 text-sm font-semibold text-gn-gold-dark transition-all hover:scale-105 hover:bg-gn-gold-dark hover:text-white sm:inline-block"
            >
              Voir tous les départements →
            </Link>
          </div>
        </div>
      </section>

      {/* Dons */}
      <section className="gn-glow border-t border-white/10 bg-gn-black">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
          <Reveal>
            <h2 className="text-2xl font-bold text-gn-gold">Soutenez l&apos;œuvre de Dieu</h2>
            <p className="mx-auto mt-3 max-w-xl text-gn-cream/80">
              Vos dons soutiennent la vie de l&apos;église et nos œuvres sociales, dont le ministère One
              Love auprès des enfants de la rue.
            </p>
            <Link
              href="/dons"
              className="mt-6 inline-block rounded-full bg-gn-gold px-6 py-3 text-sm font-semibold text-gn-black transition-all hover:scale-105 hover:bg-gn-gold-dark"
            >
              Faire un don
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
