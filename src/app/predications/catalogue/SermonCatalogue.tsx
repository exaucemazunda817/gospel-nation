'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatSermonDate, groupByTheme, normalizeText, themeOf, type SermonSummary } from '@/lib/sermons';

const chipBase =
  'inline-flex min-h-[44px] items-center rounded-full border px-4 text-xs font-semibold transition-colors';

// Un seul thème est affiché à la fois : les autres apparaissent quand on clique
// sur leur nom. Recherche et thèmes se font dans le navigateur (les prédications
// sont déjà là), donc chaque frappe répond instantanément, sans appel réseau.
export default function SermonCatalogue({ sermons }: { sermons: SermonSummary[] }) {
  const [query, setQuery] = useState('');

  // Thèmes qui existent réellement, dans l'ordre d'affichage. Le premier est
  // celui qu'on voit à l'ouverture de la page.
  const themes = useMemo(() => groupByTheme(sermons).map((g) => g.theme), [sermons]);
  const [chosenTheme, setChosenTheme] = useState<string>(themes[0] ?? '');

  const searchText = useMemo(
    () =>
      new Map(
        sermons.map((s) => [
          s.id,
          normalizeText([s.title, s.speaker, s.series ?? '', themeOf(s), formatSermonDate(s.date)].join(' '))
        ])
      ),
    [sermons]
  );

  const q = normalizeText(query.trim());
  const matches = sermons.filter((s) => !q || (searchText.get(s.id) ?? '').includes(q));

  // Nombre de résultats par thème, pour indiquer où se trouvent les réponses.
  const countByTheme = new Map(groupByTheme(matches).map((g) => [g.theme, g.sermons.length]));

  // Si la recherche ne donne rien dans le thème ouvert mais en donne ailleurs, on
  // ouvre le premier thème qui a des résultats plutôt que d'afficher une page vide.
  const activeTheme =
    (countByTheme.get(chosenTheme) ?? 0) > 0 ? chosenTheme : (themes.find((t) => (countByTheme.get(t) ?? 0) > 0) ?? chosenTheme);

  const visible = groupByTheme(matches).find((g) => g.theme === activeTheme)?.sermons ?? [];
  const totalMatches = matches.length;

  return (
    <div>
      <div>
        <label htmlFor="sermon-search" className="mb-1.5 block text-sm font-medium text-gn-ink/80">
          Rechercher une prédication
        </label>
        <div className="flex gap-3">
          <input
            id="sermon-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Titre, prédicateur, thème…"
            autoComplete="off"
            className="min-h-[44px] w-full rounded-lg border border-white/15 bg-gn-field px-4 py-2.5 text-gn-cream shadow-sm transition-colors placeholder:text-gn-cream/40 focus:border-gn-gold focus:outline-none focus:ring-2 focus:ring-gn-gold/30"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="inline-flex min-h-[44px] shrink-0 items-center rounded-full px-4 text-xs font-semibold text-gn-gold-line hover:underline"
            >
              Effacer
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Choisir un thème">
        {themes.map((theme) => {
          const count = countByTheme.get(theme) ?? 0;
          const active = theme === activeTheme;
          return (
            <button
              key={theme}
              type="button"
              onClick={() => setChosenTheme(theme)}
              aria-pressed={active}
              disabled={count === 0}
              className={`${chipBase} ${
                active
                  ? 'border-gn-gold bg-gn-gold text-gn-black'
                  : 'border-gn-line bg-white text-gn-ink hover:border-gn-gold disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gn-line'
              }`}
            >
              {theme} <span className="ml-1.5 opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-sm text-gn-muted-strong" role="status" aria-live="polite">
        {totalMatches === 0
          ? 'Aucune prédication ne correspond à votre recherche.'
          : q
            ? `${totalMatches} résultat${totalMatches > 1 ? 's' : ''} au total, ${visible.length} dans « ${activeTheme} »`
            : `${visible.length} prédication${visible.length > 1 ? 's' : ''} dans « ${activeTheme} »`}
      </p>

      {visible.length > 0 && (
        <section aria-labelledby="theme-affiche" className="mt-8">
          <h2 id="theme-affiche" className="mb-5 font-serif text-2xl font-semibold text-gn-ink">
            {activeTheme}
          </h2>
          <ul className="grid gap-4 md:grid-cols-2">
            {visible.map((sermon) => (
              <li key={sermon.id}>
                <Link
                  href={`/predications/${sermon.id}`}
                  className="gn-card-lift flex items-center gap-4 rounded-lg border border-gn-line bg-white p-3"
                >
                  <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-gn-black-soft to-gn-black sm:w-32">
                    {sermon.coverImageUrl && (
                      <Image src={sermon.coverImageUrl} alt="" fill sizes="128px" className="object-cover" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="line-clamp-2 font-serif text-base font-semibold leading-snug text-gn-ink">{sermon.title}</p>
                    <p className="mt-1 text-xs text-gn-muted-strong">
                      {sermon.speaker} · {formatSermonDate(sermon.date)}
                    </p>
                    {sermon.series && <p className="mt-0.5 text-xs text-gn-gold-line">Série : {sermon.series}</p>}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
