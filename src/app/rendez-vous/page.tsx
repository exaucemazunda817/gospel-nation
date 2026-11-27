import type { Metadata } from 'next';
import { church } from '@/lib/content';
import AppointmentForm from './AppointmentForm';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'Rendez-vous pastoral',
  description:
    'Demandez un rendez-vous avec le pasteur ou le secrétariat de Gospel Nation.'
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
      <PageHero
        crumbs={[{ label: "Prendre rendez-vous" }]}
        title="Prendre rendez-vous"
        subtitle="Un besoin de prière, de conseil pastoral ou d&apos;accompagnement ? Prenez rendez-vous avec le pasteur."
        image="/hero/rendez-vous.jpg"
        imagePosition="50% 10%"
      />

      <section className="bg-gn-black">
        <Reveal className="mx-auto grid max-w-6xl gap-14 px-5 py-16 sm:px-10 sm:py-20 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col gap-7">
            <p className="max-w-measure text-sm leading-relaxed text-gn-muted">
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
                  <p className="mb-1 text-xs font-semibold text-gn-muted">{item.label}</p>
                  <p className="max-w-measure font-serif text-base font-semibold text-gn-cream">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative rounded-2xl bg-gn-cream-bg p-7 sm:p-11">
            <span className="gn-beam" aria-hidden="true" />
            <p className="mb-1 font-serif text-xl font-semibold text-gn-ink">Demande de rendez-vous</p>
            <p className="mb-6 max-w-measure text-xs text-gn-muted-strong">
              Précisez le motif et le créneau qui vous conviennent, le pasteur confirmera votre rendez-vous.
            </p>
            <AppointmentForm />
          </div>
        </Reveal>
      </section>
    </div>
  );
}
