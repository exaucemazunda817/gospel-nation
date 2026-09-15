import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth, currentUser } from '@clerk/nextjs/server';
import { UserButton } from '@clerk/nextjs';
import PageHero from '@/components/PageHero';
import { prisma } from '@/lib/prisma';
import { TOTAL_DAYS } from '@/lib/reading-plan';
import { isClerkConfigured } from '@/lib/clerk-configured';

export const metadata: Metadata = {
  title: 'Mon compte'
};

export default async function ComptePage() {
  // TEMP : voir src/lib/clerk-configured.ts.
  if (!isClerkConfigured) redirect('/');

  const { userId } = await auth();
  if (!userId) redirect('/connexion');

  const user = await currentUser();
  const progress = await prisma.readingProgress.findMany({ where: { clerkUserId: userId } });
  const done = progress.reduce((acc, p) => acc + (p.ot ? 1 : 0) + (p.nt ? 1 : 0), 0);
  const pct = Math.round((done / (TOTAL_DAYS * 2)) * 100);

  return (
    <div className="bg-gn-cream-bg">
      <PageHero eyebrow="Compte" title={`Bonjour, ${user?.firstName ?? 'ami'}`} subtitle="Votre espace personnel Gospel Nation." />

      <div className="mx-auto max-w-3xl px-5 py-14 sm:px-10 sm:py-16">
        <div className="mb-8 flex items-center justify-between rounded-2xl border border-gn-line bg-white p-5">
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/" />
            <div>
              <p className="font-serif text-base font-bold text-gn-ink">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[12.5px] text-gn-ink/60">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/bible/plan"
          className="gn-card-lift flex items-center justify-between gap-4 rounded-2xl border border-gn-gold/30 bg-gn-black-soft px-6 py-5 text-gn-cream"
        >
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gn-gold">Plan de lecture</p>
            <p className="mt-1 font-serif text-lg font-bold">
              {progress.length === 0 ? 'Commencer la lecture en 365 jours' : `${pct}% de la Bible parcourue`}
            </p>
          </div>
          <span className="flex items-center gap-2 text-[12.5px] font-semibold text-gn-gold-line">
            {progress.length === 0 ? 'Commencer' : 'Continuer'}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        </Link>
      </div>
    </div>
  );
}
