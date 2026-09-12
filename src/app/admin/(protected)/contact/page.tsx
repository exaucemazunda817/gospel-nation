import { prisma } from '@/lib/prisma';
import ContactMessageActions from '@/components/admin/ContactMessageActions';

export default async function AdminContactPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: [{ isRead: 'asc' }, { createdAt: 'desc' }]
  });

  if (messages.length === 0) {
    return <p className="text-gn-cream/60">Aucun message reçu pour le moment.</p>;
  }

  return (
    <div className="space-y-4">
      {messages.map((m) => (
        <div key={m.id} className="rounded-2xl border border-gn-cream/15 bg-gn-black-soft p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-semibold text-gn-cream">{m.name}</p>
            <p className="text-xs text-gn-cream/50">{m.createdAt.toLocaleString('fr-FR')}</p>
          </div>
          <p className="mt-1 text-sm text-gn-cream/60">
            {m.email}
            {m.subject ? ` · ${m.subject}` : ''}
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm text-gn-cream/80">{m.message}</p>
          <div className="mt-4">
            <ContactMessageActions id={m.id} isRead={m.isRead} />
          </div>
        </div>
      ))}
    </div>
  );
}
