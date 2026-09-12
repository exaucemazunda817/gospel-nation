import { readFile } from 'fs/promises';
import path from 'path';
import { PDFDocument, PDFFont, PDFPage, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import type { User } from '@prisma/client';
import { photoMimeType } from './photo-storage';

// Reproduit le modèle fourni par Mazunda (carte-membre-gospel-nation.html) :
// une carte recto/verso au format carte de visite (85 x 55 mm), noir/or au
// recto, or dominant au verso avec un bandeau noir en bas.

const LOGO_PATH = path.join(process.cwd(), 'public', 'logo-gospel-nation.png');
const LOGO_ASPECT_RATIO = 566 / 429;

const BLACK = rgb(0x0b / 255, 0x0b / 255, 0x0a / 255);
const BLACK_2 = rgb(0x16 / 255, 0x13 / 255, 0x10 / 255);
const GOLD = rgb(0xcb / 255, 0xac / 255, 0x68 / 255);
const GOLD_LIGHT = rgb(0xe3 / 255, 0xc9 / 255, 0x8a / 255);
const CREAM = rgb(0xf4 / 255, 0xef / 255, 0xe3 / 255);
const MUTED = rgb(0xb9 / 255, 0xb2 / 255, 0xa0 / 255);
const INK_DARK = rgb(0x24 / 255, 0x1d / 255, 0x12 / 255);
const MUTED_DARK = rgb(0x5b / 255, 0x4d / 255, 0x33 / 255);
const WHITE = rgb(1, 1, 1);

const CARD_WIDTH = 400;
const CARD_HEIGHT = 259;
const PAD = 18;
// Format carte de visite standard (85 x 55 mm) — la page PDF finale est
// réduite à cette taille physique juste avant l'export (voir la fin de
// generateMembershipCardPdf).
const CARD_PHYSICAL_WIDTH_MM = 85;
const CARD_PHYSICAL_HEIGHT_MM = 55;

type UserWithDepartment = User & { department?: { name: string } | null };

function wrapToLines(text: string, font: PDFFont, size: number, maxWidth: number, maxLines: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) > maxWidth && current) {
      lines.push(current);
      current = word;
      if (lines.length === maxLines - 1) break;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  if (lines.length === maxLines) {
    const remainingWords = words.slice(lines.join(' ').split(/\s+/).length);
    if (remainingWords.length > 0) {
      let last = lines[maxLines - 1];
      while (font.widthOfTextAtSize(`${last}…`, size) > maxWidth && last.length > 0) {
        last = last.slice(0, -1);
      }
      lines[maxLines - 1] = `${last}…`;
    }
  }
  return lines;
}

// pdf-lib ne propose pas d'option de crénage — on avance nous-mêmes le
// curseur entre chaque caractère pour obtenir l'effet "letter-spacing" du
// modèle (libellés en petites capitales espacées).
function drawSpacedText(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  size: number,
  font: PDFFont,
  color: ReturnType<typeof rgb>,
  spacing: number
): number {
  let cursor = x;
  for (const char of text) {
    page.drawText(char, { x: cursor, y, size, font, color });
    cursor += font.widthOfTextAtSize(char, size) + spacing;
  }
  return cursor - spacing;
}

function spacedTextWidth(text: string, font: PDFFont, size: number, spacing: number): number {
  let width = 0;
  for (const char of text) width += font.widthOfTextAtSize(char, size) + spacing;
  return width - spacing;
}

function drawCornerBrackets(page: PDFPage, color: ReturnType<typeof rgb>, size = 13, inset = 7) {
  const w = CARD_WIDTH;
  const h = CARD_HEIGHT;
  const thickness = 1.5;
  const corners: [number, number, number, number][] = [
    [inset, h - inset, 1, -1], // top-left
    [w - inset, h - inset, -1, -1], // top-right
    [inset, inset, 1, 1], // bottom-left
    [w - inset, inset, -1, 1] // bottom-right
  ];
  for (const [x, y, dx, dy] of corners) {
    page.drawRectangle({ x: dx === 1 ? x : x - size, y: y - thickness / 2, width: size, height: thickness, color });
    page.drawRectangle({ x: x - thickness / 2, y: dy === 1 ? y : y - size, width: thickness, height: size, color });
  }
}

