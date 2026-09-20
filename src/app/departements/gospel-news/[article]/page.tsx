import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHero from '@/components/PageHero';
import { ArticleContent } from '@/components/GospelNewsArticles';
import { articleThumbnail, getArticle, gospelNewsArticles } from '@/lib/gospel-news';

type PageProps = { params: Promise<{ article: string }> };

export function generateStaticParams() {
  return gospelNewsArticles.map((article) => ({ article: article.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { article: slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    openGraph: { title: article.title, images: [articleThumbnail(article)] }
  };
}

export default async function GospelNewsArticlePage({ params }: PageProps) {
  const { article: slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <div className="bg-gn-cream-bg">
      <PageHero eyebrow="Gospel News" title={article.title} />
      <ArticleContent article={article} />
      <div className="mx-auto max-w-3xl px-5 pb-12 sm:px-6">
        <Link href="/departements/gospel-news" className="inline-flex min-h-[44px] items-center text-sm text-gn-gold-line hover:underline">
          ← Tous les articles
        </Link>
      </div>
    </div>
  );
}
