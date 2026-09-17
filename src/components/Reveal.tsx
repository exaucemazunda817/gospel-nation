'use client';

import { motion, useAnimationControls } from 'motion/react';
import { useEffect, useRef, type ReactNode } from 'react';

// Apparition au défilement (comme sur vouschurch.com), avec un garde-fou
// contre le bug déjà rencontré sur ce projet le 10/09/2026 : un
// IntersectionObserver seul peut laisser du contenu définitivement invisible
// si l'élément est déjà visible au montage (arrivée via ancre, rechargement
// en cours de page, ou position de défilement restaurée par le navigateur) —
// dans ce cas aucun événement "entrée dans le viewport" ne se déclenche
// jamais. On vérifie donc explicitement au montage si l'élément est déjà à
// l'écran et on révèle immédiatement le cas échéant, sans attendre
// l'observateur.
export default function Reveal({
  children,
  delay = 0,
  className
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      controls.set({ opacity: 1, y: 0 });
      return;
    }

    const reveal = () => controls.start({ opacity: 1, y: 0, transition: { duration: 0.5, delay, ease: 'easeOut' } });

    const rect = el.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (alreadyVisible) {
      reveal();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          reveal();
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );
    observer.observe(el);

    // Filet de sécurité : si l'observateur ne se déclenche jamais pour une
    // raison quelconque, on révèle quand même le contenu après un délai —
    // mieux vaut un contenu qui apparaît sans animation qu'un contenu qui
    // reste invisible pour de bon.
    const fallback = window.setTimeout(reveal, 2500);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 12 }} animate={controls}>
      {children}
    </motion.div>
  );
}
