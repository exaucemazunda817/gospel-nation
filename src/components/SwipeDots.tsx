'use client';

import { useEffect, useRef, useState } from 'react';

// Points de repère sous une rangée glissante (téléphone seulement) : ils suivent
// la carte visible et permettent d'y aller d'un toucher. La rangée est
// l'élément placé juste avant ces points. Repris de One Love.
export default function SwipeDots({ count, label }: { count: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const list = () => ref.current?.previousElementSibling as HTMLElement | null;

  useEffect(() => {
    const el = list();
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const items = Array.from(el.children) as HTMLElement[];
        const left = el.getBoundingClientRect().left + 20;
        let best = 0;
        let dist = Infinity;
        items.forEach((item, i) => {
          const d = Math.abs(item.getBoundingClientRect().left - left);
          if (d < dist) {
            dist = d;
            best = i;
          }
        });
        setActive(best);
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      el.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  function goTo(index: number) {
    const el = list();
    const item = el?.children[index] as HTMLElement | undefined;
    if (!el || !item) return;
    el.scrollTo({
      left: item.getBoundingClientRect().left - el.getBoundingClientRect().left + el.scrollLeft - 20,
      behavior: 'smooth'
    });
  }

  if (count < 2) return null;

  return (
    <div ref={ref} className="mt-4 flex justify-center gap-1 sm:hidden" role="group" aria-label={label}>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => goTo(i)}
          aria-label={`${i + 1} / ${count}`}
          aria-current={i === active ? 'true' : undefined}
          // Zone tactile de 44 px, point visible plus petit au centre.
          className="group flex min-h-[44px] w-6 items-center justify-center"
        >
          <span
            className={`block h-2 rounded-full transition-all duration-300 ${i === active ? 'w-5 bg-gn-gold' : 'w-2 bg-gn-gold/35'}`}
          />
        </button>
      ))}
    </div>
  );
}
