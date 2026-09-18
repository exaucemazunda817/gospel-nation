"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/session/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Erreur de connexion.");
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Impossible de se connecter — vérifiez votre connexion.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium text-gn-ink/80">Mot de passe</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoFocus
          className="w-full rounded-lg border border-black/15 bg-white px-4 py-2.5 text-gn-ink shadow-sm transition-colors focus:border-gn-gold focus:outline-none focus:ring-2 focus:ring-gn-gold/30"
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-gn-gold-dark px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
