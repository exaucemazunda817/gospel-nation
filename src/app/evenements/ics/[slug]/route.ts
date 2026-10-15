import { prisma } from '@/lib/prisma';
import { CHURCH_TIME_ZONE, formatEventTime } from '@/lib/dates';

// Fichier .ics d'un événement, pour l'ajouter à son calendrier (téléphone,
// Google Agenda, Outlook). Lecture seule, aucune donnée du visiteur.
const escapeText = (value: string) => value.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
const utcStamp = (date: Date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

// Les lignes d'un .ics ne dépassent pas 75 caractères : on replie les plus longues.
function fold(line: string): string {
  const parts: string[] = [];
  for (let i = 0; i < line.length; i += 70) parts.push(line.slice(i, i + 70));
  return parts.join('\r\n ');
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event || !event.eventDate) return new Response('Événement introuvable', { status: 404 });

  const hasTime = formatEventTime(event.eventDate) !== '';
  const start = hasTime
    ? `DTSTART:${utcStamp(event.eventDate)}`
    : `DTSTART;VALUE=DATE:${event.eventDate
        .toLocaleDateString('fr-CA', { timeZone: CHURCH_TIME_ZONE })
        .replace(/-/g, '')}`;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Gospel Nation//Evenements//FR',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${event.id}@gospel-nation`,
    `DTSTAMP:${utcStamp(new Date())}`,
    start,
    `SUMMARY:${escapeText(event.title.replace(' — ', ' : '))}`,
    ...(event.location ? [`LOCATION:${escapeText(event.location.replace(' — ', ', '))}`] : []),
    ...(event.description ? [`DESCRIPTION:${escapeText(event.description)}`] : []),
    'END:VEVENT',
    'END:VCALENDAR'
  ];

  return new Response(lines.map(fold).join('\r\n') + '\r\n', {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${slug}.ics"`
    }
  });
}
