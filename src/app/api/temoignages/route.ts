import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { allowRequest, TOO_MANY_REQUESTS_MESSAGE } from '@/lib/rate-limit';
import { safeHttpUrl, tooLong } from '@/lib/validation';

function str(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

// Soumission publique (visiteur ou membre connecté, non requis pour cette
// version) — publiée seulement après modération manuelle par un
// administrateur (status PENDING par défaut).
export async function POST(request: NextRequest) {
  if (!(await allowRequest('temoignage', request, 15, 60 * 60 * 1000))) {
    return NextResponse.json({ error: TOO_MANY_REQUESTS_MESSAGE }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const authorName = str(body.authorName);
  const content = str(body.content);
  const videoUrlRaw = str(body.videoUrl);
  const wantsPublished = body.wantsPublished !== false;

  if (!authorName || !content) {
    return NextResponse.json({ error: 'Le nom et le témoignage sont obligatoires.' }, { status: 400 });
  }

  if (tooLong(authorName, 100) || tooLong(content, 5000) || tooLong(videoUrlRaw, 300)) {
    return NextResponse.json({ error: 'Un des champs est trop long.' }, { status: 400 });
  }

  // Le lien vidéo devient un lien cliquable sur le site et dans l'admin : on
  // n'accepte que http/https (voir src/lib/validation.ts).
  const videoUrl = safeHttpUrl(videoUrlRaw);
  if (videoUrlRaw && !videoUrl) {
    return NextResponse.json({ error: 'Le lien de la vidéo est invalide.' }, { status: 400 });
  }

  const testimony = await prisma.testimony.create({
    data: { authorName, content, videoUrl, wantsPublished }
  });

  return NextResponse.json({ id: testimony.id });
}
