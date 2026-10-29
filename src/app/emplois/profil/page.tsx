import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { BackStrip } from '@/components/BackLink';
import { prisma } from '@/lib/prisma';
import { isClerkConfigured } from '@/lib/clerk-configured';
import ProfileForm from './ProfileForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Mon profil de candidat',
  description: 'Votre parcours, vos études et vos compétences, pour préparer vos candidatures.',
  robots: { index: false }
};

export default async function ProfilPage({ searchParams }: { searchParams: Promise<{ retour?: string }> }) {
  if (!isClerkConfigured) redirect('/emplois');
  const { userId } = await auth();
  const { retour } = await searchParams;
  // Retour seulement vers une offre du site (jamais une adresse externe).
  const back = retour && /^\/emplois\/[\w-]+$/.test(retour) ? retour : '/emplois';

  const profile = userId ? await prisma.jobProfile.findUnique({ where: { clerkUserId: userId } }) : null;

  return (
    <div className="bg-gn-cream-bg">
      <PageHero eyebrow="Emplois" title="Mon profil de candidat" image="/hero/services.jpg" />
      <BackStrip href="/emplois" />
      <Reveal className="mx-auto max-w-2xl px-5 py-14 sm:px-10 sm:py-16">
        {userId ? (
          <div className="relative rounded-2xl border border-gn-line bg-white p-6 sm:p-8">
            <span className="gn-beam" aria-hidden="true" />
            <ProfileForm
              back={back}
              initial={
                profile
                  ? {
                      fullName: profile.fullName,
                      phone: profile.phone ?? '',
                      city: profile.city ?? '',
                      headline: profile.headline ?? '',
                      summary: profile.summary ?? '',
                      experience: profile.experience ?? '',
                      education: profile.education ?? '',
                      skills: profile.skills ?? '',
                      languages: profile.languages ?? ''
                    }
                  : null
              }
            />
          </div>
        ) : (
          <div className="rounded-2xl border border-gn-line bg-white p-8 text-center">
            <p className="font-serif text-lg font-bold text-gn-ink">Connectez-vous pour continuer</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gn-ink/70">
              Un compte gratuit est nécessaire : il sert à vous envoyer vos documents par e-mail.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/connexion?redirect_url=/emplois/profil"
                className="inline-flex min-h-[44px] items-center rounded-full bg-gn-gold px-6 text-sm font-semibold text-gn-black hover:bg-gn-gold-dark"
              >
                Me connecter
              </Link>
              <Link
                href="/compte/inscription?redirect_url=/emplois/profil"
                className="inline-flex min-h-[44px] items-center rounded-full border border-gn-ink/20 px-6 text-sm font-semibold text-gn-ink hover:border-gn-gold"
              >
                Créer un compte
              </Link>
            </div>
          </div>
        )}
      </Reveal>
    </div>
  );
}
