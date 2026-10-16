// Direct des cultes sur YouTube. La page « /live » de la chaîne renvoie à la
// vidéo en cours de diffusion (ou à la prochaine programmée) ; sans direct, elle
// renvoie à la chaîne elle-même. Lue côté serveur, au plus une fois par minute.
export const YOUTUBE_CHANNEL_ID = 'UCYkRXV8-DWbjSruSMgi3ilw';
export const YOUTUBE_LIVE_URL = 'https://www.youtube.com/@gospel.nation/live';

export type LiveStatus =
  | { status: 'live'; videoId: string; title: string }
  | { status: 'upcoming'; videoId: string; title: string; startsAt: Date | null }
  | { status: 'offline' };

function decode(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

export async function getLiveStatus(): Promise<LiveStatus> {
  try {
    const res = await fetch(`https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}/live`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131 Safari/537.36',
        'Accept-Language': 'fr-FR,fr;q=0.9'
      },
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(5000)
    });
    if (!res.ok) return { status: 'offline' };
    const html = await res.text();
    const canonical = html.match(/<link rel="canonical" href="https:\/\/www\.youtube\.com\/watch\?v=([\w-]{11})"/);
    if (!canonical) return { status: 'offline' };
    const videoId = canonical[1];
    const title = decode(html.match(/<meta name="title" content="([^"]*)"/)?.[1] ?? 'Culte en direct');
    if (/"isLiveNow":true/.test(html)) return { status: 'live', videoId, title };
    if (/"isUpcoming":true/.test(html)) {
      const start = html.match(/"scheduledStartTime":"(\d+)"/)?.[1];
      return { status: 'upcoming', videoId, title, startsAt: start ? new Date(Number(start) * 1000) : null };
    }
    return { status: 'offline' };
  } catch {
    // YouTube injoignable ou page changée : on affiche simplement le lien du direct.
    return { status: 'offline' };
  }
}
