import { createHash, timingSafeEqual as cryptoTimingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  adminPassword,
  createSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/session";
import { allowRequest, TOO_MANY_REQUESTS_MESSAGE } from "@/lib/rate-limit";

// On compare les empreintes SHA-256 (toujours 32 octets) et non les textes :
// l'ancienne version répondait plus vite quand la longueur différait, ce qui
// révélait la longueur du mot de passe (audit du 17/10/2026).
function timingSafeEqual(a: string, b: string): boolean {
  const da = createHash("sha256").update(a).digest();
  const db = createHash("sha256").update(b).digest();
  return cryptoTimingSafeEqual(da, db);
}

export async function POST(request: NextRequest) {
  // 5 essais par tranche de 10 minutes et par adresse IP : le mot de passe
  // admin est unique et partagé, sans cette limite il pourrait être deviné
  // par essais successifs.
  if (!(await allowRequest("admin-login", request, 5, 10 * 60 * 1000, { failClosed: true }))) {
    return NextResponse.json({ error: TOO_MANY_REQUESTS_MESSAGE }, { status: 429 });
  }

  let password: unknown;
  try {
    ({ password } = await request.json());
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const expected = adminPassword();
  if (!expected || typeof password !== "string" || !timingSafeEqual(password, expected)) {
    return NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });
  }

  const token = await createSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
}
