import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { church } from '@/lib/content';
import { scheduleByDay } from '@/lib/schedule';
import VisitForm from './VisitForm';

export const metadata: Metadata = {
  title: 'Première visite',
  description: `Vous venez pour la première fois à ${church.name} ? Annoncez votre venue : l'équipe d'accueil vous attendra.`
};

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(church.address)}`;

// Cultes ouverts à tous (l'intercession du vendredi n'est pas proposée aux visiteurs).
const VISITOR_LABELS = ['Culte du dimanche', 'Nation United, culte de la jeunesse', "Culte d'enseignement"];

export default function VisitePage() {
  const days = scheduleByDay()
    .map((group) => ({ ...group, items: group.items.filter((item) => VISITOR_LABELS.includes(item.label)) }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="bg-gn-black">
      <PageHero
        crumbs={[{ label: 'Première visite' }]}
        title="Vous venez pour la première fois ?"
        subtitle="Annoncez votre venue : l'équipe d'accueil vous attendra et vous accompagnera, vous et ceux qui viennent avec vous."
        image="/hero/eglise-v5.jpg"
        imagePosition="50% 40%"
      />

      <section className="bg-gn-black">
        <Reveal className="mx-auto grid max-w-6xl gap-12 px-5 py-14 sm:px-10 sm:py-20 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="mb-4 font-serif text-xl font-semibold text-gn-cream">Nos cultes</h2>
              <ul className="space-y-3">
                {days.map((group) => (
                  <li key={group.day} className="text-sm">
                    <p className="font-serif text-base font-semibold text-gn-cream">{group.day}</p>
                    {group.items.map((item) => (
                      <p key={item.label} className="text-gn-muted">
                        {item.time} · {item.label}
                      </p>
                    ))}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="mb-3 font-serif text-xl font-semibold text-gn-cream">Où nous trouver</h2>
              <p className="max-w-measure text-sm leading-relaxed text-gn-muted">{church.address}.</p>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex min-h-[44px] items-center rounded-full border border-gn-cream/35 px-6 text-xs font-semibold uppercase tracking-wide text-gn-cream transition-colors hover:border-gn-gold hover:text-gn-gold"
              >
                Itinéraire
              </a>
            </div>

            <div>
              <h2 className="mb-3 font-serif text-xl font-semibold text-gn-cream">Pourquoi annoncer sa venue ?</h2>
              <p className="max-w-measure text-sm leading-relaxed text-gn-muted">
                Pour que quelqu&apos;un de l&apos;équipe d&apos;accueil vous attende à la porte, vous présente
                l&apos;église et prépare une place pour toute votre famille. Vos enfants sont aussi attendus :{' '}
                <Link href="/departements/gospel-kids" className="text-gn-gold underline underline-offset-2">
                  Gospel Kids
                </Link>{' '}
                s&apos;occupe des plus jeunes.
              </p>
            </div>
          </div>

          <div className="relative rounded-2xl bg-gn-cream-bg p-7 sm:p-11">
            <span className="gn-beam" aria-hidden="true" />
            <p className="mb-1 font-serif text-xl font-semibold text-gn-ink">Annoncer ma venue</p>
            <p className="mb-6 max-w-measure text-xs text-gn-muted-strong">
              Quelques informations suffisent. Seuls le prénom, le nom et le jour sont obligatoires.
            </p>
            <VisitForm />
          </div>
        </Reveal>
      </section>
    </div>
  );
}
