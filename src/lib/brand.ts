// Source unique des couleurs de marque pour les bibliothèques tierces qui
// exigent une valeur littérale (Clerk n'accepte pas les variables CSS dans son
// objet `appearance`). Les mêmes teintes existent en tokens CSS dans
// globals.css — garder les deux synchronisés.
export const brandColors = {
  gold: '#d28943',
  white: '#ffffff',
  ink: '#221c13'
} as const;
