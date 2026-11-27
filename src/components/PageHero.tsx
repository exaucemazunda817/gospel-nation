import { getImageProps } from 'next/image';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import { HERO_WIDE } from '@/lib/hero-photos';

export type HeroCrumb = { label: string; href?: string };

// Bandeau commun à toutes les pages intérieures (refonte du 27/11/2026, solution B choisie par Mazunda) :
// grande photo plein fond, texte par-dessus un voile dégradé.
//  - ordinateur / tablette : version HORIZONTALE (2,4:1) de la photo, préparée à part (HERO_WIDE) ;
//  - téléphone : la photo d'origine (verticale), car le bandeau y est presque aussi haut que large ;
//  - sans photo : bandeau de texte seul.
// Aucune photo qui défile, aucun zoom : une page = une image stable. Le voile est plus
// dense côté texte (gauche sur ordinateur, bas sur téléphone) pour que le titre se lise partout.
export default function PageHero({
  eyebrow,
  crumbs,
  title,
  subtitle,
  image,
  imagePosition = '50% 30%',
  children
}: {
  eyebrow?: string;
  // Fil d'Ariane après « Accueil » ; le dernier élément est la page courante.
  crumbs?: HeroCrumb[];
  title: string;
  subtitle?: React.ReactNode;
  image?: string;
  // object-position de la photo d'origine (téléphone), ex. « 50% 20% ».
  imagePosition?: string;
  children?: React.ReactNode;
}) {
  const wide = image ? (HERO_WIDE[image] ?? image) : undefined;
  let picture: React.ReactNode = null;
  if (image && wide) {
    const common = { alt: '', fill: true, sizes: '100vw', priority: true };
    const {
      props: { srcSet: wideSet }
    } = getImageProps({ ...common, src: wide, quality: 80 });
    const {
      props: { srcSet: baseSet, ...rest }
    } = getImageProps({ ...common, src: image, quality: 75 });
    picture = (
      <picture>
        <source media="(min-width: 640px)" srcSet={wideSet} />
        <img
          {...rest}
          srcSet={baseSet}
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover max-sm:[object-position:var(--hero-pos)] sm:object-[50%_50%]"
        />
      </picture>
    );
  }

  return (
    <section
      data-page-hero
      className="relative isolate overflow-hidden border-b border-gn-gold/20 bg-gn-black text-gn-cream"
      style={{ ['--hero-pos' as string]: imagePosition }}
    >
      {picture}
      {image && <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-gn-black/70 to-transparent" />}
      {image ? (
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gn-black/95 via-gn-black/65 to-gn-black/25 sm:bg-gradient-to-r sm:from-gn-black/90 sm:via-gn-black/55 sm:to-gn-black/5" />
      ) : (
        <div className="gn-glow pointer-events-none absolute inset-0 -z-10" />
      )}
      <Reveal
        className={`mx-auto flex max-w-6xl flex-col px-5 pb-10 pt-[104px] sm:px-10 sm:pb-14 sm:pt-[124px] ${
          image ? 'min-h-[480px] justify-end sm:min-h-[540px] lg:min-h-[560px]' : ''
        }`}
      >
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Fil d’Ariane" className="mb-1 text-xs text-gn-cream/85">
            <Link href="/" className="inline-flex min-h-[44px] items-center hover:text-gn-gold">
              Accueil
            </Link>
            {crumbs.map((crumb, i) => {
              const last = i === crumbs.length - 1;
              return (
                <span key={crumb.label}>
                  {' / '}
                  {crumb.href && !last ? (
                    <Link href={crumb.href} className="inline-flex min-h-[44px] items-center hover:text-gn-gold">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-gn-gold-light" aria-current={last ? 'page' : undefined}>
                      {crumb.label}
                    </span>
                  )}
                </span>
              );
            })}
          </nav>
        )}
        {eyebrow && <p className="font-serif text-base italic font-medium text-gn-gold">{eyebrow}</p>}
        <h1 className="mt-2 max-w-2xl font-serif text-3xl font-bold leading-tight text-gn-cream sm:text-hero">{title}</h1>
        {subtitle && <p className="mt-4 max-w-xl text-base leading-relaxed text-gn-cream/90">{subtitle}</p>}
        {children && <div className="mt-6 max-w-xl">{children}</div>}
      </Reveal>
    </section>
  );
}
