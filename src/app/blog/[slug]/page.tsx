import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHero from '@/components/PageHero';
import { prisma } from '@/lib/prisma';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  return { title: post?.title ?? 'Article' };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });

  if (!post || !post.publishedAt) notFound();

  return (
    <div>
      <PageHero
        eyebrow={post.category ?? 'Gospel News'}
        title={post.title}
        subtitle={new Date(post.publishedAt).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })}
      />

      <div className="gn-section-light">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <p className="whitespace-pre-line text-gn-ink/85">{post.content}</p>
          <Link href="/blog" className="mt-10 inline-block text-sm text-gn-gold-dark hover:underline">
            ← Retour à Gospel News
          </Link>
        </div>
      </div>
    </div>
  );
}
