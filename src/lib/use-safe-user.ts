'use client';

import { useUser as useClerkUser } from '@clerk/nextjs';
import { isClerkConfigured } from './clerk-configured';

// Tant que Clerk n'est pas configuré (voir clerk-configured.ts), on ne peut
// pas appeler useUser() — aucun ClerkProvider n'est monté, ça plante. Le
// choix entre les deux implémentations se fait une fois, au chargement du
// module (isClerkConfigured est constant pour la durée de vie de l'app), pas
// à chaque rendu — donc les règles des hooks React restent respectées.
function useFallbackUser() {
  return { isLoaded: true, isSignedIn: false } as const;
}

export const useSafeUser = isClerkConfigured ? useClerkUser : useFallbackUser;
