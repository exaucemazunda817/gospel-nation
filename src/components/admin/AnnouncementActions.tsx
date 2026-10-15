"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AnnouncementActions({ id, pinned }: { id: string; pinned: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function call(init: RequestInit) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/communiques/${id}`, init);
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setError("Échec : réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex flex-wrap gap-3">
        <button
          disabled={loading}
          onClick={() =>
            call({ method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pinned: !pinned }) })
          }
          className="rounded-full border border-gn-cream/30 px-4 py-2 text-sm font-semibold text-gn-cream transition-colors hover:border-gn-gold hover:text-gn-gold disabled:opacity-60"
        >
          {pinned ? "Désépingler" : "Épingler"}
        </button>
        <button
          disabled={loading}
          onClick={() => {
            if (window.confirm("Retirer ce communiqué de la page d'accueil ? Cette action est définitive.")) call({ method: "DELETE" });
          }}
          className="rounded-full border border-red-500/70 px-4 py-2 text-sm font-semibold text-red-400 transition-colors hover:bg-red-600 hover:text-white disabled:opacity-60"
        >
          Retirer
        </button>
      </div>
    </div>
  );
}
