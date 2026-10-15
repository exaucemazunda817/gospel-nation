// Motifs du formulaire de contact. Le motif choisi précède le sujet libre
// (« Demande de prière : … »), pour que l'équipe trie les messages d'un coup
// d'œil dans l'admin. Liste fermée, vérifiée côté serveur.
export const CONTACT_MOTIFS = [
  { key: 'question', label: 'Question' },
  { key: 'priere', label: 'Demande de prière' },
  { key: 'pasteur', label: 'Rendez-vous avec le pasteur' },
  { key: 'membre', label: 'Devenir membre' },
  { key: 'autre', label: 'Autre' }
] as const;

export type ContactMotif = (typeof CONTACT_MOTIFS)[number]['key'];

export function motifLabel(key: unknown): string | null {
  return CONTACT_MOTIFS.find((m) => m.key === key)?.label ?? null;
}

// Événement envoyé par les raccourcis de la page pour choisir un motif sans
// recharger la page (un rechargement rejouerait l'animation d'ouverture).
export const CHOOSE_MOTIF_EVENT = 'gn:contact-motif';
