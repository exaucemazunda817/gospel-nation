'use client';

import { useState } from 'react';
import AnimatedCheckmark from '@/components/AnimatedCheckmark';
import { Field, TextAreaField } from '@/components/form/Field';

export default function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message')
    };

    try {
      const res = await fetch('/api/contact', {
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
      setError("Impossible d'envoyer votre message — vérifiez votre connexion.");
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-lg border border-gn-gold/30 bg-gn-gold/10 p-6 text-center">
        <AnimatedCheckmark size={44} />
        <p className="mt-3 font-semibold text-gn-gold-line">Message envoyé.</p>
        <p className="mt-1 text-sm text-gn-ink/70">Nous vous répondrons dans les meilleurs délais.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-[18px]">
      <div className="grid gap-[18px] sm:grid-cols-2">
        <Field label="Nom" name="name" required />
        <Field label="E-mail" name="email" type="email" required />
      </div>
      <Field label="Sujet" name="subject" />
      <TextAreaField label="Message" name="message" required rows={5} />

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-gn-black py-[15px] text-center text-sm font-bold uppercase tracking-wide text-gn-gold transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {submitting ? 'Envoi en cours…' : 'Envoyer'}
      </button>
    </form>
  );
}
