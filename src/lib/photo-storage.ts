import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { put } from '@vercel/blob';

// Les photos d'inscription sont des données personnelles : elles ne sont
// jamais dans `public/` ni renvoyées telles quelles au navigateur. Seule la
// carte de membre (avec le bon accessToken) et l'espace admin authentifié les
// relisent, côté serveur.
// - En production (BLOB_READ_WRITE_TOKEN défini) : Vercel Blob, le disque de
//   Vercel étant temporaire. L'URL Blob porte un suffixe aléatoire, n'est
//   jamais exposée au client, et on la stocke dans User.photoUrl.
// - Sans jeton (développement local) : dossier storage/photos.
const STORAGE_DIR = path.join(process.cwd(), 'storage', 'photos');

const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
};

export function isAllowedPhotoType(mimeType: string): boolean {
  return mimeType in ALLOWED_TYPES;
}

export const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024; // 5 Mo

export async function savePhoto(userId: string, file: File): Promise<string> {
  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    throw new Error('Type de fichier non autorisé pour la photo.');
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`membres/${userId}.${extension}`, buffer, {
      access: 'public',
      addRandomSuffix: true,
      contentType: file.type
    });
    return blob.url;
  }
  await mkdir(STORAGE_DIR, { recursive: true });
  const filename = `${userId}.${extension}`;
  await writeFile(path.join(STORAGE_DIR, filename), buffer);
  return filename;
}

export async function readPhoto(filename: string): Promise<Buffer> {
  if (filename.startsWith('https://')) {
    const response = await fetch(filename);
    if (!response.ok) throw new Error('Photo introuvable dans le stockage.');
    return Buffer.from(await response.arrayBuffer());
  }
  return readFile(path.join(STORAGE_DIR, filename));
}

export function photoMimeType(filename: string): string {
  const ext = filename.split('?')[0].split('.').pop();
  return ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
}
