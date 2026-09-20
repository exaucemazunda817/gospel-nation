import Image from 'next/image';
import Link from 'next/link';
import Reveal from '@/components/Reveal';

// Bandeau commun aux pages de prédications (liste, prédication choisie, catalogue).
export default function PredicationsHero({
  title,
  subtitle,
  crumb
}: {
  title: string;
  subtitle: string;
  // Fil d'Ariane : la page courante, précédée d'un lien vers /predications si `parent` est vrai.
  crumb: { label: string; parent?: boolean };
}) {
  return (
    <section className="relative h-[220px] overflow-hidden border-b border-gn-gold/20 bg-gn-black sm:h-[260px]">
      <Image src="/hero/predications.jpg" alt="" fill sizes="100vw" className="gn-kenburns object-cover object-top" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gn-black/85 via-gn-black/55 to-gn-black/30 sm:bg-gradient-to-r sm:from-gn-black/85 sm:via-gn-black/50 sm:to-gn-black/20" />
      <div className="gn-glow pointer-events-none absolute inset-0" />
      <Reveal className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-5 sm:px-10">
        <p className="mb-1 text-xs text-gn-cream/80">
          <Link href="/" className="inline-flex min-h-[44px] items-center hover:text-gn-gold">Accueil</Link> /{' '}
          {crumb.parent ? (
            <>
              <Link href="/predications" className="inline-flex min-h-[44px] items-center hover:text-gn-gold">Prédications</Link> /{' '}
            </>
          ) : null}
          <span className="text-gn-gold-light">{crumb.label}</span>
        </p>
        <h1 className="font-serif text-3xl font-bold text-gn-cream sm:text-hero">{title}</h1>
        <p className="mt-3.5 max-w-md text-sm text-gn-cream/90">{subtitle}</p>
      </Reveal>
    </section>
  );
}
