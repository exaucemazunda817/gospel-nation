import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, WELCOME_COOKIE_NAME, verifySessionToken, verifyWelcomeToken } from '@/lib/session';

// Vérification de la session admin DANS chaque route et page d'administration
// (audit de sécurité du 17/10/2026). Avant, seul src/proxy.ts protégeait
// /admin et /api/admin, et son filtre ignore toute adresse contenant un point
// (pour laisser passer les fichiers) : une seule barrière, contournable. Le
// proxy reste en place ; ceci est la seconde barrière.

export async function isAdmin(): Promise<boolean> {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

/** À appeler en tête de chaque route /api/admin : `null` si l'accès est permis. */
export async function requireAdmin(): Promise<NextResponse | null> {
  if (await isAdmin()) return null;
  return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 });
}

// Équipe d'accueil : l'administrateur OU quelqu'un qui a le mot de passe de
// l'accueil (WELCOME_PASSWORD). Réservé à la feuille d'accueil (/accueil) et à
// ses routes : à ne JAMAIS utiliser pour une page ou une route /admin.
export async function isWelcomeTeam(): Promise<boolean> {
  if (await isAdmin()) return true;
  const token = (await cookies()).get(WELCOME_COOKIE_NAME)?.value;
  return verifyWelcomeToken(token);
}

export async function requireWelcomeTeam(): Promise<NextResponse | null> {
  if (await isWelcomeTeam()) return null;
  return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 });
}
