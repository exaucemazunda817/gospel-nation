import { PrismaClient } from '@prisma/client';
import { departmentSeeds } from '../src/lib/content';

const prisma = new PrismaClient();

async function main() {
  for (const [index, dept] of departmentSeeds.entries()) {
    await prisma.department.upsert({
      where: { slug: dept.slug },
      update: { name: dept.name, description: dept.description, order: index },
      create: { name: dept.name, slug: dept.slug, description: dept.description, order: index }
    });
  }
  console.log(`${departmentSeeds.length} départements synchronisés.`);

  // Coordonnées de don — PLACEHOLDER. Numéros à remplacer par Mazunda avant
  // mise en ligne réelle (jamais de vrai numéro inventé par Claude).
  const donationCount = await prisma.donationMethod.count();
  if (donationCount === 0) {
    await prisma.donationMethod.createMany({
      data: [
        {
          label: 'Airtel Money',
          accountName: '[À COMPLÉTER — nom du titulaire]',
          accountValue: '[À COMPLÉTER — numéro]',
          isActive: false,
          order: 0
        },
        {
          label: 'Orange Money',
          accountName: '[À COMPLÉTER — nom du titulaire]',
          accountValue: '[À COMPLÉTER — numéro]',
          isActive: false,
          order: 1
        }
      ]
    });
    console.log('Méthodes de don placeholder créées (isActive: false, à compléter puis activer).');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
