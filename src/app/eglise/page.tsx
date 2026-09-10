import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import PlaceholderNote from '@/components/PlaceholderNote';
import { church, histoirePlaceholder, missionPlaceholder } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Notre église'
};

export default function EglisePage() {
  return (
    <div>
      <PageHero
        eyebrow={church.tagline}
        title="Notre église"
        subtitle="Qui nous sommes, ce que nous croyons, et comment nous rassembler."
      />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <section>
          <h2 className="text-xl font-bold text-gn-gold">Notre mission</h2>
          <p className="mt-3 text-gn-cream/80">{missionPlaceholder}</p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-gn-gold">Notre histoire</h2>
          <p className="mt-3 text-gn-cream/80">{histoirePlaceholder}</p>
        </section>

        <section className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border-t-4 border-gn-gold bg-gn-black-soft p-6">
            <h2 className="font-bold text-gn-cream">Pasteur principal</h2>
            <p className="mt-2 text-gn-cream/80">{church.mainPastor.name}</p>
            <a
              href={`https://www.instagram.com/${church.mainPastor.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sm text-gn-gold hover:underline"
            >
              {church.mainPastor.instagram}
            </a>
          </div>

          <div className="rounded-2xl border-t-4 border-gn-gold bg-gn-black-soft p-6">
            <h2 className="font-bold text-gn-cream">Cultes</h2>
            <ul className="mt-2 space-y-1 text-gn-cream/80">
              {church.schedule.map((s) => (
                <li key={s.day}>
                  {s.day} — {s.time} ({s.label})
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-gn-gold">Adresse</h2>
          <p className="mt-3 text-gn-cream/80">{church.address}</p>
        </section>

        <div className="mt-8">
          <PlaceholderNote>
            La mission, l&apos;histoire et l&apos;adresse complète seront mises à jour dès validation
            par le pasteur principal.
          </PlaceholderNote>
        </div>
      </div>
    </div>
  );
}
