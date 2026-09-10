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
Comme sur `abg-rdc` : le contenu réel de l'église (nom, pasteur, horaires, départements visibles, comptes Instagram liés) vient des comptes Instagram publics `@gospel.nation`, `@gospel.prod`, `@gospel.cafe`, `@gospel_nation_music`, consultés le 10/09/2026. Tout ce qui n'a pas pu être vérifié (adresse complète, historique de l'église, programme détaillé de chaque département) est marqué `[À COMPLÉTER]` dans `src/lib/content.ts` — **ne jamais transformer un placeholder en contenu définitif sans confirmation explicite de Mazunda**, c'est une vraie église avec de vrais membres.

Infos confirmées (Instagram, 10/09/2026) :
- Pasteur principal : Kanda Kabangu (@kandakabangu)
- Horaires : Dimanche 9h30 — Mercredi 17h30
- Adresse partielle : « Av. Joli-Parc / ... » (tronquée sur Instagram, à compléter par Mazunda)
- Chaîne YouTube : m.youtube.com/@gospel.nation (818 abonnés, 374 vidéos au 10/09)
- Départements visibles publiquement : Baptêmes, Gospel Family, Worship, Ministries, Gospel Kids
- Comptes liés : Gospel Prod (maison de production audiovisuelle), Gospel Café (28,6k abonnés — slam/gospel/urban/témoignage, "From RDC to the world"), Gospel Nation Music (Esaïe 61:1-3)

## Reste à faire (suivi de session)
Voir les commits pour l'avancement module par module (même méthode que `gestion-scolaire` : un module construit et vérifié dans le navigateur à la fois, avant de passer au suivant).
