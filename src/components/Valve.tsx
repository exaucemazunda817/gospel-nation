import Image from 'next/image';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import ValveText from '@/components/ValveText';
import { getActiveAnnouncements } from '@/lib/announcements';
import { prisma } from '@/lib/prisma';
import { formatEventWhen } from '@/lib/dates';
import { fr } from '@/lib/typo';

type Item =
  | {
      type: 'announcement';
      id: string;
      urgent: boolean;
      pinned: boolean;
      title: string;
      body: string | null;
      image: string | null;
      when: string;
    }
  | {
      type: 'event';
      id: string;
      slug: string;
      title: string;
      body: string | null;
      image: string;
      when: string;
      hasDate: boolean;
    };

const MAX_ITEMS = 5;

const badgeClass = (item: Item) =>
  item.type === 'event'
    ? 'bg-gn-gold text-gn-on-gold'
    : item.urgent
      ? 'bg-red-600 text-white'
      : 'bg-gn-black text-gn-gold';
const badgeLabel = (item: Item) => (item.type === 'event' ? 'Événement' : item.urgent ? 'Urgent' : 'Communiqué');

// « La valve » : le tableau d'affichage de l'accueil, dans le même langage que
// « Dernière prédication » : l'annonce principale en grand (affiche à gauche,
// texte à droite), les suivantes en petit dessous. Communiqués saisis dans
// l'admin (urgents et épinglés d'abord), puis événements à venir. Rien ne
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
    ...[...announcements]
      .sort((a, b) => Number(b.kind === 'URGENT') - Number(a.kind === 'URGENT') || Number(b.pinned) - Number(a.pinned))
      .map<Item>((a) => ({
        type: 'announcement',
        id: a.id,
        urgent: a.kind === 'URGENT',
        pinned: a.pinned,
        title: a.title,
        body: a.body,
        image: a.imageUrl ? `/communiques/image/${a.id}` : null,
        when: `Publié le ${dateLabel(a.publishedAt)}`
      })),
    ...events.map<Item>((e) => ({
      type: 'event',
      id: e.id,
      slug: e.slug,
      title: e.title.replace(' — ', ' : '),
      body: e.description,
      image: e.posterImageUrl,
      when: e.eventDate ? formatEventWhen(e.eventDate, e.endDate) : '',
      hasDate: Boolean(e.eventDate)
    }))
  ].slice(0, MAX_ITEMS);

  if (items.length === 0) return null;
  const [main, ...others] = items;

  return (
    <section aria-labelledby="valve-titre" className="relative overflow-hidden bg-gn-black">
      {/* Bandeau photo « cinéma » : un dégradé noir en haut porte le titre, puis la
          photo de l'assemblée se découvre nette et chaude vers le bas. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gn-black">
        <Image
          src="/hero/eglise.jpg"
          alt=""
          fill
          sizes="100vw"
          quality={70}
          className="object-cover object-center [filter:contrast(1.08)_saturate(1.1)_sepia(0.12)]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gn-black from-[110px] via-gn-black/55 via-[300px] to-transparent to-[70%] max-md:from-[190px] max-md:via-[380px]" />
        <div className="absolute inset-0 [background:radial-gradient(120%_90%_at_50%_60%,transparent_55%,rgb(0_0_0/0.35)_100%)]" />
      </div>
      <div className="relative mx-auto max-w-6xl px-5 py-11 sm:px-10 sm:py-14">
        <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-x-4 gap-y-1 sm:mb-8">
          <div>
            <h2 id="valve-titre" className="font-serif text-3xl font-semibold text-gn-cream">À la valve</h2>
            <p className="mt-2 max-w-measure text-sm text-gn-cream/80">Les communiqués et les événements à venir de l&apos;église.</p>
          </div>
          <Link href="/evenements" className="inline-flex min-h-[44px] items-center text-sm font-semibold text-gn-gold hover:underline">
            Voir tous les événements
          </Link>
        </Reveal>

        <Reveal delay={0.05}>
          <article className={`gn-spot grid items-center gap-6 rounded-lg border border-white/60 bg-white p-5 shadow-2xl shadow-black/30 sm:p-6 md:gap-10 ${main.image ? 'md:grid-cols-[minmax(0,280px)_1fr]' : ''}`}>
            {main.image && (
              <a
                href={main.type === 'event' ? '/evenements' : main.image}
                {...(main.type === 'event' ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                aria-label={main.type === 'event' ? `Voir l'événement : ${main.title}` : `Voir l'affiche en grand : ${main.title}`}
                className="group relative mx-auto block aspect-[4/5] w-full max-w-[240px] overflow-hidden rounded-lg bg-gn-black-soft shadow-xl shadow-black/20 md:max-w-none"
              >
                <Image
                  src={main.image}
                  alt={`Affiche : ${main.title}`}
                  fill
                  sizes="(max-width: 768px) 240px, 300px"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </a>
            )}
            <div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-gn-ink/70">
                <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${badgeClass(main)}`}>{badgeLabel(main)}</span>
                {main.type === 'announcement' && main.pinned && <span className="text-xs font-semibold text-gn-gold-dark">Épinglé</span>}
                {main.when && <span>{main.when}</span>}
              </div>
              <h3 className="mt-3 font-serif text-3xl font-semibold leading-tight text-gn-ink sm:text-4xl">{fr(main.title)}</h3>
              {main.body && (
                <div className="mt-4 max-w-measure">
                  <ValveText text={main.body} />
                </div>
              )}
              {main.type === 'event' && (
                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
                  <Link
                    href="/evenements"
                    className="inline-flex min-h-[44px] items-center rounded-full bg-gn-gold px-6 text-sm font-semibold text-gn-on-gold transition-colors hover:bg-gn-gold-light"
                  >
                    Voir l&apos;événement
                  </Link>
                  {main.hasDate && (
                    <a
                      href={`/evenements/ics/${main.slug}`}
                      download
                      className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-gn-gold-dark hover:underline"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="3" y="5" width="18" height="16" rx="2" />
                        <path d="M3 10h18M8 3v4M16 3v4M12 13v5M9.5 15.5h5" />
                      </svg>
                      Ajouter à mon calendrier
                    </a>
                  )}
                </div>
              )}
            </div>
          </article>
        </Reveal>

        {others.length > 0 && (
          <ul className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-2">
            {others.map((item, index) => (
              <li key={`${item.type}-${item.id}`}>
                <Reveal className="h-full" delay={0.06 + index * 0.06}>
                  {item.type === 'announcement' && !item.image ? (
                    // Communiqué sans affiche : son texte se lit sur place.
                    <div className="gn-spot flex h-full gap-4 rounded-lg border border-gn-line bg-white p-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gn-black text-gn-gold" aria-hidden="true">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z" />
                          <path d="M16 8a5 5 0 0 1 0 8M19 5a9 9 0 0 1 0 14" />
                        </svg>
                      </span>
                      <div className="min-w-0">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${badgeClass(item)}`}>{badgeLabel(item)}</span>
                        <p className="mt-1.5 font-serif text-base font-semibold leading-snug text-gn-ink">{fr(item.title)}</p>
                        <p className="mt-1 text-xs text-gn-muted-strong">{item.when}</p>
                        {item.body && (
                          <div className="mt-2">
                            <ValveText text={item.body} />
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <a
                      href={item.type === 'event' ? '/evenements' : (item.image as string)}
                      {...(item.type === 'announcement' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="gn-spot group flex h-full items-center gap-4 rounded-lg border border-gn-line bg-white p-3 transition-colors hover:border-gn-gold"
                    >
                      <div className="relative aspect-[4/5] w-20 shrink-0 overflow-hidden rounded-lg bg-gn-black-soft">
                        <Image src={item.image as string} alt="" fill sizes="80px" className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${badgeClass(item)}`}>{badgeLabel(item)}</span>
                        <p className="mt-1.5 line-clamp-2 font-serif text-base font-semibold leading-snug text-gn-ink">{fr(item.title)}</p>
                        {item.when && <p className="mt-1 text-xs text-gn-muted-strong">{item.when}</p>}
                      </div>
                    </a>
                  )}
                </Reveal>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
