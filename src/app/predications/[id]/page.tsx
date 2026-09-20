import type { Metadata } from 'next';
import { cache, Suspense } from 'react';
import { notFound } from 'next/navigation';
import PredicationsHero from '@/components/PredicationsHero';
import SermonView from '@/components/SermonView';
import Skeleton from '@/components/Skeleton';
import { prisma } from '@/lib/prisma';
import { formatSermonDate } from '@/lib/sermons';

// Régénérée au plus toutes les 60 s ; les pages sont créées à la première visite.
export const revalidate = 60;

type PageProps = { params: Promise<{ id: string }> };

// Une seule requête par visite, partagée entre generateMetadata et la page.
const getSermon = cache((id: string) => prisma.sermon.findUnique({ where: { id } }));

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const sermon = await getSermon(id);
  if (!sermon) return { title: 'Prédication introuvable' };
  const description = `${sermon.speaker} · ${formatSermonDate(sermon.date)}. Écoutez ce message prêché à Gospel Nation.`;
  return {
    title: sermon.title,
    description,
    // Aperçu au partage (WhatsApp, Facebook) : la miniature de la vidéo.
    openGraph: {
      title: sermon.title,
      description,
      ...(sermon.coverImageUrl ? { images: [sermon.coverImageUrl] } : {})
    }
  };
}

function SermonSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-10 sm:py-16">
      <Skeleton className="aspect-video w-full" />
      <Skeleton className="mt-8 h-8 w-3/4" />
      <Skeleton className="mt-4 h-4 w-1/3" />
    </div>
  );
}

async function ChosenSermon({ id }: { id: string }) {
  const all = await prisma.sermon.findMany({ orderBy: { date: 'desc' } });
  const featured = all.find((sermon) => sermon.id === id);
  // Cas rare : supprimée entre-temps. La vérification qui compte pour le code
  // HTTP 404 est faite plus haut, avant que la page commence à s'afficher.
  if (!featured) return null;
  return <SermonView featured={featured} all={all} />;
}

export default async function SermonPage({ params }: PageProps) {
  const { id } = await params;
  // Vérifié avant tout affichage : un identifiant inconnu renvoie un vrai 404.
  if (!(await getSermon(id))) notFound();

  return (
    <div className="bg-gn-cream-bg">
      <PredicationsHero
        title="Prédications"
        subtitle="Réécoutez les messages prêchés à Gospel Nation."
        crumb={{ label: 'Écouter', parent: true }}
      />
      <Suspense fallback={<SermonSkeleton />}>
        <ChosenSermon id={id} />
      </Suspense>
    </div>
  );
}
