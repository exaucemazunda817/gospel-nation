import type { ExistingCard } from '@prisma/client';
import { prisma } from './prisma';

export function normalizeName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/[^A-Z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Sert à l'import des cartes (les 9 derniers chiffres suffisent à comparer
// +243 8xx…, 08xx… et 8xx…).
export function normalizePhone(value: string): string {
  return value.replace(/\D/g, '').slice(-9);
}

// Tous les mots du nom le plus court doivent se retrouver dans l'autre
// (« Kazimoto Archange » ↔ « KAZIMOTO ALFANI ARCHANGE »), avec au moins deux
// mots en commun pour ne jamais rapprocher deux inconnus sur un seul prénom.
function namesMatch(a: string, b: string): boolean {
  const ta = new Set(normalizeName(a).split(' ').filter(Boolean));
  const tb = new Set(normalizeName(b).split(' ').filter(Boolean));
  const [small, large] = ta.size <= tb.size ? [ta, tb] : [tb, ta];
  if (small.size < 2) return false;
  return [...small].every((token) => large.has(token));
}

// Renvoie une carte existante seulement si UNE SEULE porte ce nom et qu'elle
// n'a pas déjà été remise à un autre membre encore inscrit. Le téléphone n'est
// volontairement pas comparé : un membre change de numéro. Au moindre doute
// (plusieurs cartes au même nom), on renvoie null et une nouvelle carte est
// générée.
export async function findExistingCard(user: {
  id: string;
  firstName: string;
  lastName: string;
}): Promise<ExistingCard | null> {
  const fullName = `${user.firstName} ${user.lastName}`;
  // Sans l'image (≈100 Ko par carte) : on ne la charge que pour la carte retenue.
  const cards = await prisma.existingCard.findMany({
    select: { id: true, fullName: true, claimedByUserId: true }
  });

  const claimerIds = cards.map((card) => card.claimedByUserId).filter((id): id is string => !!id && id !== user.id);
  const activeClaimers = new Set(
    (await prisma.user.findMany({ where: { id: { in: claimerIds } }, select: { id: true } })).map((u) => u.id)
  );

  const matches = cards.filter(
    (card) =>
      namesMatch(fullName, card.fullName) &&
      (card.claimedByUserId === null || card.claimedByUserId === user.id || !activeClaimers.has(card.claimedByUserId))
  );
  return matches.length === 1 ? prisma.existingCard.findUnique({ where: { id: matches[0].id } }) : null;
}
