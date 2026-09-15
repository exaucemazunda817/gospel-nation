'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { parseBibleReference } from '@/lib/bible';

export default function BibleSearch({
  variant = 'light',
  placeholder = 'Ex. Jean 3:16, Psaumes 23, Rm 8...',
  versionCode = 'lsg1910'
}: {
  variant?: 'light' | 'dark';
  placeholder?: string;
  versionCode?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = parseBibleReference(value);
    if (!ref) {
      setError(true);
      return;
    }
    setError(false);
    const anchor = ref.verse ? `#verset-${ref.verse}` : '';
    const versionQuery = versionCode !== 'lsg1910' ? `?version=${versionCode}` : '';
    router.push(`/bible/${ref.book.slug}/${ref.chapter}${versionQuery}${anchor}`);
  };

  const dark = variant === 'dark';

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2.5">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          if (error) setError(false);
        }}
        placeholder={placeholder}
        className={`min-w-0 flex-1 rounded-full border px-4 py-2.5 text-[13.5px] focus:outline-none ${
          dark
            ? 'border-gn-gold/30 bg-gn-black-soft text-gn-cream placeholder:text-gn-cream/40 focus:border-gn-gold'
            : 'border-gn-line bg-white text-gn-ink placeholder:text-gn-ink/40 focus:border-gn-gold-line'
        }`}
      />
      <button
        type="submit"
        className="shrink-0 rounded-full bg-gradient-to-br from-gn-gold-light to-gn-gold px-5 py-2.5 text-[12px] font-bold uppercase tracking-wide text-gn-black transition-opacity hover:opacity-90"
      >
        Aller
      </button>
      {error && (
        <p className="w-full text-[12.5px] text-red-400">
          Référence introuvable — essayez par ex. « Jean 3:16 » ou « Psaumes 23 ».
        </p>
      )}
    </form>
  );
}
