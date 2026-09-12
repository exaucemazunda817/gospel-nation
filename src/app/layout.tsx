import type { Metadata } from 'next';
import { Montserrat, Playfair_Display } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { church } from '@/lib/content';

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

export const metadata: Metadata = {
  title: {
    default: church.name,
    template: `%s — ${church.name}`
  },
  description: `${church.name} — ${church.tagline}. Cultes, départements, témoignages et vie de notre église.`
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="fr" className={`${montserrat.variable} ${playfair.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-gn-black text-gn-cream">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
