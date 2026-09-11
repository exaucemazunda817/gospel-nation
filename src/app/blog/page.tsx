import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import PlaceholderNote from '@/components/PlaceholderNote';
import Reveal from '@/components/Reveal';
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

      <div className="gn-section-light">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          {posts.length === 0 ? (
            <PlaceholderNote>{blogPlaceholder}</PlaceholderNote>
          ) : (
            <div className="space-y-6">
              {posts.map((post, index) => (
                <Reveal key={post.id} delay={index * 0.08}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="gn-card-lift block rounded-2xl border border-gn-ink/10 bg-white p-6"
                  >
                    {post.category && (
                      <p className="text-xs uppercase tracking-wide text-gn-gold-dark">{post.category}</p>
                    )}
                    <h2 className="mt-1 text-lg font-bold text-gn-ink">{post.title}</h2>
                    <p className="mt-2 text-sm text-gn-ink/70">{post.excerpt}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
