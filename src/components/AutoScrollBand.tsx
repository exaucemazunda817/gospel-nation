'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

// Bande qui défile toute seule, en continu et sans fin, comme un bandeau
// d'information (demande de Mazunda, 14/10/2026) :
// - sans souris dessus, elle avance doucement et se reboucle sans saut ;
// - la souris posée dessus (ou un doigt, ou le clavier) l'arrête en douceur ;
//   le visiteur peut alors la faire défiler lui-même : glisser à la souris ou au
//   doigt, geste horizontal du trackpad, Maj + molette ;
// - dès que la souris part, elle repart (un doigt levé : après 1,6 s).
//
// Le mouvement passe par `transform` (calculé à chaque image, au sous-pixel) et
// non par `scrollLeft`, qui est arrondi au pixel entier sur les écrans
// ordinaires et donnerait un défilement saccadé. La molette verticale n'est
// JAMAIS détournée : elle continue de faire défiler la page. Le contenu est
// affiché deux fois pour la boucle ; la copie est masquée aux lecteurs d'écran
// et inaccessible au clavier. Pas de bouton pause (retiré à la demande de Mazunda : l'arrêt au survol, au toucher et au clavier suffit). Avec « Réduire
// les animations », ou sans JavaScript, c'est une simple rangée à défilement natif.
export default function AutoScrollBand({
  children,
  label,
  speed = 40,
  inset = true,
  fade = true,
  className = ''
}: {
  children: ReactNode;
  label: string;
  /** Vitesse de défilement automatique, en pixels par seconde. */
  speed?: number;
  /** Marge à gauche au départ (alignement sur le contenu de la page). */
  inset?: boolean;
  /** Fondu sur les bords gauche et droit. */
  fade?: boolean;
  className?: string;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  // Nombre de copies du contenu : assez pour que la bande ne laisse jamais de
  // vide à droite, même si le contenu est plus étroit que l'écran.
  const [copies, setCopies] = useState(2);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setActive(true);
  }, []);

  useEffect(() => {
    if (!active) return;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const copy = copyRef.current;
    if (!viewport || !track || !copy) return;

    let x = 0; // décalage de la bande, en pixels vers la gauche
    let period = copy.offsetWidth; // largeur d'une copie (écart de fin compris)
    let curSpeed = 0; // vitesse automatique actuelle (monte et descend en douceur)
    let momentum = 0; // élan après un glissement, en pixels par seconde
    let hover = false;
    let focusWithin = false;
    let dragging = false;
    let moved = 0;
    let lastInteraction = -Infinity;
    let lastX = 0;
    let lastT = 0;
    let vel = 0;
    let raf = 0;
    let last = 0;

    const apply = () => {
      x = period > 0 ? ((x % period) + period) % period : 0;
      track.style.transform = `translate3d(${-x}px,0,0)`;
    };

    const tick = (t: number) => {
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 0;
      last = t;
      if (!dragging) {
        if (Math.abs(momentum) > 8) {
          x += momentum * dt;
          momentum *= Math.exp(-3.2 * dt);
        } else {
          momentum = 0;
        }
        const holding = hover || focusWithin || t - lastInteraction < 1600 || momentum !== 0;
        const target = holding ? 0 : speed;
        curSpeed += (target - curSpeed) * (1 - Math.exp(-dt / 0.25));
        x += curSpeed * dt;
      }
      apply();
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (raf || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    // La boucle ne tourne que lorsque la bande est à l'écran.
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { rootMargin: '120px' }
    );
    io.observe(viewport);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);

    const ro = new ResizeObserver(() => {
      period = copy.offsetWidth;
      const needed = period > 0 ? Math.max(2, Math.ceil(viewport.clientWidth / period) + 1) : 2;
      setCopies((c) => (c === needed ? c : needed));
      apply();
    });
    ro.observe(copy);

    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') hover = true;
    };
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') hover = false;
    };

    const onMove = (e: PointerEvent) => {
      const dx = e.clientX - lastX;
      const dtMs = Math.max(1, e.timeStamp - lastT);
      lastX = e.clientX;
      lastT = e.timeStamp;
      moved += Math.abs(dx);
      x -= dx;
      apply();
      vel = vel * 0.6 + ((-dx / dtMs) * 1000) * 0.4;
    };
    const onUp = (e: PointerEvent) => {
      dragging = false;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      // Doigt levé : la bande reprend après une courte attente. À la souris, c'est
      // le départ du pointeur qui la relance, sans attente.
      if (e.pointerType !== 'mouse') lastInteraction = performance.now();
      // Élan seulement si le doigt ou la souris bougeait encore au relâchement.
      momentum = moved > 6 && e.timeStamp - lastT < 90 ? Math.max(-3000, Math.min(3000, vel)) : 0;
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging = true;
      moved = 0;
      momentum = 0;
      curSpeed = 0;
      vel = 0;
      lastX = e.clientX;
      lastT = e.timeStamp;
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
    };
    // Un glissement ne doit pas ouvrir la carte sur laquelle il se termine.
    const onClickCapture = (e: MouseEvent) => {
      if (moved > 6) {
        e.preventDefault();
        e.stopPropagation();
        moved = 0;
      }
    };

    // Geste horizontal (trackpad, Maj + molette) : fait défiler la bande. Un
    // défilement vertical n'est pas touché et continue de faire défiler la page.
    const onWheel = (e: WheelEvent) => {
      const unit = e.deltaMode === 1 ? 16 : 1;
      const horizontal = e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY);
      if (!horizontal) return;
      const delta = (e.shiftKey && Math.abs(e.deltaX) < Math.abs(e.deltaY) ? e.deltaY : e.deltaX) * unit;
      e.preventDefault();
      x += delta;
      momentum = 0;
      apply();
    };

    // Clavier : une carte qui reçoit le focus arrête la bande et est ramenée à l'écran.
    const onFocusIn = (e: FocusEvent) => {
      // Seulement le focus au clavier : un simple clic donne aussi le focus à la
      // carte, et la bande resterait alors arrêtée pour de bon.
      if (!(e.target as HTMLElement | null)?.matches(':focus-visible')) return;
      focusWithin = true;
      const card = (e.target as HTMLElement | null)?.closest('a, button');
      if (!card) return;
      const vr = viewport.getBoundingClientRect();
      const cr = card.getBoundingClientRect();
      if (cr.left < vr.left + 16) x -= vr.left + 16 - cr.left;
      else if (cr.right > vr.right - 16) x += cr.right - (vr.right - 16);
      apply();
    };
    const onFocusOut = (e: FocusEvent) => {
      if (!viewport.contains(e.relatedTarget as Node | null)) focusWithin = false;
    };
    // Le focus peut faire défiler le conteneur lui-même : on le remet à zéro.
    const onScroll = () => {
      if (viewport.scrollLeft !== 0) viewport.scrollLeft = 0;
    };

    viewport.addEventListener('pointerenter', onEnter);
    viewport.addEventListener('pointerleave', onLeave);
    viewport.addEventListener('pointerdown', onDown);
    viewport.addEventListener('click', onClickCapture, true);
    viewport.addEventListener('wheel', onWheel, { passive: false });
    viewport.addEventListener('focusin', onFocusIn);
    viewport.addEventListener('focusout', onFocusOut);
    viewport.addEventListener('scroll', onScroll);
    apply();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      viewport.removeEventListener('pointerenter', onEnter);
      viewport.removeEventListener('pointerleave', onLeave);
      viewport.removeEventListener('pointerdown', onDown);
      viewport.removeEventListener('click', onClickCapture, true);
      viewport.removeEventListener('wheel', onWheel);
      viewport.removeEventListener('focusin', onFocusIn);
      viewport.removeEventListener('focusout', onFocusOut);
      viewport.removeEventListener('scroll', onScroll);
      track.style.transform = '';
    };
  }, [active, speed]);

  const insetClass = inset ? 'pl-5 sm:pl-10' : '';

  return (
    <section aria-label={label} className={`relative ${className}`}>
      <div
        ref={viewportRef}
        onDragStart={(e) => e.preventDefault()}
        style={active ? { touchAction: 'pan-y' } : undefined}
        className={
          active
            ? `${fade ? 'gn-band-fade ' : ''}cursor-grab select-none overflow-hidden active:cursor-grabbing ${insetClass}`
            : `gn-scroll-x overflow-x-auto ${insetClass}`
        }
      >
        <div ref={trackRef} className="flex w-max will-change-transform">
          <div ref={copyRef} className="flex items-stretch gap-5 pr-5">
            {children}
          </div>
          {active &&
            Array.from({ length: copies - 1 }, (_, i) => (
              <div key={i} className="flex items-stretch gap-5 pr-5" aria-hidden="true" inert>
                {children}
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
