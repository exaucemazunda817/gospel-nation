'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ContactMessageActions({ id, isRead }: { id: string; isRead: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function markRead() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/contact/${id}/read`, { method: 'POST' });
      if (!res.ok) throw new Error();
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (isRead) {
    return <p className="text-sm font-medium text-gn-cream/40">Lu.</p>;
  }

  return (
    <button
      onClick={markRead}
      disabled={loading}
      className="rounded-full bg-gn-gold-dark px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-60"
    >
      Marquer comme lu
    </button>
  );
}
