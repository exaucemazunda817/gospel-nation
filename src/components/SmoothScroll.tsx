'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

// Défilement plus fluide et amorti sur tout le site (effet demandé par
// Mazunda, inspiré de webflow-path-one.webflow.io). Lenis pilote le
// défilement natif de la fenêtre via requestAnimationFrame — il ne remplace
// pas window.scrollY par un hack CSS, donc les ancres, le header sticky et
// les IntersectionObserver (ex. Reveal) continuent de fonctionner normalement.
export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
