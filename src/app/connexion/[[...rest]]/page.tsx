import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { SignIn } from '@clerk/nextjs';
import { isClerkConfigured } from '@/lib/clerk-configured';

export const metadata: Metadata = {
  title: 'Connexion'
};

export default function ConnexionPage() {
  // TEMP : voir src/lib/clerk-configured.ts.
  if (!isClerkConfigured) redirect('/');

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-gn-cream-bg px-5 py-16">
      <SignIn
        path="/connexion"
        signUpUrl="/compte/inscription"
        forceRedirectUrl="/compte"
        appearance={{
          variables: {
            colorPrimary: '#d28943',
            colorBackground: '#ffffff',
            colorText: '#221c13',
            borderRadius: '0.75rem'
          }
        }}
      />
    </div>
  );
}
