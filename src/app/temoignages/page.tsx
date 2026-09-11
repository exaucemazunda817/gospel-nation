import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import PlaceholderNote from '@/components/PlaceholderNote';
import Reveal from '@/components/Reveal';
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

      <div className="gn-section-light">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          {testimonies.length === 0 ? (
            <PlaceholderNote>{temoignagesPlaceholder}</PlaceholderNote>
          ) : (
            <div className="space-y-6">
              {testimonies.map((t, index) => (
                <Reveal key={t.id} delay={index * 0.06}>
                  <article className="gn-card-lift rounded-2xl border border-gn-ink/10 bg-white p-6">
                    <p className="whitespace-pre-line text-gn-ink/85">{t.content}</p>
                    <p className="mt-3 text-sm font-medium text-gn-gold-dark">— {t.authorName}</p>
                    {t.videoUrl && (
                      <a
                        href={t.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-sm text-gn-gold-dark hover:underline"
                      >
                        Voir la vidéo →
                      </a>
                    )}
                  </article>
                </Reveal>
              ))}
            </div>
          )}

          <div className="mt-12">
            <h2 className="text-xl font-bold text-gn-gold-dark">Partager mon témoignage</h2>
            <p className="mt-1 text-sm text-gn-ink/60">
              Votre témoignage sera publié après vérification par un administrateur.
            </p>
            <div className="mt-6 rounded-2xl border border-gn-ink/10 bg-white p-6 shadow-sm sm:p-8">
              <TestimonyForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
