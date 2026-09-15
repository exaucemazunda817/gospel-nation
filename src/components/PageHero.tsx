export default function PageHero({
  eyebrow,
  title,
  subtitle,
  children
}: {
  eyebrow?: string;
  title: string;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="gn-glow relative overflow-hidden border-b border-gn-gold/20 bg-gn-black text-gn-cream">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-20">
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
