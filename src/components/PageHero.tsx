import HeroBackground from '@/components/HeroBackground';
import Reveal from '@/components/Reveal';

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  children
}: {
  eyebrow?: string;
  title: string;
  subtitle?: React.ReactNode;
  image?: string;
  children?: React.ReactNode;
}) {
  return (
    // Bandeau de page : la barre de menu flottante se pose sur la photo (comme
    // l'accueil et le site One Love), la photo de la page vient d'abord, puis
    // les autres photos de l'église défilent en ordre aléatoire.
    <section data-page-hero className="relative overflow-hidden border-b border-gn-gold/20 bg-gn-black text-gn-cream">
      <HeroBackground first={image} position="object-[center_30%]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gn-black/85 via-gn-black/55 to-gn-black/30 sm:bg-gradient-to-r sm:from-gn-black/85 sm:via-gn-black/50 sm:to-gn-black/20" />
      <div className="gn-glow pointer-events-none absolute inset-0" />
      <Reveal className="relative mx-auto max-w-6xl px-5 pb-12 pt-[124px] sm:px-10 sm:pb-14 sm:pt-[148px]">
        {eyebrow && (
          <p className="font-serif text-base italic font-medium text-gn-gold">{eyebrow}</p>
        )}
        <h1 className="mt-3 max-w-2xl font-serif text-4xl font-bold leading-tight sm:text-hero">{title}</h1>
        {subtitle && (
          <p className="mt-4 max-w-xl text-base leading-relaxed text-gn-cream/90">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-6 max-w-xl">{children}</div>}
      </Reveal>
    </section>
  );
}
