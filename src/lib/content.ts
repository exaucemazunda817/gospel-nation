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
    { day: 'Dimanche', time: '9h30 – 11h30', label: 'Culte du dimanche' },
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
    name: 'Fire',
    slug: 'fire',
    description:
      "Département de prière et d'intercession de Gospel Nation, deux fois par semaine, avec des programmes variés. Coordonné par Maman Annie.",
    imageUrl: '/departments/fire-hq.png'
  },
  {
    name: 'Accueil',
    slug: 'accueil',
    description:
      "Département chargé d'accueillir les visiteurs et nouveaux membres et de les orienter au sein de l'église.",
    imageUrl: '/departments/accueil-hq.png'
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
      "Ministère de la jeunesse de Gospel Nation. Il rassemble les jeunes autour d'une activité hebdomadaire (le mardi, coordonnée par Chris Luyeye), d'une retraite annuelle (le Jésus Camp), d'une soirée festive (Heaven Ciné) et de temps d'échange (talk-shows, United Youth Session), pour renforcer leur foi et leur communauté.",
    imageUrl: '/departments/nation-united-hq.png'
  },
  {
    name: 'One Love',
    slug: 'one-love',
    description:
      "Ministère de l'église au service des enfants de la rue, porté par l'association One Love (fondée en 2010 par le pasteur Kanda Kabangu et son épouse) : valoriser les enfants marginalisés de Kinshasa par l'éducation et un accompagnement social et sanitaire.",
    imageUrl: '/departments/one-love-hq.png'
  },
  {
    name: 'One Nation',
    slug: 'one-nation',
    description:
      "Équipe de basketball de l'église, fondée le 14 août 2023 et dirigée par le pasteur Kanda Kabangu (coach). Elle a pour mission de mettre en valeur les dons que Dieu a déposés en chaque joueur, pour impacter et évangéliser le monde par le basketball. Elle organise chaque année la compétition « Champions of Kingdom », sur six mois.",
    imageUrl: '/departments/one-nation-hq.png'
  },
  {
    name: 'Valorous',
    slug: 'valorous',
    description:
      "Ministère des hommes de Gospel Nation — « Men according to God » : Leader, Époux, Père, Ami. Dirigé par le frère Étienne Mabunda, ce ministère rassemble les hommes de l'église pour la communion fraternelle et la croissance spirituelle, à travers un rassemblement six fois par an.",
    imageUrl: '/departments/valorous-hq.png'
  },
  {
    name: 'École Nation Classe',
    slug: 'ecole-nation-classe',
    description:
      "Incubateur des leaders de Gospel Nation. Formation en trois parcours — Appelés (Fondations), Ouvriers (Service) et Ministères (Appel & Impact) — pour former des personnes affermies dans leur identité, transformées dans leur caractère, équipées pour leur mission et envoyées pour impacter leur génération.",
    imageUrl: '/departments/ecole-nation-classe.jpg'
    // Le programme complet (vision, parcours, modules) est détaillé plus bas
    // dans `nationClasseProgram`, fourni par Mazunda le 12/09/2026.
  },
  // Cinq départements ajoutés le 14/09/2026 à partir du document officiel
  // "Gospel Nation - Organisation 2025" (organigramme + programme annuel)
  // fourni par Mazunda — descriptions et coordinateurs repris de ce document.
  {
    name: 'Gospel Café',
    slug: 'gospel-cafe',
    description:
      "Ministère convivial et évangélique de Gospel Nation : un espace souvent gratuit où l'on se réunit pour des moments de joie, des prestations musicales et des activités variées (battles, soirées à thème, karaoké...), lieu de partage et d'évangélisation. Il organise aussi chaque année un Comedy Club. Coordonné par Nader, Kanda et Tim.",
    imageUrl: '/departments/gospel-cafe-hq.png'
  },
  {
    name: 'Gospel Prod',
    slug: 'gospel-prod',
    description:
      "Ministère audiovisuel de Gospel Nation : production de la série Mission et du court-métrage Mission Genesis, gestion d'un label artistique qui accompagne plusieurs musiciens, chanteurs et rappeurs (Maïté, Victor, Maryse, Jrd, Georges), et communication de l'église au quotidien. Coordonné par Tim Ntalaja.",
    imageUrl: '/departments/gospel-prod-hq.png'
  },
  {
    name: 'Gospel Nation Music',
    slug: 'gn-music',
    description:
      "Groupe de louange et de chorale de Gospel Nation. Il organise plusieurs temps forts dans l'année — le Worship Fire (trois fois par an), une Worship Night annuelle et une sortie évangélique — pour rassembler et inviter à découvrir l'église à travers la musique.",
    imageUrl: '/departments/gospel-nation-music-hq.png'
  },
  {
    name: 'Gospel News',
    slug: 'gospel-news',
    description:
      "Ministère responsable du journal trimestriel de Gospel Nation, publié en janvier, mai et septembre. Ces journaux résument les activités passées, annoncent les programmes à venir et partagent les nouvelles de la communauté — à retrouver dans la Bibliothèque du site. Coordonné par Maryse.",
    imageUrl: '/departments/gospel-news-hq.png'
  },
  {
    name: 'Ladies Nation',
    slug: 'ladies-nation',
    description:
      "Ministère des femmes de Gospel Nation. Six fois par an, elles se réunissent pour échanger sur des sujets liés à leur quotidien et à leur foi. Coordonné par Kenya.",
    imageUrl: '/departments/ladies-nation-hq.png'
  }
] as const;

