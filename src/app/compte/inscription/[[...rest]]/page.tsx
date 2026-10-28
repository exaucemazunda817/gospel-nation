import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { SignUp } from '@clerk/nextjs';
import { isClerkConfigured } from '@/lib/clerk-configured';
import { brandColors } from '@/lib/brand';
import { BackStrip } from '@/components/BackLink';

export const metadata: Metadata = {
  title: 'Créer un compte'
};

export default function CompteInscriptionPage() {
  // TEMP : voir src/lib/clerk-configured.ts.
  if (!isClerkConfigured) redirect('/');

  return (
    <div className="bg-gn-cream-bg">
      <BackStrip />
      <div className="flex min-h-[70vh] items-center justify-center px-5 py-16">
      <SignUp
        path="/compte/inscription"
        signInUrl="/connexion"
        fallbackRedirectUrl="/compte"
        appearance={{
          variables: {
            colorPrimary: brandColors.gold,
            // Texte foncé sur le bouton doré, comme sur tout le site : le blanc
            // par défaut de Clerk n'y fait que 2,8:1 (mesuré le 28/10/2026).
            colorPrimaryForeground: brandColors.ink,
            colorBackground: brandColors.white,
            borderRadius: '0.75rem'
          },
          elements: {
            // Lien « S'inscrire » / « Se connecter » : or foncé lisible sur blanc.
            footerActionLink: { color: brandColors.goldLine }
          }
        }}
      />
      </div>
    </div>
  );
}
