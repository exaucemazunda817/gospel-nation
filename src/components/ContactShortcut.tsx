'use client';

import { CHOOSE_MOTIF_EVENT, type ContactMotif } from '@/lib/contact';

// Raccourci qui règle le motif du formulaire et y fait défiler la page, sans
// rechargement.
export default function ContactShortcut({ motif, children, className }: { motif: ContactMotif; children: React.ReactNode; className?: string }) {
  return (
    <a
      href={`?motif=${motif}#formulaire`}
      onClick={(event) => {
        event.preventDefault();
        window.dispatchEvent(new CustomEvent(CHOOSE_MOTIF_EVENT, { detail: motif }));
        document.getElementById('formulaire')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }}
      className={className}
    >
      {children}
    </a>
  );
}
