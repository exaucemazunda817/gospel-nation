import { church } from '@/lib/content';
import { nextWeeklyOccurrence } from '@/lib/dates';

// Cultes regroupés par jour, dans l'ordre de la semaine de l'église ; la plage
// « 8h30 – 9h30 » s'écrit « 8h30 à 9h30 » (pas de tiret à l'écran) et chaque
// culte porte sa prochaine date, en heure de Kinshasa.
export function scheduleByDay(now: Date = new Date()) {
  const groups: { day: string; items: { label: string; time: string; next: Date | null }[] }[] = [];
  for (const service of church.schedule) {
    const item = { label: service.label, time: service.time.replace(' – ', ' à '), next: nextWeeklyOccurrence(service.day, service.time, now) };
    const group = groups.find((g) => g.day === service.day);
    if (group) group.items.push(item);
    else groups.push({ day: service.day, items: [item] });
  }
  return groups;
}
