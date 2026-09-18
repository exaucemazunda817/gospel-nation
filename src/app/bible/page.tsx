import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import BibleSearch from '@/components/BibleSearch';
import BibleFavoritesLink from '@/components/BibleFavoritesLink';
import { bibleBooks } from '@/lib/bible';
import { bibleVersions } from '@/lib/bible/versions';

export const metadata: Metadata = {
  title: 'Bible',
  description:
    'Lisez la Bible en ligne en quatre versions du domaine public — Louis Segond, Martin, Ostervald et Darby — avec recherche par référence.'
};

export default function BiblePage() {
  const ancien = bibleBooks.filter((b) => b.testament === 'AT');
  const nouveau = bibleBooks.filter((b) => b.testament === 'NT');

  return (
    <div className="bg-gn-cream-bg">
      <PageHero
        eyebrow="Ressource"
        title="La Bible"
        subtitle="Quatre versions dans le domaine public. Cherchez une référence ou choisissez un livre pour commencer votre lecture."
        image="/hero/bible.jpg"
      >
        <BibleSearch variant="dark" />
      </PageHero>

      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-20">
        <Link
          href="/bible/plan"
          className="gn-card-lift mb-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gn-gold/30 bg-gn-black-soft px-6 py-5 text-gn-cream"
        >
          <div>
            <p className="font-serif text-base italic font-medium text-gn-gold">Plan de lecture</p>
            <p className="mt-1 font-serif text-lg font-bold">Lire toute la Bible en 365 jours</p>
          </div>
          <span className="text-xs font-semibold text-gn-gold">Commencer</span>
        </Link>

        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {bibleVersions.map((v) => (
              <span
                key={v.code}
                className="rounded-full border border-gn-line bg-white px-3.5 py-1.5 text-xs font-semibold text-gn-ink/70"
              >
                {v.name} ({v.year})
              </span>
            ))}
          </div>
          <BibleFavoritesLink />
        </div>
        <BookSection title="Ancien Testament" books={ancien} />
        <BookSection title="Nouveau Testament" books={nouveau} className="mt-14" />
      </div>
    </div>
  );
}

function BookSection({
  title,
  books,
  className = ''
}: {
  title: string;
  books: typeof bibleBooks;
  className?: string;
}) {
  return (
    <div className={className}>
      <h2 className="mb-5 font-serif text-xl font-bold text-gn-ink">{title}</h2>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
        {books.map((book) => (
          <Link
            key={book.slug}
            href={`/bible/${book.slug}/1`}
            className="gn-card-lift rounded-lg border border-gn-line bg-white px-4 py-3 text-sm font-medium text-gn-ink transition-colors hover:border-gn-gold hover:text-gn-gold-line"
          >
            {book.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
