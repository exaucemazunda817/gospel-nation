'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormError } from '@/components/form/Field';

export default function WelcomeLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/accueil/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? 'Erreur de connexion.');
        setLoading(false);
        return;
      }
      router.push('/equipe-accueil');
      router.refresh();
    } catch {
      setError('Impossible de se connecter : vérifiez votre connexion.');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium text-gn-ink/80">Mot de passe de l&apos;équipe d&apos;accueil</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoFocus
          autoComplete="current-password"
          className="min-h-[44px] w-full rounded-lg border border-black/15 bg-white px-4 py-2.5 text-gn-ink shadow-sm transition-colors focus:border-gn-gold focus:outline-none focus:ring-2 focus:ring-gn-gold/30"
        />
      </label>
      <FormError message={error} />
      <button
        type="submit"
        disabled={loading}
        className="min-h-[44px] w-full rounded-full bg-gn-gold-dark px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:opacity-90 disabled:opacity-60"
      >
        {loading ? 'Connexion…' : 'Se connecter'}
      </button>
    </form>
  );
}
