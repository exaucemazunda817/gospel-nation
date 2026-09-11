"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ModerateTestimonyActions({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function moderate(action: "approve" | "reject") {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/temoignages/${id}/${action}`, { method: "POST" });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setError("Échec — réessayez.");
    } finally {
      setLoading(false);
    }
  }

  if (status === "APPROVED") {
    return <p className="text-sm font-medium text-green-700">Publié.</p>;
  }
  if (status === "REJECTED") {
    return <p className="text-sm font-medium text-red-700">Rejeté.</p>;
  }

  return (
    <div className="space-y-2">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => moderate("approve")}
          disabled={loading}
          className="rounded-full bg-gn-gold-dark px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-60"
        >
          Publier
        </button>
        <button
          onClick={() => moderate("reject")}
          disabled={loading}
          className="rounded-full border border-red-600 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-600 hover:text-white disabled:opacity-60"
        >
          Rejeter
        </button>
      </div>
    </div>
  );
}
