'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Field, TextAreaField, FormError } from '@/components/form/Field';

// Champs du profil (mêmes noms que PROFILE_LIMITS côté serveur, qui reste juge).
const PROFILE_KEYS = ['fullName', 'phone', 'city', 'headline', 'summary', 'experience', 'education', 'skills', 'languages'];

type Initial = {
  fullName: string;
  phone: string;
  city: string;
  headline: string;
  summary: string;
  experience: string;
  education: string;
  skills: string;
  languages: string;
};

export default function ProfileForm({ initial, back }: { initial: Initial | null; back: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [consent, setConsent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    setSubmitting(true);
    setError(null);
    const f = new FormData(formEl);
    const payload: Record<string, unknown> = { consent };
    for (const key of PROFILE_KEYS) payload[key] = f.get(key);

    try {
      const res = await fetch('/api/emplois/profil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Une erreur est survenue.');
        setSubmitting(false);
        return;
      }
      setSaved(true);
      setSubmitting(false);
      router.refresh();
    } catch {
      setError('Impossible d’enregistrer, vérifiez votre connexion.');
      setSubmitting(false);
    }
  }

  async function deleteProfile() {
    if (!window.confirm('Supprimer votre profil et vos candidatures en attente ?')) return;
    const res = await fetch('/api/emplois/profil', { method: 'DELETE' });
    if (res.ok) router.push('/emplois');
    else setError('La suppression a échoué, réessayez.');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <p className="text-sm leading-relaxed text-gn-ink/70">
        Plus votre profil est précis, meilleurs seront vos documents. N’écrivez que ce que vous voulez voir dans votre CV.
      </p>
      <Field label="Nom complet" name="fullName" required defaultValue={initial?.fullName} autoComplete="name" />
      <Field label="Téléphone" name="phone" type="tel" defaultValue={initial?.phone} autoComplete="tel" />
      <Field label="Ville" name="city" defaultValue={initial?.city} autoComplete="address-level2" />
      <Field label="Métier ou objectif" name="headline" defaultValue={initial?.headline} placeholder="Ex. Comptable, cherche un poste en entreprise" />
      <TextAreaField label="Présentation en quelques lignes" name="summary" rows={3} defaultValue={initial?.summary} />
      <TextAreaField
        label="Expériences professionnelles"
        name="experience"
        rows={6}
        defaultValue={initial?.experience}
        hint="Pour chaque poste : employeur, intitulé, dates, ce que vous faisiez."
      />
      <TextAreaField label="Études et formations" name="education" rows={4} defaultValue={initial?.education} />
      <TextAreaField label="Compétences" name="skills" rows={3} defaultValue={initial?.skills} />
      <Field label="Langues" name="languages" defaultValue={initial?.languages} placeholder="Français, lingala, anglais…" />

      <div className="flex items-start gap-3 text-sm text-gn-ink/80">
        <input
          id="job-consent"
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-2.5 h-5 w-5 shrink-0 cursor-pointer rounded border-gn-ink/30 text-gn-gold focus:ring-gn-gold/40"
        />
        <label htmlFor="job-consent" className="flex min-h-[44px] cursor-pointer items-center leading-snug">
          J’accepte que ces informations soient lues par l’assistant de l’église pour rédiger mes candidatures. Je peux les
          supprimer à tout moment.
        </label>
      </div>

      <FormError message={error} />
      {saved && (
        <p role="status" className="rounded-md border border-gn-gold/40 bg-gn-gold/10 px-3 py-2 text-sm font-medium text-gn-ink">
          Profil enregistré.{' '}
          <a href={back} className="font-semibold text-gn-gold-line underline">
            Continuer
          </a>
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="min-h-[44px] rounded-full bg-gn-gold px-6 text-sm font-semibold text-gn-black shadow-sm transition-colors hover:bg-gn-gold-dark disabled:opacity-60"
        >
          {submitting ? 'Enregistrement…' : 'Enregistrer mon profil'}
        </button>
        {initial && (
          <button
            type="button"
            onClick={deleteProfile}
            className="min-h-[44px] rounded-full border border-red-700/50 px-5 text-sm font-semibold text-red-800 transition-colors hover:bg-red-700 hover:text-white"
          >
            Supprimer mon profil
          </button>
        )}
      </div>
    </form>
  );
}
