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
Deux origines d'offres, distinguées par les colonnes de `MemberOffer` :
- **Saisies à la main par l'admin** (les 3 d'origine : Delights by K, Bouillie Nutrimix, SISI CRÉA) : `userId` rempli, rattachées à un `User` placeholder (`clerkUserId` du type `seed-...`).
- **Publiées en libre-service** (depuis le 19/09/2026) via `/services/proposer` : `userId` vide, `clerkUserId` + `authorName` remplis. Un compte Clerk n'est pas un membre de l'église, donc aucune ligne `User` n'est créée. Le formulaire exige un compte Clerk (connexion ou création, retour automatique au formulaire grâce à `redirect_url` et `fallbackRedirectUrl`), toute offre naît `PENDING`, un compte ne peut pas avoir plus de 3 offres en attente. Règles de validation dans `src/lib/offers.ts` (catégories fermées, lien limité à http/https car il est affiché tel quel, téléphone normalisé en `+243…` pour `wa.me`).
- **Modération** : onglet `/admin/offres` (Publier, Rejeter, Retirer, Republier), API `/api/admin/offres/[id]`.
- Les coordonnées saisies (téléphone, e-mail, lien) sont **publiques** ; le formulaire le dit. Rappel : l'e-mail d'une offre n'était pas affiché avant le 19/09, il l'est maintenant.
- **Reste à faire** : les offres d'emploi n'ont pas de section à part (simple catégorie « Offre d'emploi »).

## E-mails (`src/lib/email.ts`)
Envoi via Resend par simple appel HTTP (aucune dépendance). **Inactif tant que `RESEND_API_KEY` et `EMAIL_FROM` ne sont pas définis** : le site fonctionne, l'admin voit « aucun e-mail envoyé ». Seul e-mail actuel : confirmation d'un rendez-vous, envoyé quand l'admin clique sur « Confirmer » et que le visiteur a donné son adresse (facultative dans le formulaire). **L'admin doit indiquer l'heure précise** (champ « Heure du rendez-vous », à partir de 16h, le pasteur recevant le mardi à partir de 16h, chaque personne ayant son heure ; règles dans `src/lib/appointments.ts`, colonne `Appointment.confirmedTime`). Si l'heure change après un e-mail déjà envoyé, un second e-mail « nouvelle heure » part. Un envoi par rendez-vous grâce à `Appointment.confirmationEmailSentAt` (réservation atomique, libérée si l'envoi échoue). **La note pastorale est privée et n'est jamais envoyée.** Piège Resend : sans domaine vérifié, il ne livre qu'à l'adresse du compte Resend lui-même.

## Design — refonte du 10/09 (retour de Mazunda)
Mazunda a jugé le rendu initial (calqué sur `abg-rdc`) trop sombre/plat, ne reflétant pas l'aspect "chaleureux, moderne" des publications Instagram de l'église — demande explicite de rester dans les couleurs du logo mais d'ajouter plus de vie (couleurs, animations, effets). Changements faits :
- Nouveaux tokens dans `globals.css` : `--gn-cream-bg` (fond crème clair) et `--gn-ink` (texte sombre chaud) pour des **sections claires alternées avec les sections noires** (`.gn-section-light`), plus `--gn-orange` en accent secondaire vif. Classe utilitaire `.gn-card-lift` (survol : légère élévation + ombre dorée).
- Librairie `motion` (ex-Framer Motion) installée pour les animations — **pas** shadcn/Base UI (abandonné le 10/09 pour ce projet, voir plus haut) ni Magic UI, pour rester sur la base Tailwind simple déjà en place.
- Composant `src/components/Reveal.tsx` : animation d'entrée (fade + léger slide). **Piège rencontré et corrigé** : la première version utilisait `whileInView` (animation déclenchée au scroll) — testée dans le navigateur, elle restait bloquée à `opacity: 0` de façon permanente pour tout contenu sous la ligne de flottaison, y compris après re-scroll (même symptôme que le bug `ScrollReveal` documenté sur `nutrimix-boutique` le 28/08). Corrigé en passant à une animation déclenchée au montage (`animate`, pas `whileInView`) — moins spectaculaire mais ne peut jamais laisser du contenu invisible. **Ne pas réintroduire un `whileInView`/`IntersectionObserver` scroll-based sur ce projet sans un test manuel exhaustif (scroll rapide, ancre, rechargement en cours de page).**
- Page d'accueil, `/departements` et `/evenements` reconstruites avec sections alternées claires/sombres, cartes avec vraies photos (`Department.imageUrl`) et fallback initiale colorée si pas d'image.

## Design system — règles posées après l'audit du 18/09/2026
Un audit mesuré (skill `audit-design-site`) a relevé 32 tailles de police, 8 rayons, 17 couleurs en dur, des sous-titres de bannière à 1,2:1 de contraste et une image de 11 Mo servie en vignette. Tout a été corrigé ; **ne pas réintroduire ces écarts** :
- **Typographie** : uniquement l'échelle Tailwind `text-xs` → `text-3xl`, plus `text-hero` (38 px, titres de pages intérieures) et `text-display` (52 px, accueil) définis dans `globals.css`. Aucune taille arbitraire `text-[13.5px]`, jamais sous 12 px.
- **Rayons** : cartes en grille `rounded-lg`, panneaux/blocs `rounded-2xl`, boutons en pilule `rounded-full`. Rien d'autre (sauf `rounded` pour les cases à cocher).
- **Couleurs** : jamais de hex en dur dans un composant — ajouter un token `--gn-*` dans `globals.css`. Pour les bibliothèques qui exigent une valeur littérale (Clerk), passer par `src/lib/brand.ts`.
- **Gris secondaire** : `text-gn-muted` seulement sur fond sombre ; sur fond clair (crème/blanc), toujours `text-gn-muted-strong` (sinon ~3,6:1, sous le seuil).
- **Texte sur photo** : dégradé de lisibilité (voir `PageHero.tsx`), jamais un voile plat, et textes en `text-gn-cream/90`.
- **Cibles tactiles** : 44 px minimum (règle globale sur boutons/champs dans `globals.css`, `min-h-[44px]` sur les liens stylés en bouton). Exceptions assumées : liens au milieu d'une phrase, icônes d'action des versets (24 px).
- **Largeur de lecture** : `max-w-measure` (56ch ≈ 72 caractères réels), pas `max-w-prose`.
- **Images** : toujours `next/image` (les miniatures YouTube sont autorisées dans `next.config.ts`). Seule exception : la photo de membre de l'admin, servie par une route protégée que l'optimiseur ne peut pas lire.
- **Pages lisant la base** : `export const revalidate = 60` sur les pages publiques ; l'espace admin est en `force-dynamic` (dans son layout) — sinon listes figées au build et données de membres écrites dans les fichiers HTML de build.
- **Partage social** : `metadataBase` + `src/app/opengraph-image.jpg` + une `description` par page. **Définir `NEXT_PUBLIC_SITE_URL` sur Vercel (type Configuration)** dès que le domaine est choisi.

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
- Photos/logos manquants pour Media, Welcome, Nation United, One Nation, Valorous, École Nation Classe (fallback initiale colorée en attendant).
- Activer les e-mails : compte Resend + nom de domaine vérifié, puis `RESEND_API_KEY` et `EMAIL_FROM` sur Vercel.
- Nom de domaine : à choisir, puis remplacer `NEXT_PUBLIC_SITE_URL` (type Configuration, jamais Sensible) et déclarer `sitemap.xml` sur Google Search Console.
- Clerk est branché (comptes visiteurs : plan de lecture, offres). Voir les commits pour l'avancement module par module.

## Prédications : page, lecteur, catalogue (refonte du 20/09/2026)
- **`/predications/[id]`** : la prédication choisie occupe **toute la largeur de l'écran** (lecteur YouTube, hauteur plafonnée à 75 % de l'écran), suivie de « Vous aimerez aussi écouter » (6 miniatures, choisies par série, puis thème, puis prédicateur, puis récence — `pickSuggestions`) et du bouton « Voir le catalogue des prédications ». Chaque carte de l'accueil mène à SA prédication. `/predications` sans identifiant met la plus récente en avant. Un identifiant inconnu renvoie un vrai 404 (vérifié avant l'affichage, pas dans le Suspense).
- **`/predications/catalogue`** : barre de recherche (sans accents ni majuscules ; titre, prédicateur, série, thème, date) et **un seul thème affiché à la fois** (onglets avec compteurs, le premier thème à l'ouverture). Si la recherche ne donne rien dans le thème ouvert mais en donne ailleurs, il bascule tout seul. Filtrage dans le navigateur (`SermonCatalogue.tsx`).
- **Thèmes** : colonne `Sermon.theme`, un thème par prédication, parmi `SERMON_THEMES` dans `src/lib/sermons.ts` (Foi ; Saint-Esprit et onction ; Amour et paix ; Autorité et combat spirituel ; Identité en Christ ; Discernement et vérité ; Croissance et transformation ; Vie personnelle). **Classés par Claude à partir des titres** (et du contenu pour « Ton Arme la Plus Puissante », qui parle du pouvoir de la bouche) : à faire valider par Mazunda. Corriger = `UPDATE sermons SET theme = '…' WHERE id = '…'` (pas d'écran admin pour les prédications).
- **Lecteur** (`YoutubePlayer.tsx`) : miniature seule tant qu'on n'a pas cliqué (le lecteur YouTube pèse plus d'un Mo, aucune requête YouTube avant le clic), puis `youtube-nocookie.com`. Miniature HD (`maxresdefault`) avec repli sur `hqdefault`. L'identifiant vidéo est validé (`youtubeId`, 11 caractères) avant d'entrer dans l'adresse du lecteur.
- **Dates** : `formatSermonDate` affiche en UTC (dates enregistrées à minuit UTC) ; les dates d'événement passent par `src/lib/dates.ts` (fuseau `Africa/Kinshasa`). **Toute date affichée côté serveur doit préciser un fuseau** : les serveurs Vercel sont en UTC, le Mac de Mazunda en UTC+1, d'où « 09:00 » en ligne contre « 10h00 » en local.

## Effet d'apparition au défilement (`Reveal.tsx`)
Corrigé le 20/09/2026 : l'ancien « filet de sécurité » révélait TOUS les blocs 2,5 s après l'ouverture, donc le temps de défiler l'effet n'existait plus. Désormais un bloc n'est révélé que lorsqu'il approche de l'écran (défilement, observateur, ou déjà dépassé) ; le filet ne concerne que les blocs déjà visibles. Décalage de 32 px, 0,7 s. Respecte « réduire les animations » du système (aucun effet dans ce cas). Vérifié : 19 blocs restent cachés 6 s après l'ouverture, et après un défilement très rapide jusqu'en bas aucun ne reste invisible.

## Défilement : Lenis retiré (20/09/2026)
Lenis (défilement « amorti ») a été **retiré entièrement** : il donnait une sensation de ralenti (1,1 s d'inertie à chaque cran de molette, boucle d'animation permanente, observateur sur tout le DOM) et avait déjà causé deux bugs le 18/09. Décision de Mazunda : au prochain problème de défilement, on le retire plutôt que de le rafistoler. **Ne pas le réintroduire.** Le site utilise le défilement natif du navigateur.

## Gospel News : fil d'articles (21/09/2026)
- **`/departements/gospel-news`** est une liste façon fil d'actualité (titre, volume · date · auteur, vignette à droite ; deux colonnes dès `lg`). Chaque article a sa page `/departements/gospel-news/[article]` : texte dans une colonne de lecture (`max-w-3xl`), **images sur toute la largeur du site**. Le dossier statique `gospel-news/` prend le pas sur `[slug]`, donc pas de conflit de route.
- **Données dans `src/lib/gospel-news.ts`** (pas en base) : texte repris des PDF des revues, blocs `p`/`h`/`quote`/`list`/`image`. Une image `poster` (affiche verticale) est montrée en entier sur fond flou ; une `photo` remplit la bande. Images optimisées dans `public/gospel-news/` (JPEG q82, ≤ 1600 px, sources de basse résolution). Ajouter un article = un objet dans `gospelNewsArticles` + ses images ; le sitemap le reprend tout seul.
- **Exclus volontairement (demande de Mazunda)** : les pages « Annonces » et « Produits et services de nos membres ». Ne pas les remettre sans qu'il le demande. Les PDF complets restent dans la Bibliothèque et sur l'accueil.
- Mise en forme : premier paragraphe en chapô, interligne resserré (`leading-normal`), intertitres avec filet doré, citations encadrées.

## Accueil : structure et pièges (21/09/2026)
- **Ordre** : hero (vidéo) → Prochain culte/Itinéraire (crème) → **bande défilante dorée** → Dernières parutions (sombre) → Dernières prédications (crème) → Nos départements (blanc) → Devenir membre (sombre). **Alterner les fonds** : deux sections de même couleur ne doivent jamais se toucher.
- **Bande défilante** (`EventsMarquee.tsx`, animation `.gn-marquee-track` dans `globals.css`) : événement à venir, culte du dimanche, Offres et services, chaque département avec son logo, Rendez-vous pastoral, Devenir membre. Contenu dupliqué (la seconde copie est `aria-hidden` et non focalisable), pause au survol, pas d'animation avec « Réduire les animations ». N'utilise que des données réelles.
- **Header flottant sur la vidéo** : règle CSS `body:has([data-home-hero]) > header` (position fixe, sans marges) dans `globals.css`, l'attribut `data-home-hero` étant sur le hero de l'accueil. **Volontairement en CSS et pas en JS** (`usePathname`) : le HTML de départ était `sticky`, d'où un éclair de bande noire avant hydratation. Les autres pages gardent le bandeau normal.
- **Rangées glissantes** (`gn-scroll-x` + `snap-x`) : toujours ajouter `scroll-pl-5` (et `sm:scroll-pl-10` si le padding change), sinon le snap colle la première carte au bord gauche.
- **Marges de section** : `py-11 sm:py-14` (et `PageHero` en `py-12 sm:py-14`) ; ne pas revenir à 80 px, Mazunda trouvait trop de vide.

## Publier sur Vercel : ce qu'il faut vérifier
- Après un `git push`, attendre que le **déploiement soit READY** puis tester la page modifiée sur `gospel-nation.vercel.app` (pas une adresse de déploiement figée). Le script de build inclut `prisma generate`.
- **Neon endormie** : un `next dev` ou un build local qui renvoie 500 avec `P1001` n'est pas un bug de code ; réveiller par `run_sql SELECT 1` puis recharger.
- **Commits** : ne jamais faire `git add -A src` (les photos brutes de Mazunda y sont volontairement hors Git) ; nommer les fichiers.
- **Secrets pour le presse-papiers** : toute commande `pbcopy` qui prépare un mot de passe doit retirer le retour à la ligne final (`tr -d '"\n'`), sinon Vercel l'enregistre avec un caractère invisible et la connexion admin échoue.

## Sécurité (audit du 21/09/2026)
- **Limitation de débit** : `src/lib/rate-limit.ts` (table `rate_limit_attempts`, par IP). Connexion admin 5 essais/10 min ; inscription 40/h ; contact, rendez-vous, témoignages 15/h. Si la base est indisponible, la requête passe (jamais de panne du site à cause du frein). La table a été créée à la main sur Neon avant le déploiement (voir « Neon » ci-dessus).
- **Liens saisis par les visiteurs** : passer par `safeHttpUrl` / `isHttpUrl` (`src/lib/validation.ts`) avant d'en faire un `href`. Un lien `javascript:` dans un témoignage s'exécutait au clic de l'admin.
- **Plafonds de longueur** sur tous les champs des formulaires publics ; en-têtes de sécurité dans `next.config.ts` (pas de CSP : elle casserait YouTube/Clerk sans réglage précis).
- **Connu et accepté** : mot de passe admin unique et partagé, session de 7 jours non révocable individuellement (changer `SESSION_SECRET` les invalide toutes) ; membre validé dès l'inscription ; le formulaire indique si un e-mail est déjà inscrit.
- **Pages légales** : `/mentions-legales` et `/confidentialite` (composant `LegalPage`). Ni statut juridique ni numéro d'enregistrement de l'église n'y figurent (non fournis) ; à compléter si Mazunda les transmet.
- **Sauvegarde** : branche Neon `sauvegarde-2026-09-21-avant-lancement` (copie de `main` avant le lancement).

## Quand le nom de domaine sera acheté (rappel du 21/09/2026)
Dès que Mazunda annonce qu'il a le domaine (prévu : `.com` chez LWS, e-mail pro inclus), dérouler dans l'ordre :
1. Ajouter le domaine dans Vercel et saisir les enregistrements A/CNAME dans la zone DNS de LWS. **Ne pas changer les serveurs de noms** (les MX de l'e-mail pro seraient perdus).
2. Activer l'e-mail professionnel chez LWS.
3. `NEXT_PUBLIC_SITE_URL` sur Vercel : type Configuration, non vide, sans retour à la ligne ; redéployer et vérifier `og:image`, sitemap, robots.txt.
4. Redirection 301 de `gospel-nation.vercel.app` vers le domaine.
5. Ajouter balises canonical et JSON-LD (type église) dans le code.
6. Google Search Console (TXT chez LWS, soumettre le sitemap) et fiche Google Business Profile.
7. Clerk en production (clés `pk_live`/`sk_live`, webhook, DNS jusqu'à 48 h).
8. Resend : domaine, SPF/DKIM, `RESEND_API_KEY` et `EMAIL_FROM`, test d'un rendez-vous confirmé.
9. Après chaque déploiement : Vercel READY puis test sur l'adresse vivante.
Neon : après le passage en Launch (choisir « Lancement »), régler ce projet en « toujours actif », taille maximale 0,25 CU (≈ 19,35 $/mois au plus).

## Suppression manuelle d'un membre (sans l'outil MCP Neon)
Si le connecteur MCP Neon n'est pas disponible dans la session, passer par un script Prisma local qui lit `.env.local` (`node --env-file=.env.local script.mjs`). Toujours vérifier avant de supprimer : `prisma.user.findUnique` puis compter les lignes liées (`departmentRegistration`, `memberOffer`, `appointment`, `blogPost`, `testimony`) pour l'`userId`. La photo (`User.photoUrl`, si elle commence par `https://`) doit être supprimée séparément du store Vercel Blob avec `del()` de `@vercel/blob` — elle n'est pas effacée par la cascade Prisma.
**Piège de connexion rencontré le 22/09/2026** : la connexion directe échouait systématiquement en `P1001` malgré un TCP qui passait (`net.createConnection` réussissait mais la négociation Postgres/TLS échouait, probablement le temps que le compute Neon se réveille). Corrigé en ajoutant `connect_timeout=30` à `DATABASE_URL` dans le `PrismaClient` du script (`new PrismaClient({ datasources: { db: { url } } })`) — sans toucher au `.env.local`. Sans l'outil MCP Neon pour réveiller la base par HTTP avant coup, ce délai de connexion plus long est le recours qui marche.
