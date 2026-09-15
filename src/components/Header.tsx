'use client';

import { useState } from 'react';
import type { TouchEvent as ReactTouchEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { Show, UserButton } from '@clerk/nextjs';
import { church } from '@/lib/content';
import { isClerkConfigured } from '@/lib/clerk-configured';

const primaryLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/eglise', label: 'À propos' },
  { href: '/predications', label: 'Prédications' },
  { href: '/evenements', label: 'Événements' },
  { href: '/departements', label: 'Départements' }
];

const resourceLinks = [
  { href: '/bible', label: 'Bible' },
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
  const [glassHref, setGlassHref] = useState<string | null>(null);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  const isResourceActive = resourceLinks.some((link) => isActive(link.href));

  // Fait glisser le reflet "verre liquide" (façon iOS 26) sous le titre que
  // le doigt survole en glissant dans le menu, sans attendre qu'il relâche.
  const handleGlassTouchMove = (e: ReactTouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    const el = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement | null;
    const target = el?.closest<HTMLElement>('[data-menu-link]');
    setGlassHref(target?.dataset.href ?? null);
  };

  return (
    <header className="sticky top-4 z-50 mx-4 mt-4 mb-4 sm:mx-8 sm:top-6 sm:mt-6 sm:mb-6 lg:mx-8 xl:mx-16">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full border border-gn-gold/20 bg-gn-black/55 px-5 py-3 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.7)] backdrop-blur-md sm:px-6 sm:py-3.5 xl:px-7">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src="/logo-gospel-nation.png"
            alt={`Logo ${church.name}`}
            width={566}
            height={429}
            className="h-9 w-9 object-contain sm:h-11 sm:w-11"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-4 lg:flex xl:gap-6">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap text-[12.5px] font-semibold tracking-wide transition-colors ${
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
              className={`flex items-center gap-1.5 whitespace-nowrap text-[12.5px] font-semibold tracking-wide transition-colors ${
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
            className={`whitespace-nowrap text-[12.5px] font-semibold tracking-wide transition-colors ${
              isActive(contactLink.href) ? 'text-gn-gold' : 'text-gn-cream hover:text-gn-gold'
            }`}
          >
            {contactLink.label}
          </Link>
        </nav>

        <div className="hidden shrink-0 items-center gap-2 lg:flex xl:gap-3">
          {isClerkConfigured && (
            <>
              <Show when="signed-in">
                <UserButton afterSignOutUrl="/" />
              </Show>
              <Show when="signed-out">
                <Link
                  href="/connexion"
                  aria-label="Se connecter"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gn-cream/35 text-gn-cream transition-colors hover:border-gn-gold hover:text-gn-gold"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </Link>
              </Show>
            </>
          )}
          <Link
            href="/dons"
            className="rounded-full whitespace-nowrap border border-gn-cream/35 px-3.5 py-[11px] text-[11px] font-semibold uppercase tracking-wide text-gn-cream transition-colors hover:border-gn-gold hover:text-gn-gold xl:px-[18px]"
          >
            Faire un don
          </Link>
          <Link
            href="/inscription"
            className="rounded-full whitespace-nowrap bg-gradient-to-br from-[#e3c98a] to-gn-gold px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-gn-black transition-opacity hover:opacity-90 xl:px-5"
          >
            Devenir membre
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gn-gold/30 text-gn-cream shadow-[0_0_0_0_rgba(210,137,67,0)] transition-all duration-300 ease-out hover:scale-110 hover:border-gn-gold hover:bg-gn-gold/10 hover:text-gn-gold hover:shadow-[0_0_18px_2px_rgba(210,137,67,0.55)] lg:hidden"
          aria-label="Menu"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            {mobileOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <nav
          className="mx-auto mt-2 flex max-w-6xl touch-none flex-col gap-1 rounded-3xl border border-gn-gold/20 bg-gn-black/70 p-4 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.7)] backdrop-blur-md lg:hidden"
          onTouchMove={handleGlassTouchMove}
          onTouchEnd={() => setGlassHref(null)}
          onTouchCancel={() => setGlassHref(null)}
          onMouseLeave={() => setGlassHref(null)}
        >
          {[...primaryLinks, ...resourceLinks, contactLink].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-menu-link
              data-href={link.href}
              onClick={() => setMobileOpen(false)}
              onMouseEnter={() => setGlassHref(link.href)}
              onFocus={() => setGlassHref(link.href)}
              onTouchStart={() => setGlassHref(link.href)}
              className={`relative overflow-hidden rounded-full px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive(link.href) ? 'text-gn-gold' : 'text-gn-cream/80'
              }`}
            >
              {glassHref === link.href && (
                <motion.span
                  layoutId="mobileGlassHighlight"
                  className="absolute inset-0 rounded-full border border-white/30 bg-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_6px_18px_-6px_rgba(0,0,0,0.6)] backdrop-blur-md"
                  transition={{ type: 'spring', stiffness: 500, damping: 34 }}
                />
              )}
              {isActive(link.href) && glassHref !== link.href && (
                <span className="absolute inset-0 rounded-full bg-gn-gold/10" />
              )}
              <span className="relative z-10">{link.label}</span>
            </Link>
          ))}
          <div className="mt-2 flex flex-col gap-2 border-t border-gn-gold/15 pt-3">
            {isClerkConfigured && (
              <>
                <Show when="signed-in">
                  <Link
                    href="/compte"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-full border border-gn-cream/30 px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-gn-cream transition-colors hover:border-gn-gold hover:text-gn-gold active:bg-gn-gold/10"
                  >
                    Mon compte
                  </Link>
                </Show>
                <Show when="signed-out">
                  <Link
                    href="/connexion"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-full border border-gn-cream/30 px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-gn-cream transition-colors hover:border-gn-gold hover:text-gn-gold active:bg-gn-gold/10"
                  >
                    Se connecter
                  </Link>
                </Show>
              </>
            )}
            <Link
              href="/dons"
              onClick={() => setMobileOpen(false)}
              className="rounded-full border border-gn-cream/30 px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-gn-cream transition-colors hover:border-gn-gold hover:text-gn-gold active:bg-gn-gold/10"
            >
              Faire un don
            </Link>
            <Link
              href="/inscription"
              onClick={() => setMobileOpen(false)}
              className="rounded-full bg-gradient-to-br from-[#e3c98a] to-gn-gold px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-gn-black transition-opacity hover:opacity-90 active:opacity-80"
            >
              Devenir membre
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
