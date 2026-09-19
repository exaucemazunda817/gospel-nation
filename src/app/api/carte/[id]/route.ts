import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { readPhoto } from '@/lib/photo-storage';
import { cardPdfFromImage, generateMembershipCardPdf } from '@/lib/membership-card';
import { findExistingCard } from '@/lib/existing-cards';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = request.nextUrl.searchParams.get('token');

  const user = await prisma.user.findUnique({ where: { id }, include: { department: { select: { name: true } } } });
  if (!user || !token || user.accessToken !== token) {
    return NextResponse.json({ error: 'Carte introuvable.' }, { status: 404 });
  }
  // Carte déjà imprimée en 2023 : remise telle quelle si le nom correspond ;
  // sinon on génère une nouvelle carte au même design.
  const existingCard = await findExistingCard(user);
  let pdfBytes: Uint8Array;
  if (existingCard) {
    if (!existingCard.claimedByUserId) {
      await prisma.existingCard.update({ where: { id: existingCard.id }, data: { claimedByUserId: user.id } });
    }
    pdfBytes = await cardPdfFromImage(Buffer.from(existingCard.image));
  } else {
    if (!user.photoUrl) {
      return NextResponse.json({ error: 'Photo manquante pour cette carte.' }, { status: 404 });
    }
    pdfBytes = await generateMembershipCardPdf(user, await readPhoto(user.photoUrl));
  }

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
