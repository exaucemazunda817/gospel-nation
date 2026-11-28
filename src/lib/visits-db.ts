import { prisma } from '@/lib/prisma';
import { todayInKinshasa } from '@/lib/visits';

// Les données d'identité d'une visite sont effacées 180 jours après le jour du
// culte ; on garde seulement les totaux (date, nombre de personnes, provenance,
// statut) pour les statistiques du pasteur. Appelé à l'ouverture des écrans
// d'accueil et de temps en temps à l'envoi du formulaire : pas de tâche planifiée.
export const VISIT_RETENTION_DAYS = 180;

export async function anonymizeOldVisits(now: Date = new Date()): Promise<number> {
  const cutoff = new Date(todayInKinshasa(now).getTime() - VISIT_RETENTION_DAYS * 86400_000);
  try {
    const result = await prisma.visit.updateMany({
      where: { visitDate: { lt: cutoff }, NOT: { firstName: '' } },
      data: {
        firstName: '',
        lastName: '',
        phone: null,
        email: null,
        companionNames: null,
        prayerRequest: null,
        note: null
      }
    });
    return result.count;
  } catch (error) {
    // Ne jamais empêcher d'afficher la page ou d'enregistrer une visite.
    console.error("Effacement des anciennes visites impossible", error instanceof Error ? error.name : error);
    return 0;
  }
}
