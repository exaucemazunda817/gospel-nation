import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { church } from '@/lib/content';
import AppointmentForm from './AppointmentForm';

export const metadata: Metadata = {
  title: 'Rendez-vous pastoral'
};

const infoItems = [
  {
    label: 'Cultes',
    value: church.schedule.map((s) => `${s.day} ${s.time}`).join(' · '),
    path: (
      <>
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 7 12 12 16 14" />
      </>
    )
  },
  {
    label: 'Lieu',
    value: church.address,
    path: (
      <>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </>
    )
  }
];

export default function RendezVousPage() {
  return (
    <div className="bg-gn-black">
      <section className="relative h-[220px] overflow-hidden border-b border-gn-gold/20 bg-gn-black sm:h-[260px]">
        <Image src="/hero/rendez-vous.jpg" alt="" fill className="object-cover object-top" />
        <div className="pointer-events-none absolute inset-0 bg-gn-black/40" />
        <div className="gn-glow pointer-events-none absolute inset-0" />
        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-5 sm:px-10">
          <p className="mb-3.5 text-xs text-gn-muted">
            <Link href="/" className="hover:text-gn-gold">Accueil</Link> / <span className="text-gn-gold">Prendre rendez-vous</span>
          </p>
          <h1 className="font-serif text-3xl font-bold text-gn-cream sm:text-[38px]">Prendre rendez-vous</h1>
          <p className="mt-3.5 max-w-md text-sm text-gn-muted">
            Un besoin de prière, de conseil pastoral ou d&apos;accompagnement ? Prenez rendez-vous avec le
            pasteur.
          </p>
        </div>
      </section>

      <section className="bg-gn-black">
        <div className="mx-auto grid max-w-6xl gap-14 px-5 py-16 sm:px-10 sm:py-20 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col gap-7">
            <p className="text-sm leading-relaxed text-gn-muted">
              Que ce soit pour un conseil pastoral, un temps de prière ou une visite, le pasteur se rend
              disponible pour vous accompagner.
            </p>
            {infoItems.map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border border-gn-gold/40 bg-gn-gold/10">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--gn-gold)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    {item.path}
                  </svg>
                </div>
                <div>
                  <p className="mb-1 text-[11px] uppercase tracking-wide text-gn-muted">{item.label}</p>
                  <p className="font-serif text-[15px] font-semibold text-gn-cream">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-gn-cream-bg p-7 sm:p-11">
            <p className="mb-1 font-serif text-xl font-semibold text-gn-ink">Demande de rendez-vous</p>
            <p className="mb-6 text-xs text-gn-muted">
              Précisez le motif et le créneau qui vous conviennent, le pasteur confirmera votre rendez-vous.
            </p>
            <AppointmentForm />
          </div>
        </div>
      </section>
    </div>
  );
}
