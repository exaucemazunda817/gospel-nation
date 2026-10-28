import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import BibleSearch from '@/components/BibleSearch';
import BibleFavoritesLink from '@/components/BibleFavoritesLink';
import { bibleBooks } from '@/lib/bible';
import { bibleVersions } from '@/lib/bible/versions';
import Reveal from '@/components/Reveal';

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

      <Reveal className="mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-20">
        <Link
          href="/bible/plan"
          className="gn-card-lift gn-spot group mb-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gn-gold/30 bg-gn-black-soft px-6 py-5 text-gn-cream"
        >
          <div>
            <p className="font-serif text-base italic font-medium text-gn-gold">Plan de lecture</p>
            <p className="mt-1 font-serif text-lg font-bold">Lire toute la Bible en 365 jours</p>
          </div>
          <span className="inline-flex min-h-[44px] items-center rounded-full bg-gn-gold px-6 text-sm font-semibold text-gn-on-gold transition-colors group-hover:bg-gn-gold-light">
            Commencer le plan
          </span>
        </Link>

        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="max-w-measure text-sm text-gn-ink/70">
              <span className="font-semibold text-gn-ink">Versions disponibles : </span>
              {bibleVersions.map((v) => `${v.name} (${v.year})`).join(', ')}. Vous choisissez la version en lisant un chapitre.
            </p>
            <nav aria-label="Aller à" className="mt-3 flex flex-wrap gap-2">
              <a href="#ancien-testament" className="inline-flex min-h-[44px] items-center rounded-full border border-gn-line bg-white px-4 text-sm font-semibold text-gn-ink transition-colors hover:border-gn-gold">
                Ancien Testament
              </a>
              <a href="#nouveau-testament" className="inline-flex min-h-[44px] items-center rounded-full border border-gn-line bg-white px-4 text-sm font-semibold text-gn-ink transition-colors hover:border-gn-gold">
                Nouveau Testament
              </a>
            </nav>
          </div>
          <BibleFavoritesLink />
        </div>
        <BookSection id="ancien-testament" title="Ancien Testament" books={ancien} />
        <BookSection id="nouveau-testament" title="Nouveau Testament" books={nouveau} className="mt-14" />
      </Reveal>
    </div>
  );
}

function BookSection({
  id,
  title,
  books,
  className = ''
}: {
  id: string;
  title: string;
  books: typeof bibleBooks;
  className?: string;
}) {
  return (
    <div id={id} className={className}>
      <h2 className="mb-5 font-serif text-xl font-bold text-gn-ink">{title}</h2>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-2.5 lg:grid-cols-4">
        {books.map((book) => (
          <Link
            key={book.slug}
            href={`/bible/${book.slug}/1`}
            className="gn-card-lift gn-spot flex min-h-[44px] items-center rounded-lg border border-gn-line bg-white px-2.5 py-2 text-[13px] font-medium leading-tight text-gn-ink hyphens-auto [overflow-wrap:anywhere] transition-colors hover:border-gn-gold hover:text-gn-gold-line sm:px-4 sm:py-3 sm:text-sm"
          >
            {book.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
