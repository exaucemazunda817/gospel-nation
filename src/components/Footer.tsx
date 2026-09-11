import Image from 'next/image';
import Link from 'next/link';
import { church, linkedAccounts } from '@/lib/content';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-gn-black-soft text-gn-cream">
      <div className="gn-accent-bar" />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Image
            src="/logo-gospel-nation.png"
            alt={`Logo ${church.name}`}
            width={566}
            height={429}
            className="h-12 w-auto object-contain"
          />
          <p className="mt-3 max-w-sm text-sm text-gn-cream/70">{church.tagline}</p>
        </div>

        <div className="text-sm text-gn-cream/80">
          <p className="mb-2 font-semibold text-gn-cream">Adresse</p>
          <p>
            {church.address}
            {church.addressIsPlaceholder && <span className="ml-1 text-gn-gold/70">(à confirmer)</span>}
          </p>
          <p className="mt-3">
            <Link href="/eglise" className="hover:text-gn-gold">
              Voir les horaires des cultes →
            </Link>
          </p>
        </div>

        <div className="text-sm text-gn-cream/80">
          <p className="mb-2 font-semibold text-gn-cream">Nos autres comptes</p>
          <ul className="space-y-1">
            {linkedAccounts.map((account) => (
              <li key={account.handle}>
                <a href={account.url} target="_blank" rel="noopener noreferrer" className="hover:text-gn-gold">
                  {account.name}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-3">
            <Link href="/inscription" className="hover:text-gn-gold">
              Devenir membre
            </Link>
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-gn-cream/50 sm:px-6">
        © {new Date().getFullYear()} {church.fullName} — {church.city}
      </div>
    </footer>
  );
}
