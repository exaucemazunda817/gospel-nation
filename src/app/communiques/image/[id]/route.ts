import { prisma } from '@/lib/prisma';
import { readAnnouncementImage } from '@/lib/announcements';

// Affiche d'un communiqué, lisible par tous (c'est fait pour être vue). Les
// identifiants sont aléatoires et la route ne sert que ce qui est enregistré.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const announcement = await prisma.announcement.findUnique({ where: { id }, select: { imageUrl: true } });
  if (!announcement?.imageUrl) return new Response('Introuvable', { status: 404 });
  try {
    const { data, mime } = await readAnnouncementImage(announcement.imageUrl);
    return new Response(new Uint8Array(data), {
      headers: { 'Content-Type': mime, 'Cache-Control': 'public, max-age=3600, s-maxage=86400' }
    });
  } catch {
    return new Response('Introuvable', { status: 404 });
  }
}
