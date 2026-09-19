import { readFile } from 'fs/promises';
import path from 'path';
import { appendBezierCurve, closePath, clip, endPath, moveTo, PDFDocument, popGraphicsState, pushGraphicsState, rgb, StandardFonts } from 'pdf-lib';
import sharp from 'sharp';
import type { User } from '@prisma/client';

// Carte de membre, recto seul, au design des cartes imprimées en octobre 2023.
// Le fond est un modèle vierge tiré d'une vraie carte (public/carte-modele.png,
// 1745 x 1091 px) : logo, cadres, réseaux sociaux et bandeau doré sont donc
// identiques à l'original ; on n'ajoute que la photo et les quatre valeurs.
const TEMPLATE_PATH = path.join(process.cwd(), 'public', 'carte-modele.png');
const TEMPLATE_W = 1745;
const TEMPLATE_H = 1091;

// Format carte de crédit : 85 mm de large, hauteur selon les proportions du modèle.
const PAGE_W = (85 / 25.4) * 72;
const PAGE_H = (PAGE_W * TEMPLATE_H) / TEMPLATE_W;
const K = PAGE_W / TEMPLATE_W;

const PHOTO = { cx: 375, cy: 545, r: 276 };
const TEXT_MAX_X = 1600;
const ROWS = {
  noms: { x: 985, cy: 394 },
  sexe: { x: 988, cy: 496 },
  commune: { x: 1083, cy: 596 },
  tel: { x: 1149, cy: 696 }
};

type CardUser = Pick<User, 'firstName' | 'lastName' | 'phone' | 'sex' | 'commune'>;

function formatPhone(phone: string | null): string {
  if (!phone) return '';
  const trimmed = phone.trim();
  if (trimmed.startsWith('+')) return trimmed;
  const digits = trimmed.replace(/\D/g, '');
  return `+243 ${digits.replace(/^0+/, '')}`;
}

function sexLabel(sex: string | null): string {
  return sex === 'F' ? 'FEMININ' : sex === 'M' ? 'MASCULIN' : '';
}

export async function generateMembershipCardPdf(user: CardUser, photoBytes: Buffer): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([PAGE_W, PAGE_H]);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  const template = await doc.embedPng(await readFile(TEMPLATE_PATH));
  page.drawImage(template, { x: 0, y: 0, width: PAGE_W, height: PAGE_H });

  // Photo recadrée en carré (orientation EXIF respectée, tout format accepté
  // par sharp), puis découpée en cercle.
  const square = await sharp(photoBytes).rotate().resize(800, 800, { fit: 'cover', position: 'attention' }).jpeg({ quality: 85 }).toBuffer();
  const photo = await doc.embedJpg(square);
  const cx = PHOTO.cx * K;
  const cy = (TEMPLATE_H - PHOTO.cy) * K;
  const r = PHOTO.r * K;
  const c = r * 0.5522847498;
  page.pushOperators(
    pushGraphicsState(),
    moveTo(cx + r, cy),
    appendBezierCurve(cx + r, cy + c, cx + c, cy + r, cx, cy + r),
    appendBezierCurve(cx - c, cy + r, cx - r, cy + c, cx - r, cy),
    appendBezierCurve(cx - r, cy - c, cx - c, cy - r, cx, cy - r),
    appendBezierCurve(cx + c, cy - r, cx + r, cy - c, cx + r, cy),
    closePath(),
    clip(),
    endPath()
  );
  page.drawImage(photo, { x: cx - r, y: cy - r, width: 2 * r, height: 2 * r });
  page.pushOperators(popGraphicsState());

  function drawValue(text: string, row: { x: number; cy: number }) {
    if (!text) return;
    let size = 40;
    while (size > 20 && bold.widthOfTextAtSize(text, size) > TEXT_MAX_X - row.x) size -= 1;
    page.drawText(text, {
      x: row.x * K,
      y: (TEMPLATE_H - row.cy - size * 0.36) * K,
      size: size * K,
      font: bold,
      color: rgb(0, 0, 0)
    });
  }

  drawValue(`${user.lastName} ${user.firstName}`.toUpperCase(), ROWS.noms);
  drawValue(sexLabel(user.sex), ROWS.sexe);
  drawValue((user.commune ?? '').toUpperCase(), ROWS.commune);
  drawValue(formatPhone(user.phone), ROWS.tel);

  return doc.save();
}

// Carte déjà imprimée : on l'emballe telle quelle dans un PDF au même format,
// pour que tous les membres reçoivent le même type de fichier.
export async function cardPdfFromImage(jpegBytes: Buffer): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([PAGE_W, PAGE_H]);
  const image = await doc.embedJpg(jpegBytes);
  page.drawImage(image, { x: 0, y: 0, width: PAGE_W, height: PAGE_H });
  return doc.save();
}
