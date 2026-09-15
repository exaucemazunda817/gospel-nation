import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";
import { isClerkConfigured } from "@/lib/clerk-configured";

async function guardAdmin(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const authenticated = await verifySessionToken(token);

    if (!authenticated) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

// TEMP : tant que Clerk n'est pas configuré (voir clerk-configured.ts), on
// n'appelle pas clerkMiddleware — l'appeler sans clés fait planter toutes
// les requêtes. À supprimer une fois les clés Clerk en place.
export const proxy = isClerkConfigured
  ? clerkMiddleware(async (_auth, request) => guardAdmin(request))
  : guardAdmin;

// Le matcher doit couvrir tout le site (pas seulement /admin) pour que Clerk
// puisse peupler le contexte d'authentification sur n'importe quelle page —
// le compte visiteur (plan de lecture) est ouvert partout, contrairement à
// /admin qui garde sa propre gate par mot de passe (session HMAC, sans lien
// avec Clerk).
export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/", "/(api|trpc)(.*)"],
};
