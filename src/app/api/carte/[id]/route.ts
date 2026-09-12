import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { readPhoto } from '@/lib/photo-storage';
import { generateMembershipCardPdf } from '@/lib/membership-card';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = request.nextUrl.searchParams.get('token');

  const user = await prisma.user.findUnique({ where: { id }, include: { department: { select: { name: true } } } });
  if (!user || !token || user.accessToken !== token) {
    return NextResponse.json({ error: 'Carte introuvable.' }, { status: 404 });
  }
  if (!user.photoUrl) {
    return NextResponse.json({ error: 'Photo manquante pour cette carte.' }, { status: 404 });
  }

  const photoBytes = await readPhoto(user.photoUrl);
  const pdfBytes = await generateMembershipCardPdf(user, photoBytes);

  const safeName = `${user.firstName}-${user.lastName}`
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9-]/g, '_');

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="carte-membre-gospel-nation-${safeName}.pdf"`
    }
  });
}
