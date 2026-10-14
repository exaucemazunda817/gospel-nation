'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

// Bouton « Retour » des pages absentes du menu (repris de One Love) : il
// ramène à la page précédente du site, avec sa position de défilement. Si le
// visiteur est arrivé directement (Google, lien partagé, favori), il n'y a pas
// de page précédente sur le site : le lien mène alors à `fallbackHref`.

const KEY = 'gn-nav';

function readTrail(): string[] {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

/** Retient les pages vues dans cet onglet (posé une fois dans le layout). */
export function NavTracker() {
  const pathname = usePathname();
  useEffect(() => {
    try {
      const trail = readTrail();
      if (trail[trail.length - 1] !== pathname) trail.push(pathname);
      window.sessionStorage.setItem(KEY, JSON.stringify(trail.slice(-30)));
    } catch {
      // Stockage indisponible (navigation privée stricte) : le bouton Retour
      // mènera simplement à sa page de repli.
    }
  }, [pathname]);
  return null;
}

export function BackLink({
  fallbackHref = '/',
  tone = 'light'
}: {
  fallbackHref?: string;
  /** `dark` : sur fond sombre ; `light` : sur fond clair. */
  tone?: 'dark' | 'light';
}) {
  const router = useRouter();

  function onClick(event: React.MouseEvent<HTMLAnchorElement>) {
    // Clic avec Cmd/Ctrl/Maj (nouvel onglet) : comportement normal du lien.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    const trail = readTrail();
    if (trail.length >= 2 && window.history.length > 1) {
      event.preventDefault();
      router.back();
    }
  }

  const cls =
    tone === 'dark'
      ? 'border-gn-cream/35 text-gn-cream hover:border-gn-gold hover:text-gn-gold'
      : 'border-gn-line bg-white text-gn-ink hover:border-gn-gold-line hover:text-gn-gold-line';

  return (
    <Link
      href={fallbackHref}
      onClick={onClick}
      className={`inline-flex min-h-[44px] w-fit items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors ${cls}`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M19 12H5M11 6l-6 6 6 6" />
      </svg>
      Retour
    </Link>
  );
}

/** Bouton posé juste sous le bandeau d'une page (pas sur la photo). */
export function BackStrip({ href = '/', tone = 'light' }: { href?: string; tone?: 'dark' | 'light' }) {
  return (
    <div className={`px-5 pt-6 sm:px-10 sm:pt-8 ${tone === 'dark' ? 'bg-gn-black' : ''}`}>
      <div className="mx-auto max-w-6xl">
        <BackLink fallbackHref={href} tone={tone} />
      </div>
    </div>
  );
}
