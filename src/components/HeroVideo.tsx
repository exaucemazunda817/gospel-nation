'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

export default function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Préférence choisie par le visiteur via le bouton (persiste tant qu'il ne
  // reclique pas), et visibilité réelle de la vidéo à l'écran.
  const [soundOn, setSoundOn] = useState(false);
  const [inView, setInView] = useState(true);
  // La vidéo pèse ~5 Mo : on ne la charge pas pour un visiteur en mode
  // économie de données, en 2G, ou qui a demandé moins d'animations — il voit
  // l'image fixe à la place. Décidé côté client, donc image seule au 1er rendu.
  const [canPlay, setCanPlay] = useState(false);

  const muted = !(soundOn && inView);

  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const slowOrSaving = Boolean(conn?.saveData) || conn?.effectiveType === 'slow-2g' || conn?.effectiveType === '2g';
    setCanPlay(!reducedMotion && !slowOrSaving);
  }, []);

  // Source unique de vérité : on recalcule .muted à chaque changement de
  // préférence OU de visibilité, plutôt que de le modifier seulement au clic —
  // ça coupe le son dès qu'on quitte la vidéo et le remet automatiquement
  // quand on y revient, si le visiteur l'avait activé.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
    if (!muted) {
      video.play().catch(() => {});
    }
  }, [muted, canPlay]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [canPlay]);

  return (
    <>
      <Image src={poster} alt="" fill priority sizes="100vw" className="object-cover" />
      {canPlay && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
        />
      )}
      {canPlay && (
        <button
          type="button"
          onClick={() => setSoundOn((v) => !v)}
          aria-label={muted ? 'Activer le son' : 'Couper le son'}
          className="absolute bottom-6 right-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-gn-gold/30 bg-gn-black/55 text-gn-cream backdrop-blur-md transition-colors hover:border-gn-gold hover:text-gn-gold sm:bottom-8 sm:right-10"
        >
          {muted ? (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.5 8.5a5 5 0 0 1 0 7" />
              <path d="M18.5 6a9 9 0 0 1 0 12" />
            </svg>
          )}
        </button>
      )}
    </>
  );
}
