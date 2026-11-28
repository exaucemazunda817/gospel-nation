import { isValidEmail } from '@/lib/email';
import { normalizePhone } from '@/lib/offers';
import { tooLong } from '@/lib/validation';
import { isAllowedVisitDate, isVisitSource, visitDateFromValue } from '@/lib/visits';

export type VisitInput = {
  firstName: string;
  lastName: string;
  phone: string | null;
  email: string | null;
  visitDate: Date;
  companions: number;
  companionNames: string | null;
  childrenCount: number;
  source: string | null;
  prayerRequest: string | null;
};

function str(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function count(value: unknown): number | null {
  const n = typeof value === 'number' ? value : Number(str(value) || 0);
  return Number.isInteger(n) && n >= 0 && n <= 20 ? n : null;
}

// Validation du formulaire public « Je viens pour la première fois » (côté serveur :
// on ne fait jamais confiance au navigateur).
export function parseVisitInput(
  body: Record<string, unknown>,
  now: Date = new Date()
): { ok: true; data: VisitInput } | { ok: false; error: string } {
  const firstName = str(body.firstName);
  const lastName = str(body.lastName);
  const phoneRaw = str(body.phone);
  const email = str(body.email) || null;
  const companionNames = str(body.companionNames) || null;
  const prayerRequest = str(body.prayerRequest) || null;
  const sourceRaw = str(body.source);

  if (!firstName || !lastName) return { ok: false, error: 'Le prénom et le nom sont obligatoires.' };
  if (tooLong(firstName, 60) || tooLong(lastName, 60) || tooLong(phoneRaw, 30) || (email && tooLong(email, 200)) || (companionNames && tooLong(companionNames, 300)) || (prayerRequest && tooLong(prayerRequest, 500))) {
    return { ok: false, error: 'Un des champs est trop long.' };
  }
  if (body.consent !== true) return { ok: false, error: 'Merci de cocher la case d’accord : sans elle nous ne pouvons pas enregistrer votre venue.' };

  let phone: string | null = null;
  if (phoneRaw) {
    phone = normalizePhone(phoneRaw);
    if (!phone) return { ok: false, error: 'Ce numéro de téléphone n’est pas valide.' };
  }
  if (email && !isValidEmail(email)) return { ok: false, error: 'Adresse e-mail invalide.' };

  const visitDate = visitDateFromValue(str(body.visitDate));
  if (!visitDate || !isAllowedVisitDate(visitDate, now)) {
    return { ok: false, error: 'Merci de choisir un des cultes proposés (dimanche, mardi ou mercredi).' };
  }

  const companions = count(body.companions);
  const childrenCount = count(body.childrenCount);
  if (companions === null || childrenCount === null) return { ok: false, error: 'Nombre de personnes invalide.' };
  if (childrenCount > companions) return { ok: false, error: 'Les enfants font partie des personnes qui vous accompagnent.' };

  return {
    ok: true,
    data: {
      firstName,
      lastName,
      phone,
      email,
      visitDate,
      companions,
      companionNames,
      childrenCount,
      source: isVisitSource(sourceRaw) ? sourceRaw : null,
      prayerRequest
    }
  };
}
