import { googleCalendarUrl } from '@/lib/dates';

// « Ajouter à mon agenda » : Google Agenda s'ouvre directement avec l'événement
// rempli (le plus courant sur Android) ; le fichier .ics reste proposé à côté
// pour l'iPhone et Outlook, qui l'ouvrent dans leur agenda.
export default function AddToCalendar({
  slug,
  title,
  eventDate,
  endDate,
  location,
  description,
  compact = false
}: {
  slug: string;
  title: string;
  eventDate: Date;
  endDate?: Date | null;
  location?: string | null;
  description?: string | null;
  compact?: boolean;
}) {
  return (
    <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
      <a
        href={googleCalendarUrl({ title, eventDate, endDate, location, description })}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-gn-gold-dark hover:underline"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4M12 13v5M9.5 15.5h5" />
        </svg>
        Ajouter à Google Agenda
      </a>
      <a href={`/evenements/ics/${slug}`} download className="inline-flex min-h-[44px] items-center text-xs text-gn-muted-strong underline-offset-2 hover:underline">
        {compact ? 'iPhone / Outlook' : 'ou iPhone / Outlook (.ics)'}
      </a>
    </span>
  );
}
