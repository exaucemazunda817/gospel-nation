import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPage from '@/components/LegalPage';
import { church } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: `Mentions légales du site de ${church.fullName} : éditeur, hébergement, propriété intellectuelle.`
};

export default function MentionsLegalesPage() {
  return (
    <LegalPage
      title="Mentions légales"
      intro="Qui édite ce site, où il est hébergé et à quelles règles il est soumis."
      updated="21 septembre 2026"
      sections={[
        {
          title: 'Éditeur du site',
          body: (
            <>
              <p>
                Ce site est édité par l&apos;église <strong>{church.fullName}</strong>.
              </p>
              <p>
                {church.address}, {church.city}.
              </p>
              <p>
                Pour nous joindre : <Link href="/contact" className="text-gn-gold-line underline">page Contact</Link>.
              </p>
            </>
          )
        },
        {
          title: 'Hébergement',
          body: (
            <>
              <p>
                Le site est hébergé par <strong>Vercel Inc.</strong>, 440 N Barranca Avenue #4133, Covina, CA 91723,
                États-Unis.
              </p>
              <p>
                Les données des membres (base de données) sont conservées chez <strong>Neon</strong>, et les photos
                d&apos;inscription dans un espace de stockage privé de Vercel. Ces prestataires sont situés hors de la
                République démocratique du Congo. Le détail figure dans la{' '}
                <Link href="/confidentialite" className="text-gn-gold-line underline">politique de confidentialité</Link>.
              </p>
            </>
          )
        },
        {
          title: 'Propriété intellectuelle',
          body: (
            <>
              <p>
                Les textes, photographies, logos, visuels et enregistrements publiés sur ce site appartiennent à
                l&apos;église {church.name} ou à leurs auteurs. Ils ne peuvent pas être copiés, modifiés ou diffusés
                sans autorisation écrite préalable, sauf pour un usage personnel et non commercial.
              </p>
              <p>
                Les textes bibliques proviennent de versions tombées dans le domaine public (Louis Segond, Martin,
                Ostervald, Darby).
              </p>
            </>
          )
        },
        {
          title: 'Contenus et responsabilité',
          body: (
            <>
              <p>
                Nous veillons à l&apos;exactitude des informations publiées (horaires, événements, coordonnées), mais
                elles peuvent changer. En cas de doute, contactez-nous avant de vous déplacer.
              </p>
              <p>
                Les témoignages et les offres de services proposés par des membres sont publiés sous la responsabilité
                de leurs auteurs, après une vérification par l&apos;église. Leur publication n&apos;engage pas
                l&apos;église sur la qualité des services proposés ni sur les transactions conclues entre membres.
              </p>
              <p>
                Le site contient des liens vers des sites tiers (YouTube, Instagram, Facebook). Nous ne contrôlons pas
                leur contenu et déclinons toute responsabilité à leur sujet.
              </p>
            </>
          )
        },
        {
          title: 'Dons',
          body: (
            <p>
              La page « Dons » indique seulement les moyens de faire un don à l&apos;église. Aucun paiement n&apos;est
              effectué ni enregistré sur ce site.
            </p>
          )
        },
        {
          title: 'Droit applicable',
          body: (
            <p>
              Le site est soumis au droit de la République démocratique du Congo. Pour toute question sur ces mentions,
              écrivez-nous depuis la <Link href="/contact" className="text-gn-gold-line underline">page Contact</Link>.
            </p>
          )
        }
      ]}
    />
  );
}
