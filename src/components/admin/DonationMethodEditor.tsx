"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const INPUT =
  "min-h-[44px] w-full rounded-lg border border-white/15 bg-gn-field px-4 py-2.5 text-gn-cream placeholder:text-gn-cream/40 focus:border-gn-gold focus:outline-none focus:ring-2 focus:ring-gn-gold/30";
const LABEL = "mb-1.5 block text-sm font-medium text-gn-cream/80";

type Method = { id?: string; label: string; accountName: string; accountValue: string; instructions: string; isActive: boolean };

// Un même formulaire pour créer un moyen de don (sans id) ou modifier un moyen existant.
export default function DonationMethodEditor({ method }: { method?: Method }) {
  const router = useRouter();
  const [values, setValues] = useState<Method>(
    method ?? { label: "", accountName: "", accountValue: "", instructions: "", isActive: true }
  );
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const set = (patch: Partial<Method>) => setValues((v) => ({ ...v, ...patch }));

  async function send(init: RequestInit & { url: string }, after?: () => void) {
    setBusy(true);
    setMessage(null);
    try {
      const { url, ...rest } = init;
      const res = await fetch(url, rest);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ ok: false, text: data.error ?? "Une erreur est survenue." });
        return;
      }
      setMessage({ ok: true, text: method ? "Enregistré." : "Moyen de don ajouté." });
      after?.();
      router.refresh();
    } catch {
      setMessage({ ok: false, text: "Impossible d'envoyer : vérifiez la connexion." });
    } finally {
      setBusy(false);
    }
  }

  const body = JSON.stringify(values);
  const idPrefix = method?.id ?? "nouveau";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (method?.id) send({ url: `/api/admin/dons/${method.id}`, method: "PATCH", headers: { "Content-Type": "application/json" }, body });
        else
          send({ url: "/api/admin/dons", method: "POST", headers: { "Content-Type": "application/json" }, body }, () =>
            setValues({ label: "", accountName: "", accountValue: "", instructions: "", isActive: true })
          );
      }}
      className="space-y-4 rounded-2xl border border-gn-cream/15 bg-gn-black-soft p-5"
    >
      <h2 className="font-serif text-lg font-semibold text-gn-cream">{method ? method.label || "Moyen de don" : "Nouveau moyen de don"}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor={`${idPrefix}-label`}>Nom (ex. Airtel Money)</label>
          <input id={`${idPrefix}-label`} value={values.label} onChange={(e) => set({ label: e.target.value })} required maxLength={60} className={INPUT} />
        </div>
        <div>
          <label className={LABEL} htmlFor={`${idPrefix}-name`}>Titulaire du compte</label>
          <input id={`${idPrefix}-name`} value={values.accountName} onChange={(e) => set({ accountName: e.target.value })} required maxLength={100} className={INPUT} />
        </div>
      </div>
      <div>
        <label className={LABEL} htmlFor={`${idPrefix}-value`}>Numéro de téléphone ou de compte</label>
        <input id={`${idPrefix}-value`} value={values.accountValue} onChange={(e) => set({ accountValue: e.target.value })} required maxLength={100} className={INPUT} />
      </div>
      <div>
        <label className={LABEL} htmlFor={`${idPrefix}-instr`}>Instructions (facultatif)</label>
        <textarea id={`${idPrefix}-instr`} value={values.instructions} onChange={(e) => set({ instructions: e.target.value })} rows={3} maxLength={500} className={INPUT} />
      </div>
      <label className="flex min-h-[44px] items-center gap-3 text-sm text-gn-cream/80">
        <input type="checkbox" checked={values.isActive} onChange={(e) => set({ isActive: e.target.checked })} className="h-5 w-5 accent-[var(--gn-gold)]" />
        Afficher ce moyen sur la page Dons
      </label>
      {message && (
        <p role={message.ok ? "status" : "alert"} className={`text-sm ${message.ok ? "font-medium text-emerald-400" : "text-red-400"}`}>
          {message.text}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={busy} className="rounded-full bg-gn-gold px-6 py-3 text-sm font-bold text-gn-black transition-opacity hover:opacity-90 disabled:opacity-60">
          {busy ? "Envoi…" : method ? "Enregistrer" : "Ajouter"}
        </button>
        {method?.id && (
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              if (window.confirm("Supprimer ce moyen de don ? Cette action est définitive.")) send({ url: `/api/admin/dons/${method.id}`, method: "DELETE" });
            }}
            className="rounded-full border border-red-500/70 px-5 py-3 text-sm font-semibold text-red-400 transition-colors hover:bg-red-600 hover:text-white disabled:opacity-60"
          >
            Supprimer
          </button>
        )}
      </div>
    </form>
  );
}
