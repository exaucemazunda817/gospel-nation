import type { ReactNode } from 'react';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';

export type LegalSection = { title: string; body: ReactNode };

// Mise en page commune aux pages juridiques (mentions légales, confidentialité).
export default function LegalPage({
  title,
  intro,
  updated,
  sections
}: {
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <div className="bg-gn-cream-bg">
      <PageHero eyebrow="Informations légales" title={title} subtitle={intro} />
      <Reveal className="mx-auto max-w-3xl px-5 py-12 sm:px-10 sm:py-16">
        <p className="text-xs text-gn-ink/60">Dernière mise à jour : {updated}</p>
        <div className="mt-8 flex flex-col gap-9">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="font-serif text-xl font-bold text-gn-ink">{s.title}</h2>
              <div className="mt-3 flex flex-col gap-3 text-sm leading-relaxed text-gn-ink/80">{s.body}</div>
            </section>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
