import type { Metadata } from 'next';
import EmptyState from '@/components/EmptyState';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { prisma } from '@/lib/prisma';
import LibraryGrid from './LibraryGrid';

// Régénérée au plus toutes les 60 s : sinon figée au build ; ménage aussi la base Neon.
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Bibliothèque',
  description:
    'Revues Gospel News, manuels de l\'École Nation Classe et ressources de l\'église à télécharger en PDF.'
};

// « 2,1 Mo », « 109 Ko » : le poids s'affiche sur le bouton, pour qui télécharge
// avec un forfait mobile.
function formatBytes(bytes: number | null): string | null {
  if (!bytes) return null;
  if (bytes < 1_000_000) return `${Math.max(1, Math.round(bytes / 1000))} Ko`;
  return `${(bytes / 1_000_000).toFixed(1).replace('.', ',')} Mo`;
}

// « École Nation Classe — Les Appelés, Module 1 : … » devient « Les Appelés,
// Module 1 : … » (la catégorie est déjà affichée) ; les autres tirets longs
// deviennent deux-points.
function displayTitle(title: string, category: string | null): string {
  const withoutCategory = category && title.startsWith(`${category} — `) ? title.slice(category.length + 3) : title;
  return withoutCategory.replace(/ — /g, ' : ');
}

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: 'desc' }
  });

  return (
    <div className="bg-gn-cream-bg">
      <PageHero
        crumbs={[{ label: "Bibliothèque" }]}
        title="Bibliothèque"
        subtitle="Manuels, revues et enseignements de Gospel Nation à télécharger."
        image="/hero/bibliotheque.jpg"
        imagePosition="50% 50%"
      />

      <Reveal className="mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-20">
        {posts.length === 0 ? (
          <EmptyState title="Aucun article pour le moment" text="Les communiqués, réflexions et supports de l'église seront publiés ici." />
        ) : (
          <LibraryGrid
            items={posts.map((post) => ({
              id: post.id,
              slug: post.slug,
              title: displayTitle(post.title, post.category),
              excerpt: post.excerpt,
              category: post.category,
              cover: post.coverImageUrl,
              documentUrl: post.documentUrl,
              size: formatBytes(post.documentBytes),
              date: post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Kinshasa' })
                : null
            }))}
          />
        )}
      </Reveal>
    </div>
  );
}
