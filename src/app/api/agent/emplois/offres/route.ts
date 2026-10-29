import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isJobsAgent, offerChanges, parseIngestedOffer } from '@/lib/jobs';

// Réservé à l'agent planifié (jeton JOBS_AGENT_SECRET). Il dépose les offres
// lues dans Notion (publiées d'office : ce sont celles de Mazunda) et dans le
// document Drive (EN ATTENTE : Mazunda les valide dans /admin/emplois).
// Un même sourceRef n'est jamais enregistré deux fois.
export async function POST(request: NextRequest) {
  if (!isJobsAgent(request)) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }
  const list = (body as { offers?: unknown })?.offers;
  if (!Array.isArray(list) || list.length === 0 || list.length > 50) {
    return NextResponse.json({ error: 'Envoyez entre 1 et 50 offres.' }, { status: 400 });
  }

  const results: { sourceRef: string; result: 'created' | 'updated' | 'exists' | 'invalid'; error?: string }[] = [];
  for (const item of list) {
    const parsed = parseIngestedOffer(item);
    if (!parsed.ok) {
      const ref = typeof (item as { sourceRef?: unknown })?.sourceRef === 'string' ? (item as { sourceRef: string }).sourceRef : '?';
      results.push({ sourceRef: ref.slice(0, 200), result: 'invalid', error: parsed.error });
      continue;
    }
    const found = await prisma.jobOffer.findUnique({ where: { sourceRef: parsed.data.sourceRef } });
    if (found) {
      const changes = offerChanges(found, parsed.data, item);
      if (Object.keys(changes).length > 0) {
        await prisma.jobOffer.update({ where: { id: found.id }, data: changes });
        results.push({ sourceRef: parsed.data.sourceRef, result: 'updated' });
      } else {
        results.push({ sourceRef: parsed.data.sourceRef, result: 'exists' });
      }
      continue;
    }
    await prisma.jobOffer.create({
      data: { ...parsed.data, status: parsed.data.source === 'NOTION' ? 'APPROVED' : 'PENDING' }
    });
    results.push({ sourceRef: parsed.data.sourceRef, result: 'created' });
  }
  return NextResponse.json({ results });
}
