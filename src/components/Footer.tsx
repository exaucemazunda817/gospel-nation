import Image from 'next/image';
import Link from 'next/link';
import { church } from '@/lib/content';

// Colonnes équilibrées à 6 liens chacune (Bible et Départements ajoutés,
// manquants jusqu'ici) : avant, Communauté comptait 7 liens contre 4 pour
// Explorer, ce qui laissait un grand vide sous "Explorer" dans le pied de
// page. Les liens n'utilisent plus min-h-[44px] : sur une colonne dense de
// texte, ça créait un grand vide entre chaque ligne (44px + gap-3, pour un
// texte de 16px) — repéré visuellement par Mazunda le 19/09. Des liens de
// navigation secondaire en liste peuvent s'appuyer sur l'exception
// d'espacement du WCAG 2.5.8 plutôt que sur la cible pleine de 44px.
const explore = [
  { href: '/', label: 'Accueil' },
  { href: '/eglise', label: 'À propos' },
  { href: '/predications', label: 'Prédications' },
  { href: '/evenements', label: 'Événements' },
  { href: '/departements', label: 'Départements' },
  { href: '/bible', label: 'Bible' }
];

const community = [
  { href: '/inscription', label: 'Devenir membre' },
  { href: '/blog', label: 'Bibliothèque' },
  { href: '/temoignages', label: 'Témoignages' },
  { href: '/services', label: 'Offres et services' },
  { href: '/dons', label: 'Faire un don' },
  { href: '/rendez-vous', label: 'Prendre rendez-vous' }
];

export default function Footer() {
  const schedule = church.schedule[1];

  return (
    <footer className="bg-gn-black pt-16">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-5 sm:px-10 md:grid-cols-3 lg:grid-cols-5">
        <div className="col-span-2 flex flex-col gap-3.5 lg:col-span-1">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo-gospel-nation.png"
              alt={`Logo ${church.name}`}
              width={566}
              height={429}
              sizes="36px"
              className="h-9 w-9 object-contain"
            />
            <span className="font-serif text-base font-bold text-gn-cream">GOSPEL NATION</span>
          </div>
          <p className="max-w-[230px] text-xs leading-relaxed text-gn-cream/60">
            Une famille spirituelle qui accueille, forme et envoie ceux qui cherchent Dieu.
          </p>
          <div className="mt-1 flex gap-2.5">
            <a
              href={church.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gn-gold/40 text-gn-gold transition-colors hover:bg-gn-gold/10"
              aria-label="YouTube"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.6 7.2s-.2-1.5-.8-2.2c-.8-.9-1.7-.9-2.1-1C15.9 3.8 12 3.8 12 3.8s-3.9 0-6.7.2c-.4 0-1.3.1-2.1 1-.6.7-.8 2.2-.8 2.2S2.2 9 2.2 10.7v1.5c0 1.8.2 3.5.2 3.5s.2 1.5.8 2.2c.8.9 1.9.9 2.4 1 1.7.2 7.4.2 7.4.2s3.9 0 6.7-.3c.4 0 1.3-.1 2.1-1 .6-.7.8-2.2.8-2.2s.2-1.8.2-3.5v-1.5c0-1.8-.2-3.5-.2-3.5zM9.9 14.6V8.9l5.4 2.9-5.4 2.8z" />
              </svg>
            </a>
            <a
              href={church.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gn-gold/40 text-gn-gold transition-colors hover:bg-gn-gold/10"
              aria-label="Instagram"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a
              href={church.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gn-gold/40 text-gn-gold transition-colors hover:bg-gn-gold/10"
              aria-label="Facebook"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 8.5V11h2.8l-.4 3H14v7.5h-3V14H8.5v-3H11V8.2C11 5.9 12.4 4.5 14.5 4.5c1 0 2 .1 2 .1V7h-1.1c-1 0-1.4.6-1.4 1.5z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <p className="font-serif text-sm italic font-medium text-gn-gold">Explorer</p>
          {/* Sans marge entre les liens : même interligne (leading-relaxed) que les lignes de texte des colonnes Contact et Cultes. */}
          <div className="flex flex-col">
            {explore.map((l) => (
              <Link key={l.href} href={l.href} className="block text-xs leading-relaxed text-gn-cream/60 hover:text-gn-gold">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <p className="font-serif text-sm italic font-medium text-gn-gold">Communauté</p>
          {/* Sans marge entre les liens : même interligne (leading-relaxed) que les lignes de texte des colonnes Contact et Cultes. */}
          <div className="flex flex-col">
            {community.map((l) => (
              <Link key={l.href} href={l.href} className="block text-xs leading-relaxed text-gn-cream/60 hover:text-gn-gold">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <p className="font-serif text-sm italic font-medium text-gn-gold">Contact</p>
          <p className="text-xs leading-relaxed text-gn-cream/60">
            {church.address}
            {church.addressIsPlaceholder && <span className="ml-1 text-gn-gold/70">(à confirmer)</span>}
          </p>
          <p className="text-xs text-gn-cream/60">{church.city}</p>
          <Link href="/contact" className="inline-flex items-center py-0.5 text-xs text-gn-gold hover:text-gn-gold-light">
            Nous contacter
          </Link>
        </div>

        <div className="flex flex-col gap-2.5">
          <p className="font-serif text-sm italic font-medium text-gn-gold">Cultes</p>
          <p className="text-xs leading-relaxed text-gn-cream/60">
            {schedule.day}, {schedule.time}
            <br />
            {church.address}
          </p>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-2 border-t border-gn-gold/15 px-5 py-5 sm:flex-row sm:justify-between sm:px-10">
        <span className="text-xs text-gn-cream/50">
          © {new Date().getFullYear()} {church.name}. Tous droits réservés.
        </span>
        <span className="flex gap-4 text-xs text-gn-cream/50">
          <Link href="/mentions-legales" className="hover:text-gn-gold">Mentions légales</Link>
          <Link href="/confidentialite" className="hover:text-gn-gold">Confidentialité</Link>
        </span>
        <span className="text-xs tracking-wide text-gn-gold">{church.tagline}</span>
      </div>
    </footer>
  );
}
