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
    { day: 'Dimanche', time: '8h30 – 9h30', label: "Culte d'intercession" },
    { day: 'Dimanche', time: '9h30', label: 'Culte du dimanche' },
    { day: 'Mardi', time: '17h', label: 'Nation United, culte de la jeunesse' },
    { day: 'Mercredi', time: '17h30', label: "Culte d'enseignement" },
    { day: 'Vendredi', time: '17h', label: "Culte d'intercession" }
  ],
  addressIsPlaceholder: false,
  address:
    'Av. Pembe Didace, Ma Campagne — à 100 m de la place commerciale en montant l\'avenue Joli-Parc',
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

// Gospel Family n'est pas un département mais un moment de communion
// fraternelle mensuel (confirmé par Mazunda le 10/09/2026).
export const gospelFamilyNote =
  'Gospel Family — un moment de partage et de communion fraternelle, organisé chaque dernier dimanche du mois.';

// Baptêmes : service/événement ponctuel, pas un département permanent
// (confirmé par Mazunda le 10/09/2026) — pas de date précise à afficher
// tant que non communiquée.
export const baptemeNote =
  "Nous organisons régulièrement des sessions de baptême par immersion. Rapprochez-vous du département Welcome pour connaître la prochaine session.";

export const predicationsPlaceholder =
  'Aucune prédication publiée pour le moment. Cette page accueillera les notes et vidéos de nos cultes.';

export const blogPlaceholder =
  'Aucun article publié pour le moment. Gospel News accueillera bientôt les actualités et réflexions liées à la vie de notre église.';

export const temoignagesPlaceholder =
  'Aucun témoignage publié pour le moment. Soyez le premier à partager ce que Dieu a fait dans votre vie !';

export const donsPlaceholder =
  "Les coordonnées de don (Mobile Money, virement bancaire) seront publiées ici une fois confirmées par l'église.";

// Départements réels confirmés par Mazunda le 10/09/2026 (corrige la liste
// devinée depuis Instagram : Gospel Family n'est pas un département — voir
// gospelFamilyNote — et Baptêmes est un service ponctuel — voir baptemeNote).
// Les descriptions ci-dessous sont des phrases génériques rédigées à partir
// du seul nom de chaque département : provisoires, à valider avec l'église
// avant de les considérer comme définitives.
export const departmentSeeds = [
  {
    name: 'Worship Gospel Nation',
    slug: 'worship',
    description:
      "Département en charge de la louange et de l'adoration pendant les cultes et événements de l'église.",
    imageUrl: '/departments/worship.jpg'
  },
  {
    name: 'Intercession',
    slug: 'intercession',
    description:
      "Département de prière et d'intercession pour l'église, ses membres et ses projets.",
    imageUrl: '/departments/intercession.jpg'
  },
  {
    name: 'Media',
    slug: 'media',
    description:
      "Département en charge de la communication et de la production audiovisuelle de l'église (réseaux sociaux, captation, diffusion)."
  },
  {
    name: 'Welcome',
    slug: 'welcome',
    description:
      "Département chargé d'accueillir les visiteurs et nouveaux membres et de les orienter au sein de l'église."
  },
  {
    name: 'Gospel Kids',
    slug: 'gospel-kids',
    description:
      "Département dédié à l'encadrement spirituel et à l'enseignement des enfants de l'église.",
    imageUrl: '/departments/gospel-kids-v2.jpg'
  },
  {
    name: 'Nation United',
    slug: 'nation-united',
    description:
      "Département de la jeunesse de Gospel Nation, qui regroupe plusieurs pôles dédiés aux jeunes.",
    imageUrl: '/departments/nation-united.jpg'
  },
  {
    name: 'One Love',
    slug: 'one-love',
    description:
      "Ministère de l'église au service des enfants de la rue (orphelinat).",
    imageUrl: '/departments/one-love-v2.jpg'
  },
  {
    name: 'One Nation',
    slug: 'one-nation',
    description:
      "Équipe de basketball de l'église, fondée le 14 août 2023 et dirigée par le pasteur Kanda Kabangu (coach). Elle a pour mission de mettre en valeur les dons que Dieu a déposés en chaque joueur, pour impacter et évangéliser le monde par le basketball.",
    imageUrl: '/departments/one-nation.jpg'
  },
  {
    name: 'Valorous',
    slug: 'valorous',
    description:
      "Ministère des hommes de Gospel Nation — « Men according to God » : Leader, Époux, Père, Ami. Dirigé par le frère Étienne Mabunda, ce ministère rassemble les hommes de l'église pour la communion fraternelle et la croissance spirituelle.",
    imageUrl: '/events/valorous-2026-09-26.jpeg'
  },
  {
    name: 'École Nation Classe',
    slug: 'ecole-nation-classe',
    description:
      "Incubateur des leaders de Gospel Nation. Formation en trois parcours — Appelés (Fondations), Ouvriers (Service) et Ministères (Appel & Impact) — pour former des personnes affermies dans leur identité, transformées dans leur caractère, équipées pour leur mission et envoyées pour impacter leur génération."
  }
] as const;

