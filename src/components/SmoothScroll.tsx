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

    // Lenis mesure la hauteur de la page au montage puis via un
    // ResizeObserver — mais ce dernier ne réagit pas de façon fiable quand du
    // contenu asynchrone (ex. une liste chargée derrière un <Suspense>, comme
    // sur /predications) remplace un squelette plus court après coup : la
    // limite de défilement reste bloquée sur l'ancienne hauteur, plus courte,
    // et il devient impossible de descendre jusqu'au pied de page. On force
    // un recalcul à chaque changement du DOM de la page.
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const observer = new MutationObserver(() => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => lenis.resize(), 100);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(resizeTimeout);
      observer.disconnect();
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
