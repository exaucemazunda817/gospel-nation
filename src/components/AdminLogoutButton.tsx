"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch("/api/session/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="rounded-full border border-gn-ink/20 px-4 py-2 text-sm font-medium text-gn-ink/70 transition-colors hover:border-gn-ink/40 hover:text-gn-ink disabled:opacity-60"
    >
      Déconnexion
    </button>
  );
}
