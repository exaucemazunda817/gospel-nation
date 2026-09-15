import planData from './plan.json';
import { bibleBooks, type BibleBook } from '@/lib/bible';

export type ReadingDay = {
  day: number;
  ot: string;
  nt: string;
  ntPass: 1 | 2; // 1re ou 2e lecture du Nouveau Testament dans l'année
};

export const readingPlan: ReadingDay[] = (planData as [number, string, string, number][]).map(
  ([day, ot, nt, ntPass]) => ({ day, ot, nt, ntPass: ntPass as 1 | 2 })
);

export const TOTAL_DAYS = readingPlan.length;

export type ChapterRef = { book: BibleBook; chapter: number };

// Livres triés du nom le plus long au plus court, pour matcher "1 Samuel"
// avant "1" ou toute ambiguïté de préfixe.
const booksByNameLength = [...bibleBooks].sort((a, b) => b.name.length - a.name.length);

// Découpe une case du plan ("Genèse 1–3", "Cantique des Cantiques 7–8; Ésaïe 1")
// en une liste de chapitres cliquables vers le lecteur biblique du site.
export function parseReadingRefs(label: string): ChapterRef[] {
  const refs: ChapterRef[] = [];
  const segments = label.split(';').map((s) => s.trim());

  for (const segment of segments) {
    const book = booksByNameLength.find((b) => segment.startsWith(b.name));
    if (!book) continue;
    const rest = segment.slice(book.name.length).trim();
    const match = rest.match(/^(\d+)(?:[–-](\d+))?$/);
    if (!match) continue;
    const start = parseInt(match[1], 10);
    const end = match[2] ? parseInt(match[2], 10) : start;
    for (let ch = start; ch <= end && ch <= book.chapterCount; ch++) {
      refs.push({ book, chapter: ch });
    }
  }

  return refs;
}
