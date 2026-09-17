import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import InscriptionForm from './InscriptionForm';

export const metadata: Metadata = {
  title: 'Devenir membre'
};

const benefits = [
  {
    title: 'Carte de membre personnalisée',
    description: 'Générée immédiatement à votre nom, avec QR code et numéro unique.',
    path: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <circle cx="8" cy="11" r="2" />
        <path d="M5 16c.6-1.6 1.8-2.4 3-2.4s2.4.8 3 2.4" />
        <line x1="14" y1="9.5" x2="19" y2="9.5" />
        <line x1="14" y1="13" x2="19" y2="13" />
      </>
    )
  },
  {
    title: 'Un département pour servir',
    description: "Rejoignez la chorale, le protocole, l'intercession ou un autre ministère.",
    path: (
      <>
        <circle cx="9" cy="8" r="3.2" />
        <path d="M2.5 19c.6-3 3.2-5 6.5-5s5.9 2 6.5 5" />
        <circle cx="17.5" cy="9" r="2.6" />
        <path d="M15.8 14.2c2.6.4 4.6 2.1 5.1 4.4" />
      </>
    )
  },
  {
    title: 'Suivi pastoral',
    description: "Un accompagnement personnalisé par le pasteur.",
    path: <path d="M12 21s-7.5-4.9-10-9.4C.4 8 2 4.5 5.6 4A5.6 5.6 0 0 1 12 7.5 5.6 5.6 0 0 1 18.4 4C22 4.5 23.6 8 22 11.6 19.5 16.1 12 21 12 21z" />
  }
];

export default async function InscriptionPage() {
  const departments = await prisma.department.findMany({
    orderBy: { order: 'asc' },
    select: { id: true, name: true }
  });

  return (
    <div className="bg-gn-black">
      <section className="relative h-[220px] overflow-hidden border-b border-gn-gold/20 bg-gn-black sm:h-[260px]">
        <Image src="/hero/inscription.jpg" alt="" fill className="object-cover object-top" />
        <div className="pointer-events-none absolute inset-0 bg-gn-black/40" />
        <div className="gn-glow pointer-events-none absolute inset-0" />
        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-5 sm:px-10">
          <p className="mb-3.5 text-xs text-gn-muted">
            <Link href="/" className="hover:text-gn-gold">Accueil</Link> / <span className="text-gn-gold">Devenir membre</span>
          </p>
          <h1 className="font-serif text-3xl font-bold text-gn-cream sm:text-[38px]">
            Devenir membre de Gospel Nation
          </h1>
        </div>
      </section>

      <section className="bg-gn-black">
        <div className="mx-auto grid max-w-6xl gap-14 px-5 py-16 sm:px-10 sm:py-20 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="flex flex-col gap-7">
            <div>
              <p className="mb-3 font-serif text-[15px] italic font-medium text-gn-gold">Pourquoi devenir membre</p>
              <p className="text-sm leading-relaxed text-gn-muted">
                L&apos;inscription vous donne accès à votre carte de membre personnalisée, générée
                immédiatement.
              </p>
            </div>
            {benefits.map((b) => (
              <div key={b.title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gn-gold/40 bg-gn-gold/10">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gn-gold)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    {b.path}
                  </svg>
                </div>
                <div>
                  <p className="mb-1 font-serif text-[15px] font-semibold text-gn-cream">{b.title}</p>
                  <p className="text-[12.5px] leading-relaxed text-gn-muted">{b.description}</p>
                </div>
              </div>
            ))}
            <div className="mt-2 flex items-center justify-center">
              <div className="relative h-[208px] w-[320px] overflow-hidden rounded-2xl bg-gradient-to-br from-gn-black-soft to-gn-black shadow-2xl">
                <div className="absolute inset-1.5 rounded-xl border border-gn-gold/35" />
                <div className="flex flex-col items-center gap-1 px-[18px] pt-4">
                  <Image src="/logo-gospel-nation.png" alt="" width={26} height={26} className="h-[26px] w-[26px] object-contain" />
                  <span className="mt-1 rounded-full border border-gn-gold/40 px-2.5 py-0.5 text-[7.5px] uppercase tracking-[0.14em] text-gn-gold">
                    Carte de membre
                  </span>
                </div>
                <div className="flex gap-[11px] px-[18px] py-3.5">
                  <div className="h-[58px] w-[46px] rounded-md border-[1.5px] border-gn-gold bg-[#241f19]" />
                  <div>
                    <p className="mb-1.5 font-serif text-xs font-bold text-gn-cream">Prénom Nom</p>
                    <p className="text-[7.5px] text-gn-muted">N° MEMBRE</p>
                    <p className="text-[8.5px] font-semibold text-gn-cream">GN-2026-000123</p>
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 flex h-10 items-center justify-end bg-gradient-to-r from-gn-gold via-gn-gold-light to-gn-gold px-3.5">
                  <span className="text-[8.5px] font-bold uppercase tracking-wide text-[#2a2013]">Gospel Nation</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-gn-cream-bg p-7 sm:p-11">
            <p className="mb-1 font-serif text-xl font-semibold text-gn-ink">Formulaire d&apos;inscription</p>
            <p className="mb-6 text-xs text-gn-muted">
              Remplissez vos informations pour rejoindre la famille Gospel Nation.
            </p>
            <InscriptionForm departments={departments} />
          </div>
        </div>
      </section>
    </div>
  );
}
