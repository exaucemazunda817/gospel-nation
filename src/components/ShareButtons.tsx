'use client';

import { useEffect, useRef, useState } from 'react';

// Partage d'une page (prédication, article, événement) : WhatsApp (le canal que les visiteurs utilisent le
// plus) et copie du lien. Le lien partagé est celui de la page ouverte ; avant
// l'affichage il vient du serveur (`fallbackUrl`), puis il est remplacé par
// l'adresse réelle du navigateur.
export default function ShareButtons({
  title,
  path,
  fallbackUrl,
  tone = 'dark'
}: {
  title: string;
  path: string;
  fallbackUrl: string;
  /** `dark` : sur fond sombre ; `light` : sur fond clair. */
  tone?: 'dark' | 'light';
}) {
  const [url, setUrl] = useState(fallbackUrl);
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);

  useEffect(() => {
    setUrl(`${window.location.origin}${path}`);
    return () => window.clearTimeout(timer.current);
  }, [path]);

  const message = `${title} — Gospel Nation\n${url}`;
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(message)}`;

  async function copy() {
    let done = false;
    try {
      await navigator.clipboard.writeText(url);
      done = true;
    } catch {
      // Navigateur sans presse-papiers moderne : copie par un champ temporaire.
      const field = document.createElement('textarea');
      field.value = url;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      try {
        done = document.execCommand('copy');
      } catch {
        done = false;
      }
      field.remove();
    }
    setCopied(done);
    window.clearTimeout(timer.current);
    if (done) timer.current = window.setTimeout(() => setCopied(false), 2200);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href={whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-[44px] items-center gap-2.5 rounded-full bg-gn-gold px-5 text-sm font-semibold text-gn-on-gold transition-colors hover:bg-gn-gold-light"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden="true">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91A9.85 9.85 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.55-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.16-.48-.29Z" />
        </svg>
        Partager sur WhatsApp
      </a>
      <button
        type="button"
        onClick={copy}
        className={`inline-flex min-h-[44px] items-center gap-2 rounded-full border px-5 text-sm font-semibold transition-colors ${
            tone === 'dark'
              ? 'border-gn-cream/35 text-gn-cream hover:border-gn-gold hover:text-gn-gold'
              : 'border-gn-line bg-white text-gn-ink hover:border-gn-gold-line hover:text-gn-gold-line'
          }`}
      >
        {copied ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className={`h-4 w-4 ${tone === 'dark' ? 'text-gn-gold' : 'text-gn-gold-line'}`} aria-hidden="true">
            <path d="m5 12 5 5L20 7" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M5 15V6a2 2 0 0 1 2-2h9" />
          </svg>
        )}
        <span role="status" aria-live="polite">
          {copied ? 'Lien copié' : 'Copier le lien'}
        </span>
      </button>
    </div>
  );
}