// Programme détaillé de l'École Nation Classe (École Gospel Nation), fourni
// par Mazunda le 12/09/2026. Trois parcours progressifs : Appel → Service →
// Impact. Affiché sur la page de détail du département (slug
// "ecole-nation-classe").
export const nationClasseProgram = {
  tagline: 'Appel → Service → Impact',
  vision:
    "L'École Gospel Nation (Nation Classe) a pour objectif de former des hommes et des femmes affermis dans leur identité, transformés dans leur caractère, équipés pour leur mission et envoyés pour impacter leur génération, à travers une école proposant trois parcours, trois dimensions profondes.",
  parcours: [
    {
      name: 'Les Appelés',
      subtitle: 'Fondations profondes de la foi',
      summary: 'Qui tu es',
      description:
        "Ce parcours pose les bases essentielles et profondes de la vie chrétienne. Il ne s'agit pas de simples notions, mais d'une transformation intérieure. Pour ceux qui souhaitent repartir sur de bonnes bases, il est vivement conseillé.",
      objective: 'Être enraciné et fondé, ne plus retourner en arrière, raffermir la marche.',
      modules: [
        'Introduction — vision de la classe',
        "Qu'est-ce que l'homme",
        'Qui est Dieu',
        'Relation Dieu & Homme',
        'Le péché',
        'Le salut',
        'Jésus-Christ',
        'Nouvelle identité',
        'Baptême du Saint-Esprit',
        'La Parole de Dieu',
        'La prière',
        'Repentance & transformation',
        "Vie dans l'Esprit",
        'Communion fraternelle'
      ]
    },
    {
      name: 'Les Ouvriers',
      subtitle: 'Servir avec caractère et maturité',
      summary: 'Comment tu sers',
      description:
        "Ce parcours est destiné à ceux qui souhaitent servir Dieu efficacement, avec un cœur transformé et une compréhension du service. Obligatoire pour tous ceux qui servent à Gospel Nation.",
      objective: "Servir avec justesse, maturité et impact, contribuer à l'expansion de l'église.",
      modules: [
        'Introduction — vision',
        'Béatitudes',
        "Fruit de l'Esprit",
        'Caractère',
        'Dons spirituels',
        'Église et fonctionnement',
        'Influence (leadership)',
        "Vision de l'Église",
        "Culture de l'honneur",
        'Discipline & fidélité',
        'Travail en équipe',
        'Gestion des offenses',
        'Excellence dans le service',
        'Soumission & autorité'
      ]
    },
    {
      name: 'Les Ministères',
      subtitle: 'Être équipé pour impacter dans le monde',
      summary: 'Où tu impactes',
      description:
        "Ce parcours est destiné à ceux qui portent un appel spécifique, dans l'Église ou dans les différentes sphères d'influence de la société.",
      objective: 'Former des leaders qui impactent les nations.',
      modules: [
        'Vocation',
        'Dons',
        'Les 5 ministères',
        'Vision et mission',
        'Discernement spirituel',
        'Autorité spirituelle',
        "Gestion de l'onction",
        'Leadership & responsabilité',
        'Influence dans les sphères',
        "Achever l'œuvre (échecs, transmission)"
      ]
    }
  ]
} as const;

// Manuels réels du parcours "Les Appelés", fournis en PDF par Mazunda le
// 12/09/2026, stockés dans public/nation-classe/. À compléter au fur et à
// mesure que les manuels des autres modules/parcours seront transmis.
export const nationClasseManuels = [
  {
    parcours: 'Les Appelés',
    module: "Module 1 — Qu'est-ce que l'homme",
    fileUrl: '/nation-classe/module-1-quest-ce-que-lhomme.pdf'
  },
  {
    parcours: 'Les Appelés',
    module: 'Module 2 — Qui est Dieu',
    fileUrl: '/nation-classe/module-2-qui-est-dieu.pdf'
  }
] as const;

