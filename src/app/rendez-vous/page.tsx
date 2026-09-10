import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import { church } from '@/lib/content';
import AppointmentForm from './AppointmentForm';

export const metadata: Metadata = {
  title: 'Rendez-vous pastoral'
};

export default function RendezVousPage() {
  return (
    <div>
      <PageHero
        eyebrow="Accompagnement personnel"
        title="Rendez-vous pastoral"
        subtitle={`Prenez un moment avec le ${church.mainPastor.title.toLowerCase()} ${church.mainPastor.name} pour un accompagnement personnel.`}
      />

      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-white/10 bg-gn-black-soft p-6 sm:p-8">
          <AppointmentForm />
        </div>
      </div>
    </div>
  );
}
