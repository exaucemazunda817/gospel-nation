'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { HERO_POOL, type HeroPhoto } from '@/lib/hero-photos';

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

const INTERVAL_MS = 6500;

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Fond photo d'un bandeau de page : la photo de la page d'abord (rendue par le
// serveur, donc visible sans JavaScript), puis les autres photos de l'église en
// ordre aléatoire, en fondu, avec un lent zoom. Rien ne tourne avec « Réduire
// les animations », en économie de données ou en 2G, ni quand l'onglet est
// masqué. Un petit bouton permet d'arrêter le défilement (WCAG 2.2.2).
export default function HeroBackground({ first, position = 'object-top' }: { first?: string; position?: string }) {
  const start: HeroPhoto = first ? { src: first, position } : HERO_POOL[0];
  const [layers, setLayers] = useState<[HeroPhoto, HeroPhoto | null]>([start, null]);
  const [active, setActive] = useState<0 | 1>(0);
  const [paused, setPaused] = useState(false);
  const [canRotate, setCanRotate] = useState(false);
  const queue = useRef<HeroPhoto[]>([]);
  const waiting = useRef<0 | 1 | null>(null);

  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const slow = Boolean(conn?.saveData) || conn?.effectiveType === 'slow-2g' || conn?.effectiveType === '2g';
    if (!reduced && !slow) setCanRotate(true);
  }, []);

  useEffect(() => {
    if (!canRotate || paused) return;
    const tick = () => {
      if (document.hidden || waiting.current !== null) return;
      if (queue.current.length === 0) queue.current = shuffle(HERO_POOL.filter((p) => p.src !== layers[active]?.src));
      const next = queue.current.shift();
      if (!next) return;
      const slot: 0 | 1 = active === 0 ? 1 : 0;
      waiting.current = slot;
      setLayers((current) => {
        const copy: [HeroPhoto, HeroPhoto | null] = [current[0], current[1]];
        copy[slot] = next;
        return copy;
      });
    };
    const id = window.setInterval(tick, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [canRotate, paused, active, layers]);

  // La nouvelle photo n'apparaît qu'une fois chargée : jamais de fondu vers du vide.
  const onLoaded = (slot: 0 | 1) => {
    if (waiting.current === slot) {
      waiting.current = null;
      setActive(slot);
    }
  };

  return (
    <>
      {layers.map((photo, slot) =>
        photo ? (
          <Image
            key={`${slot}-${photo.src}`}
            src={photo.src}
            alt=""
            fill
            sizes="100vw"
            priority={slot === 0 && photo.src === start.src}
            onLoad={() => onLoaded(slot as 0 | 1)}
            className={`object-cover ${photo.position} transition-opacity duration-[1400ms] ease-out ${
              slot === active ? 'gn-kenburns opacity-100' : 'opacity-0'
            }`}
          />
        ) : null
      )}
      {canRotate && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? 'Reprendre le défilement des photos' : 'Mettre en pause le défilement des photos'}
          className="absolute bottom-3 right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-gn-cream/25 bg-gn-black/45 text-gn-cream/80 backdrop-blur-sm transition-colors hover:border-gn-gold hover:text-gn-gold sm:bottom-4 sm:right-6"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            {paused ? <path d="M8 5v14l11-7z" /> : <path d="M7 5h4v14H7zM13 5h4v14h-4z" />}
          </svg>
        </button>
      )}
    </>
  );
}
