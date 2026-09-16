'use client';

import { useEffect, useRef, type ReactNode } from 'react';

// Convertit le défilement vertical de la molette en défilement horizontal
// quand le curseur survole la rangée (comportement attendu sur desktop pour
// un carrousel horizontal — sans ça, la molette fait juste défiler la page).
// Le défilement tactile (mobile/trackpad) fonctionne nativement, sans JS.
//
// Écouteur natif (pas onWheel React) : React attache wheel en mode passif
// par défaut, ce qui rend preventDefault() inopérant (et lève une erreur
// silencieuse) — il faut { passive: false } pour pouvoir réellement bloquer
// le défilement vertical de la page pendant qu'on fait défiler la rangée.
export default function HorizontalScroller({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function handleWheel(e: WheelEvent) {
      const canScrollHorizontally = el!.scrollWidth > el!.clientWidth;
      const isMostlyVertical = Math.abs(e.deltaY) > Math.abs(e.deltaX);
      if (canScrollHorizontally && isMostlyVertical) {
        e.preventDefault();
        e.stopPropagation();
        el!.scrollLeft += e.deltaY;
      }
    }

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
