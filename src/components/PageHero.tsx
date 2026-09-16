import Image from 'next/image';

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
    <section className="relative overflow-hidden border-b border-gn-gold/20 bg-gn-black text-gn-cream">
      {image && (
        <>
          <Image src={image} alt="" fill className="object-cover object-top" />
          <div className="pointer-events-none absolute inset-0 bg-gn-black/40" />
        </>
      )}
      <div className="gn-glow pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-20">
        {eyebrow && (
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gn-gold">{eyebrow}</p>
        )}
        <h1 className="mt-3 max-w-2xl font-serif text-4xl font-bold leading-tight sm:text-[44px]">{title}</h1>
        {subtitle && <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-gn-muted">{subtitle}</p>}
        {children && <div className="mt-6 max-w-xl">{children}</div>}
      </div>
    </section>
  );
}
