export default function PageHero({
  eyebrow,
  title,
  subtitle
}: {
  eyebrow?: string;
  title: string;
  subtitle?: React.ReactNode;
}) {
  return (
    <>
      <section className="gn-glow bg-gn-black-soft text-gn-cream">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gn-gold/80">{eyebrow}</p>
          )}
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
          {subtitle && <p className="mt-3 max-w-2xl text-gn-cream/80">{subtitle}</p>}
        </div>
      </section>
      <div className="gn-accent-bar" />
    </>
  );
}
