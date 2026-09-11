@AGENTS.md

# Gospel Nation — site de l'église

Site public + espace membres pour l'église Gospel Nation (Kinshasa, RDC). Mazunda est membre/prestataire du projet, pas développeur — il pilote sans coder.

## Stack et construction — calquées sur `abg-rdc`, pas sur `gestion-scolaire`
Sur retour explicite de Mazunda le 10/09 ("inspire-toi de comment tu as construit le site du parti politique abg en tout hormis les couleurs"), ce projet suit l'architecture simple d'`abg-rdc` plutôt que le starter shadcn/ui + Base UI utilisé sur `gestion-scolaire` :
- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4, **Tailwind brut** (pas de shadcn/ui, pas de Base UI, pas de librairie d'animation) — palette en hex simple dans `globals.css` (`--gn-*`), composants `Header`/`Footer`/`PageHero`/`PlaceholderNote` écrits à la main comme sur `abg-rdc`.
- **Essayé puis abandonné le 10/09** : shadcn/ui + `@base-ui/react` (le starter `next-shadcn-dashboard-starter` du skill `stack-sites-dynamiques-pro`, pertinent pour un dashboard admin comme `gestion-scolaire`, ne l'était pas ici) — l'API `render={...}` de Base UI (au lieu du `asChild` habituel de Radix) a cassé `Button`/`Sheet` (hydratation, boutons imbriqués) ; et Mazunda a de toute façon demandé un design plus simple et plus fidèle au logo. Tout le code shadcn/Base UI/Motion a été retiré.
- Prisma + PostgreSQL (Neon, projet `gospel-nation`, org Neon « Exaucé »)
- Clerk pour l'authentification des comptes membres (mode simple, pas d'Organizations — une seule église, pas de multi-tenant)

## Logo et couleurs
Le vrai logo (`public/logo-gospel-nation.png`) a été récupéré depuis l'avatar de la chaîne YouTube de l'église (m.youtube.com/@gospel.nation, en 1200×1200) et recadré — l'image envoyée par Mazunda dans le chat n'existait pas sur disque. Palette échantillonnée directement sur les pixels du logo (script Python/Pillow, voir historique de session) : fond noir `#0c0c0c`, texte crème `#f7f2e7`, lueur ambre `#7a2f0a` en arrière-plan, or `#d99a3d`/`#a66a1c` comme couleur d'accent (boutons, liens, titres) — même méthode que la palette verte/bleue/rouge d'`abg-rdc`, échantillonnée sur `logo-abg.png`.

## Décisions produit (confirmées avec Mazunda le 10/09)
- **Dons** : coordonnées Mobile Money / bancaires affichées sur le site (`DonationMethod`), pas de passerelle de paiement en ligne pour cette version — même approche que `nutrimix-boutique`.
- **Comptes membres** : inscription ouverte à tous les visiteurs (`MemberStatus.PENDING`), validation manuelle ensuite par un administrateur (`VALIDATED`) — même logique que l'adhésion sur `abg-rdc`.
- **Coin "One Love"** : ministère de l'église au service des enfants de la rue (orphelinat) — c'est un `Department` comme les autres, pas une fonctionnalité technique à part.
- **Multi-administrateurs** : pas d'organisations Clerk séparées — simplement plusieurs `User` avec `role = ADMIN`. Contrairement à `gestion-scolaire` (multi-écoles réel), il n'y a qu'une seule église ici.

## Contenu réel vs placeholder
Comme sur `abg-rdc` : le contenu réel vient soit des comptes Instagram publics de l'église, soit de Mazunda directement en session, soit de leur propre revue interne « Gospel News » (PDF). Tout ce qui n'a pas pu être vérifié reste marqué `[À COMPLÉTER]` dans `src/lib/content.ts` — **ne jamais transformer un placeholder en contenu définitif sans confirmation explicite de Mazunda**, c'est une vraie église avec de vrais membres. Seuls `missionPlaceholder` et `histoirePlaceholder` restent à compléter à ce stade.

Infos confirmées :
- Pasteur principal : Kanda Kabangu (@kandakabangu)
- Adresse complète (donnée par Mazunda le 10/09) : Av. Pembe Didace, Ma Campagne — à 100 m de la place commerciale en montant l'avenue Joli-Parc
- Horaires réels des cultes (donnés par Mazunda le 10/09, corrige la version devinée sur Instagram) : Dimanche 8h30–9h30 (intercession) puis 9h30 (culte), Mardi 17h (Nation United, culte de la jeunesse), Mercredi 17h30 (enseignement), Vendredi 17h (intercession)
- Chaîne YouTube : m.youtube.com/@gospel.nation
- **10 départements réels** (corrigés le 10/09 — Gospel Family et Baptêmes ne sont PAS des départements, voir plus bas) : Worship Gospel Nation, Intercession, Media, Welcome, Gospel Kids, Nation United, One Love (enfants de la rue), One Nation (équipe de basketball, fondée 14/08/2023, coach : pasteur Kanda Kabangu), Valorous (ministère des hommes, dirigé par le frère Étienne Mabunda), École Nation Classe (incubateur des leaders, 3 parcours Appelés→Ouvriers→Ministères, fondée par Mazunda). Descriptions de Worship/Intercession/Media/Welcome/Gospel Kids/Nation United **génériques, rédigées à partir du seul nom** — à valider avec l'église.
- **Gospel Family** : pas un département, un moment de communion fraternelle chaque dernier dimanche du mois (`gospelFamilyNote`, affiché sur `/eglise`).
- **Baptêmes** : pas un département, un service ponctuel (`baptemeNote`, affiché sur `/eglise`).
- Comptes liés : Gospel Prod (maison de production audiovisuelle), Gospel Café, Gospel Nation Music

## Événements (`/evenements`, modèle `Event`)
Nouvelle section ajoutée le 10/09 : affiche des événements à venir avec poster. Premier événement réel : **Valorous — 26 septembre 2026** (`public/events/valorous-2026-09-26.jpeg`). La page d'accueil affiche automatiquement le prochain événement (`Event.findFirst` trié par date).

## Services des membres (`/services`, modèle `MemberOffer`)
Le modèle `MemberOffer` existait déjà dans le schéma (pensé dès le départ comme "coin des offres et services") mais n'avait jamais été exposé — branché le 10/09 avec 3 vrais services tirés de la revue Gospel News Vol. 3 : Delights by K (traiteur), Bouillie Nutrimix (lien vers nutrimix-store.vercel.app), SISI CRÉA (audiovisuel). Chaque service est rattaché à un `User` placeholder (`clerkUserId` du type `seed-...`, même pattern que `gestion-scolaire` pour les profils pré-créés avant Clerk). **Reste à faire** : formulaire public de soumission (nécessite Clerk actif) + accueil des offres d'emploi, annoncé sur la page mais pas encore construit.

## Design — refonte du 10/09 (retour de Mazunda)
Mazunda a jugé le rendu initial (calqué sur `abg-rdc`) trop sombre/plat, ne reflétant pas l'aspect "chaleureux, moderne" des publications Instagram de l'église — demande explicite de rester dans les couleurs du logo mais d'ajouter plus de vie (couleurs, animations, effets). Changements faits :
- Nouveaux tokens dans `globals.css` : `--gn-cream-bg` (fond crème clair) et `--gn-ink` (texte sombre chaud) pour des **sections claires alternées avec les sections noires** (`.gn-section-light`), plus `--gn-orange` en accent secondaire vif. Classe utilitaire `.gn-card-lift` (survol : légère élévation + ombre dorée).
- Librairie `motion` (ex-Framer Motion) installée pour les animations — **pas** shadcn/Base UI (abandonné le 10/09 pour ce projet, voir plus haut) ni Magic UI, pour rester sur la base Tailwind simple déjà en place.
- Composant `src/components/Reveal.tsx` : animation d'entrée (fade + léger slide). **Piège rencontré et corrigé** : la première version utilisait `whileInView` (animation déclenchée au scroll) — testée dans le navigateur, elle restait bloquée à `opacity: 0` de façon permanente pour tout contenu sous la ligne de flottaison, y compris après re-scroll (même symptôme que le bug `ScrollReveal` documenté sur `nutrimix-boutique` le 28/08). Corrigé en passant à une animation déclenchée au montage (`animate`, pas `whileInView`) — moins spectaculaire mais ne peut jamais laisser du contenu invisible. **Ne pas réintroduire un `whileInView`/`IntersectionObserver` scroll-based sur ce projet sans un test manuel exhaustif (scroll rapide, ancre, rechargement en cours de page).**
- Page d'accueil, `/departements` et `/evenements` reconstruites avec sections alternées claires/sombres, cartes avec vraies photos (`Department.imageUrl`) et fallback initiale colorée si pas d'image.

## Espace admin (`/admin`)
Ajouté le 11/09 pour combler un vrai trou : les témoignages et rendez-vous soumis par les visiteurs s'enregistraient déjà en base (`status: PENDING`) mais rien ne permettait de les consulter ou de les valider — ils s'accumulaient silencieusement. Un seul rôle ADMIN (pas de rôles multiples comme sur `abg-rdc`), mot de passe unique (`ADMIN_PASSWORD`), session HMAC signée (`SESSION_SECRET`) — mêmes mécanismes que `abg-rdc/lib/session.ts` mais simplifiés à un seul rôle. Voir `.env.example`. **Piège rencontré** : `proxy.ts` doit être dans `src/proxy.ts` (pas à la racine du projet) car ce projet utilise un dossier `src/`, contrairement à `abg-rdc` qui n'en a pas — Next.js ne charge pas le middleware si le fichier n'est pas au bon endroit. Couvre pour l'instant : Témoignages (Publier/Rejeter) et Rendez-vous (Confirmer/Décliner/Marquer fait + note pastorale). Pas encore d'admin pour les offres de service ni les inscriptions aux départements (aucune inscription possible tant que `registrationOpen` est à `false` partout).

## Photos de département envoyées par Mazunda dans le chat
Deux pièges rencontrés le 11/09, à connaître avant de traiter une nouvelle photo :
1. **Une image envoyée dans le chat n'atterrit pas toujours sur le disque.** Parfois elle apparaît directement dans `src/` (comme les photos Worship/Intercession du 10/09), parfois à la racine du projet (`IMG_7572 2.JPG` pour One Love), et parfois elle n'arrive pas du tout tant que Mazunda ne l'a pas explicitement enregistrée — toujours vérifier avec `find ... -mmin -30` sur tout le dossier `gospel-nation` (pas seulement `src/`) avant de conclure qu'un fichier est absent.
2. **Remplacer un fichier image au même chemin ne suffit pas toujours** — le navigateur (et potentiellement Next.js) peut continuer à servir l'ancienne version en cache malgré un redémarrage complet du serveur de dev. **Solution fiable : toujours donner un nouveau nom de fichier** (ex. `gospel-kids-v2.jpg`, `one-love-v2.jpg`) plutôt que d'écraser le même chemin, pour garantir un chargement frais côté navigateur.

Beaucoup des photos envoyées par Mazunda pour ce projet sont en réalité des visuels promotionnels Instagram (collages Canva avec texte, logo, plusieurs sous-photos) plutôt que des photos brutes — vérifier avant de découper une sous-photo individuelle, Mazunda peut préférer garder le visuel complet (c'est le cas retenu pour Gospel Kids et One Love : `object-cover` plein cadre plutôt que `object-contain`, avec le sujet principal du visuel déjà centré dans le cadrage par défaut).

## Piège d'environnement : base Neon qui suspend en quelques secondes
Le projet Neon `gospel-nation` (plan gratuit) a `suspend_timeout_seconds: 0` et **la modification de ce paramètre est explicitement refusée par l'API Neon sur ce compte** (`modifying the suspend interval is not permitted on this account`). Contrairement au comportement habituel documenté sur `gestion-scolaire` (une resuspension après une pause), ici le compute se resuspend en quelques secondes à peine, y compris entre deux commandes `npx prisma` consécutives lancées depuis ce sandbox. **Solution qui fonctionne de façon fiable** : passer par l'outil MCP Neon `run_sql` (`SELECT 1;`) juste avant toute commande Prisma locale (`db push`, `db:seed`) ou tout rechargement de page — ce chemin (HTTP, côté serveur Neon) réveille le compute de façon fiable, contrairement à une connexion TCP directe depuis ce sandbox qui échoue souvent même juste après le réveil. Pour des changements de schéma isolés, plus simple/robuste d'exécuter l'`ALTER TABLE` directement via `run_sql` plutôt que `prisma db push`.

## Reste à faire (suivi de session)
- Mission/vision et histoire de l'église (`missionPlaceholder`, `histoirePlaceholder`) — textes à valider avec le pasteur.
- Photos/logos manquants pour Media, Welcome, Nation United, One Nation, Valorous, École Nation Classe (fallback initiale colorée en attendant) — Worship, Intercession, Gospel Kids et One Love ont déjà une vraie photo depuis le 10-11/09.
- Formulaire de soumission de service membre + offres d'emploi sur `/services`.
- Clerk (authentification réelle) toujours pas branché.
- Voir les commits pour l'avancement module par module.
