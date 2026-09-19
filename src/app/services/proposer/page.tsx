import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth, currentUser } from '@clerk/nextjs/server';
import PageHero from '@/components/PageHero';
import { isClerkConfigured } from '@/lib/clerk-configured';
import OfferForm from './OfferForm';

export const metadata: Metadata = {
  title: 'Proposer une offre',
  description: 'Publiez votre produit ou votre service sur la page Offres et services de Gospel Nation.'
};

export default async function ProposerOffrePage() {
  if (!isClerkConfigured) redirect('/services');

  const { userId } = await auth();

  return (
    <div className="bg-gn-cream-bg">
      <PageHero
        eyebrow="Offres et services"
        title="Proposer une offre"
        subtitle="Un produit, un service ou une offre d'emploi à partager avec la communauté."
        image="/hero/services.jpg"
      />

      <div className="mx-auto max-w-2xl px-5 py-14 sm:px-10 sm:py-16">
        {userId ? (
          <SignedInContent />
        ) : (
          <div className="rounded-2xl border border-gn-line bg-white p-8 text-center">
            <p className="font-serif text-lg font-bold text-gn-ink">Connectez-vous pour continuer</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gn-ink/70">
              Un compte gratuit est nécessaire pour publier une offre. Il vous suffit d&apos;une adresse e-mail.
              Vous reviendrez ensuite directement sur ce formulaire.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/connexion?redirect_url=/services/proposer"
                className="inline-flex min-h-[44px] items-center rounded-full bg-gn-gold px-6 text-sm font-semibold text-gn-black transition-colors hover:bg-gn-gold-dark"
              >
                Me connecter
              </Link>
              <Link
                href="/compte/inscription?redirect_url=/services/proposer"
                className="inline-flex min-h-[44px] items-center rounded-full border border-gn-ink/20 px-6 text-sm font-semibold text-gn-ink transition-colors hover:border-gn-gold"
              >
                Créer un compte
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

async function SignedInContent() {
  const user = await currentUser();
  const defaultName = [user?.firstName, user?.lastName].filter(Boolean).join(' ');

  return (
    <div className="rounded-2xl border border-gn-line bg-white p-6 sm:p-8">
      <p className="mb-6 text-sm leading-relaxed text-gn-ink/70">
        Votre offre sera publiée sur la page{' '}
        <Link href="/services" className="font-semibold text-gn-gold-line hover:underline">
          Offres et services
        </Link>{' '}
        après vérification par un administrateur.
      </p>
      <OfferForm defaultName={defaultName} />
    </div>
  );
}
