'use client';

import { useState } from 'react';

// Copie un texte dans le presse-papiers (numéro de compte, par exemple). Repli
// par un champ temporaire quand l'API moderne est indisponible (page non
// sécurisée, vieux navigateur).
export default function CopyButton({ text, label = 'Copier' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const field = document.createElement('textarea');
      field.value = text;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      try {
        document.execCommand('copy');
      } finally {
        document.body.removeChild(field);
      }
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-gn-gold-line/60 px-4 text-sm font-semibold text-gn-gold-dark transition-colors hover:border-gn-gold hover:bg-gn-gold/10"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {copied ? <polyline points="20 6 9 17 4 12" /> : (
          <>
            <rect x="9" y="9" width="12" height="12" rx="2" />
            <path d="M5 15V5a2 2 0 0 1 2-2h10" />
          </>
        )}
      </svg>
      <span aria-live="polite">{copied ? 'Copié' : label}</span>
    </button>
  );
}
