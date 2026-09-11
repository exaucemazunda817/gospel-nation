import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import PlaceholderNote from '@/components/PlaceholderNote';
import Reveal from '@/components/Reveal';
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

      <div className="gn-section-light">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          {methods.length === 0 ? (
            <PlaceholderNote>{donsPlaceholder}</PlaceholderNote>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {methods.map((method, index) => (
                <Reveal key={method.id} delay={index * 0.08}>
                  <div className="gn-card-lift rounded-2xl border-t-4 border-gn-gold bg-white p-6 shadow-sm">
                    <h2 className="font-bold text-gn-ink">{method.label}</h2>
                    <p className="mt-2 text-sm text-gn-ink/70">{method.accountName}</p>
                    <p className="mt-1 text-lg font-semibold text-gn-gold-dark">{method.accountValue}</p>
                    {method.instructions && (
                      <p className="mt-2 text-xs text-gn-ink/50">{method.instructions}</p>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
