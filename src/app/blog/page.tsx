import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import PlaceholderNote from '@/components/PlaceholderNote';
import { prisma } from '@/lib/prisma';
import { blogPlaceholder } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Gospel News'
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: 'desc' }
  });

  return (
    <div>
      <PageHero
        eyebrow="Actualités de l'église"
        title="Gospel News"
        subtitle="Communiqués, réflexions et activités liées à la vie de notre église."
      />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        {posts.length === 0 ? (
          <PlaceholderNote>{blogPlaceholder}</PlaceholderNote>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="block rounded-2xl border border-white/10 bg-gn-black-soft p-6 transition-colors hover:border-gn-gold/50"
              >
                {post.category && (
                  <p className="text-xs uppercase tracking-wide text-gn-gold">{post.category}</p>
                )}
                <h2 className="mt-1 text-lg font-bold text-gn-cream">{post.title}</h2>
                <p className="mt-2 text-sm text-gn-cream/70">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
