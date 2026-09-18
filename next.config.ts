import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Miniatures des prédications : hébergées par YouTube, à autoriser
    // explicitement pour qu'elles passent par l'optimisation d'images de Next.
    remotePatterns: [{ protocol: 'https', hostname: 'img.youtube.com' }]
  }
};

export default nextConfig;
