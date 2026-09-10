// Contenu du site Gospel Nation.
// Les champs marqués [À COMPLÉTER] sont des textes provisoires — à remplacer
// par le contenu officiel validé par l'église avant toute mise en ligne
// publique. Le reste (nom, pasteur, horaires, comptes liés) vient des
// comptes Instagram publics de l'église, consultés le 10/09/2026.

export const church = {
  name: 'Gospel Nation',
  fullName: 'Gospel Nation Church',
  tagline: 'Le Royaume de Dieu sur terre',
  mainPastor: {
    name: 'Kanda Kabangu',
    instagram: '@kandakabangu',
    title: 'Pasteur principal'
  },
  schedule: [
    { day: 'Dimanche', time: '9h30', label: 'Culte du dimanche' },
    { day: 'Mercredi', time: '17h30', label: 'Culte du mercredi' }
  ],
  addressIsPlaceholder: true,
  address: '[À COMPLÉTER] Av. Joli-Parc, Kinshasa (adresse tronquée sur Instagram)',
  city: 'Kinshasa, RDC',
  youtube: 'https://m.youtube.com/@gospel.nation',
  instagram: 'https://www.instagram.com/gospel.nation'
} as const;

export const linkedAccounts = [
  {
    name: 'Gospel Prod',
    handle: '@gospel.prod',
    url: 'https://www.instagram.com/gospel.prod',
    description: "Maison de production audiovisuelle de l'église."
  },
  {
    name: 'Gospel Café',
    handle: '@gospel.cafe',
    url: 'https://www.instagram.com/gospel.cafe',
    description:
      "Émission/plateforme gospel, slam, urban et témoignages — \"From RDC to the world\"."
  },
  {
    name: 'Gospel Nation Music',
    handle: '@gospel_nation_music',
    url: 'https://www.instagram.com/gospel_nation_music',
    description: "Pôle musique/louange de l'église — Ésaïe 61:1-3."
  }
] as const;

export const missionPlaceholder =
  "[À COMPLÉTER] La mission et la vision complètes de Gospel Nation seront ajoutées ici une fois le texte validé par le pasteur principal.";

export const histoirePlaceholder =
  "[À COMPLÉTER] L'histoire de l'église (contexte de création, étapes marquantes) sera ajoutée ici une fois le contenu validé.";

export const predicationsPlaceholder =
  'Aucune prédication publiée pour le moment. Cette page accueillera les notes et vidéos de nos cultes.';

export const blogPlaceholder =
  'Aucun article publié pour le moment. Gospel News accueillera bientôt les actualités et réflexions liées à la vie de notre église.';

export const temoignagesPlaceholder =
  'Aucun témoignage publié pour le moment. Soyez le premier à partager ce que Dieu a fait dans votre vie !';

export const donsPlaceholder =
  "Les coordonnées de don (Mobile Money, virement bancaire) seront publiées ici une fois confirmées par l'église.";

// Départements/ministères vus publiquement sur Instagram (noms réels) —
// descriptions détaillées à valider avec l'église.
export const departmentSeeds = [
  {
    name: 'Gospel Family',
    slug: 'gospel-family',
    description: '[À COMPLÉTER] Description du département Gospel Family.'
  },
  {
    name: 'Worship',
    slug: 'worship',
    description: '[À COMPLÉTER] Description du département Worship.'
  },
  {
    name: 'Ministries',
    slug: 'ministries',
    description: '[À COMPLÉTER] Description du département Ministries.'
  },
  {
    name: 'Gospel Kids',
    slug: 'gospel-kids',
    description: '[À COMPLÉTER] Description du département Gospel Kids.'
  },
  {
    name: 'Baptêmes',
    slug: 'baptemes',
    description: '[À COMPLÉTER] Description / prochaine session de baptêmes.'
  },
  {
    name: 'One Love',
    slug: 'one-love',
    description:
      "Ministère de l'église au service des enfants de la rue (orphelinat)."
  }
] as const;
