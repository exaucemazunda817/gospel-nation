'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { Show, UserButton } from '@clerk/nextjs';
import { church } from '@/lib/content';
import { isClerkConfigured } from '@/lib/clerk-configured';

const primaryLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/predications', label: 'Prédications' },
  { href: '/departements/gospel-news', label: 'Gospel News' },
  { href: '/departements', label: 'Départements' }
];

const resourceLinks = [
  { href: '/evenements', label: 'Événements' },
  { href: '/bible', label: 'Bible' },
  { href: '/blog', label: 'Bibliothèque' },
  { href: '/temoignages', label: 'Témoignages' },
  { href: '/services', label: 'Offres et services' },
  { href: '/rendez-vous', label: 'Prendre rendez-vous' }
];

// Placés après « Ressources », dans cet ordre (demande de Mazunda, 20/09/2026).
const trailingLinks = [
  { href: '/eglise', label: 'À propos' },
  { href: '/contact', label: 'Contact' }
];

export default function Header() {
  const pathname = usePathname();
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  // Fermeture animée : le menu reste affiché le temps du fondu de sortie.
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  // Lien actuellement en « verre » dans le menu mobile (touché ou survolé).
  const [glassHref, setGlassHref] = useState<string | null>(null);

  // Le lien actif n'est calculé qu'après le premier affichage : le serveur ne
  // connaît pas toujours la page courante, et un soulignement présent côté
  // navigateur mais absent du HTML du serveur provoquait l'erreur React #418
  // (« hydratation échouée ») : React jetait alors toute la page et la refaisait,
  // ce qui effaçait au passage l'état de l'écran d'ouverture (html[data-intro]).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Gospel News est un département : sur sa page, seul « Gospel News » est souligné,
  // pas « Départements ».
  const isActive = (href: string) => {
    if (!mounted) return false;
    if (href === '/') return pathname === '/';
    if (href === '/departements') return pathname.startsWith(href) && !pathname.startsWith('/departements/gospel-news');
    return pathname.startsWith(href);
  };
  const isResourceActive = resourceLinks.some((link) => isActive(link.href));

  // Referme le menu quand on change de page.
  useEffect(() => {
    setMobileOpen(false);
    setClosing(false);
  }, [pathname]);

  // Fermeture avec un court fondu (même rendu que One Love), immédiate si le
  // visiteur a demandé moins d'animations.
  function closeMenu() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setMobileOpen(false);
      return;
    }
    setClosing(true);
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setMobileOpen(false);
      setClosing(false);
    }, 240);
  }
  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  // Menu mobile modal : le focus entre dans le menu à l'ouverture, Échap le
  // ferme, Tab reste à l'intérieur, et le focus revient au bouton à la
  // fermeture (WCAG 2.1.1 et 2.4.3).
  useEffect(() => {
    if (!mobileOpen) return;
    const items = () =>
      menuRef.current
        ? [...menuRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')]
        : [];
    items()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu();
        return;
      }
      if (e.key !== 'Tab') return;
      const list = items();
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      triggerRef.current?.focus();
    };
  }, [mobileOpen]);

  // Bloque le défilement de la page derrière le menu plein écran.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <header
      // max(1rem, env(safe-area-inset-top)) : sur un iPhone à encoche/Dynamic
      // Island, un simple top-4 fixe peut laisser le bandeau caché sous
      // l'encoche — on ajoute la zone sûre du système tout en gardant le
      // même espacement qu'avant (1rem / 1.5rem à partir de sm) ailleurs.
      className="sticky top-[max(1rem,env(safe-area-inset-top))] z-50 mx-4 mt-[max(1rem,env(safe-area-inset-top))] mb-4 sm:mx-8 sm:top-[max(1.5rem,env(safe-area-inset-top))] sm:mt-[max(1.5rem,env(safe-area-inset-top))] sm:mb-6 lg:mx-8 xl:mx-16"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full border border-gn-gold/20 bg-gn-black/55 px-5 py-3 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.7)] backdrop-blur-md sm:px-6 sm:py-3.5 xl:px-7">
        <Link href="/" aria-label="Accueil Gospel Nation" className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center gap-3">
          <Image
            src="/logo-gospel-nation.png"
            alt={`Logo ${church.name}`}
            width={566}
            height={429}
            sizes="44px"
            className="h-9 w-9 object-contain sm:h-11 sm:w-11"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-4 xl:flex xl:gap-6">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative inline-flex h-11 items-center whitespace-nowrap text-xs font-semibold tracking-wide transition-colors ${
                isActive(link.href) ? 'text-gn-gold' : 'text-gn-cream hover:text-gn-gold'
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute inset-x-0 bottom-2 h-[2px] rounded-full bg-gn-gold"
                  transition={{ type: 'spring', stiffness: 500, damping: 34 }}
                />
              )}
            </Link>
          ))}
          <div
            className="relative"
            onMouseEnter={() => setResourcesOpen(true)}
            onMouseLeave={() => setResourcesOpen(false)}
          >
            <button
              type="button"
              className={`relative flex h-11 min-h-0 items-center gap-1.5 whitespace-nowrap text-xs font-semibold tracking-wide transition-colors ${
                isResourceActive ? 'text-gn-gold' : 'text-gn-cream hover:text-gn-gold'
              }`}
            >
              Ressources
              {isResourceActive && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute inset-x-0 bottom-2 h-[2px] rounded-full bg-gn-gold"
                  transition={{ type: 'spring', stiffness: 500, damping: 34 }}
                />
              )}
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
                      className={`block px-4 py-2.5 text-xs font-medium transition-colors ${
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
          {trailingLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative inline-flex h-11 items-center whitespace-nowrap text-xs font-semibold tracking-wide transition-colors ${
                isActive(link.href) ? 'text-gn-gold' : 'text-gn-cream hover:text-gn-gold'
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute inset-x-0 bottom-2 h-[2px] rounded-full bg-gn-gold"
                  transition={{ type: 'spring', stiffness: 500, damping: 34 }}
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 xl:flex xl:gap-3">
          {isClerkConfigured && (
            <>
              <Show when="signed-in">
                <UserButton />
              </Show>
              <Show when="signed-out">
                <Link
                  href="/connexion"
                  aria-label="Se connecter"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-gn-cream/35 text-gn-cream transition-colors hover:border-gn-gold hover:text-gn-gold"
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
            className="rounded-full whitespace-nowrap border border-gn-cream/35 inline-flex min-h-[44px] items-center px-3.5 text-xs font-semibold uppercase tracking-wide text-gn-cream transition-colors hover:border-gn-gold hover:text-gn-gold xl:px-[18px]"
          >
            Faire un don
          </Link>
          <Link
            href="/inscription"
            className="inline-flex min-h-[44px] items-center rounded-full whitespace-nowrap bg-gradient-to-br from-gn-gold-light to-gn-gold px-4 text-xs font-bold uppercase tracking-wide text-gn-black transition-opacity hover:opacity-90 xl:px-5"
          >
            Devenir membre
          </Link>
        </div>

        <button
          type="button"
          ref={triggerRef}
          onClick={() => setMobileOpen(true)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gn-gold/30 text-gn-cream shadow-[0_0_0_0_rgba(210,137,67,0)] transition-all duration-300 ease-out hover:scale-110 hover:border-gn-gold hover:bg-gn-gold/10 hover:text-gn-gold hover:shadow-[0_0_18px_2px_rgba(210,137,67,0.55)] xl:hidden"
          aria-label="Ouvrir le menu"
          aria-expanded={mobileOpen}
          aria-controls="menu-mobile"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div
          id="menu-mobile"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          data-state={closing ? 'closing' : 'open'}
          className="gn-menu fixed inset-0 z-50 flex flex-col overflow-y-auto overscroll-contain bg-gn-black/85 text-gn-cream backdrop-blur-xl xl:hidden"
        >
          <div className="flex shrink-0 items-center justify-between px-4 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))]">
            <Image
              src="/logo-gospel-nation.png"
              alt={`Logo ${church.name}`}
              width={566}
              height={429}
              sizes="44px"
              className="h-10 w-10 object-contain"
            />
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Fermer le menu"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gn-gold/30 text-gn-cream transition-colors hover:border-gn-gold hover:text-gn-gold"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="flex shrink-0 flex-col gap-1 px-5 py-2" aria-label="Navigation principale" onScroll={() => setGlassHref(null)}>
            {[...primaryLinks, ...resourceLinks, ...trailingLinks].map((link, index) => {
              const active = isActive(link.href);
              const glass = glassHref === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => setMobileOpen(false)}
                  onMouseEnter={() => setGlassHref(link.href)}
                  onMouseLeave={() => setGlassHref(null)}
                  onFocus={() => setGlassHref(link.href)}
                  onBlur={() => setGlassHref(null)}
                  onTouchStart={() => setGlassHref(link.href)}
                  onTouchEnd={() => setGlassHref(null)}
                  onTouchCancel={() => setGlassHref(null)}
                  style={{ '--i': index } as CSSProperties}
                  className={`gn-menu-item flex min-h-12 items-center justify-between rounded-2xl border px-4 font-serif text-xl transition-colors duration-200 ${
                    glass
                      ? 'border-white/30 bg-white/15 text-gn-gold-light shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_6px_18px_-6px_rgba(0,0,0,0.5)] backdrop-blur-md'
                      : active
                        ? 'border-white/15 bg-white/[0.06] text-gn-gold-light'
                        : 'border-transparent text-gn-cream'
                  }`}
                >
                  {link.label}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-colors duration-200 ${glass || active ? 'text-gn-gold-light' : 'text-gn-muted'}`}
                    aria-hidden="true"
                  >
                    <polyline points="9 6 15 12 9 18" />
                  </svg>
                </Link>
              );
            })}
          </nav>
          <div
            className="gn-menu-item flex shrink-0 flex-col gap-2 px-5 pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-4"
            style={{ '--i': primaryLinks.length + resourceLinks.length + trailingLinks.length } as CSSProperties}
          >
            {isClerkConfigured && (
              <>
                <Show when="signed-in">
                  <Link
                    href="/compte"
                    onClick={() => setMobileOpen(false)}
                    className="flex min-h-[44px] items-center justify-center rounded-full border border-gn-cream/30 px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-gn-cream transition-colors hover:border-gn-gold hover:text-gn-gold active:bg-gn-gold/10"
                  >
                    Mon compte
                  </Link>
                </Show>
                <Show when="signed-out">
                  <Link
                    href="/connexion"
                    onClick={() => setMobileOpen(false)}
                    className="flex min-h-[44px] items-center justify-center rounded-full border border-gn-cream/30 px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-gn-cream transition-colors hover:border-gn-gold hover:text-gn-gold active:bg-gn-gold/10"
                  >
                    Se connecter
                  </Link>
                </Show>
              </>
            )}
            <Link
              href="/dons"
              onClick={() => setMobileOpen(false)}
              className="flex min-h-[44px] items-center justify-center rounded-full border border-gn-cream/30 px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-gn-cream transition-colors hover:border-gn-gold hover:text-gn-gold active:bg-gn-gold/10"
            >
              Faire un don
            </Link>
            <Link
              href="/inscription"
              onClick={() => setMobileOpen(false)}
              className="flex min-h-[44px] items-center justify-center rounded-full bg-gradient-to-br from-gn-gold-light to-gn-gold px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-gn-black transition-opacity hover:opacity-90 active:opacity-80"
            >
              Devenir membre
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
