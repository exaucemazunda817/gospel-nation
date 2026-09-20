// Outils communs aux pages de prédications (page principale, page d'une
// prédication, catalogue) et à l'accueil.
import type { Sermon } from '@prisma/client';

// Thèmes proposés par le catalogue, dans l'ordre d'affichage. `Sermon.theme`
// doit reprendre exactement l'un de ces libellés ; une prédication sans thème
// est rangée sous OTHER_THEME.
export const SERMON_THEMES = [
  'Foi',
  'Saint-Esprit et onction',
  'Amour et paix',
  'Autorité et combat spirituel',
  'Identité en Christ',
  'Discernement et vérité',
  'Croissance et transformation',
  'Vie personnelle'
] as const;

export const OTHER_THEME = 'Autres';

export type SermonSummary = {
  id: string;
  title: string;
  speaker: string;
  // ISO 8601 : la date traverse la frontière serveur / navigateur sous forme de texte.
  date: string;
  theme: string | null;
  series: string | null;
  coverImageUrl: string | null;
};

export function toSummary(sermon: Sermon): SermonSummary {
  return {
    id: sermon.id,
    title: sermon.title,
    speaker: sermon.speaker,
    date: sermon.date.toISOString(),
    theme: sermon.theme,
    series: sermon.series,
    coverImageUrl: sermon.coverImageUrl
  };
}

// Identifiant d'une vidéo YouTube (11 caractères) à partir de son lien. Renvoie
// null pour tout ce qui n'est pas un lien YouTube reconnu : l'identifiant est
// ensuite glissé dans l'adresse d'un lecteur intégré, on ne l'accepte donc que
// s'il a exactement la forme attendue.
export function youtubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  const host = parsed.hostname.replace(/^(www|m)\./, '');
  let id: string | null = null;
  if (host === 'youtu.be') id = parsed.pathname.slice(1).split('/')[0] || null;
  else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    if (parsed.pathname === '/watch') id = parsed.searchParams.get('v');
    else {
      const match = parsed.pathname.match(/^\/(embed|shorts|live)\/([^/]+)/);
      id = match ? match[2] : null;
    }
  }
  return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
}

// Lecteur intégré sans cookies de suivi tant que la vidéo n'est pas lancée.
export function youtubeEmbedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
}

// Les dates de prédication sont enregistrées à minuit UTC : on les affiche en
// UTC pour qu'elles ne glissent jamais d'un jour selon le fuseau du serveur.
export function formatSermonDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  });
}

// Minuscules et sans accents, pour que « priere » retrouve « Prière ».
export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

export function themeOf(sermon: { theme: string | null }): string {
  return sermon.theme && (SERMON_THEMES as readonly string[]).includes(sermon.theme)
    ? sermon.theme
    : OTHER_THEME;
}

// Choisit les prédications à suggérer après celle qu'on regarde : d'abord la
// même série, puis le même thème, puis le même prédicateur, puis les plus
// récentes. Le résultat n'inclut jamais la prédication de départ.
export function pickSuggestions<T extends SermonSummary>(current: T, all: T[], count: number): T[] {
  const score = (s: T): number =>
    (current.series && s.series === current.series ? 4 : 0) +
    (themeOf(s) === themeOf(current) ? 2 : 0) +
    (s.speaker === current.speaker ? 1 : 0);

  return all
    .filter((s) => s.id !== current.id)
    .sort((a, b) => score(b) - score(a) || new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}

// Regroupe par thème, dans l'ordre de SERMON_THEMES (puis « Autres »), chaque
// groupe étant trié de la plus récente à la plus ancienne. Les thèmes vides
// n'apparaissent pas.
export function groupByTheme<T extends SermonSummary>(sermons: T[]): { theme: string; sermons: T[] }[] {
  const order = [...SERMON_THEMES, OTHER_THEME];
  return order
    .map((theme) => ({
      theme,
      sermons: sermons
        .filter((s) => themeOf(s) === theme)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }))
    .filter((group) => group.sermons.length > 0);
}
