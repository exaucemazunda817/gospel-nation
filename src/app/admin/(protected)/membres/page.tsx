import { prisma } from '@/lib/prisma';

export default async function AdminMembersPage() {
  const members = await prisma.user.findMany({
    where: { role: 'MEMBER' },
    orderBy: { createdAt: 'desc' },
    include: { department: { select: { name: true } } }
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-gn-cream/50">
          {members.length} membre{members.length > 1 ? 's' : ''}
        </p>
        <a
          href="/api/admin/membres/export"
          className="inline-flex items-center gap-2 rounded-full bg-gn-gold px-5 py-2.5 text-sm font-semibold text-gn-black transition-colors hover:bg-gn-gold-dark"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="M12 3v12" />
            <path d="m7 10 5 5 5-5" />
            <path d="M5 21h14" />
          </svg>
          Télécharger en Excel
        </a>
      </div>

      {members.length === 0 && <p className="text-gn-cream/60">Aucune inscription pour le moment.</p>}

      {members.map((m) => (
        <div key={m.id} className="rounded-2xl border border-gn-cream/15 bg-gn-black-soft p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              {m.photoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/api/admin/membres/${m.id}/photo`}
                  alt={`${m.firstName} ${m.lastName}`}
                  className="h-16 w-16 rounded-lg object-cover"
                />
              )}
              <div>
                <p className="font-semibold text-gn-cream">
                  {m.firstName} {m.lastName}
                </p>
                <p className="text-sm text-gn-cream/60">{m.phone}</p>
                <p className="text-sm text-gn-cream/60">{m.email}</p>
                {m.address && <p className="text-sm text-gn-cream/60">{m.address}</p>}
                <p className="text-xs text-gn-cream/50">
                  Membre depuis {m.memberSinceYear ?? m.createdAt.getFullYear()}
                  {m.department && ` · ${m.department.name}`}
                </p>
                <p className="text-xs text-gn-cream/50">
                  Inscrit le {m.createdAt.toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
            <p className="text-sm font-semibold text-gn-gold">{m.memberNumber}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