// Revues Gospel News réellement publiées, fournies en PDF par Mazunda au fur
// et à mesure (le journal trimestriel paraît en janvier, mai et septembre —
// voir la description du département). Stockées dans public/bibliotheque/
// (même fichier proposé aussi comme article de la Bibliothèque). À compléter
// avec les volumes suivants et, si un jour retrouvé, le volume 1.
export const gospelNewsIssues = [
  {
    volume: 3,
    date: '31 mai 2026',
    fileUrl: '/bibliotheque/revue-gospel-news-vol-3.pdf'
  },
  {
    volume: 2,
    date: '30 mars 2025',
    fileUrl: '/bibliotheque/revue-gospel-news-vol-2.pdf'
  }
] as const;

// One Love : contenu réel sourcé le 13/09/2026 sur associationonelove.org
// (mission, vision, fondateurs) et sur la page Facebook @associationonelove
// (projet en cours RÊVES 2 et ses photos). Mazunda a transmis les photos
// directement dans le dossier du projet — les liens Facebook individuels des
// vidéos/reels n'ont pas pu être récupérés (Facebook bloque le contenu des
// publications derrière une connexion), donc seul un lien vers la page/les
// reels publics est utilisé, pas de vidéo individuelle inventée.
export const oneLoveOrg = {
  foundedYear: 2010,
  founders: 'Kanda Kabangu et son épouse',
  facebookUrl: 'https://www.facebook.com/associationonelove',
  facebookReelsUrl: 'https://www.facebook.com/associationonelove/reels_tab',
  websiteUrl: 'http://associationonelove.org',
  vision:
    "L'amour est un besoin fondamental de l'être humain. Toute personne victime d'exclusion devrait pouvoir satisfaire ce besoin d'être aimée.",
  mission:
    "Réaliser des projets en République Démocratique du Congo qui ont pour objet de valoriser les populations marginalisées, en particulier les enfants.",
  objectifs: [
    "Permettre l'accès à un mode de vie décent par l'éducation et des actions sociales et sanitaires.",
    'Co-construire des programmes de (ré)insertion professionnelle.',
    'Accompagner les bénéficiaires dans leur accomplissement professionnel et/ou personnel.'
  ]
} as const;

export const oneLoveProject = {
  name: 'RÊVES 2',
  tagline: 'Réaménager – Éduquer – Valoriser – Écouter – Soigner',
  partner: 'Angel Foundation',
  period: 'Septembre à décembre 2026 (4 mois)',
  intro:
    "Lancé une première fois l'année dernière, le projet RÊVES revient avec une deuxième phase, davantage axée sur l'éducation, en partenariat avec Angel Foundation.",
  description:
    "Sur une période de 4 mois (septembre à décembre), RÊVES 2 propose aux enfants de One Love un accompagnement structuré combinant alphabétisation, apprentissage du français, activités culturelles, sportives et artistiques. Le projet comprend également la formation des animateurs, le renforcement des ressources pédagogiques et la mise à disposition de matériel informatique. Il intègre aussi un suivi médical et psychosocial régulier pour les enfants.",
  objectif: "Renforcer les compétences, la confiance et l'autonomie des enfants.",
  firstMilestone: {
    label: "Premiers pas dans l'alphabétisation",
    date: 'Samedi 5 septembre 2026'
  }
} as const;

export const oneLoveGallery = [
  {
    src: '/departments/one-love/reves2-annonce.jpg',
    caption: "Premiers pas dans l'alphabétisation — samedi 5 septembre 2026, lancement du programme RÊVES 2."
  },
  {
    src: '/departments/one-love/reves2-arrivee.jpg',
    caption: 'Les enfants arrivent au centre One Love, prêts à découvrir et apprendre.'
  },
  {
    src: '/departments/one-love/reves2-formateurs.jpg',
    caption: 'Les formateurs du programme RÊVES 2, mobilisés pour encadrer les enfants.'
  },
  {
    src: '/departments/one-love/reves2-enfant-1.jpg',
    caption: "Un enfant du centre One Love, pendant une pause entre deux activités."
  },
  {
    src: '/departments/one-love/reves2-enfant-2.jpg',
    caption: "Atelier d'écriture en fin de journée, sur le programme d'alphabétisation."
  },
  {
    src: '/departments/one-love/reves2-enfant-3.jpg',
    caption: "Une enfant concentrée sur son cahier pendant l'atelier d'alphabétisation."
  },
  {
    src: '/departments/one-love/reves2-atelier-1.jpg',
    caption: 'Atelier de coloriage et de lecture en petits groupes.'
  },
  {
    src: '/departments/one-love/reves2-atelier-2.jpg',
    caption: 'Deux enfants dessinent ensemble pendant une activité artistique.'
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
