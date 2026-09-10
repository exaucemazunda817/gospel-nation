import Image from 'next/image';
import Link from 'next/link';
import PlaceholderNote from '@/components/PlaceholderNote';
import { church, departmentSeeds, missionPlaceholder } from '@/lib/content';

const quickLinks = [
  {
    href: '/departements',
    title: 'Nos départements',
    description: 'Gospel Family, Worship, Gospel Kids, One Love et plus encore.'
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

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="gn-glow bg-gn-black text-gn-cream">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-16 text-center sm:px-6 md:py-24">
          <Image
            src="/logo-gospel-nation.png"
            alt={`Logo ${church.name}`}
            width={566}
            height={429}
            className="gn-logo-shadow h-40 w-auto object-contain sm:h-52"
            priority
          />
          <div className="flex flex-col items-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gn-gold">{church.tagline}</p>
            <p className="mt-4 max-w-2xl text-base text-gn-cream/85 sm:text-lg">
              Une église où chacun peut adorer, servir et grandir dans la foi. Rejoignez-nous, en
              personne ou en ligne.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                href="/inscription"
                className="rounded-full bg-gn-gold px-6 py-3 text-sm font-semibold text-gn-black transition-colors hover:bg-gn-gold-dark"
              >
                Devenir membre
              </Link>
              <Link
                href="/eglise"
                className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-gn-cream transition-colors hover:bg-white/10"
              >
                Découvrir notre église
              </Link>
            </div>
          </div>
        </div>
      </section>
      <div className="gn-accent-bar" />

      {/* Horaires + adresse */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-gn-gold/20 bg-gn-black-soft p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-gn-gold">Horaires des cultes</p>
            <ul className="mt-2 space-y-1 text-gn-cream/80">
              {church.schedule.map((s) => (
                <li key={s.day}>
                  {s.day} — {s.time} ({s.label})
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-gn-gold px-6 py-6 text-gn-black">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gn-black/70">Adresse</p>
            <p className="mt-2 text-lg font-bold">{church.address}</p>
            {church.addressIsPlaceholder && (
              <p className="mt-1 text-sm text-gn-black/70">À confirmer avec l&apos;église.</p>
            )}
          </div>
        </div>
      </section>

      {/* Liens rapides */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="text-2xl font-bold text-gn-gold">Vivez la vie de l&apos;église</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg border border-white/10 bg-gn-black-soft p-4 text-sm text-gn-cream/80 shadow-sm transition-colors hover:border-gn-gold/50 hover:text-gn-cream"
            >
              <p className="font-semibold text-gn-cream">{link.title}</p>
              <p className="mt-1">{link.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Départements */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="text-2xl font-bold text-gn-gold">Nos départements</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {departmentSeeds.map((dept) => (
            <div key={dept.slug} className="rounded-lg border border-white/10 bg-gn-black-soft p-4 text-sm text-gn-cream/80">
              {dept.name}
            </div>
          ))}
        </div>
        <div className="mt-4">
          <PlaceholderNote>{missionPlaceholder}</PlaceholderNote>
        </div>
      </section>

      {/* Dons */}
      <section className="border-t border-white/10 bg-gn-black-soft">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-gn-gold">Soutenez l&apos;œuvre de Dieu</h2>
          <p className="mx-auto mt-3 max-w-xl text-gn-cream/80">
            Vos dons soutiennent la vie de l&apos;église et nos œuvres sociales, dont le ministère One
            Love auprès des enfants de la rue.
          </p>
          <Link
            href="/dons"
            className="mt-6 inline-block rounded-full bg-gn-gold px-6 py-3 text-sm font-semibold text-gn-black transition-colors hover:bg-gn-gold-dark"
          >
            Faire un don
          </Link>
        </div>
      </section>
    </div>
  );
}
