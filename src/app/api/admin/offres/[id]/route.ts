import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Protégée par src/proxy.ts (session admin), comme le reste de /api/admin.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { status } = await request.json();

  if (status !== "APPROVED" && status !== "REJECTED") {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }

  const offer = await prisma.memberOffer.findUnique({ where: { id } });
  if (!offer) {
    return NextResponse.json({ error: "Offre introuvable." }, { status: 404 });
  }

  await prisma.memberOffer.update({ where: { id }, data: { status } });
  return NextResponse.json({ ok: true });
}
