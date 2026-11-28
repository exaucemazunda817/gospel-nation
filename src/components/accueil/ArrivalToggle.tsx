'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Case « arrivé » de la feuille d'accueil : un seul geste à la porte.
export default function ArrivalToggle({ id, arrived, locked }: { id: string; arrived: boolean; locked?: boolean }) {
  const router = useRouter();
  const [value, setValue] = useState(arrived);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  async function toggle() {
    const next = !value;
    setValue(next);
    setBusy(true);
    setError(false);
    try {
      const res = await fetch(`/api/accueil/visites/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ arrived: next })
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setValue(!next);
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1 print:hidden">
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={toggle}
        disabled={busy || locked}
        className={`inline-flex min-h-[44px] min-w-[120px] items-center justify-center rounded-full border px-5 text-sm font-semibold transition-colors disabled:opacity-60 ${
          value ? 'border-gn-gold-dark bg-gn-gold-dark text-white' : 'border-gn-ink/30 text-gn-ink hover:border-gn-ink/60'
        }`}
      >
        {value ? 'Arrivé ✓' : 'Arrivé ?'}
      </button>
      {error && (
        <span role="alert" className="text-xs font-medium text-red-700">
          Échec : réessayez.
        </span>
      )}
    </div>
  );
}
