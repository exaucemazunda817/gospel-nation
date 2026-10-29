import { isEmailConfigured } from '@/lib/email';

/**
 * L'assistant de candidature n'est proposé aux visiteurs que s'il peut aller
 * au bout : jeton de l'agent posé ET un moyen d'envoyer les documents, soit
 * Resend (e-mails configurés), soit Gmail depuis la routine
 * (JOBS_DELIVERY=gmail, à poser une fois la routine de rédaction créée).
 * Sinon un membre postulerait et n'aurait jamais ses documents.
 * Serveur seulement (lit les variables d'environnement).
 */
export function isJobsAssistantEnabled(): boolean {
  const secret = process.env.JOBS_AGENT_SECRET;
  if (!secret || secret.length < 32) return false;
  return isEmailConfigured() || process.env.JOBS_DELIVERY === 'gmail';
}
