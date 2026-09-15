// Garde-fou TEMP : tant que Mazunda n'a pas créé l'application Clerk dédiée
// à gospel-nation et ajouté les clés dans .env.local, on désactive Clerk
// proprement plutôt que de faire planter tout le site (même schéma que sur
// gestion-scolaire). À supprimer une fois les clés en place — voir
// .env.example pour la marche à suivre.
export const isClerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
