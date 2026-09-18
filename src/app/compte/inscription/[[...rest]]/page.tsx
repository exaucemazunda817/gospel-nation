import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { SignUp } from '@clerk/nextjs';
import { isClerkConfigured } from '@/lib/clerk-configured';
import { brandColors } from '@/lib/brand';

export const metadata: Metadata = {
  title: 'Créer un compte'
};

export default function CompteInscriptionPage() {
  // TEMP : voir src/lib/clerk-configured.ts.
  if (!isClerkConfigured) redirect('/');

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-gn-cream-bg px-5 py-16">
      <SignUp
        path="/compte/inscription"
        signInUrl="/connexion"
        forceRedirectUrl="/compte"
        appearance={{
          variables: {
            colorPrimary: brandColors.gold,
            colorBackground: brandColors.white,
            borderRadius: '0.75rem'
          }
        }}
      />
    </div>
  );
}
