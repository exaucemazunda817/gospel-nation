'use client';

import { useEffect, useRef, useState } from 'react';
import AnimatedCheckmark from '@/components/AnimatedCheckmark';
import Link from 'next/link';
import { Field, SelectField, TextAreaField } from '@/components/form/Field';
import { CHOOSE_MOTIF_EVENT, CONTACT_MOTIFS } from '@/lib/contact';

export default function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Lien de la forme /contact?sujet=… (ex. depuis la fiche d'un département) :
  // le sujet est prérempli, le visiteur peut le modifier. Lu au montage pour que
  // la page reste statique ; le texte est limité à 120 caractères.
  // Même principe pour /contact?motif=priere, et pour les raccourcis de la page
  // qui envoient le motif par un événement (sans recharger la page).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const subject = params.get('sujet');
    const input = formRef.current?.elements.namedItem('subject');
    if (subject && input instanceof HTMLInputElement && !input.value) input.value = subject.slice(0, 120);

    const chooseMotif = (motif: string | null) => {
      const select = formRef.current?.elements.namedItem('motif');
      if (motif && select instanceof HTMLSelectElement && CONTACT_MOTIFS.some((m) => m.key === motif)) {
        select.value = motif;
        formRef.current?.querySelector<HTMLTextAreaElement>('textarea[name=message]')?.focus({ preventScroll: true });
      }
    };
    chooseMotif(params.get('motif'));
    const onChoose = (event: Event) => chooseMotif((event as CustomEvent<string>).detail);
    window.addEventListener(CHOOSE_MOTIF_EVENT, onChoose);
    return () => window.removeEventListener(CHOOSE_MOTIF_EVENT, onChoose);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      motif: formData.get('motif'),
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
      setError("Impossible d'envoyer votre message : vérifiez votre connexion.");
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-lg border border-gn-gold/30 bg-gn-gold/10 p-6 text-center">
        <AnimatedCheckmark size={44} />
        <p className="mt-3 font-semibold text-gn-gold-line">Message envoyé.</p>
        <p className="mt-1 text-sm text-gn-ink/70">Nous vous répondrons dans les meilleurs délais.</p>
        <p className="mt-5 text-sm font-medium text-gn-ink/80">En attendant :</p>
        <div className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-1">
          <Link href="/eglise#horaires" className="inline-flex min-h-[44px] items-center text-sm font-semibold text-gn-gold-dark hover:underline">
            Nos horaires
          </Link>
          <Link href="/predications" className="inline-flex min-h-[44px] items-center text-sm font-semibold text-gn-gold-dark hover:underline">
            Écouter une prédication
          </Link>
          <Link href="/rendez-vous" className="inline-flex min-h-[44px] items-center text-sm font-semibold text-gn-gold-dark hover:underline">
            Prendre rendez-vous
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-[18px]">
      <div className="grid gap-[18px] sm:grid-cols-2">
        <Field label="Nom" name="name" required />
        <Field label="E-mail" name="email" type="email" required />
      </div>
      <SelectField label="Motif" name="motif">
        {CONTACT_MOTIFS.map((m) => (
          <option key={m.key} value={m.key}>
            {m.label}
          </option>
        ))}
      </SelectField>
      <Field label="Sujet (facultatif)" name="subject" />
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
