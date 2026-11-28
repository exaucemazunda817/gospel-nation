'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Le dimanche, les nouvelles annonces et les arrivées cochées par un collègue
// doivent apparaître sans recharger : la page se met à jour toute seule.
export default function AutoRefresh({ everyMs = 30000 }: { everyMs?: number }) {
  const router = useRouter();
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') router.refresh();
    }, everyMs);
    return () => window.clearInterval(timer);
  }, [router, everyMs]);
  return null;
}
