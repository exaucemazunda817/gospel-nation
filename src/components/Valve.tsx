import Image from 'next/image';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import ValveText from '@/components/ValveText';
import { getActiveAnnouncements } from '@/lib/announcements';
import { prisma } from '@/lib/prisma';
import { formatEventWhen } from '@/lib/dates';
import { fr } from '@/lib/typo';

type Item =
  | { type: 'announcement'; id: string; urgent: boolean; pinned: boolean; title: string; body: string | null; hasImage: boolean; date: string }
  | { type: 'event'; id: string; title: string; when: string; poster: string };

const MAX_ITEMS = 6;

// « La valve » : le tableau d'affichage de l'accueil. Communiqués (texte,
// affiche ou les deux) saisis dans l'admin, puis événements à venir. Rien ne
// s'affiche tant qu'il n'y a ni communiqué actif ni événement à venir.
export default async function Valve() {
  const now = new Date();
  const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const [announcements, events] = await Promise.all([
    getActiveAnnouncements(MAX_ITEMS),
    prisma.event.findMany({
      where: { OR: [{ eventDate: { gte: startOfToday } }, { endDate: { gte: startOfToday } }] },
      orderBy: { eventDate: 'asc' },
      take: 3
    })
  ]);

  const dateLabel = (d: Date) => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', timeZone: 'Africa/Kinshasa' });
  const items: Item[] = [
    // Urgents d'abord, puis épinglés, puis le reste par date de parution.
    ...[...announcements]
      .sort((a, b) => Number(b.kind === 'URGENT') - Number(a.kind === 'URGENT') || Number(b.pinned) - Number(a.pinned))
      .map<Item>((a) => ({
        type: 'announcement',
        id: a.id,
        urgent: a.kind === 'URGENT',
        pinned: a.pinned,
        title: a.title,
        body: a.body,
        hasImage: Boolean(a.imageUrl),
        date: dateLabel(a.publishedAt)
      })),
    ...events.map<Item>((e) => ({
      type: 'event',
      id: e.id,
      title: e.title.replace(' — ', ' : '),
      when: e.eventDate ? formatEventWhen(e.eventDate, e.endDate) : '',
      poster: e.posterImageUrl
    }))
  ].slice(0, MAX_ITEMS);

  if (items.length === 0) return null;

  return (
    <section aria-labelledby="valve-titre" className="bg-white">
      <div className="mx-auto max-w-6xl px-5 py-11 sm:px-10 sm:py-14">
        <Reveal className="mb-6 sm:mb-8">
          <h2 id="valve-titre" className="font-serif text-3xl font-semibold text-gn-ink">À la valve</h2>
          <p className="mt-2 max-w-measure text-sm text-gn-muted-strong">Les communiqués et les événements à venir de l&apos;église.</p>
        </Reveal>
        <ul className="flex flex-wrap justify-center gap-5">
          {items.map((item, index) => (
            <li key={`${item.type}-${item.id}`} className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]">
              <Reveal className="h-full" delay={(index % 3) * 0.06}>
                {item.type === 'announcement' ? (
                  <article
                    className={`flex h-full flex-col overflow-hidden rounded-lg border bg-gn-cream-bg ${
                      item.urgent ? 'border-red-600/60' : 'border-gn-line'
                    }`}
                  >
                    {item.hasImage && (
                      <a
                        href={`/communiques/image/${item.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Voir l'affiche en grand : ${item.title}`}
                        className="gn-photo-hover relative block aspect-[4/5] w-full bg-gn-black"
                      >
                        <Image src={`/communiques/image/${item.id}`} alt={`Affiche : ${item.title}`} fill sizes="(max-width: 640px) 100vw, 360px" className="object-cover" />
                      </a>
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${
                            item.urgent ? 'bg-red-600 text-white' : 'bg-gn-black text-gn-gold'
                          }`}
                        >
                          {item.urgent ? 'Urgent' : 'Communiqué'}
                        </span>
                        {item.pinned && <span className="text-xs font-semibold text-gn-gold-line">Épinglé</span>}
                        <span className="text-xs text-gn-muted-strong">{item.date}</span>
                      </div>
                      <h3 className="mt-3 font-serif text-lg font-semibold leading-snug text-gn-ink">{fr(item.title)}</h3>
                      {item.body && (
                        <div className="mt-2">
                          <ValveText text={item.body} />
                        </div>
                      )}
                    </div>
                  </article>
                ) : (
                  <Link
                    href="/evenements"
                    className="gn-card-lift gn-spot group flex h-full flex-col overflow-hidden rounded-lg border border-gn-line bg-gn-cream-bg"
                  >
                    <div className="gn-photo-hover relative aspect-[4/5] w-full bg-gn-black">
                      <Image src={item.poster} alt={`Affiche : ${item.title}`} fill sizes="(max-width: 640px) 100vw, 360px" className="object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-gn-gold px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-gn-on-gold">Événement</span>
                        {item.when && <span className="text-xs text-gn-muted-strong">{item.when}</span>}
                      </div>
                      <h3 className="mt-3 font-serif text-lg font-semibold leading-snug text-gn-ink">{fr(item.title)}</h3>
                      <span className="mt-3 text-sm font-semibold text-gn-gold-dark group-hover:underline">Voir l&apos;événement →</span>
                    </div>
                  </Link>
                )}
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
