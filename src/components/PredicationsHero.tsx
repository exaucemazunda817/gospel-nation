import PageHero from '@/components/PageHero';

// Bandeau commun aux pages de prédications (liste, prédication choisie, catalogue).
export default function PredicationsHero({
  title,
  subtitle,
  crumb
}: {
  title: string;
  subtitle: string;
  // Fil d'Ariane : la page courante, précédée d'un lien vers /predications si `parent` est vrai.
  crumb: { label: string; parent?: boolean };
}) {
  return (
    <PageHero
      crumbs={[...(crumb.parent ? [{ label: 'Prédications', href: '/predications' }] : []), { label: crumb.label }]}
      title={title}
      subtitle={subtitle}
      image="/hero/predications.jpg"
      imagePosition="50% 30%"
    />
  );
}
