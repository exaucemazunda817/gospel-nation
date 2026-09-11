import { PrismaClient } from '@prisma/client';
import { blogSeeds, departmentSeeds, eventSeeds, memberOfferSeeds } from '../src/lib/content';

const prisma = new PrismaClient();

async function main() {
  for (const [index, dept] of departmentSeeds.entries()) {
    const imageUrl = 'imageUrl' in dept ? dept.imageUrl : null;
    await prisma.department.upsert({
      where: { slug: dept.slug },
      update: { name: dept.name, description: dept.description, order: index, imageUrl },
      create: { name: dept.name, slug: dept.slug, description: dept.description, order: index, imageUrl }
    });
  }

  const currentSlugs = departmentSeeds.map((d) => d.slug);
  const removed = await prisma.department.deleteMany({
    where: { slug: { notIn: currentSlugs } }
  });
  if (removed.count > 0) {
    console.log(`${removed.count} département(s) obsolète(s) supprimé(s) (plus dans content.ts).`);
  }

  console.log(`${departmentSeeds.length} départements synchronisés.`);

  for (const post of blogSeeds) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        category: post.category,
        excerpt: post.excerpt,
        content: post.content,
        publishedAt: post.publishedAt
      },
      create: {
        slug: post.slug,
        title: post.title,
        category: post.category,
        excerpt: post.excerpt,
        content: post.content,
        publishedAt: post.publishedAt
      }
    });
  }
  console.log(`${blogSeeds.length} article(s) Gospel News synchronisé(s).`);

  for (const [index, event] of eventSeeds.entries()) {
    await prisma.event.upsert({
      where: { slug: event.slug },
      update: {
        title: event.title,
        posterImageUrl: event.posterImageUrl,
        description: event.description,
        eventDate: event.eventDate,
        location: event.location,
        order: index
      },
      create: {
        slug: event.slug,
        title: event.title,
        posterImageUrl: event.posterImageUrl,
        description: event.description,
        eventDate: event.eventDate,
        location: event.location,
        order: index
      }
    });
  }
  console.log(`${eventSeeds.length} événement(s) synchronisé(s).`);

  // Services de membres publiés dans la revue Gospel News — chaque
  // contributeur reçoit un profil "seed-*" (clerkUserId provisoire), en
  // attendant que Clerk soit branché et que ces membres aient un vrai compte.
  for (const offer of memberOfferSeeds) {
    const owner = await prisma.user.upsert({
      where: { clerkUserId: offer.ownerClerkUserId },
      update: {},
      create: {
        clerkUserId: offer.ownerClerkUserId,
        email: `${offer.ownerClerkUserId}@placeholder.gospel-nation.local`,
        firstName: offer.ownerFirstName,
        lastName: offer.ownerLastName,
        role: 'MEMBER',
        status: 'VALIDATED'
      }
    });

    const existing = await prisma.memberOffer.findFirst({
      where: { userId: owner.id, title: offer.title }
    });
    if (!existing) {
      await prisma.memberOffer.create({
        data: {
          userId: owner.id,
          title: offer.title,
          category: offer.category,
          description: offer.description,
          contactPhone: offer.contactPhone ?? null,
          contactEmail: 'contactEmail' in offer ? offer.contactEmail : null,
          externalUrl: 'externalUrl' in offer ? offer.externalUrl : null,
          status: 'APPROVED'
        }
      });
    }
  }
  console.log(`${memberOfferSeeds.length} service(s) de membre synchronisé(s).`);

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
