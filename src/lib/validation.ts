// Lien saisi par un visiteur : seuls http et https sont acceptés. Sans cela,
// un lien « javascript:… » enregistré dans un témoignage s'exécuterait quand
// l'administrateur clique dessus depuis son espace.
export function safeHttpUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    const url = new URL(/^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    if (!url.hostname.includes('.')) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function isHttpUrl(value: string | null | undefined): value is string {
  return typeof value === 'string' && /^https?:\/\//i.test(value);
}

export function tooLong(value: string, max: number): boolean {
  return value.length > max;
}
