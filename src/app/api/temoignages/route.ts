import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function str(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

// Soumission publique (visiteur ou membre connecté, non requis pour cette
// version) — publiée seulement après modération manuelle par un
// administrateur (status PENDING par défaut).
export async function POST(request: NextRequest) {
  const body = await request.json();

  const authorName = str(body.authorName);
  const content = str(body.content);
  const videoUrl = str(body.videoUrl) || null;

  if (!authorName || !content) {
    return NextResponse.json({ error: 'Le nom et le témoignage sont obligatoires.' }, { status: 400 });
  }

  const testimony = await prisma.testimony.create({
    data: { authorName, content, videoUrl }
  });

  return NextResponse.json({ id: testimony.id });
}
