// Articles des revues Gospel News (Vol. 2 et Vol. 3), repris des PDF publiés.
// Le texte est celui des revues (seules les coupures de ligne du PDF ont été rétablies).
// Images : `poster` = affiche ou visuel vertical (montré en entier, sur un fond flou),
// `photo` = photo horizontale (remplit toute la largeur).

export type ArticleImage = {
  src: string;
  alt: string;
  kind: 'photo' | 'poster';
};

export type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'h'; text: string }
  | { type: 'quote'; text: string; source?: string }
  | { type: 'list'; items: string[] }
  | { type: 'image'; image: ArticleImage };

export type GospelNewsArticle = {
  slug: string;
  volume: number;
  date: string;
  title: string;
  author?: string;
  blocks: ArticleBlock[];
};

const p = (text: string): ArticleBlock => ({ type: 'p', text });
const h = (text: string): ArticleBlock => ({ type: 'h', text });
const list = (...items: string[]): ArticleBlock => ({ type: 'list', items });
const quote = (text: string, source?: string): ArticleBlock => ({ type: 'quote', text, source });
const img = (name: string, alt: string, kind: 'photo' | 'poster'): ArticleBlock => ({
  type: 'image',
  image: { src: `/gospel-news/${name}.jpg`, alt, kind }
});

