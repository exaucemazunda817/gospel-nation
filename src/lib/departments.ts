// Présentation des départements sur les pages publiques : résumé d'une ligne et
// famille de classement. Les résumés reprennent mot pour mot les faits déjà
// validés dans la description complète de chaque département (base de données),
// sans rien ajouter ; la fiche du département garde le texte entier.

export const DEPARTMENT_FAMILIES = [
  'Louange et prière',
  'Enfants et jeunesse',
  'Hommes et femmes',
  'Formation',
  'Médias',
  'Accueil et service'
] as const;

export type DepartmentFamily = (typeof DEPARTMENT_FAMILIES)[number];

const FAMILY_BY_SLUG: Record<string, DepartmentFamily> = {
  'gn-music': 'Louange et prière',
  fire: 'Louange et prière',
  'gospel-kids': 'Enfants et jeunesse',
  'nation-united': 'Enfants et jeunesse',
  'one-nation': 'Enfants et jeunesse',
  valorous: 'Hommes et femmes',
  'ladies-nation': 'Hommes et femmes',
  'ecole-nation-classe': 'Formation',
  'gospel-prod': 'Médias',
  'gospel-news': 'Médias',
  accueil: 'Accueil et service',
  'one-love': 'Accueil et service',
  'gospel-cafe': 'Accueil et service'
};

const SUMMARY_BY_SLUG: Record<string, string> = {
  fire: 'Prière et intercession, deux fois par semaine.',
  accueil: "Accueil des visiteurs et des nouveaux membres, et orientation au sein de l'église.",
  'gospel-kids': "Encadrement spirituel et enseignement des enfants de l'église.",
  'nation-united': 'Le ministère de la jeunesse : activité hebdomadaire le mardi, Jésus Camp, Heaven Ciné.',
  'one-love': 'Au service des enfants de la rue de Kinshasa : éducation, accompagnement social et sanitaire.',
  'one-nation': "L'équipe de basketball de l'église, pour impacter et évangéliser par le sport.",
  valorous: 'Le ministère des hommes : « Men according to God », Leader, Époux, Père, Ami.',
  'ecole-nation-classe': "L'école de formation de Gospel Nation, en trois parcours : Appelés, Ouvriers, Ministères.",
  'gospel-cafe': 'Un espace convivial et évangélique : musique, soirées à thème, Comedy Club.',
  'gospel-prod': "Le ministère audiovisuel : série, court-métrage, label artistique et communication de l'église.",
  'gn-music': 'Louange et chorale : Worship Fire, Worship Night et sortie évangélique.',
  'gospel-news': "Le journal trimestriel de l'église, à retrouver dans la Bibliothèque.",
  'ladies-nation': 'Le ministère des femmes : six rencontres par an autour de la vie et de la foi.'
};

export function departmentFamily(slug: string): DepartmentFamily | 'Autres' {
  return FAMILY_BY_SLUG[slug] ?? 'Autres';
}

// Repli pour un département ajouté plus tard : première phrase de la description.
export function departmentSummary(dept: { slug: string; description: string }): string {
  const known = SUMMARY_BY_SLUG[dept.slug];
  if (known) return known;
  const first = dept.description.split(/(?<=[.!?])\s/)[0] ?? dept.description;
  return first.replace(' — ', ', ');
}
