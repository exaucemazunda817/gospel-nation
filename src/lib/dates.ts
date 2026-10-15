// Affichage des dates d'événement dans le fuseau de l'église.
//
// Les dates sont enregistrées comme de vrais instants (UTC) : « 10h00 à
// Kinshasa » est stocké 09:00Z. Les serveurs Vercel tournent en UTC, donc sans
// fuseau explicite le site affichait 09:00 au lieu de 10h00. Kinshasa est en
// UTC+1 toute l'année (pas d'heure d'été).
export const CHURCH_TIME_ZONE = 'Africa/Kinshasa';

// « 10:00 » → « 10h00 ». Chaîne vide si l'événement n'a pas d'heure connue
// (enregistré à minuit, heure de Kinshasa).
export function formatEventTime(date: Date): string {
  const time = date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: CHURCH_TIME_ZONE
  });
  return time === '00:00' ? '' : time.replace(':', 'h');
}

// « samedi 26 septembre 2026 à 10h00 » (sans « à … » si l'heure est inconnue).
export function formatEventDateTime(date: Date): string {
  const day = date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: CHURCH_TIME_ZONE
  });
  const time = formatEventTime(date);
  return time ? `${day} à ${time}` : day;
}

// « 26 » et « sept. », pour la pastille de date des listes.
export function formatEventDayNumber(date: Date): string {
  return date.toLocaleDateString('fr-FR', { day: '2-digit', timeZone: CHURCH_TIME_ZONE });
}

export function formatEventMonthShort(date: Date): string {
  return date.toLocaleDateString('fr-FR', { month: 'short', timeZone: CHURCH_TIME_ZONE });
}

const WEEKDAYS_FR = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

// Prochaine occurrence d'un culte hebdomadaire (« Dimanche », « 9h30 – 11h30 »),
// en heure de Kinshasa. Un culte déjà commencé aujourd'hui passe à la semaine
// suivante. Renvoie null si le jour ou l'heure ne se lisent pas.
export function nextWeeklyOccurrence(day: string, time: string, now: Date = new Date()): Date | null {
  const weekday = WEEKDAYS_FR.indexOf(day);
  const match = time.match(/^(\d{1,2})h(\d{2})?/);
  if (weekday < 0 || !match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2] ?? 0);
  // Heure du mur à Kinshasa (UTC+1), lue dans les champs UTC de cette date décalée.
  const wall = new Date(now.getTime() + 3600_000);
  for (let add = 0; add <= 7; add++) {
    const candidate = new Date(wall.getTime() + add * 86400_000);
    if (candidate.getUTCDay() !== weekday) continue;
    const instant = new Date(Date.UTC(candidate.getUTCFullYear(), candidate.getUTCMonth(), candidate.getUTCDate(), hour - 1, minute));
    if (instant > now) return instant;
  }
  return null;
}

// « dimanche 18 octobre », pour annoncer la prochaine occurrence d'un culte.
export function formatEventDayLong(date: Date): string {
  return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: CHURCH_TIME_ZONE });
}
