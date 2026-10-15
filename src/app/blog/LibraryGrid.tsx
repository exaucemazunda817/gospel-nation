'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { fr } from '@/lib/typo';

export type LibraryItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string | null;
  cover: string | null;
  documentUrl: string | null;
  size: string | null;
  date: string | null;
};

// Documents de la Bibliothèque, filtrables par catégorie (filtre dans le
// navigateur : tout est déjà chargé). Couvertures montrées en entier, comme
// des livres posés sur une étagère.
export default function LibraryGrid({ items }: { items: LibraryItem[] }) {
  const categories = Array.from(new Set(items.map((i) => i.category).filter((c): c is string => Boolean(c))));
  const [category, setCategory] = useState('Tous');
  const visible = category === 'Tous' ? items : items.filter((i) => i.category === category);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par catégorie">
        {['Tous', ...categories].map((option) => {
          const count = option === 'Tous' ? items.length : items.filter((i) => i.category === option).length;
          const active = option === category;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setCategory(option)}
              aria-pressed={active}
              className={`relative inline-flex min-h-[44px] items-center rounded-full border px-4 text-xs font-semibold transition-colors ${
                active ? 'border-gn-gold text-gn-black' : 'border-gn-line bg-white text-gn-ink hover:border-gn-gold'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="library-category-pill"
                  className="absolute inset-0 rounded-full bg-gn-gold"
                  transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                />
              )}
              <span className="relative">
                {option} <span className="ml-1.5 opacity-70">({count})</span>
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-5 text-sm text-gn-muted-strong" role="status" aria-live="polite">
        {visible.length} document{visible.length > 1 ? 's' : ''}
        {category !== 'Tous' ? ` dans « ${category} »` : ''}
      </p>

      <motion.ul
        key={category}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {visible.map((item) => {
          const cover = (
            <div className="relative h-56 w-full bg-gn-cream-bg px-6 pt-6">
              {item.cover ? (
                <div className="relative h-full w-full">
                  <Image
                    src={item.cover}
                    alt={`Couverture : ${item.title}`}
                    fill
                    sizes="(max-width: 640px) 90vw, 340px"
                    className="object-contain object-bottom [filter:drop-shadow(0_10px_14px_rgb(0_0_0/0.28))]"
                  />
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-gn-black">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gn-gold)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21z" />
                      <path d="M4 5.5v15.5" />
                    </svg>
                  </span>
                </div>
              )}
            </div>
          );
          const text = (
            <div className="flex flex-1 flex-col p-6">
              {item.category && (
                <span className="w-fit rounded-full bg-gn-gold/10 px-3 py-1 text-xs font-semibold text-gn-gold-line">{item.category}</span>
              )}
              <h2 className="mt-3 font-serif text-lg font-semibold leading-snug text-gn-ink">{fr(item.title)}</h2>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gn-ink/70">{item.excerpt}</p>
              {item.documentUrl ? (
                <div className="mt-auto pt-5">
                <a
                  href={item.documentUrl}
                  download
                  className="flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-gn-gold-line px-4 text-sm font-semibold text-gn-gold-dark transition-colors hover:bg-gn-gold hover:text-gn-on-gold"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
                    <path d="M12 3v12" />
                    <path d="m7 10 5 5 5-5" />
                    <path d="M5 21h14" />
                  </svg>
                  Télécharger le PDF{item.size ? ` · ${item.size}` : ''}
                </a>
                </div>
              ) : (
                item.date && <span className="mt-auto border-t border-gn-line pt-3.5 text-xs text-gn-muted-strong">{item.date}</span>
              )}
            </div>
          );
          return (
            <li key={item.id}>
              {item.documentUrl ? (
                <div className="gn-card-lift flex h-full flex-col overflow-hidden rounded-lg border border-gn-line bg-white">
                  {cover}
                  {text}
                </div>
              ) : (
                <Link href={`/blog/${item.slug}`} className="gn-card-lift gn-spot flex h-full flex-col overflow-hidden rounded-lg border border-gn-line bg-white">
                  {cover}
                  {text}
                </Link>
              )}
            </li>
          );
        })}
      </motion.ul>
    </div>
  );
}
