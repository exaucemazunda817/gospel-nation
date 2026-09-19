'use client';

import { useState } from 'react';
import AnimatedCheckmark from '@/components/AnimatedCheckmark';
import { Field, FileField, CheckboxField, SelectField } from '@/components/form/Field';

type SuccessData = {
  cardUrl: string;
  firstName: string;
};

const CURRENT_YEAR = new Date().getFullYear();
const MEMBER_SINCE_YEARS = Array.from({ length: 61 }, (_, i) => CURRENT_YEAR - i);

export default function InscriptionForm({
  departments
}: {
  departments: { id: string; name: string }[];
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<SuccessData | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch('/api/inscription', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Une erreur est survenue.');
        setSubmitting(false);
        return;
      }
      setSuccess({ cardUrl: `/api/carte/${data.id}?token=${data.accessToken}`, firstName: data.firstName });
    } catch {
      setError("Impossible d'envoyer votre inscription — vérifiez votre connexion.");
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-gn-gold/30 bg-gn-gold/10 p-8 text-center">
        <AnimatedCheckmark />
        <p className="mt-4 font-semibold text-gn-gold">Bienvenue dans la famille, {success.firstName} !</p>
        <p className="mt-1 text-sm text-gn-ink/70">
          Votre inscription est enregistrée et votre carte de membre est prête, avec votre photo.
        </p>
        <a
          href={success.cardUrl}
          download
          className="mt-6 inline-block rounded-full bg-gn-gold px-6 py-3 text-sm font-semibold text-gn-black shadow-sm transition-colors hover:bg-gn-gold-dark"
        >
          Télécharger ma carte de membre
        </a>
        <p className="mt-3 text-xs text-gn-ink/50">
          Gardez ce lien : il vous permettra de retélécharger votre carte à tout moment.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Prénom" name="firstName" required />
        <Field label="Nom" name="lastName" required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Téléphone" name="phone" type="tel" required />
        <Field label="E-mail" name="email" type="email" required />
      </div>
      <Field label="Date de naissance" name="birthDate" type="date" required />
      <div className="grid gap-6 sm:grid-cols-2">
        <SelectField label="Sexe" name="sex" required>
          <option value="">Choisir</option>
          <option value="M">Masculin</option>
          <option value="F">Féminin</option>
        </SelectField>
        <Field label="Commune" name="commune" required placeholder="Ex. Ngaliema" />
      </div>
      <Field label="Adresse" name="address" required placeholder="Avenue, quartier" />

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField label="Membre depuis quelle année ?" name="memberSinceYear" required>
          <option value="">Choisir une année</option>
          {MEMBER_SINCE_YEARS.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </SelectField>
        <SelectField label="Département où vous servez (optionnel)" name="departmentId">
          <option value="">Aucun</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </SelectField>
      </div>

      <FileField
        label="Votre photo"
        name="photo"
        accept="image/jpeg,image/png,image/webp"
        required
        hint="Format JPG, PNG ou WEBP, 5 Mo maximum — elle sera imprimée sur votre carte de membre."
      />
      <CheckboxField
        label="J'accepte que mon anniversaire soit affiché publiquement sur le site de l'église."
        name="showBirthdayPublicly"
      />

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-gn-gold px-6 py-3 text-sm font-semibold text-gn-black shadow-sm transition-colors hover:bg-gn-gold-dark disabled:opacity-60"
      >
        {submitting ? 'Inscription en cours…' : 'Valider mon inscription'}
      </button>
    </form>
  );
}
