import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import ReadingPlan from '@/components/ReadingPlan';
import Reveal from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'Plan de lecture',
  description:
    'Un plan pour parcourir toute la Bible en 365 jours, avec le suivi de votre progression.'
};

export default function ReadingPlanPage() {
  return (
    <div className="bg-gn-cream-bg">
      <PageHero eyebrow="Bible" title="Plan de lecture en 365 jours" subtitle="365 jours pour parcourir toute la Parole de Dieu." />

      <Reveal className="mx-auto max-w-3xl px-5 py-14 sm:px-10 sm:py-16">
        <Link href="/bible" className="inline-flex min-h-[44px] items-center text-xs font-semibold text-gn-gold-line hover:underline">
          ← Retour à la Bible
        </Link>

        <div className="mt-6 flex flex-col gap-4 text-sm leading-relaxed text-gn-ink/80">
          <p>
            Ce plan te propose de lire toute la Bible en 365 jours, à ton propre rythme : les jours ne sont pas
            datés, tu peux donc commencer n&apos;importe quand dans l&apos;année.
          </p>
          <div className="border-l-2 border-gn-gold bg-white px-5 py-4">
            <p className="font-serif italic text-gn-ink">
              « Que ce livre de la loi ne s&apos;éloigne point de ta bouche ; médite-le jour et nuit, pour agir
              fidèlement selon tout ce qui y est écrit ; car c&apos;est alors que tu réussiras dans tes
              entreprises, c&apos;est alors que tu prospéreras. »
            </p>
            <cite className="mt-1.5 block text-xs font-semibold uppercase tracking-wide text-gn-gold-dark not-italic">
              Josué 1:8
            </cite>
          </div>
          <ul className="flex flex-col gap-2.5">
            <li>
              <strong className="text-gn-ink">Ancien Testament</strong> — parcouru une seule fois dans
              l&apos;année, à raison de deux à trois chapitres par jour.
            </li>
            <li>
              <strong className="text-gn-ink">Nouveau Testament</strong> — un chapitre chaque jour. Comme il est
              plus court, tu l&apos;auras terminé vers le jour 260 ; tu repars alors à Matthieu 1 pour une seconde
              lecture jusqu&apos;à la fin de l&apos;année (repérée par un petit « (2) »).
            </li>
            <li>
              Coche les cases au fil de ta lecture : ta progression est sauvegardée automatiquement sur cet
              appareil (elle ne sera pas visible sur un autre téléphone ou ordinateur).
            </li>
          </ul>
        </div>

        <div className="mt-10">
          <ReadingPlan />
        </div>
      </Reveal>
    </div>
  );
}
