import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// Limitation de débit par adresse IP, stockée en base : sur Vercel chaque
// requête peut tomber sur une instance différente, un compteur en mémoire ne
// limiterait rien. Même principe que sur e-classe-rdc.
//
// Vercel remplace l'en-tête x-forwarded-for par l'IP réelle du visiteur : la
// première valeur ne peut donc pas être falsifiée par le client.
export function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'inconnue';
}

const CLEANUP_AFTER_MS = 24 * 60 * 60 * 1000;

/**
 * Renvoie true si la requête peut passer, false si la limite est atteinte.
 * En cas de panne de la base (Neon endormie, table absente), on laisse passer :
 * un frein anti-abus ne doit jamais mettre tout le site hors service.
 */
export async function allowRequest(
  bucket: string,
  request: NextRequest,
  max: number,
  windowMs: number,
  options?: { failClosed?: boolean }
): Promise<boolean> {
  const key = `${bucket}:${clientIp(request)}`;
  try {
    // La tentative est enregistrée AVANT d'être comptée : dans l'autre ordre,
    // des requêtes envoyées toutes en même temps comptaient chacune « 0 » et
    // passaient toutes (audit de sécurité du 17/10/2026, même défaut corrigé
    // sur One Love).
    await prisma.rateLimitAttempt.create({ data: { key } });
    const recent = await prisma.rateLimitAttempt.count({
      where: { key, createdAt: { gte: new Date(Date.now() - windowMs) } }
    });
    if (recent > max) return false;
    if (Math.random() < 0.02) {
      await prisma.rateLimitAttempt.deleteMany({
        where: { createdAt: { lt: new Date(Date.now() - CLEANUP_AFTER_MS) } }
      });
    }
    return true;
  } catch (error) {
    // Par défaut on laisse passer (un frein anti-abus ne doit pas couper le
    // site), sauf pour la connexion admin (failClosed) : sans limite, le mot
    // de passe partagé pourrait être deviné par essais successifs.
    console.error('Limitation de débit indisponible', error);
    return !options?.failClosed;
  }
}

export const TOO_MANY_REQUESTS_MESSAGE = 'Trop de tentatives. Merci de réessayer dans quelques minutes.';
