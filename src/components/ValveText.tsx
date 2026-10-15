'use client';

import { useState } from 'react';

// Texte d'un communiqué : trois lignes, puis « Lire la suite » s'il est plus long.
export default function ValveText({ text }: { text: string }) {
  const long = text.length > 170 || text.split('\n').length > 3;
  const [open, setOpen] = useState(false);
  return (
    <div>
      <p className={`whitespace-pre-line text-sm leading-relaxed text-gn-ink/75 ${long && !open ? 'line-clamp-3' : ''}`}>{text}</p>
      {long && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="mt-1 inline-flex min-h-[44px] items-center text-sm font-semibold text-gn-gold-dark hover:underline"
        >
          {open ? 'Réduire' : 'Lire la suite'}
        </button>
      )}
    </div>
  );
}
