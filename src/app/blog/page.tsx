import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PlaceholderNote from '@/components/PlaceholderNote';
import Reveal from '@/components/Reveal';
import { prisma } from '@/lib/prisma';
import { blogPlaceholder } from '@/lib/content';

// Régénérée au plus toutes les 60 s : sinon figée au build ; ménage aussi la base Neon.
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Bibliothèque',
  description:
    'Revues Gospel News, manuels de l\'École Nation Classe et ressources de l\'église à télécharger en PDF.'
};

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
            Communiqués, réflexions et actualités de la vie de Gospel Nation.
          </p>
        </Reveal>
      </section>

      <Reveal className="mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-20">
        {posts.length === 0 ? (
          <PlaceholderNote>{blogPlaceholder}</PlaceholderNote>
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => {
              const cardImage = post.coverImageUrl ? (
                <Image
                  src={post.coverImageUrl}
                  alt={post.title}
                  width={420}
                  height={190}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
                        <span className="w-fit rounded-full bg-gn-gold/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-gn-gold-line">
                          {post.category}
                        </span>
                      )}
                      <div>
                        <p className="mb-1.5 font-serif text-base font-semibold text-gn-ink">{post.title}</p>
                        <p className="line-clamp-3 text-xs leading-relaxed text-gn-ink/60">{post.excerpt}</p>
                      </div>
                      <a
                        href={post.documentUrl}
                        download
                        className="mt-auto flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-gn-gold px-4 py-3 text-xs font-bold uppercase tracking-wide text-gn-black transition-opacity hover:opacity-90"
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
                        <span className="w-fit rounded-full bg-gn-gold/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-gn-gold-line">
                          {post.category}
                        </span>
                      )}
                      <div>
                        <p className="mb-1.5 font-serif text-base font-semibold text-gn-ink">{post.title}</p>
                        <p className="line-clamp-3 text-xs leading-relaxed text-gn-ink/60">{post.excerpt}</p>
                      </div>
                      <span className="mt-auto border-t border-gn-line pt-3.5 text-xs text-gn-muted-strong">
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
      </Reveal>
    </div>
  );
}
