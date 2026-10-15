"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const INPUT =
  "min-h-[44px] w-full rounded-lg border border-white/15 bg-gn-field px-4 py-2.5 text-gn-cream placeholder:text-gn-cream/40 focus:border-gn-gold focus:outline-none focus:ring-2 focus:ring-gn-gold/30";
const LABEL = "mb-1.5 block text-sm font-medium text-gn-cream/80";

export default function AnnouncementForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitting(true);
    setError(null);
    setDone(false);
    try {
      const res = await fetch("/api/admin/communiques", { method: "POST", body: new FormData(form) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }
      form.reset();
      setDone(true);
      router.refresh();
    } catch {
      setError("Impossible d'envoyer : vérifiez la connexion.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-gn-cream/15 bg-gn-black-soft p-5">
      <h2 className="font-serif text-lg font-semibold text-gn-cream">Nouveau communiqué</h2>
      <div>
        <label className={LABEL} htmlFor="c-title">Titre</label>
        <input id="c-title" name="title" required maxLength={120} className={INPUT} placeholder="Ex. Réunion des responsables ce samedi" />
      </div>
      <div>
        <label className={LABEL} htmlFor="c-body">Texte (facultatif si vous ajoutez une affiche)</label>
        <textarea id="c-body" name="body" rows={4} maxLength={2000} className={INPUT} />
      </div>
      <div>
        <label className={LABEL} htmlFor="c-image">Affiche (image JPG, PNG ou WebP, 6 Mo au plus)</label>
        <input id="c-image" name="image" type="file" accept="image/jpeg,image/png,image/webp" className="block w-full text-sm text-gn-cream/80 file:mr-3 file:rounded-full file:border-0 file:bg-gn-gold file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gn-black" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor="c-kind">Type</label>
          <select id="c-kind" name="kind" className={INPUT} defaultValue="COMMUNIQUE">
            <option value="COMMUNIQUE">Communiqué</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
        <div>
          <label className={LABEL} htmlFor="c-expires">Afficher jusqu&apos;au (facultatif)</label>
          <input id="c-expires" name="expiresAt" type="date" className={INPUT} />
        </div>
      </div>
      <label className="flex min-h-[44px] items-center gap-3 text-sm text-gn-cream/80">
        <input type="checkbox" name="pinned" className="h-5 w-5 accent-[var(--gn-gold)]" />
        Épingler en haut de la valve
      </label>
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      {done && <p role="status" className="text-sm font-medium text-emerald-400">Communiqué publié sur la page d&apos;accueil.</p>}
      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-gn-gold px-6 py-3 text-sm font-bold text-gn-black transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {submitting ? "Publication…" : "Publier"}
      </button>
    </form>
  );
}
