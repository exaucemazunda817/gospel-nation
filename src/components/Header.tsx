'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { church } from '@/lib/content';

const primaryLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/eglise', label: 'À propos' },
  { href: '/predications', label: 'Prédications' },
  { href: '/evenements', label: 'Événements' }
];

const resourceLinks = [
  { href: '/departements', label: 'Départements' },
  { href: '/blog', label: 'Bibliothèque' },
  { href: '/temoignages', label: 'Témoignages' },
  { href: '/services', label: 'Offres et services' },
  { href: '/rendez-vous', label: 'Prendre rendez-vous' }
];

const contactLink = { href: '/contact', label: 'Contact' };

export default function Header() {
  const pathname = usePathname();
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  const isResourceActive = resourceLinks.some((link) => isActive(link.href));

  return (
    <header className="relative border-b border-gn-gold/25 bg-gradient-to-b from-gn-black-soft to-gn-black">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-5 sm:h-[88px] sm:px-10">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src="/logo-gospel-nation.png"
            alt={`Logo ${church.name}`}
            width={566}
            height={429}
            className="h-11 w-11 object-contain sm:h-[50px] sm:w-[50px]"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[12.5px] font-semibold tracking-wide transition-colors ${
                isActive(link.href) ? 'text-gn-gold' : 'text-gn-cream hover:text-gn-gold'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div
            className="relative"
            onMouseEnter={() => setResourcesOpen(true)}
            onMouseLeave={() => setResourcesOpen(false)}
          >
            <button
              type="button"
              className={`flex items-center gap-1.5 text-[12.5px] font-semibold tracking-wide transition-colors ${
                isResourceActive ? 'text-gn-gold' : 'text-gn-cream hover:text-gn-gold'
              }`}
            >
              Ressources
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {resourcesOpen && (
              <div className="absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 pt-3">
                <div className="rounded-lg border border-gn-gold/25 bg-gn-black-soft py-2 shadow-2xl">
                  {resourceLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block px-4 py-2.5 text-[12.5px] font-medium transition-colors ${
                        isActive(link.href) ? 'text-gn-gold' : 'text-gn-cream/80 hover:bg-gn-gold/10 hover:text-gn-gold'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Link
            href={contactLink.href}
            className={`text-[12.5px] font-semibold tracking-wide transition-colors ${
              isActive(contactLink.href) ? 'text-gn-gold' : 'text-gn-cream hover:text-gn-gold'
            }`}
          >
            {contactLink.label}
          </Link>
        </nav>

        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <Link
            href="/dons"
            className="rounded whitespace-nowrap border border-gn-cream/35 px-[18px] py-[11px] text-[11px] font-semibold uppercase tracking-wide text-gn-cream transition-colors hover:border-gn-gold hover:text-gn-gold"
          >
            Faire un don
          </Link>
          <Link
            href="/inscription"
            className="rounded whitespace-nowrap bg-gradient-to-br from-[#e3c98a] to-gn-gold px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-gn-black transition-opacity hover:opacity-90"
          >
            Devenir membre
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-gn-gold/30 text-gn-cream lg:hidden"
          aria-label="Menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            {mobileOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t border-gn-gold/15 bg-gn-black-soft px-5 py-4 lg:hidden">
          {[...primaryLinks, ...resourceLinks, contactLink].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`rounded px-3 py-2.5 text-sm font-medium ${
                isActive(link.href) ? 'bg-gn-gold/10 text-gn-gold' : 'text-gn-cream/80'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 flex flex-col gap-2 border-t border-gn-gold/15 pt-3">
            <Link
              href="/dons"
              onClick={() => setMobileOpen(false)}
              className="rounded border border-gn-cream/30 px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-gn-cream"
            >
              Faire un don
            </Link>
            <Link
              href="/inscription"
              onClick={() => setMobileOpen(false)}
              className="rounded bg-gradient-to-br from-[#e3c98a] to-gn-gold px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-gn-black"
            >
              Devenir membre
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
