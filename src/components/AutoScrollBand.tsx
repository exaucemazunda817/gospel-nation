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
// et inaccessible au clavier. Bouton pause fourni (WCAG 2.2.2). Avec « Réduire
// les animations », ou sans JavaScript, c'est une simple rangée à défilement natif.
export default function AutoScrollBand({
  children,
  label,
  speed = 40
}: {
  children: ReactNode;
  label: string;
  /** Vitesse de défilement automatique, en pixels par seconde. */
  speed?: number;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setActive(true);
  }, []);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

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
        const holding = hover || focusWithin || pausedRef.current || t - lastInteraction < 1600 || momentum !== 0;
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

  return (
    <section aria-label={label} className="relative">
      <div
        ref={viewportRef}
        onDragStart={(e) => e.preventDefault()}
        style={active ? { touchAction: 'pan-y' } : undefined}
        className={
          active
            ? 'gn-band-fade cursor-grab select-none overflow-hidden pl-5 active:cursor-grabbing sm:pl-10'
            : 'gn-scroll-x overflow-x-auto pl-5 sm:pl-10'
        }
      >
        <div ref={trackRef} className="flex w-max will-change-transform">
          <div ref={copyRef} className="flex items-stretch gap-5 pr-5">
            {children}
          </div>
          {active && (
            <div className="flex items-stretch gap-5 pr-5" aria-hidden="true" inert>
              {children}
            </div>
          )}
        </div>
      </div>
      {active && (
        <button
          type="button"
          aria-pressed={paused}
          aria-label={paused ? 'Reprendre le défilement' : 'Mettre en pause le défilement'}
          onClick={() => setPaused((p) => !p)}
          className="mx-auto mt-5 flex h-11 items-center gap-2 rounded-full border border-gn-line bg-white px-4 text-sm font-semibold text-gn-ink transition-colors hover:border-gn-gold-line hover:text-gn-gold-line"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            {paused ? <path d="M8 5v14l11-7z" /> : <path d="M7 5h4v14H7zM13 5h4v14h-4z" />}
          </svg>
          {paused ? 'Reprendre' : 'Pause'}
        </button>
      )}
    </section>
  );
}
