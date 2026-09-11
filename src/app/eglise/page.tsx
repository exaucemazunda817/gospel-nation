import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import PlaceholderNote from '@/components/PlaceholderNote';
import Reveal from '@/components/Reveal';
import { baptemeNote, church, gospelFamilyNote, histoirePlaceholder, missionPlaceholder } from '@/lib/content';

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

      <div className="gn-section-light">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <Reveal>
            <section>
              <h2 className="text-xl font-bold text-gn-gold-dark">Notre mission</h2>
              <p className="mt-3 text-gn-ink/80">{missionPlaceholder}</p>
            </section>
          </Reveal>

          <Reveal delay={0.06}>
            <section className="mt-10">
              <h2 className="text-xl font-bold text-gn-gold-dark">Notre histoire</h2>
              <p className="mt-3 text-gn-ink/80">{histoirePlaceholder}</p>
            </section>
          </Reveal>

          <Reveal delay={0.12}>
            <section className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="gn-card-lift rounded-2xl border-t-4 border-gn-gold bg-white p-6 shadow-sm">
                <h2 className="font-bold text-gn-ink">Pasteur principal</h2>
                <p className="mt-2 text-gn-ink/80">{church.mainPastor.name}</p>
                <a
                  href={`https://www.instagram.com/${church.mainPastor.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-sm text-gn-gold-dark hover:underline"
                >
                  {church.mainPastor.instagram}
                </a>
              </div>

              <div className="gn-card-lift rounded-2xl border-t-4 border-gn-gold bg-white p-6 shadow-sm">
                <h2 className="font-bold text-gn-ink">Cultes</h2>
                <ul className="mt-2 space-y-1 text-gn-ink/80">
                  {church.schedule.map((s) => (
                    <li key={`${s.day}-${s.time}`}>
                      {s.day} — {s.time} ({s.label})
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </Reveal>

          <Reveal delay={0.18}>
            <section className="mt-10">
              <h2 className="text-xl font-bold text-gn-gold-dark">Adresse</h2>
              <p className="mt-3 text-gn-ink/80">{church.address}</p>
            </section>
          </Reveal>

          <Reveal delay={0.24}>
            <section className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="gn-card-lift rounded-2xl border-t-4 border-gn-gold bg-white p-6 shadow-sm">
                <h2 className="font-bold text-gn-ink">Gospel Family</h2>
                <p className="mt-2 text-gn-ink/80">{gospelFamilyNote}</p>
              </div>

              <div className="gn-card-lift rounded-2xl border-t-4 border-gn-gold bg-white p-6 shadow-sm">
                <h2 className="font-bold text-gn-ink">Baptêmes</h2>
                <p className="mt-2 text-gn-ink/80">{baptemeNote}</p>
              </div>
            </section>
          </Reveal>

          <div className="mt-8">
            <PlaceholderNote>
              La mission et l&apos;histoire complètes seront mises à jour dès validation par le pasteur
              principal.
            </PlaceholderNote>
          </div>
        </div>
      </div>
    </div>
  );
}
