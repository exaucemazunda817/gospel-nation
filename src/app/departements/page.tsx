import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Départements'
};

export default async function DepartementsPage() {
  const departments = await prisma.department.findMany({ orderBy: { order: 'asc' } });

  return (
    <div className="bg-gn-cream-bg">
      <PageHero
        eyebrow="Servir ensemble"
        title="Nos départements"
        subtitle="Chaque département est un espace pour servir, grandir et rejoindre une équipe selon votre appel."
        image="/hero/departements.jpg"
      />

      <div className="bg-gn-cream-bg">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-20">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((dept, index) => (
              <Reveal key={dept.id} delay={index * 0.06}>
                <Link
                  href={`/departements/${dept.slug}`}
                  className="gn-card-lift group flex h-full flex-col overflow-hidden rounded-lg border border-gn-line bg-white"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-gn-black">
                    {dept.imageUrl ? (
                      <Image
                        src={dept.imageUrl}
                        alt={dept.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gn-black-soft to-gn-black">
                        <span className="font-serif text-3xl font-bold text-gn-gold">{dept.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="font-serif text-base font-semibold text-gn-ink">{dept.name}</h2>
                    <p className="mt-2 line-clamp-3 flex-1 text-[13px] leading-relaxed text-gn-ink/60">{dept.description}</p>
                    {dept.registrationOpen ? (
                      <span className="mt-3 inline-block w-fit rounded-full bg-gn-gold px-3 py-1 text-xs font-semibold text-gn-black">
                        Inscriptions ouvertes
                      </span>
                    ) : (
                      <span className="mt-3 inline-block text-xs text-gn-muted">Inscriptions fermées</span>
                    )}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
