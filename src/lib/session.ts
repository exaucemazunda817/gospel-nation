// Session admin — un seul mot de passe partagé (ADMIN_PASSWORD), en attendant
// que Clerk gère de vrais comptes nominatifs pour gospel-nation. Même
// mécanisme que sur abg-rdc (HMAC signé, Web Crypto, utilisable depuis
// proxy.ts en edge runtime).

export const SESSION_COOKIE_NAME = "gn_admin_session";
// 24 heures (7 jours avant l'audit du 17/10/2026) : l'espace admin donne accès
// aux coordonnées des membres et aux numéros de dons, une session volée ne doit
// pas rester valable une semaine.
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24;

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET manquant dans les variables d'environnement.");
  }
  return secret;
}

export function adminPassword(): string | undefined {
  return process.env.ADMIN_PASSWORD;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(
    value.length + ((4 - (value.length % 4)) % 4),
    "="
  );
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

// Empreinte du mot de passe, glissée dans le jeton (audit du 17/10/2026) :
// changer le mot de passe rend aussitôt invalides toutes les sessions ouvertes.
// Avec un mot de passe partagé, c'est le seul moyen de fermer l'accès d'une
// personne qui quitte l'équipe ou d'un cookie copié. `scope` vide pour l'admin
// (empreinte inchangée, les sessions ouvertes restent valables), « welcome »
// pour l'équipe d'accueil : un jeton ne peut donc jamais servir pour l'autre rôle.
async function passwordFingerprint(password: string | undefined, scope = ""): Promise<string | null> {
  if (!password) return null;
  const digest = new Uint8Array(
    await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${getSecret()}:${scope}${password}`))
  );
  return toBase64Url(digest).slice(0, 22);
}

async function signToken(role: string, pv: string | null): Promise<string> {
  const payload = JSON.stringify({ role, pv, exp: Date.now() + SESSION_DURATION_MS });
  const payloadBytes = new TextEncoder().encode(payload);
  const key = await hmacKey();
  const signature = new Uint8Array(await crypto.subtle.sign("HMAC", key, payloadBytes));
  return `${toBase64Url(payloadBytes)}.${toBase64Url(signature)}`;
}

async function verifyToken(token: string | undefined, role: string, pv: string | null): Promise<boolean> {
  if (!token) return false;
  const [payloadPart, signaturePart] = token.split(".");
  if (!payloadPart || !signaturePart) return false;

  try {
    const payloadBytes = fromBase64Url(payloadPart);
    const signatureBytes = fromBase64Url(signaturePart);
    const key = await hmacKey();
    const valid = await crypto.subtle.verify("HMAC", key, signatureBytes, payloadBytes);
    if (!valid) return false;

    const payload = JSON.parse(new TextDecoder().decode(payloadBytes)) as {
      role: string;
      pv?: string | null;
      exp: number;
    };
    if (payload.exp <= Date.now()) return false;
    if (!pv || payload.pv !== pv) return false;
    return payload.role === role;
  } catch {
    return false;
  }
}

export async function createSessionToken(): Promise<string> {
  return signToken("ADMIN", await passwordFingerprint(adminPassword()));
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  return verifyToken(token, "ADMIN", await passwordFingerprint(adminPassword()));
}

// Équipe d'accueil (page /accueil) : un mot de passe à part (WELCOME_PASSWORD),
// qui ne donne accès qu'à la feuille d'accueil — ni membres, ni dons, ni messages.
export const WELCOME_COOKIE_NAME = "gn_welcome_session";

export function welcomePassword(): string | undefined {
  return process.env.WELCOME_PASSWORD;
}

export async function createWelcomeToken(): Promise<string> {
  return signToken("WELCOME", await passwordFingerprint(welcomePassword(), "welcome:"));
}

export async function verifyWelcomeToken(token: string | undefined): Promise<boolean> {
  return verifyToken(token, "WELCOME", await passwordFingerprint(welcomePassword(), "welcome:"));
}

export const SESSION_MAX_AGE_SECONDS = SESSION_DURATION_MS / 1000;
