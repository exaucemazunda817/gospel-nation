import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/session';

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
