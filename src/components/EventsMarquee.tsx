import Image from 'next/image';
import Link from 'next/link';
import { church } from '@/lib/content';

type Item = { text: string; href: string; highlight?: boolean; logo?: string | null };

// Bande défilante dorée (elle se distingue du bandeau crème au-dessus et de la
// section sombre en dessous) : le prochain événement en tête, puis le culte, les
// services et les départements avec chacun son logo.
export default function EventsMarquee({
  event,
  departments
}: {
  event: { title: string; when: string } | null;
  departments: { name: string; slug: string; imageUrl: string | null }[];
}) {
  const sunday = church.schedule[1];
  const items: Item[] = [
    ...(event ? [{ text: ['À venir', event.title, event.when].filter(Boolean).join(' · '), href: '/evenements', highlight: true }] : []),
    { text: `Culte du ${sunday.day.toLowerCase()} · ${sunday.time}`, href: '/contact' },
    { text: 'Offres et services', href: '/services' },
    ...departments.map((department) => ({
      text: department.name,
      href: `/departements/${department.slug}`,
      logo: department.imageUrl
    })),
    { text: 'Rendez-vous pastoral', href: '/rendez-vous' },
    { text: 'Devenir membre', href: '/inscription' }
  ];

  const group = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <Link
            href={item.href}
            tabIndex={hidden ? -1 : undefined}
            className={
              item.highlight
                ? 'mx-2 inline-flex min-h-[44px] items-center whitespace-nowrap rounded-full bg-gn-black px-5 text-sm font-bold uppercase tracking-wide text-gn-gold transition-opacity hover:opacity-90'
                : 'inline-flex min-h-[44px] items-center gap-2.5 whitespace-nowrap px-4 text-sm font-bold uppercase tracking-wide text-gn-on-gold transition-opacity hover:opacity-70'
            }
          >
            {item.logo && (
              <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-gn-black">
                <Image src={item.logo} alt="" fill sizes="32px" className="object-cover" />
              </span>
            )}
            {item.text}
          </Link>
          <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rotate-45 bg-gn-on-gold/50" />
        </div>
      ))}
    </div>
  );

  return (
    <section
      aria-label="À venir à Gospel Nation"
      className="gn-marquee overflow-hidden bg-gradient-to-r from-gn-gold via-gn-gold-light to-gn-gold motion-reduce:overflow-x-auto"
    >
      <div className="gn-marquee-track py-1.5">
        {group(false)}
        {group(true)}
      </div>
    </section>
  );
}
