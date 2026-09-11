import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import PlaceholderNote from '@/components/PlaceholderNote';

export const metadata: Metadata = {
  title: 'Devenir membre'
};

export default function InscriptionPage() {
  return (
    <div>
      <PageHero
        eyebrow="Rejoignez-nous"
        title="Devenir membre"
        subtitle="Créez votre compte membre : carte virtuelle, inscription aux départements, suivi des annonces de l'église."
      />

      <div className="gn-section-light">
        <div className="mx-auto max-w-2xl px-4 py-12 text-center sm:px-6">
          <PlaceholderNote>
            Les comptes membres (inscription, carte de membre virtuelle, inscription aux départements)
            arrivent bientôt — l&apos;espace d&apos;authentification est en cours de mise en place.
            En attendant, vous pouvez déjà{' '}
            <Link href="/temoignages" className="text-gn-gold-dark hover:underline">
              partager un témoignage
            </Link>{' '}
            ou{' '}
            <Link href="/rendez-vous" className="text-gn-gold-dark hover:underline">
              prendre rendez-vous avec le pasteur
            </Link>{' '}
            sans compte.
          </PlaceholderNote>
        </div>
      </div>
    </div>
  );
}
