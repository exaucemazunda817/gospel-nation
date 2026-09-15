import Link from 'next/link';
import { parseReadingRefs } from '@/lib/reading-plan';

// Affiche une case du plan ("Genèse 1–3", "Cantique des Cantiques 7–8; Ésaïe 1")
// en liant chaque chapitre vers le lecteur biblique du site.
export default function ReadingRefLinks({ label, className = '' }: { label: string; className?: string }) {
  const refs = parseReadingRefs(label);
  if (refs.length === 0) return <span className={className}>{label}</span>;

  const nodes: React.ReactNode[] = [];
  let lastBook = '';
  refs.forEach((ref, i) => {
    const showBookName = ref.book.name !== lastBook;
    lastBook = ref.book.name;
    if (i > 0) {
      nodes.push(
        <span key={`sep-${i}`} className="text-gn-ink/30">
          {showBookName ? ' ' : ', '}
        </span>
      );
    }
    if (showBookName) {
      nodes.push(
        <span key={`book-${i}`}>
          {ref.book.name}{' '}
        </span>
      );
    }
    nodes.push(
      <Link key={`ch-${i}`} href={`/bible/${ref.book.slug}/${ref.chapter}`} className="text-gn-gold-line hover:underline">
        {ref.chapter}
      </Link>
    );
  });

  return <span className={className}>{nodes}</span>;
}
