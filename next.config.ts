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
  images: {
    // Miniatures des prédications : hébergées par YouTube, à autoriser
    // explicitement pour qu'elles passent par l'optimisation d'images de Next.
    remotePatterns: [{ protocol: 'https', hostname: 'img.youtube.com' }]
  }
};

export default nextConfig;
