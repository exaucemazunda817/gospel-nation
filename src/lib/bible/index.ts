import booksIndex from './books.json';

export type BibleBook = {
  number: number;
  slug: string;
  name: string;
  testament: 'AT' | 'NT';
  chapterCount: number;
};

export const bibleBooks = booksIndex as BibleBook[];

export function getBookBySlug(slug: string): BibleBook | undefined {
  return bibleBooks.find((b) => b.slug === slug);
}

export function getAdjacentChapter(
  book: BibleBook,
  chapter: number,
  direction: 'prev' | 'next'
): { book: BibleBook; chapter: number } | null {
  if (direction === 'next') {
    if (chapter < book.chapterCount) return { book, chapter: chapter + 1 };
    const nextBook = bibleBooks.find((b) => b.number === book.number + 1);
    return nextBook ? { book: nextBook, chapter: 1 } : null;
  }
  if (chapter > 1) return { book, chapter: chapter - 1 };
  const prevBook = bibleBooks.find((b) => b.number === book.number - 1);
  return prevBook ? { book: prevBook, chapter: prevBook.chapterCount } : null;
}

// Chaque livre est chargé à la demande (pas tout empaqueté d'un coup) —
// import dynamique pour que le bundle par page reste léger.
export async function getChapterVerses(
  slug: string,
  chapter: number,
  versionCode: string = 'lsg1910'
): Promise<string[] | null> {
  try {
    const mod = (await import(`./data/${versionCode}/${slug}.json`)) as { default: string[][] };
    const chapters = mod.default;
    return chapters[chapter - 1] ?? null;
  } catch {
    return null;
  }
}

function normalize(s: string): string {
  return s
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

// Abréviations usuelles (françaises) vers le nom complet du livre — pour que
// "jn 3:16" ou "1co 13" fonctionnent comme "jean 3:16" / "1 corinthiens 13".
const ABBREVIATIONS: Record<string, string> = {
  gn: 'genese', ge: 'genese',
  ex: 'exode',
  lv: 'levitique', lev: 'levitique',
  nb: 'nombres', nm: 'nombres',
  dt: 'deuteronome', deut: 'deuteronome',
  jos: 'josue',
  jg: 'juges', jdg: 'juges',
  rt: 'ruth',
  '1s': '1-samuel', '1sa': '1-samuel',
  '2s': '2-samuel', '2sa': '2-samuel',
  '1r': '1-rois', '1ki': '1-rois',
  '2r': '2-rois', '2ki': '2-rois',
  '1ch': '1-chroniques', '1chr': '1-chroniques',
  '2ch': '2-chroniques', '2chr': '2-chroniques',
  esd: 'esdras',
  ne: 'nehemie', neh: 'nehemie',
  est: 'esther',
  jb: 'job',
  ps: 'psaumes', psa: 'psaumes',
  pr: 'proverbes', prov: 'proverbes',
  ec: 'ecclesiaste', eccl: 'ecclesiaste',
  cant: 'cantique-des-cantiques',
  es: 'esaie', esa: 'esaie', is: 'esaie',
  jr: 'jeremie', jer: 'jeremie',
  lam: 'lamentations',
  ez: 'ezechiel', eze: 'ezechiel',
  dn: 'daniel', dan: 'daniel',
  os: 'osee',
  jl: 'joel',
  am: 'amos',
  ab: 'abdias',
  jon: 'jonas',
  mi: 'michee', mic: 'michee',
  na: 'nahum',
  ha: 'habacuc', hab: 'habacuc',
  so: 'sophonie', soph: 'sophonie',
  ag: 'aggee',
  za: 'zacharie', zac: 'zacharie',
  ml: 'malachie', mal: 'malachie',
  mt: 'matthieu',
  mc: 'marc', mr: 'marc',
  lc: 'luc',
  jn: 'jean',
  ac: 'actes',
  rm: 'romains', rom: 'romains',
  '1co': '1-corinthiens',
  '2co': '2-corinthiens',
  ga: 'galates', gal: 'galates',
  ep: 'ephesiens', eph: 'ephesiens',
  ph: 'philippiens', phil: 'philippiens',
  col: 'colossiens',
  '1th': '1-thessaloniciens', '1thes': '1-thessaloniciens',
  '2th': '2-thessaloniciens', '2thes': '2-thessaloniciens',
  '1tm': '1-timothee', '1ti': '1-timothee',
  '2tm': '2-timothee', '2ti': '2-timothee',
  tt: 'tite',
  phm: 'philemon',
  he: 'hebreux', heb: 'hebreux',
  jc: 'jacques', jas: 'jacques',
  '1p': '1-pierre', '1pi': '1-pierre',
  '2p': '2-pierre', '2pi': '2-pierre',
  '1jn': '1-jean',
  '2jn': '2-jean',
  '3jn': '3-jean',
  jude: 'jude',
  ap: 'apocalypse', apo: 'apocalypse', rev: 'apocalypse'
};

export type BibleReference = { book: BibleBook; chapter: number; verse: number | null };

// Interprète une saisie libre ("Jean 3:16", "1 corinthiens 13", "jn 3") et
// retourne la référence trouvée, ou null si rien ne correspond.
export function parseBibleReference(input: string): BibleReference | null {
  const raw = input.trim();
  if (!raw) return null;

  const match = raw.match(/^(.*?)\s*(\d+)?\s*(?:[:.](\d+))?$/);
  if (!match) return null;
  const [, bookPart, chapterStr, verseStr] = match;
  const bookQuery = normalize(bookPart || raw);
  if (!bookQuery) return null;

  const abbrevSlug = ABBREVIATIONS[bookQuery.replace(/\s+/g, '')];
  let book = abbrevSlug ? bibleBooks.find((b) => b.slug === abbrevSlug) : undefined;

  if (!book) {
    book =
      bibleBooks.find((b) => normalize(b.name) === bookQuery) ||
      bibleBooks.find((b) => normalize(b.name).startsWith(bookQuery)) ||
      bibleBooks.find((b) => normalize(b.name).includes(bookQuery));
  }
  if (!book) return null;

  const chapter = chapterStr ? Math.min(Math.max(1, parseInt(chapterStr, 10)), book.chapterCount) : 1;
  const verse = verseStr ? parseInt(verseStr, 10) : null;
  return { book, chapter, verse };
}
