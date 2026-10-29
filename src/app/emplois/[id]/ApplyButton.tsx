'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormError } from '@/components/form/Field';

export default function ApplyButton({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function apply() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/emplois/${jobId}/postuler`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Une erreur est survenue.');
        setLoading(false);
        return;
      }
      router.refresh();
    } catch {
      setError('Impossible d’envoyer votre candidature, vérifiez votre connexion.');
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={apply}
        disabled={loading}
        className="min-h-[44px] rounded-full bg-gn-gold px-6 text-sm font-semibold text-gn-black shadow-sm transition-colors hover:bg-gn-gold-dark disabled:opacity-60"
      >
        {loading ? 'Envoi…' : 'Postuler avec mon profil'}
      </button>
      <FormError message={error} />
    </div>
  );
}
