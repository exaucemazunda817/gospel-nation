import Image from 'next/image';
import Link from 'next/link';
import { church } from '@/lib/content';

type Item = { text: string; href: string; highlight?: boolean };

// Bande défilante : le prochain événement en tête, puis les cultes, les services
// et les départements, séparés par le logo de l'église.
export default function EventsMarquee({
  event,
  departments
}: {
  event: { title: string; when: string } | null;
  departments: { name: string; slug: string }[];
}) {
  const sunday = church.schedule[1];
  const items: Item[] = [
    ...(event ? [{ text: ['À venir', event.title, event.when].filter(Boolean).join(' · '), href: '/evenements', highlight: true }] : []),
    { text: `Culte du ${sunday.day.toLowerCase()} · ${sunday.time}`, href: '/contact' },
    { text: 'Offres et services', href: '/services' },
    ...departments.map((department) => ({ text: department.name, href: `/departements/${department.slug}` })),
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
            className={`inline-flex min-h-[44px] items-center whitespace-nowrap px-6 text-sm font-semibold uppercase tracking-wide transition-colors hover:text-gn-gold ${
              item.highlight ? 'text-gn-gold' : 'text-gn-cream'
            }`}
          >
            {item.text}
          </Link>
          <Image src="/logo-gospel-nation.png" alt="" width={28} height={28} className="h-7 w-7 shrink-0 object-contain opacity-80" />
        </div>
      ))}
    </div>
  );

  return (
    <section
      aria-label="À venir à Gospel Nation"
      className="gn-marquee overflow-hidden border-y border-gn-gold/30 bg-gn-black motion-reduce:overflow-x-auto"
    >
      <div className="gn-marquee-track">
        {group(false)}
        {group(true)}
      </div>
    </section>
  );
}
