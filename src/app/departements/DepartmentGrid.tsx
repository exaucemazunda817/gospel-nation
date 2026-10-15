'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import DepartmentLogo from '@/components/DepartmentLogo';
import { fr } from '@/lib/typo';

export type GridDepartment = {
  slug: string;
  name: string;
  summary: string;
  family: string;
  hasLogo: boolean;
  registrationOpen: boolean;
};

// Grille de tous les départements, filtrable par famille. Le filtre se fait dans
// le navigateur (les 13 départements sont déjà là) : réponse immédiate.
export default function DepartmentGrid({ departments, families }: { departments: GridDepartment[]; families: string[] }) {
  const [family, setFamily] = useState('Tous');
  const visible = family === 'Tous' ? departments : departments.filter((d) => d.family === family);
  const options = ['Tous', ...families];

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par famille">
        {options.map((option) => {
          const count = option === 'Tous' ? departments.length : departments.filter((d) => d.family === option).length;
          const active = option === family;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setFamily(option)}
              aria-pressed={active}
              className={`relative inline-flex min-h-[44px] items-center rounded-full border px-4 text-xs font-semibold transition-colors ${
                active ? 'border-gn-gold text-gn-black' : 'border-gn-line bg-white text-gn-ink hover:border-gn-gold'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="department-family-pill"
                  className="absolute inset-0 rounded-full bg-gn-gold"
                  transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                />
              )}
              <span className="relative">
                {option} <span className="ml-1.5 opacity-70">({count})</span>
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-5 text-sm text-gn-muted-strong" role="status" aria-live="polite">
        {visible.length} département{visible.length > 1 ? 's' : ''}
        {family !== 'Tous' ? ` dans « ${family} »` : ''}
      </p>

      <motion.ul
        key={family}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {visible.map((dept) => (
          <li key={dept.slug}>
            <Link
              href={`/departements/${dept.slug}`}
              className="gn-card-lift gn-spot group flex h-full flex-col overflow-hidden rounded-lg border border-gn-line bg-white"
            >
              <div className="gn-photo-hover relative aspect-[16/10] w-full bg-gn-black">
                {dept.hasLogo ? (
                  <DepartmentLogo slug={dept.slug} name={dept.name} sizes="200px" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gn-black-soft to-gn-black">
                    <span className="font-serif text-3xl font-bold text-gn-gold">{dept.name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-semibold text-gn-gold-line">{dept.family}</p>
                <h3 className="mt-1 font-serif text-lg font-semibold text-gn-ink">{fr(dept.name)}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-gn-ink/70">{fr(dept.summary)}</p>
                {dept.registrationOpen ? (
                  <span className="mt-4 inline-block w-fit rounded-full bg-gn-gold px-3 py-1 text-xs font-semibold text-gn-black">
                    Inscriptions ouvertes
                  </span>
                ) : (
                  <span className="mt-4 text-sm font-semibold text-gn-gold-dark group-hover:underline">En savoir plus →</span>
                )}
              </div>
            </Link>
          </li>
        ))}
      </motion.ul>
    </div>
  );
}
