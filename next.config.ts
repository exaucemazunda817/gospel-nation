import type { NextConfig } from "next";

// Clerk n'est activé que si les DEUX clés sont présentes au moment de la
// construction. Avec la seule clé publique, clerkMiddleware plante sur chaque
// requête (« Missing secretKey ») et TOUT le site tombe en erreur 500 : c'est
// arrivé le 19/09/2026 quand CLERK_SECRET_KEY était vide sur Vercel. Le drapeau
// est calculé ici, une fois, puis inliné : le serveur et le navigateur voient
// la même valeur (la clé secrète, elle, n'est jamais exposée au navigateur).
const clerkEnabled = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
);

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_CLERK_ENABLED: clerkEnabled ? 'true' : ''
  },
  // En-têtes de sécurité envoyés sur toutes les pages. Pas de Content-Security-
  // Policy pour l'instant : elle demande d'autoriser précisément YouTube,
  // Clerk et Vercel, et une règle trop stricte casserait ces intégrations.
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
          // Politique minimale (audit du 17/10/2026) : interdit les plugins
          // (object), la réécriture de l'adresse de base des liens, et
          // l'affichage du site dans un cadre d'un autre site. Ne touche ni aux
          // scripts ni aux vidéos YouTube, ni à Clerk.
          { key: 'Content-Security-Policy', value: "object-src 'none'; base-uri 'self'; frame-ancestors 'none'" }
        ]
      }
    ];
  },
  images: {
    // Le réglage par défaut proposait jusqu'à 3840 px de large : un cadre de 320 px
    // recevait alors une image géante, fabriquée à la demande (1,3 à 2,4 s chacune).
    // Plafonné à 1920 px : suffisant même pour un grand écran.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    // Miniatures des prédications : hébergées par YouTube, à autoriser
    // explicitement pour qu'elles passent par l'optimisation d'images de Next.
    remotePatterns: [{ protocol: 'https', hostname: 'img.youtube.com' }],
    // Qualités utilisées par les composants (lueurs floues à 30, fond de la valve à 70).
    qualities: [30, 45, 60, 70, 75]
  }
};

export default nextConfig;
