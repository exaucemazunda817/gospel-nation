import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import EmptyState from '@/components/EmptyState';
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
      <section className="relative h-[220px] overflow-hidden border-b border-gn-gold/20 bg-gn-black sm:h-[260px]">
        <Image src="/hero/blog.jpg" alt="" fill className="gn-kenburns object-cover object-top" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gn-black/85 via-gn-black/55 to-gn-black/30 sm:bg-gradient-to-r sm:from-gn-black/85 sm:via-gn-black/50 sm:to-gn-black/20" />
        <div className="gn-glow pointer-events-none absolute inset-0" />
        <Reveal className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-5 sm:px-10">
          <p className="mb-1 text-xs text-gn-cream/80">
            <Link href="/" className="inline-flex min-h-[44px] items-center hover:text-gn-gold">Accueil</Link> / <span className="text-gn-gold-light">Bibliothèque</span>
          </p>
          <h1 className="font-serif text-3xl font-bold text-gn-cream sm:text-hero">Bibliothèque</h1>
          <p className="mt-3.5 max-w-md text-sm text-gn-cream/90">
            Manuels, revues et enseignements de Gospel Nation à télécharger.
          </p>
        </Reveal>
      </section>

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