export const gospelNewsArticles: GospelNewsArticle[] = [
  // ─────────────── Vol. 3 — 31 mai 2026 ───────────────
  {
    slug: 'brille-rayonne-et-impacte',
    volume: 3,
    date: '31 mai 2026',
    title: 'Brille, rayonne et impacte',
    author: 'Maryse',
    blocks: [
      img('brille-1', 'Panneau « Jésus, tu es ma joie »', 'poster'),
      quote(
        'Vous êtes le sel de la terre. Mais si le sel perd sa saveur, avec quoi la lui rendra-t-on ? Il ne sert plus qu’à être jeté dehors et foulé aux pieds par les hommes. Vous êtes la lumière du monde. Une ville située sur une montagne ne peut être cachée ; et l’on n’allume pas une lampe pour la mettre sous le boisseau, mais on la met sur le chandelier, et elle éclaire tous ceux qui sont dans la maison. Que votre lumière luise ainsi devant les hommes, afin qu’ils voient vos bonnes œuvres et qu’ils glorifient votre Père qui est dans les cieux.',
        'Matthieu 5:13-16 · Pensée inspirante du mois'
      ),
      p('Voilà un passage qui nous interpelle profondément. Essayons donc de comprendre ce qui en ressort réellement, ce que Jésus a voulu nous transmettre et pourquoi Il a choisi ces images si particulières.'),
      p('Il est toujours enrichissant de comprendre le sens des mots employés dans les Écritures. Dans ces versets, Jésus nous parle du sel, de la lumière et des œuvres. Ce sont des termes que nous rencontrons souvent dans la Parole de Dieu, mais en saisissons-nous réellement toute la richesse ?'),
      p('L’Évangile de Matthieu a été rédigé en grec, langue largement répandue à cette époque. Cependant, lorsque Jésus enseignait le peuple juif, Il s’exprimait principalement en araméen. Arrêtons-nous donc sur la portée des termes utilisés dans cette langue.'),
      h('Le sel : une influence qui transforme'),
      p('Lorsque Jésus déclare : « Vous êtes le sel de la terre », Il ne dit pas simplement que nous devons apporter une touche agréable au monde. Il nous révèle que notre vie doit refléter toutes les caractéristiques du sel.'),
      p('En araméen, le mot utilisé est Melḥā. Ce terme recouvre plusieurs dimensions :'),
      list(
        'La saveur : donner du goût.',
        'La pureté : nettoyer et purifier.',
        'La préservation : empêcher la corruption.',
        'L’alliance : symbole de fidélité et de permanence.',
        'Le sacrifice : élément indispensable dans les offrandes de l’Ancien Testament.',
        'La sagesse : des paroles justes, équilibrées et pleines de discernement.'
      ),
      p('À l’époque biblique, le sel servait à conserver les aliments, purifier l’eau, désinfecter les plaies et symboliser l’incorruptibilité. C’est pourquoi la Bible parle également d’« alliance de sel » (Lévitique 2:13 ; Nombres 18:19 ; 2 Chroniques 13:5).'),
      p('En tant qu’enfants de Dieu, nous sommes appelés à :'),
      list(
        'Donner du goût au monde ;',
        'Apporter la joie et l’espérance ;',
        'Freiner la corruption morale et spirituelle ;',
        'Purifier ce qui est souillé ;',
        'Rappeler l’alliance de Dieu ;',
        'Influencer positivement notre entourage ;',
        'Manifester le caractère saint de Dieu ;',
        'Préserver ce qui est bon ;',
        'Contribuer à rendre la vie meilleure autour de nous.'
      ),
      p('Sans Christ, nous ne pouvons accomplir aucune de ces choses durablement. C’est Lui qui nous permet d’être ce sel dans la vie des autres.'),
      img('brille-2', 'Panneau « Dieu tient toujours ses promesses »', 'poster'),
      h('La lumière : révéler la présence de Dieu'),
      p('Le mot araméen employé pour la lumière est Nuhra.'),
      p('Cette lumière ne désigne pas seulement une source d’éclairage physique. Elle représente une lumière qui éclaire, révèle, purifie et transforme. C’est elle qui rend visible la vérité de Dieu et dissipe les ténèbres.'),
      quote('Je suis la lumière du monde ; celui qui me suit ne marchera pas dans les ténèbres, mais il aura la lumière de la vie.', 'Jean 8:12'),
      p('À travers cette image, Jésus nous appelle à :'),
      list(
        'Transmettre la vérité ;',
        'Refléter la présence de Dieu dans le monde ;',
        'Être source de vie et de justice ;',
        'Dissiper les ténèbres morales par nos paroles et nos actions.'
      ),
      p('Une réflexion intéressante peut être faite à partir de la lumière physique. On peut couper une source lumineuse, mais la lumière déjà émise continue son voyage. De la même manière, chaque parole, chaque encouragement, chaque témoignage inspiré par Dieu laisse une trace dans la vie de ceux qui l’ont reçu.'),
      p('Les hommes peuvent tenter de cacher la lumière de Dieu qui brille en nous, mais ils ne pourront jamais l’éteindre, car le Seigneur en est la source.'),
      h('Les œuvres : le reflet visible de notre cœur'),
      p('Le mot araméen utilisé pour les œuvres est Avda, au pluriel Avadin. Ce terme désigne :'),
      list(
        'Les œuvres ;',
        'Les actes concrets ;',
        'Les services rendus ;',
        'Les fruits produits par une vie ;',
        'Ce qui est accompli du fond du cœur ;',
        'Ce qui émane d’une personne ;',
        'Le service rendu à Dieu ;',
        'La mission confiée par Dieu.'
      ),
      p('Cette définition nous montre que les œuvres ne se limitent pas à de simples bonnes actions. Elles représentent l’expression visible de ce que nous sommes intérieurement.'),
      p('Faire le bien sans amour ni sincérité ne reflète pas la volonté de Dieu. Les œuvres véritables sont le fruit d’un cœur transformé.'),
      quote('Il en est ainsi de la foi : si elle n’a pas les œuvres, elle est morte en elle-même.', 'Jacques 2:17'),
      p('Ainsi, lorsque Jésus dit : « afin qu’ils voient vos bonnes œuvres et qu’ils glorifient votre Père qui est dans les cieux », Il souligne que les hommes doivent reconnaître que ce qu’ils voient dépasse les capacités humaines. Ils doivent discerner l’action de Dieu à travers nous.'),
      p('En réalité, Jésus nous invite à montrer :'),
      list(
        'Ce que notre vie produit ;',
        'Ce que notre cœur manifeste ;',
        'Ce que Dieu accomplit à travers nous ;',
        'L’éclat de notre relation avec Lui ;',
        'Les actes inspirés par sa présence.'
      ),
      p('Les œuvres ne nous appartiennent pas. Nous ne sommes que les instruments dont Dieu se sert pour manifester son amour au monde.'),
      h('Une invitation à briller'),
      p('Après avoir médité sur ces images du sel, de la lumière et des œuvres, une chose devient évidente : rien n’a été choisi au hasard dans les paroles de Jésus.'),
      p('Mon frère, ma sœur, sois ce sel dont Jésus parle.'),
      p('Sois cette personne qui apporte de la saveur, de la joie et de l’espérance autour d’elle. Sois quelqu’un dont la présence inspire le respect, l’intégrité et la droiture. Que là où tu te trouves, le mal ait plus de difficulté à prospérer.'),
      p('Influence ton environnement par le caractère que Christ façonne en toi. Le vieil homme est passé ; tu es une nouvelle créature. Tu portes désormais en toi les traits du caractère de Dieu.'),
      p('Impacte la vie de ceux que tu rencontres.'),
      p('Comme il est écrit dans 1 Thessaloniciens 5:5 : « Vous êtes tous des enfants de la lumière et des enfants du jour ; nous ne sommes point de la nuit ni des ténèbres. »'),
      p('Tu es appelé à marcher dans la lumière. Entoure-toi de personnes qui protégeront cette lumière, qui t’encourageront à grandir et à demeurer attaché au Seigneur.'),
      p('Rayonne. Que tous puissent voir en toi l’enfant de Dieu que tu es.'),
      p('Et lorsque tu entres quelque part, que l’on perçoive naturellement quelque chose de différent : une paix, une lumière, une présence qui ne viennent pas de toi, mais de Celui qui habite en toi.'),
      p('Brille, rayonne et impacte !'),
      p('Accomplis les œuvres de Dieu avec sincérité et de tout ton cœur. Ne les fais pas simplement par habitude ou par obligation. Tes œuvres sont le reflet direct du cœur du Père.'),
      p('Comme l’affirme Tite 2:14 : « Il s’est donné lui-même pour nous afin de nous racheter de toute iniquité et de se faire un peuple qui lui appartienne, purifié et zélé pour les bonnes œuvres. »'),
      p('Plus tu te rapproches de Lui, plus tes œuvres deviennent l’expression de sa volonté, et plus Dieu est glorifié à travers ta vie. Alors, fais rayonner son œuvre autour de toi.'),
      p('Brille, rayonne et impacte !'),
      p('Même lorsque tu as l’impression que ta lumière s’est affaiblie, souviens-toi d’une chose : Dieu demeure la source. Il est fidèle. Il est toujours là. Il continue d’attendre que nous revenions vers Lui.'),
      p('Ne laisse personne éteindre ce que Dieu a allumé en toi.')
    ]
  },
  {
    slug: 'valorous-le-moteur-tourne-a-nouveau',
    volume: 3,
    date: '31 mai 2026',
    title: 'Valorous : le moteur tourne à nouveau',
    author: 'Rayam Kikuati',
    blocks: [
      img('valorous-retour', 'Affiche Valorous, Ministère des hommes, samedi 19 avril 2025', 'poster'),
      p('Leader · Époux · Père · Ami'),
      p('Dans la matinée du samedi 4 avril 2026, les hommes de l’église Gospel Nation se sont réunis pour la première fois depuis près de 4 mois sans activité.'),
      p('Ce rendez-vous spécial de par son come-back digne du fils prodigue a été marqué par une mise à jour sur l’état d’âme et la vision de chacun en plus d’un temps de communion fraternelle.'),
      p('Ainsi Valorous reprend sa marche sous la direction du frère Étienne Mabunda, interpellé par l’Esprit Saint pour se charger de ce ministère dédié aux hommes de valeurs.')
    ]
  },
  {
    slug: 'lancement-de-l-ecole-nation-classe',
    volume: 3,
    date: '31 mai 2026',
    title: 'Lancement de l’école Nation Classe',
    author: 'Exaucé Mazunda',
    blocks: [
      h('Bienvenue dans l’École Nation Classe'),
      p('Nation Classe ouvre officiellement ses portes avec une vision claire et ambitieuse : former des hommes et des femmes profondément transformés, solidement établis et pleinement équipés pour impacter leur génération.'),
      p('Dans un monde en constante mutation, où les repères spirituels, moraux et identitaires sont souvent fragilisés, cette école se présente comme un cadre de formation structuré, visant non seulement la transmission de connaissances, mais surtout la transformation intérieure.'),
      p('Cette formation repose sur trois parcours fondamentaux, correspondant à trois dimensions essentielles de la croissance spirituelle et personnelle : Appel → Service → Impact.'),
      h('Vision générale'),
      p('L’École Nation Classe a pour objectif de former des personnes affermies dans leur identité, transformées dans leur caractère, équipées pour leur mission et envoyées pour impacter leur génération.'),
      p('Ces trois niveaux constituent une progression logique et spirituelle qui accompagne chaque étudiant dans son développement global. L’École Nation Classe n’est pas une simple formation, mais un processus de transformation profonde.'),
      p('Elle vise à susciter une génération enracinée dans la vérité, disciplinée dans le service et influente dans les nations.'),
      p('Appelés, Ouvriers et Ministères : trois étapes, une seule mission, impacter le monde pour la gloire de Dieu.')
    ]
  },

  // ─────────────── Vol. 2 — 30 mars 2025 ───────────────
  {
    slug: 'premiere-nuit-de-la-traversee',
    volume: 2,
    date: '30 mars 2025',
    title: 'Première nuit de la traversée à Gospel Nation',
    author: 'Keren Ntumba Teresa',
    blocks: [
      img('traversee', 'Le pasteur Kanda Kabangu prêchant pendant la nuit de la traversée', 'poster'),
      p('À l’occasion de la clôture de l’année 2024, l’église Gospel Nation a organisé, mardi 31 décembre 2024, une nuit de la traversée au sein de sa bâtisse située dans la commune de Ngaliema, sur l’avenue Didas Pembe, au quartier Joli Parc.'),
      p('C’était autour d’un repas que le pasteur principal, Kanda Kabangu, a pris la parole pour des déclarations puissantes pour l’année 2025, après un moment d’exhortation centré sur le fait d’oublier le passé pour saisir avec foi le futur que Dieu nous réserve, mais aussi sur les résolutions que nous prenons sans Dieu.'),
      quote('Tu ne peux pas marcher avec Jésus si tu ne regardes pas au futur.', 'Pasteur Kanda Kabangu'),
      p('C’est ce qu’affirme le pasteur Kanda durant ce moment d’exhortation, avant d’ajouter : « Quand les disciples ont commencé à marcher avec Jésus, ils ne s’accrochaient pas à leur passé car Jésus les préparait à être ses témoins. Actes 1:8, Jean 15:26-27. »'),
      p('À chaque début d’année, certaines personnes prennent des résolutions sans connaître la volonté de Dieu. Ainsi, à ce sujet, le pasteur Kanda cite le passage d’Ésaïe 30:1, qui nous exhorte à ne pas prendre des résolutions sans Dieu car nous ne savons pas de quoi sera fait le lendemain.'),
      p('« En 2025, peu importe ce que tu veux faire, tant que c’est pour la volonté de Dieu, cela réussira, parce que quand tu le reconnais dans toutes tes voies, il aplanira tes sentiers », explique-t-il selon Proverbes 3:6.'),
      p('Enfin, l’église Gospel Nation entre en 2025 avec célébration, accompagnée des déclarations prophétiques et de la déclaration du Psaume 23.')
    ]
  },
  {
    slug: 'le-bapteme-un-jour-de-fete',
    volume: 2,
    date: '30 mars 2025',
    title: 'Le baptême, un jour de fête',
    author: 'Rayam Kikuati',
    blocks: [
      img('bapteme-1', 'Le baptême par immersion à Gospel Nation', 'poster'),
      p('L’église Gospel Nation a célébré le baptême de 2 membres de l’assemblée, le dimanche 26 janvier dernier, pour la première session de baptême de l’année.'),
      p('C’est une grande joie sur terre comme au ciel quand une âme se repent pour revenir à Christ, selon qu’il est écrit dans Luc 15:7 : « De même, je vous le dis, il y aura plus de joie dans le ciel pour un seul pécheur qui se repent, que pour quatre-vingt-dix-neuf justes qui n’ont pas besoin de repentance. »'),
      p('S’en est suivi le message dominical, avec pour thème : « Jésus Christ, fils de l’homme, fils de David et fils de Dieu ». L’église a été bénie par le témoignage d’un baptisé, révélant encore la puissance de l’œuvre de la croix où notre Seigneur Jésus s’est offert comme victime expiatoire pour nos péchés par amour pour nous (1 Jean 4:9-10).'),
      img('bapteme-2', 'Le baptême par immersion à Gospel Nation', 'poster'),
      p('Après cela, l’assemblée s’est réunie autour de la piscine pour être témoin de ce baptême par immersion, accompagné d’un chant entonné par la chorale déclarant : « Je suis né de nouveau », un rappel de la conversation de Jésus et Nicodème dans Jean 3.'),
      p('Enfin venait le traditionnel barbecue pour célébrer ce jour de fête, une occasion pour chacun des membres de cette assemblée Gospel Nation de communier.'),
      p('Compte rendu du Gospel Family & Barbecue du 26 janvier 2025.')
    ]
  },
  {
    slug: 'ladies-nation-prendre-soin-du-temple-du-saint-esprit',
    volume: 2,
    date: '30 mars 2025',
    title: 'Ladies Nation : prendre soin du temple du Saint-Esprit',
    author: 'Joseph Mayulu',
    blocks: [
      img('ladies-1', 'Réunion Ladies Nation à Gospel Nation', 'photo'),
      p('Dans le cadre de son engagement pour l’épanouissement spirituel et le bien-être global, le département Ladies Nation a organisé, au sein de l’église Gospel Nation située dans la commune de Ngaliema (avenue Pembe Didas, quartier Joli Parc), une réunion exceptionnelle destinée à toutes les femmes.'),
      p('L’initiative « Ladies Nation » vise à rappeler à chaque femme que son corps est le temple du Saint-Esprit. S’appuyant sur les enseignements bibliques, notamment 1 Corinthiens 6:19 (« Ne savez-vous pas que votre corps est le temple du Saint-Esprit qui est en vous, que vous avez reçu de Dieu ? »), l’objectif est de sensibiliser les participantes à l’importance de prendre soin de leur corps, non seulement comme une obligation de santé, mais également comme un acte de foi.'),
      img('ladies-2', 'Moment de partage pendant la réunion Ladies Nation', 'photo'),
      p('La rencontre, animée par Kenya, a proposé un programme structuré autour de deux axes majeurs :'),
      list(
        'Entretien mental : vaincre les forteresses intérieures pour cultiver la paix et la confiance en soi.',
        'Entretien physique : nourrir le corps et l’esprit pour faire de son corps un véritable sanctuaire de Dieu.'
      ),
      p('Au cours de cette réunion, des moments de prière, de méditation et de partage ont permis aux participantes de s’exprimer sur leurs défis quotidiens et de découvrir des pratiques de bien-être intégrant les principes bibliques.'),
      p('Ce rassemblement a non seulement permis de raviver la conscience spirituelle des participantes, mais a également offert des outils concrets pour leur développement personnel.'),
      p('Ladies Nation invite toutes les femmes à continuer à faire de leur corps un temple du Saint-Esprit et à participer activement aux prochaines activités de l’Église Gospel Nation.')
    ]
  },
  {
    slug: 'valorous-les-quatre-roles-cles',
    volume: 2,
    date: '30 mars 2025',
    title: 'Valorous : les quatre rôles clés qui définissent un homme',
    author: 'Stone Mugisho',
    blocks: [
      img('valorous-roles-1', 'Première réunion du département des hommes, Valorous', 'poster'),
      p('La première réunion du département des hommes.'),
      p('Le pasteur de l’église Gospel Nation, Kanda Kabangu, a présidé samedi 22 mars une réunion dédiée aux hommes au sein de son église, dans la commune de Ngaliema, au quartier Joli Parc.'),
      p('Dans son mot de circonstance, le pasteur Kanda a exhorté les participants à devenir des hommes selon leur ordre de mission. Il a évoqué quatre rôles importants afin de manifester totalement leur masculinité : « Un homme, tout au long de sa vie, assume plusieurs rôles déterminants qui façonnent sa personnalité et son avenir. Il se doit d’être un leader, un époux, un père, un ami. Chacun de ces rôles contribue à l’épanouissement personnel et de son entourage », affirme-t-il.'),
      img('valorous-roles-2', 'Les hommes réunis lors de la première réunion de Valorous', 'poster'),
      p('Il a poursuivi en disant que l’homme est le héros de son enfant, tel un berger qui protège sa famille, son travail, son cercle d’amis : « Ce dernier doit protéger, écouter, diriger comme étant un donneur d’exemple ou d’expériences », dit-il.'),
      p('En conclusion, l’homme est invité à équilibrer ces rôles pour une vie épanouie. Il pose un cadre de règles et s’y tient, parce qu’il a bien appris de ses expériences, afin d’avoir des bases dans sa famille ainsi que dans son entourage. L’homme est un bâtisseur, il construit son foyer.')
    ]
  }
];

export function getArticle(slug: string) {
  return gospelNewsArticles.find((article) => article.slug === slug);
}

// Vignette de la liste : première image de l'article, sinon la couverture de la revue.
export function articleThumbnail(article: GospelNewsArticle): string {
  const first = article.blocks.find((block) => block.type === 'image');
  return first && first.type === 'image' ? first.image.src : `/bibliotheque/covers/revue-gospel-news-vol-${article.volume}.jpg`;
}
