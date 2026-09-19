import type { Metadata, Viewport } from 'next';
import { Montserrat, Playfair_Display } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { frFR } from '@clerk/localizations';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import { church } from '@/lib/content';
import { isClerkConfigured } from '@/lib/clerk-configured';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['500', '600', '700', '800']
});

const description = `${church.name} — ${church.tagline}. Cultes, prédications, départements et vie de notre église à Kinshasa.`;

// metadataBase rend absolue l'URL de l'image d'aperçu (opengraph-image.jpg).
// Sans elle, aucun aperçu ne s'affiche quand le lien est partagé sur WhatsApp
// ou Facebook. À définir sur l'hébergeur une fois le domaine choisi.
// `||` et non `??` : une variable Vercel créée mais laissée vide vaut ''
// (chaîne vide), pas undefined — `??` ne l'aurait pas remplacée et
// `new URL('')` fait planter le build (piège déjà rencontré sur d'autres
// projets : une variable d'environnement créée vide sur Vercel).
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${church.name} — ${church.tagline}`,
    template: `%s — ${church.name}`
  },
  description,
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: church.name,
    title: `${church.name} — ${church.tagline}`,
    description
  },
  twitter: {
    card: 'summary_large_image',
    title: `${church.name} — ${church.tagline}`,
    description
  }
};

// viewportFit: 'cover' est nécessaire pour que env(safe-area-inset-top)
// renvoie une vraie valeur sur iPhone (encoche/Dynamic Island) — sans ça,
// le header sticky (voir Header.tsx) peut se retrouver partiellement caché
// sous l'encoche sur certains iPhone.
export const viewport: Viewport = {
  viewportFit: 'cover'
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  const body = (
    <html lang="fr" className={`${montserrat.variable} ${playfair.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-gn-black text-gn-cream">
        <SmoothScroll />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );

  // TEMP : voir src/lib/clerk-configured.ts — à retirer une fois les clés
  // Clerk ajoutées, ClerkProvider devient alors permanent.
  if (!isClerkConfigured) return body;

  return <ClerkProvider localization={frFR} afterSignOutUrl="/">{body}</ClerkProvider>;
}