function drawMetaItem(
  page: PDFPage,
  font: PDFFont,
  fontBold: PDFFont,
  x: number,
  y: number,
  label: string,
  value: string,
  labelColor: ReturnType<typeof rgb>,
  valueColor: ReturnType<typeof rgb>
) {
  drawSpacedText(page, label.toUpperCase(), x, y, 6.5, font, labelColor, 0.4);
  page.drawText(value, { x, y: y - 11, size: 10, font: fontBold, color: valueColor });
}

export async function generateMembershipCardPdf(user: UserWithDepartment, photoBytes: Buffer): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontSerifBold = await doc.embedFont(StandardFonts.TimesRomanBold);

  const logoBytes = await readFile(LOGO_PATH);
  const embeddedLogo = await doc.embedPng(logoBytes);

  const mimeType = photoMimeType(user.photoUrl ?? '');
  const embeddedPhoto = mimeType === 'image/png' ? await doc.embedPng(photoBytes) : await doc.embedJpg(photoBytes);

  const fullName = `${user.firstName} ${user.lastName}`.trim();
  const memberNumber = user.memberNumber ?? 'En attente';
  const memberSince = user.memberSinceYear
    ? String(user.memberSinceYear)
    : user.createdAt.toLocaleDateString('fr-FR', { year: 'numeric' });
  const department = user.department?.name ?? '—';
  const address = user.address ?? '—';
  const statut = 'Membre';

  const vCard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${user.lastName};${user.firstName};;;`,
    `FN:${fullName}`,
    'ORG:Gospel Nation',
    user.phone ? `TEL:${user.phone}` : '',
    `EMAIL:${user.email}`,
    'END:VCARD'
  ]
    .filter(Boolean)
    .join('\n');
  const qrDataUrl = await QRCode.toDataURL(vCard, { margin: 0, width: 200 });
  const embeddedQr = await doc.embedPng(Buffer.from(qrDataUrl.split(',')[1], 'base64'));

  // ---------------------------------------------------------------- RECTO
  const front = doc.addPage([CARD_WIDTH, CARD_HEIGHT]);

  front.drawRectangle({ x: 0, y: 0, width: CARD_WIDTH, height: CARD_HEIGHT, color: BLACK_2 });
  front.drawEllipse({
    x: CARD_WIDTH * 0.85,
    y: CARD_HEIGHT * 0.95,
    xScale: 170,
    yScale: 120,
    color: GOLD,
    opacity: 0.1
  });
  front.drawEllipse({
    x: CARD_WIDTH * 0.02,
    y: CARD_HEIGHT * 0.02,
    xScale: 150,
    yScale: 100,
    color: GOLD_LIGHT,
    opacity: 0.07
  });

  // filigrane du logo au centre
  const watermarkW = 190;
  const watermarkH = watermarkW / LOGO_ASPECT_RATIO;
  front.drawImage(embeddedLogo, {
    x: (CARD_WIDTH - watermarkW) / 2,
    y: (CARD_HEIGHT - watermarkH) / 2,
    width: watermarkW,
    height: watermarkH,
    opacity: 0.045
  });

  drawCornerBrackets(front, GOLD, 13, 7);

  // logo + libellé
  const logoH = 30;
  const logoW = logoH * LOGO_ASPECT_RATIO;
  front.drawImage(embeddedLogo, { x: (CARD_WIDTH - logoW) / 2, y: CARD_HEIGHT - PAD - logoH + 4, width: logoW, height: logoH });

  const pillText = 'CARTE DE MEMBRE';
  const pillSize = 7.5;
  const pillSpacing = 1;
  const pillTextWidth = spacedTextWidth(pillText, font, pillSize, pillSpacing);
  const pillW = pillTextWidth + 22;
  const pillH = 15;
  const pillX = (CARD_WIDTH - pillW) / 2;
  const pillY = CARD_HEIGHT - PAD - logoH - 6;
  front.drawRectangle({
    x: pillX,
    y: pillY - pillH,
    width: pillW,
    height: pillH,
    color: GOLD,
    opacity: 0.08,
    borderColor: GOLD,
    borderOpacity: 0.4,
    borderWidth: 1
  });
  drawSpacedText(front, pillText, pillX + (pillW - pillTextWidth) / 2, pillY - pillH + 4.5, pillSize, font, GOLD, pillSpacing);

  // photo + identité
  const photoW = 62;
  const photoH = 78;
  const photoX = PAD;
  const bodyTop = pillY - pillH - 12;
  const photoY = bodyTop - photoH;
  front.drawRectangle({
    x: photoX - 1.5,
    y: photoY - 1.5,
    width: photoW + 3,
    height: photoH + 3,
    color: BLACK,
    borderColor: GOLD,
    borderWidth: 1.5
  });
  front.drawImage(embeddedPhoto, { x: photoX, y: photoY, width: photoW, height: photoH });

  const identityX = photoX + photoW + 12;
  const nameSize = 15;
  front.drawText(fullName || 'Membre', { x: identityX, y: bodyTop - nameSize, size: nameSize, font: fontSerifBold, color: CREAM });
  front.drawRectangle({ x: identityX, y: bodyTop - nameSize - 6, width: 26, height: 2, color: GOLD });

  const metaTop = bodyTop - nameSize - 20;
  const metaColGap = 90;
  drawMetaItem(front, font, fontBold, identityX, metaTop, 'N° Membre', memberNumber, MUTED, CREAM);
  drawMetaItem(front, font, fontBold, identityX + metaColGap, metaTop, 'Statut', statut, MUTED, CREAM);
  drawMetaItem(front, font, fontBold, identityX, metaTop - 22, 'Membre depuis', memberSince, MUTED, CREAM);
  drawMetaItem(front, font, fontBold, identityX + metaColGap, metaTop - 22, 'Département', department, MUTED, CREAM);

  // adresse
  const addressLines = wrapToLines(address, font, 8, CARD_WIDTH - PAD * 2 - 40, 1);
  drawSpacedText(front, 'ADRESSE', PAD, photoY - 16, 6.5, font, MUTED, 0.4);
  front.drawText(addressLines[0] ?? '—', { x: PAD + 42, y: photoY - 16, size: 8, font, color: CREAM });

  // bandeau inférieur (or)
  const footerH = 44;
  front.drawRectangle({ x: 0, y: 0, width: CARD_WIDTH, height: footerH, color: GOLD });
  front.drawRectangle({ x: 0, y: 0, width: CARD_WIDTH, height: footerH, color: WHITE, opacity: 0.08 });

  const qrSize = 34;
  front.drawRectangle({ x: PAD, y: (footerH - qrSize) / 2 - 2, width: qrSize + 4, height: qrSize + 4, color: WHITE, borderColor: INK_DARK, borderOpacity: 0.3, borderWidth: 1 });
  front.drawImage(embeddedQr, { x: PAD + 2, y: (footerH - qrSize) / 2, width: qrSize, height: qrSize });

  const tagline = 'GOSPEL NATION';
  const taglineSize = 9;
  const taglineSpacing = 1;
  const taglineWidth = spacedTextWidth(tagline, fontBold, taglineSize, taglineSpacing);
  drawSpacedText(
    front,
    tagline,
    CARD_WIDTH - PAD - taglineWidth,
    footerH / 2 - taglineSize / 2 + 2,
    taglineSize,
    fontBold,
    INK_DARK,
    taglineSpacing
  );

  drawCornerBrackets(front, BLACK, 13, 7);

  // ---------------------------------------------------------------- VERSO
  const back = doc.addPage([CARD_WIDTH, CARD_HEIGHT]);
  const backFooterH = 40;

  back.drawRectangle({ x: 0, y: 0, width: CARD_WIDTH, height: CARD_HEIGHT, color: GOLD });
  back.drawEllipse({ x: CARD_WIDTH * 0.9, y: CARD_HEIGHT, xScale: 180, yScale: 90, color: WHITE, opacity: 0.18 });

  // filigrane logo en bas à droite
  const backWatermarkW = 150;
  const backWatermarkH = backWatermarkW / LOGO_ASPECT_RATIO;
  back.drawImage(embeddedLogo, {
    x: CARD_WIDTH - backWatermarkW + 18,
    y: backFooterH - 18,
    width: backWatermarkW,
    height: backWatermarkH,
    opacity: 0.06
  });

  drawCornerBrackets(back, INK_DARK, 13, 7);

  let cursorY = CARD_HEIGHT - PAD - 4;
  const headerText = 'INFORMATIONS';
  const headerSize = 11;
  const headerSpacing = 1;
  const headerWidth = spacedTextWidth(headerText, fontSerifBold, headerSize, headerSpacing);
  drawSpacedText(back, headerText, (CARD_WIDTH - headerWidth) / 2, cursorY - headerSize, headerSize, fontSerifBold, INK_DARK, headerSpacing);
  back.drawRectangle({ x: (CARD_WIDTH - 30) / 2, y: cursorY - headerSize - 6, width: 30, height: 1.5, color: INK_DARK });
  cursorY -= headerSize + 22;

  drawMetaItem(back, font, fontBold, PAD, cursorY, 'Membre depuis', memberSince, MUTED_DARK, INK_DARK);
  drawMetaItem(back, font, fontBold, PAD + 160, cursorY, 'Département', department, MUTED_DARK, INK_DARK);
  cursorY -= 30;

  drawSpacedText(back, 'ADRESSE', PAD, cursorY, 6.5, font, MUTED_DARK, 0.4);
  back.drawText(addressLines[0] ?? '—', { x: PAD + 42, y: cursorY, size: 8, font, color: INK_DARK });
  cursorY -= 24;

  const backText = "Cette carte atteste de l'appartenance à l'église Gospel Nation et doit être présentée sur demande.";
  const backTextLines = wrapToLines(backText, font, 7.5, CARD_WIDTH - PAD * 2, 2);
  for (const line of backTextLines) {
    const lineWidth = font.widthOfTextAtSize(line, 7.5);
    back.drawText(line, { x: (CARD_WIDTH - lineWidth) / 2, y: cursorY, size: 7.5, font, color: MUTED_DARK });
    cursorY -= 10;
  }

  // signatures
  const signY = backFooterH + 30;
  const signColW = (CARD_WIDTH - PAD * 2 - 16) / 2;
  const signLabels: [number, string][] = [
    [PAD, 'Signature du membre'],
    [PAD + signColW + 16, 'Signature du responsable']
  ];
  for (const [x, label] of signLabels) {
    back.drawLine({
      start: { x, y: signY },
      end: { x: x + signColW, y: signY },
      thickness: 1,
      color: INK_DARK,
      opacity: 0.35
    });
    const labelWidth = spacedTextWidth(label.toUpperCase(), font, 6.5, 0.3);
    drawSpacedText(back, label.toUpperCase(), x + (signColW - labelWidth) / 2, signY - 10, 6.5, font, MUTED_DARK, 0.3);
  }

  // bandeau noir inférieur
  back.drawRectangle({ x: 0, y: 0, width: CARD_WIDTH, height: backFooterH, color: BLACK_2 });
  const churchHandle = '@gospel.nation';
  back.drawText('N°', { x: PAD, y: backFooterH / 2 - 3, size: 8.5, font, color: MUTED });
  const numWidth = font.widthOfTextAtSize('N° ', 8.5);
  back.drawText(memberNumber, { x: PAD + numWidth, y: backFooterH / 2 - 3, size: 8.5, font: fontBold, color: CREAM });
  const handleWidth = font.widthOfTextAtSize(churchHandle, 8.5);
  back.drawText(churchHandle, { x: CARD_WIDTH - PAD - handleWidth, y: backFooterH / 2 - 3, size: 8.5, font, color: MUTED });

  drawCornerBrackets(back, GOLD, 13, 7);

  // Tout ce qui précède est dessiné sur un plan de travail de 400 x 259
  // "points" pour simplifier les calculs de mise en page — mais un point PDF
  // (1/72 pouce) n'est pas un pixel CSS : à cette taille-là, la carte
  // imprimait beaucoup plus grande qu'une vraie carte de visite. On réduit
  // donc chaque page à sa taille physique réelle (85 x 55 mm) juste avant
  // l'export, sans toucher au code de dessin ci-dessus.
  const MM_TO_PT = 72 / 25.4;
  const scaleX = (CARD_PHYSICAL_WIDTH_MM * MM_TO_PT) / CARD_WIDTH;
  const scaleY = (CARD_PHYSICAL_HEIGHT_MM * MM_TO_PT) / CARD_HEIGHT;
  front.scale(scaleX, scaleY);
  back.scale(scaleX, scaleY);

  return doc.save();
}