// Services et petites entreprises tenus par des membres de l'église — publiés
// dans la revue Gospel News Vol. 3 (31 mai 2026). Le "coin des offres et
// services" (modèle MemberOffer) accueillera plus tard aussi les offres
// d'emploi, une fois les comptes membres (Clerk) actifs.
export const memberOfferSeeds = [
  {
    ownerClerkUserId: 'seed-kenaya-delights',
    ownerFirstName: 'Kenaya',
    ownerLastName: '(Delights by K)',
    title: 'Delights by K',
    category: 'Restauration / Traiteur',
    description:
      "Le goût fait maison, le plaisir à chaque bouchée ! Samoussas (viande et poisson), boulettes de viande, beignets soufflés, gaufres et crêpes — pour vos pauses gourmandes, réunions, anniversaires et événements spéciaux. Livraison à domicile disponible.",
    contactPhone: '+243836903753'
  },
  {
    ownerClerkUserId: 'seed-nutrimix',
    ownerFirstName: 'Exauce',
    ownerLastName: 'Mazunda (Nutrimix)',
    title: 'Bouillie Nutrimix',
    category: 'Alimentation / Nutrition',
    description:
      "Bouillie naturelle à base de six céréales et légumineuses (soja, blé, millet, maïs jaune, arachide, riz), sans ajout de produits chimiques, conçue pour répondre aux besoins énergétiques et nutritionnels de toute la famille. Disponible par livraison.",
    contactPhone: '+243828516026',
    contactEmail: 'service.nutrimix@gmail.com',
    externalUrl: 'https://nutrimix-store.vercel.app'
  },
  {
    ownerClerkUserId: 'seed-sisi-crea',
    ownerFirstName: 'Sisi',
    ownerLastName: '(SISI CRÉA)',
    title: 'SISI CRÉA',
    category: 'Audiovisuel / Communication digitale',
    description:
      "Structure spécialisée dans la création de contenus audiovisuels et digitaux à Kinshasa : couverture d'événements, mariages et anniversaires, promotion de boutiques et marques, valorisation de maisons de beauté et salons de coiffure, animations MC et réalisation de clips vidéo.",
    contactPhone: null
  }
] as const;

// Événements à venir — affiche fournie par Mazunda le 10/09/2026.
export const eventSeeds = [
  {
    slug: 'valorous-26-09-2026',
    title: 'Valorous — La fraternité d\'hommes de valeur',
    posterImageUrl: '/events/valorous-2026-09-26.jpeg',
    description: 'Thème : « Guérir de la blessure du père ». Le ministère des hommes.',
    eventDate: new Date('2026-09-26T10:00:00'),
    location: church.address
  }
] as const;

// Article Gospel News fourni intégralement par Mazunda le 10/09/2026 — texte
// publié tel quel, sans réécriture ni ajout.
export const blogSeeds = [
  {
    slug: 'equipe-one-nation-basketball',
    title:
      "L'équipe de basket One Nation de l'église Gospel Nation : Unis pour impacter le monde par le basketball",
    category: "Vie d'église",
    excerpt:
      "Fondée le 14 août 2023 et dirigée par le pasteur Kanda Kabangu, l'équipe de basketball One Nation utilise le sport pour témoigner et évangéliser.",
    content: `Introduction :
L'équipe de basket One Nation est un véritable phénomène au sein de l'église Gospel Nation. Fondée le 14 août 2023, cette équipe, dirigée par le pasteur Kanda Kabangu, pasteur hôte de l'église, a rapidement acquis une renommée grâce à ses performances impressionnantes sur le terrain. Portée par le capitaine Michael Mwaku et le vice-capitaine Kevin Mwepu, One Nation s'est donné pour mission de démontrer les dons que Dieu a déposés en chaque joueur afin d'impacter et d'évangéliser le monde par le basketball.

Le parcours de l'équipe :
Depuis sa création, l'équipe One Nation a connu des succès remarquables. Avec un bilan de 3 victoires pour 2 défaites lors de matchs officiels, l'équipe a su se démarquer par sa détermination et son esprit d'équipe. Les membres de l'équipe, tels que Stone Mugisho, Néhémie Wal, Winner Ize, Derclay Banza, Isaac Betu, Tegra Alfani, Ndeke Joyce et Lunzayila Jonathan, apportent chacun leur propre style de jeu et contribuent à la cohésion et à la performance de l'équipe.

Le rôle du pasteur Kanda Kabangu :
En tant que coach de l'équipe, le pasteur Kanda Kabangu joue un rôle essentiel dans la réussite de One Nation. Au-delà de son rôle de pasteur, il met en avant ses compétences en tant qu'entraîneur pour guider et motiver les joueurs. Sa passion pour le basketball et sa foi inébranlable en Dieu font de lui un leader inspirant pour les membres de l'équipe.

Impacter et évangéliser le monde par le basketball :
L'objectif principal de l'équipe One Nation est de démontrer les dons que Dieu a déposés en chaque joueur, en utilisant le basketball comme moyen d'expression. Chaque match est une occasion de montrer que la foi et le sport peuvent aller de pair, et que les talents sportifs peuvent être mis au service de l'évangélisation. L'équipe One Nation est un exemple vivant de l'impact positif que peut avoir le basketball dans la vie des joueurs et de ceux qui les entourent.

Conclusion :
L'équipe de basket One Nation de l'église Gospel Nation est bien plus qu'une simple équipe sportive. Elle incarne la passion, la foi et la détermination de ses membres, qui ont pour mission d'impacter et d'évangéliser le monde par le basketball. Sous la direction du pasteur Kanda Kabangu et portée par le capitaine Michael Mwaku, l'équipe One Nation continue de briller sur le terrain tout en témoignant de l'amour et de la puissance de Dieu.`,
    publishedAt: new Date('2026-09-10')
  }
] as const;
