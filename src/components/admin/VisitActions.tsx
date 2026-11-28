"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { VISIT_STATUS_LABELS, reminderMessage, thanksMessage, welcomeMessage, whatsappUrl } from "@/lib/visits";

const outline =
  "inline-flex min-h-[44px] items-center rounded-full border border-gn-cream/25 px-4 text-sm font-semibold text-gn-cream/80 transition-colors hover:border-gn-cream/50 disabled:opacity-60";
const solid =
  "inline-flex min-h-[44px] items-center rounded-full bg-gn-gold-dark px-4 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-60";

export default function VisitActions({
  id,
  status,
  phone,
  firstName,
  visitDate,
  note,
  remind,
}: {
  id: string;
  status: string;
  phone: string | null;
  firstName: string;
  visitDate: string;
  note: string | null;
  /** Vrai quand le culte est aujourd'hui ou demain : propose le rappel WhatsApp. */
  remind: boolean;
}) {
  const router = useRouter();
  const [text, setText] = useState(note ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send(body: Record<string, unknown>) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/visites/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Échec : réessayez.");
        return;
      }
      router.refresh();
    } catch {
      setError("Échec : réessayez.");
    } finally {
      setLoading(false);
    }
  }

  async function remove() {
    if (!window.confirm("Supprimer définitivement cette visite et ses coordonnées ?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/visites/${id}`, { method: "DELETE" });
      if (!res.ok) {
        setError("Échec : réessayez.");
        return;
      }
      router.refresh();
    } catch {
      setError("Échec : réessayez.");
    } finally {
      setLoading(false);
    }
  }

  const date = new Date(visitDate);
  const came = status === "ARRIVED" || status === "FOLLOWED_UP" || status === "MEMBER";

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gn-gold">{VISIT_STATUS_LABELS[status] ?? status}</p>
      {error && <p role="alert" className="rounded-md border border-red-400/40 bg-red-950 px-3 py-2 text-sm font-medium text-red-100">{error}</p>}

      <div className="flex flex-wrap gap-2">
        {status !== "ARRIVED" && (
          <button type="button" disabled={loading} onClick={() => send({ status: "ARRIVED" })} className={solid}>
            Venu
          </button>
        )}
        {status !== "NO_SHOW" && (
          <button type="button" disabled={loading} onClick={() => send({ status: "NO_SHOW" })} className={outline}>
            Pas venu
          </button>
        )}
        {came && status !== "FOLLOWED_UP" && status !== "MEMBER" && (
          <button type="button" disabled={loading} onClick={() => send({ status: "FOLLOWED_UP" })} className={outline}>
            Suivi fait
          </button>
        )}
        {came && status !== "MEMBER" && (
          <button type="button" disabled={loading} onClick={() => send({ status: "MEMBER" })} className={outline}>
            Devenu membre
          </button>
        )}
        {status !== "EXPECTED" && (
          <button type="button" disabled={loading} onClick={() => send({ status: "EXPECTED" })} className={outline}>
            Remettre « attendu »
          </button>
        )}
      </div>

      {phone ? (
        <div className="flex flex-wrap gap-2">
          {status === "EXPECTED" && (
            <a
              href={whatsappUrl(phone, welcomeMessage({ firstName, visitDate: date }))}
              target="_blank"
              rel="noopener noreferrer"
              className={outline}
            >
              WhatsApp : mot de bienvenue
            </a>
          )}
          {status === "EXPECTED" && remind && (
            <a
              href={whatsappUrl(phone, reminderMessage({ firstName, visitDate: date }))}
              target="_blank"
              rel="noopener noreferrer"
              className={solid}
            >
              WhatsApp : rappel
            </a>
          )}
          {came && (
            <a
              href={whatsappUrl(phone, thanksMessage({ firstName, visitDate: date }))}
              target="_blank"
              rel="noopener noreferrer"
              className={outline}
            >
              WhatsApp : merci de votre visite
            </a>
          )}
        </div>
      ) : (
        <p className="text-xs text-gn-cream/60">Pas de numéro : aucun message WhatsApp possible.</p>
      )}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        aria-label="Note de l'équipe (privée)"
        placeholder="Note de l'équipe (privée, optionnelle)"
        rows={2}
        maxLength={1000}
        className="w-full rounded-lg border border-gn-cream/20 bg-transparent px-3 py-2 text-sm text-gn-cream placeholder:text-gn-cream/40 focus:border-gn-gold focus:outline-none focus:ring-2 focus:ring-gn-gold/30"
      />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={loading || text.trim() === (note ?? "").trim()}
          onClick={() => send({ note: text })}
          className={outline}
        >
          Enregistrer la note
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={remove}
          className="inline-flex min-h-[44px] items-center rounded-full border border-red-500/70 px-4 text-sm font-semibold text-red-400 transition-colors hover:bg-red-600 hover:text-white disabled:opacity-60"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}
