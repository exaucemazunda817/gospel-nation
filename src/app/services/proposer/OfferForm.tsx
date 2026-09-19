'use client';

import { useState } from 'react';
import AnimatedCheckmark from '@/components/AnimatedCheckmark';
import { Field, SelectField, TextAreaField } from '@/components/form/Field';
import { OFFER_CATEGORIES, OFFER_LIMITS } from '@/lib/offers';

export default function OfferForm({ defaultName }: { defaultName: string }) {
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
      category: formData.get('category'),
      title: formData.get('title'),
      description: formData.get('description'),
      contactPhone: formData.get('contactPhone'),
      contactEmail: formData.get('contactEmail'),
      externalUrl: formData.get('externalUrl')
    };

    try {
      const res = await fetch('/api/offres', {
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
      setError("Impossible d'envoyer votre offre, vérifiez votre connexion.");
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-gn-gold/30 bg-gn-gold/10 p-8 text-center">
        <AnimatedCheckmark />
        <p className="mt-4 font-semibold text-gn-gold">Merci, votre offre est bien reçue !</p>
        <p className="mt-1 text-sm text-gn-ink/70">
          Elle apparaîtra sur la page Offres et services après vérification par un administrateur.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Field label="Votre nom (tel qu'il sera affiché)" name="authorName" required defaultValue={defaultName} />
      <SelectField label="Catégorie" name="category" required>
        <option value="">Choisir…</option>
        {OFFER_CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </SelectField>
      <Field label="Titre de l'offre" name="title" required placeholder="Ex. Traiteur pour mariages et anniversaires" />
      <TextAreaField label="Description" name="description" required rows={5} />
      <p className="-mt-3 text-xs text-gn-ink/60">
        {OFFER_LIMITS.description} caractères au maximum. Décrivez ce que vous proposez, où et à quel public.
      </p>

      <fieldset className="space-y-5 rounded-2xl border border-gn-line p-5">
        <legend className="px-2 text-sm font-semibold text-gn-ink">Comment vous contacter</legend>
        <p className="text-xs text-gn-ink/60">
          Indiquez au moins un moyen. Ces coordonnées seront visibles par tous les visiteurs du site.
        </p>
        <Field label="Téléphone (WhatsApp)" name="contactPhone" type="tel" placeholder="0812345678" />
        <Field label="E-mail" name="contactEmail" type="email" />
        <Field label="Site ou page en ligne" name="externalUrl" placeholder="https://…" />
      </fieldset>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-gn-gold px-6 py-3 text-sm font-semibold text-gn-black shadow-sm transition-colors hover:bg-gn-gold-dark disabled:opacity-60"
      >
        {submitting ? 'Envoi en cours…' : 'Proposer mon offre'}
      </button>
    </form>
  );
}
