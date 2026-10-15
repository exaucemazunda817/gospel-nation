import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { get, put } from '@vercel/blob';
import { prisma } from '@/lib/prisma';

// Communiqués de la valve (accueil). L'affiche est stockée comme les photos
// d'inscription : Vercel Blob privé en production, dossier local sinon. Elle est
// pourtant publique : /communiques/image/[id] la relit côté serveur pour tout
// visiteur, tant que le communiqué existe.
const LOCAL_DIR = path.join(process.cwd(), 'storage', 'communiques');
const TYPES: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

export const MAX_IMAGE_BYTES = 6 * 1024 * 1024; // 6 Mo
export const TITLE_MAX = 120;
export const BODY_MAX = 2000;

const blobConfigured = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);

export const isAllowedImageType = (mime: string) => mime in TYPES;

export async function saveAnnouncementImage(id: string, file: File): Promise<string> {
  const ext = TYPES[file.type];
  if (!ext) throw new Error('Type de fichier non autorisé.');
  const buffer = Buffer.from(await file.arrayBuffer());
  if (blobConfigured()) {
    const blob = await put(`communiques/${id}.${ext}`, buffer, { access: 'private', addRandomSuffix: true, contentType: file.type });
    return blob.url;
  }
  await mkdir(LOCAL_DIR, { recursive: true });
  const filename = `${id}.${ext}`;
  await writeFile(path.join(LOCAL_DIR, filename), buffer);
  return filename;
}

export async function readAnnouncementImage(ref: string): Promise<{ data: Buffer; mime: string }> {
  const ext = ref.split('?')[0].split('.').pop();
  const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
  if (ref.startsWith('https://')) {
    const result = await get(ref, { access: 'private' });
    if (!result || result.statusCode !== 200) throw new Error('Affiche introuvable.');
    return { data: Buffer.from(await new Response(result.stream).arrayBuffer()), mime };
  }
  return { data: await readFile(path.join(LOCAL_DIR, path.basename(ref))), mime };
}

// Communiqués visibles maintenant : pas expirés, épinglés et urgents d'abord.
export async function getActiveAnnouncements(take = 5) {
  const now = new Date();
  return prisma.announcement.findMany({
    where: { OR: [{ expiresAt: null }, { expiresAt: { gte: now } }] },
    orderBy: [{ pinned: 'desc' }, { publishedAt: 'desc' }],
    take
  });
}
