import type { Metadata } from 'next';
import Link from 'next/link';
import PlaceholderNote from '@/components/PlaceholderNote';
import Reveal from '@/components/Reveal';
import { prisma } from '@/lib/prisma';
import { donsPlaceholder } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Dons'
};

const impact = [
  {
    title: 'Impact communautaire',
    description: "Vos dons financent l'aide aux familles, la jeunesse et les œuvres sociales de l'église.",
    path: <path d="M12 21s-7.5-4.9-10-9.4C.4 8 2 4.5 5.6 4A5.6 5.6 0 0 1 12 7.5 5.6 5.6 0 0 1 18.4 4C22 4.5 23.6 8 22 11.6 19.5 16.1 12 21 12 21z" />
  },
  {
    title: 'Transparence',
    description: "Chaque don est utilisé avec rigueur, dans le respect de la vision de l'église.",
    path: <polyline points="20 6 9 17 4 12" />
  },
  {
    title: 'Missions',
    description: "Une part de vos dons soutient l'évangélisation au-delà de nos frontières.",
    path: (
      <>
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
        <line x1="3" y1="12" x2="21" y2="12" />
      </>
    )
  }
];

export default async function DonsPage() {
  const methods = await prisma.donationMethod.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' }
  });

  return (
    <div className="bg-gn-cream-bg">
      <section className="gn-glow relative h-[240px] overflow-hidden border-b border-gn-gold/20 bg-gn-black sm:h-[300px]">
        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-5 sm:px-10">
          <p className="mb-3.5 text-xs text-gn-muted">
            <Link href="/" className="hover:text-gn-gold">Accueil</Link> / <span className="text-gn-gold">Dons</span>
          </p>
          <h1 className="max-w-lg font-serif text-3xl font-bold leading-tight text-gn-cream sm:text-[38px]">
            Semer dans la maison de Dieu
          </h1>
          <p className="mt-3.5 max-w-lg text-sm text-gn-muted">
            Vos dons soutiennent la vie de l&apos;église et nos œuvres sociales, dont le ministère One Love
            auprès des enfants de la rue.
          </p>
        </div>
      </section>

      <section className="bg-gn-cream-bg">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-20">
          <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-gn-gold-dark">Comment donner</p>
          <h2 className="mb-9 font-serif text-[28px] font-semibold text-gn-ink">Choisissez un moyen de don</h2>
          {methods.length === 0 ? (
            <PlaceholderNote>{donsPlaceholder}</PlaceholderNote>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {methods.map((method, index) => (
                <Reveal key={method.id} delay={index * 0.06}>
                  <div className="flex h-full flex-col gap-3.5 rounded-[10px] border border-gn-line bg-white p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gn-black">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gn-gold)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.1-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2.4z" />
                      </svg>
                    </div>
                    <p className="font-serif text-base font-semibold text-gn-ink">{method.label}</p>
                    <p className="text-sm font-semibold text-gn-gold-line">
                      {method.accountName} — {method.accountValue}
                    </p>
                    {method.instructions && (
                      <p className="text-xs leading-relaxed text-gn-muted">{method.instructions}</p>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="gn-glow relative overflow-hidden bg-gn-black">
        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-20">
          <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-gn-gold">Pourquoi donner</p>
          <h2 className="mb-10 font-serif text-[28px] font-semibold text-gn-cream">L&apos;impact de votre générosité</h2>
          <div className="grid gap-9 sm:grid-cols-3">
            {impact.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.06}>
                <div className="flex flex-col gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gn-gold/40 bg-gn-gold/10">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gn-gold)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                      {item.path}
                    </svg>
                  </div>
                  <p className="font-serif text-base font-semibold text-gn-cream">{item.title}</p>
                  <p className="text-[12.5px] leading-relaxed text-gn-muted">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
