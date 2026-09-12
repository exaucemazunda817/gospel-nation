import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAllowedPhotoType, MAX_PHOTO_SIZE_BYTES, savePhoto } from '@/lib/photo-storage';

const REQUIRED_FIELDS = ['firstName', 'lastName', 'phone', 'email', 'birthDate', 'address', 'memberSinceYear'] as const;
const CURRENT_YEAR = new Date().getFullYear();

function str(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  for (const field of REQUIRED_FIELDS) {
    if (!str(formData, field)) {
      return NextResponse.json({ error: `Le champ "${field}" est obligatoire.` }, { status: 400 });
    }
  }

  const email = str(formData, 'email').toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Adresse e-mail invalide.' }, { status: 400 });
  }

  const birthDate = new Date(str(formData, 'birthDate'));
  if (Number.isNaN(birthDate.getTime())) {
    return NextResponse.json({ error: 'Date de naissance invalide.' }, { status: 400 });
  }

  const memberSinceYear = Number.parseInt(str(formData, 'memberSinceYear'), 10);
  if (!Number.isInteger(memberSinceYear) || memberSinceYear < CURRENT_YEAR - 60 || memberSinceYear > CURRENT_YEAR) {
    return NextResponse.json({ error: 'Année invalide pour "membre depuis".' }, { status: 400 });
  }

  const departmentId = str(formData, 'departmentId') || null;
  if (departmentId) {
    const department = await prisma.department.findUnique({ where: { id: departmentId } });
    if (!department) {
      return NextResponse.json({ error: 'Département invalide.' }, { status: 400 });
    }
  }

  const photo = formData.get('photo');
  if (!(photo instanceof File) || photo.size === 0) {
    return NextResponse.json({ error: 'Une photo est requise.' }, { status: 400 });
  }
  if (!isAllowedPhotoType(photo.type)) {
    return NextResponse.json(
      { error: 'Format de photo non supporté (JPG, PNG ou WEBP uniquement).' },
      { status: 400 }
    );
  }
  if (photo.size > MAX_PHOTO_SIZE_BYTES) {
    return NextResponse.json({ error: 'La photo dépasse la taille maximale de 5 Mo.' }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: 'Une inscription existe déjà avec cette adresse e-mail.' },
      { status: 409 }
    );
  }

  // Pas d'étape de validation : le membre reçoit sa carte définitive dès
  // l'inscription, avec un numéro de membre attribué immédiatement.
  const user = await prisma.$transaction(async (tx) => {
    const existingCount = await tx.user.count({ where: { memberNumber: { not: null } } });
    return tx.user.create({
      data: {
        email,
        firstName: str(formData, 'firstName'),
        lastName: str(formData, 'lastName'),
        phone: str(formData, 'phone'),
        address: str(formData, 'address'),
        birthDate,
        memberSinceYear,
        departmentId,
        showBirthdayPublicly: formData.get('showBirthdayPublicly') === 'on',
        status: 'VALIDATED',
        memberNumber: `GN-${CURRENT_YEAR}-${String(existingCount + 1).padStart(4, '0')}`
      }
    });
  });

  // Créée après coup : la photo est nommée d'après l'id de l'utilisateur, donc
  // on enregistre la photo sous ce nom puis on met à jour la ligne avec le
  // chemin obtenu.
  const photoUrl = await savePhoto(user.id, photo);
  await prisma.user.update({ where: { id: user.id }, data: { photoUrl } });

  return NextResponse.json({ id: user.id, accessToken: user.accessToken, firstName: user.firstName });
}
