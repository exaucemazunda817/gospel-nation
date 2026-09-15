export type BibleVersion = {
  code: string;
  name: string;
  year: string;
};

// Toutes dans le domaine public — voir la notice de chaque module source.
export const bibleVersions: BibleVersion[] = [
  { code: 'lsg1910', name: 'Louis Segond', year: '1910' },
  { code: 'martin', name: 'Martin', year: '1744' },
  { code: 'oster', name: 'Ostervald', year: '1996' }
];

export const defaultVersionCode = 'lsg1910';

export function getVersion(code: string | undefined | null): BibleVersion {
  return bibleVersions.find((v) => v.code === code) ?? bibleVersions[0];
}
