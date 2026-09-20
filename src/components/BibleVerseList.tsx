'use client';

import { useEffect, useState } from 'react';
import { isFavorite, toggleFavorite } from '@/lib/bible/favorites';

export default function BibleVerseList({
  bookSlug,
  bookName,
  chapter,
  verses,
  fontSizePx = 16,
  versionCode = 'lsg1910',
  versionName = 'Louis Segond'
}: {
  bookSlug: string;
  bookName: string;
  chapter: number;
  verses: string[];
  fontSizePx?: number;
  versionCode?: string;
  versionName?: string;
}) {
  return (
    <div className="flex flex-col gap-3.5" style={{ fontSize: fontSizePx }}>
      {verses.map((text, i) => (
        <BibleVerseRow
          key={i}
          bookSlug={bookSlug}
          bookName={bookName}
          chapter={chapter}
          verse={i + 1}
          text={text}
          versionCode={versionCode}
          versionName={versionName}
        />
      ))}
    </div>
  );
}

function BibleVerseRow({
  bookSlug,
  bookName,
  chapter,
  verse,
  text,
  versionCode,
  versionName
}: {
  bookSlug: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  versionCode: string;
  versionName: string;
}) {
  const key = `${versionCode}-${bookSlug}-${chapter}-${verse}`;
  const [fav, setFav] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setFav(isFavorite(key));
  }, [key]);

  const reference = `${bookName} ${chapter}:${verse}`;
  const shareText = `« ${text} » — ${reference}`;

  const handleToggleFavorite = () => {
    const nowFav = toggleFavorite({ key, bookSlug, bookName, chapter, verse, text, versionCode, versionName });
    setFav(nowFav);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Presse-papiers indisponible — on ignore silencieusement.
    }
  };

  return (
    <p id={`verset-${verse}`} className="group scroll-mt-28 leading-relaxed text-gn-ink">
      <span className="mr-1.5 align-super text-xs font-bold text-gn-gold-line">{verse}</span>
      {text}
      <span className="ml-2 inline-flex items-center gap-1.5 align-middle opacity-40 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={handleToggleFavorite}
          aria-label={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          className="inline-flex h-6 min-h-0 w-6 items-center justify-center rounded-full text-gn-gold-line hover:bg-gn-gold/10"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill={fav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Partager sur WhatsApp"
          className="inline-flex h-6 min-h-0 w-6 items-center justify-center rounded-full text-gn-gold-line hover:bg-gn-gold/10"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.34 2 11.7c0 1.96.62 3.78 1.68 5.3L2 22l5.2-1.63A10.1 10.1 0 0 0 12 21.4c5.52 0 10-4.34 10-9.7S17.52 2 12 2zm0 17.7c-1.6 0-3.1-.44-4.38-1.2l-.31-.18-3.09.97.99-2.98-.2-.32a7.9 7.9 0 0 1-1.24-4.27c0-4.35 3.65-7.88 8.23-7.88s8.23 3.53 8.23 7.88-3.65 7.88-8.23 7.88z" />
          </svg>
        </a>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copier le verset"
          className="inline-flex h-6 min-h-0 w-6 items-center justify-center rounded-full text-gn-gold-line hover:bg-gn-gold/10"
        >
          {copied ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
        </button>
      </span>
    </p>
  );
}
