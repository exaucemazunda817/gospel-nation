import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import PlaceholderNote from '@/components/PlaceholderNote';
import { prisma } from '@/lib/prisma';
import { temoignagesPlaceholder } from '@/lib/content';
import TestimonyForm from './TestimonyForm';

export const metadata: Metadata = {
  title: 'Témoignages'
};

export default async function TemoignagesPage() {
  const testimonies = await prisma.testimony.findMany({
    where: { status: 'APPROVED' },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <PageHero
        eyebrow="Ce que Dieu a fait"
        title="Témoignages"
        subtitle="Partagez ce que Dieu a fait dans votre vie, ou lisez ceux d'autres membres."
      />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        {testimonies.length === 0 ? (
          <PlaceholderNote>{temoignagesPlaceholder}</PlaceholderNote>
        ) : (
          <div className="space-y-6">
            {testimonies.map((t) => (
              <article key={t.id} className="rounded-2xl border border-white/10 bg-gn-black-soft p-6">
                <p className="whitespace-pre-line text-gn-cream/85">{t.content}</p>
                <p className="mt-3 text-sm font-medium text-gn-gold">— {t.authorName}</p>
                {t.videoUrl && (
                  <a
                    href={t.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm text-gn-gold hover:underline"
                  >
                    Voir la vidéo →
                  </a>
                )}
              </article>
            ))}
          </div>
        )}

        <div className="mt-12">
          <h2 className="text-xl font-bold text-gn-gold">Partager mon témoignage</h2>
          <p className="mt-1 text-sm text-gn-cream/60">
            Votre témoignage sera publié après vérification par un administrateur.
          </p>
          <div className="mt-6 rounded-2xl border border-white/10 bg-gn-black-soft p-6 sm:p-8">
            <TestimonyForm />
          </div>
        </div>
      </div>
    </div>
  );
}
