"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const EMAIL_MESSAGES: Record<string, string> = {
  sent: "E-mail de confirmation envoyé.",
  "already-sent": "E-mail de confirmation déjà envoyé précédemment.",
  "no-address": "Aucun e-mail envoyé : la personne n'a pas donné d'adresse.",
  "not-configured": "Rendez-vous confirmé, mais l'envoi d'e-mails n'est pas encore configuré : aucun e-mail envoyé.",
  failed: "Rendez-vous confirmé, mais l'e-mail n'a pas pu partir. Cliquez à nouveau sur Confirmer pour réessayer.",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmé",
  DECLINED: "Décliné",
  DONE: "Terminé",
};

export default function AppointmentActions({
  id,
  status,
  pastorNote,
}: {
  id: string;
  status: string;
  pastorNote: string | null;
}) {
  const router = useRouter();
  const [note, setNote] = useState(pastorNote ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailInfo, setEmailInfo] = useState<string | null>(null);

  async function updateStatus(nextStatus: string) {
    setLoading(true);
    setError(null);
    setEmailInfo(null);
    try {
      const res = await fetch(`/api/admin/rendez-vous/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus, pastorNote: note }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setEmailInfo(EMAIL_MESSAGES[data.email] ?? null);
      router.refresh();
    } catch {
      setError("Échec — réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gn-gold">{STATUS_LABELS[status] ?? status}</p>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {emailInfo && <p className="text-sm text-gn-cream/80">{emailInfo}</p>}
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Note pastorale (optionnel, visible admin uniquement)"
        rows={2}
        className="w-full rounded-lg border border-gn-cream/20 bg-transparent px-3 py-2 text-sm text-gn-cream placeholder:text-gn-cream/40 focus:border-gn-gold focus:outline-none focus:ring-2 focus:ring-gn-gold/30"
      />
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => updateStatus("CONFIRMED")}
          disabled={loading}
          className="rounded-full bg-gn-gold-dark px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-60"
        >
          Confirmer
        </button>
        <button
          onClick={() => updateStatus("DECLINED")}
          disabled={loading}
          className="rounded-full border border-red-500/70 px-4 py-2 text-sm font-semibold text-red-400 transition-colors hover:bg-red-600 hover:text-white disabled:opacity-60"
        >
          Décliner
        </button>
        <button
          onClick={() => updateStatus("DONE")}
          disabled={loading}
          className="rounded-full border border-gn-cream/25 px-4 py-2 text-sm font-semibold text-gn-cream/80 transition-colors hover:border-gn-cream/50 disabled:opacity-60"
        >
          Marquer fait
        </button>
      </div>
    </div>
  );
}
