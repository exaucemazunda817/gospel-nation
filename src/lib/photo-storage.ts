import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { get, put } from '@vercel/blob';

// Les photos d'inscription sont des données personnelles : elles ne sont
// jamais dans `public/` ni renvoyées telles quelles au navigateur. Seule la
// carte de membre (avec le bon accessToken) et l'espace admin authentifié les
// relisent, côté serveur.
// - En production : Vercel Blob, le disque de Vercel étant en lecture seule.
//   Le store est PRIVÉ : même avec l'URL, la photo n'est lisible qu'avec le
//   jeton, donc uniquement côté serveur. L'URL est stockée dans User.photoUrl.
// - Sans store configuré (développement local) : dossier storage/photos.
const STORAGE_DIR = path.join(process.cwd(), 'storage', 'photos');

// Sur Vercel, le store relié au projet ne fournit que BLOB_STORE_ID : le SDK
// s'authentifie alors seul par jeton OIDC, sans BLOB_READ_WRITE_TOKEN. En
// local, c'est le jeton collé dans .env.local qui sert.
function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

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
  if (blobConfigured()) {
    const blob = await put(`membres/${userId}.${extension}`, buffer, {
      access: 'private',
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
    const result = await get(filename, { access: 'private' });
    if (!result || result.statusCode !== 200) throw new Error('Photo introuvable dans le stockage.');
    return Buffer.from(await new Response(result.stream).arrayBuffer());
  }
  return readFile(path.join(STORAGE_DIR, filename));
}

export function photoMimeType(filename: string): string {
  const ext = filename.split('?')[0].split('.').pop();
  return ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
}
