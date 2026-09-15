'use client';

export type BibleFavorite = {
  key: string; // `${versionCode}-${bookSlug}-${chapter}-${verse}`
  bookSlug: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  versionCode: string;
  versionName: string;
  savedAt: number;
};

const STORAGE_KEY = 'gn-bible-favorites';

export function getFavorites(): BibleFavorite[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveFavorites(favorites: BibleFavorite[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch {
    // Stockage indisponible (navigation privée stricte, quota...) — on ignore.
  }
}

export function isFavorite(key: string): boolean {
  return getFavorites().some((f) => f.key === key);
}

export function toggleFavorite(item: Omit<BibleFavorite, 'savedAt'>): boolean {
  const favorites = getFavorites();
  const exists = favorites.some((f) => f.key === item.key);
  const next = exists
    ? favorites.filter((f) => f.key !== item.key)
    : [...favorites, { ...item, savedAt: Date.now() }];
  saveFavorites(next);
  return !exists;
}

export function removeFavorite(key: string) {
  saveFavorites(getFavorites().filter((f) => f.key !== key));
}
