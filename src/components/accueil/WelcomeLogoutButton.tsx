'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function WelcomeLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        setLoading(true);
        await fetch('/api/accueil/logout', { method: 'POST' });
        router.push('/equipe-accueil/connexion');
        router.refresh();
      }}
      disabled={loading}
      className="inline-flex min-h-[44px] items-center rounded-full border border-gn-ink/25 px-5 text-sm font-semibold text-gn-ink/80 transition-colors hover:border-gn-ink/50 disabled:opacity-60 print:hidden"
    >
      Déconnexion
    </button>
  );
}
