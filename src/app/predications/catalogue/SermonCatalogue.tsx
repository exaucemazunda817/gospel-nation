'use client';

import { Fragment, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { fr } from '@/lib/typo';
import { formatSermonDate, groupByTheme, normalizeText, themeOf, type SermonSummary } from '@/lib/sermons';

// Met en valeur les lettres cherchées dans un texte (sans tenir compte des accents
// ni des majuscules). Si la mise en forme normalisée change la longueur du texte,
// on le laisse tel quel plutôt que de risquer un mauvais découpage.
function Highlight({ text: raw, query }: { text: string; query: string }) {
  const text = fr(raw);
  if (!query) return <>{text}</>;
  const normalized = normalizeText(text);
  const at = normalized.indexOf(query);
  if (at < 0 || normalized.length !== text.length) return <>{text}</>;
  return (
    <Fragment>
      {text.slice(0, at)}
      <mark className="rounded-sm bg-gn-gold/30 px-0.5 text-inherit">{text.slice(at, at + query.length)}</mark>
      {text.slice(at + query.length)}
    </Fragment>
  );
}

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
              className={`relative inline-flex min-h-[44px] items-center rounded-full border px-4 text-xs font-semibold transition-colors ${
                active
                  ? 'border-gn-gold text-gn-black'
                  : 'border-gn-line bg-white text-gn-ink hover:border-gn-gold disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gn-line'
              }`}
            >
              {/* Le fond doré glisse d'un thème à l'autre : on voit d'où l'on vient. */}
              {active && (
                <motion.span
                  layoutId="catalogue-theme-pill"
                  className="absolute inset-0 rounded-full bg-gn-gold"
                  transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                />
              )}
              <span className="relative">
                {theme} <span className="ml-1.5 opacity-70">({count})</span>
              </span>
            </button>
          );
        })}
      </div>

      {totalMatches === 0 ? (
        <div className="mt-8 rounded-2xl border border-gn-line bg-white p-8 text-center" role="status" aria-live="polite">
          <p className="font-serif text-lg font-semibold text-gn-ink">Aucune prédication ne correspond à « {query.trim()} »</p>
          <p className="mx-auto mt-2 max-w-measure text-sm text-gn-muted-strong">
            Essayez un seul mot du titre, le nom du prédicateur ou un thème.
          </p>
          <button
            type="button"
            onClick={() => setQuery('')}
            className="mt-5 inline-flex min-h-[44px] items-center rounded-full bg-gn-gold px-6 text-sm font-semibold text-gn-on-gold transition-colors hover:bg-gn-gold-light"
          >
            Effacer la recherche
          </button>
        </div>
      ) : (
        <p className="mt-6 text-sm text-gn-muted-strong" role="status" aria-live="polite">
          {q
            ? `${totalMatches} résultat${totalMatches > 1 ? 's' : ''} au total, ${visible.length} dans « ${activeTheme} »`
            : `${visible.length} prédication${visible.length > 1 ? 's' : ''} dans « ${activeTheme} »`}
        </p>
      )}

      {visible.length > 0 && (
        <section aria-labelledby="theme-affiche" className="mt-8">
          <h2 id="theme-affiche" className="mb-5 font-serif text-2xl font-semibold text-gn-ink">
            {activeTheme}
          </h2>
          {/* La liste se renouvelle en fondu quand on change de thème. */}
          <motion.ul
            key={activeTheme}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="grid gap-4 md:grid-cols-2"
          >
            {visible.map((sermon) => (
              <li key={sermon.id}>
                <Link
                  href={`/predications/${sermon.id}`}
                  className="gn-card-lift gn-spot group flex items-center gap-4 rounded-lg border border-gn-line bg-white p-3"
                >
                  <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-gn-black-soft to-gn-black sm:w-32">
                    {sermon.coverImageUrl && (
                      <Image src={sermon.coverImageUrl} alt="" fill sizes="128px" className="object-cover" />
                    )}
                    <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/10">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gn-gold/60 bg-gn-black/60">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="var(--gn-gold)" aria-hidden="true">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="line-clamp-2 font-serif text-base font-semibold leading-snug text-gn-ink">
                      <Highlight text={sermon.title} query={q} />
                    </p>
                    <p className="mt-1 text-xs text-gn-muted-strong">
                      <Highlight text={sermon.speaker} query={q} />, {formatSermonDate(sermon.date)}
                    </p>
                    {sermon.series && <p className="mt-0.5 text-xs text-gn-gold-line">Série : {sermon.series}</p>}
                  </div>
                </Link>
              </li>
            ))}
          </motion.ul>
        </section>
      )}
    </div>
  );
}
