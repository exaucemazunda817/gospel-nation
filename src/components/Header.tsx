'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { church } from '@/lib/content';

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/eglise', label: 'Notre église' },
  { href: '/departements', label: 'Départements' },
  { href: '/predications', label: 'Prédications' },
  { href: '/blog', label: 'Gospel News' },
  { href: '/temoignages', label: 'Témoignages' },
  { href: '/dons', label: 'Dons' },
  { href: '/rendez-vous', label: 'Rendez-vous' }
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-gn-black/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo-gospel-nation.png"
            alt={`Logo ${church.name}`}
            width={160}
            height={80}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>
        <nav className="hidden shrink-0 gap-1 text-sm font-medium lg:flex">
          {navLinks.map((link) => {
            const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap rounded-full px-3.5 py-2 text-center transition-colors ${
                  isActive
                    ? 'bg-gn-gold text-gn-black'
                    : 'text-gn-cream/70 hover:bg-gn-gold/10 hover:text-gn-gold'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden shrink-0 lg:block">
          <Link
            href="/inscription"
            className="whitespace-nowrap rounded-full bg-gn-gold px-4 py-2 text-center text-sm font-semibold text-gn-black transition-colors hover:bg-gn-gold-dark"
          >
            Devenir membre
          </Link>
        </div>
      </div>
      <Link
        href="/inscription"
        className="flex items-center justify-center gap-2 border-t border-white/5 bg-gn-gold/10 py-2.5 text-sm font-semibold text-gn-gold lg:hidden"
      >
        Devenir membre
      </Link>
      <nav className="flex gap-2 overflow-x-auto border-t border-white/5 px-4 py-2.5 text-sm font-medium lg:hidden">
        {navLinks.map((link) => {
          const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 rounded-full px-3 py-1.5 transition-colors ${
                isActive ? 'bg-gn-gold text-gn-black' : 'bg-white/5 text-gn-cream/70 hover:bg-gn-gold/10'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="gn-accent-bar" />
    </header>
  );
}
