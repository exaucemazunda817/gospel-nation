// Version horizontale (2,4:1, tirée de la photo d'origine, SANS rien inventer) de chaque photo de
// bandeau. Ordinateur et tablette l'utilisent ; le téléphone garde la photo d'origine (verticale).
// Clé = chemin de la photo d'origine passé à <PageHero image=…>. Chaque bande a été cadrée à la main
// autour des visages (script Pillow, voir CLAUDE.md « Bandeaux de page »).
export const HERO_WIDE: Record<string, string> = {
  '/hero/bible.jpg': '/hero/wide/bible.jpg',
  '/hero/blog.jpg': '/hero/wide/blog.jpg',
  '/hero/contact.jpg': '/hero/wide/contact.jpg',
  '/hero/departements.jpg': '/hero/wide/departements.jpg',
  '/hero/dons.jpg': '/hero/wide/dons.jpg',
  '/hero/eglise-v3.jpg': '/hero/wide/eglise-v3.jpg',
  '/hero/evenements-v3.jpg': '/hero/wide/evenements.jpg',
  '/hero/inscription.jpg': '/hero/wide/inscription.jpg',
  '/hero/predications.jpg': '/hero/wide/predications.jpg',
  '/hero/rendez-vous.jpg': '/hero/wide/rendez-vous.jpg',
  '/hero/services.jpg': '/hero/wide/services.jpg',
  '/hero/temoignages.jpg': '/hero/wide/temoignages.jpg'
};
