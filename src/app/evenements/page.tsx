import type { Metadata } from 'next';
import Image from 'next/image';
import PageHero from '@/components/PageHero';
import PlaceholderNote from '@/components/PlaceholderNote';
import Reveal from '@/components/Reveal';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Événements'
};

export default async function EvenementsPage() {
  const events = await prisma.event.findMany({ orderBy: { eventDate: 'asc' } });

  return (
    <div>
      <PageHero
        eyebrow="Agenda de l'église"
        title="Événements à venir"
        subtitle="Retrouvez ici les prochains rendez-vous de la vie de l'église et de ses départements."
      />

      <div className="gn-section-light">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          {events.length === 0 ? (
            <PlaceholderNote>Aucun événement à venir pour le moment. Revenez bientôt !</PlaceholderNote>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2">
              {events.map((event, index) => (
                <Reveal key={event.id} delay={index * 0.08}>
                  <div className="gn-card-lift overflow-hidden rounded-2xl border border-gn-ink/10 bg-white shadow-sm">
                    <div className="relative aspect-[4/5] w-full">
                      <Image src={event.posterImageUrl} alt={event.title} fill className="object-cover" />
                    </div>
                    <div className="p-6">
                      <h2 className="text-lg font-bold text-gn-ink">{event.title}</h2>
                      {event.eventDate && (
                        <p className="mt-1 text-sm font-semibold text-gn-gold-dark">
                          {new Date(event.eventDate).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}{' '}
                          à{' '}
                          {new Date(event.eventDate).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      )}
                      {event.description && <p className="mt-2 text-sm text-gn-ink/70">{event.description}</p>}
                      {event.location && <p className="mt-3 text-xs text-gn-ink/50">{event.location}</p>}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
