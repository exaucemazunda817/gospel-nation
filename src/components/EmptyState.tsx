import Link from 'next/link';

// État vide : une page sans contenu invite à agir au lieu d'afficher une
// étiquette « à compléter » (qui se lit comme une panne ou un oubli). Dit ce
// qui manque, pourquoi, et ce que le visiteur peut faire.
export default function EmptyState({
  title,
  text,
  action,
  headingLevel = 3
}: {
  title: string;
  text: string;
  action?: { href: string; label: string };
  /** 2 quand l'état vide suit directement le titre de la page (pas de niveau sauté). */
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-gn-gold-line/40 bg-white px-6 py-10 text-center sm:px-10">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gn-gold/15 text-gn-gold-line" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v5" />
          <path d="M12 16.5h.01" />
        </svg>
      </span>
      <Heading className="mt-5 font-serif text-xl font-semibold text-gn-ink">{title}</Heading>
      <p className="mx-auto mt-2 max-w-measure text-sm leading-relaxed text-gn-ink/70">{text}</p>
      {action && (
        <Link
          href={action.href}
          className="mt-6 inline-flex min-h-[44px] items-center rounded-full bg-gn-gold px-6 text-sm font-semibold text-gn-on-gold transition-colors hover:bg-gn-gold-light"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
