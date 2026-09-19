// Vrai seulement si les deux clés Clerk (publique ET secrète) étaient présentes
// à la construction du site : le drapeau est calculé dans next.config.ts.
// Sinon les comptes sont désactivés proprement (connexion et espace membre
// renvoient à l'accueil, l'API des offres répond 503) au lieu de faire tomber
// tout le site. Ne pas tester CLERK_SECRET_KEY ici : elle n'existe pas côté
// navigateur, serveur et navigateur ne seraient plus d'accord.
export const isClerkConfigured = process.env.NEXT_PUBLIC_CLERK_ENABLED === 'true';
