'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getFavorites } from '@/lib/bible/favorites';

export default function BibleFavoritesLink() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    setCount(getFavorites().length);
  }, []);

  if (count === null) return null;

  return (
    <Link
      href="/bible/favoris"
      className="flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-gn-gold-line hover:underline"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill={count > 0 ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
      Mes favoris{count > 0 ? ` (${count})` : ''}
    </Link>
  );
}
