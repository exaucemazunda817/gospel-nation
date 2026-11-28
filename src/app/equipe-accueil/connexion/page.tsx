import type { Metadata } from 'next';
import Image from 'next/image';
import WelcomeLoginForm from '@/components/accueil/WelcomeLoginForm';

export const metadata: Metadata = {
  title: 'Équipe d’accueil',
  robots: { index: false, follow: false }
};

export default function WelcomeLoginPage() {
  return (
    <div className="bg-gn-cream-bg">
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-12 sm:px-6">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image src="/logo-gospel-nation.png" alt="Logo Gospel Nation" width={72} height={72} className="h-16 w-16 object-contain" />
          <h1 className="mt-4 font-serif text-2xl font-bold text-gn-ink">Équipe d&apos;accueil</h1>
          <p className="mt-1 text-sm text-gn-ink/70">Accès réservé à l&apos;équipe d&apos;accueil de l&apos;église</p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <WelcomeLoginForm />
        </div>
      </div>
    </div>
  );
}
