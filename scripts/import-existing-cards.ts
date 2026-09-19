// Importe les cartes déjà imprimées (index OCR + JPG) dans la table
// existing_cards. Usage : npx tsx scripts/import-existing-cards.ts <index.json> <dossier-300ppi>
// Les cartes contiennent des données personnelles : rien n'est écrit dans le dépôt.
import { readFile } from 'fs/promises';
import path from 'path';
import { execFileSync } from 'child_process';
import { PrismaClient } from '@prisma/client';
import { normalizeName, normalizePhone } from '../src/lib/existing-cards';

const prisma = new PrismaClient();

async function main() {
  const [indexPath, dir] = process.argv.slice(2);
  const rows: { carte: number; nom: string; sexe: string | null; commune: string | null; tel: string | null }[] =
    JSON.parse(await readFile(indexPath, 'utf8'));

  for (const row of rows) {
    if (!row.nom || !row.tel) {
      console.log(`carte ${row.carte} ignorée (nom ou téléphone illisible)`);
      continue;
    }
    const source = path.join(dir, `Gospel Nation - Carte ${row.carte}.jpg`);
    const resized = `/tmp/ocr/small-${row.carte}.jpg`;
    execFileSync('sips', ['-Z', '1200', '-s', 'formatOptions', '80', source, '--out', resized], { stdio: 'ignore' });
    const image = await readFile(resized);
    const data = {
      fullName: row.nom,
      normalizedName: normalizeName(row.nom),
      phone: normalizePhone(row.tel),
      sex: row.sexe,
      commune: row.commune,
      image
    };
    // Neon (plan gratuit) se rendort en quelques secondes : on réessaie.
    for (let attempt = 1; ; attempt++) {
      try {
        await prisma.existingCard.upsert({
          where: { carteNumber: row.carte },
          update: data,
          create: { carteNumber: row.carte, ...data }
        });
        console.log(`carte ${row.carte} ok`);
        break;
      } catch (error) {
        if (attempt >= 40) throw error;
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
  }
  console.log('import terminé :', await prisma.existingCard.count(), 'cartes en base');
}

main().finally(() => prisma.$disconnect());
