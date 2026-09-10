'use client';

import { useState } from 'react';
import { Field, TextAreaField } from '@/components/form/Field';

export default function AppointmentForm() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      requesterName: formData.get('requesterName'),
      requesterPhone: formData.get('requesterPhone'),
      requesterEmail: formData.get('requesterEmail'),
      reason: formData.get('reason'),
      preferredDate: formData.get('preferredDate')
    };

    try {
      const res = await fetch('/api/rendez-vous', {
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
      setError('Impossible d\'envoyer votre demande — vérifiez votre connexion.');
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-gn-gold/30 bg-gn-gold/10 p-8 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gn-gold text-2xl text-gn-black">
          ✓
        </span>
        <p className="mt-4 font-semibold text-gn-gold">Demande envoyée.</p>
        <p className="mt-1 text-sm text-gn-cream/70">
          Le pasteur ou son secrétariat vous contactera pour confirmer le rendez-vous.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nom" name="requesterName" required />
        <Field label="Téléphone" name="requesterPhone" type="tel" required />
      </div>
      <Field label="E-mail (optionnel)" name="requesterEmail" type="email" />
      <Field label="Date souhaitée" name="preferredDate" type="date" required />
      <TextAreaField label="Motif du rendez-vous" name="reason" required rows={4} />

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-gn-gold px-6 py-3 text-sm font-semibold text-gn-black shadow-sm transition-colors hover:bg-gn-gold-dark disabled:opacity-60"
      >
        {submitting ? 'Envoi en cours…' : 'Demander un rendez-vous'}
      </button>
    </form>
  );
}
