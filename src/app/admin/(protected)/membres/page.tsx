import { prisma } from '@/lib/prisma';

export default async function AdminMembersPage() {
  const members = await prisma.user.findMany({
    where: { role: 'MEMBER' },
    orderBy: { createdAt: 'desc' },
    include: { department: { select: { name: true } } }
  });

  if (members.length === 0) {
    return <p className="text-gn-cream/60">Aucune inscription pour le moment.</p>;
  }

  return (
    <div className="space-y-4">
      {members.map((m) => (
        <div key={m.id} className="rounded-2xl border border-gn-cream/15 bg-gn-black-soft p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              {m.photoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/api/admin/membres/${m.id}/photo`}
                  alt={`${m.firstName} ${m.lastName}`}
                  className="h-16 w-16 rounded-xl object-cover"
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
