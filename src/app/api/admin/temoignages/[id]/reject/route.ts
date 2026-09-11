import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const testimony = await prisma.testimony.findUnique({ where: { id } });
  if (!testimony) {
    return NextResponse.json({ error: "Témoignage introuvable." }, { status: 404 });
  }

  await prisma.testimony.update({ where: { id }, data: { status: "REJECTED" } });
  return NextResponse.json({ ok: true });
}
