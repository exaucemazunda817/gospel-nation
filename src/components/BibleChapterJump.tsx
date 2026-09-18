'use client';

import { useRouter } from 'next/navigation';
import type { BibleBook } from '@/lib/bible';
import type { BibleVersion } from '@/lib/bible/versions';

export default function BibleChapterJump({
  books,
  currentBook,
  currentChapter,
  versions,
  currentVersion
}: {
  books: BibleBook[];
  currentBook: BibleBook;
  currentChapter: number;
  versions?: BibleVersion[];
  currentVersion?: string;
}) {
  const router = useRouter();
  const versionQuery = currentVersion && currentVersion !== 'lsg1910' ? `?version=${currentVersion}` : '';

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <select
        value={currentBook.slug}
        onChange={(e) => router.push(`/bible/${e.target.value}/1${versionQuery}`)}
        className="rounded-full border border-gn-gold/30 bg-gn-black-soft px-3.5 py-2 text-xs font-medium text-gn-cream focus:border-gn-gold focus:outline-none focus:ring-2 focus:ring-gn-gold/30"
      >
        {books.map((book) => (
          <option key={book.slug} value={book.slug}>
            {book.name}
          </option>
        ))}
      </select>
      <select
        value={currentChapter}
        onChange={(e) => router.push(`/bible/${currentBook.slug}/${e.target.value}${versionQuery}`)}
        className="rounded-full border border-gn-gold/30 bg-gn-black-soft px-3.5 py-2 text-xs font-medium text-gn-cream focus:border-gn-gold focus:outline-none focus:ring-2 focus:ring-gn-gold/30"
      >
        {Array.from({ length: currentBook.chapterCount }, (_, i) => i + 1).map((ch) => (
          <option key={ch} value={ch}>
            Chapitre {ch}
          </option>
        ))}
      </select>
      {versions && versions.length > 1 && (
        <select
          value={currentVersion}
          onChange={(e) => {
            const v = e.target.value;
            const q = v !== 'lsg1910' ? `?version=${v}` : '';
            router.push(`/bible/${currentBook.slug}/${currentChapter}${q}`);
          }}
          className="rounded-full border border-gn-gold/30 bg-gn-black-soft px-3.5 py-2 text-xs font-medium text-gn-cream focus:border-gn-gold focus:outline-none focus:ring-2 focus:ring-gn-gold/30"
        >
          {versions.map((v) => (
            <option key={v.code} value={v.code}>
              {v.name} ({v.year})
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
