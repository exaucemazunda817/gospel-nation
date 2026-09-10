import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { church } from '@/lib/content';

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin']
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
    <html lang="fr" className={`${manrope.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-gn-black text-gn-cream">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
