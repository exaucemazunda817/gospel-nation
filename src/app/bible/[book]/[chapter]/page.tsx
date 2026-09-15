import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BibleChapterJump from '@/components/BibleChapterJump';
import BibleReader from '@/components/BibleReader';
import BibleSearch from '@/components/BibleSearch';
import BibleFavoritesLink from '@/components/BibleFavoritesLink';
import { bibleBooks, getAdjacentChapter, getBookBySlug, getChapterVerses } from '@/lib/bible';
import { bibleVersions, getVersion } from '@/lib/bible/versions';

type PageProps = {
  params: Promise<{ book: string; chapter: string }>;
  searchParams: Promise<{ version?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { book: bookSlug, chapter } = await params;
  const book = getBookBySlug(bookSlug);
  return { title: book ? `${book.name} ${chapter} — Bible` : 'Bible' };
}

export default async function BibleChapterPage({ params, searchParams }: PageProps) {
  const { book: bookSlug, chapter: chapterParam } = await params;
  const { version: versionParam } = await searchParams;
  const book = getBookBySlug(bookSlug);
  const chapter = Number(chapterParam);
  const version = getVersion(versionParam);

  if (!book || !Number.isInteger(chapter) || chapter < 1 || chapter > book.chapterCount) {
    notFound();
  }

  const verses = await getChapterVerses(book.slug, chapter, version.code);
  if (!verses) notFound();

  const prev = getAdjacentChapter(book, chapter, 'prev');
  const next = getAdjacentChapter(book, chapter, 'next');
  const versionQuery = version.code === 'lsg1910' ? '' : `?version=${version.code}`;

  return (
    <div className="bg-gn-cream-bg">
      <section className="gn-glow relative overflow-hidden border-b border-gn-gold/20 bg-gn-black text-gn-cream">
        <div className="mx-auto max-w-3xl px-5 py-10 sm:px-10 sm:py-12">
          <div className="flex items-center justify-between gap-4">
            <Link href="/bible" className="text-[12px] font-semibold text-gn-gold-line hover:underline">
              ← Tous les livres
            </Link>
            <BibleFavoritesLink />
          </div>
          <h1 className="mt-3 font-serif text-3xl font-bold sm:text-[40px]">
            {book.name} {chapter}
          </h1>
          <p className="mt-2 text-[12.5px] text-gn-muted">
            Version {version.name} ({version.year})
          </p>
          <div className="mt-5 flex flex-col gap-3">
            <BibleChapterJump
              books={bibleBooks}
              currentBook={book}
              currentChapter={chapter}
              versions={bibleVersions}
              currentVersion={version.code}
            />
            <BibleSearch variant="dark" placeholder="Aller à une autre référence..." versionCode={version.code} />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-5 py-12 sm:px-10 sm:py-16">
        <BibleReader
          bookSlug={book.slug}
          bookName={book.name}
          chapter={chapter}
          verses={verses}
          versionCode={version.code}
        />

        <div className="mt-12 flex items-center justify-between border-t border-gn-line pt-6">
          {prev ? (
            <Link
              href={`/bible/${prev.book.slug}/${prev.chapter}${versionQuery}`}
              className="flex items-center gap-2 text-[13px] font-semibold text-gn-gold-line hover:underline"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              {prev.book.slug === book.slug ? `Chapitre ${prev.chapter}` : `${prev.book.name} ${prev.chapter}`}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/bible/${next.book.slug}/${next.chapter}${versionQuery}`}
              className="flex items-center gap-2 text-[13px] font-semibold text-gn-gold-line hover:underline"
            >
              {next.book.slug === book.slug ? `Chapitre ${next.chapter}` : `${next.book.name} ${next.chapter}`}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          ) : (
            <span />
          )}
        </div>
      </div>
    </div>
  );
}
