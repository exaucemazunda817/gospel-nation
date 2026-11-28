import { NextResponse } from "next/server";
import { WELCOME_COOKIE_NAME } from "@/lib/session";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(WELCOME_COOKIE_NAME);
  return response;
}
