import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import PlaceholderNote from '@/components/PlaceholderNote';
import { prisma } from '@/lib/prisma';
import { donsPlaceholder } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Dons'
};

export default async function DonsPage() {
  const methods = await prisma.donationMethod.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' }
  });

  return (
    <div>
      <PageHero
        eyebrow="Semer avec un cœur généreux"
        title="Faire un don"
        subtitle="Vos dons soutiennent la vie de l'église et nos œuvres sociales, dont le ministère One Love auprès des enfants de la rue."
      />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {methods.length === 0 ? (
          <PlaceholderNote>{donsPlaceholder}</PlaceholderNote>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {methods.map((method) => (
              <div key={method.id} className="rounded-2xl border-t-4 border-gn-gold bg-gn-black-soft p-6">
                <h2 className="font-bold text-gn-cream">{method.label}</h2>
                <p className="mt-2 text-sm text-gn-cream/70">{method.accountName}</p>
                <p className="mt-1 text-lg font-semibold text-gn-gold">{method.accountValue}</p>
                {method.instructions && (
                  <p className="mt-2 text-xs text-gn-cream/50">{method.instructions}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
