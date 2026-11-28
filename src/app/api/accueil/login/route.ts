import { createHash, timingSafeEqual as cryptoTimingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  createWelcomeToken,
  SESSION_MAX_AGE_SECONDS,
  welcomePassword,
  WELCOME_COOKIE_NAME,
} from "@/lib/session";
import { allowRequest, TOO_MANY_REQUESTS_MESSAGE } from "@/lib/rate-limit";

// Comparaison des empreintes SHA-256 (32 octets) : même méthode que la connexion admin.
function timingSafeEqual(a: string, b: string): boolean {
  const da = createHash("sha256").update(a).digest();
  const db = createHash("sha256").update(b).digest();
  return cryptoTimingSafeEqual(da, db);
}

export async function POST(request: NextRequest) {
  if (!(await allowRequest("welcome-login", request, 5, 10 * 60 * 1000, { failClosed: true }))) {
    return NextResponse.json({ error: TOO_MANY_REQUESTS_MESSAGE }, { status: 429 });
  }

  let password: unknown;
  try {
    ({ password } = await request.json());
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  // Sans WELCOME_PASSWORD, l'accès par mot de passe est fermé (l'admin garde
  // accès à la feuille d'accueil avec sa propre session).
  const expected = welcomePassword();
  if (!expected || typeof password !== "string" || !timingSafeEqual(password, expected)) {
    return NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(WELCOME_COOKIE_NAME, await createWelcomeToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
}
