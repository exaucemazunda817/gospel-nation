// Règles sur l'heure d'un rendez-vous avec le pasteur. Sans dépendance serveur :
// utilisé à la fois par l'API et par l'écran admin (composant client).

// Le pasteur reçoit le mardi à partir de 16h ; chaque personne a son heure
// précise, choisie par l'admin au moment de confirmer.
export const EARLIEST_APPOINTMENT_TIME = '16:00';

// Format « HH:MM », de 16:00 à 23:59. La comparaison de chaînes suffit car les
// heures sont toujours écrites sur deux chiffres.
export function isValidAppointmentTime(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    /^([01]\d|2[0-3]):[0-5]\d$/.test(value) &&
    value >= EARLIEST_APPOINTMENT_TIME
  );
}

// « 16:30 » devient « 16h30 », « 17:00 » devient « 17h ».
export function formatTimeFr(time: string): string {
  const [hours, minutes] = time.split(':');
  return minutes === '00' ? `${Number(hours)}h` : `${Number(hours)}h${minutes}`;
}
