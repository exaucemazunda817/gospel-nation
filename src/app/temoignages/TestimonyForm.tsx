'use client';

import { useState } from 'react';
import { Field, TextAreaField } from '@/components/form/Field';

export default function TestimonyForm() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      authorName: formData.get('authorName'),
      content: formData.get('content'),
      videoUrl: formData.get('videoUrl')
    };

    try {
      const res = await fetch('/api/temoignages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Une erreur est survenue.');
        setSubmitting(false);
        return;
      }
      setSuccess(true);
    } catch {
      setError('Impossible d\'envoyer votre témoignage — vérifiez votre connexion.');
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-gn-gold/30 bg-gn-gold/10 p-8 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gn-gold text-2xl text-gn-black">
          ✓
        </span>
        <p className="mt-4 font-semibold text-gn-gold">Merci pour votre témoignage !</p>
        <p className="mt-1 text-sm text-gn-cream/70">
          Il sera publié sur cette page après vérification par un administrateur.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Field label="Votre nom" name="authorName" required />
      <TextAreaField label="Votre témoignage" name="content" required rows={6} />
      <Field
        label="Lien vidéo (optionnel)"
        name="videoUrl"
        type="url"
        placeholder="https://youtube.com/..."
      />

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-gn-gold px-6 py-3 text-sm font-semibold text-gn-black shadow-sm transition-colors hover:bg-gn-gold-dark disabled:opacity-60"
      >
        {submitting ? 'Envoi en cours…' : 'Partager mon témoignage'}
      </button>
    </form>
  );
}
