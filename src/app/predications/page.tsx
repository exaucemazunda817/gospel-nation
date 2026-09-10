import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import PlaceholderNote from '@/components/PlaceholderNote';
import { prisma } from '@/lib/prisma';
import { predicationsPlaceholder } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Prédications'
};

export default async function PredicationsPage() {
  const sermons = await prisma.sermon.findMany({ orderBy: { date: 'desc' } });

  return (
    <div>
      <PageHero
        eyebrow="Grandir dans la Parole"
        title="Prédications"
        subtitle="Notes et vidéos de nos cultes, à revoir quand vous voulez."
      />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        {sermons.length === 0 ? (
          <PlaceholderNote>{predicationsPlaceholder}</PlaceholderNote>
        ) : (
          <div className="space-y-6">
            {sermons.map((sermon) => (
              <article key={sermon.id} className="rounded-2xl border border-white/10 bg-gn-black-soft p-6">
                <p className="text-xs uppercase tracking-wide text-gn-gold">
                  {new Date(sermon.date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                  {sermon.series && ` — ${sermon.series}`}
                </p>
                <h2 className="mt-1 text-lg font-bold text-gn-cream">{sermon.title}</h2>
                <p className="mt-1 text-sm text-gn-cream/60">{sermon.speaker}</p>
                {sermon.notesContent && (
                  <p className="mt-3 whitespace-pre-line text-gn-cream/80">{sermon.notesContent}</p>
                )}
                {sermon.videoUrl && (
                  <a
                    href={sermon.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-sm font-medium text-gn-gold hover:underline"
                  >
                    Voir la vidéo →
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
