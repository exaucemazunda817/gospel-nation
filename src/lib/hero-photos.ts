// Version horizontale (2,4:1) de chaque photo de bandeau. Ordinateur et tablette l'utilisent ; le
// téléphone garde la photo verticale (4:5). Clé = chemin de la photo passé à <PageHero image=…>.
// Chaque bande a été cadrée à la main autour des visages (script Pillow, voir CLAUDE.md « Bandeaux de page »).
//  - Photos de l'église : bande tirée de la photo d'origine, sans rien inventer, SAUF departements-v2
//    et gospel-news, dont les côtés ont été prolongés par IA (Adobe Firefly, décision de Mazunda du
//    27/11/2026 ; les personnes et les visages sont ceux de la photo d'origine).
//  - eglise-v4, bibliotheque, services-v2, emplois, rendez-vous-v2 : photos libres de Pexels
//    (licence Pexels : usage gratuit, sans mention obligatoire), recadrées en 4:5 et 2,4:1.
export const HERO_WIDE: Record<string, string> = {
  '/hero/bible.jpg': '/hero/wide/bible.jpg',
  '/hero/bibliotheque.jpg': '/hero/wide/bibliotheque.jpg',
  '/hero/blog.jpg': '/hero/wide/blog.jpg',
  '/hero/contact.jpg': '/hero/wide/contact.jpg',
  '/hero/departements.jpg': '/hero/wide/departements.jpg',
  '/hero/departements-v2.jpg': '/hero/wide/departements-v2.jpg',
  '/hero/dons.jpg': '/hero/wide/dons.jpg',
  '/hero/eglise-v3.jpg': '/hero/wide/eglise-v3.jpg',
  '/hero/eglise-v4.jpg': '/hero/wide/eglise-v4.jpg',
  '/hero/emplois.jpg': '/hero/wide/emplois.jpg',
  '/hero/evenements-v3.jpg': '/hero/wide/evenements.jpg',
  '/hero/gospel-news.jpg': '/hero/wide/gospel-news.jpg',
  '/hero/inscription.jpg': '/hero/wide/inscription.jpg',
  '/hero/predications.jpg': '/hero/wide/predications.jpg',
  '/hero/rendez-vous.jpg': '/hero/wide/rendez-vous.jpg',
  '/hero/rendez-vous-v2.jpg': '/hero/wide/rendez-vous-v2.jpg',
  '/hero/services.jpg': '/hero/wide/services.jpg',
  '/hero/services-v2.jpg': '/hero/wide/services-v2.jpg',
  '/hero/temoignages.jpg': '/hero/wide/temoignages.jpg'
};
