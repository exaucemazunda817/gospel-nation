'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

export default function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Le son est voulu par défaut (demande de Mazunda, 14/10/2026) : la vidéo tente
  // de démarrer AVEC le son. `wantSound` passe à faux seulement si le visiteur
  // coupe le son avec le bouton. `blocked` est vrai quand le navigateur refuse le
  // son (aucun navigateur ne l'autorise avant un premier geste du visiteur, sauf
  // réglage du site ou habitude de visite) : la vidéo joue alors en muet et le
  // son s'active au premier clic, toucher ou touche du clavier.
  const [wantSound, setWantSound] = useState(true);
  const wantSoundRef = useRef(true);
  const [blocked, setBlocked] = useState(false);
  // Le son ne joue que tant que la vidéo est à l'écran (au moins la moitié) et
  // que l'onglet est visible.
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  // La vidéo pèse ~5 Mo : on ne la charge pas pour un visiteur en mode
  // économie de données, en 2G, ou qui a demandé moins d'animations — il voit
  // l'image fixe à la place. Décidé côté client, donc image seule au 1er rendu.
  const [canPlay, setCanPlay] = useState(false);

  const muted = !(wantSound && inView && tabVisible && !blocked);

  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const slowOrSaving = Boolean(conn?.saveData) || conn?.effectiveType === 'slow-2g' || conn?.effectiveType === '2g';
    if (reducedMotion || slowOrSaving) return;

    // La vidéo pèse ~5 Mo, soit l'essentiel de ce que la page télécharge : si elle
    // démarre tout de suite, elle se dispute la connexion avec les images et tout
    // s'affiche plus lentement. On attend la fin du chargement de la page, puis un
    // moment d'inactivité du navigateur.
    let cancelled = false;
    const start = () => {
      if (cancelled) return;
      const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 600));
      idle(() => !cancelled && setCanPlay(true));
    };
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener('load', start);
    };
  }, []);

  // Tente de rétablir le son tout de suite (appelé DANS un geste du visiteur : c'est
  // ce qui l'autorise, y compris sur iPhone). Si le navigateur refuse, on repasse
  // en muet et on réessaiera au geste suivant.
  const tryUnmute = useCallback(() => {
    const video = videoRef.current;
    if (!video || !wantSoundRef.current) return;
    video.muted = false;
    video.play().catch(() => {
      video.muted = true;
      void video.play().catch(() => {});
      setBlocked(true);
    });
  }, []);

  // Source unique de vérité : on recalcule .muted à chaque changement de
  // préférence, de visibilité ou de refus du navigateur — ça coupe le son dès
  // qu'on quitte la vidéo et le remet quand on y revient. Au premier passage,
  // c'est ici que la vidéo tente de démarrer avec le son.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
    video.play().catch(() => {
      if (!muted) {
        video.muted = true;
        void video.play().catch(() => {});
        setBlocked(true);
      }
    });
  }, [muted, canPlay]);

  // Son refusé par le navigateur : le premier geste du visiteur (clic, toucher,
  // touche du clavier, n'importe où sur la page) l'active.
  useEffect(() => {
    if (!wantSound || !blocked) return;
    const onGesture = (e: Event) => {
      if (!wantSoundRef.current) return;
      // Un appui tactile (pointerdown) n'est pas encore un geste valide : on
      // attend sa fin (touchend / clic).
      if (e.type === 'pointerdown' && (e as PointerEvent).pointerType !== 'mouse') return;
      setBlocked(false);
      tryUnmute();
    };
    const events = ['pointerdown', 'click', 'keydown', 'touchend'] as const;
    events.forEach((name) => document.addEventListener(name, onGesture));
    return () => events.forEach((name) => document.removeEventListener(name, onGesture));
  }, [wantSound, blocked, tryUnmute]);

  useEffect(() => {
    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // « Dans la vidéo » = au moins la moitié visible (ou la moitié de l'écran si la
  // vidéo est plus haute que l'écran).
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const needed = Math.min(entry.boundingClientRect.height * 0.5, window.innerHeight * 0.5);
        setInView(entry.intersectionRect.height >= needed - 1);
      },
      { threshold: Array.from({ length: 21 }, (_, i) => i / 20) }
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
          loop
          playsInline
        />
      )}
      {canPlay && (
        <button
          type="button"
          onClick={() => {
            if (muted) {
              wantSoundRef.current = true;
              setWantSound(true);
              setBlocked(false);
              tryUnmute();
            } else {
              wantSoundRef.current = false;
              setWantSound(false);
            }
          }}
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
