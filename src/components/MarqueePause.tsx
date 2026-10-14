'use client';

import { useState } from 'react';

// Bouton pause de la bande défilante (WCAG 2.2.2 : un mouvement automatique de
// plus de 5 secondes doit pouvoir être arrêté sans souris ; jusqu'ici seule la
// pause au survol existait). Masqué quand « Réduire les animations » est actif :
// il n'y a alors rien à arrêter.
export default function MarqueePause() {
  const [paused, setPaused] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={paused}
      aria-label={paused ? 'Reprendre le défilement' : 'Mettre en pause le défilement'}
      onClick={(event) => {
        const next = !paused;
        setPaused(next);
        event.currentTarget.closest('.gn-marquee')?.setAttribute('data-paused', String(next));
      }}
      className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-gn-black text-gn-gold shadow-md transition-opacity hover:opacity-90 motion-reduce:hidden"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        {paused ? <path d="M8 5v14l11-7z" /> : <path d="M7 5h4v14H7zM13 5h4v14h-4z" />}
      </svg>
    </button>
  );
}
