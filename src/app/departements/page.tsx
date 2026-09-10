import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Départements'
};

export default async function DepartementsPage() {
  const departments = await prisma.department.findMany({ orderBy: { order: 'asc' } });

  return (
    <div>
      <PageHero
        eyebrow="Servir ensemble"
        title="Nos départements"
        subtitle="Chaque département est un espace pour servir, grandir et rejoindre une équipe selon votre appel."
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept) => (
            <Link
              key={dept.id}
              href={`/departements/${dept.slug}`}
              className="rounded-2xl border border-white/10 bg-gn-black-soft p-6 shadow-sm transition-colors hover:border-gn-gold/50"
            >
              <h2 className="font-bold text-gn-cream">{dept.name}</h2>
              <p className="mt-2 line-clamp-3 text-sm text-gn-cream/70">{dept.description}</p>
              {dept.registrationOpen ? (
                <span className="mt-3 inline-block rounded-full bg-gn-gold px-3 py-1 text-xs font-semibold text-gn-black">
                  Inscriptions ouvertes
                </span>
              ) : (
                <span className="mt-3 inline-block text-xs text-gn-cream/50">Inscriptions fermées</span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
