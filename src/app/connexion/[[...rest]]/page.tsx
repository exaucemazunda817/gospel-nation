import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { SignIn } from '@clerk/nextjs';
import { isClerkConfigured } from '@/lib/clerk-configured';
import { brandColors } from '@/lib/brand';
import { BackStrip } from '@/components/BackLink';

export const metadata: Metadata = {
  title: 'Connexion'
};

export default function ConnexionPage() {
  // TEMP : voir src/lib/clerk-configured.ts.
  if (!isClerkConfigured) redirect('/');

  return (
    <div className="bg-gn-cream-bg">
      <BackStrip />
      <div className="flex min-h-[70vh] items-center justify-center px-5 py-16">
      <SignIn
        path="/connexion"
        signUpUrl="/compte/inscription"
        fallbackRedirectUrl="/compte"
        appearance={{
          variables: {
            colorPrimary: brandColors.gold,
            colorBackground: brandColors.white,
            borderRadius: '0.75rem'
          }
        }}
      />
      </div>
    </div>
  );
}
