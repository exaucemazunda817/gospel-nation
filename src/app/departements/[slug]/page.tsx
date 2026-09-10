import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHero from '@/components/PageHero';
import { prisma } from '@/lib/prisma';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const dept = await prisma.department.findUnique({ where: { slug } });
  return { title: dept?.name ?? 'Département' };
}

export default async function DepartementDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const dept = await prisma.department.findUnique({ where: { slug } });

  if (!dept) notFound();

  return (
    <div>
      <PageHero eyebrow="Département" title={dept.name} />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="text-gn-cream/80">{dept.description}</p>

        <div className="mt-8 rounded-2xl border border-gn-gold/30 bg-gn-black-soft p-6">
          {dept.registrationOpen ? (
            <>
              <h2 className="font-bold text-gn-gold">Inscriptions ouvertes</h2>
              <p className="mt-2 text-sm text-gn-cream/70">
                L&apos;inscription à ce département se fait depuis votre espace membre.
              </p>
              <Link
                href="/inscription"
                className="mt-4 inline-block rounded-full bg-gn-gold px-6 py-2.5 text-sm font-semibold text-gn-black transition-colors hover:bg-gn-gold-dark"
              >
                Devenir membre pour s&apos;inscrire
              </Link>
            </>
          ) : (
            <p className="text-sm text-gn-cream/60">
              Les inscriptions à ce département ne sont pas ouvertes pour le moment.
            </p>
          )}
        </div>

        <Link href="/departements" className="mt-8 inline-block text-sm text-gn-gold hover:underline">
          ← Retour aux départements
        </Link>
      </div>
    </div>
  );
}
