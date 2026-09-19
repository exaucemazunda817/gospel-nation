"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const BUTTON_PRIMARY =
  "rounded-full bg-gn-gold-dark px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-60";
const BUTTON_DANGER =
  "rounded-full border border-red-500/70 px-4 py-2 text-sm font-semibold text-red-400 transition-colors hover:bg-red-600 hover:text-white disabled:opacity-60";

export default function ModerateOfferActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function moderate(next: "APPROVED" | "REJECTED") {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/offres/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setError("Échec — réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      {status === "APPROVED" && <p className="text-sm font-medium text-emerald-400">Publiée.</p>}
      {status === "REJECTED" && <p className="text-sm font-medium text-red-400">Rejetée.</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex flex-wrap gap-3">
        {status !== "APPROVED" && (
          <button onClick={() => moderate("APPROVED")} disabled={loading} className={BUTTON_PRIMARY}>
            {status === "REJECTED" ? "Republier" : "Publier"}
          </button>
        )}
        {status !== "REJECTED" && (
          <button onClick={() => moderate("REJECTED")} disabled={loading} className={BUTTON_DANGER}>
            {status === "APPROVED" ? "Retirer" : "Rejeter"}
          </button>
        )}
      </div>
    </div>
  );
}
