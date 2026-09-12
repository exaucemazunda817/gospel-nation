import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { photoMimeType, readPhoto } from '@/lib/photo-storage';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user?.photoUrl) {
    return NextResponse.json({ error: 'Photo introuvable.' }, { status: 404 });
  }

  const bytes = await readPhoto(user.photoUrl);
  return new NextResponse(new Uint8Array(bytes), {
    headers: { 'Content-Type': photoMimeType(user.photoUrl) }
  });
}
