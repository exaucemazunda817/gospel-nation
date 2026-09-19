import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAllowedPhotoType, MAX_PHOTO_SIZE_BYTES, savePhoto } from '@/lib/photo-storage';

const REQUIRED_FIELDS = ['firstName', 'lastName', 'phone', 'email', 'birthDate', 'address', 'commune', 'sex', 'memberSinceYear'] as const;
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

  const sex = str(formData, 'sex');
  if (sex !== 'M' && sex !== 'F') {
    return NextResponse.json({ error: 'Sexe invalide.' }, { status: 400 });
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
    // Plus grand numéro + 1, et non le nombre de membres : après la suppression
    // d'un membre, le compte redonnerait un numéro déjà attribué.
    const last = await tx.user.findFirst({
      where: { memberNumber: { not: null } },
      orderBy: { memberNumber: 'desc' },
      select: { memberNumber: true }
    });
    const nextNumber = (last?.memberNumber ? Number.parseInt(last.memberNumber.slice(-4), 10) : 0) + 1;
    return tx.user.create({
      data: {
        email,
        firstName: str(formData, 'firstName'),
        lastName: str(formData, 'lastName'),
        phone: str(formData, 'phone'),
        address: str(formData, 'address'),
        commune: str(formData, 'commune'),
        sex,
        birthDate,
        memberSinceYear,
        departmentId,
        showBirthdayPublicly: formData.get('showBirthdayPublicly') === 'on',
        status: 'VALIDATED',
        memberNumber: `GN-${CURRENT_YEAR}-${String(nextNumber).padStart(4, '0')}`
      }
    });
  });

  // Créée après coup : la photo est nommée d'après l'id de l'utilisateur, donc
  // on enregistre la photo sous ce nom puis on met à jour la ligne avec le
  // chemin obtenu.
  let photoUrl: string;
  try {
    photoUrl = await savePhoto(user.id, photo);
  } catch (error) {
    // Sinon l'inscription reste créée sans photo, et son e-mail bloque toute
    // nouvelle tentative (« une inscription existe déjà »).
    console.error("Enregistrement de la photo d'inscription impossible", error);
    await prisma.user.delete({ where: { id: user.id } });
    return NextResponse.json(
      { error: "Votre photo n'a pas pu être enregistrée. Merci de réessayer dans un instant." },
      { status: 500 }
    );
  }
  await prisma.user.update({ where: { id: user.id }, data: { photoUrl } });

  return NextResponse.json({ id: user.id, accessToken: user.accessToken, firstName: user.firstName });
}
