import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { BODY_MAX, MAX_IMAGE_BYTES, TITLE_MAX, isAllowedImageType, saveAnnouncementImage } from '@/lib/announcements';
import { requireAdmin } from '@/lib/admin-auth';

// Protégée par src/proxy.ts (session admin), comme le reste de /api/admin.
export async function POST(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const form = await request.formData();
  const title = String(form.get('title') ?? '').trim();
  const body = String(form.get('body') ?? '').trim();
  const kind = form.get('kind') === 'URGENT' ? 'URGENT' : 'COMMUNIQUE';
  const pinned = form.get('pinned') === 'on';
  const expiresRaw = String(form.get('expiresAt') ?? '').trim();
  const file = form.get('image');
  const image = file instanceof File && file.size > 0 ? file : null;

  if (!title || title.length > TITLE_MAX) {
    return NextResponse.json({ error: `Le titre est obligatoire (${TITLE_MAX} caractères au plus).` }, { status: 400 });
  }
  if (body.length > BODY_MAX) {
    return NextResponse.json({ error: `Le texte est trop long (${BODY_MAX} caractères au plus).` }, { status: 400 });
  }
  if (!body && !image) {
    return NextResponse.json({ error: 'Ajoutez un texte, une affiche, ou les deux.' }, { status: 400 });
  }
  if (image && !isAllowedImageType(image.type)) {
    return NextResponse.json({ error: "L'affiche doit être une image JPG, PNG ou WebP." }, { status: 400 });
  }
  if (image && image.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: "L'affiche est trop lourde (6 Mo au plus)." }, { status: 400 });
  }

  // La date de fin vaut jusqu'à la fin de la journée choisie, heure de Kinshasa (UTC+1).
  let expiresAt: Date | null = null;
  if (expiresRaw) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(expiresRaw)) return NextResponse.json({ error: 'Date de fin invalide.' }, { status: 400 });
    expiresAt = new Date(`${expiresRaw}T23:59:59+01:00`);
    if (Number.isNaN(expiresAt.getTime()) || expiresAt < new Date()) {
      return NextResponse.json({ error: 'La date de fin doit être aujourd’hui ou plus tard.' }, { status: 400 });
    }
  }

  const created = await prisma.announcement.create({ data: { title, body: body || null, kind, pinned, expiresAt } });
  if (image) {
    try {
      const imageUrl = await saveAnnouncementImage(created.id, image);
      await prisma.announcement.update({ where: { id: created.id }, data: { imageUrl } });
    } catch {
      await prisma.announcement.delete({ where: { id: created.id } });
      return NextResponse.json({ error: "L'affiche n'a pas pu être enregistrée. Réessayez." }, { status: 500 });
    }
  }

  revalidatePath('/');
  return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
}
