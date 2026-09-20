'use client';

import { motion, useAnimationControls } from 'motion/react';
import { useEffect, useRef, type ReactNode } from 'react';

// Apparition au défilement : le bloc reste caché tant qu'il n'est pas à
// l'écran, puis « sort » en glissant vers le haut.
//
// Deux pièges déjà rencontrés sur ce projet :
// 1. (10/09/2026) Un IntersectionObserver seul laisse du contenu invisible pour
//    de bon quand l'élément est déjà à l'écran au montage (ancre, rechargement
//    en cours de page) ou qu'on le dépasse trop vite. On vérifie donc à la
//    fois au montage et à chaque défilement, et un bloc déjà dépassé est révélé.
// 2. (20/09/2026) L'ancien « filet de sécurité » révélait TOUS les blocs 2,5 s
//    après l'ouverture de la page, même ceux du bas : le temps de défiler,
//    tout était déjà affiché et l'effet n'existait pas. Le filet ne concerne
//    maintenant que les blocs réellement visibles à l'écran.
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

    // Respect du réglage « réduire les animations » du téléphone ou de l'ordinateur.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      controls.set({ opacity: 1, y: 0 });
      return;
    }

    let revealed = false;
    let frame = 0;
    let safetyNet = 0;
    let observer: IntersectionObserver | undefined;

    // Le haut du bloc est entré dans la partie basse de l'écran, ou il est déjà
    // au-dessus (défilement très rapide, ancre, position restaurée).
    const hasReachedViewport = () => el.getBoundingClientRect().top < window.innerHeight * 0.9;

    const onScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        if (hasReachedViewport()) reveal();
      });
    };

    const stop = () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      observer?.disconnect();
      window.clearTimeout(safetyNet);
      window.cancelAnimationFrame(frame);
    };

    function reveal() {
      if (revealed) return;
      revealed = true;
      stop();
      controls.start({ opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] } });
    }

    if (hasReachedViewport()) {
      reveal();
      return;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) reveal();
      },
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(el);

    // Filet de sécurité, uniquement pour un bloc qui serait à l'écran sans que
    // rien ne l'ait révélé : jamais pour ceux qui attendent plus bas.
    safetyNet = window.setTimeout(() => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) reveal();
    }, 2500);

    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 32 }} animate={controls}>
      {children}
    </motion.div>
  );
}
