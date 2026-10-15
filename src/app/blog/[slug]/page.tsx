import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHero from '@/components/PageHero';
import { prisma } from '@/lib/prisma';
import Reveal from '@/components/Reveal';
import ShareButtons from '@/components/ShareButtons';
import { SITE_URL } from '@/lib/site';

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
        <Reveal className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          {post.coverImageUrl && (
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              width={768}
              height={432}
              sizes="(max-width: 768px) 100vw, 768px"
              className="mb-10 w-full rounded-lg object-cover object-top shadow-sm"
            />
          )}
          <p className="whitespace-pre-line text-gn-ink/85">{post.content}</p>

          {post.documentUrl && (
            <a
              href={post.documentUrl}
              download
              className="mt-8 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-gn-gold px-5 text-xs font-bold uppercase tracking-wide text-gn-black transition-opacity hover:opacity-90"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M12 3v12" />
                <path d="m7 10 5 5 5-5" />
                <path d="M5 21h14" />
              </svg>
              Télécharger le PDF
            </a>
          )}

          <div className="mt-10 border-t border-gn-line pt-8">
            <p className="mb-3 text-sm font-semibold text-gn-ink">Partager cet article</p>
            <ShareButtons title={post.title} path={`/blog/${post.slug}`} fallbackUrl={`${SITE_URL}/blog/${post.slug}`} tone="light" />
          </div>

          <div>
            <Link href="/blog" className="mt-10 inline-flex min-h-[44px] items-center text-sm text-gn-gold-dark hover:underline">
              ← Retour à la Bibliothèque
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
