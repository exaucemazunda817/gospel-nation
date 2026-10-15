// Typographie française : une espace insécable avant « ? ! : ; » et à l'intérieur
// des guillemets français, pour qu'un signe de ponctuation ne se retrouve jamais
// seul au début d'une ligne (ex. « Quel Esprit T'Anime ? » coupé avant le « ? »).
// La longueur du texte ne change pas (une espace remplace une espace).
export function fr(text: string): string {
  return text.replace(/ ([?!:;»])/g, ' $1').replace(/(«) /g, '$1 ');
}
