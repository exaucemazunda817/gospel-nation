import { prisma } from '@/lib/prisma';
import ModerateOfferActions from '@/components/admin/ModerateOfferActions';
import { isAdmin } from '@/lib/admin-auth';
import { redirect } from 'next/navigation';

const SOURCE_LABEL = { NOTION: 'Notion', DRIVE: 'Document Drive', ADMIN: 'Saisie admin' } as const;

export default async function AdminJobsPage() {
  if (!(await isAdmin())) redirect('/admin/login');
  const offers = await prisma.jobOffer.findMany({
    include: { _count: { select: { applications: true } } },
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }]
  });

  if (offers.length === 0) {
    return <p className="text-gn-cream/60">Aucune offre d’emploi pour le moment.</p>;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gn-cream/60">
        Les offres venant du document Drive attendent ici votre validation. Une offre Notion est publiée d’office.
      </p>
      {offers.map((o) => (
        <div key={o.id} className="rounded-2xl border border-gn-cream/15 bg-gn-black-soft p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-semibold text-gn-cream">{o.title}</p>
            <p className="text-xs text-gn-cream/50">{o.createdAt.toLocaleString('fr-FR')}</p>
          </div>
          <p className="mt-1 text-sm text-gn-cream/60">
            {[o.employer, o.location, o.contractType].filter(Boolean).join(' · ') || 'Employeur non précisé'}
            {` · ${SOURCE_LABEL[o.source]} · ${o._count.applications} candidature(s)`}
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm text-gn-cream/80">{o.description}</p>
          {o.requirements && <p className="mt-2 whitespace-pre-wrap text-sm text-gn-cream/70">Demande : {o.requirements}</p>}
          <p className="mt-2 text-xs text-gn-cream/60">
            {[o.contactPhone, o.contactEmail, o.externalUrl].filter(Boolean).join(' · ') || 'Aucun contact indiqué'}
          </p>
          <div className="mt-4">
            <ModerateOfferActions id={o.id} status={o.status} endpoint="/api/admin/emplois" />
          </div>
        </div>
      ))}
    </div>
  );
}
