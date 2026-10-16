// Photos des bandeaux de page (dossier public/hero). Chaque bandeau commence par
// la photo de sa page, puis passe aux autres dans un ordre aléatoire, en fondu.
// Les photos trop petites pour un écran large (768 px) ne servent que de
// première photo de leur page, jamais dans la rotation.
export type HeroPhoto = { src: string; position: string };

export const HERO_POOL: HeroPhoto[] = [
  { src: '/hero/eglise-v2.jpg', position: 'object-center' },
  { src: '/hero/eglise.jpg', position: 'object-center' },
  { src: '/hero/predications.jpg', position: 'object-[center_30%]' },
  { src: '/hero/temoignages.jpg', position: 'object-[center_30%]' },
  { src: '/hero/contact.jpg', position: 'object-[center_30%]' },
  { src: '/hero/departements.jpg', position: 'object-[center_30%]' },
  { src: '/hero/services.jpg', position: 'object-[center_30%]' },
  { src: '/hero/rendez-vous.jpg', position: 'object-[center_30%]' },
  { src: '/hero/bible.jpg', position: 'object-[center_30%]' },
  { src: '/hero/blog.jpg', position: 'object-[center_30%]' },
  { src: '/hero/evenements.jpg', position: 'object-[center_30%]' }
];
