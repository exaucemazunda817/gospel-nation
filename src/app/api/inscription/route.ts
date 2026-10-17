import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { isAllowedPhotoType, MAX_PHOTO_SIZE_BYTES, savePhoto } from '@/lib/photo-storage';
import { allowRequest, TOO_MANY_REQUESTS_MESSAGE } from '@/lib/rate-limit';
import { tooLong } from '@/lib/validation';

const REQUIRED_FIELDS = ['firstName', 'lastName', 'phone', 'email', 'birthDate', 'address', 'commune', 'sex', 'memberSinceYear'] as const;
const CURRENT_YEAR = new Date().getFullYear();

// Numéro de membre (test de charge du 17/10/2026).
// Quand plusieurs personnes s'inscrivent au même instant, la méthode « plus
// grand numéro + 1 » leur donnait le même numéro : la base refusait le doublon
// (memberNumber est unique) et la personne recevait une erreur au lieu de sa
// carte. Désormais le numéro vient d'une séquence PostgreSQL
// (member_number_seq), que la base distribue sans jamais donner deux fois le
// même. Une inscription abandonnée en route laisse un numéro inutilisé : c'est
// le prix normal d'un compteur sûr.
// Repli si la séquence n'existe pas encore (base pas encore mise à jour) :
// l'ancienne méthode, avec nouvel essai en cas de collision.
// Plus de transaction interactive : elle gardait une connexion pendant
// l'attente et faisait échouer les inscriptions sous charge (délai dépassé).
async function nextMemberSequence(): Promise<number | null> {
  try {
    const rows = await prisma.$queryRaw<{ n: bigint }[]>`SELECT nextval('member_number_seq') AS n`;
    return Number(rows[0].n);
  } catch {
    return null;
  }
}

function formatMemberNumber(n: number): string {
  return `GN-${CURRENT_YEAR}-${String(n).padStart(4, '0')}`;
}

async function createWithMemberNumber(data: Omit<Prisma.UserUncheckedCreateInput, 'memberNumber'>) {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    let n = await nextMemberSequence();
    if (n === null) {
      const last = await prisma.user.findFirst({
        where: { memberNumber: { not: null } },
        orderBy: { memberNumber: 'desc' },
        select: { memberNumber: true }
      });
      n = (last?.memberNumber ? Number.parseInt(last.memberNumber.slice(-4), 10) : 0) + 1;
    }
    try {
      return await prisma.user.create({ data: { ...data, memberNumber: formatMemberNumber(n) } });
    } catch (error) {
      if (!isUniqueViolation(error, 'memberNumber')) throw error;
      // Petite attente aléatoire pour ne pas retomber pile en même temps.
      await new Promise((resolve) => setTimeout(resolve, 20 + Math.random() * 80 * (attempt + 1)));
    }
  }
  throw new Error('Aucun numéro de membre libre après plusieurs essais.');
}

function isUniqueViolation(error: unknown, field: string): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002' &&
    JSON.stringify(error.meta?.target ?? '').includes(field)
  );
}

function str(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

export async function POST(request: NextRequest) {
  // Limite large (40/heure et par IP) : plusieurs membres peuvent s'inscrire
  // ensemble depuis le même réseau, par exemple le wifi ou l'antenne mobile de
  // l'église un dimanche.
  if (!(await allowRequest('inscription', request, 40, 60 * 60 * 1000))) {
    return NextResponse.json({ error: TOO_MANY_REQUESTS_MESSAGE }, { status: 429 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  for (const field of REQUIRED_FIELDS) {
    if (!str(formData, field)) {
      return NextResponse.json({ error: `Le champ "${field}" est obligatoire.` }, { status: 400 });
    }
  }

  for (const field of ['firstName', 'lastName', 'phone', 'commune'] as const) {
    if (tooLong(str(formData, field), 100)) {
      return NextResponse.json({ error: `Le champ "${field}" est trop long.` }, { status: 400 });
    }
  }
  if (tooLong(str(formData, 'address'), 300) || tooLong(str(formData, 'email'), 200)) {
    return NextResponse.json({ error: 'Un des champs est trop long.' }, { status: 400 });
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
  const data = {
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
    status: 'VALIDATED' as const
  };

  let user: Awaited<ReturnType<typeof createWithMemberNumber>>;
  try {
    user = await createWithMemberNumber(data);
  } catch (error) {
    // Deux envois simultanés avec la même adresse : le second tombe ici.
    if (isUniqueViolation(error, 'email')) {
      return NextResponse.json(
        { error: 'Une inscription existe déjà avec cette adresse e-mail.' },
        { status: 409 }
      );
    }
    throw error;
  }

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
