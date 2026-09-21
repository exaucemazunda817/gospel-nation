import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPage from '@/components/LegalPage';
import { church } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Confidentialité',
  description: `Politique de confidentialité du site de ${church.fullName} : données collectées, usage, conservation et droits.`
};

export default function ConfidentialitePage() {
  return (
    <LegalPage
      title="Confidentialité"
      intro="Quelles informations nous recueillons, pourquoi, et comment vous gardez la maîtrise de vos données."
      updated="21 septembre 2026"
      sections={[
        {
          title: 'Qui est responsable de vos données',
          body: (
            <p>
              L&apos;église <strong>{church.fullName}</strong> ({church.address}, {church.city}) décide des données
              recueillies sur ce site et de leur usage. Vous pouvez la joindre depuis la{' '}
              <Link href="/contact" className="text-gn-gold-line underline">page Contact</Link>.
            </p>
          )
        },
        {
          title: 'Les données que nous recueillons',
          body: (
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Inscription comme membre :</strong> nom, prénom, e-mail, téléphone, adresse, commune, sexe, date
                de naissance, année d&apos;arrivée dans l&apos;église, département (facultatif) et une photo. Vous
                choisissez vous-même si votre anniversaire peut apparaître publiquement.
              </li>
              <li>
                <strong>Formulaire de contact :</strong> nom, e-mail, sujet et message.
              </li>
              <li>
                <strong>Demande de rendez-vous pastoral :</strong> nom, téléphone, e-mail (facultatif) et motif.
              </li>
              <li>
                <strong>Témoignage :</strong> nom, texte, lien vidéo éventuel, et votre choix de le publier ou non.
              </li>
              <li>
                <strong>Compte visiteur (plan de lecture, offres de services) :</strong> les informations de connexion
                gérées par notre prestataire Clerk, et votre progression de lecture.
              </li>
            </ul>
          )
        },
        {
          title: 'Pourquoi nous les utilisons',
          body: (
            <ul className="list-disc space-y-2 pl-5">
              <li>Vous délivrer votre carte de membre et tenir le registre des membres de l&apos;église.</li>
              <li>Répondre à vos messages et organiser les rendez-vous avec le pasteur.</li>
              <li>Publier, avec votre accord, les témoignages et les offres de services, après vérification.</li>
              <li>Vous permettre de suivre le plan de lecture biblique depuis votre compte.</li>
            </ul>
          )
        },
        {
          title: 'Ce qui est visible publiquement',
          body: (
            <p>
              Votre photo, votre téléphone, votre adresse et votre e-mail ne sont jamais affichés sur le site. Seuls les
              témoignages que vous avez accepté de publier (avec le nom que vous avez saisi) et les offres de services
              validées apparaissent au public. Une offre de service affiche le contact que son auteur a lui-même choisi
              d&apos;indiquer.
            </p>
          )
        },
        {
          title: 'Qui y a accès',
          body: (
            <>
              <p>
                Les données des membres, des messages et des rendez-vous ne sont consultables que par les
                administrateurs de l&apos;église, depuis un espace protégé par mot de passe. Nous ne vendons pas vos
                données et ne les transmettons pas à des annonceurs.
              </p>
              <p>Pour faire fonctionner le site, nous faisons appel à des prestataires techniques :</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Vercel</strong> : hébergement du site et stockage privé des photos d&apos;inscription.
                </li>
                <li>
                  <strong>Neon</strong> : base de données où sont enregistrées les informations ci-dessus.
                </li>
                <li>
                  <strong>Clerk</strong> : création de compte et connexion.
                </li>
                <li>
                  <strong>YouTube</strong> : lecture des prédications. Les vignettes proviennent de YouTube ; le lecteur
                  vidéo ne se charge qu&apos;au moment où vous cliquez.
                </li>
              </ul>
              <p>
                Ces prestataires sont situés à l&apos;étranger : vos données peuvent donc être traitées hors de la
                République démocratique du Congo.
              </p>
            </>
          )
        },
        {
          title: 'Combien de temps nous les gardons',
          body: (
            <p>
              Les données d&apos;un membre sont conservées tant qu&apos;il fait partie de l&apos;église ou jusqu&apos;à
              sa demande de suppression. Les messages de contact et les demandes de rendez-vous sont conservés le temps
              nécessaire à leur traitement.
            </p>
          )
        },
        {
          title: 'Vos droits',
          body: (
            <>
              <p>
                Vous pouvez à tout moment demander à consulter, corriger ou faire supprimer vos données, retirer votre
                accord de publication d&apos;un témoignage, ou demander la suppression de votre compte et de votre
                photo.
              </p>
              <p>
                Pour cela, écrivez-nous depuis la <Link href="/contact" className="text-gn-gold-line underline">page Contact</Link>{' '}
                en précisant votre nom et le numéro de votre carte de membre. Nous vous répondrons dans les meilleurs
                délais.
              </p>
            </>
          )
        },
        {
          title: 'Cookies et traceurs',
          body: (
            <p>
              Le site n&apos;utilise ni publicité ni outil de mesure d&apos;audience. Il dépose seulement les cookies
              nécessaires à son fonctionnement : la connexion à un compte visiteur, la session de l&apos;espace
              administrateur, et le stockage local de votre navigateur pour retenir votre progression de lecture avant
              connexion.
            </p>
          )
        },
        {
          title: 'Sécurité',
          body: (
            <p>
              Les photos sont conservées dans un espace privé, jamais accessibles par une adresse publique. L&apos;accès
              à l&apos;administration est protégé et limité. Aucune méthode n&apos;offre toutefois une sécurité absolue :
              en cas d&apos;incident touchant vos données, nous vous en informerons.
            </p>
          )
        },
        {
          title: 'Modifications',
          body: (
            <p>
              Nous pouvons mettre à jour cette page. La date de dernière mise à jour figure en haut. En cas de
              changement important, nous l&apos;annoncerons sur le site.
            </p>
          )
        }
      ]}
    />
  );
}
