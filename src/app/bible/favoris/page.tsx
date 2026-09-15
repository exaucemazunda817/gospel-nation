'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import { getFavorites, removeFavorite, type BibleFavorite } from '@/lib/bible/favorites';

export default function BibleFavoritesPage() {
  const [favorites, setFavorites] = useState<BibleFavorite[] | null>(null);

  useEffect(() => {
    setFavorites(getFavorites().sort((a, b) => b.savedAt - a.savedAt));
  }, []);

  const handleRemove = (key: string) => {
    removeFavorite(key);
    setFavorites((prev) => (prev ? prev.filter((f) => f.key !== key) : prev));
  };

  return (
    <div className="bg-gn-cream-bg">
      <PageHero
        eyebrow="Bible"
        title="Mes versets favoris"
        subtitle="Enregistrés dans ce navigateur uniquement — ils ne sont visibles que sur cet appareil."
      />

      <div className="mx-auto max-w-3xl px-5 py-14 sm:px-10 sm:py-16">
        <Link href="/bible" className="text-[12.5px] font-semibold text-gn-gold-line hover:underline">
          ← Retour à la Bible
        </Link>

        {favorites === null ? null : favorites.length === 0 ? (
          <p className="mt-8 text-[14px] text-gn-ink/60">
            Aucun favori pour l&apos;instant. En lisant un chapitre, cliquez sur l&apos;étoile à côté d&apos;un
            verset pour l&apos;ajouter ici.
          </p>
        ) : (
          <div className="mt-8 flex flex-col gap-4">
            {favorites.map((f) => (
              <div key={f.key} className="rounded-2xl border border-gn-line bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/bible/${f.bookSlug}/${f.chapter}${
                        f.versionCode && f.versionCode !== 'lsg1910' ? `?version=${f.versionCode}` : ''
                      }#verset-${f.verse}`}
                      className="text-[12.5px] font-bold uppercase tracking-wide text-gn-gold-line hover:underline"
                    >
                      {f.bookName} {f.chapter}:{f.verse}
                    </Link>
                    {f.versionName && (
                      <span className="ml-2 text-[11px] font-medium text-gn-ink/40">{f.versionName}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(f.key)}
                    aria-label="Retirer des favoris"
                    className="shrink-0 text-gn-ink/40 hover:text-red-500"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="mt-2 text-[15px] leading-relaxed text-gn-ink">{f.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
