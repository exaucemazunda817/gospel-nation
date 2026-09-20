import type { Metadata } from 'next';
import { Suspense } from 'react';
import PlaceholderNote from '@/components/PlaceholderNote';
import PredicationsHero from '@/components/PredicationsHero';
import SermonView from '@/components/SermonView';
import Skeleton from '@/components/Skeleton';
import { prisma } from '@/lib/prisma';
import { predicationsPlaceholder } from '@/lib/content';

// Régénérée au plus toutes les 60 s : sinon figée au build ; ménage aussi la base Neon.
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Prédications',
  description:
    'Réécoutez les messages prêchés à Gospel Nation : la dernière prédication, des suggestions et le catalogue complet.'
};

function SermonSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-10 sm:py-16">
      <Skeleton className="aspect-video w-full" />
      <Skeleton className="mt-8 h-8 w-3/4" />
      <Skeleton className="mt-4 h-4 w-1/3" />
    </div>
  );
}

// Sans prédication précisée (menu, bouton « Nos prédications »), on met la plus
// récente en avant.
async function LatestSermon() {
  const all = await prisma.sermon.findMany({ orderBy: { date: 'desc' } });
  if (all.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-20">
        <PlaceholderNote>{predicationsPlaceholder}</PlaceholderNote>
      </div>
    );
  }
  return <SermonView featured={all[0]} all={all} />;
}

export default function PredicationsPage() {
  return (
    <div className="bg-gn-cream-bg">
      <PredicationsHero
        title="Prédications"
        subtitle="Réécoutez les messages prêchés à Gospel Nation."
        crumb={{ label: 'Prédications' }}
      />
      <Suspense fallback={<SermonSkeleton />}>
        <LatestSermon />
      </Suspense>
    </div>
  );
}
