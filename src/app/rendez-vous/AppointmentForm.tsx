'use client';

import { useMemo, useState } from 'react';
import AnimatedCheckmark from '@/components/AnimatedCheckmark';
import { Field, SelectField, TextAreaField } from '@/components/form/Field';

// Le pasteur ne reçoit que le mardi : plutôt qu'un sélecteur de date libre
// (qui laissait choisir n'importe quel jour, et débordait du formulaire sur
// certains mobiles), on propose directement les prochains mardis.
//
// toISOString() convertit en UTC avant de découper la date : sur un fuseau
// en avance sur UTC (ex. Kinshasa, UTC+1), minuit local devient la veille en
// UTC — la valeur envoyée au serveur se retrouvait décalée d'un jour par
// rapport à l'étiquette affichée (et donc rejetée par la vérification
// « mardi uniquement » côté API). On construit donc la valeur à partir des
// composants de date locaux, jamais via toISOString().
function toLocalDateValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function nextTuesdays(count: number): { value: string; label: string }[] {
  const out: { value: string; label: string }[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  // 2 = mardi (0 = dimanche)
  d.setDate(d.getDate() + ((2 - d.getDay() + 7) % 7 || 7));
  for (let i = 0; i < count; i++) {
    const date = new Date(d);
    date.setDate(d.getDate() + i * 7);
    out.push({
      value: toLocalDateValue(date),
      label: date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
    });
  }
  return out;
}

export default function AppointmentForm() {
  const tuesdays = useMemo(() => nextTuesdays(8), []);
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
        <AnimatedCheckmark />
        <p className="mt-4 font-semibold text-gn-gold">Demande envoyée.</p>
        <p className="mt-1 text-sm text-gn-ink/70">
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
      <SelectField label="Mardi souhaité — le pasteur reçoit uniquement ce jour-là" name="preferredDate" required>
        <option value="">Choisir une date</option>
        {tuesdays.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </SelectField>
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
