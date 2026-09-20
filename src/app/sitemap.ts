import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

// Même repli que dans layout.tsx : une variable créée mais vide sur Vercel
// vaut '' et non undefined, donc `||` et pas `??`.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Recalculé au plus une fois par heure : la liste dépend de la base.
export const revalidate = 3600;

// Pages publiques figées. L'espace admin, les comptes et les routes d'API en
// sont volontairement absents (voir aussi robots.ts).
const STATIC_PATHS: { path: string; priority: number }[] = [
  { path: '', priority: 1 },
  { path: '/eglise', priority: 0.8 },
  { path: '/departements', priority: 0.8 },
  { path: '/predications', priority: 0.8 },
  { path: '/predications/catalogue', priority: 0.7 },
  { path: '/evenements', priority: 0.8 },
  { path: '/blog', priority: 0.7 },
  { path: '/temoignages', priority: 0.6 },
  { path: '/services', priority: 0.6 },
  { path: '/dons', priority: 0.6 },
  { path: '/rendez-vous', priority: 0.6 },
  { path: '/contact', priority: 0.6 },
  { path: '/inscription', priority: 0.7 },
  { path: '/bible', priority: 0.5 }
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Mêmes filtres que les pages publiques : seuls les articles publiés y
  // figurent, sinon Google se verrait proposer des pages introuvables.
  //
  // La base Neon gratuite se rendort en quelques secondes : si elle ne répond
  // pas quand Vercel construit le site (erreur P1001), le plan du site ne doit
  // pas faire échouer tout le déploiement. On se rabat alors sur les seules
  // pages fixes, et la page est régénérée à l'heure suivante (revalidate).
  let departments: { slug: string; updatedAt: Date }[] = [];
  let posts: { slug: string; publishedAt: Date | null }[] = [];
  let sermons: { id: string; updatedAt: Date }[] = [];
  try {
    [departments, posts, sermons] = await Promise.all([
      prisma.department.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.blogPost.findMany({
        where: { publishedAt: { not: null } },
        select: { slug: true, publishedAt: true }
      }),
      prisma.sermon.findMany({ select: { id: true, updatedAt: true } })
    ]);
  } catch (error) {
    console.error('Sitemap : base injoignable, pages fixes uniquement', error);
  }

  return [
    ...STATIC_PATHS.map(({ path, priority }) => ({
      url: `${siteUrl}${path}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority
    })),
    ...departments.map((department) => ({
      url: `${siteUrl}/departements/${department.slug}`,
      lastModified: department.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7
    })),
    ...sermons.map((sermon) => ({
      url: `${siteUrl}/predications/${sermon.id}`,
      lastModified: sermon.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6
    })),
    ...posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.publishedAt ?? now,
      changeFrequency: 'monthly' as const,
      priority: 0.6
    }))
  ];
}
