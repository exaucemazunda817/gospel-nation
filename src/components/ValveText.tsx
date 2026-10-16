'use client';

import { useState } from 'react';

// Texte d'un communiqué : trois lignes, puis « Lire la suite » s'il est plus long.
export default function ValveText({ text, tone = 'light' }: { text: string; tone?: 'light' | 'dark' }) {
  const long = text.length > 170 || text.split('\n').length > 3;
  const [open, setOpen] = useState(false);
  return (
    <div>
      <p
        className={`whitespace-pre-line text-sm leading-relaxed ${tone === 'dark' ? 'text-gn-cream/80' : 'text-gn-ink/75'} ${long && !open ? 'line-clamp-3' : ''}`}
      >
        {text}
      </p>
      {long && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className={`mt-1 inline-flex min-h-[44px] items-center text-sm font-semibold hover:underline ${tone === 'dark' ? 'text-gn-gold' : 'text-gn-gold-dark'}`}
        >
          {open ? 'Réduire' : 'Lire la suite'}
        </button>
      )}
    </div>
  );
}
