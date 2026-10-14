'use client';

import { useEffect } from 'react';

// Halo doré qui suit la souris sur les cartes (.gn-spot), repris de One Love.
// Un seul écouteur pour tout le site : il place la position du halo sur la
// carte survolée. Rien sur écran tactile (aucune souris à suivre).
export default function SpotlightTracker() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest?.('.gn-spot') as HTMLElement | null;
      if (!card) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--gn-mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--gn-my', `${e.clientY - r.top}px`);
      });
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      document.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
    };
  }, []);
  return null;
}
