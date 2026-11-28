import type { MetadataRoute } from 'next';

// Même repli que dans layout.tsx (variable vide sur Vercel = '' et non undefined).
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Espace admin, comptes membres et routes techniques : rien à indexer,
      // et les cartes de membre contiennent des données personnelles.
      disallow: ['/admin', '/api/', '/compte', '/connexion']
    },
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
