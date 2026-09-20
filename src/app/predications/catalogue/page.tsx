import type { Metadata } from 'next';
import { Suspense } from 'react';
import PlaceholderNote from '@/components/PlaceholderNote';
import PredicationsHero from '@/components/PredicationsHero';
import Skeleton from '@/components/Skeleton';
import { prisma } from '@/lib/prisma';
import { predicationsPlaceholder } from '@/lib/content';
import { toSummary } from '@/lib/sermons';
import SermonCatalogue from './SermonCatalogue';

// Régénérée au plus toutes les 60 s : sinon figée au build ; ménage aussi la base Neon.
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Catalogue des prédications',
  description:
    'Toutes les prédications de Gospel Nation : recherchez par titre ou prédicateur, ou parcourez-les par thème.'
};

function CatalogueSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-2/3" />
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-[88px] w-full" />
        ))}
      </div>
    </div>
  );
}

async function Catalogue() {
  const sermons = await prisma.sermon.findMany({ orderBy: { date: 'desc' } });
  if (sermons.length === 0) return <PlaceholderNote>{predicationsPlaceholder}</PlaceholderNote>;
  return <SermonCatalogue sermons={sermons.map(toSummary)} />;
}

export default function CataloguePage() {
  return (
    <div className="bg-gn-cream-bg">
      <PredicationsHero
        title="Catalogue des prédications"
        subtitle="Recherchez un message ou parcourez-les par thème."
        crumb={{ label: 'Catalogue', parent: true }}
      />
      <div className="mx-auto max-w-4xl px-5 py-12 sm:px-10 sm:py-16">
        <Suspense fallback={<CatalogueSkeleton />}>
          <Catalogue />
        </Suspense>
      </div>
    </div>
  );
}
