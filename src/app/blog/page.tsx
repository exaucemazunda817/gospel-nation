import type { Metadata } from 'next';
import Link from 'next/link';
import PlaceholderNote from '@/components/PlaceholderNote';
import Reveal from '@/components/Reveal';
import { prisma } from '@/lib/prisma';
import { blogPlaceholder } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Bibliothèque'
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: 'desc' }
  });

  return (
    <div className="bg-gn-cream-bg">
      <section className="gn-glow relative h-[220px] overflow-hidden border-b border-gn-gold/20 bg-gn-black sm:h-[260px]">
        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-5 sm:px-10">
          <p className="mb-3.5 text-xs text-gn-muted">
            <Link href="/" className="hover:text-gn-gold">Accueil</Link> / <span className="text-gn-gold">Bibliothèque</span>
          </p>
          <h1 className="font-serif text-3xl font-bold text-gn-cream sm:text-[38px]">Bibliothèque</h1>
          <p className="mt-3.5 max-w-md text-sm text-gn-muted">
            Communiqués, réflexions et actualités de la vie de Gospel Nation.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-20">
        {posts.length === 0 ? (
          <PlaceholderNote>{blogPlaceholder}</PlaceholderNote>
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => {
              const cardImage = post.coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.coverImageUrl}
                  alt={post.title}
                  className="-mx-6 -mt-6 h-[190px] w-[calc(100%+3rem)] rounded-t-lg object-cover object-top"
                />
              ) : (
                <div className="flex h-[42px] w-[42px] items-center justify-center rounded-lg bg-gn-black">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--gn-gold)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21z" />
                    <path d="M4 5.5v15.5" />
                  </svg>
                </div>
              );

              return (
                <Reveal key={post.id} delay={index * 0.06}>
                  {post.documentUrl ? (
                    <div className="flex h-full flex-col gap-3.5 rounded-lg border border-gn-line bg-white p-6">
                      {cardImage}
                      {post.category && (
                        <span className="w-fit rounded-full bg-gn-gold/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-gn-gold-line">
                          {post.category}
                        </span>
                      )}
                      <div>
                        <p className="mb-1.5 font-serif text-base font-semibold text-gn-ink">{post.title}</p>
                        <p className="line-clamp-3 text-[12.5px] leading-relaxed text-gn-ink/60">{post.excerpt}</p>
                      </div>
                      <a
                        href={post.documentUrl}
                        download
                        className="mt-auto flex items-center justify-center gap-2 rounded bg-gn-gold px-4 py-3 text-[12px] font-bold uppercase tracking-wide text-gn-black transition-opacity hover:opacity-90"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                          <path d="M12 3v12" />
                          <path d="m7 10 5 5 5-5" />
                          <path d="M5 21h14" />
                        </svg>
                        Télécharger le PDF
                      </a>
                    </div>
                  ) : (
                    <Link
                      href={`/blog/${post.slug}`}
                      className="gn-card-lift flex h-full flex-col gap-3.5 rounded-lg border border-gn-line bg-white p-6"
                    >
                      {cardImage}
                      {post.category && (
                        <span className="w-fit rounded-full bg-gn-gold/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-gn-gold-line">
                          {post.category}
                        </span>
                      )}
                      <div>
                        <p className="mb-1.5 font-serif text-base font-semibold text-gn-ink">{post.title}</p>
                        <p className="line-clamp-3 text-[12.5px] leading-relaxed text-gn-ink/60">{post.excerpt}</p>
                      </div>
                      <span className="mt-auto border-t border-gn-line pt-3.5 text-[11.5px] text-gn-muted">
                        {post.publishedAt &&
                          new Date(post.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </Link>
                  )}
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
