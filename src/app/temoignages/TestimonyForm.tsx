'use client';

import { useState } from 'react';
import AnimatedCheckmark from '@/components/AnimatedCheckmark';
import { CheckboxField, Field, TextAreaField } from '@/components/form/Field';

export default function TestimonyForm() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [publishedChoice, setPublishedChoice] = useState(true);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      authorName: formData.get('authorName'),
      content: formData.get('content'),
      videoUrl: formData.get('videoUrl'),
      wantsPublished: formData.get('wantsPublished') === 'on'
    };
    setPublishedChoice(payload.wantsPublished);

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
        <AnimatedCheckmark />
        <p className="mt-4 font-semibold text-gn-gold">Merci pour votre témoignage !</p>
        <p className="mt-1 text-sm text-gn-ink/70">
          {publishedChoice
            ? 'Il sera publié sur cette page après vérification par un administrateur.'
            : "Il est bien enregistré auprès de l'église et ne sera pas publié sur le site, comme vous l'avez demandé."}
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
      <CheckboxField
        label="Je suis d'accord pour que mon témoignage soit publié sur le site après vérification."
        name="wantsPublished"
        defaultChecked
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
