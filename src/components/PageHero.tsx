import Image from 'next/image';
import Link from 'next/link';
import Reveal from '@/components/Reveal';

export type HeroCrumb = { label: string; href?: string };

// Bandeau commun à toutes les pages intérieures (refonte du 27/11/2026).
//
// Fond noir chaud + lueur ambre du logo : le titre est toujours lisible, sans voile
// sur une photo. La photo de la page n'est PLUS un fond recadré en bande (les photos
// de l'église sont presque toutes verticales : une bande large en coupait les visages) :
//  - ordinateur : carte verticale 4:5 à droite, la photo entière, sans recadrage ;
//  - téléphone / tablette : bande large au-dessus du titre, cadrée par `imagePosition`
//    (position verticale du visage, propre à chaque photo) ;
//  - sans photo : bandeau de texte seul, plus bas.
// Aucune photo qui défile, aucun zoom : une page = une image stable.
export default function PageHero({
  eyebrow,
  crumbs,
  title,
  subtitle,
  image,
  imagePosition = '50% 30%',
  imageShape = 'portrait',
  children
}: {
  eyebrow?: string;
  // Fil d'Ariane après « Accueil » ; le dernier élément est la page courante.
  crumbs?: HeroCrumb[];
  title: string;
  subtitle?: React.ReactNode;
  image?: string;
  // Valeur CSS de object-position (ex. « 50% 20% ») : où se trouve le visage.
  imagePosition?: string;
  // « landscape » pour les rares photos horizontales (carte 3:2 au lieu de 4:5).
  imageShape?: 'portrait' | 'landscape';
  children?: React.ReactNode;
}) {
  const landscape = imageShape === 'landscape';
  return (
    <section data-page-hero className="relative overflow-hidden border-b border-gn-gold/20 bg-gn-black text-gn-cream">
      <div className="gn-glow pointer-events-none absolute inset-0" />
      <div
        className={`relative mx-auto max-w-6xl px-5 pb-10 pt-[104px] sm:px-10 sm:pb-12 sm:pt-[124px] ${
          image ? 'grid items-center gap-6 sm:gap-8 lg:gap-14 ' + (landscape ? 'lg:grid-cols-[minmax(0,1fr)_440px]' : 'lg:grid-cols-[minmax(0,1fr)_240px]') : ''
        }`}
      >
        <Reveal className="min-w-0 max-lg:order-2">
          {crumbs && crumbs.length > 0 && (
            <nav aria-label="Fil d’Ariane" className="mb-1 text-xs text-gn-cream/80">
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

        {image && (
          <div
            className={`relative overflow-hidden rounded-2xl border border-gn-gold/30 shadow-[0_18px_50px_-18px_rgba(0,0,0,0.8)] max-lg:order-1 max-lg:aspect-[16/9] max-lg:w-full sm:max-lg:aspect-[2/1] ${
              landscape ? 'lg:aspect-[3/2]' : 'lg:aspect-[4/5]'
            } lg:w-full lg:justify-self-end`}
          >
            <Image
              src={image}
              alt=""
              fill
              priority
              sizes={landscape ? '(min-width: 1024px) 440px, 100vw' : '(min-width: 1024px) 240px, 100vw'}
              className="object-cover"
              style={{ objectPosition: imagePosition }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
