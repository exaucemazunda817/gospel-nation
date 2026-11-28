'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import AnimatedCheckmark from '@/components/AnimatedCheckmark';
import { CheckboxField, Field, FormError, SelectField, TextAreaField } from '@/components/form/Field';
import { church } from '@/lib/content';
import { googleCalendarUrl } from '@/lib/dates';
import {
  SOURCE_OPTIONS,
  buildVisitIcs,
  formatVisitDayWithYear,
  isVisitSource,
  upcomingVisitDays,
  visitDateFromValue,
  visitServiceFor,
  visitStartInstant
} from '@/lib/visits';

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(church.address)}`;

type Done = { firstName: string; dateValue: string; children: number };

export default function VisitForm() {
  // Les jours proposés sont calculés dans le navigateur : la page est préparée au
  // déploiement, un calcul côté serveur figerait des dates passées dans le HTML
  // (et provoquerait l'erreur React #418, voir /rendez-vous).
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const days = useMemo(() => (mounted ? upcomingVisitDays() : []), [mounted]);
  // Provenance connue d'avance quand on arrive par un QR code ou un lien (?s=qr).
  const initialSource = useMemo(() => {
    if (!mounted) return '';
    const s = new URLSearchParams(window.location.search).get('s');
    return isVisitSource(s) ? s : '';
  }, [mounted]);

  const [companions, setCompanions] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<Done | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    if (form.get('consent') !== 'on') {
      setError('Merci de cocher la case d’accord : sans elle nous ne pouvons pas enregistrer votre venue.');
      return;
    }
    const companionsValue = Number(form.get('companions') ?? 0);
    const children = Number(form.get('childrenCount') ?? 0);
    if (children > companionsValue) {
      setError('Les enfants font partie des personnes qui vous accompagnent : vérifiez les deux nombres.');
      return;
    }
    setSubmitting(true);
    const payload = {
      firstName: form.get('firstName'),
      lastName: form.get('lastName'),
      phone: form.get('phone'),
      email: form.get('email'),
      visitDate: form.get('visitDate'),
      companions: companionsValue,
      childrenCount: children,
      companionNames: form.get('companionNames') ?? '',
      source: form.get('source'),
      prayerRequest: form.get('prayerRequest'),
      website: form.get('website'),
      consent: true
    };
    try {
      const res = await fetch('/api/visite', {
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
      setDone({ firstName: String(payload.firstName), dateValue: String(payload.visitDate), children });
    } catch {
      setError("Impossible d'envoyer votre annonce : vérifiez votre connexion.");
      setSubmitting(false);
    }
  }

  if (done) return <Confirmation done={done} />;

  const peopleOptions = Array.from({ length: 11 }, (_, i) => i);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Prénom" name="firstName" required autoComplete="given-name" />
        <Field label="Nom" name="lastName" required autoComplete="family-name" />
      </div>

      <SelectField label="Quel jour viendrez-vous ?" name="visitDate" required>
        <option value="">Choisir un culte</option>
        {days.map((d) => (
          <option key={d.value} value={d.value}>
            {d.label}
          </option>
        ))}
      </SelectField>

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField label="Je viens avec" name="companions" onValueChange={(v) => setCompanions(Number(v))}>
          {peopleOptions.map((n) => (
            <option key={n} value={n}>
              {n === 0 ? 'Personne, je viens sans accompagnant' : `${n} personne${n > 1 ? 's' : ''}`}
            </option>
          ))}
        </SelectField>
        {companions > 0 && (
          <SelectField label="Dont enfants" name="childrenCount" defaultValue="0">
            {peopleOptions
              .filter((n) => n <= companions)
              .map((n) => (
                <option key={n} value={n}>
                  {n === 0 ? 'Aucun enfant' : `${n} enfant${n > 1 ? 's' : ''}`}
                </option>
              ))}
          </SelectField>
        )}
      </div>
      {companions > 0 && (
        <TextAreaField
          label="Leurs prénoms (facultatif)"
          name="companionNames"
          rows={2}
          hint="Vous pouvez aussi ne citer personne : le nombre suffit."
        />
      )}

      <fieldset className="space-y-4 rounded-lg border border-gn-line/60 p-4">
        <legend className="px-2 text-xs font-semibold text-gn-muted-strong">
          Pour vous écrire un mot de bienvenue (facultatif)
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Téléphone (WhatsApp)" name="phone" type="tel" autoComplete="tel" />
          <Field label="E-mail" name="email" type="email" autoComplete="email" />
        </div>
      </fieldset>

      <SelectField key={initialSource} label="Comment avez-vous connu l'église ? (facultatif)" name="source" defaultValue={initialSource}>
        <option value="">Je préfère ne pas répondre</option>
        {SOURCE_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </SelectField>

      <TextAreaField
        label="Une demande de prière ? (facultatif)"
        name="prayerRequest"
        rows={3}
        hint="Elle n'est lue que par l'équipe pastorale, jamais par l'accueil."
      />

      {/* Champ piège : invisible pour une personne, un robot le remplit. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Ne pas remplir
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <CheckboxField
        name="consent"
        label="J'accepte que l'église enregistre ces informations pour m'accueillir. Mon nom et mes coordonnées sont effacés 6 mois après ma visite."
      />

      <FormError message={error} />

      <button
        type="submit"
        disabled={submitting}
        className="min-h-[44px] rounded-full bg-gn-gold px-6 py-3 text-sm font-semibold text-gn-black shadow-sm transition-colors hover:bg-gn-gold-dark disabled:opacity-60"
      >
        {submitting ? 'Envoi en cours…' : 'Annoncer ma venue'}
      </button>
    </form>
  );
}

// Écran affiché après l'envoi : ce qu'il faut savoir pour venir, et de quoi ne
// pas oublier (agenda, itinéraire).
function Confirmation({ done }: { done: Done }) {
  const date = visitDateFromValue(done.dateValue);
  const service = date ? visitServiceFor(date) : null;
  const start = date ? visitStartInstant(date) : null;
  const ics = date ? buildVisitIcs(date) : null;
  return (
    <div className="rounded-2xl border border-gn-gold/30 bg-gn-gold/10 p-6 text-center sm:p-8" role="status">
      <AnimatedCheckmark />
      <p className="mt-4 font-serif text-xl font-semibold text-gn-ink">C&apos;est noté, {done.firstName} !</p>
      {date && service && (
        <p className="mt-2 text-sm text-gn-ink/80">
          Nous vous attendons le <strong>{formatVisitDayWithYear(date)}</strong> à <strong>{service.time}</strong>
          {' '}({service.label}).
        </p>
      )}
      <p className="mx-auto mt-3 max-w-measure text-sm leading-relaxed text-gn-ink/80">
        Quelqu&apos;un de l&apos;équipe d&apos;accueil vous attendra à votre arrivée.
        {done.children > 0 && ' Nous avons noté vos enfants : l’équipe vous orientera sur place.'}
      </p>
      <p className="mx-auto mt-3 max-w-measure text-sm text-gn-ink/70">{church.address}.</p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] items-center rounded-full bg-gn-black px-6 text-xs font-bold uppercase tracking-wide text-gn-cream transition-opacity hover:opacity-90"
        >
          Itinéraire
        </a>
        {start && service && (
          <a
            href={googleCalendarUrl({
              title: `${church.name} : ${service.label}`,
              eventDate: start,
              location: `${church.address}, ${church.city}`
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center rounded-full border border-gn-ink/25 px-6 text-xs font-semibold uppercase tracking-wide text-gn-ink transition-colors hover:border-gn-ink/50"
          >
            Ajouter à mon agenda
          </a>
        )}
      </div>
      {ics && (
        <a
          href={`data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`}
          download="visite-gospel-nation.ics"
          className="mt-1 inline-flex min-h-[44px] items-center text-xs text-gn-muted-strong underline-offset-2 hover:underline"
        >
          Agenda de l&apos;iPhone ou Outlook (.ics)
        </a>
      )}
    </div>
  );
}
