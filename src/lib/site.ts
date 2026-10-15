// Adresse du site pour construire des liens à partager avant que le navigateur
// ne donne la vraie (voir ShareButtons). `||` et non `??` : une variable Vercel
// créée mais laissée vide vaut ''.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gospel-nation.vercel.app';
